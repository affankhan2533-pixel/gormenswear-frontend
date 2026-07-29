// GOR MENSWEAR — Analytics Service
// Connects to backend REST API analytics endpoints

const API_BASE = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class AnalyticsService {
  async getAnalyticsData(period = "30days", startDate = null, endDate = null) {
    try {
      const params = new URLSearchParams({ period });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`${API_BASE()}/api/admin/analytics?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("AnalyticsService fetch error:", err);
    }
    return this._emptyData(period);
  }

  async getDashboard() {
    try {
      const res = await fetch(`${API_BASE()}/api/analytics/dashboard`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn("AnalyticsService dashboard error:", err);
      return null;
    }
  }

  async getRevenue(startDate = null, endDate = null) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const res = await fetch(`${API_BASE()}/api/analytics/revenue?${params.toString()}`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn("AnalyticsService revenue error:", err);
      return null;
    }
  }

  async getProducts() {
    try {
      const res = await fetch(`${API_BASE()}/api/analytics/products`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn("AnalyticsService products error:", err);
      return null;
    }
  }

  async getCustomers() {
    try {
      const res = await fetch(`${API_BASE()}/api/analytics/customers`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.warn("AnalyticsService customers error:", err);
      return null;
    }
  }

  async exportCSV(period = "30days", analyticsData = null) {
    if (typeof window === "undefined") return;
    const data = analyticsData || (await this.getAnalyticsData(period));

    const rows = [
      ["GOR MENSWEAR — ANALYTICS REPORT"],
      ["Generated At", new Date().toISOString()],
      ["Period", period],
      [""],
      ["KPI OVERVIEW"],
      ["Total Revenue", `₹${(data.overview?.totalRevenue || 0).toLocaleString("en-IN")}`],
      ["Revenue This Period", `₹${(data.overview?.revenueThisPeriod || 0).toLocaleString("en-IN")}`],
      ["Total Orders", data.overview?.totalOrders || 0],
      ["Average Order Value", `₹${(data.overview?.averageOrderValue || 0).toLocaleString("en-IN")}`],
      ["Total Customers", data.overview?.totalCustomers || 0],
      ["Returning Customers", data.overview?.returningCustomers || 0],
      ["Total Products", data.overview?.totalProducts || 0],
      ["Low Stock Products", data.overview?.lowStockProducts || 0],
      [""],
      ["TOP SELLING PRODUCTS"],
      ["Product Name", "Units Sold", "Revenue"],
      ...(data.products?.topSellingProducts || []).map((p) => [
        p.name,
        p.totalQuantitySold,
        `₹${(p.totalRevenue || 0).toLocaleString("en-IN")}`,
      ]),
      [""],
      ["REVENUE TIMELINE"],
      ["Date", "Gross Revenue", "Orders"],
      ...(data.revenue?.timeline || []).map((t) => [
        t.date,
        `₹${(t.grossRevenue || 0).toLocaleString("en-IN")}`,
        t.ordersCount,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `gor_analytics_${period}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  _emptyData(period) {
    return {
      period,
      overview: {
        totalRevenue: 0,
        revenueThisPeriod: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalCustomers: 0,
        returningCustomers: 0,
        totalProducts: 0,
        lowStockProducts: 0,
      },
      revenue: { summary: {}, timeline: [] },
      orders: { byStatus: [], byPaymentStatus: [], dailyVolume: [] },
      customers: { summary: {}, acquisitionTrend: [], topSpenders: [] },
      products: { topSellingProducts: [], categoryInventory: [] },
      recentOrders: [],
      monthlyTrend: [],
      statusBreakdown: {},
    };
  }
}

export const analyticsService = new AnalyticsService();
