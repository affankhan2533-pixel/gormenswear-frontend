import { NextResponse } from "next/server";
import { getProductById, getRelatedProducts } from "@/lib/db";
import { productService } from "@/lib/productService";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const idOrSlug = params?.id;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (!idOrSlug) {
      return NextResponse.json(
        { success: false, error: "Missing product identifier" },
        { status: 400 }
      );
    }

    let product = null;

    if (isAdmin) {
      // Admin: return any product regardless of status/visibility
      product = await productService.getProduct(idOrSlug);
    } else {
      // Storefront: only return Active + Published products
      product = getProductById(idOrSlug);
      // fallback to productService (still respects visibility filter via db.js)
      if (!product) {
        const p = await productService.getProduct(idOrSlug);
        if (p && p.status !== "Archived" && p.visibility !== "Hidden") {
          product = p;
        }
      }
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const related = isAdmin ? [] : getRelatedProducts(product.id || idOrSlug, 4);

    return NextResponse.json({ success: true, product, related });
  } catch (err) {
    console.error("Product API Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;
    const body = await request.json();
    const updated = await productService.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;
    const ok = await productService.deleteProduct(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
