import { getUserIdFromToken } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import BookingModel from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ booking_id: string }> }) {
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { booking_id: bookingId } = await params;

  if (!bookingId) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  await dbConnect();
  const booking = await BookingModel.findOne({ _id: bookingId, userId });

  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  booking.status = "cancelled";
  await booking.save();

  return NextResponse.json({ message: "Booking updated successfully", booking }, { status: 200 });
}
