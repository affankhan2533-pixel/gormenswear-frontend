import { NextResponse } from "next/server";
import { ordersService } from "@/lib/ordersService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");

    let orders;
    if (search) {
      orders = ordersService.searchOrders(search);
    } else {
      orders = ordersService.filterOrders({ status, paymentStatus });
    }

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const order = ordersService.createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
