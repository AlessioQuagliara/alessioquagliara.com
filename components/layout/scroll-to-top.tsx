"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ScrollToTop: on location change, scroll to top with smooth behavior
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Small timeout to allow route transition/DOM updates if needed
    const t = window.setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // fallback for older browsers
        window.scrollTo(0, 0);
      }
    }, 50);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
