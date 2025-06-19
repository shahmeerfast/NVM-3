import { dbConnect } from "@/lib/dbConnect";
import Winery from "@/models/winery.model";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const { id } = await params;
    const deletedWinery = await Winery.findByIdAndDelete(id);

    if (!deletedWinery) {
      return NextResponse.json({ error: "Winery not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Winery deleted successfully",
      deletedWinery,
    });
  } catch (error) {
    console.error("Error deleting winery:", error);
    return NextResponse.json({ error: "Failed to delete winery" }, { status: 500 });
  }
}
