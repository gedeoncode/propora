"use client";

import { useEffect, useState } from "react";

export function MobileInquiryBar({
  slug,
  price,
  listingType,
}: {
  slug: string;
  price: string;
  listingType: "sale" | "rent";
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("inquiry-anchor");
    const onScroll = () => {
      const scrolled = window.scrollY > 240;
      setVisible(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const el = document.getElementById("inquiry-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = el.querySelector<HTMLInputElement>("input, textarea");
      input?.focus({ preventScroll: true });
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {listingType === "sale" ? "Asking price" : "Rent / month"}
          </p>
          <p className="truncate text-[15px] font-semibold text-foreground">
            {price}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Request info
        </button>
      </div>
    </div>
  );
}