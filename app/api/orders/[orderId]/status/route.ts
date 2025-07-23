import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper to check for valid ObjectId
function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId || !isValidObjectId(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid orderId" }, { status: 400 });
    }

    let status: string;
    try {
      const body = await req.json();
      status = body.status;
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
    }

    if (!["Confirmed", "Canceled"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    // Always return JSON, never HTML
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
