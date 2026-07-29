import { NextResponse } from "next/server";
import { categoriesService } from "@/lib/categoriesService";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const category = categoriesService.getById(params.id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, category });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const body = await request.json();
    const updated = categoriesService.update(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const ok = categoriesService.delete(params.id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
