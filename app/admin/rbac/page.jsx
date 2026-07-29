"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import {
  ShieldCheck, Users, Plus, Edit2, Trash2, KeyRound, Lock,
  CheckCircle2, AlertTriangle, UserX, UserCheck, RefreshCw,
  Search, Info, Eye, ShieldAlert, Check, X
} from "lucide-react";

const ROLES = [
  "Super Admin",
  "Admin",
  "Inventory Manager",
  "Order Manager",
  "Customer Support",
  "Content Manager",
];

const PERMISSIONS_MATRIX = [
  { module: "Products", scope: "products:view", label: "View Products", roles: ["Super Admin", "Admin", "Inventory Manager", "Content Manager"] },
  { module: "Products", scope: "products:create", label: "Create Products", roles: ["Super Admin", "Admin", "Inventory Manager", "Content Manager"] },
  { module: "Products", scope: "products:edit", label: "Edit Products", roles: ["Super Admin", "Admin", "Inventory Manager", "Content Manager"] },
  { module: "Products", scope: "products:delete", label: "Delete Products", roles: ["Super Admin", "Admin"] },
  
  { module: "Orders", scope: "orders:view", label: "View Orders", roles: ["Super Admin", "Admin", "Order Manager", "Customer Support"] },
  { module: "Orders", scope: "orders:update", label: "Update Order Status", roles: ["Super Admin", "Admin", "Order Manager"] },
  { module: "Orders", scope: "orders:cancel", label: "Cancel Orders", roles: ["Super Admin", "Admin", "Order Manager"] },
  
  { module: "Customers", scope: "customers:view", label: "View Customers", roles: ["Super Admin", "Admin", "Order Manager", "Customer Support"] },
  { module: "Customers", scope: "customers:edit", label: "Edit Customers", roles: ["Super Admin", "Admin", "Customer Support"] },
  
  { module: "Analytics", scope: "analytics:view", label: "View Analytics", roles: ["Super Admin", "Admin", "Inventory Manager"] },
  
  { module: "Settings", scope: "settings:view", label: "View Store Settings", roles: ["Super Admin", "Admin"] },
  { module: "Settings", scope: "settings:edit", label: "Edit Store Settings", roles: ["Super Admin", "Admin"] },
  
  { module: "Coupons", scope: "coupons:create", label: "Create Coupons", roles: ["Super Admin", "Admin", "Content Manager"] },
  { module: "Coupons", scope: "coupons:edit", label: "Edit Coupons", roles: ["Super Admin", "Admin", "Content Manager"] },
  { module: "Coupons", scope: "coupons:delete", label: "Delete Coupons", roles: ["Super Admin", "Admin"] },
  
  { module: "Inventory", scope: "inventory:update", label: "Update Stock Levels", roles: ["Super Admin", "Admin", "Inventory Manager", "Order Manager"] },
];

export default function RoleManagementPage() {
  const { success, error: toastError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  // Form States
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "Admin", status: "Active" });
  const [editForm, setEditForm] = useState({ name: "", role: "Admin", status: "Active" });
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch Admin Users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/users`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setUsers(json.users || []);
      } else {
        toastError("Load Error", json.error);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addForm),
      });
      const json = await res.json();
      if (json.success) {
        success("Admin Created", `User '${addForm.name}' created successfully.`);
        setShowAddModal(false);
        setAddForm({ name: "", email: "", password: "", role: "Admin", status: "Active" });
        loadUsers();
      } else {
        toastError("Create Failed", json.error);
      }
    } catch (err) {
      toastError("Create Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit User Handler
  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!activeUser) return;
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/users/${activeUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        success("Admin Updated", "User role & status details saved.");
        setShowEditModal(false);
        loadUsers();
      } else {
        toastError("Update Failed", json.error);
      }
    } catch (err) {
      toastError("Update Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!activeUser || !newPassword) return;
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/users/${activeUser.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });
      const json = await res.json();
      if (json.success) {
        success("Password Reset", `Password reset for '${activeUser.name}'.`);
        setShowPasswordModal(false);
        setNewPassword("");
      } else {
        toastError("Reset Failed", json.error);
      }
    } catch (err) {
      toastError("Reset Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete admin account '${name}'?`)) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        success("Admin Deleted", `User '${name}' removed.`);
        loadUsers();
      } else {
        toastError("Delete Failed", json.error);
      }
    } catch (err) {
      toastError("Delete Failed", err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Super Admin": return "bg-purple-500/15 text-purple-400 border-purple-500/30 font-bold";
      case "Admin": return "bg-[#C8A45D]/15 text-[#C8A45D] border-[#C8A45D]/30 font-semibold";
      case "Inventory Manager": return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      case "Order Manager": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Customer Support": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-7xl pb-24">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F0EDE8] flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-[#C8A45D]" />
              Multi-Admin & Role Management (RBAC)
            </h1>
            <p className="text-xs text-[#777] mt-0.5">
              Grant granular access permissions, manage admin roles, suspend accounts, and reset credentials
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadUsers}
              className="p-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-xs text-[#E8E4DF] rounded-[8px] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C8A45D]" : "text-[#777]"}`} />
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Admin User</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-3.5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admin users by name, email, or role..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>
        </div>

        {/* Admin Users Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#1E1E1E] text-[#888] font-semibold">
                  <th className="py-3.5 px-4">ADMINISTRATOR</th>
                  <th className="py-3.5 px-4">ROLE PERMISSION</th>
                  <th className="py-3.5 px-4">ACCOUNT STATUS</th>
                  <th className="py-3.5 px-4">LAST LOGIN</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#666] animate-pulse">
                      Loading admin users list...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#666]">
                      No admin users found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#161616]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center font-bold text-[#C8A45D] shrink-0">
                            {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#E8E4DF]">{u.name}</div>
                            <div className="text-[11px] text-[#666]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] border ${getRoleBadgeColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#888]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveUser(u);
                              setEditForm({ name: u.name, role: u.role, status: u.status });
                              setShowEditModal(true);
                            }}
                            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-[#C8A45D] rounded-[6px]"
                            title="Edit Role & Status"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveUser(u);
                              setShowPasswordModal(true);
                            }}
                            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-amber-400 rounded-[6px]"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-rose-400 rounded-[6px]"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permission Matrix Card */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C8A45D]" />
              Role Permission Scope Matrix
            </h3>
            <p className="text-xs text-[#666] mt-0.5">Overview of granted administrative scopes per role</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#1E1E1E] text-[#888] font-semibold">
                  <th className="py-2.5 px-3">MODULE SCOPE</th>
                  {ROLES.map((r) => (
                    <th key={r} className="py-2.5 px-2 text-center text-[11px] truncate max-w-[120px]">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {PERMISSIONS_MATRIX.map((perm) => (
                  <tr key={perm.scope} className="hover:bg-[#161616]/40">
                    <td className="py-2.5 px-3 text-[#E8E4DF] font-medium">
                      {perm.label} <span className="font-mono text-[10px] text-[#666]">({perm.scope})</span>
                    </td>
                    {ROLES.map((role) => {
                      const isAllowed = role === "Super Admin" || perm.roles.includes(role);
                      return (
                        <td key={role} className="py-2.5 px-2 text-center">
                          {isAllowed ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-[#444] mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF]">Add New Administrator</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-[#666] hover:text-[#E8E4DF]">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#888] block mb-1">Assign Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#888] block mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2 bg-[#1C1C1C] text-xs text-[#888] rounded-[8px]">Cancel</button>
              <button type="submit" disabled={saving} className="w-1/2 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded-[8px]">Create Admin</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && activeUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleEditUser} className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF]">Edit Administrator Role & Status</h3>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-[#666] hover:text-[#E8E4DF]">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Assign Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive (Suspended)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="w-1/2 py-2 bg-[#1C1C1C] text-xs text-[#888] rounded-[8px]">Cancel</button>
              <button type="submit" disabled={saving} className="w-1/2 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded-[8px]">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && activeUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleResetPassword} className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF]">Reset Admin Password</h3>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-[#666] hover:text-[#E8E4DF]">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#888] block mb-1">New Password for {activeUser.name}</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowPasswordModal(false)} className="w-1/2 py-2 bg-[#1C1C1C] text-xs text-[#888] rounded-[8px]">Cancel</button>
              <button type="submit" disabled={saving} className="w-1/2 py-2 bg-amber-500 text-[#0D0D0D] font-bold text-xs rounded-[8px]">Reset Password</button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
