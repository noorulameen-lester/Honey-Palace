import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { db } = await connectToDatabase();
    data.createdAt = new Date();
    // Optionally, validate data here
    const result = await db.collection("coupons").insertOne(data);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const coupons = await db.collection("coupons").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "Missing coupon id" }, { status: 400 });
    const { db } = await connectToDatabase();
    const result = await db.collection("coupons").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...update } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "Missing coupon id" }, { status: 400 });
    const { db } = await connectToDatabase();
    const result = await db.collection("coupons").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Coupon not found or not updated" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 