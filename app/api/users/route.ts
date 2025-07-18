import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { db } = await connectToDatabase()
    // Check if user already exists
    const existing = await db.collection("users").findOne({ email: data.email })
    if (existing) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
      subscribeNewsletter: !!data.subscribeNewsletter,
    }
    const result = await db.collection("users").insertOne(userData)
    return NextResponse.json({ success: true, insertedId: result.insertedId })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, users })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 