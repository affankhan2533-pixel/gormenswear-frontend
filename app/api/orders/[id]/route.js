import { NextResponse } from "next/server";
import { ordersService } from "@/lib/ordersService";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const order = ordersService.getOrder(params.id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { status, paymentStatus, note } = body;

    let updated = null;
    if (status) {
      updated = ordersService.updateOrderStatus(params.id, status, note);
    }
    if (paymentStatus) {
      updated = ordersService.updatePaymentStatus(params.id, paymentStatus);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
