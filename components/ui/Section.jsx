"use client";

import { cn } from "@/lib/utils";

export function Section({
  children,
  className = "",
  id,
  dark = false,
  padded = true,
  ...props
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden",
        padded && "py-20 lg:py-32",
        dark ? "bg-gor-card border-y border-gor-gold/10" : "bg-gor-black",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function Container({ children, className = "", size = "default", ...props }) {
  const sizes = {
    small: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[90rem]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-12 w-full", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
