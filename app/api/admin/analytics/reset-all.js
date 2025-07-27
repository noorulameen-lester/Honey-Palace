import dbConnect from "@/utils/dbConnect";
import CustomerAnalytics from "@/models/CustomerAnalytics";
import OrderAnalytics from "@/models/OrderAnalytics";
import ProductAnalytics from "@/models/ProductAnalytics";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    await Promise.all([
      CustomerAnalytics.deleteMany({}),
      OrderAnalytics.deleteMany({}),
      ProductAnalytics.deleteMany({})
    ]);
    return NextResponse.json({ success: true, message: "All analytics reset successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Error resetting analytics." });
  }
}