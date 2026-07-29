import { NextResponse } from "next/server";
import { categoriesService } from "@/lib/categoriesService";

export async function GET() {
  try {
    const categories = categoriesService.getAll();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const category = categoriesService.create(body);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
