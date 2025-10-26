import { getUserIdFromToken } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import BookingModel from "@/models/booking.model";
import UserModel from "@/models/user.model"; // Assuming you have a UserModel
import WineryModel from "@/models/winery.model"; // Assuming you have a WineryModel
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmails } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const { data } = await req.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ message: "Invalid booking data" }, { status: 400 });
    }

    const user = await UserModel.findById(userId).select("name email");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Determine payment method from the first winery (assuming all wineries in itinerary have same payment method)
    const firstWinery = data[0];
    const paymentMethod = firstWinery?.payment_method || "pay_winery";
    
    const booking = new BookingModel({ userId, payment_method: paymentMethod });
    booking.wineries = data.map((winery) => ({
      wineryId: winery.wineryId,
      datetime: winery.dateTime,
      tasting: winery.tasting,
      tour: winery.tour,
      foodPairings: winery.foodPairings,
    }));
    await booking.save();
    for (const winery of data) {
      const wineryDetails = await WineryModel.findById(winery.wineryId).select("name contact_info.email");
      if (wineryDetails) {
        await sendBookingEmails(booking.toJSON(), {
          wineryId: winery.wineryId,
          datetime: winery.dateTime,
          wineryName: wineryDetails.name,
          wineryEmail: wineryDetails.contact_info?.email,
        }, user, "pending");
      } else {
        console.warn(`Winery not found for ID: ${winery.wineryId}`);
      }
    }

    return NextResponse.json({ message: "Booking created successfully", booking: booking.toJSON() }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
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
          payment_method: { $first: "$payment_method" }, // Include payment method in the response
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