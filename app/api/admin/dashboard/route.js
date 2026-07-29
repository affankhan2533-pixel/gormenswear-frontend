import { NextResponse } from "next/server";
import { dashboardService } from "@/lib/dashboardService";

export async function GET() {
  try {
    const data = dashboardService.getDashboardData();
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
