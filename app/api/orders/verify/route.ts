import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { db } = await connectToDatabase();

    // 🟢 Insert order as pending payment
    const result = await db.collection("orders").insertOne({
      ...data,
      status: "Pending Payment", // 👈 change from "Confirmed" to "Pending Payment"
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Order created, awaiting payment confirmation",
      orderId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({}).toArray();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
