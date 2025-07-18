import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

function padNumber(num: number, size: number) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { db } = await connectToDatabase()
    // Find the latest order to determine the next order number
    const latestOrder = await db.collection("bulkOrders")
      .find({ id: { $regex: /^BO-\d{4}-\d+$/ } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
    let nextNumber = 1
    const year = new Date().getFullYear()
    if (latestOrder.length > 0 && latestOrder[0].id) {
      const match = latestOrder[0].id.match(/BO-(\d{4})-(\d+)/)
      if (match && match[1] === year.toString()) {
        nextNumber = parseInt(match[2], 10) + 1
      }
    }
    const orderId = `BO-${year}-${padNumber(nextNumber, 3)}`
    const orderData = { ...data, id: orderId }
    const result = await db.collection("bulkOrders").insertOne(orderData)
    return NextResponse.json({ success: true, insertedId: result.insertedId, orderId })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (id) {
      const order = await db.collection("bulkOrders").findOne({ id })
      if (order) {
        return NextResponse.json({ success: true, order })
      } else {
        return NextResponse.json({ success: false, error: "Bulk order not found" }, { status: 404 })
      }
    }
    const orders = await db.collection("bulkOrders").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 