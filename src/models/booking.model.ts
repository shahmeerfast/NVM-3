import mongoose, { Schema, model, models } from "mongoose";

interface WineryBooking {
  wineryId: mongoose.Types.ObjectId;
  datetime: Date;
  numberOfGuests: number;
}

export interface Booking {
  userId: mongoose.Types.ObjectId;
  wineries: WineryBooking[];
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
}

const wineryBookingSchema = new Schema<WineryBooking>(
  {
    wineryId: { type: Schema.Types.ObjectId, required: true, ref: "Winery" },
    datetime: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<Booking>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    wineries: { type: [wineryBookingSchema], required: true },
    specialRequests: { type: String },
    status: { type: String, default: "pending", enum: ["pending", "confirmed", "cancelled"] },
  },
  { timestamps: true }
);

const BookingModel = models.Booking || model<Booking>("Booking", bookingSchema);

export default BookingModel;
