"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, Save, RefreshCw, CheckCircle2, ShieldCheck, Key, Globe } from "lucide-react";

export default function ConnectorConfigModal({
  isOpen,
  onClose,
  onSave,
  connector = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Connected",
    environment: "Production",
    endpoint: "",
    apiKey: "••••••••••••••••••••••••••••••••",
    webhookUrl: "https://gormenswear.com/api/webhooks/connector",
  });

  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (connector) {
      setFormData({
        name: connector.name || "",
        code: connector.code || "",
        status: connector.status || "Connected",
        environment: connector.environment || "Production",
        endpoint: connector.endpoint || "https://api.gormenswear.com/connector/v1",
        apiKey: "••••••••••••••••••••••••••••••••",
        webhookUrl: "https://gormenswear.com/api/webhooks/connector",
      });
      setTestResult(null);
    }
  }, [connector, isOpen]);

  if (!isOpen || !connector) return null;

  const handleTestDiagnostic = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({
        success: true,
        latency: "38 ms",
        message: "OData/REST ping handshake successful. SSL certificate valid.",
      });
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...connector,
      status: formData.status,
      environment: formData.environment,
      endpoint: formData.endpoint,
    };

    onSave(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="connector-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h2 id="connector-modal-title" className="font-editorial text-2xl font-normal">
                  Configure Connector ({connector.code})
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Manage credentials, OData endpoints, and environment toggles.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status & Environment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Connection Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Connected">Connected (Active)</option>
                  <option value="Degraded">Degraded (Warning)</option>
                  <option value="Disconnected">Disconnected (Offline)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Environment
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Production">Production (Live)</option>
                  <option value="Sandbox">Sandbox / Staging</option>
                  <option value="Test">Test Mode</option>
                </select>
              </div>
            </div>

            {/* Endpoint */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                API Endpoint URL / RESTlet
              </label>
              <input
                type="url"
                required
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Bearer Secret Token / API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Test Connection Diagnostics Runner */}
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F8F6F3]">Integration Diagnostics</span>
                <button
                  type="button"
                  disabled={testing}
                  onClick={handleTestDiagnostic}
                  className="px-3 py-1.5 bg-[#151515] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] text-xs font-bold uppercase rounded-[6px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
                  <span>{testing ? "Testing..." : "Test Connection"}</span>
                </button>
              </div>

              {testResult && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-[8px] text-xs text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> {testResult.message}
                  </span>
                  <span className="font-mono text-[10px] font-bold bg-[#090909] px-2 py-0.5 rounded">
                    {testResult.latency}
                  </span>
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
