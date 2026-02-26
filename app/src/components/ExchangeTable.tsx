"use client";

import { useState } from "react";
import { calcSats, KycLevel, exchanges as allExchanges } from "@/data/exchanges";
import { ExchangeLogo } from "@/components/ExchangeLogo";
import { useLivePrices, scalePrice } from "@/hooks/useLivePrices";

type SortKey = "sats" | "fee" | "price";

interface ExchangeTableProps {
  mxn: number;
}

const KYC_LABEL: Record<KycLevel, { label: string; color: string; bg: string }> = {
  none:  { label: "Sin KYC",      color: "var(--accent-green)", bg: "var(--green-bg)" },
  basic: { label: "KYC básico",   color: "var(--fg-dim)",       bg: "var(--bg-high)"  },
  full:  { label: "KYC completo", color: "var(--fg-muted)",     bg: "var(--bg-high)"  },
};

function Tag({
  children, color, bg, small = false,
}: {
  children: React.ReactNode; color: string; bg: string; small?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold whitespace-nowrap ${
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"
      }`}
      style={{ color, background: bg }}
    >
      {children}
    </span>
  );
}

export function ExchangeTable({ mxn }: ExchangeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("sats");
  const { spot, ask, loading, error, timeAgoStr } = useLivePrices();

  const amount = mxn > 0 ? mxn : 1_000;

  const liveExchanges = allExchanges.map((ex) => {
    if (ex.id === "bitso" && !loading && !error) return { ...ex, btcPriceMxn: ask };
    if (!loading && !error) return { ...ex, btcPriceMxn: scalePrice(ex.btcPriceMxn, spot) };
    return ex;
  });

  const sorted = [...liveExchanges].sort((a, b) => {
    if (sortKey === "sats")  return calcSats(amount, b) - calcSats(amount, a);
    if (sortKey === "fee")   return a.feePct - b.feePct;
    if (sortKey === "price") return a.btcPriceMxn - b.btcPriceMxn;
    return 0;
  });

  const bestSats = calcSats(amount, sorted[0]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-8 py-4 md:py-6">

      {/* Controls */}
      <div className="mb-3 md:mb-4 flex flex-wrap items-center gap-2 md:gap-3">
        <span className="text-sm text-[var(--fg-muted)]">
          {sorted.length} exchanges · ordenar:
        </span>
        {(["sats", "fee", "price"] as SortKey[]).map((key) => {
          const labels = { sats: "Más sats", fee: "Menor fee", price: "Mejor precio" };
          const active = sortKey === key;
          return (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`rounded-full px-3 md:px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-[#F7931A] text-[#0B0B0B]"
                  : "bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-high)]"
              }`}
            >
              {labels[key]}{active && " ↓"}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${error ? "bg-red-500" : loading ? "bg-[var(--fg-faint)]" : "animate-pulse bg-[#22C55E]"}`} />
          <span className="text-[11px] text-[var(--fg-muted)]">
            {loading ? "Cargando..." : error ? "Sin datos" : `${timeAgoStr}`}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">

        {/* Column headers — desktop only */}
        <div className="hidden md:grid grid-cols-[44px_1fr_190px_160px_90px_1fr] gap-4 bg-[var(--bg-raised)] px-5 py-3 text-[10px] font-bold tracking-widest text-[var(--fg-faint)] uppercase">
          <span>#</span>
          <span>Exchange</span>
          <span className="text-[#F7931A]">Sats que recibes</span>
          <span>Precio BTC</span>
          <span>Fee</span>
          <span>Características</span>
        </div>

        {sorted.map((ex, i) => {
          const sats    = calcSats(amount, ex);
          const satsDiff = sats - bestSats;
          const isWinner = i === 0;
          const kyc      = KYC_LABEL[ex.kyc];
          const isLive   = ex.id === "bitso" && !loading && !error;

          return (
            <a
              key={ex.id}
              href={ex.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block border-t border-[var(--border)] transition-colors ${
                isWinner
                  ? "bg-[#F7931A07] hover:bg-[#F7931A10]"
                  : "bg-[var(--bg)] hover:bg-[var(--bg-raised)]"
              }`}
            >

              {/* ── MOBILE LAYOUT ─────────────────────────────────── */}
              <div className="md:hidden flex gap-3 px-4 py-3.5">
                {/* Rank */}
                <span className={`w-4 flex-shrink-0 text-[12px] font-black mt-0.5 text-center ${
                  isWinner ? "text-[#F7931A]" : "text-[var(--fg-faint)]"
                }`}>
                  {i + 1}
                </span>

                {/* Logo */}
                <ExchangeLogo exchange={ex} size={36} rounded="rounded-lg" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: name + sats */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold text-[14px] ${isWinner ? "text-[#F7931A]" : "text-[var(--fg)]"}`}>
                          {ex.name}
                        </span>
                        {isWinner && (
                          <span className="rounded-full bg-[#F7931A22] px-1.5 py-0.5 text-[9px] font-bold text-[#F7931A]">
                            ★ Mejor
                          </span>
                        )}
                        {isLive && (
                          <span className="rounded-full bg-[#22C55E22] px-1.5 py-0.5 text-[9px] font-bold text-[#22C55E]">
                            ● en vivo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--fg-muted)] truncate">{ex.type}</div>
                    </div>
                    {/* Sats */}
                    <div className="text-right flex-shrink-0">
                      <div className={`text-[15px] font-black tabular-nums leading-tight ${
                        isWinner ? "text-[#F7931A]" : "text-[var(--fg)]"
                      }`}>
                        {sats.toLocaleString("es-MX")}
                        <span className="ml-0.5 text-[10px] font-semibold text-[var(--fg-muted)]"> sats</span>
                      </div>
                      {!isWinner && satsDiff < 0 && (
                        <div className="text-[10px] text-[var(--fg-faint)] tabular-nums">
                          ▼ {Math.abs(satsDiff).toLocaleString("es-MX")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: tags + fee */}
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    {ex.spei        && <Tag small color="var(--accent-green)"  bg="var(--green-bg)">SPEI</Tag>}
                    {ex.lightning   && <Tag small color="var(--accent-yellow)" bg="var(--yellow-bg)">⚡</Tag>}
                    {ex.nonCustodial && <Tag small color="var(--fg-dim)"       bg="var(--bg-high)">No custodial</Tag>}
                    <Tag small color={kyc.color} bg={kyc.bg}>{kyc.label}</Tag>
                    <span className={`ml-auto text-[11px] font-bold tabular-nums ${
                      ex.feePct <= 1 ? "text-[var(--accent-green)]"
                      : ex.feePct <= 2 ? "text-[var(--fg-dim)]"
                      : "text-[var(--fg-muted)]"
                    }`}>
                      {ex.feePct}% fee
                    </span>
                  </div>
                </div>
              </div>

              {/* ── DESKTOP LAYOUT ────────────────────────────────── */}
              <div className="hidden md:grid grid-cols-[44px_1fr_190px_160px_90px_1fr] gap-4 items-center px-5 py-4">
                {/* Rank */}
                <span className={`text-[13px] font-black ${isWinner ? "text-[#F7931A]" : "text-[var(--fg-faint)]"}`}>
                  {i + 1}
                </span>

                {/* Exchange */}
                <div className="flex items-center gap-3 min-w-0">
                  <ExchangeLogo exchange={ex} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[var(--fg)] group-hover:text-[#F7931A] transition-colors text-[15px]">
                        {ex.name}
                      </span>
                      {isWinner && (
                        <span className="rounded-full bg-[#F7931A22] px-2 py-0.5 text-[10px] font-bold text-[#F7931A]">
                          ★ Mejor precio
                        </span>
                      )}
                      {isLive && (
                        <span className="rounded-full bg-[#22C55E22] px-2 py-0.5 text-[10px] font-bold text-[#22C55E]">
                          ● en vivo
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--fg-muted)] truncate">{ex.type}</div>
                  </div>
                </div>

                {/* Sats */}
                <div className="flex flex-col gap-0.5">
                  <div className={`text-xl font-black tabular-nums tracking-tight leading-none ${isWinner ? "text-[#F7931A]" : "text-[var(--fg)]"}`}>
                    {sats.toLocaleString("es-MX")}
                    <span className="ml-1 text-[13px] font-semibold text-[var(--fg-muted)]">sats</span>
                  </div>
                  {!isWinner && satsDiff < 0 && (
                    <div className="text-[11px] text-[var(--fg-faint)] font-medium tabular-nums">
                      ▼ {Math.abs(satsDiff).toLocaleString("es-MX")} menos
                    </div>
                  )}
                </div>

                {/* Price */}
                <div>
                  <span className="text-[14px] font-semibold text-[var(--fg-dim)] tabular-nums">
                    ${ex.btcPriceMxn.toLocaleString("es-MX")}
                  </span>
                  <span className="ml-1 text-xs text-[var(--fg-muted)]">MXN</span>
                </div>

                {/* Fee */}
                <div>
                  <span className={`text-[14px] font-bold tabular-nums ${
                    ex.feePct <= 1 ? "text-[var(--accent-green)]"
                    : ex.feePct <= 2 ? "text-[var(--fg)]"
                    : "text-[var(--fg-muted)]"
                  }`}>
                    {ex.feePct}%
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {ex.spei        && <Tag color="var(--accent-green)"  bg="var(--green-bg)">SPEI</Tag>}
                  {ex.lightning   && <Tag color="var(--accent-yellow)" bg="var(--yellow-bg)">⚡ Lightning</Tag>}
                  {ex.nonCustodial && <Tag color="var(--fg-dim)"       bg="var(--bg-high)">No custodial</Tag>}
                  <Tag color={kyc.color} bg={kyc.bg}>{kyc.label}</Tag>
                </div>
              </div>

            </a>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-[var(--fg-ghost)] leading-relaxed">
        Precio Bitso en vivo vía API pública. Resto: estimado proporcional al spot.
        Verifica antes de comprar. No somos un exchange ni asesor financiero.
      </p>
    </section>
  );
}
