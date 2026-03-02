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
    <div className="lg:hidden flex-1 flex flex-col items-center justify-start px-5 pt-6 pb-24 gap-6 overflow-y-auto">

      {/* Main message card */}
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)] p-6 flex flex-col items-center text-center gap-4">
        <div className="text-5xl">🖥️</div>
        <div>
          <p className="text-lg font-black text-[var(--fg)] leading-tight">
            Este mapa se ve mejor en tu computadora
          </p>
          <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">
            El mapa interactivo de 600 años de historia monetaria en México está diseñado para pantallas grandes. Ábrelo en tu compu para la experiencia completa.
          </p>
        </div>

        {/* Copy link button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F7931A] text-black font-bold text-sm py-3 px-4 active:scale-95 transition-transform"
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>¡Link copiado!</span>
            </>
          ) : (
            <>
              <span>🔗</span>
              <span>Copiar link del mapa</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-[var(--fg-muted)]">
          cuantobtc.lat/mapa
        </p>
      </div>

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
  );
}
