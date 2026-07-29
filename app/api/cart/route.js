import { NextResponse } from "next/server";
import { getProductById } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { items = [], promoCode = "" } = body;

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = getProductById(item.id);
      if (product) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        validatedItems.push({
          ...product,
          selectedSize: item.selectedSize || product.sizes[0],
          selectedColor: item.selectedColor || product.colors[0],
          quantity: item.quantity,
          itemTotal,
        });
      }
    }

    let discount = 0;
    if (promoCode.toUpperCase() === "GORVIP" || promoCode.toUpperCase() === "ATELIER15") {
      discount = Math.round(subtotal * 0.15);
    }

    const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 45;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.08);
    const total = Math.max(0, taxableAmount + shipping + tax);

    return NextResponse.json({
      success: true,
      cart: {
        items: validatedItems,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        promoApplied: discount > 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cart calculation error" },
      { status: 500 }
    );
  }
}
