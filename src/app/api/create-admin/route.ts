import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";

export const dynamic = 'force-dynamic';

// WARNING: This endpoint should be removed or secured in production!
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password, name } = await req.json();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin user already exists", 
        adminEmail: existingAdmin.email 
      }, { status: 400 });
    }

    // Create admin user
    const admin = await User.create({
      email,
      password,
      name: name || "Admin User",
      role: "admin"
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin user created successfully",
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 400 });
  }
}

