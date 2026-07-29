"use client";

import { useRouter } from "next/navigation";
import AdminTable from "@/components/admin/tables/AdminTable";
import {
  Eye,
  Edit,
  Trash2,
  Package,
  ExternalLink,
  EyeOff,
  Globe,
} from "lucide-react";

export default function TableView({
  products,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onOpenPreview,
  onOpenEdit,
  onOpenFullEditor,
  onToggleVisibility,
  onDelete,
}) {
  const allSelected =
    products.length > 0 && selectedIds.length === products.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < products.length;

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={onSelectAll}
          className="w-4 h-4 accent-[#C8A45D] cursor-pointer"
          title="Select All"
        />
      ),
      accessor: "_select",
      align: "center",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => onToggleSelect(row.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 accent-[#C8A45D] cursor-pointer"
        />
      ),
    },
    {
      header: "Product Title & SKU",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#0D0D0D] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
            {row.imageUrl ? (
              <img
                src={row.imageUrl}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-5 h-5 text-[#C8A45D]" />
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFullEditor(row.id);
              }}
              className="font-semibold text-[#F8F6F3] block hover:text-[#C8A45D] transition-colors text-left"
            >
              {row.name}
            </button>
            <span className="text-[10px] font-mono text-[#8E8A85]">
              SKU: {row.sku}
            </span>
          </div>
        </div>
      ),
    },
    { header: "Category", accessor: "category" },
    { header: "Collection", accessor: "collection" },
    {
      header: "Price",
      accessor: "price",
      align: "right",
      render: (row) => (
        <span className="font-mono font-bold text-emerald-400">
          ₹{row.price.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Stock",
      accessor: "stock",
      align: "center",
      render: (row) => (
        <span
          className={`font-mono font-bold ${
            row.stock === 0
              ? "text-rose-400"
              : row.stock <= row.minStockThreshold
              ? "text-amber-400"
              : "text-[#F8F6F3]"
          }`}
        >
          {row.stock} Units
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      render: (row) => (
        <div className="flex flex-col items-center gap-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              row.status === "Active"
                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                : row.status === "Out of Stock"
                ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                : row.status === "Archived"
                ? "bg-zinc-900 text-zinc-500 border-zinc-700/30"
                : "bg-amber-950/80 text-amber-400 border-amber-500/30"
            }`}
          >
            {row.status}
          </span>
          <span
            className={`text-[9px] font-mono ${
              row.visibility === "Published"
                ? "text-emerald-500/70"
                : "text-zinc-600"
            }`}
          >
            {row.visibility}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {/* Preview */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPreview(row);
            }}
            className="p-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Quick Edit */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEdit(row);
            }}
            className="p-1.5 bg-[#0D0D0D] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Quick Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          {/* Full Editor */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullEditor(row.id);
            }}
            className="p-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Open Full Editor"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Visibility */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(row);
            }}
            className={`p-1.5 bg-[#0D0D0D] rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer ${
              row.visibility === "Published"
                ? "text-emerald-500 hover:text-rose-400"
                : "text-zinc-600 hover:text-emerald-500"
            }`}
            title={
              row.visibility === "Published"
                ? "Hide from Storefront"
                : "Publish to Storefront"
            }
          >
            {row.visibility === "Published" ? (
              <Globe className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="p-1.5 bg-[#0D0D0D] hover:bg-rose-950/60 text-[#8E8A85] hover:text-rose-400 rounded-[6px] border border-[#2A2A2A] hover:border-rose-500/30 transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={products}
      onRowClick={(row) => onOpenPreview(row)}
    />
  );
}
