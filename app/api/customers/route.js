import { NextResponse } from "next/server";
import { customersService } from "@/lib/customersService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter");

    let customers;
    if (search) {
      customers = customersService.searchCustomers(search);
    } else if (filter) {
      customers = customersService.filterCustomers(filter);
    } else {
      customers = customersService.getCustomers();
    }

    return NextResponse.json({ success: true, customers });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
