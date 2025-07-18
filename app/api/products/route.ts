import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  benefits?: string[];
  createdAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ✅ Validation
    if (!data.name || !data.price) {
      return NextResponse.json({ success: false, error: "Name and Price are required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const productData: Product = {
      name: data.name,
      price: Number(data.price),
      createdAt: new Date(),
      ...(data.originalPrice && { originalPrice: Number(data.originalPrice) }),
      ...(data.image && { image: data.image }),
      ...(Array.isArray(data.images) && data.images.length > 0 && { images: data.images }),
      ...(Array.isArray(data.features) && { features: data.features }),
      ...(data.specifications && typeof data.specifications === "object" && { specifications: data.specifications }),
      ...(Array.isArray(data.benefits) && { benefits: data.benefits }),
    };

    const result = await db.collection("products").insertOne(productData);

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    // ✅ Optional Pagination
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const products = await db.collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
