import { dbConnect } from "@/lib/dbConnect";
import Winery from "@/models/winery.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    const totalWineries = await Winery.countDocuments();

    const totalPages = Math.ceil(totalWineries / limit);

    const wineries = await Winery.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      wineries,
      totalPages,
      currentPage: page,
      totalWineries,
    });
  } catch (error) {
    console.error("Error fetching wineries:", error);
    return NextResponse.json({ error: "Failed to fetch wineries" }, { status: 500 });
  }
}
