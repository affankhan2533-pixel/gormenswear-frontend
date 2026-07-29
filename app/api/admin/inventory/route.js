import { NextResponse } from "next/server";
import { inventoryService } from "@/lib/inventoryService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (productId) {
      const detail = inventoryService.getByProductId(productId);
      if (!detail) {
        return NextResponse.json({ success: false, error: "Inventory item not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, inventory: detail });
    }

    const inventory = inventoryService.getInventory();
    const summary = inventoryService.getSummary();

    return NextResponse.json({
      success: true,
      summary,
      inventory,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, action, delta, newQty, threshold, reason, user } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    let updated;
    if (action === "adjust") {
      updated = inventoryService.adjustStock(productId, Number(delta) || 0, reason, user || "Store Owner");
    } else if (action === "set") {
      updated = inventoryService.setStock(productId, Number(newQty) || 0, reason, user || "Store Owner");
    } else if (action === "setThreshold") {
      updated = inventoryService.setThreshold(productId, Number(threshold) || 5);
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, inventory: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update stock" },
      { status: 500 }
    );
  }
}
