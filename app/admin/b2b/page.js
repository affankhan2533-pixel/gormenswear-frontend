"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  Tag,
  DollarSign,
  TrendingUp,
  FileCheck,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Upload,
  PieChart,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

// Data Import
import {
  INITIAL_COMPANIES,
  INITIAL_PRICE_LISTS,
  INITIAL_QUOTES,
  INITIAL_B2B_POS,
  INITIAL_SALES_REPS,
  INITIAL_B2B_REPORTS,
} from "@/lib/b2bData";

// Components Import
import CompanyCard from "@/components/b2b/CompanyCard";
import CompanyModal from "@/components/b2b/CompanyModal";
import UserRoleModal from "@/components/b2b/UserRoleModal";
import WholesalePriceListTable from "@/components/b2b/WholesalePriceListTable";
import QuoteManagementTable from "@/components/b2b/QuoteManagementTable";
import QuoteModal from "@/components/b2b/QuoteModal";
import B2BPurchaseOrderModal from "@/components/b2b/B2BPurchaseOrderModal";
import SalesRepCard from "@/components/b2b/SalesRepCard";
import SalesRepModal from "@/components/b2b/SalesRepModal";
import B2BReports from "@/components/b2b/B2BReports";
import B2BImportExportModal from "@/components/b2b/B2BImportExportModal";

export default function EnterpriseB2BPage() {
  // State Management
  const [activeTab, setActiveTab] = useState("overview"); // overview, companies, pricing, quotes, pos, reps, reports, importexport
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [priceLists, setPriceLists] = useState(INITIAL_PRICE_LISTS);
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);
  const [b2bPOs, setB2bPOs] = useState(INITIAL_B2B_POS);
  const [salesReps, setSalesReps] = useState(INITIAL_SALES_REPS);
  const [reportsData, setReportsData] = useState(INITIAL_B2B_REPORTS);

  // Modals Visibility
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [isUserRoleModalOpen, setIsUserRoleModalOpen] = useState(false);
  const [managingCompanyUsers, setManagingCompanyUsers] = useState(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);

  const [isB2BPOModalOpen, setIsB2BPOModalOpen] = useState(false);
  const [editingPO, setEditingPO] = useState(null);
  const [prefilledPOQuote, setPrefilledPOQuote] = useState(null);

  const [isSalesRepModalOpen, setIsSalesRepModalOpen] = useState(false);
  const [editingSalesRep, setEditingSalesRep] = useState(null);

  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  const { success, info, error: toastError } = useToast();

  // ── KPI CALCULATIONS ──
  const kpis = useMemo(() => {
    const activeCompaniesCount = companies.filter((c) => c.creditStatus !== "Suspended").length;
    const pendingQuotesCount = quotes.filter((q) => q.status === "Requested" || q.status === "Under Review").length;
    const totalWholesaleRev = b2bPOs.reduce((sum, po) => sum + (po.status !== "Cancelled" ? po.totalAmount : 0), 0);
    const outstandingPaymentsSum = companies.reduce((sum, c) => sum + c.outstandingBalance, 0);
    const activeRepsCount = salesReps.length;

    return {
      activeCompaniesCount,
      pendingQuotesCount,
      totalWholesaleRev,
      outstandingPaymentsSum,
      activeRepsCount,
    };
  }, [companies, quotes, b2bPOs, salesReps]);

  // ── HANDLERS: COMPANY MANAGEMENT ──
  const handleSaveCompany = (compData) => {
    const exists = companies.find((c) => c.id === compData.id);
    if (exists) {
      setCompanies(companies.map((c) => (c.id === compData.id ? compData : c)));
      success("Company Profile Updated", `${compData.name} account settings saved.`);
    } else {
      setCompanies([compData, ...companies]);
      success("Company Account Registered", `${compData.name} created with Net terms.`);
    }
  };

  const handleSaveCompanyUsers = ({ companyId, contacts }) => {
    setCompanies(
      companies.map((c) => (c.id === companyId ? { ...c, contacts } : c))
    );
    success("User Roles Saved", "Authorized account contact assignments updated.");
  };

  // ── HANDLERS: QUOTE MANAGEMENT (RFQs) ──
  const handleSaveQuote = (quoteData) => {
    const exists = quotes.find((q) => q.id === quoteData.id);
    if (exists) {
      setQuotes(quotes.map((q) => (q.id === quoteData.id ? quoteData : q)));
      success("Quote Revised", `RFQ #${quoteData.quoteNumber} parameters updated.`);
    } else {
      setQuotes([quoteData, ...quotes]);
      success("Wholesale Quote Issued", `RFQ #${quoteData.quoteNumber} sent to buyer.`);
    }
  };

  const handleConvertQuoteToPO = (quoteObj) => {
    setQuotes(
      quotes.map((q) => (q.id === quoteObj.id ? { ...q, status: "Converted" } : q))
    );

    // Create automatic B2B Purchase Order
    setPrefilledPOQuote(quoteObj);
    setEditingPO(null);
    setIsB2BPOModalOpen(true);
    info("RFQ Converted", `RFQ #${quoteObj.quoteNumber} converted to B2B Purchase Order.`);
  };

  // ── HANDLERS: B2B PURCHASE ORDERS ──
  const handleSaveB2BPO = (poData) => {
    const exists = b2bPOs.find((p) => p.id === poData.id);
    if (exists) {
      setB2bPOs(b2bPOs.map((p) => (p.id === poData.id ? poData : p)));
      success("B2B PO Updated", `Purchase Order #${poData.poNumber} saved.`);
    } else {
      setB2bPOs([poData, ...b2bPOs]);
      success("B2B PO Issued", `Purchase Order #${poData.poNumber} created for ${poData.companyName}.`);
    }
  };

  // ── HANDLERS: SALES REPRESENTATIVES ──
  const handleSaveSalesRep = (repData) => {
    const exists = salesReps.find((r) => r.id === repData.id);
    if (exists) {
      setSalesReps(salesReps.map((r) => (r.id === repData.id ? repData : r)));
      success("Sales Rep Updated", `${repData.name} portfolio profile saved.`);
    } else {
      setSalesReps([repData, ...salesReps]);
      success("Sales Rep Registered", `${repData.name} onboarded to ${repData.region}.`);
    }
  };

  // ── HANDLERS: IMPORT / EXPORT ──
  const handleExportCSV = () => {
    const header = "CompanyCode,CompanyName,TaxID,Industry,Tier,CreditLimit,OutstandingBalance,PaymentTerms,CreditStatus\n";
    const rows = companies
      .map(
        (c) =>
          `"${c.code}","${c.name}","${c.taxId}","${c.industry}","${c.tier}",${c.creditLimit},${c.outstandingBalance},"${c.paymentTerms}","${c.creditStatus}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_B2B_Companies_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    success("CSV Exported", "B2B Companies data sheet downloaded.");
  };

  const handleExportExcel = () => {
    const xmlHeader = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="B2B Accounts">
<Table>
<Row>
<Cell><Data ss:Type="String">Code</Data></Cell>
<Cell><Data ss:Type="String">Company Name</Data></Cell>
<Cell><Data ss:Type="String">Tax ID</Data></Cell>
<Cell><Data ss:Type="String">Tier</Data></Cell>
<Cell><Data ss:Type="String">Credit Limit</Data></Cell>
<Cell><Data ss:Type="String">Payment Terms</Data></Cell>
</Row>`;

    const xmlBody = companies
      .map(
        (c) => `<Row>
<Cell><Data ss:Type="String">${c.code}</Data></Cell>
<Cell><Data ss:Type="String">${c.name}</Data></Cell>
<Cell><Data ss:Type="String">${c.taxId}</Data></Cell>
<Cell><Data ss:Type="String">${c.tier}</Data></Cell>
<Cell><Data ss:Type="Number">${c.creditLimit}</Data></Cell>
<Cell><Data ss:Type="String">${c.paymentTerms}</Data></Cell>
</Row>`
      )
      .join("");

    const xmlFooter = `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlHeader + xmlBody + xmlFooter], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_B2B_Master_${new Date().toISOString().split("T")[0]}.xls`;
    a.click();
    success("Excel Sheet Exported", "Excel formatted workbook downloaded.");
  };

  const handleImportCompanies = (parsedRows) => {
    const newComps = parsedRows.map((r, idx) => ({
      id: `cmp-imp-${Date.now()}-${idx}`,
      code: r.CompanyCode || `CMP-IMP-${idx}`,
      name: r.CompanyName || "Imported Corporate Account",
      taxId: r.TaxID || "VAT-PENDING",
      industry: r.Industry || "Wholesale Retail",
      tier: r.Tier || "VIP Tier 1",
      creditLimit: Number(r.CreditLimit || 100000),
      outstandingBalance: 0,
      creditStatus: "Approved",
      paymentTerms: r.PaymentTerms || "Net 30",
      assignedSalesRepId: salesReps[0].id,
      assignedSalesRepName: salesReps[0].name,
      billingAddress: {
        street: r.Street || "Main St",
        city: r.City || "New York",
        region: "NY",
        country: r.Country || "United States",
        zip: r.Zip || "10001",
      },
      shippingAddresses: [
        { id: `ship-${idx}`, name: "Primary Warehouse", street: r.Street || "Main St", city: r.City || "New York", country: r.Country || "United States", zip: r.Zip || "10001" },
      ],
      contacts: [
        { id: `cnt-${idx}`, name: "Authorized Buyer", email: "buyer@company.com", phone: "+1 555 0100", role: "Company Owner" },
      ],
      createdAt: new Date().toISOString().split("T")[0],
    }));

    setCompanies([...newComps, ...companies]);
    success("B2B Accounts Imported", `Successfully created ${newComps.length} corporate accounts.`);
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
                    <Building2 className="w-4 h-4" /> ENTERPRISE B2B COMMERCE
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  B2B & Wholesale Commerce Operations
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
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
                    setEditingQuote(null);
                    setIsQuoteModalOpen(true);
                  }}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C8A45D]" />
                  <span>Issue RFQ Quote</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCompany(null);
                    setIsCompanyModalOpen(true);
                  }}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register B2B Company</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "Executive Overview" },
                { id: "companies", label: `Corporate Accounts (${kpis.activeCompaniesCount})` },
                { id: "pricing", label: "Wholesale Price Lists" },
                { id: "quotes", label: `Quote Requests (${quotes.length})` },
                { id: "pos", label: `B2B Purchase Orders (${b2bPOs.length})` },
                { id: "reps", label: `Sales Representatives (${salesReps.length})` },
                { id: "reports", label: "B2B Analytics Reports" },
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <Building2 className="w-4 h-4 text-[#C8A45D]" />
                <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Active Companies
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {kpis.activeCompaniesCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-purple-400">PENDING</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Pending Quotes (RFQs)
              </span>
              <span className="font-editorial text-2xl font-bold text-purple-400 block">
                {kpis.pendingQuotesCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <DollarSign className="w-4 h-4 text-[#C8A45D]" />
                <span className="text-[10px] font-bold text-emerald-400">B2B SALES</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Wholesale Revenue
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                ${(kpis.totalWholesaleRev / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400">AR BALANCE</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Outstanding Payments
              </span>
              <span className="font-editorial text-2xl font-bold text-amber-400 block">
                ${(kpis.outstandingPaymentsSum / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <div className="flex justify-between items-center text-[#8E8A85]">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400">REPS</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Active Sales Reps
              </span>
              <span className="font-editorial text-2xl font-bold text-blue-400 block">
                {kpis.activeRepsCount} Reps
              </span>
            </div>
          </div>

          {/* ── 2. TAB CONTENT VIEWS ── */}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Corporate Accounts Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                      Corporate Accounts & Credit Status
                    </h2>
                    <p className="text-xs text-[#8E8A85]">
                      Active B2B buyers, Net payment terms, and assigned sales representatives.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCompany(null);
                      setIsCompanyModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[10px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add B2B Account
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companies.map((comp) => (
                    <CompanyCard
                      key={comp.id}
                      company={comp}
                      onEdit={(c) => {
                        setEditingCompany(c);
                        setIsCompanyModalOpen(true);
                      }}
                      onManageUsers={(c) => {
                        setManagingCompanyUsers(c);
                        setIsUserRoleModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Pending Quote Requests Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                    Pending Wholesale Quotes (RFQs)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("quotes")}
                    className="text-xs text-[#C8A45D] font-bold hover:underline flex items-center gap-1"
                  >
                    Manage All RFQs <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <QuoteManagementTable
                  quotes={quotes}
                  onReviseQuote={(q) => {
                    setEditingQuote(q);
                    setIsQuoteModalOpen(true);
                  }}
                  onConvertToPO={handleConvertQuoteToPO}
                />
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY ACCOUNTS */}
          {activeTab === "companies" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Corporate Accounts Directory
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Manage company credit limits, Net 15/30/60 payment terms, VAT IDs, and address books.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCompany(null);
                    setIsCompanyModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Register B2B Account
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((comp) => (
                  <CompanyCard
                    key={comp.id}
                    company={comp}
                    onEdit={(c) => {
                      setEditingCompany(c);
                      setIsCompanyModalOpen(true);
                    }}
                    onManageUsers={(c) => {
                      setManagingCompanyUsers(c);
                      setIsUserRoleModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHOLESALE PRICE LISTS */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Wholesale Price Lists & Tier Pricing
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Configure company-specific price catalogs, volume discount tiers (1-50, 51-200, 201+ units), and private collections.
                </p>
              </div>

              <WholesalePriceListTable
                priceLists={priceLists}
                onEditPriceList={(pl) => {
                  info("Price List Editor", `Editing contract rules for ${pl.name}.`);
                }}
              />
            </div>
          )}

          {/* TAB 4: QUOTE MANAGEMENT */}
          {activeTab === "quotes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Quote Management & RFQ Workflow
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Review request for quotes, revise discount percentages, set expiration dates, and convert to POs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuote(null);
                    setIsQuoteModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Issue RFQ Quote
                </button>
              </div>

              <QuoteManagementTable
                quotes={quotes}
                onReviseQuote={(q) => {
                  setEditingQuote(q);
                  setIsQuoteModalOpen(true);
                }}
                onConvertToPO={handleConvertQuoteToPO}
              />
            </div>
          )}

          {/* TAB 5: B2B PURCHASE ORDERS */}
          {activeTab === "pos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Corporate Purchase Orders & Net Terms
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Track Net 15/30/60 invoices, manager approval sign-offs, and payment status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPO(null);
                    setPrefilledPOQuote(null);
                    setIsB2BPOModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Issue B2B PO
                </button>
              </div>

              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
                    <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
                      <tr>
                        <th className="py-4 px-4">PO Number & Date</th>
                        <th className="py-4 px-4">Company Account</th>
                        <th className="py-4 px-4">Terms & Due Date</th>
                        <th className="py-4 px-4">Approval Sign-off</th>
                        <th className="py-4 px-4 text-right">Total Order Amount</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {b2bPOs.map((po) => (
                        <tr key={po.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                          <td className="py-4 px-4">
                            <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                              {po.poNumber}
                            </span>
                            <span className="text-[10px] text-[#8E8A85]">Date: {po.orderDate}</span>
                          </td>

                          <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                            {po.companyName}
                          </td>

                          <td className="py-4 px-4 text-[#F8F6F3]">
                            <span className="block font-bold">{po.paymentTerms}</span>
                            <span className="text-[10px] text-[#8E8A85]">Due: {po.dueDate}</span>
                          </td>

                          <td className="py-4 px-4 text-[#8E8A85]">
                            <span className="text-[#F8F6F3] block font-medium">
                              {po.approvalSignoff?.name}
                            </span>
                            <span className="text-[10px]">Signed: {po.approvalSignoff?.date}</span>
                          </td>

                          <td className="py-4 px-4 text-right font-editorial text-base font-bold text-[#C8A45D]">
                            ${po.totalAmount.toLocaleString()}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                po.status === "Paid"
                                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                  : po.status === "Shipped" || po.status === "In Production"
                                  ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                                  : po.status === "Overdue"
                                  ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                                  : "bg-zinc-800 text-zinc-300 border-zinc-700"
                              }`}
                            >
                              {po.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPO(po);
                                setPrefilledPOQuote(null);
                                setIsB2BPOModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                            >
                              Edit PO
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SALES REPRESENTATIVES */}
          {activeTab === "reps" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Sales Representative Portfolios & Commission
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Manage territory accounts, track activity timelines, and compute earned commissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSalesRep(null);
                    setIsSalesRepModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Sales Rep
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salesReps.map((rep) => (
                  <SalesRepCard
                    key={rep.id}
                    rep={rep}
                    onEdit={(r) => {
                      setEditingSalesRep(r);
                      setIsSalesRepModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS */}
          {activeTab === "reports" && <B2BReports reportsData={reportsData} />}

          {/* TAB 8: IMPORT / EXPORT */}
          {activeTab === "importexport" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  B2B Import & Export Data Hub
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
                    Upload corporate company CSVs or download full wholesale pricing and account sheets.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsImportExportModalOpen(true)}
                    className="px-6 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors cursor-pointer shadow-lg"
                  >
                    Open B2B Import / Export Center
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* ── MODALS ── */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSave={handleSaveCompany}
        company={editingCompany}
        salesReps={salesReps}
      />

      <UserRoleModal
        isOpen={isUserRoleModalOpen}
        onClose={() => setIsUserRoleModalOpen(false)}
        onSave={handleSaveCompanyUsers}
        company={managingCompanyUsers}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSave={handleSaveQuote}
        quote={editingQuote}
        companies={companies}
      />

      <B2BPurchaseOrderModal
        isOpen={isB2BPOModalOpen}
        onClose={() => setIsB2BPOModalOpen(false)}
        onSave={handleSaveB2BPO}
        po={editingPO}
        companies={companies}
        prefilledQuote={prefilledPOQuote}
      />

      <SalesRepModal
        isOpen={isSalesRepModalOpen}
        onClose={() => setIsSalesRepModalOpen(false)}
        onSave={handleSaveSalesRep}
        rep={editingSalesRep}
      />

      <B2BImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onImportCompanies={handleImportCompanies}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
      />

      <Footer />
    </>
  );
}
