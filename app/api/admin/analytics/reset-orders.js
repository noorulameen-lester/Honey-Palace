import dbConnect from "@/utils/dbConnect";
import OrderAnalytics from "@/models/OrderAnalytics";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    // Delete all order analytics data
    await OrderAnalytics.deleteMany({});
    return NextResponse.json({ success: true, message: "All order analytics reset successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Error resetting order analytics." });
  }
}