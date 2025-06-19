import { dbConnect } from "@/lib/dbConnect";
import Winery from "@/models/winery.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const winery = await Winery.create(data);
    return NextResponse.json({ message: "sucess", winery }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const wineries = await Winery.find().lean();
    return NextResponse.json({ message: "sucess", wineries }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
