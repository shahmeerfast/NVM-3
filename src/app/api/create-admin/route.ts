import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";

export const dynamic = 'force-dynamic';

// CORS handler
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

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
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
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
    }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

