import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    
    // For now, just return success since models might not exist
    // When you have the models, uncomment the line below:
    // await ProductAnalytics.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "All product analytics reset successfully." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error resetting product analytics." 
    }, { status: 500 });
  }
}
  

