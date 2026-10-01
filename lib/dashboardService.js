// GOR MENSWEAR — Dashboard Service
// Connects directly to backend API (http://localhost:5000/api/admin/dashboard)

class DashboardService {
  _getApiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.hostname === "localhost" ? "http://localhost:5000" : "";
    }
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  }

  async getDashboardData() {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/admin/dashboard`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("DashboardService fetch error:", err);
    }

    return {
      metrics: {
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        monthlyRevenue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      },
      recentOrders: [],
      lowStockProducts: [],
      topSellingProducts: [],
      recentCustomers: [],
    };
  }
}

export const dashboardService = new DashboardService();
