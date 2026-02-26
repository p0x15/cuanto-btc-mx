"use client";

import { useRef, useState } from "react";
import { calcSats, exchanges } from "@/data/exchanges";
import { useLivePrices, scalePrice } from "@/hooks/useLivePrices";

interface HeroInputProps {
  mxn: number;
  onChange: (value: number) => void;
}

const QUICK_AMOUNTS = [500, 1_000, 5_000, 10_000, 50_000];

export function HeroInput({ mxn, onChange }: HeroInputProps) {
  const [focused, setFocused] = useState(false);
  const [rawDigits, setRawDigits] = useState("1000");
  const inputRef = useRef<HTMLInputElement>(null);
  const { spot, ask, loading, error } = useLivePrices();

  const liveExchanges = exchanges.map((ex) => {
    if (ex.id === "bitso" && !loading && !error) return { ...ex, btcPriceMxn: ask };
    if (!loading && !error) return { ...ex, btcPriceMxn: scalePrice(ex.btcPriceMxn, spot) };
    return ex;
  });

  const best = [...liveExchanges].sort(
    (a, b) => calcSats(mxn, b) - calcSats(mxn, a)
  )[0];
  const bestSats = mxn > 0 ? calcSats(mxn, best) : 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    setRawDigits(digits);
    onChange(parseInt(digits || "0", 10));
  }

  function handleQuick(amount: number) {
    setRawDigits(String(amount));
    onChange(amount);
    inputRef.current?.focus();
  }

  const displayValue = focused
    ? rawDigits
    : rawDigits
    ? parseInt(rawDigits, 10).toLocaleString("es-MX")
    : "";

  return (
    <div className="sticky top-14 z-40 border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-4 md:py-5">

        {/* Title row */}
        <div className="mb-3 flex items-end justify-between gap-3 flex-wrap">
          <h1 className="text-[20px] md:text-[28px] font-black tracking-tight text-[var(--fg)] leading-tight">
            ¿Cuánto Bitcoin recibes con tus pesos?
          </h1>
          {/* "Mejor hoy" — desktop only */}
          {bestSats > 0 && (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-[var(--fg-muted)]">Mejor hoy:</span>
              <span className="font-bold text-[#F7931A]">{best.name}</span>
              <span className="font-black text-[var(--fg)]">
                {bestSats.toLocaleString("es-MX")} sats
              </span>
            </div>
          )}
        </div>

        {/* Input + quick amounts */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Amount input */}
          <div
            onClick={() => inputRef.current?.focus()}
            className={`flex items-center gap-2 rounded-xl px-4 md:px-5 py-3 cursor-text border transition-all duration-150 bg-[var(--bg-elevated)] w-full md:w-auto ${
              focused
                ? "border-[#F7931A]"
                : "border-[var(--border-2)] hover:border-[var(--fg-faint)]"
            }`}
          >
            <span className="text-[24px] md:text-[26px] font-black text-[#F7931A] leading-none select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="1,000"
              className="flex-1 md:w-32 bg-transparent text-[24px] md:text-[26px] font-black text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] leading-none"
            />
            <span className="text-[13px] font-semibold text-[var(--fg-faint)] self-end mb-0.5 select-none">MXN</span>
          </div>

          {/* Quick amounts — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuick(amt)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-100 cursor-pointer flex-shrink-0 ${
                  mxn === amt
                    ? "bg-[#F7931A] text-[#0B0B0B] scale-105"
                    : "bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:bg-[var(--bg-high)] hover:text-[var(--fg)]"
                }`}
              >
                ${amt.toLocaleString("es-MX")}
              </button>
            ))}
          </div>
        </div>

        {/* "Mejor hoy" — mobile only, below input */}
        {bestSats > 0 && (
          <div className="md:hidden mt-2.5 flex items-center gap-1.5 text-[13px]">
            <span className="text-[var(--fg-muted)]">Mejor:</span>
            <span className="font-bold text-[#F7931A]">{best.name}</span>
            <span className="font-black text-[var(--fg)]">{bestSats.toLocaleString("es-MX")} sats</span>
          </div>
        )}
      </div>
    </div>
  );
}
