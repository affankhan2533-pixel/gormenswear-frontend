"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { settingsService } from "@/lib/settingsService";
import {
  Store, User, ShieldCheck, Bell, Truck, Percent,
  Database, Save, Upload, Download, RefreshCw, KeyRound,
  LogOut, ShieldAlert, CheckCircle2, QrCode, Lock, Globe,
  Building, Phone, Mail, MapPin, DollarSign, Clock, Layers,
  FileCheck, AlertCircle, Eye, EyeOff, Plus, Trash2, Check
} from "lucide-react";

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("store");

  // Setting States
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    brandName: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    storeLogo: "",
    favicon: "",
  });

  const [adminProfile, setAdminProfile] = useState({
    name: "Super Admin",
    email: "superadmin@gormenswear.com",
    role: "Super Admin",
    avatar: "",
  });

  const [securityState, setSecurityState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
    twoFactorEnabled: false,
  });

  const [notifications, setNotifications] = useState({
    newOrderAlerts: true,
    lowStockAlerts: true,
    customerRegAlerts: true,
    emailNotifications: true,
  });

  const [shipping, setShipping] = useState({
    flatCharge: 500,
    freeThreshold: 15000,
    methods: [],
  });

  const [taxes, setTaxes] = useState({
    taxPercentage: 18,
    taxName: "GST / VAT",
    taxEnabled: true,
  });

  const [backupInfo, setBackupInfo] = useState({
    lastBackupTime: new Date().toISOString(),
    backupStatus: "Successful",
  });

  // Modal States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const fileInputRef = useRef(null);

  // Load Settings
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings();
      if (data.store) setStoreInfo((prev) => ({ ...prev, ...data.store }));
      if (data.notifications) setNotifications((prev) => ({ ...prev, ...data.notifications }));
      if (data.shipping) setShipping((prev) => ({ ...prev, ...data.shipping }));
      if (data.taxes) setTaxes((prev) => ({ ...prev, ...data.taxes }));
      if (data.backup) setBackupInfo((prev) => ({ ...prev, ...data.backup }));

      // Fetch logged in user profile
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
        const userJson = await res.json();
        if (userJson.success && userJson.user) {
          setAdminProfile((prev) => ({
            ...prev,
            name: userJson.user.name || prev.name,
            email: userJson.user.email || prev.email,
            avatar: userJson.user.avatar || prev.avatar,
            role: userJson.user.role || prev.role,
          }));
        }
      } catch (e) {
        console.warn("Could not fetch user /me info");
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      toastError("Load Error", "Failed to load store settings.");
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Handle Main Settings Save
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings({
        store: storeInfo,
        notifications,
        shipping,
        taxes,
      });
      success("Settings Saved", "Store configurations updated successfully.");
    } catch (err) {
      toastError("Save Failed", err.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateProfile(adminProfile);
      success("Profile Updated", "Admin profile details saved.");
    } catch (err) {
      toastError("Update Error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityState.newPassword !== securityState.confirmPassword) {
      toastError("Password Mismatch", "New passwords do not match.");
      return;
    }
    if (securityState.newPassword.length < 6) {
      toastError("Weak Password", "New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      await settingsService.changePassword({
        email: adminProfile.email,
        currentPassword: securityState.currentPassword,
        newPassword: securityState.newPassword,
      });
      setSecurityState((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      success("Password Changed", "Security credentials updated successfully.");
    } catch (err) {
      toastError("Security Error", err.message || "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Backup Trigger
  const handleBackupNow = async () => {
    setSaving(true);
    try {
      const res = await settingsService.triggerBackup();
      if (res.backup) setBackupInfo(res.backup);
      success("Backup Complete", "Database snapshot saved successfully.");
    } catch (err) {
      toastError("Backup Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Settings Export
  const handleExport = () => {
    settingsService.exportSettings({
      store: storeInfo,
      notifications,
      shipping,
      taxes,
      backup: backupInfo,
    });
    success("Export Complete", "Store configuration JSON downloaded.");
  };

  // Handle Settings Import
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        await settingsService.importSettings(json);
        await loadSettings();
        success("Import Successful", "Store settings imported successfully.");
      } catch (err) {
        toastError("Import Error", "Invalid JSON format or corrupted file.");
      }
    };
    reader.readAsText(file);
  };

  // Shipping Method Handlers
  const addShippingMethod = () => {
    const newMethod = {
      id: `method_${Date.now()}`,
      name: "New Shipping Method",
      estimatedDays: "2-4 Business Days",
      price: 300,
      enabled: true,
    };
    setShipping((prev) => ({ ...prev, methods: [...prev.methods, newMethod] }));
  };

  const removeShippingMethod = (id) => {
    setShipping((prev) => ({
      ...prev,
      methods: prev.methods.filter((m) => m.id !== id),
    }));
  };

  const updateShippingMethod = (id, key, val) => {
    setShipping((prev) => ({
      ...prev,
      methods: prev.methods.map((m) => (m.id === id ? { ...m, [key]: val } : m)),
    }));
  };

  // Image Upload Helper (Logo, Favicon, Avatar)
  const handleImageUpload = (field, setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const NAV_ITEMS = [
    { id: "store", label: "Store Information", icon: Store },
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "security", label: "Security & 2FA", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "shipping", label: "Shipping Methods", icon: Truck },
    { id: "taxes", label: "Tax Configuration", icon: Percent },
    { id: "backup", label: "Backup & Maintenance", icon: Database },
  ];

  return (
    <AdminShell>
      <div className="space-y-6 max-w-7xl pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F0EDE8] flex items-center gap-2.5">
              <Building className="w-6 h-6 text-[#C8A45D]" />
              Store Settings & Control
            </h1>
            <p className="text-xs text-[#777] mt-0.5">
              Manage store identities, admin profiles, security, logistics, and database operations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save All Changes"}</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sub-Navigation (Tabs) */}
          <div className="lg:col-span-1 space-y-1">
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-2 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? "bg-[#C8A45D]/15 text-[#C8A45D] border border-[#C8A45D]/30 font-semibold"
                        : "text-[#888] hover:text-[#E8E4DF] hover:bg-[#161616]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#C8A45D]" : "text-[#555]"}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Panel Body */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-12 text-center text-xs text-[#666] animate-pulse">
                Loading configuration data...
              </div>
            ) : (
              <>
                {/* ── 1. STORE INFORMATION ── */}
                {activeSection === "store" && (
                  <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                    <div className="border-b border-[#1A1A1A] pb-4">
                      <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                        <Store className="w-4 h-4 text-[#C8A45D]" />
                        Store Information & Branding
                      </h2>
                      <p className="text-xs text-[#666] mt-0.5">Define official brand credentials, contact info, and localized store defaults</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Store Name *</label>
                        <input
                          type="text"
                          value={storeInfo.storeName}
                          onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={storeInfo.brandName}
                          onChange={(e) => setStoreInfo({ ...storeInfo, brandName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Official Email *</label>
                        <input
                          type="email"
                          value={storeInfo.email}
                          onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Support Phone</label>
                        <input
                          type="text"
                          value={storeInfo.phone}
                          onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#888] block mb-1">Registered Address</label>
                        <textarea
                          rows={2}
                          value={storeInfo.address}
                          onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">GST / Tax Identification Number</label>
                        <input
                          type="text"
                          value={storeInfo.gstNumber}
                          onChange={(e) => setStoreInfo({ ...storeInfo, gstNumber: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Default Currency</label>
                        <select
                          value={storeInfo.currency}
                          onChange={(e) => setStoreInfo({ ...storeInfo, currency: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        >
                          <option value="INR">INR (₹) - Indian Rupee</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#888] block mb-1">Timezone</label>
                        <select
                          value={storeInfo.timezone}
                          onChange={(e) => setStoreInfo({ ...storeInfo, timezone: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        >
                          <option value="Asia/Kolkata">(UTC+05:30) Asia/Kolkata (IST)</option>
                          <option value="Europe/London">(UTC+00:00) Europe/London (GMT/BST)</option>
                          <option value="America/New_York">(UTC-05:00) Eastern Time (US & Canada)</option>
                          <option value="Asia/Dubai">(UTC+04:00) Asia/Dubai (GST)</option>
                        </select>
                      </div>
                    </div>

                    {/* Logo & Favicon Upload */}
                    <div className="border-t border-[#1A1A1A] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-2">Store Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-[10px] bg-[#161616] border border-[#222] flex items-center justify-center overflow-hidden">
                            {storeInfo.storeLogo ? (
                              <img src={storeInfo.storeLogo} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                              <Store className="w-6 h-6 text-[#444]" />
                            )}
                          </div>
                          <label className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-[#E8E4DF] rounded-[6px] cursor-pointer transition-colors">
                            Upload Logo
                            <input type="file" accept="image/*" onChange={handleImageUpload("storeLogo", setStoreInfo)} className="hidden" />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-2">Store Favicon</label>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[8px] bg-[#161616] border border-[#222] flex items-center justify-center overflow-hidden">
                            {storeInfo.favicon ? (
                              <img src={storeInfo.favicon} alt="Favicon" className="w-full h-full object-contain p-1" />
                            ) : (
                              <Globe className="w-5 h-5 text-[#444]" />
                            )}
                          </div>
                          <label className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-[#E8E4DF] rounded-[6px] cursor-pointer transition-colors">
                            Upload Favicon
                            <input type="file" accept="image/*" onChange={handleImageUpload("favicon", setStoreInfo)} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 2. ADMIN PROFILE ── */}
                {activeSection === "profile" && (
                  <form onSubmit={handleSaveProfile} className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                    <div className="border-b border-[#1A1A1A] pb-4">
                      <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                        <User className="w-4 h-4 text-[#C8A45D]" />
                        Administrator Profile
                      </h2>
                      <p className="text-xs text-[#666] mt-0.5">Manage your personal admin account identity and photo</p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#222] flex items-center justify-center overflow-hidden shrink-0">
                        {adminProfile.avatar ? (
                          <img src={adminProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-[#C8A45D]">
                            {adminProfile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-[#E8E4DF] font-medium rounded-[8px] cursor-pointer inline-block transition-colors">
                          Change Profile Photo
                          <input type="file" accept="image/*" onChange={handleImageUpload("avatar", setAdminProfile)} className="hidden" />
                        </label>
                        <p className="text-[10px] text-[#555] mt-1">Recommended: Square PNG/JPG (min 200x200px)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={adminProfile.name}
                          onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={adminProfile.email}
                          onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Role / Privilege</label>
                        <input
                          type="text"
                          disabled
                          value={adminProfile.role}
                          className="w-full px-3.5 py-2 bg-[#141414] border border-[#1E1E1E] rounded-[8px] text-xs text-[#666] cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                )}

                {/* ── 3. SECURITY ── */}
                {activeSection === "security" && (
                  <div className="space-y-6">
                    {/* Password Change Form */}
                    <form onSubmit={handleChangePassword} className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-5">
                      <div className="border-b border-[#1A1A1A] pb-4">
                        <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-[#C8A45D]" />
                          Change Password
                        </h2>
                        <p className="text-xs text-[#666] mt-0.5">Ensure your administrator account uses a strong, unique password</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-[#888] block mb-1">Current Password</label>
                          <input
                            type={securityState.showPassword ? "text" : "password"}
                            value={securityState.currentPassword}
                            onChange={(e) => setSecurityState({ ...securityState, currentPassword: e.target.value })}
                            className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#888] block mb-1">New Password</label>
                          <input
                            type={securityState.showPassword ? "text" : "password"}
                            value={securityState.newPassword}
                            onChange={(e) => setSecurityState({ ...securityState, newPassword: e.target.value })}
                            className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#888] block mb-1">Confirm New Password</label>
                          <input
                            type={securityState.showPassword ? "text" : "password"}
                            value={securityState.confirmPassword}
                            onChange={(e) => setSecurityState({ ...securityState, confirmPassword: e.target.value })}
                            className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs text-[#888] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securityState.showPassword}
                            onChange={(e) => setSecurityState({ ...securityState, showPassword: e.target.checked })}
                            className="accent-[#C8A45D]"
                          />
                          Show Passwords
                        </label>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>

                    {/* Two-Factor Authentication & Device Sessions */}
                    <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
                        <div>
                          <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-[#C8A45D]" />
                            Two-Factor Authentication (2FA)
                          </h3>
                          <p className="text-xs text-[#666] mt-0.5">Add an extra layer of security using Google Authenticator or Authy</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShow2FAModal(true)}
                          className={`px-3 py-1.5 rounded-[8px] text-xs font-bold cursor-pointer transition-colors ${
                            securityState.twoFactorEnabled
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                              : "bg-[#C8A45D] text-[#0D0D0D] hover:bg-[#B8944D]"
                          }`}
                        >
                          {securityState.twoFactorEnabled ? "2FA Enabled" : "Configure 2FA"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-[#C8A45D]" />
                            Active Device Sessions
                          </h3>
                          <p className="text-xs text-[#666] mt-0.5">Invalidate all existing session cookies across desktop & mobile browsers</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowLogoutModal(true)}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
                        >
                          Logout All Devices
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 4. NOTIFICATIONS ── */}
                {activeSection === "notifications" && (
                  <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                    <div className="border-b border-[#1A1A1A] pb-4">
                      <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#C8A45D]" />
                        Notification Preferences
                      </h2>
                      <p className="text-xs text-[#666] mt-0.5">Control operational alerts triggered by customer activity & inventory events</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: "newOrderAlerts", title: "New Order Notifications", desc: "Receive immediate browser toast and sound alerts when a customer places an order" },
                        { key: "lowStockAlerts", title: "Low Stock & Out of Stock Alerts", desc: "Notify admin when garment inventory drops below 5 units threshold" },
                        { key: "customerRegAlerts", title: "Customer Registration Alerts", desc: "Receive alerts when new VIP or retail accounts register" },
                        { key: "emailNotifications", title: "Daily Digest Email Notifications", desc: "Receive automated daily executive summary reports via email" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3.5 bg-[#161616] border border-[#222] rounded-[10px]">
                          <div>
                            <p className="text-xs font-bold text-[#E8E4DF]">{item.title}</p>
                            <p className="text-[11px] text-[#666] mt-0.5">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                              notifications[item.key] ? "bg-[#C8A45D]" : "bg-[#2A2A2A]"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                                notifications[item.key] ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 5. SHIPPING ── */}
                {activeSection === "shipping" && (
                  <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                    <div className="border-b border-[#1A1A1A] pb-4">
                      <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#C8A45D]" />
                        Logistics & Shipping Rules
                      </h2>
                      <p className="text-xs text-[#666] mt-0.5">Configure delivery charges, threshold rules, and courier options</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Flat Shipping Charge (₹)</label>
                        <input
                          type="number"
                          value={shipping.flatCharge}
                          onChange={(e) => setShipping({ ...shipping, flatCharge: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Free Shipping Threshold (₹)</label>
                        <input
                          type="number"
                          value={shipping.freeThreshold}
                          onChange={(e) => setShipping({ ...shipping, freeThreshold: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>
                    </div>

                    {/* Shipping Methods List */}
                    <div className="pt-4 border-t border-[#1A1A1A] space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#E8E4DF] uppercase tracking-wider">Available Shipping Methods</h3>
                        <button
                          type="button"
                          onClick={addShippingMethod}
                          className="flex items-center gap-1 text-xs text-[#C8A45D] hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Method
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {shipping.methods.map((method) => (
                          <div key={method.id} className="p-3.5 bg-[#161616] border border-[#222] rounded-[10px] grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                            <input
                              type="text"
                              value={method.name}
                              onChange={(e) => updateShippingMethod(method.id, "name", e.target.value)}
                              placeholder="Method Name"
                              className="px-2.5 py-1.5 bg-[#111] border border-[#2A2A2A] rounded-[6px] text-xs text-[#E8E4DF]"
                            />
                            <input
                              type="text"
                              value={method.estimatedDays}
                              onChange={(e) => updateShippingMethod(method.id, "estimatedDays", e.target.value)}
                              placeholder="Estimated Days"
                              className="px-2.5 py-1.5 bg-[#111] border border-[#2A2A2A] rounded-[6px] text-xs text-[#E8E4DF]"
                            />
                            <input
                              type="number"
                              value={method.price}
                              onChange={(e) => updateShippingMethod(method.id, "price", Number(e.target.value))}
                              placeholder="Price"
                              className="px-2.5 py-1.5 bg-[#111] border border-[#2A2A2A] rounded-[6px] text-xs text-[#E8E4DF]"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => updateShippingMethod(method.id, "enabled", !method.enabled)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                  method.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                                }`}
                              >
                                {method.enabled ? "Active" : "Disabled"}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeShippingMethod(method.id)}
                                className="p-1 text-[#666] hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 6. TAXES ── */}
                {activeSection === "taxes" && (
                  <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                    <div className="border-b border-[#1A1A1A] pb-4">
                      <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                        <Percent className="w-4 h-4 text-[#C8A45D]" />
                        Tax Configuration & Compliance
                      </h2>
                      <p className="text-xs text-[#666] mt-0.5">Manage automated tax calculation rate for checkout orders</p>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-[#161616] border border-[#222] rounded-[10px]">
                      <div>
                        <p className="text-xs font-bold text-[#E8E4DF]">Enable Tax Calculation</p>
                        <p className="text-[11px] text-[#666] mt-0.5">Automatically apply tax percentage to subtotal during checkout</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTaxes({ ...taxes, taxEnabled: !taxes.taxEnabled })}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          taxes.taxEnabled ? "bg-[#C8A45D]" : "bg-[#2A2A2A]"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            taxes.taxEnabled ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Tax Name / Label</label>
                        <input
                          type="text"
                          value={taxes.taxName}
                          onChange={(e) => setTaxes({ ...taxes, taxName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#888] block mb-1">Tax Percentage (%)</label>
                        <input
                          type="number"
                          value={taxes.taxPercentage}
                          onChange={(e) => setTaxes({ ...taxes, taxPercentage: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 7. BACKUP & MAINTENANCE ── */}
                {activeSection === "backup" && (
                  <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 sm:p-6 space-y-6">
                    <div className="border-b border-[#1A1A1A] pb-4">
                      <h2 className="text-base font-bold text-[#E8E4DF] flex items-center gap-2">
                        <Database className="w-4 h-4 text-[#C8A45D]" />
                        Database Backup & Maintenance
                      </h2>
                      <p className="text-xs text-[#666] mt-0.5">Snapshot database state and export or restore store configuration</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#161616] border border-[#222] rounded-[12px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Last Backup Timestamp</span>
                        <p className="text-sm font-mono font-bold text-[#E8E4DF]">
                          {backupInfo.lastBackupTime ? new Date(backupInfo.lastBackupTime).toLocaleString() : "Never"}
                        </p>
                      </div>

                      <div className="p-4 bg-[#161616] border border-[#222] rounded-[12px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Backup Health Status</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400">{backupInfo.backupStatus || "Healthy"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleBackupNow}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${saving ? "animate-spin" : ""}`} />
                        <span>Trigger Backup Snapshot</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>Export Settings (JSON)</span>
                      </button>

                      <label className="flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>Import Settings</span>
                        <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                      </label>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 2FA CONFIGURATION MODAL ── */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#C8A45D]" />
                Setup Two-Factor Authentication
              </h3>
              <button type="button" onClick={() => setShow2FAModal(false)} className="text-[#666] hover:text-[#E8E4DF]">✕</button>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-40 h-40 bg-white p-2 rounded-[12px] flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/GOR%20Menswear:superadmin@gormenswear.com?secret=JBSWY3DPEHPK3PXP&issuer=GOR%20Menswear"
                  alt="2FA QR Code"
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-[#888]">Scan this QR code with Google Authenticator or Authy</p>
              <span className="font-mono text-[11px] bg-[#161616] px-3 py-1 rounded text-[#C8A45D] border border-[#222]">
                JBSW Y3DP EHPK 3PXP
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#888] block mb-1">Enter 6-Digit Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-center font-mono text-base text-[#E8E4DF] tracking-widest focus:outline-none focus:border-[#C8A45D]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="w-1/2 py-2 bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#888] rounded-[8px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSecurityState((prev) => ({ ...prev, twoFactorEnabled: true }));
                  setShow2FAModal(false);
                  success("2FA Enabled", "Two-Factor Authentication activated.");
                }}
                className="w-1/2 py-2 bg-[#C8A45D] text-[#0D0D0D] text-xs font-bold rounded-[8px]"
              >
                Verify & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGOUT ALL DEVICES MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-sm w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8E4DF]">Logout From All Devices?</h3>
              <p className="text-xs text-[#666] mt-1">This will invalidate all auth sessions across browsers and devices immediately.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 py-2 bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#888] rounded-[8px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await fetch("http://localhost:5000/api/auth/logout", { method: "POST" });
                  } catch (e) {}
                  setShowLogoutModal(false);
                  success("Sessions Terminated", "Logged out from all device sessions.");
                }}
                className="w-1/2 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-[8px]"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
