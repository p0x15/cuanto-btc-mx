"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLivePrices } from "@/hooks/useLivePrices";

const GENESIS_HASH =
  "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";

export function Navbar() {
  const { spot, loading, error, timeAgoStr } = useLivePrices();
  const pathname = usePathname();
  const [eggOpen, setEggOpen] = useState(false);
  const eggRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!eggOpen) return;
    const handler = (e: MouseEvent) => {
      if (eggRef.current && !eggRef.current.contains(e.target as Node)) {
        setEggOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [eggOpen]);

  const navLink = (href: string, label: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={[
          "text-sm transition-colors",
          active
            ? "font-semibold text-[#F7931A]"
            : "font-normal text-[var(--fg-muted)] hover:text-[var(--fg-dim)]",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center px-4 md:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-2.5 md:mr-8">
          {/* Easter egg: ₿ button */}
          <div ref={eggRef} className="relative">
            <button
              onClick={() => setEggOpen((v) => !v)}
              className="flex h-6 w-6 items-center justify-center text-[22px] font-bold leading-none text-[#F7931A] transition-opacity active:opacity-80 select-none"
              aria-label="Bloque génesis de Bitcoin"
            >
              ₿
            </button>

            {/* Popover */}
            {eggOpen && (
              <div className="absolute left-0 top-10 z-50 w-[300px] rounded-xl border border-[var(--border-2)] bg-[var(--bg-raised)] p-4 shadow-2xl">
                <p className="mb-1 text-[11px] font-semibold tracking-widest text-[#F7931A] font-ui-mono">
                  BLOQUE GÉNESIS · 3 ENE 2009
                </p>
                <p className="mb-3 text-[11px] leading-relaxed text-[var(--fg-muted)] font-ui-mono">
                  El primer bloque de Bitcoin, minado por Satoshi Nakamoto. Contiene el mensaje:
                </p>
                <p className="mb-3 rounded-md bg-[var(--bg-elevated)] px-3 py-2 font-ui-mono text-[11px] italic text-[var(--fg-dim)]">
                  &quot;The Times 03/Jan/2009 Chancellor on brink of second bailout for banks&quot;
                </p>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)] font-ui-mono">
                  Hash
                </p>
                <p className="break-all font-ui-mono text-[10px] leading-relaxed text-[#F7931A]">
                  {GENESIS_HASH}
                </p>
              </div>
            )}
          </div>

          <Link href="/" className="text-[16px] md:text-[17px] font-bold tracking-tight text-[var(--fg)]">
            CuantoBTC
          </Link>
        </div>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex items-center gap-7">
          {navLink("/", "Comparar")}
          {navLink("/test", "Test personalizado")}
          {navLink("/guias", "Guías")}
          {navLink("/mapa", "Mapa histórico")}
        </div>

        <div className="flex-1" />

        {/* Live BTC price ticker */}
        <div className="flex items-center gap-2 rounded-full border border-[var(--border-2)] bg-[var(--bg-raised)] px-3.5 py-1.5 font-ui-mono">
          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${error ? "bg-red-500" : "bg-[var(--live-green)]"}`} />
          <span className="text-xs font-semibold text-[var(--fg-dim)]">
            {loading
              ? "Cargando..."
              : error
              ? "— MXN"
              : `$${spot.toLocaleString("es-MX")}`}
          </span>
          <span className="hidden md:inline text-xs text-[var(--fg-muted)]">
            {loading || error ? "MXN / BTC" : `MXN / BTC · ${timeAgoStr}`}
          </span>
        </div>

        <div className="w-2.5 md:w-3" />

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
