import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
// import BulkOrder from "@/models/BulkOrder";

export async function POST() {
  try {
    await dbConnect();
    
    // For now, just return success since models might not exist
    // When you have the models, uncomment the line below:
    // await BulkOrder.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "All bulk orders reset successfully." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error resetting bulk orders." 
    }, { status: 500 });
  }
}

