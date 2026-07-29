"use client";

import { useRef } from "react";
import { Printer, X, Download, Building2, Calendar, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrderInvoiceModal({ isOpen, order, onClose }) {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const printDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#141414] border border-[#2A2A2A] rounded-[20px] shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#0D0D0D] print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#C8A45D]" />
            <span className="text-sm font-bold text-[#E8E4DF]">Official Order Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#666] hover:text-[#E8E4DF] rounded-[6px] hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Canvas */}
        <div ref={invoiceRef} className="p-6 sm:p-10 space-y-6 text-[#E8E4DF] print:p-0 print:text-black">
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#262626] pb-6 gap-4 print:border-gray-300">
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-[#F8F6F3] print:text-black">
                GOR <span className="text-[#C8A45D] font-normal text-xs font-mono">MENSWEAR</span>
              </h1>
              <p className="text-xs text-[#888] mt-1 print:text-gray-600">
                Precision Tailoring & Luxury Menswear Atelier
              </p>
              <p className="text-[11px] text-[#666] mt-0.5 print:text-gray-500">
                Mayfair Flagship Store, London, UK | support@gormenswear.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#C8A45D]/15 text-[#C8A45D] border border-[#C8A45D]/30 font-mono text-xs font-bold rounded-full mb-1 print:border-gray-400 print:text-black">
                INVOICE #{order.orderNo}
              </span>
              <p className="text-xs text-[#888] print:text-gray-600">
                Order Date: <span className="text-[#F8F6F3] font-semibold print:text-black">{formattedDate}</span>
              </p>
              <p className="text-xs text-[#888] print:text-gray-600">
                Printed: <span className="text-[#888] print:text-gray-600">{printDate}</span>
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="bg-[#0D0D0D] p-4 rounded-[12px] border border-[#222222] print:bg-gray-50 print:border-gray-300">
              <p className="text-[10px] font-bold text-[#C8A45D] uppercase tracking-wider mb-2">
                Billed To (Customer)
              </p>
              <p className="font-bold text-[#F8F6F3] text-sm print:text-black">{order.customerName}</p>
              <p className="text-[#888] mt-0.5 print:text-gray-600">{order.customerEmail}</p>
              <p className="text-[#888] print:text-gray-600">{order.customerPhone || "N/A"}</p>
            </div>

            <div className="bg-[#0D0D0D] p-4 rounded-[12px] border border-[#222222] print:bg-gray-50 print:border-gray-300">
              <p className="text-[10px] font-bold text-[#C8A45D] uppercase tracking-wider mb-2">
                Shipping Destination
              </p>
              <p className="text-[#E8E4DF] font-medium print:text-black">
                {order.shippingAddress?.address || "Address on File"}
              </p>
              <p className="text-[#888] mt-0.5 print:text-gray-600">
                {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-[#888] print:text-gray-600">{order.shippingAddress?.country || "India"}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#222222] rounded-[12px] overflow-hidden print:border-gray-300">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0D0D0D] border-b border-[#222222] text-[#888] font-bold uppercase tracking-wider print:bg-gray-100 print:text-black">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A] print:divide-gray-200">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#161616] print:hover:bg-transparent">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#E8E4DF] print:text-black">{item.name}</p>
                      {item.size && <span className="text-[10px] text-[#777] mr-2">Size: {item.size}</span>}
                      {item.color && <span className="text-[10px] text-[#777]">Color: {item.color}</span>}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#777] print:text-gray-600">
                      {item.sku || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-[#E8E4DF] print:text-black">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#E8E4DF] print:text-black">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#E8E4DF] print:text-black">
                      {formatPrice(item.itemTotal || item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-[#666] max-w-sm space-y-1 print:text-gray-500">
              <p className="font-bold text-[#E8E4DF] print:text-black">Payment Terms & Method:</p>
              <p>Payment Method: <span className="uppercase text-[#C8A45D] font-mono">{order.paymentMethod || "COD"}</span></p>
              <p>Payment Status: <span className="font-semibold text-[#E8E4DF] print:text-black">{order.paymentStatus}</span></p>
              <p className="text-[10px] pt-1">Thank you for choosing GOR Menswear Luxury Atelier.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs bg-[#0D0D0D] p-4 rounded-[12px] border border-[#222222] print:bg-gray-50 print:border-gray-300">
              <div className="flex justify-between text-[#888] print:text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono text-[#E8E4DF] print:text-black">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888] print:text-gray-600">
                <span>Shipping Fee:</span>
                <span className="font-mono text-[#E8E4DF] print:text-black">
                  {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-[#888] print:text-gray-600">
                  <span>Estimated Tax:</span>
                  <span className="font-mono text-[#E8E4DF] print:text-black">{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="border-t border-[#262626] pt-2 flex justify-between text-sm font-bold text-[#C8A45D] print:text-black">
                <span>Grand Total:</span>
                <span className="font-mono">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
