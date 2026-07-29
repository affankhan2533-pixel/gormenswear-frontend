"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Validate session on mount via API
  useEffect(() => {
    async function checkSession() {
      setAuthLoading(true);
      try {
        const u = await authService.getCurrentUser();
        if (u) {
          setUser(u);
          localStorage.setItem("gor_user", JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem("gor_user");
        }
      } catch (err) {
        console.warn("Session check error:", err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) return { success: false, error: "Email and password are required." };
    const res = await authService.login(email.trim(), password);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem("gor_user", JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || "Authentication failed." };
  };

  const signup = async (name, email, password) => {
    return { success: false, error: "Signup must be initiated by an administrator." };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
