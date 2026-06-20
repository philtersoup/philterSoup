"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    goatcounter?: {
      count: (vars?: {
        path?: string;
        title?: string;
        event?: boolean;
      }) => void;
    };
  }
}

// Integrates GoatCounter analytics:
//  1. Counts a pageview on client-side (SPA) route changes. The first page load
//     is counted by count.js automatically, so we skip the initial render.
//  2. Logs every click on an outbound link as an event, so the dashboard's
//     "Events" panel shows which projects, press articles, and listen links
//     people actually click through to.
export default function GoatCounter() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  // SPA pageview tracking.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    window.goatcounter?.count?.({ path: pathname });
  }, [pathname]);

  // Outbound-link click tracking (one delegated listener for the whole app).
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return; // not an absolute/parseable URL (e.g. mailto:, #anchors)
      }

      // Only track links that leave the site.
      if (url.host === window.location.host) return;

      window.goatcounter?.count?.({
        path: `out: ${url.host}${url.pathname}`,
        title: anchor.textContent?.trim() || url.href,
        event: true,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
