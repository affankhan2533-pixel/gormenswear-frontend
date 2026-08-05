"use client";

import { useState, useEffect, useRef } from "react";

/**
 * useNavbarVisibility — Ultra-stable, non-flickering Navbar scroll hook.
 *
 * Rules:
 * 1. Always visible near top of page (scrollY <= 150px).
 * 2. Hides ONLY when scrollY > 150px AND actively scrolling downward by > 15px.
 * 3. Shows immediately when scrolling upward by > 10px OR when scrollY <= 150px.
 * 4. Hysteresis buffer prevents rapid toggling/flicker on small scroll movements.
 * 5. Uses requestAnimationFrame and passive listeners for 60 FPS performance.
 */
export function useNavbarVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Sync initial position
    lastScrollY.current = window.scrollY;
    if (window.scrollY <= 150) {
      setIsVisible(true);
    }

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Always show near top
      if (currentScrollY <= 150) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      // Scrolling down past 150px with a 15px threshold to prevent flicker
      if (delta > 15) {
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
      }
      // Scrolling up by > 10px
      else if (delta < -10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isVisible;
}
