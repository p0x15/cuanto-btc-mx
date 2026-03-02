"use client";

import dynamic from "next/dynamic";

const HistoryMap = dynamic(
  () => import("./HistoryMap").then((m) => m.HistoryMap),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-4">
        <div className="animate-pulse rounded-2xl bg-[var(--bg-raised)] h-[480px]" />
      </div>
    ),
  }
);

export function HistoryMapClient() {
  return <HistoryMap />;
}
