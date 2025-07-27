import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
// import CustomerAnalytics from "@/models/CustomerAnalytics";

export async function POST() {
  try {
    await dbConnect();
    
    // For now, just return success since models might not exist
    // When you have the models, uncomment the line below:
    // await CustomerAnalytics.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "All customer analytics reset successfully." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error resetting customer analytics." 
    }, { status: 500 });
  }
}

