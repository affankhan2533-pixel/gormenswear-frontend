"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  FileSpreadsheet,
  Factory,
  BellRing,
  BarChart3,
  Download,
  Upload,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  PieChart,
  ShieldCheck,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  Layers,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

// Data Import
import {
  INITIAL_WAREHOUSES,
  INITIAL_INVENTORY,
  INITIAL_MOVEMENTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_ALERTS_CONFIG,
  INITIAL_REPORTS,
} from "@/lib/wmsData";

// Components Import
import WarehouseCard from "@/components/wms/WarehouseCard";
import WarehouseModal from "@/components/wms/WarehouseModal";
import InventoryTable from "@/components/wms/InventoryTable";
import StockAdjustmentModal from "@/components/wms/StockAdjustmentModal";
import StockMovementTimeline from "@/components/wms/StockMovementTimeline";
import PurchaseOrderModal from "@/components/wms/PurchaseOrderModal";
import ReceiveStockModal from "@/components/wms/ReceiveStockModal";
import SupplierModal from "@/components/wms/SupplierModal";
import AlertConfigModal from "@/components/wms/AlertConfigModal";
import WMSReports from "@/components/wms/WMSReports";
import ImportExportModal from "@/components/wms/ImportExportModal";

export default function EnterpriseWMSPage() {
  // State Management
  const [activeTab, setActiveTab] = useState("overview"); // overview, warehouses, inventory, movements, pos, suppliers, alerts, reports, importexport
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [alertsConfig, setAlertsConfig] = useState(INITIAL_ALERTS_CONFIG);
  const [reportsData, setReportsData] = useState(INITIAL_REPORTS);

  // Modals visibility
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [editingPO, setEditingPO] = useState(null);
  const [prefilledPOItem, setPrefilledPOItem] = useState(null);

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receivingPO, setReceivingPO] = useState(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  const { success, info, error: toastError } = useToast();

  // ── EXECUTIVE KPI CALCULATIONS ──
  const kpis = useMemo(() => {
    const totalWarehouses = warehouses.filter((w) => w.status !== "Archived").length;
    const totalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0);
    const lowStockCount = inventory.filter((item) => item.status === "Low Stock").length;
    const outOfStockCount = inventory.filter((item) => item.status === "Out of Stock").length;
    const incomingStock = inventory.reduce((sum, item) => sum + item.incomingStock, 0);
    
    // Inventory Health Math: (In Stock Items / Total Items) * 100
    const inStockItems = inventory.filter((item) => item.status === "In Stock" || item.status === "Overstock").length;
    const inventoryHealth = Math.round((inStockItems / (inventory.length || 1)) * 100);

    return {
      totalWarehouses,
      totalStock,
      lowStockCount,
      outOfStockCount,
      incomingStock,
      inventoryHealth,
    };
  }, [warehouses, inventory]);

  // ── HANDLERS: WAREHOUSE MANAGEMENT ──
  const handleSaveWarehouse = (whData) => {
    const exists = warehouses.find((w) => w.id === whData.id);
    if (exists) {
      setWarehouses(warehouses.map((w) => (w.id === whData.id ? whData : w)));
      success("Warehouse Updated", `${whData.name} profile has been saved.`);
    } else {
      setWarehouses([whData, ...warehouses]);
      success("Warehouse Created", `${whData.name} is now active.`);
    }
  };

  const handleArchiveWarehouse = (whId) => {
    setWarehouses(
      warehouses.map((w) =>
        w.id === whId ? { ...w, status: "Archived" } : w
      )
    );
    info("Warehouse Archived", "The logistics hub status was set to Archived.");
  };

  // ── HANDLERS: STOCK ADJUSTMENT & MOVEMENTS ──
  const handleSaveStockAdjustment = ({ itemId, movementPayload, adjustmentType, quantity, targetWarehouseId }) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          let newCurrent = item.currentStock;
          let newDamaged = item.damagedStock;

          if (adjustmentType === "Stock In" || adjustmentType === "Return Stock") {
            newCurrent += quantity;
          } else if (adjustmentType === "Stock Out" || adjustmentType === "Stock Transfer") {
            newCurrent = Math.max(0, newCurrent - quantity);
          } else if (adjustmentType === "Manual Adjustment") {
            newCurrent = Math.max(0, newCurrent + quantity);
          } else if (adjustmentType === "Damage Report") {
            newCurrent = Math.max(0, newCurrent - quantity);
            newDamaged += quantity;
          }

          let newStatus = "In Stock";
          if (newCurrent === 0) newStatus = "Out of Stock";
          else if (newCurrent <= item.safetyStock) newStatus = "Low Stock";
          else if (newCurrent >= item.maxStockLevel) newStatus = "Overstock";

          return {
            ...item,
            currentStock: newCurrent,
            availableStock: Math.max(0, newCurrent - item.reservedStock),
            damagedStock: newDamaged,
            status: newStatus,
          };
        }
        return item;
      })
    );

    // Record movement
    setMovements([movementPayload, ...movements]);
    success("Stock Movement Saved", `${adjustmentType} logged for ${movementPayload.productName}.`);
  };

  // ── HANDLERS: PURCHASE ORDERS ──
  const handleSavePO = (poData) => {
    const exists = purchaseOrders.find((p) => p.id === poData.id);
    if (exists) {
      setPurchaseOrders(purchaseOrders.map((p) => (p.id === poData.id ? poData : p)));
      success("Purchase Order Updated", `PO #${poData.poNumber} saved successfully.`);
    } else {
      setPurchaseOrders([poData, ...purchaseOrders]);
      success("Purchase Order Issued", `PO #${poData.poNumber} issued to ${poData.supplierName}.`);
    }
  };

  const handleReceivePOShipment = ({ poId, receiveQtyMap, batchNo, receiverName, date }) => {
    const targetPO = purchaseOrders.find((p) => p.id === poId);
    if (!targetPO) return;

    let allItemsFulfilled = true;

    const updatedItems = targetPO.items.map((item) => {
      const addedQty = receiveQtyMap[item.sku] || 0;
      const newReceived = item.receivedQty + addedQty;
      if (newReceived < item.orderQty) allItemsFulfilled = false;

      // Update Inventory
      if (addedQty > 0) {
        setInventory((prevInv) =>
          prevInv.map((invItem) => {
            if (invItem.sku === item.sku) {
              const newCurrent = invItem.currentStock + addedQty;
              return {
                ...invItem,
                currentStock: newCurrent,
                availableStock: Math.max(0, newCurrent - invItem.reservedStock),
                incomingStock: Math.max(0, invItem.incomingStock - addedQty),
                status: newCurrent > invItem.safetyStock ? "In Stock" : "Low Stock",
                lastRestocked: date,
              };
            }
            return invItem;
          })
        );

        // Record Stock In movement
        const newMov = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: `${date} 10:00`,
          sku: item.sku,
          productName: item.name,
          type: "Stock In",
          quantity: addedQty,
          fromWarehouse: targetPO.supplierName,
          toWarehouse: targetPO.destinationWarehouseName,
          performedBy: receiverName,
          referenceNo: targetPO.poNumber,
          reason: "PO Receipt",
          notes: `Quality Batch ${batchNo}`,
        };
        setMovements((prevMov) => [newMov, ...prevMov]);
      }

      return {
        ...item,
        receivedQty: newReceived,
      };
    });

    const newLogs = [
      ...(targetPO.receivingLogs || []),
      { date, qty: Object.values(receiveQtyMap).reduce((a, b) => a + b, 0), batch: batchNo, receivedBy: receiverName },
    ];

    setPurchaseOrders(
      purchaseOrders.map((p) =>
        p.id === poId
          ? {
              ...p,
              items: updatedItems,
              status: allItemsFulfilled ? "Completed" : "Receiving",
              receivingLogs: newLogs,
            }
          : p
      )
    );

    success("Stock Received", `Received shipment batch ${batchNo} into ${targetPO.destinationWarehouseName}.`);
  };

  const handleCancelPO = (poId) => {
    setPurchaseOrders(
      purchaseOrders.map((p) => (p.id === poId ? { ...p, status: "Cancelled" } : p))
    );
    info("PO Cancelled", "The purchase order status was set to Cancelled.");
  };

  // ── HANDLERS: SUPPLIER MANAGEMENT ──
  const handleSaveSupplier = (supData) => {
    const exists = suppliers.find((s) => s.id === supData.id);
    if (exists) {
      setSuppliers(suppliers.map((s) => (s.id === supData.id ? supData : s)));
      success("Supplier Updated", `${supData.name} record saved.`);
    } else {
      setSuppliers([supData, ...suppliers]);
      success("Supplier Registered", `${supData.name} added to supplier directory.`);
    }
  };

  // ── HANDLERS: IMPORT / EXPORT ──
  const handleExportCSV = () => {
    const csvHeader = "SKU,Product Name,Category,Warehouse,Current Stock,Reserved Stock,Available Stock,Status\n";
    const csvRows = inventory
      .map(
        (i) =>
          `"${i.sku}","${i.productName}","${i.category}","${i.warehouseName}",${i.currentStock},${i.reservedStock},${i.availableStock},"${i.status}"`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_WMS_Inventory_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    success("CSV Exported", "Inventory data sheet downloaded successfully.");
  };

  const handleExportExcel = () => {
    // Generate XML Spreadsheet structure compatible with Excel (.xlsx)
    const xmlHeader = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Inventory Master">
<Table>
<Row>
<Cell><Data ss:Type="String">SKU</Data></Cell>
<Cell><Data ss:Type="String">Product Name</Data></Cell>
<Cell><Data ss:Type="String">Category</Data></Cell>
<Cell><Data ss:Type="String">Warehouse</Data></Cell>
<Cell><Data ss:Type="String">Current Stock</Data></Cell>
<Cell><Data ss:Type="String">Available Stock</Data></Cell>
<Cell><Data ss:Type="String">Unit Price</Data></Cell>
</Row>`;

    const xmlBody = inventory
      .map(
        (i) => `<Row>
<Cell><Data ss:Type="String">${i.sku}</Data></Cell>
<Cell><Data ss:Type="String">${i.productName}</Data></Cell>
<Cell><Data ss:Type="String">${i.category}</Data></Cell>
<Cell><Data ss:Type="String">${i.warehouseName}</Data></Cell>
<Cell><Data ss:Type="Number">${i.currentStock}</Data></Cell>
<Cell><Data ss:Type="Number">${i.availableStock}</Data></Cell>
<Cell><Data ss:Type="Number">${i.unitPrice}</Data></Cell>
</Row>`
      )
      .join("");

    const xmlFooter = `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlHeader + xmlBody + xmlFooter], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_WMS_Master_${new Date().toISOString().split("T")[0]}.xls`;
    a.click();
    success("Excel Sheet Exported", "Excel formatted workbook downloaded successfully.");
  };

  const handleImportInventory = (parsedRows) => {
    const newItems = parsedRows.map((r, idx) => ({
      id: `inv-imp-${Date.now()}-${idx}`,
      sku: r.SKU || `GOR-IMP-${idx}`,
      productName: r.ProductName || "Imported Item",
      category: r.Category || "General",
      warehouseId: warehouses[0].id,
      warehouseName: warehouses[0].name,
      unitCost: Number(r.UnitCost || 100),
      unitPrice: Number(r.UnitPrice || 250),
      currentStock: Number(r.CurrentStock || 50),
      reservedStock: 0,
      availableStock: Number(r.CurrentStock || 50),
      incomingStock: 0,
      damagedStock: 0,
      safetyStock: 15,
      reorderPoint: 25,
      maxStockLevel: 200,
      locationBin: "IMP-01-A",
      lastRestocked: new Date().toISOString().split("T")[0],
      status: Number(r.CurrentStock || 50) > 15 ? "In Stock" : "Low Stock",
    }));

    setInventory([...newItems, ...inventory]);
    success("CSV Data Imported", `Successfully appended ${newItems.length} inventory SKUs.`);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none relative font-sans">
        
        {/* Top Executive Header */}
        <div className="bg-[#151515] border-b border-[#2A2A2A] py-10 mb-8">
          <Container>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link
                    href="/admin"
                    className="p-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> ENTERPRISE WMS OPERATIONS
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Warehouse & Inventory Management
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(true)}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer relative"
                >
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span>Configure Alerts</span>
                  {alertsConfig.activeAlerts?.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportExportModalOpen(true)}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                  <span>Import / Export Center</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingPO(null);
                    setPrefilledPOItem(null);
                    setIsPOModalOpen(true);
                  }}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Purchase Order</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "Dashboard & KPIs" },
                { id: "warehouses", label: `Warehouses (${kpis.totalWarehouses})` },
                { id: "inventory", label: `Inventory (${inventory.length})` },
                { id: "movements", label: "Stock Movements" },
                { id: "pos", label: `Purchase Orders (${purchaseOrders.length})` },
                { id: "suppliers", label: `Suppliers (${suppliers.length})` },
                { id: "alerts", label: "Stock Alerts" },
                { id: "reports", label: "WMS Reports" },
                { id: "importexport", label: "Import / Export" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-[10px] text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[#C8A45D] text-[#090909]"
                      : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] hover:text-[#F8F6F3]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Container>
        </div>

        <Container className="space-y-8">

          {/* ── 1. EXECUTIVE KPI METRICS BAR ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <Building2 className="w-4 h-4 text-[#C8A45D]" />
                <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Total Warehouses
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {kpis.totalWarehouses}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <Package className="w-4 h-4 text-[#C8A45D]" />
                <span className="text-[10px] font-bold text-blue-400">UNITS</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Total Stock
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {kpis.totalStock.toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400">WARN</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Low Stock Items
              </span>
              <span className="font-editorial text-2xl font-bold text-amber-400 block">
                {kpis.lowStockCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-bold text-rose-400">CRITICAL</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Out of Stock
              </span>
              <span className="font-editorial text-2xl font-bold text-rose-400 block">
                {kpis.outOfStockCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400">IN-BOUND</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Incoming Stock
              </span>
              <span className="font-editorial text-2xl font-bold text-blue-400 block">
                +{kpis.incomingStock.toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">SCORE</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Inventory Health
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                {kpis.inventoryHealth}%
              </span>
            </div>
          </div>

          {/* ── 2. TAB CONTENT VIEWS ── */}

          {/* TAB 1: OVERVIEW & DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Active Logistics Hubs Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                      Global Logistics Hubs & Warehouses
                    </h2>
                    <p className="text-xs text-[#8E8A85]">
                      Real-time inventory levels, capacity utilization, and assigned managers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWarehouse(null);
                      setIsWarehouseModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[10px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Warehouse
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {warehouses
                    .filter((w) => w.status !== "Archived")
                    .map((wh) => (
                      <WarehouseCard
                        key={wh.id}
                        warehouse={wh}
                        onEdit={(w) => {
                          setEditingWarehouse(w);
                          setIsWarehouseModalOpen(true);
                        }}
                        onArchive={handleArchiveWarehouse}
                      />
                    ))}
                </div>
              </div>

              {/* Critical Stock Alerts Summary Widget */}
              <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-editorial text-xl font-normal text-[#F8F6F3]">
                      Active Inventory Notifications & Reorder Triggers
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("alerts")}
                    className="text-xs text-[#C8A45D] font-bold hover:underline flex items-center gap-1"
                  >
                    View All Triggers <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {alertsConfig.activeAlerts?.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-start gap-3"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                          alt.level === "critical"
                            ? "bg-rose-500"
                            : alt.level === "warning"
                            ? "bg-amber-400"
                            : "bg-blue-400"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-bold text-[#F8F6F3]">{alt.type}</span>
                          <span className="font-mono text-[10px] text-[#C8A45D]">{alt.sku}</span>
                        </div>
                        <p className="text-xs text-[#8E8A85]">{alt.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WAREHOUSE MANAGEMENT */}
          {activeTab === "warehouses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Warehouse Management
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Configure regional depots, update manager contact information, and track capacity.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingWarehouse(null);
                    setIsWarehouseModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Create Warehouse
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warehouses.map((wh) => (
                  <WarehouseCard
                    key={wh.id}
                    warehouse={wh}
                    onEdit={(w) => {
                      setEditingWarehouse(w);
                      setIsWarehouseModalOpen(true);
                    }}
                    onArchive={handleArchiveWarehouse}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY CONTROL */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Live Inventory Master Control
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Track Current, Reserved, Available (Current - Reserved), Incoming, and Damaged Stock.
                  </p>
                </div>
              </div>

              <InventoryTable
                inventory={inventory}
                warehouses={warehouses}
                onAdjustStock={(item) => {
                  setSelectedInventoryItem(item);
                  setIsAdjustmentModalOpen(true);
                }}
                onCreatePOForItem={(item) => {
                  setEditingPO(null);
                  setPrefilledPOItem(item);
                  setIsPOModalOpen(true);
                }}
              />
            </div>
          )}

          {/* TAB 4: STOCK MOVEMENTS LOG */}
          {activeTab === "movements" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Stock Movements Audit Trail
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Complete movement history tracking Stock In, Stock Out, Transfers, Adjustments, and Damage Reports.
                </p>
              </div>

              <StockMovementTimeline movements={movements} onExportCSV={handleExportCSV} />
            </div>
          )}

          {/* TAB 5: PURCHASE ORDERS */}
          {activeTab === "pos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Purchase Orders & Restocking
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Manage mill purchase orders, assign preferred suppliers, and receive shipments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPO(null);
                    setPrefilledPOItem(null);
                    setIsPOModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Issue Purchase Order
                </button>
              </div>

              {/* PO Table */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
                    <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
                      <tr>
                        <th className="py-4 px-4">PO Number & Date</th>
                        <th className="py-4 px-4">Supplier</th>
                        <th className="py-4 px-4">Destination Warehouse</th>
                        <th className="py-4 px-4">Expected Date</th>
                        <th className="py-4 px-4 text-center">Items Count</th>
                        <th className="py-4 px-4 text-right">Total Amount</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {purchaseOrders.map((po) => (
                        <tr key={po.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                          <td className="py-4 px-4">
                            <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                              {po.poNumber}
                            </span>
                            <span className="text-[10px] text-[#8E8A85]">Created: {po.createdAt}</span>
                          </td>

                          <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                            {po.supplierName}
                          </td>

                          <td className="py-4 px-4 text-[#F8F6F3]">
                            {po.destinationWarehouseName}
                          </td>

                          <td className="py-4 px-4 text-[#F8F6F3] font-mono text-xs">
                            {po.expectedDate}
                          </td>

                          <td className="py-4 px-4 text-center font-editorial text-sm font-bold text-[#F8F6F3]">
                            {po.items.length} SKUs
                          </td>

                          <td className="py-4 px-4 text-right font-editorial text-base font-bold text-[#C8A45D]">
                            ${po.totalAmount.toLocaleString()}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                po.status === "Completed"
                                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                  : po.status === "Receiving"
                                  ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                                  : po.status === "Issued"
                                  ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                                  : po.status === "Cancelled"
                                  ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                                  : "bg-zinc-800 text-zinc-300 border-zinc-700"
                              }`}
                            >
                              {po.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {po.status !== "Completed" && po.status !== "Cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReceivingPO(po);
                                    setIsReceiveModalOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#090909] text-[11px] font-bold rounded-[8px] transition-colors cursor-pointer"
                                >
                                  Receive Stock
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPO(po);
                                  setIsPOModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                              >
                                Edit
                              </button>

                              {po.status !== "Cancelled" && po.status !== "Completed" && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelPO(po.id)}
                                  className="px-2.5 py-1.5 bg-[#090909] hover:bg-rose-600 hover:text-white text-rose-400 text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPLIERS */}
          {activeTab === "suppliers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Supplier Directory & Ratings
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Certified textile mills, lead times, quality scores, and preferred partners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSupplier(null);
                    setIsSupplierModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Supplier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map((sup) => (
                  <div
                    key={sup.id}
                    className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-4 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                            {sup.code}
                          </span>
                          {sup.preferred && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C8A45D] text-[#090909] rounded-full">
                              Preferred Partner
                            </span>
                          )}
                        </div>
                        <h3 className="font-editorial text-2xl text-[#F8F6F3]">{sup.name}</h3>
                        <p className="text-xs text-[#8E8A85] mt-1">{sup.address}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingSupplier(sup);
                          setIsSupplierModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                      >
                        Edit Profile
                      </button>
                    </div>

                    <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#8E8A85] uppercase block">Contact</span>
                        <span className="font-semibold text-[#F8F6F3]">{sup.contactPerson}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E8A85] uppercase block">Email</span>
                        <a href={`mailto:${sup.email}`} className="text-[#C8A45D] hover:underline truncate block">
                          {sup.email}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center py-2 border-y border-[#2A2A2A]">
                      <div>
                        <span className="text-[10px] text-[#8E8A85] uppercase block font-bold">Lead Time</span>
                        <span className="font-editorial text-lg text-[#F8F6F3] font-semibold">{sup.leadTimeDays} Days</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E8A85] uppercase block font-bold">Rating</span>
                        <span className="font-editorial text-lg text-[#C8A45D] font-semibold flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#C8A45D]" /> {sup.rating}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E8A85] uppercase block font-bold">On-Time %</span>
                        <span className="font-editorial text-lg text-emerald-400 font-semibold">{sup.onTimeDeliveryRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E8A85] uppercase block font-bold">Total Spend</span>
                        <span className="font-editorial text-lg text-[#F8F6F3] font-semibold">${(sup.totalSpend / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ALERTS */}
          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Configurable Inventory Alerts & Triggers
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Threshold configurations for low stock, out of stock, overstock, and reorder points.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Sliders className="w-4 h-4" /> Edit Threshold Parameters
                </button>
              </div>

              {/* Threshold Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Low Stock Threshold</span>
                  <span className="font-editorial text-2xl font-bold text-amber-400 block">{alertsConfig.lowStockThreshold} Units</span>
                </div>
                <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Overstock Ceiling</span>
                  <span className="font-editorial text-2xl font-bold text-blue-400 block">{alertsConfig.overstockThreshold} Units</span>
                </div>
                <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Default Reorder Point</span>
                  <span className="font-editorial text-2xl font-bold text-[#C8A45D] block">{alertsConfig.reorderPointDefault} Units</span>
                </div>
                <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Stock Aging Alert</span>
                  <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">{alertsConfig.expiryWarningDays} Days</span>
                </div>
              </div>

              {/* Active Alert Triggers */}
              <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] space-y-4">
                <h3 className="font-editorial text-xl text-[#F8F6F3]">Active Alert Feed</h3>
                <div className="space-y-3">
                  {alertsConfig.activeAlerts?.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle
                          className={`w-5 h-5 ${
                            alt.level === "critical"
                              ? "text-rose-500"
                              : alt.level === "warning"
                              ? "text-amber-400"
                              : "text-blue-400"
                          }`}
                        />
                        <div>
                          <span className="font-bold text-[#F8F6F3] text-sm block">{alt.type}</span>
                          <span className="text-xs text-[#8E8A85]">{alt.message}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#C8A45D]">{alt.sku}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: WMS REPORTS */}
          {activeTab === "reports" && <WMSReports reportsData={reportsData} />}

          {/* TAB 9: IMPORT / EXPORT */}
          {activeTab === "importexport" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Import & Export Center
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  CSV batch parsing with validation preview and formatted Excel spreadsheet exports.
                </p>
              </div>

              <div className="p-8 bg-[#151515] border border-[#2A2A2A] rounded-[24px] text-center space-y-6">
                <FileSpreadsheet className="w-16 h-16 text-[#C8A45D] mx-auto" />
                <div className="max-w-md mx-auto">
                  <h3 className="font-editorial text-2xl text-[#F8F6F3]">Bulk Data Exchange</h3>
                  <p className="text-xs text-[#8E8A85] mt-1">
                    Upload stock sheets or download full inventory master tables in CSV / Excel formats.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsImportExportModalOpen(true)}
                    className="px-6 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors cursor-pointer shadow-lg"
                  >
                    Open Import / Export Center
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* ── MODALS ── */}
      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
        onSave={handleSaveWarehouse}
        warehouse={editingWarehouse}
      />

      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        onSave={handleSaveStockAdjustment}
        item={selectedInventoryItem}
        warehouses={warehouses}
      />

      <PurchaseOrderModal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        onSave={handleSavePO}
        po={editingPO}
        suppliers={suppliers}
        warehouses={warehouses}
        inventory={inventory}
        prefilledItem={prefilledPOItem}
      />

      <ReceiveStockModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onReceive={handleReceivePOShipment}
        po={receivingPO}
      />

      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
      />

      <AlertConfigModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSave={(newAlerts) => {
          setAlertsConfig(newAlerts);
          success("Alert Thresholds Saved", "Global stock alert parameters updated.");
        }}
        alertsConfig={alertsConfig}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onImportInventory={handleImportInventory}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
      />

      <Footer />
    </>
  );
}
