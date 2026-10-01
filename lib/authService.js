// GOR MENSWEAR — Auth Service & Data Layer
// Connects to backend auth API (http://localhost:5000/api/auth)

class AuthService {
  _getApiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.hostname === "localhost" ? "http://localhost:5000" : "";
    }
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  }

  async login(email, password) {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Authentication failed" };
      }

      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("gor_auth_token", data.token);
      }

      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      console.error("AuthService login error:", err);
      return { success: false, error: "Network error during authentication: " + err.message };
    }
  }

  async getCurrentUser() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gor_auth_token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${this._getApiUrl()}/api/auth/me`, {
        headers,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success && data.user) {
        return data.user;
      }
    } catch (err) {
      console.warn("AuthService me error:", err);
    }
    return null;
  }

  async logout() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gor_auth_token") : null;
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${this._getApiUrl()}/api/auth/logout`, {
        method: "POST",
        headers,
        credentials: "include",
      });
    } catch (err) {
      console.warn("AuthService logout error:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("gor_auth_token");
        localStorage.removeItem("gor_user");
      }
    }
  }
}

export const authService = new AuthService();
