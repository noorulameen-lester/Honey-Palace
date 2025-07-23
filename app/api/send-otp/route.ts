import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000);

    const { db } = await connectToDatabase();

    // Store OTP in DB with timestamp
    await db.collection("otp").insertOne({
      email,
      otp,
      createdAt: new Date(),
    });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP Email
    await transporter.sendMail({
      from: `"Honey Palace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Order Confirmation",
      html: `<p>Your OTP is: <b>${otp}</b></p><p>Valid for 5 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
