"use client";

import { motion } from "framer-motion";

export default function AdminCard({ children, className = "", onClick = null }) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`bg-[#141414] border border-[#222222] hover:border-[#333333] rounded-[20px] p-6 shadow-xl transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
