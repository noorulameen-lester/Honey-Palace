import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { db } = await connectToDatabase()
    const result = await db.collection("contacts").insertOne(data)
    return NextResponse.json({ success: true, insertedId: result.insertedId })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const contacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, contacts })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 