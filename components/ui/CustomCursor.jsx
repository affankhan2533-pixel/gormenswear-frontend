"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot — tight spring, follows cursor closely
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 45, mass: 0.3 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 45, mass: 0.3 });

  // Ring — loose spring, lags slightly for luxury feel
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 30, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 30, mass: 0.5 });

  useEffect(() => {
    // Only enable on hover-capable desktop devices
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setIsDesktop(true);

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    // Detect when cursor hovers a clickable element
    const onMouseOver = (e) => {
      const el = e.target.closest(
        'a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]'
      );
      setIsHovering(!!el);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isDesktop) return null;

  return (
    <>
      {/* Dot — tight follower */}
      <motion.div
        className="gor-cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? "#f0d58d" : "#c9a24b",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Ring — lagging follower */}
      <motion.div
        className="gor-cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          backgroundColor: isHovering ? "rgba(201,162,75,0.06)" : "rgba(201,162,75,0)",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? 52 : 36,
          height: isHovering ? 52 : 36,
          borderColor: isHovering
            ? "rgba(201,162,75,0.95)"
            : "rgba(201,162,75,0.55)",
        }}
        transition={{
          opacity: { duration: 0.2 },
          width: { type: "spring", stiffness: 300, damping: 28 },
          height: { type: "spring", stiffness: 300, damping: 28 },
          borderColor: { duration: 0.25 },
        }}
      />
    </>
  );
}
