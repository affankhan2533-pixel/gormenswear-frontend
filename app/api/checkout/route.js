import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer = {}, cart = {}, paymentMethod = "credit-card" } = body;

    if (!customer.email || !customer.firstName || !customer.address) {
      return NextResponse.json(
        { success: false, error: "Missing required customer details" },
        { status: 400 }
      );
    }

    const orderId = `GOR-${Math.floor(100000 + Math.random() * 900000)}`;
    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    const order = {
      orderId,
      status: "Confirmed",
      date: new Date().toISOString(),
      estimatedDelivery,
      customer,
      cart,
      paymentMethod,
    };

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Checkout failed" },
      { status: 500 }
    );
  }
}
