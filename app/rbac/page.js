"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Download,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  User,
  Mail,
  Clock,
  Grid,
  List,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  X,
  Loader2,
  ShieldAlert,
  Smartphone,
  Layers,
  Check,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

const INITIAL_STAFF = [
  {
    id: "stf-1",
    name: "Eleanor Vance",
    email: "eleanor@gormenswear.com",
    role: "Super Admin",
    status: "Active",
    twoFactor: true,
    lastLogin: "12 mins ago",
    joinedDate: "Jan 10, 2026",
    avatar: "EV",
    activityLog: [
      { date: "July 27, 2026", action: "Updated HTTP Security Headers" },
      { date: "July 24, 2026", action: "Approved Phase 16 OMS Deployment" },
    ],
  },
  {
    id: "stf-2",
    name: "Julian Thorne",
    email: "julian@gormenswear.com",
    role: "Store Manager",
    status: "Active",
    twoFactor: true,
    lastLogin: "2 hours ago",
    joinedDate: "Feb 01, 2026",
    avatar: "JT",
    activityLog: [
      { date: "July 26, 2026", action: "Updated Inventory for Co-Ord Sets" },
    ],
  },
  {
    id: "stf-3",
    name: "Elena Rostova",
    email: "elena@gormenswear.com",
    role: "Content Editor",
    status: "Active",
    twoFactor: true,
    lastLogin: "1 day ago",
    joinedDate: "Feb 15, 2026",
    avatar: "ER",
    activityLog: [
      { date: "July 25, 2026", action: "Published Lookbook Article" },
    ],
  },
  {
    id: "stf-4",
    name: "Marcus Vance",
    email: "marcus@gormenswear.com",
    role: "Marketing Manager",
    status: "Active",
    twoFactor: true,
    lastLogin: "3 days ago",
    joinedDate: "Mar 01, 2026",
    avatar: "MV",
    activityLog: [
      { date: "July 20, 2026", action: "Created AUTUMN15 Promo Voucher" },
    ],
  },
];

const CMS_MODULES = [
  "Dashboard",
  "Products",
  "Collections",
  "Navigation",
  "Pages",
  "Blog",
  "Orders",
  "Customers",
  "Marketing",
  "Theme",
  "Reports",
  "Settings",
];

const PERMISSION_ACTIONS = ["View", "Create", "Edit", "Delete", "Publish", "Export", "Import"];

export default function RolesPermissionsPage() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || s.role.toLowerCase() === roleFilter.toLowerCase();
      return matchSearch && matchRole;
    });
  }, [staff, searchQuery, roleFilter]);

  // Open Create/Invite Modal
  const handleOpenInviteModal = () => {
    setEditingStaff({
      id: `stf-${Date.now()}`,
      name: "",
      email: "",
      role: "Content Editor",
      status: "Active",
      twoFactor: false,
      lastLogin: "Never",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      avatar: "ST",
      activityLog: [{ date: "Just now", action: "Account invitation created" }],
    });
    setShowUserModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (stf) => {
    setEditingStaff({ ...stf });
    setShowUserModal(true);
  };

  // Save User Handler
  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!editingStaff.name.trim() || !editingStaff.email.trim()) return;

    setStaff((prev) => {
      const exists = prev.some((s) => s.id === editingStaff.id);
      if (exists) {
        return prev.map((s) => (s.id === editingStaff.id ? editingStaff : s));
      }
      return [editingStaff, ...prev];
    });

    setShowUserModal(false);
    success("User Saved", `Staff member "${editingStaff.name}" saved successfully.`);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Name,Email,Role,Status,2FA_Status,Joined_Date\n";
        const rows = staff
          .map((s) => `${s.id},"${s.name}",${s.email},"${s.role}",${s.status},${s.twoFactor ? "Enforced" : "Disabled"},${s.joinedDate}`)
          .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_RBAC_Users_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "RBAC users report downloaded successfully.");
    }, 800);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 font-sans select-none relative">
        <Container className="space-y-8">
          
          {/* Header Title & Actions */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4" /> ACCESS CONTROL ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Roles & Permissions (RBAC)
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMatrixModal(true)}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Layers className="w-4 h-4 text-[#C8A45D]" />
                <span>Permission Matrix</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#C8A45D]" /> : <Download className="w-4 h-4 text-[#C8A45D]" />}
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleOpenInviteModal}
                className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Staff User</span>
              </button>
            </div>
          </div>

          {/* RBAC Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Staff Members</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">12</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Predefined Roles</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">6 Roles</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">2FA Enforced</span>
              <span className="font-editorial text-2xl text-emerald-400">100%</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Active Sessions</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">8</span>
            </div>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by user name or email..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Staff Roles</option>
                <option value="super admin">Super Admin</option>
                <option value="store manager">Store Manager</option>
                <option value="content editor">Content Editor</option>
                <option value="marketing manager">Marketing Manager</option>
              </select>
            </div>

            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── STAFF TABLE / GRID VIEW ── */}
          {viewMode === "table" ? (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Staff User</th>
                    <th className="py-3.5 px-4 font-bold">Assigned Role</th>
                    <th className="py-3.5 px-4 font-bold">2FA Security</th>
                    <th className="py-3.5 px-4 font-bold">Last Login</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#090909] border border-[#C8A45D] text-[#C8A45D] font-editorial text-xs font-bold flex items-center justify-center shrink-0">
                          {s.avatar}
                        </div>
                        <div>
                          <span className="block">{s.name}</span>
                          <span className="text-[11px] text-[#8E8A85] font-light">{s.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{s.role}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8E8A85] font-mono">{s.lastLogin}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(s)}
                          className="p-1.5 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredStaff.map((s) => (
                <div key={s.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#090909] border-2 border-[#C8A45D] text-[#C8A45D] font-editorial text-base font-bold flex items-center justify-center">
                      {s.avatar}
                    </div>
                    <div>
                      <h4 className="font-editorial text-lg text-[#F8F6F3]">{s.name}</h4>
                      <span className="text-xs text-[#C8A45D] font-mono font-bold block">{s.role}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#8E8A85] font-light">
                    <p>{s.email}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-mono text-[10px]">2FA Enforced</span>
                    <button type="button" onClick={() => handleOpenEditModal(s)} className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Container>
      </main>

      {/* ── VISUAL PERMISSION MATRIX MODAL ── */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-5xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  SECURITY POLICY ENGINE
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">Visual RBAC Permission Matrix</h3>
              </div>
              <button type="button" onClick={() => setShowMatrixModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-[#2A2A2A] rounded-[14px] bg-[#090909]">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#151515]">
                    <th className="py-3 px-4 font-bold">CMS Module</th>
                    {PERMISSION_ACTIONS.map((act) => (
                      <th key={act} className="py-3 px-3 text-center font-bold">{act}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {CMS_MODULES.map((mod) => (
                    <tr key={mod} className="hover:bg-[#151515]/60 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-[#F8F6F3]">{mod}</td>
                      {PERMISSION_ACTIONS.map((act) => (
                        <td key={act} className="py-2.5 px-3 text-center">
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A] flex justify-end">
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff User Modal */}
      {showUserModal && editingStaff && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  STAFF USER PROFILE
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingStaff.name || "Invite Staff User"}</h3>
              </div>
              <button type="button" onClick={() => setShowUserModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Assigned Role</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Content Editor">Content Editor</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Account Status</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
