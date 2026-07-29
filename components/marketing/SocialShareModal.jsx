"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Copy, Check, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function handleShareContent({ title, text, url }, fallbackOpenModal) {
  const targetUrl = url || typeof window !== "undefined" ? window.location.href : "";

  if (typeof navigator !== "undefined" && navigator.share) {
    navigator
      .share({
        title: title || "GOR Menswear",
        text: text || "Discover luxury tailoring and streetwear on GOR Menswear",
        url: targetUrl,
      })
      .catch(() => {});
  } else if (fallbackOpenModal) {
    fallbackOpenModal();
  }
}

export default function SocialShareModal({
  isOpen,
  onClose,
  title = "GOR Menswear",
  text = "Discover luxury tailoring and streetwear on GOR Menswear",
  url,
}) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      success("Link Copied", "Link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageSquare,
      color: "bg-emerald-600 hover:bg-emerald-500",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    },
    {
      name: "Facebook",
      icon: Send,
      color: "bg-blue-600 hover:bg-blue-500",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "X (Twitter)",
      icon: Share2,
      color: "bg-zinc-800 hover:bg-zinc-700",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-[#090909]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-sm w-full shadow-2xl space-y-5 font-sans select-none relative"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              Share Piece
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {shareLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-[12px] text-[#F8F6F3] font-sans text-xs font-semibold gap-1.5 transition-all shadow-md ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-[#2A2A2A]">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] font-bold block mb-1.5">
              Direct Link
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#8E8A85] outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="h-10 px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
