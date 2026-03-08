"use client";

import { useEffect, useRef, useState } from "react";

function Skel({ w, h }: { w: string; h: string }) {
  return <div className={`animate-pulse rounded-md bg-[var(--bg-elevated)] ${w} ${h}`} />;
}
import { calcSats, exchanges } from "@/data/exchanges";
import { getPriceForExchange, useLivePrices } from "@/hooks/useLivePrices";
import { satsToBtc } from "@/lib/formatBtc";
import { ExchangeLogo } from "@/components/ExchangeLogo";
import { SatSymbol } from "@/components/SatSymbol";

interface HeroInputProps {
  mxn: number;
  onChange: (value: number) => void;
}

const QUICK_AMOUNTS = [500, 1_000, 5_000, 10_000, 50_000];

export function HeroInput({ mxn, onChange }: HeroInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showCompact, setShowCompact] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [rawDigits, setRawDigits] = useState("1000");

  const panelAnchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showCompactRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const flipAnimRef = useRef<Animation | null>(null);
  const { spot, prices, loading, error } = useLivePrices();

  const amount = mxn > 0 ? mxn : 1_000;

  // Find best exchange using live prices
  const enriched = exchanges.map((ex) => {
    const { ask } = getPriceForExchange(prices, ex.id, spot);
    return { ...ex, askPrice: ask };
  });
  const sorted = [...enriched].sort(
    (a, b) => calcSats(amount, b.askPrice, b.feePct) - calcSats(amount, a.askPrice, a.feePct)
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const bestSats = best ? calcSats(amount, best.askPrice, best.feePct) : 0;
  const worstSats = worst ? calcSats(amount, worst.askPrice, worst.feePct) : 0;
  const satsLost = bestSats - worstSats;
  const mxnLost = Math.round((satsLost / 100_000_000) * spot);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    setRawDigits(digits);
    onChange(parseInt(digits || "0", 10));
  }

  function handleQuick(nextAmount: number) {
    setRawDigits(String(nextAmount));
    onChange(nextAmount);
    inputRef.current?.focus();
  }

  const displayValue = isFocused
    ? rawDigits
    : rawDigits
      ? parseInt(rawDigits, 10).toLocaleString("es-MX")
      : "";

  useEffect(() => {
    const setCompactWithFlip = (next: boolean) => {
      if (next === showCompactRef.current) return;

      const panel = panelRef.current;
      const first = panel?.getBoundingClientRect();

      showCompactRef.current = next;
      setShowCompact(next);

      if (!panel || !first) return;

      requestAnimationFrame(() => {
        const node = panelRef.current;
        if (!node) return;

        const last = node.getBoundingClientRect();
        if (!last.width || !last.height) return;

        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;

        flipAnimRef.current?.cancel();
        flipAnimRef.current = node.animate(
          [
            {
              transformOrigin: "top left",
              transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            },
            {
              transformOrigin: "top left",
              transform: "translate(0px, 0px) scale(1, 1)",
            },
          ],
          {
            duration: 460,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          }
        );
      });
    };

    const updateCompactState = () => {
      const anchor = panelAnchorRef.current;
      if (!anchor) return;

      const top = anchor.getBoundingClientRect().top;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const showAt = isDesktop ? 96 : 118;
      const hideAt = isDesktop ? 172 : 200;
      const next = showCompactRef.current ? top < hideAt : top < showAt;
      setCompactWithFlip(next);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateCompactState();
      });
    };

    updateCompactState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      flipAnimRef.current?.cancel();
    };
  }, []);

  useEffect(() => { setFlipped(false); }, [best?.id]);

  void error;

  return (
    <section
      className="w-full border-b border-[var(--border)] bg-[var(--bg)]"
      style={{ background: "radial-gradient(ellipse at 18% 60%, rgba(247,147,26,0.055) 0%, var(--bg) 60%)" }}
    >
      <div className="mx-auto max-w-[1400px] px-4 pb-7 pt-9 md:px-16 md:pb-8 md:pt-14">
        <div className="mb-6 flex items-center gap-2.5 font-ui-mono text-[10px] font-medium tracking-[0.2em] text-[var(--fg-muted)] md:mb-7">
          <span className="h-px w-6 bg-[#F7931A]" />
          COMPARADOR DE EXCHANGES DE BITCOIN EN MÉXICO
        </div>

        <h1 className="max-w-[780px] text-[40px] font-bold leading-[0.96] tracking-[-0.04em] text-[var(--fg)] md:text-[64px]">
          ¿Dónde comprar
          <br />
          Bitcoin en México?
        </h1>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex-1 min-w-0">
            <p className="max-w-[470px] text-[16px] font-normal leading-relaxed tracking-[-0.01em] text-[var(--fg-muted)] md:text-[17px]">
              Compara precio, fee y características
              <br />
              de los exchanges mexicanos en tiempo real.
            </p>

            <div
              ref={panelAnchorRef}
              className={`relative mt-5 w-full max-w-[460px] ${showCompact ? "h-[120px] md:h-[120px]" : ""
                }`}
            >
              <div
                ref={panelRef}
                className={`${showCompact ? "fixed left-0 right-0 top-16 z-40" : "relative"} will-change-transform`}
              >
                {showCompact ? (
                  /* ── Compact sticky bar ─────────────────────────── */
                  <div className="border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                    <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 md:px-16 md:gap-4">
                      {/* Inline input */}
                      <div
                        onClick={() => inputRef.current?.focus()}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-2)] bg-[var(--bg-raised)] px-3 py-1.5 font-ui-mono cursor-text"
                      >
                        <span className="text-lg font-bold text-[#F7931A]">$</span>
                        <input
                          ref={inputRef}
                          type="text"
                          inputMode="numeric"
                          value={displayValue}
                          onChange={handleChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="1,000"
                          className="w-[100px] bg-transparent text-lg font-bold text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)]"
                        />
                        <span className="text-[11px] font-medium text-[var(--fg-ghost)]">MXN</span>
                      </div>

                      {/* Quick amounts — scrollable row */}
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {QUICK_AMOUNTS.map((amt) => {
                          const active = mxn === amt;
                          return (
                            <button
                              key={amt}
                              onClick={() => handleQuick(amt)}
                              className={`shrink-0 rounded-full border px-3 py-1 font-ui-mono text-[11px] cursor-pointer transition-colors ${active
                                ? "border-[#F7931A55] bg-[#F7931A] font-bold text-[#07080A]"
                                : "border-[var(--border-2)] bg-[var(--bg-elevated)] font-medium text-[var(--fg-muted)] hover:text-[var(--fg-dim)]"
                                }`}
                            >
                              ${amt.toLocaleString("es-MX")}
                            </button>
                          );
                        })}
                      </div>

                      {/* Best exchange — desktop only */}
                      {best && (
                        <div className="ml-auto hidden shrink-0 items-center gap-2 font-ui-mono text-xs text-[var(--fg-muted)] md:flex">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F7931A]" />
                          <span>
                            Mejor: <span className="font-bold text-[#F7931A]">{best.name}</span>
                          </span>
                          {loading
                            ? <Skel w="w-16" h="h-3.5" />
                            : <span className="font-bold text-[var(--fg)]">{bestSats.toLocaleString("es-MX")} sats</span>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── Normal (non-compact) input ──────────────── */
                  <div>
                    <div
                      onClick={() => inputRef.current?.focus()}
                      className="w-full cursor-text rounded-[14px] border border-[#F7931A] bg-[var(--bg-raised)] px-4 py-3.5 font-ui-mono md:px-5 md:py-3.5 transition-shadow duration-200"
                      style={{
                        boxShadow: isFocused
                          ? "0 0 0 3px rgba(247,147,26,0.18), inset 0 1px 2px rgba(255,255,255,0.05)"
                          : "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)"
                      }}
                    >
                      <p className="font-ui-mono text-[10px] font-medium tracking-[0.2em] text-[var(--fg-muted)]">
                        INGRESA EL MONTO EN PESOS
                      </p>

                      <div className="mt-2.5 flex items-end gap-2 font-ui-mono">
                        <span className="text-[30px] font-bold leading-none text-[#F7931A] md:text-[34px]">$</span>
                        <input
                          ref={inputRef}
                          type="text"
                          inputMode="numeric"
                          value={displayValue}
                          onChange={handleChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="1,000"
                          className="min-w-0 flex-1 bg-transparent text-[30px] font-bold leading-none text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] md:text-[34px]"
                        />
                        <span className="pb-0.5 text-[13px] font-medium text-[var(--fg-ghost)] md:text-[16px]">MXN</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex overflow-x-auto items-center gap-2 pb-0.5 scrollbar-none" style={{ scrollbarWidth: "none" }}>
                      {QUICK_AMOUNTS.map((amt) => {
                        const active = mxn === amt;
                        return (
                          <button
                            key={amt}
                            onClick={() => handleQuick(amt)}
                            className={`shrink-0 rounded-md border px-3.5 py-1.5 font-ui-mono text-xs cursor-pointer transition-colors ${active
                              ? "border-[#F7931A55] bg-[#F7931A1A] font-bold text-[#F7931A]"
                              : "border-[var(--border-2)] bg-[var(--bg-elevated)] font-medium text-[var(--fg-muted)] hover:text-[var(--fg-dim)]"
                              }`}
                          >
                            ${amt.toLocaleString("es-MX")}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>

          {best && (
            <aside className="hidden w-[300px] shrink-0 lg:block" style={{ perspective: "1000px" }}>
              {/* Flip container */}
              <div
                onClick={() => setFlipped((f) => !f)}
                className="relative cursor-pointer rounded-xl"
                style={{
                  height: "200px",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* ── FRONT FACE ─────────────────────────────────── */}
                <div
                  className="absolute inset-0 rounded-xl border border-[var(--border-winner-card)] bg-[var(--bg-winner-card)] p-5 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.07), 0 2px 4px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-[#F7931A30] bg-[#F7931A1A] px-1.5 py-0.5 font-ui-mono text-[10px] font-bold text-[#F7931A]">★</span>
                    <span className="font-ui-mono text-[10px] font-semibold tracking-[0.15em] text-[var(--fg-muted)]">MEJOR OPCIÓN HOY</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <ExchangeLogo exchange={best} size={56} rounded="rounded-xl" />
                    <div>
                      <p className="text-[22px] font-bold leading-tight text-[var(--fg)]">{best.name}</p>
                      {loading
                        ? <Skel w="w-28" h="h-4" />
                        : <p className="font-ui-mono text-[13px] font-semibold text-[#F7931A]">
                            {bestSats.toLocaleString("es-MX")} sats
                          </p>
                      }
                    </div>
                  </div>

                  <p className="font-ui-mono text-[10px] text-[var(--fg-faint)] tracking-[0.08em]">
                    ↓ toca para ver el análisis
                  </p>
                </div>

                {/* ── BACK FACE ──────────────────────────────────── */}
                <div
                  className="absolute inset-0 rounded-xl border border-[var(--border-winner-card)] bg-[var(--bg-winner-card)] p-5 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.07), 0 2px 4px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-[#F7931A30] bg-[#F7931A1A] px-1.5 py-0.5 font-ui-mono text-[10px] font-bold text-[#F7931A]">★</span>
                    <span className="font-ui-mono text-[10px] font-semibold tracking-[0.15em] text-[var(--fg-muted)]">MEJOR OPCIÓN HOY</span>
                  </div>

                  <div>
                    {loading
                      ? <Skel w="w-36" h="h-9" />
                      : <div className="flex items-center gap-2">
                          <SatSymbol size={28} className="text-[var(--fg-dim)] opacity-60 shrink-0 self-center" />
                          <p
                            className="font-ui-mono text-[40px] font-bold leading-none tracking-[-0.03em]"
                            style={{
                              background: "linear-gradient(to bottom, var(--fg) 20%, var(--fg-dim) 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {bestSats.toLocaleString("es-MX")}
                          </p>
                        </div>
                    }
                    <p className="font-ui-mono text-[11px] text-[var(--fg-muted)] mt-0.5">{satsToBtc(bestSats)} BTC</p>
                  </div>

                  <div className="border-t border-[var(--border-winner-divider)] pt-2.5">
                    <p className="font-ui-mono text-[10px] text-[var(--fg-faint)]">Si eligieras el peor exchange hoy</p>
                    {loading
                      ? <Skel w="w-40" h="h-4" />
                      : <p className="font-ui-mono text-[13px] font-bold text-[var(--accent-red,#e05252)] mt-1">
                          ▼ {satsLost.toLocaleString("es-MX")} sats menos (~${mxnLost.toLocaleString("es-MX")} MXN)
                        </p>
                    }
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
