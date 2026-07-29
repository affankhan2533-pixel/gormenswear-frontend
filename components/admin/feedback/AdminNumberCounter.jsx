"use client";

import { motion } from "framer-motion";

export default function AdminNumberCounter({ value, prefix = "", suffix = "" }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-editorial text-3xl font-bold tracking-tight text-[#F8F6F3]"
    >
      {prefix}
      {value}
      {suffix}
    </motion.span>
  );
}
