import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    const { db } = await connectToDatabase();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
    }

    // Find OTP record
    const record = await db.collection("otp").findOne({ email, otp: Number(otp) });
    if (!record) {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }

    // Check expiry (5 minutes)
    const isExpired = new Date().getTime() - record.createdAt.getTime() > 5 * 60 * 1000;
    if (isExpired) {
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
    }

    // Delete OTP after verification
    await db.collection("otp").deleteOne({ _id: record._id });

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
