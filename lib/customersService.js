// GOR MENSWEAR — Customers Service & Data Layer
// Connects 100% to backend REST API (http://localhost:5000/api/customers)

class CustomersService {
  _getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }

  async getCustomers() {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("CustomersService fetch error:", err);
    }
    return [];
  }

  async getCustomerStats() {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers/stats`);
      const json = await res.json();
      if (json.success && json.stats) {
        return json.stats;
      }
    } catch (err) {
      console.warn("CustomersService stats fetch error:", err);
    }
    return {
      totalCustomers: 0,
      activeCustomers: 0,
      returningCustomers: 0,
      newThisMonth: 0,
      lifetimeRevenue: 0,
      averageOrderValue: 0,
      vipThreshold: 1000,
    };
  }

  async getCustomer(id) {
    if (!id) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers/${encodeURIComponent(id)}`);
      const json = await res.json();
      if (json.success && json.customer) {
        return json.customer;
      }
    } catch (err) {
      console.warn("CustomersService detail error:", err);
    }
    return null;
  }

  async searchCustomers(query) {
    if (!query) return this.getCustomers();
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers?search=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("CustomersService search error:", err);
    }
    return [];
  }

  async filterCustomers(filterType = "all") {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers?filter=${encodeURIComponent(filterType)}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn("CustomersService filter error:", err);
    }
    return [];
  }

  async updateCustomer(id, data) {
    if (!id) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update customer");
      }
      return json.customer;
    } catch (err) {
      console.error("CustomersService updateCustomer error:", err);
      throw err;
    }
  }

  async toggleCustomerStatus(id, currentStatus) {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    return this.updateCustomer(id, { status: nextStatus });
  }

  async addCustomerNote(id, content) {
    if (!id || !content) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/customers/${encodeURIComponent(id)}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to add note");
      }
      return json.notes;
    } catch (err) {
      console.error("CustomersService addCustomerNote error:", err);
      throw err;
    }
  }

  async deleteCustomerNote(id, noteId) {
    if (!id || !noteId) return null;
    try {
      const res = await fetch(
        `${this._getApiUrl()}/api/customers/${encodeURIComponent(id)}/notes/${encodeURIComponent(noteId)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete note");
      }
      return json.notes;
    } catch (err) {
      console.error("CustomersService deleteCustomerNote error:", err);
      throw err;
    }
  }
}

export const customersService = new CustomersService();
