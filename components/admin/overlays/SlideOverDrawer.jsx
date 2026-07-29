"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function SlideOverDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className={`bg-[#121212] border-l border-[#2A2A2A] w-full ${maxWidth} h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between text-[#F8F6F3] overflow-y-auto`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
            <div>
              {subtitle && (
                <span className="font-mono text-[10px] uppercase font-bold text-[#C8A45D] block">
                  {subtitle}
                </span>
              )}
              <h2 id="slideover-title" className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                {title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 space-y-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
