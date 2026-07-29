import { NextResponse } from "next/server";
import { customersService } from "@/lib/customersService";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const customer = customersService.getCustomer(params.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const body = await request.json();

    let updated;
    if (body.toggleStatus) {
      updated = customersService.toggleCustomerStatus(params.id);
    } else {
      updated = customersService.updateCustomer(params.id, body);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, customer: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update customer" },
      { status: 500 }
    );
  }
}
