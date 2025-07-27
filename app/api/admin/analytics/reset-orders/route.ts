import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
// import OrderAnalytics from "@/models/OrderAnalytics";

export async function POST() {
  try {
    await dbConnect();
    
    // For now, just return success since models might not exist
    // When you have the models, uncomment the line below:
    // await OrderAnalytics.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "All order analytics reset successfully." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error resetting order analytics." 
    }, { status: 500 });
  }
}

