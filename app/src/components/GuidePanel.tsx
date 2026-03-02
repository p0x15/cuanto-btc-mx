"use client";

import { useEffect, useRef } from "react";
import { type Guide, type ContentBlock } from "@/data/guides";

interface GuidePanelProps {
  guide: Guide | null;
  onClose: () => void;
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "heading":
      return (
        <h3
          key={i}
          className="mt-8 mb-3 text-[18px] font-bold text-[var(--fg)]"
        >
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p
          key={i}
          className="mb-5 text-[16px] leading-[1.75] text-[var(--fg-muted)]"
        >
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="mb-5 space-y-3 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-[16px] text-[var(--fg-muted)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F7931A]" />
              <span className="leading-[1.75]">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          key={i}
          className="my-5 flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5"
        >
          <span className="text-xl leading-none mt-0.5">{block.emoji}</span>
          <p className="text-[15px] leading-[1.7] text-[var(--fg-dim)]">
            {block.text}
          </p>
        </div>
      );
  }
}

export function GuidePanel({ guide, onClose }: GuidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = guide !== null;

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Scroll panel content to top when guide changes
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = 0;
    }
  }, [guide?.slug]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Panel — centered modal */}
      <div
        className={[
          "fixed z-50 flex flex-col bg-[var(--bg-raised)] border border-[var(--border)] transition-all duration-300 ease-in-out",
          // mobile: bottom sheet
          "bottom-0 left-0 right-0 max-h-[88vh] rounded-t-2xl",
          // desktop: centered floating panel
          "md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[720px] md:max-h-[82vh] md:rounded-2xl md:shadow-2xl",
          // open/closed — mobile
          isOpen ? "translate-y-0" : "translate-y-full",
          // open/closed — desktop scale+fade (overrides mobile transform)
          isOpen
            ? "md:opacity-100 md:scale-100 md:translate-x-[-50%] md:translate-y-[-50%]"
            : "md:opacity-0 md:scale-95 md:translate-x-[-50%] md:translate-y-[-48%] md:pointer-events-none",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={guide?.title ?? "Guía"}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start gap-3 border-b border-[var(--border)] px-5 py-4">
          {/* Drag handle — mobile only */}
          <div className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-[var(--border-2)] md:hidden" />

          <span className="mt-0.5 text-2xl">{guide?.icon}</span>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold leading-snug text-[var(--fg)] truncate">
              {guide?.title}
            </h2>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-[var(--fg-muted)]">
                {guide?.readTime} lectura
              </span>
              {guide?.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--bg-high)] px-2 py-0.5 text-[10px] font-semibold text-[var(--fg-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)] transition-colors"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={panelRef}
          className="flex-1 overflow-y-auto overscroll-contain px-7 py-6 pb-12"
        >
          {guide?.content.map((block, i) => renderBlock(block, i))}
        </div>
      </div>
    </>
  );
}
