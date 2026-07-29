import { NextResponse } from "next/server";
import { queryProducts, CATEGORIES } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice") || null;
    const maxPrice = searchParams.get("maxPrice") || null;
    const sort = searchParams.get("sort") || "featured";
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 12;

    const result = queryProducts({
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
      categories: CATEGORIES,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
