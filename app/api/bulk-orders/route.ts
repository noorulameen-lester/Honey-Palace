import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Utility: Generate padded numbers
function padNumber(num: number, size: number) {
  return num.toString().padStart(size, "0");
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, phone, quantity, message } = data;

    if (!name || !email || !phone || !quantity) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }
    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json({ success: false, error: "Invalid quantity" }, { status: 400 });
    }
    if (message && message.length > 500) {
      return NextResponse.json({ success: false, error: "Message is too long" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const latestOrder = await db.collection("bulkOrders")
      .find({ id: { $regex: /^BO-\d{4}-\d{3}$/ } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    let nextNumber = 1;
    const year = new Date().getFullYear();
    if (latestOrder.length && latestOrder[0].id) {
      const match = latestOrder[0].id.match(/BO-(\d{4})-(\d{3})/);
      if (match && match[1] === year.toString()) {
        nextNumber = parseInt(match[2], 10) + 1;
      }
    }

    const orderId = `BO-${year}-${padNumber(nextNumber, 3)}`;
    const orderData = { ...data, id: orderId, userEmail: session.user.email, createdAt: new Date() };

    const result = await db.collection("bulkOrders").insertOne(orderData);

    const emailUser = process.env.EMAIL_USER || "";
    const emailPass = process.env.EMAIL_PASS || "";
    if (!emailUser || !emailPass) {
      return NextResponse.json({ success: false, error: "Email configuration missing" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Honey Palace" <${emailUser}>`,
        to: email,
        subject: "Your Bulk Order Confirmation",
        html: `
          <h2>Thank you for your bulk order!</h2>
          <p>Your Order ID: <b>${orderId}</b></p>
          <p>Quantity: ${quantity}</p>
          <p>We will contact you soon.</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json({ success: false, error: "Failed to send confirmation email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insertedId: result.insertedId, orderId });
  } catch (error) {
    console.error("Bulk Order Error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const order = await db.collection("bulkOrders").findOne({ id });
      if (order) return NextResponse.json({ success: true, order });
      return NextResponse.json({ success: false, error: "Bulk order not found" }, { status: 404 });
    }

    const orders = await db.collection("bulkOrders")
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Get Bulk Orders Error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

