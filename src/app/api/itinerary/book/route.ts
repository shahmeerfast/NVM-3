import { getUserIdFromToken } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import BookingModel from "@/models/booking.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await dbConnect();

  const { data } = await req.json();
  const booking = new BookingModel({ userId });
  booking.wineries = data.map((winery: { wineryId: string; guests: number; dateTime: string }) => ({
    wineryId: winery.wineryId,
    datetime: winery.dateTime,
    numberOfGuests: winery.guests,
  }));
  await booking.save();

  return NextResponse.json({ message: "Booking created successfully" }, { status: 201 });
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    await dbConnect();

    const bookings = await BookingModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $unwind: "$wineries" },
      {
        $lookup: {
          from: "wineries",
          let: { wineryId: "$wineries.wineryId" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$wineryId" }] } } }, { $project: { __v: 0 } }],
          as: "wineryDetails",
        },
      },
      { $unwind: { path: "$wineryDetails", preserveNullAndEmptyArrays: true } },
      { $addFields: { "wineries.winery": "$wineryDetails" } },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          specialRequests: { $first: "$specialRequests" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          wineries: { $push: "$wineries" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalBookings = await BookingModel.countDocuments({ userId });
    return NextResponse.json({
      bookings,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
