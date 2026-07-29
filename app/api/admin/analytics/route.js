import { NextResponse } from "next/server";
import { analyticsService } from "@/lib/analyticsService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30days";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const data = analyticsService.getAnalyticsData(period, startDate, endDate);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
