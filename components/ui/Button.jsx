"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Button({
  children,
  variant = "primary", // 'primary' | 'outline' | 'navy' | 'ghost'
  size = "md", // 'sm' | 'md' | 'lg'
  className = "",
  onClick,
  icon: Icon,
  type = "button",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-none relative overflow-hidden group select-none btn-shine";

  const variants = {
    primary:
      "bg-gor-gold text-gor-navy border border-gor-gold hover:bg-gor-gold-light hover:border-gor-gold-light hover:shadow-[0_0_30px_rgba(201,162,75,0.45)]",
    outline:
      "bg-transparent text-gor-gold border border-gor-gold/60 hover:border-gor-gold hover:text-gor-offwhite hover:bg-gor-gold/10 hover:shadow-[0_0_25px_rgba(201,162,75,0.25)]",
    navy:
      "bg-gor-navy text-gor-offwhite border border-gor-navy hover:bg-gor-navy-light hover:border-gor-gold/40 hover:shadow-[0_0_25px_rgba(28,46,74,0.5)]",
    ghost:
      "bg-transparent text-gor-grey hover:text-gor-gold border border-transparent hover:border-gor-gold/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-7 py-3.5 text-xs",
    lg: "px-9 py-4 text-sm",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.975, y: 0 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-45 cursor-not-allowed pointer-events-none filter grayscale",
        className
      )}
      {...props}
    >
      {/* Subtle shine line animation */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />}
      </span>
    </motion.button>
  );
}
