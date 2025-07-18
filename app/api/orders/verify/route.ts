import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // OTP verification branch
    if (body.otp && body.orderId) {
      const { db } = await connectToDatabase();
      const order = await db.collection("orders").findOne({ _id: new ObjectId(body.orderId) });
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      if (order.otp === body.otp) {
        await db.collection("orders").updateOne(
          { _id: new ObjectId(body.orderId) },
          { $set: { status: "Confirmed" } }
        );
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
      }
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex")

    const { db } = await connectToDatabase()
    if (generated_signature === razorpay_signature) {
      // Payment is successful
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "Paid", razorpayPaymentId: razorpay_payment_id } }
      )
      return NextResponse.json({ success: true })
    } else {
      // Payment failed
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "Payment Failed" } }
      )
      return NextResponse.json({ success: false, error: "Signature verification failed" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 