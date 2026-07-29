"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Sliders,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Upload,
  ExternalLink,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

// Data Imports
import {
  INITIAL_VENDORS,
  INITIAL_MARKETPLACE_PRODUCTS,
  INITIAL_MARKETPLACE_ORDERS,
  INITIAL_VENDOR_PAYOUTS,
  INITIAL_MARKETPLACE_RULES,
  INITIAL_MARKETPLACE_ANALYTICS,
} from "@/lib/vendorData";

// Components Import
import VendorCard from "@/components/marketplace/VendorCard";
import VendorModal from "@/components/marketplace/VendorModal";
import VendorPortalView from "@/components/marketplace/VendorPortalView";
import MarketplaceProductTable from "@/components/marketplace/MarketplaceProductTable";
import ProductApprovalModal from "@/components/marketplace/ProductApprovalModal";
import MarketplaceOrderTable from "@/components/marketplace/MarketplaceOrderTable";
import VendorPayoutTable from "@/components/marketplace/VendorPayoutTable";
import MarketplaceRulesConfig from "@/components/marketplace/MarketplaceRulesConfig";
import MarketplaceAnalytics from "@/components/marketplace/MarketplaceAnalytics";
import MarketplaceImportExportModal from "@/components/marketplace/MarketplaceImportExportModal";

export default function EnterpriseMarketplacePage() {
  // State Management
  const [activeTab, setActiveTab] = useState("overview"); // overview, directory, portal, products, orders, payouts, rules, analytics, importexport
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [products, setProducts] = useState(INITIAL_MARKETPLACE_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_MARKETPLACE_ORDERS);
  const [payouts, setPayouts] = useState(INITIAL_VENDOR_PAYOUTS);
  const [rules, setRules] = useState(INITIAL_MARKETPLACE_RULES);
  const [analyticsData, setAnalyticsData] = useState(INITIAL_MARKETPLACE_ANALYTICS);

  // Vendor Portal Active Simulation Target
  const [activePortalVendor, setActivePortalVendor] = useState(INITIAL_VENDORS[0]);

  // Modal Visibilities
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [moderatingProduct, setModeratingProduct] = useState(null);

  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  const { success, info, error: toastError } = useToast();

  // ── KPI CALCULATIONS ──
  const kpis = useMemo(() => {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter((v) => v.verificationStatus === "Approved").length;
    const pendingApps = vendors.filter((v) => v.verificationStatus === "Pending Review").length;
    const gmvRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    return {
      totalVendors,
      activeVendors,
      pendingApps,
      gmvRevenue,
      totalOrders,
      totalProducts,
    };
  }, [vendors, orders, products]);

  // ── HANDLERS: VENDORS ──
  const handleSaveVendor = (vendorData) => {
    const exists = vendors.find((v) => v.id === vendorData.id);
    if (exists) {
      setVendors(vendors.map((v) => (v.id === vendorData.id ? vendorData : v)));
      success("Vendor Profile Updated", `${vendorData.companyName} parameters saved.`);
    } else {
      setVendors([vendorData, ...vendors]);
      success("Vendor Registered", `${vendorData.companyName} onboarded to marketplace.`);
    }
  };

  const handleLaunchPortal = (vendorObj) => {
    setActivePortalVendor(vendorObj);
    setActiveTab("portal");
    info("Vendor Portal Launched", `Switched workspace to ${vendorObj.companyName}.`);
  };

  // ── HANDLERS: PRODUCTS & MODERATION ──
  const handleSaveProductModeration = (productData) => {
    setProducts(products.map((p) => (p.id === productData.id ? productData : p)));
    success("Product Moderated", `${productData.productName} status set to ${productData.approvalStatus}.`);
  };

  const handleUpdateInventoryInPortal = (productId, newStock) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, stockLevel: newStock } : p))
    );
    success("Stock Updated", `Inventory adjusted to ${newStock} units.`);
  };

  // ── HANDLERS: PAYOUTS ──
  const handleMarkPayoutPaid = (payoutId) => {
    setPayouts(
      payouts.map((p) => (p.id === payoutId ? { ...p, status: "Paid" } : p))
    );
    success("Payout Released", "Vendor settlement payment marked as Paid.");
  };

  // ── HANDLERS: RULES ──
  const handleSaveRules = (newRules) => {
    setRules(newRules);
    success("Marketplace Rules Saved", "Global commission & governance rules updated.");
  };

  // ── HANDLERS: IMPORT / EXPORT ──
  const handleExportVendorsCSV = () => {
    const header = "VendorCode,CompanyName,ContactPerson,Email,Phone,TaxID,Status,CommissionRate,TotalSales\n";
    const rows = vendors
      .map(
        (v) =>
          `"${v.code}","${v.companyName}","${v.contactPerson}","${v.email}","${v.phone}","${v.taxId}","${v.verificationStatus}",${v.commissionRate},${v.totalSales}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_Marketplace_Vendors_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    success("CSV Exported", "Marketplace vendor profiles exported.");
  };

  const handleExportVendorsExcel = () => {
    const xmlHeader = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Marketplace Vendors">
<Table>
<Row>
<Cell><Data ss:Type="String">Code</Data></Cell>
<Cell><Data ss:Type="String">Company Name</Data></Cell>
<Cell><Data ss:Type="String">Tax ID</Data></Cell>
<Cell><Data ss:Type="String">Status</Data></Cell>
<Cell><Data ss:Type="Number">Commission %</Data></Cell>
<Cell><Data ss:Type="Number">Total Sales</Data></Cell>
</Row>`;

    const xmlBody = vendors
      .map(
        (v) => `<Row>
<Cell><Data ss:Type="String">${v.code}</Data></Cell>
<Cell><Data ss:Type="String">${v.companyName}</Data></Cell>
<Cell><Data ss:Type="String">${v.taxId}</Data></Cell>
<Cell><Data ss:Type="String">${v.verificationStatus}</Data></Cell>
<Cell><Data ss:Type="Number">${v.commissionRate}</Data></Cell>
<Cell><Data ss:Type="Number">${v.totalSales}</Data></Cell>
</Row>`
      )
      .join("");

    const xmlFooter = `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlHeader + xmlBody + xmlFooter], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_Marketplace_Master_${new Date().toISOString().split("T")[0]}.xls`;
    a.click();
    success("Excel Exported", "Excel formatted workbook downloaded.");
  };

  const handleImportVendors = (parsedRows) => {
    const newVnds = parsedRows.map((r, idx) => ({
      id: `vnd-imp-${Date.now()}-${idx}`,
      code: r.VendorCode || `VND-IMP-${idx}`,
      companyName: r.CompanyName || "Imported Vendor Enterprise",
      contactPerson: r.ContactPerson || "Vendor Representative",
      email: r.Email || "vendor@enterprise.com",
      phone: r.Phone || "+1 555 0199",
      taxId: r.TaxID || "VAT-PENDING",
      verificationStatus: "Approved",
      commissionRate: Number(r.CommissionRate || 15),
      totalSales: 0,
      activeProductsCount: 0,
      rating: 5.0,
      storeProfile: {
        description: "Imported marketplace vendor profile.",
        country: r.Country || "Italy",
        city: r.City || "Milan",
        returnPolicy: "30-day standard return policy",
        joinedDate: new Date().toISOString().split("T")[0],
      },
    }));

    setVendors([...newVnds, ...vendors]);
    success("Vendors Imported", `Successfully onboarded ${newVnds.length} marketplace vendors.`);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none relative font-sans">
        
        {/* Header */}
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
                    <Building2 className="w-4 h-4" /> ENTERPRISE MARKETPLACE MANAGEMENT
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Vendor & Marketplace Platform
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportExportModalOpen(true)}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Import / Export Center</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingVendor(null);
                    setIsVendorModalOpen(true);
                  }}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Vendor</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "Executive Overview" },
                { id: "directory", label: `Vendor Directory (${kpis.totalVendors})` },
                { id: "portal", label: `Vendor Portal (${activePortalVendor?.companyName || "Portal"})` },
                { id: "products", label: `Products & Approval (${products.length})` },
                { id: "orders", label: `Marketplace Orders (${orders.length})` },
                { id: "payouts", label: `Vendor Payouts (${payouts.length})` },
                { id: "rules", label: "Governance Rules" },
                { id: "analytics", label: "Marketplace Analytics" },
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Total Vendors
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {kpis.totalVendors}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Active Approved
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                {kpis.activeVendors}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Pending Applications
              </span>
              <span className="font-editorial text-2xl font-bold text-amber-400 block">
                {kpis.pendingApps}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Marketplace Revenue
              </span>
              <span className="font-editorial text-2xl font-bold text-[#C8A45D] block">
                ${(kpis.gmvRevenue / 1000).toFixed(1)}k
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Marketplace Orders
              </span>
              <span className="font-editorial text-2xl font-bold text-blue-400 block">
                {kpis.totalOrders} Orders
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Marketplace Products
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {kpis.totalProducts} Items
              </span>
            </div>
          </div>

          {/* ── 2. TAB CONTENT VIEWS ── */}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Vendor Directory Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                      Active Marketplace Vendors
                    </h2>
                    <p className="text-xs text-[#8E8A85]">
                      Onboarded brand partners, Tuscan leather mills, and bespoke tailoring ateliers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVendor(null);
                      setIsVendorModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[10px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Vendor
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vendors.map((v) => (
                    <VendorCard
                      key={v.id}
                      vendor={v}
                      onEdit={(vendorObj) => {
                        setEditingVendor(vendorObj);
                        setIsVendorModalOpen(true);
                      }}
                      onLaunchPortal={handleLaunchPortal}
                    />
                  ))}
                </div>
              </div>

              {/* Product Approval Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                    Product Assignments & Approval Moderation
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className="text-xs text-[#C8A45D] font-bold hover:underline flex items-center gap-1"
                  >
                    View All Products <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <MarketplaceProductTable
                  products={products}
                  onModerateProduct={(p) => {
                    setModeratingProduct(p);
                    setIsApprovalModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: VENDOR DIRECTORY */}
          {activeTab === "directory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Marketplace Vendor Directory
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Manage vendor onboarding applications, tax IDs, commission rates, and status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingVendor(null);
                    setIsVendorModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Onboard New Vendor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendors.map((v) => (
                  <VendorCard
                    key={v.id}
                    vendor={v}
                    onEdit={(vendorObj) => {
                      setEditingVendor(vendorObj);
                      setIsVendorModalOpen(true);
                    }}
                    onLaunchPortal={handleLaunchPortal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VENDOR PORTAL SIMULATION */}
          {activeTab === "portal" && activePortalVendor && (
            <VendorPortalView
              vendor={activePortalVendor}
              products={products}
              orders={orders}
              onBackToDirectory={() => setActiveTab("directory")}
              onUpdateInventory={handleUpdateInventoryInPortal}
            />
          )}

          {/* TAB 4: PRODUCTS & APPROVAL */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Product Assignments & Approval Workflow
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Moderate vendor product submissions, set custom commission percentages, and categorize product types.
                </p>
              </div>

              <MarketplaceProductTable
                products={products}
                onModerateProduct={(p) => {
                  setModeratingProduct(p);
                  setIsApprovalModalOpen(true);
                }}
              />
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Marketplace Orders & Fulfillment
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Track multi-vendor customer orders, fulfillment status, shipment tracking, and return requests.
                </p>
              </div>

              <MarketplaceOrderTable
                orders={orders}
                onUpdateFulfillment={() => {}}
              />
            </div>
          )}

          {/* TAB 6: PAYOUTS */}
          {activeTab === "payouts" && (
            <div className="space-y-6">
              <VendorPayoutTable
                payouts={payouts}
                onMarkPayoutPaid={handleMarkPayoutPaid}
              />
            </div>
          )}

          {/* TAB 7: RULES */}
          {activeTab === "rules" && (
            <MarketplaceRulesConfig
              rules={rules}
              onSaveRules={handleSaveRules}
            />
          )}

          {/* TAB 8: ANALYTICS */}
          {activeTab === "analytics" && <MarketplaceAnalytics analyticsData={analyticsData} />}

        </Container>
      </main>

      {/* ── MODALS ── */}
      <VendorModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSave={handleSaveVendor}
        vendor={editingVendor}
      />

      <ProductApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onSave={handleSaveProductModeration}
        product={moderatingProduct}
      />

      <MarketplaceImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onImportVendors={handleImportVendors}
        onExportVendorsCSV={handleExportVendorsCSV}
        onExportVendorsExcel={handleExportVendorsExcel}
      />

      <Footer />
    </>
  );
}
