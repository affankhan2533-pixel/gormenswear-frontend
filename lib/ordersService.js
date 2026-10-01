// GOR MENSWEAR — Orders Service & Data Layer
// Connects 100% to backend REST API (http://localhost:5000/api/orders)

class OrdersService {
  _getApiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.hostname === "localhost" ? "http://localhost:5000" : "";
    }
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  }

  async getOrders() {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("OrdersService fetch error:", err);
    }
    return [];
  }

  async getOrder(idOrOrderNo) {
    if (!idOrOrderNo) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders/${encodeURIComponent(idOrOrderNo)}`);
      const json = await res.json();
      if (json.success && json.order) {
        return json.order;
      }
    } catch (err) {
      console.warn("OrdersService detail fetch error:", err);
    }
    return null;
  }

  async searchOrders(query) {
    if (!query) return this.getOrders();
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders?search=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("OrdersService search error:", err);
    }
    return [];
  }

  async filterOrders(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "all") params.append("status", filters.status);
      if (filters.paymentStatus && filters.paymentStatus !== "all") params.append("paymentStatus", filters.paymentStatus);
      if (filters.search) params.append("search", filters.search);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await fetch(`${this._getApiUrl()}/api/orders?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("OrdersService filter error:", err);
    }
    return [];
  }

  async createOrder(data) {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create order");
      }
      return json.order;
    } catch (err) {
      console.error("OrdersService createOrder error:", err);
      throw err;
    }
  }

  async updateOrderStatus(id, newStatus, note = "") {
    if (!id) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update order status");
      }
      return json.order;
    } catch (err) {
      console.error("OrdersService updateOrderStatus error:", err);
      throw err;
    }
  }

  async updatePaymentStatus(id, newPaymentStatus) {
    if (!id) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update payment status");
      }
      return json.order;
    } catch (err) {
      console.error("OrdersService updatePaymentStatus error:", err);
      throw err;
    }
  }

  async bulkUpdateStatus(orderIds, newStatus) {
    if (!Array.isArray(orderIds) || orderIds.length === 0) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders/bulk-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds, status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed bulk status update");
      }
      return json;
    } catch (err) {
      console.error("OrdersService bulkUpdateStatus error:", err);
      throw err;
    }
  }

  async addOrderNote(id, noteText, author = "Admin") {
    if (!id || !noteText) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/orders/${encodeURIComponent(id)}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: noteText, author }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to add note");
      }
      return json;
    } catch (err) {
      console.error("OrdersService addOrderNote error:", err);
      throw err;
    }
  }
}

export const ordersService = new OrdersService();
