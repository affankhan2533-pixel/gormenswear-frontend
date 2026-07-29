"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Download, FileSpreadsheet, FileText, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function MarketplaceImportExportModal({
  isOpen,
  onClose,
  onImportVendors,
  onExportVendorsCSV,
  onExportVendorsExcel,
}) {
  const [csvText, setCsvText] = useState("");
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState("");
  const [importing, setImporting] = useState(false);

  if (!isOpen) return null;

  const sampleCSV = `VendorCode,CompanyName,ContactPerson,Email,Phone,TaxID,CommissionRate,City,Country
VND-VENICE-IT,Venetian Silk Atelier,Marco Bellini,m.bellini@venice-silk.it,+39 041 520 900,VAT-IT-901284,15,Venice,Italy
VND-GENEVA-CH,Geneva Horology Atelier,Henri Laurent,h.laurent@genevahorology.ch,+41 22 710 9940,CHE-114.920.102,20,Geneva,Switzerland`;

  const handleParseCSV = (text) => {
    setCsvText(text);
    setParseError("");
    if (!text.trim()) {
      setParsedRows([]);
      return;
    }

    try {
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        setParseError("CSV must contain at least a header row and 1 data row.");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length === headers.length) {
          const rowObj = {};
          headers.forEach((h, index) => {
            rowObj[h] = values[index];
          });
          rows.push(rowObj);
        }
      }

      setParsedRows(rows);
    } catch (err) {
      setParseError("Failed to parse CSV syntax. Ensure comma separation.");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleParseCSV(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    setTimeout(() => {
      onImportVendors(parsedRows);
      setImporting(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="marketplace-import-export-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 id="marketplace-import-export-title" className="font-editorial text-2xl font-normal">
                  Marketplace Import & Export Data Center
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Bulk import vendor profiles and export multi-vendor sales reports.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Export Section */}
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Marketplace Datasets
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onExportVendorsCSV}
                className="px-4 py-2 bg-[#151515] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Export Vendors CSV
              </button>

              <button
                type="button"
                onClick={onExportVendorsExcel}
                className="px-4 py-2 bg-[#151515] hover:bg-emerald-400 hover:text-[#090909] text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export Excel (.XLSX) Workbook
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
              <Upload className="w-4 h-4" /> Bulk Vendor Registration CSV Import
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="block w-full text-xs text-[#8E8A85] file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-xs file:font-bold file:bg-[#090909] file:text-[#C8A45D] hover:file:bg-[#2A2A2A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#8E8A85] uppercase">
                  Or Paste Raw CSV Data
                </label>
                <button
                  type="button"
                  onClick={() => handleParseCSV(sampleCSV)}
                  className="text-[11px] text-[#C8A45D] hover:underline"
                >
                  Load Sample Format
                </button>
              </div>
              <textarea
                rows="4"
                value={csvText}
                onChange={(e) => handleParseCSV(e.target.value)}
                placeholder="VendorCode,CompanyName,ContactPerson,Email,Phone,TaxID..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[12px] p-3 text-xs font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
              />
            </div>

            {parseError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/30 rounded-[10px] text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {parseError}
              </div>
            )}

            {/* Validation Preview */}
            {parsedRows.length > 0 && (
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-2">
                <span className="font-bold text-xs text-[#F8F6F3] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Parsed & Validated{" "}
                  {parsedRows.length} Vendors
                </span>

                <div className="max-h-36 overflow-y-auto border border-[#2A2A2A] rounded-[8px]">
                  <table className="w-full text-left text-[11px] text-[#8E8A85]">
                    <thead className="bg-[#151515] text-[#F8F6F3] font-bold">
                      <tr>
                        <th className="p-2">Code</th>
                        <th className="p-2">Company</th>
                        <th className="p-2">Contact</th>
                        <th className="p-2">Commission %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {parsedRows.map((r, i) => (
                        <tr key={i}>
                          <td className="p-2 font-mono text-[#C8A45D]">{r.VendorCode}</td>
                          <td className="p-2 text-[#F8F6F3]">{r.CompanyName}</td>
                          <td className="p-2">{r.ContactPerson}</td>
                          <td className="p-2 font-bold text-emerald-400">{r.CommissionRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0 || importing}
              onClick={handleExecuteImport}
              className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Execute Vendor Import ({parsedRows.length})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
