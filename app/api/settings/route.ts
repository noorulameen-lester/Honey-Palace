import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { db } = await connectToDatabase()
    // Upsert (insert or update) the settings document (single document)
    const result = await db.collection("settings").updateOne(
      {},
      { $set: data },
      { upsert: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const settings = await db.collection("settings").findOne({})
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 