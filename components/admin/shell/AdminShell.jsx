"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminProvider } from "../providers/AdminProvider";
import AdminSidebar from "../navigation/AdminSidebar";
import AdminTopBar from "../navigation/AdminTopBar";

function ShellContent({ children }) {
  const [compact, setCompact] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Lock body scrolling while mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  return (
    <div className="flex h-screen bg-[#0F1115] text-[#F5F3EF] overflow-hidden font-sans">
      {/* Desktop Sidebar (Only visible on lg: 1024px and above) */}
      <div className="hidden lg:flex h-full shrink-0">
        <AdminSidebar isCompact={compact} onToggle={() => setCompact((v) => !v)} />
      </div>

      {/* Mobile Slide-Over Drawer (< 1024px) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
            />

            {/* Slide-Over Navigation Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0D0D0D] border-r border-[#1E1E1E] shadow-2xl lg:hidden flex flex-col"
            >
              <AdminSidebar
                isCompact={false}
                onNavItemClick={() => setIsMobileDrawerOpen(false)}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopBar onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 scrollbar-none">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }) {
  return (
    <AdminProvider>
      <ShellContent>{children}</ShellContent>
    </AdminProvider>
  );
}
