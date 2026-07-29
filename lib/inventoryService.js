// GOR MENSWEAR — Inventory Service
// Connects directly to backend API (http://localhost:5000/api/admin/inventory)

class InventoryService {
  _getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }

  async getInventorySnapshot() {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/admin/inventory`);
      const json = await res.json();
      if (json.success) {
        return json;
      }
    } catch (err) {
      console.warn("InventoryService fetch error:", err);
    }
    return {
      summary: { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 },
      inventory: [],
    };
  }

  async getByProductId(productId) {
    if (!productId) return null;
    try {
      const res = await fetch(`${this._getApiUrl()}/api/admin/inventory?productId=${encodeURIComponent(productId)}`);
      const json = await res.json();
      if (json.success && json.inventory) {
        return json.inventory;
      }
    } catch (err) {
      console.warn("InventoryService item fetch error:", err);
    }
    return null;
  }

  async adjustStock(productId, delta, reason = "Manual Adjustment", user = "Store Owner") {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/admin/inventory/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, delta, reason, user }),
      });
      return await res.json();
    } catch (err) {
      console.warn("InventoryService adjust error:", err);
    }
    return null;
  }

  async setStock(productId, newQty, reason = "Set Stock Level", user = "Store Owner") {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/admin/inventory/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newQty, reason, user }),
      });
      return await res.json();
    } catch (err) {
      console.warn("InventoryService setStock error:", err);
    }
    return null;
  }
}

export const inventoryService = new InventoryService();
