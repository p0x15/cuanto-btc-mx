"use client";

import { useState, useEffect } from "react";

const FUN_FACTS = [
  {
    emoji: "🍫",
    fact: "El cacao fue dinero oficial en México por más de 1,000 años. Literalmente podías comprar un guajolote con 100 granos.",
  },
  {
    emoji: "🪙",
    fact: "El Peso mexicano nació en 1732. Fue la primera moneda de reserva mundial — incluso los Founding Fathers de EUA lo usaban.",
  },
  {
    emoji: "📉",
    fact: "El peso ha perdido más del 99% de su valor frente al dólar en los últimos 50 años. Bitcoin lleva 15 años subiendo.",
  },
  {
    emoji: "💸",
    fact: "México recibe $67 mil millones de dólares en remesas al año — el 3er lugar mundial. Western Union se lleva hasta 10% de comisión.",
  },
  {
    emoji: "⚡",
    fact: "Con Bitcoin y Lightning Network, mandar remesas a México cuesta menos del 1%. Tu familia recibe más.",
  },
  {
    emoji: "₿",
    fact: "Solo existirán 21 millones de Bitcoin en toda la historia. El Banco de México no tiene ese límite.",
  },
  {
    emoji: "🗺️",
    fact: "En la era colonial, diferentes regiones de México usaban distintas monedas locales. El peso unificó todo — igual que Bitcoin lo hace hoy globalmente.",
  },
  {
    emoji: "🏦",
    fact: "Hoy, más de 50 millones de mexicanos están 'subbancarizados'. Bitcoin no te pide comprobante de domicilio.",
  },
  {
    emoji: "📱",
    fact: "Bitso, Buda, Kraken, Binance y Aureo compiten por darte el mejor precio. En cuantobtc.lat los comparamos en tiempo real.",
  },
  {
    emoji: "🌽",
    fact: "Los aztecas tenían múltiples monedas: cacao para lo cotidiano, mantas de tela (quachtli) para compras grandes. Como satoshis y BTC.",
  },
];

export function MapMobileFallback() {
  const [factIndex, setFactIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-rotate every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [factIndex]);

  function goToNext() {
    setAnimating(true);
    setTimeout(() => {
      setFactIndex((i) => (i + 1) % FUN_FACTS.length);
      setAnimating(false);
    }, 200);
  }

  function goToPrev() {
    setAnimating(true);
    setTimeout(() => {
      setFactIndex((i) => (i - 1 + FUN_FACTS.length) % FUN_FACTS.length);
      setAnimating(false);
    }, 200);
  }

  function handleCopy() {
    navigator.clipboard.writeText("https://www.cuantobtc.lat/mapa").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const current = FUN_FACTS[factIndex];

  return (
    <div className="lg:hidden flex-1 flex flex-col items-center justify-start pb-24 gap-0 overflow-y-auto">

      {/* Desktop-only banner strip */}
      <div className="w-full border-b border-[#F7931A30] bg-[#F7931A08] px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 text-base">🖥️</span>
          <p className="font-ui-mono text-[11px] text-[var(--fg-muted)] leading-snug">
            <span className="font-bold text-[var(--fg)]">Mejor en escritorio.</span>{" "}
            Este mapa interactivo está diseñado para pantallas grandes.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 rounded-md border border-[#F7931A40] bg-[#F7931A15] px-2.5 py-1.5 font-ui-mono text-[10px] font-bold text-[#F7931A] active:scale-95 transition-transform"
        >
          {copied ? "✓ Copiado" : "Copiar link"}
        </button>
      </div>

      <div className="w-full px-5 pt-5 flex flex-col items-center gap-6">

      {/* Fun facts section */}
      <div className="w-full max-w-sm">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#F7931A] mb-3">
          MIENTRAS TANTO — SABÍAS QUE...
        </p>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)] p-5 min-h-[140px] flex flex-col justify-between gap-4">
          {/* Fact content */}
          <div
            className="flex gap-3 items-start transition-opacity duration-200"
            style={{ opacity: animating ? 0 : 1 }}
          >
            <span className="text-3xl shrink-0 leading-none mt-0.5">{current.emoji}</span>
            <p className="text-sm text-[var(--fg)] leading-relaxed">{current.fact}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-1">
              {FUN_FACTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAnimating(true);
                    setTimeout(() => { setFactIndex(i); setAnimating(false); }, 200);
                  }}
                  className="transition-all duration-200"
                  style={{
                    width: i === factIndex ? 16 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: i === factIndex ? "#F7931A" : "var(--border-2)",
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={goToPrev}
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] text-sm active:scale-95 transition-transform"
              >
                ←
              </button>
              <button
                onClick={goToNext}
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] text-sm active:scale-95 transition-transform"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[var(--fg-muted)] text-center mt-3">
          {factIndex + 1} / {FUN_FACTS.length} datos históricos
        </p>
      </div>
      </div>
    </div>
  );
}
