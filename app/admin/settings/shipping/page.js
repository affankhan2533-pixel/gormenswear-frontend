"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Search,
} from "lucide-react";
import AdminShell from "@/components/admin/shell/AdminShell";
import AdminCard from "@/components/admin/cards/AdminCard";
import AdminTable from "@/components/admin/tables/AdminTable";
import AdminSkeletonLoader from "@/components/admin/feedback/AdminSkeletonLoader";
import AdminEmptyState from "@/components/admin/feedback/AdminEmptyState";
import { useToast } from "@/context/ToastContext";
import { shippingService } from "@/lib/shippingService";

// Shipping Sub-Components
import ShippingOverviewHeader from "@/components/admin/shipping/ShippingOverviewHeader";
import ShippingRuleModal from "@/components/admin/shipping/ShippingRuleModal";

export default function ShippingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const r = await shippingService.getShippingRules();
    const cfg = await shippingService.getGlobalConfig();
    setRules(r);
    setGlobalConfig(cfg);
    setLoading(false);
  };

  const handleSaveRule = async (formData, ruleId) => {
    if (ruleId) {
      await shippingService.updateShippingRule(ruleId, formData);
      success("Shipping Rule Updated", `Rule for ${formData.state} updated.`);
    } else {
      await shippingService.addShippingRule(formData);
      success("Shipping Rule Created", `New shipping rule for ${formData.state} created.`);
    }
    fetchData();
  };

  const handleDeleteRule = async (id, stateName) => {
    await shippingService.deleteShippingRule(id);
    success("Shipping Rule Deleted", `Rule for ${stateName} deleted.`);
    fetchData();
  };

  const handleToggleStatus = async (id, currentState) => {
    await shippingService.toggleRuleStatus(id);
    info("Status Toggled", `Rule status updated.`);
    fetchData();
  };

  const filteredRules = rules.filter(
    (r) =>
      r.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "State / Zone Name",
      accessor: "state",
      render: (row) => (
        <div>
          <span className="font-bold text-[#F8F6F3] block text-sm">{row.state}</span>
          <span className="text-[10px] font-mono text-[#8E8A85]">Est: {row.estimatedDays}</span>
        </div>
      ),
    },
    {
      header: "Shipping Method",
      accessor: "method",
      render: (row) => (
        <span className="text-xs font-mono px-2.5 py-1 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded-[8px] font-semibold">
          {row.method}
        </span>
      ),
    },
    {
      header: "Charge (₹)",
      accessor: "charge",
      align: "right",
      render: (row) => (
        <span className="font-mono font-bold text-emerald-400">
          {row.charge === 0 ? "FREE" : `₹${row.charge}`}
        </span>
      ),
    },
    {
      header: "Free Above",
      accessor: "freeAbove",
      align: "right",
      render: (row) => (
        <span className="font-mono text-[#F8F6F3]">
          {row.freeAbove > 0 ? `₹${row.freeAbove}` : "Always Free"}
        </span>
      ),
    },
    {
      header: "COD Fee",
      accessor: "codFee",
      align: "right",
      render: (row) => <span className="font-mono text-[#8E8A85]">₹{row.codFee}</span>,
    },
    {
      header: "Priority",
      accessor: "priority",
      align: "center",
      render: (row) => (
        <span className="font-mono text-xs text-blue-400 font-bold bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded">
          P{row.priority}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row.id, row.status)}
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border cursor-pointer ${
            row.status === "Active"
              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          {row.status}
        </button>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setEditingRule(row);
              setIsModalOpen(true);
            }}
            className="p-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Edit Rule"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteRule(row.id, row.state)}
            className="p-1.5 bg-[#090909] hover:bg-rose-950 text-rose-400 rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Delete Rule"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <ShippingOverviewHeader
          activeZonesCount={rules.filter((r) => r.status === "Active").length}
          freeShippingCount={rules.filter((r) => r.charge === 0).length}
          globalCodFee={globalConfig.globalCodFee || 50}
          onAddRule={() => {
            setEditingRule(null);
            setIsModalOpen(true);
          }}
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#141414] border border-[#222222] rounded-[20px] shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state, zone, or shipping method..."
              className="w-full pl-10 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
            />
          </div>

          <span className="text-xs text-[#8E8A85] font-mono">
            Rules evaluated in priority order (P1 Highest)
          </span>
        </div>

        {/* Table Content */}
        {loading ? (
          <AdminSkeletonLoader count={4} className="h-28" />
        ) : filteredRules.length === 0 ? (
          <AdminEmptyState
            title="No Shipping Rules Configured"
            description="Create your first shipping rule to define shipping charges per state."
            actionLabel="Add Shipping Rule"
            onAction={() => {
              setEditingRule(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <AdminTable columns={columns} data={filteredRules} />
        )}
      </div>

      {/* Modal */}
      <ShippingRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveRule={handleSaveRule}
        ruleObj={editingRule}
      />
    </AdminShell>
  );
}
