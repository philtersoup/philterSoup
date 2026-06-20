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

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

// Integrates GoatCounter analytics:
//  1. SPA pageviews on client-side route changes (count.js handles the first load).
//  2. Outbound-link clicks -> events ("out: host/path").
//  3. Any element with [data-gc-event] -> a custom event on click. Set the
//     attribute value to the event name, e.g. data-gc-event="gallery: My Project".
//  4. Scroll depth -> events at 25/50/75/100% reach, once each per page.
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

  // Click tracking: outbound links + tagged [data-gc-event] elements.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;

      const tagged = el?.closest?.<HTMLElement>("[data-gc-event]");
      if (tagged) {
        const name = tagged.dataset.gcEvent?.trim();
        if (name) {
          window.goatcounter?.count?.({ path: name, title: name, event: true });
        }
        return;
      }

      const anchor = el?.closest?.("a");
      if (!anchor) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return; // mailto:, #anchors, etc.
      }
      if (url.host === window.location.host) return; // internal -> already a pageview
      window.goatcounter?.count?.({
        path: `out: ${url.host}${url.pathname}`,
        title: anchor.textContent?.trim() || url.href,
        event: true,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Scroll-depth tracking, reset on each page.
  useEffect(() => {
    const reached = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = ((window.scrollY / scrollable) * 100);

      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          window.goatcounter?.count?.({
            path: `scroll ${milestone}%: ${pathname}`,
            title: `Scrolled ${milestone}% — ${pathname}`,
            event: true,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
