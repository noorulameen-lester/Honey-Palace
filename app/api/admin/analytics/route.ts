import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const totalOrders = await db.collection("orders").countDocuments();
    const totalRevenueAgg = await db.collection("orders").aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]).toArray();

    const shippedOrders = await db.collection("orders").countDocuments({ status: "Shipped" });
    const pendingOrders = await db.collection("orders").countDocuments({ status: "Pending" });

    return NextResponse.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        shippedOrders,
        pendingOrders
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}