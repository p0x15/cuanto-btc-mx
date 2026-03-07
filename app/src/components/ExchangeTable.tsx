"use client";

import { useMemo, useState } from "react";
import { calcSats, exchanges as allExchanges, KycLevel } from "@/data/exchanges";
import { ExchangeLogo } from "@/components/ExchangeLogo";
import { SuggestExchangeModal } from "@/components/SuggestExchangeModal";
import { getPriceForExchange, useLivePrices } from "@/hooks/useLivePrices";
import { satsToBtc } from "@/lib/formatBtc";

type SortKey = "sats" | "fee" | "price";

interface ExchangeTableProps {
  mxn: number;
}

const KYC_LABEL: Record<KycLevel, string> = {
  none: "Sin KYC",
  basic: "KYC básico",
  full: "KYC completo",
};

function Skel({ w, h }: { w: string; h: string }) {
  return <div className={`animate-pulse rounded-md bg-[var(--bg-elevated)] ${w} ${h}`} />;
}

function RectTag({
  children,
  color,
  bg,
  border,
}: {
  children: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-[4px] border px-[7px] py-[3px] font-ui-mono text-[9px] font-bold whitespace-nowrap"
      style={{ color, background: bg, borderColor: border }}
    >
      {children}
    </span>
  );
}

export function ExchangeTable({ mxn }: ExchangeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("sats");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const { spot, prices, loading, error } = useLivePrices();

  const amount = mxn > 0 ? mxn : 1_000;

  /** Build enriched list with live ask prices */
  const enriched = useMemo(() => {
    return allExchanges.map((ex) => {
      const { ask, source } = getPriceForExchange(prices, ex.id, spot);
      return { ...ex, askPrice: ask, priceSource: source };
    });
  }, [prices, spot]);

  const sorted = useMemo(() => {
    return [...enriched].sort((a, b) => {
      if (sortKey === "sats") return calcSats(amount, b.askPrice, b.feePct) - calcSats(amount, a.askPrice, a.feePct);
      if (sortKey === "fee") return a.feePct - b.feePct;
      if (sortKey === "price") return a.askPrice - b.askPrice;
      return 0;
    });
  }, [amount, enriched, sortKey]);

  const displayed = sorted;
  const best = displayed[0];
  const bestSats = best ? calcSats(amount, best.askPrice, best.feePct) : 0;

  const sortBtn = (key: SortKey, label: string) => {
    const active = sortKey === key;
    return (
      <button
        onClick={() => setSortKey(key)}
        className={`rounded-[4px] px-[10px] py-1 font-ui-mono text-[10px] cursor-pointer transition-colors ${active
          ? "bg-[#F7931A] font-bold text-[#07080A]"
          : "border border-[var(--border-2)] bg-[var(--bg-elevated)] font-normal text-[var(--fg-muted)] hover:text-[var(--fg-dim)]"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-16">
      {/* Desktop ticker */}
      <div className="hidden md:flex h-11 items-center gap-3 border-y border-[var(--border)] bg-[var(--bg-ticker)] px-0 font-ui-mono">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-[0.15em] text-[var(--fg-muted)]">EXCHANGES</span>
          <span className="text-[10px] font-bold text-[var(--fg)]">{sorted.length}</span>
        </div>
        <span className="h-5 w-px bg-[var(--border-2)]" />
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-[0.15em] text-[var(--fg-muted)]">MEJOR PRECIO</span>
          <span className="text-[10px] font-bold text-[#F7931A]">{best?.name ?? "—"}</span>
        </div>
        <span className="h-5 w-px bg-[var(--border-2)]" />
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-[0.15em] text-[var(--fg-muted)]">MENOR FEE</span>
          <span className="text-[10px] font-bold text-[var(--accent-green)]">
            {Math.min(...sorted.map((x) => x.feePct)) % 1 === 0 ? Math.min(...sorted.map((x) => x.feePct)).toFixed(0) : String(Math.min(...sorted.map((x) => x.feePct)))}%
          </span>
        </div>
        <span className="h-5 w-px bg-[var(--border-2)]" />
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-[0.15em] text-[var(--fg-muted)]">BTC / MXN</span>
          <span className="text-[10px] font-bold text-[var(--fg)]">
            ${spot.toLocaleString("es-MX")}
          </span>
        </div>
        <span className="h-5 w-px bg-[var(--border-2)]" />
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-[0.15em] text-[var(--fg-muted)]">ACTUALIZADO</span>
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${error ? "bg-red-500" : "bg-[var(--live-green)]"}`} />
            <span className="text-[10px] font-semibold text-[var(--live-green)]">ahora mismo</span>
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-[0.15em] text-[var(--fg-muted)]">ORDENAR:</span>
          {sortBtn("sats", "Más sats")}
          {sortBtn("fee", "Menor fee")}
          {sortBtn("price", "Mejor precio")}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-[var(--bg)]">
        <div className="grid h-10 grid-cols-[48px_260px_220px_200px_80px_160px_minmax(170px,1fr)] items-center border-b border-[var(--border)] font-ui-mono text-[11px] tracking-[0.08em]">
          <span className="text-[var(--fg-muted)]">#</span>
          <span className="text-[var(--fg-muted)]">EXCHANGE</span>
          <span className="font-semibold text-[#F7931A]">SATS QUE RECIBES ↓</span>
          <span className="text-[var(--fg-muted)]">PRECIO BTC (MXN)</span>
          <span className="text-[var(--fg-muted)]">FEE</span>
          <span className="text-[var(--fg-muted)]">MÉTODOS</span>
          <span className="text-[var(--fg-muted)]">CARACTERÍSTICAS</span>
        </div>

        {displayed.map((ex, i) => {
          const sats = calcSats(amount, ex.askPrice, ex.feePct);
          const satsDiff = sats - bestSats;
          const winner = i === 0;
          const isLive = ex.priceSource === "live" && !loading && !error;

          return (
            <a
              key={ex.id}
              href={ex.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`grid h-[72px] grid-cols-[48px_260px_220px_200px_80px_160px_minmax(170px,1fr)] items-center border-b ${winner
                ? "border-[var(--border-winner)] bg-[var(--bg-winner)]"
                : "border-[var(--bg-raised)] bg-[var(--bg)] hover:bg-[var(--bg-raised)]"
                }`}
            >
              <div className="flex h-full items-center gap-2">
                <span className={`h-full w-[3px] ${winner ? "bg-[#F7931A]" : "bg-transparent"}`} />
                <span className={`font-ui-mono text-base font-bold ${winner ? "text-[#F7931A]" : "text-[var(--fg-faint)]"}`}>
                  {i + 1}
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <ExchangeLogo exchange={ex} size={40} rounded="rounded-[10px]" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`truncate text-[15px] font-bold ${winner ? "text-[#F7931A]" : "text-[var(--fg)]"}`}>
                      {ex.name}
                    </span>
                    {winner && (
                      <RectTag color="#F7931A" bg="#F7931A15" border="#F7931A30">
                        ★ MEJOR
                      </RectTag>
                    )}
                    {isLive && (
                      <RectTag color="var(--accent-green)" bg="var(--green-bg)" border="#0F3A1A">
                        ● EN VIVO
                      </RectTag>
                    )}
                  </div>
                  <p className="truncate font-ui-mono text-[11px] text-[var(--fg-faint)]">{ex.type}</p>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                {loading
                  ? <Skel w="w-28" h="h-7" />
                  : <p className={`font-ui-mono text-[26px] font-bold leading-none tracking-[-0.03em] ${winner ? "text-[#F7931A]" : "text-[var(--fg-dim)]"}`}>
                      {sats.toLocaleString("es-MX")}
                    </p>
                }
                {loading
                  ? <Skel w="w-20" h="h-3" />
                  : <p className="font-ui-mono text-[11px] text-[var(--fg-muted)]">
                      {winner ? `${satsToBtc(sats)} BTC` : `▼ ${Math.abs(satsDiff).toLocaleString("es-MX")} menos que #1`}
                    </p>
                }
              </div>

              <div className="flex flex-col gap-0.5">
                {loading
                  ? <Skel w="w-24" h="h-4" />
                  : <p className="font-ui-mono text-[15px] font-semibold text-[var(--fg-dim)]">
                      ${ex.askPrice.toLocaleString("es-MX")}
                    </p>
                }
                <p className="font-ui-mono text-[11px] text-[var(--fg-faint)]">MXN</p>
              </div>

              <p className={`font-ui-mono text-[15px] font-bold ${ex.feePct <= 1 ? "text-[var(--accent-green)]" : "text-[var(--fg-dim)]"}`}>
                {ex.feePct % 1 === 0 ? ex.feePct.toFixed(0) : String(ex.feePct)}%
              </p>

              <div className="flex items-center gap-1.5">
                {ex.spei && (
                  <RectTag color="var(--accent-green)" bg="var(--green-bg)" border="#0F3A1A">
                    SPEI
                  </RectTag>
                )}
                {ex.lightning && (
                  <RectTag color="var(--accent-yellow)" bg="var(--yellow-bg)" border="#2A1F00">
                    ⚡ Lightning
                  </RectTag>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {ex.nonCustodial && (
                  <RectTag color="var(--fg-muted)" bg="var(--bg-elevated)" border="var(--border-2)">
                    No custodial
                  </RectTag>
                )}
                <RectTag color="var(--fg-muted)" bg="var(--bg-elevated)" border="var(--border-2)">
                  {KYC_LABEL[ex.kyc]}
                </RectTag>
              </div>
            </a>
          );
        })}

        <div className="flex items-center justify-between bg-[var(--bg-footer)] px-5 py-3 gap-4">
          <p className="font-ui-mono text-xs text-[var(--fg-faint)]">
            Mostrando {displayed.length} de {sorted.length} exchanges · Ordenado por:{" "}
            {sortKey === "sats" ? "Más sats" : sortKey === "fee" ? "Menor fee" : "Mejor precio"}
          </p>
          <button
            onClick={() => setSuggestOpen(true)}
            className="shrink-0 font-ui-mono text-[10px] text-[var(--fg-faint)] hover:text-[#F7931A] transition-colors cursor-pointer underline underline-offset-2"
          >
            ¿No ves tu exchange favorito?
          </button>
        </div>
      </div>

      {/* Mobile list */}
      <div className="md:hidden py-4">
        {/* Mobile sort controls */}
        <div className="mb-3 flex items-center gap-1.5">
          {sortBtn("sats", "Más sats")}
          {sortBtn("fee", "Menor fee")}
          {sortBtn("price", "Mejor precio")}
        </div>

        <div className="space-y-2">
          {displayed.map((ex, i) => {
            const sats = calcSats(amount, ex.askPrice, ex.feePct);
            const satsDiff = sats - bestSats;
            const winner = i === 0;
            const isLive = ex.priceSource === "live" && !loading && !error;
            return (
              <a
                key={ex.id}
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block border px-4 py-3.5 ${winner ? "border-[var(--border-winner-card)] bg-[var(--bg-winner)]" : "border-[var(--border)] bg-[var(--bg)]"}`}
              >
                {/* Top row: rank + logo + name + badges */}
                <div className="flex items-center gap-3 mb-2.5">
                  <span className={`font-ui-mono text-[12px] font-bold w-4 shrink-0 ${winner ? "text-[#F7931A]" : "text-[var(--fg-faint)]"}`}>
                    {i + 1}
                  </span>
                  <ExchangeLogo exchange={ex} size={32} rounded="rounded-[8px]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[15px] font-bold leading-tight ${winner ? "text-[#F7931A]" : "text-[var(--fg)]"}`}>
                        {ex.name}
                      </span>
                      {winner && (
                        <RectTag color="#F7931A" bg="#F7931A15" border="#F7931A30">
                          ★ MEJOR
                        </RectTag>
                      )}
                      {isLive && (
                        <RectTag color="var(--accent-green)" bg="var(--green-bg)" border="#0F3A1A">
                          ● EN VIVO
                        </RectTag>
                      )}
                    </div>
                    <p className="font-ui-mono text-[10px] text-[var(--fg-faint)] mt-0.5">{ex.type}</p>
                  </div>
                </div>

                {/* Sats row */}
                <div className="flex items-end justify-between gap-2">
                  <div>
                    {loading
                      ? <Skel w="w-24" h="h-6" />
                      : <p className={`font-ui-mono text-[24px] font-bold leading-none tracking-[-0.03em] ${winner ? "text-[#F7931A]" : "text-[var(--fg-dim)]"}`}>
                          {sats.toLocaleString("es-MX")}
                        </p>
                    }
                    {loading
                      ? <Skel w="w-16" h="h-3" />
                      : <p className="font-ui-mono text-[10px] text-[var(--fg-muted)] mt-0.5">
                          {winner ? `${satsToBtc(sats)} BTC` : `▼ ${Math.abs(satsDiff).toLocaleString("es-MX")} menos que #1`}
                        </p>
                    }
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className={`font-ui-mono text-[13px] font-bold ${ex.feePct <= 1 ? "text-[var(--accent-green)]" : "text-[var(--fg-dim)]"}`}>
                      {ex.feePct % 1 === 0 ? ex.feePct.toFixed(0) : String(ex.feePct)}% fee
                    </p>
                    {loading
                      ? <Skel w="w-20" h="h-3" />
                      : <p className="font-ui-mono text-[11px] text-[var(--fg-faint)]">
                          ${ex.askPrice.toLocaleString("es-MX")} MXN
                        </p>
                    }
                  </div>
                </div>

                {/* Tags row */}
                {(ex.spei || ex.lightning) && (
                  <div className="mt-2 flex items-center gap-1.5">
                    {ex.spei && (
                      <RectTag color="var(--accent-green)" bg="var(--green-bg)" border="#0F3A1A">
                        SPEI
                      </RectTag>
                    )}
                    {ex.lightning && (
                      <RectTag color="var(--accent-yellow)" bg="var(--yellow-bg)" border="#2A1F00">
                        ⚡ Lightning
                      </RectTag>
                    )}
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* Mobile — suggest button */}
        <button
          onClick={() => setSuggestOpen(true)}
          className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] py-3 font-ui-mono text-[12px] text-[var(--fg-muted)] hover:border-[#F7931A44] hover:text-[#F7931A] transition-colors cursor-pointer"
        >
          ¿No ves tu exchange favorito? Haznoslo saber →
        </button>
      </div>

      <SuggestExchangeModal open={suggestOpen} onClose={() => setSuggestOpen(false)} />
    </section>
  );
}
