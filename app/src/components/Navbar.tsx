"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useLivePrices } from "@/hooks/useLivePrices";

export function Navbar() {
  const { spot, loading, error, timeAgoStr } = useLivePrices();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-2.5 md:mr-10">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7931A] text-base font-black text-[#0B0B0B]">
            ₿
          </span>
          <span className="text-[16px] md:text-[17px] font-extrabold tracking-tight text-[var(--fg)]">
            Donde BTC MX
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-[#F7931A]">
            Comparar
          </Link>
          <Link href="/test" className="text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            Test personalizado
          </Link>
          <Link href="/guias" className="text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            Guías
          </Link>
        </div>

        <div className="flex-1" />

        {/* Theme toggle */}
        <ThemeToggle />

        <div className="w-2 md:w-3" />

        {/* Live BTC price ticker */}
        <div className="flex items-center gap-1.5 md:gap-2 rounded-full bg-[var(--bg-elevated)] px-2.5 md:px-3.5 py-1.5">
          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${error ? "bg-red-500" : "animate-pulse bg-[#22C55E]"}`} />
          <span className="text-xs font-bold text-[var(--fg)]">
            {loading
              ? "Cargando..."
              : error
              ? "— MXN"
              : `$${spot.toLocaleString("es-MX")}`}
          </span>
          {/* timeAgo solo en desktop */}
          {!loading && !error && (
            <span className="hidden md:inline text-xs text-[var(--fg-muted)]">· {timeAgoStr}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
