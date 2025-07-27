import dbConnect from "@/utils/dbConnect";
import ProductAnalytics from "@/models/ProductAnalytics";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    // Delete all product analytics data
    await ProductAnalytics.deleteMany({});
    return NextResponse.json({ success: true, message: "All product analytics reset successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Error resetting product analytics." });
  }
}