import mongoose from "mongoose";

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI!;

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "nvw",
      bufferCommands: false,
    });
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}
