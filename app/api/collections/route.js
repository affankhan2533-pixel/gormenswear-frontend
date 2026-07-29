import { NextResponse } from "next/server";
import { collectionsService } from "@/lib/collectionsService";

export async function GET() {
  try {
    const collections = collectionsService.getAll();
    return NextResponse.json({ success: true, collections });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = collectionsService.create(body);
    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
