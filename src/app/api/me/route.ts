import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getUserIdFromToken } from "@/lib/auth";
import User from "@/models/user.model";
import { Types } from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const userId =await getUserIdFromToken();    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.log({ error });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
