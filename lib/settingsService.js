// GOR MENSWEAR — Settings Service
// Connects to backend REST API settings endpoints

const API_BASE = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class SettingsService {
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE()}/api/settings`);
      const json = await res.json();
      if (json.success && json.settings) {
        return json.settings;
      }
    } catch (err) {
      console.warn("SettingsService getSettings error:", err);
    }
    return this._defaultSettings();
  }

  async updateSettings(data) {
    try {
      const res = await fetch(`${API_BASE()}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update settings");
      return json;
    } catch (err) {
      console.error("SettingsService updateSettings error:", err);
      throw err;
    }
  }

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE()}/api/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update profile");
      return json;
    } catch (err) {
      console.error("SettingsService updateProfile error:", err);
      throw err;
    }
  }

  async changePassword(passwordData) {
    try {
      const res = await fetch(`${API_BASE()}/api/settings/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to change password");
      return json;
    } catch (err) {
      console.error("SettingsService changePassword error:", err);
      throw err;
    }
  }

  async triggerBackup() {
    try {
      const res = await fetch(`${API_BASE()}/api/settings/backup`, {
        method: "POST",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Backup failed");
      return json;
    } catch (err) {
      console.error("SettingsService triggerBackup error:", err);
      throw err;
    }
  }

  async exportSettings(currentSettings) {
    if (typeof window === "undefined") return;
    const settings = currentSettings || (await this.getSettings());
    const jsonStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gor_store_settings_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async importSettings(settingsJsonObj) {
    try {
      const res = await fetch(`${API_BASE()}/api/settings/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsJsonObj),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Import failed");
      return json;
    } catch (err) {
      console.error("SettingsService importSettings error:", err);
      throw err;
    }
  }

  _defaultSettings() {
    return {
      store: {
        storeName: "GOR MENSWEAR",
        brandName: "GOR LONDON",
        email: "concierge@gormenswear.com",
        phone: "+44 20 7946 0912",
        address: "28 Savile Row, Mayfair, London W1S 3PR, UK",
        gstNumber: "GB 987 6543 21",
        currency: "INR",
        timezone: "Asia/Kolkata",
        storeLogo: "",
        favicon: "",
      },
      notifications: {
        newOrderAlerts: true,
        lowStockAlerts: true,
        customerRegAlerts: true,
        emailNotifications: true,
      },
      shipping: {
        flatCharge: 500,
        freeThreshold: 15000,
        methods: [
          { id: "std", name: "Standard Luxury Delivery", estimatedDays: "3-5 Business Days", price: 500, enabled: true },
          { id: "exp", name: "Express Courier", estimatedDays: "1-2 Business Days", price: 1200, enabled: true },
          { id: "vip", name: "Mayfair White Glove Concierge", estimatedDays: "Same Day (London/Metros)", price: 2500, enabled: true },
        ],
      },
      taxes: {
        taxPercentage: 18,
        taxName: "GST / VAT",
        taxEnabled: true,
      },
      backup: {
        lastBackupTime: new Date().toISOString(),
        backupStatus: "Successful",
      },
    };
  }
}

export const settingsService = new SettingsService();
