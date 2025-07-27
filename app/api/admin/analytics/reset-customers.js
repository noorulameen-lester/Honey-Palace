import dbConnect from "@/utils/dbConnect";
import CustomerAnalytics from "@/models/CustomerAnalytics";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    // Delete all customer analytics data
    await CustomerAnalytics.deleteMany({});
    return NextResponse.json({ success: true, message: "All customer analytics reset successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Error resetting customer analytics." });
  }
}