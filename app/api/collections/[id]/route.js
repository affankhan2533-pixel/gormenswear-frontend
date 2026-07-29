import { NextResponse } from "next/server";
import { collectionsService } from "@/lib/collectionsService";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const collection = collectionsService.getById(params.id);
    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, collection });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const body = await request.json();
    const updated = collectionsService.update(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, collection: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const ok = collectionsService.delete(params.id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
