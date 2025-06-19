import { dbConnect } from "@/lib/dbConnect";
import BookingModel from "@/models/booking.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    await dbConnect();

    const bookings = await BookingModel.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "userId", model: "User", select: "name email role createdAt" })
      .populate({ path: "wineries.wineryId", model: "Winery" })
      .skip(skip)
      .limit(limit);
    const totalBookings = await BookingModel.countDocuments();

    return NextResponse.json({
      bookings,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: page,
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching bookings", error: error.message || error }, { status: 500 });
  }
}
