"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { GuidePanel } from "@/components/GuidePanel";
import { guides } from "@/data/guides";
import Link from "next/link";

export default function GuiasPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeGuide = guides.find((g) => g.slug === activeSlug) ?? null;

  const handleClose = useCallback(() => setActiveSlug(null), []);

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-16 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.15em] text-[#F7931A]">
            APRENDE
          </span>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--fg)]">
            Guías de Bitcoin en México
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-[var(--fg-muted)]">
            Todo lo que necesitas saber para comprar Bitcoin de forma segura,
            inteligente y soberana desde México.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <button
              key={g.slug}
              onClick={() => setActiveSlug(g.slug)}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)] p-6 text-left transition-colors hover:border-[var(--border-2)] hover:bg-[var(--bg-elevated)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{g.icon}</span>
                <span className="text-[11px] font-medium text-[var(--fg-muted)]">
                  {g.readTime} lectura
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-[var(--fg)] group-hover:text-[#F7931A] transition-colors">
                  {g.title}
                </h2>
                <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">
                  {g.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2 flex-wrap">
                {g.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--bg-high)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] px-6 py-5 flex items-center gap-4">
          <span className="text-2xl">📝</span>
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">
              Más guías en camino
            </p>
            <p className="text-xs text-[var(--fg-muted)]">
              Este proyecto es de código abierto. Si quieres contribuir una guía,{" "}
              <a
                href="https://github.com/p0x15/donde-btc-mx"
                className="text-[#F7931A] hover:underline"
              >
                abre un PR en GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex-1" />
          <Link
            href="/"
            className="rounded-full bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors"
          >
            ← Volver a comparar
          </Link>
        </div>
      </main>

      <GuidePanel guide={activeGuide} onClose={handleClose} />
    </div>
  );
}
