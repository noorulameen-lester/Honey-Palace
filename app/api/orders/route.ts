import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import Razorpay from "razorpay"
import nodemailer from "nodemailer"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send OTP email
async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "1honeypalace@gmail.com",
      pass: process.env.EMAIL_PASS || "gfjy orji qodb hcyq",
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certs (development only)
    },
  });

  const mailOptions = {
    from: 'Honey Palace <1honeypalace@gmail.com>',
    to,
    subject: "Your Honey Palace Order OTP",
    text: `Your OTP for order confirmation is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

function generateOrderId(latestOrderId?: string) {
  const year = new Date().getFullYear();
  let nextNumber = 1;
  if (latestOrderId) {
    const match = latestOrderId.match(/HP-(\d{4})-(\d+)/);
    if (match && match[1] === year.toString()) {
      nextNumber = parseInt(match[2], 10) + 1;
    }
  }
  return `HP-${year}-${String(nextNumber).padStart(3, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { db } = await connectToDatabase()
    // Find latest orderId for increment
    const latestOrder = await db.collection("orders")
      .find({ orderId: { $regex: /^HP-\d{4}-\d+$/ } })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    const latestOrderId = latestOrder[0]?.orderId;
    const orderId = generateOrderId(latestOrderId);
    let orderData = {
      ...data,
      orderId,
      status: data.paymentMethod === "upi" ? "Pending Payment" : "Processing",
      createdAt: new Date(),
    }

    // Generate OTP and send email
    const otp = generateOTP();
    // Send OTP to both formData.email and data.email if both exist and are different
    const emailsToSend = [];
    if (data.formData?.email) emailsToSend.push(data.formData.email);
    if (data.email && data.email !== data.formData?.email) emailsToSend.push(data.email);
    await Promise.all(emailsToSend.map(email => sendOtpEmail(email, otp)));
    orderData.otp = otp;

    // If UPI, create a Razorpay order
    if (data.paymentMethod === "upi") {
      const payment = await razorpay.orders.create({
        amount: data.total * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      });
      // Store razorpayOrderId in the DB
      orderData = {
        ...orderData,
        razorpayOrderId: payment.id,
      };
      const result = await db.collection("orders").insertOne(orderData);
      return NextResponse.json({
        success: true,
        insertedId: result.insertedId,
        orderId,
        razorpayOrder: payment,
        key_id: process.env.RAZORPAY_KEY_ID,
        otp, // For testing, remove in production
      });
    } else {
      const result = await db.collection("orders").insertOne(orderData)
      return NextResponse.json({ success: true, insertedId: result.insertedId, orderId, otp }) // For testing, remove in production
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json()
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Missing orderId or status" }, { status: 400 })
    }
    const { db } = await connectToDatabase()
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    )
    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Order not found or not updated" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (id) {
      // Try to find by _id (ObjectId), orderId (human readable), or by custom id
      let order = null
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        order = await db.collection("orders").findOne({ _id: new ObjectId(id) })
      }
      if (!order) {
        order = await db.collection("orders").findOne({ id })
      }
      if (!order) {
        order = await db.collection("orders").findOne({ orderId: id })
      }
      if (order) {
        // Normalize the order object for frontend
        const normalizedOrder = {
          id: order.orderId || order._id?.toString() || order.id,
          status: order.status,
          createdAt: order.createdAt,
          formData: order.formData,
          cartItems: order.cartItems,
          paymentMethod: order.paymentMethod,
          razorpayOrderId: order.razorpayOrderId,
          razorpayPaymentId: order.razorpayPaymentId,
          total: order.total,
          isBuyNow: order.isBuyNow,
          notes: order.formData?.notes || order.notes,
        };
        return NextResponse.json({ success: true, order: normalizedOrder })
      } else {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
      }
    }
    // If no id param, return all orders
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 