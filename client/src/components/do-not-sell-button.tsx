"use client";

import { useState } from "react";
import { optOutOfSale } from "@/components/cookie-consent";

export function DoNotSellButton() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <span className="text-emerald-400" data-testid="text-do-not-sell-confirmed">
        Opt-out saved
      </span>
    );
  }

  return (
    <button
      onClick={() => {
        optOutOfSale();
        setDone(true);
      }}
      className="hover:text-slate-300 transition-colors cursor-pointer"
      data-testid="link-do-not-sell"
    >
      Do Not Sell or Share My Personal Information
    </button>
  );
}
