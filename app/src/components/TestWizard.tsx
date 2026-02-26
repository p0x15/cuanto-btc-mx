"use client";

import { useState } from "react";
import Link from "next/link";
import { calcSats, exchanges, KycLevel } from "@/data/exchanges";
import { ExchangeLogo } from "@/components/ExchangeLogo";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "sats" | "nokyc" | "spei" | "lightning" | "noncustodial";

interface PriorityItem {
  id: Priority;
  label: string;
  sub: string;
  tag: string;
}

const PRIORITIES: PriorityItem[] = [
  { id: "sats",         label: "Maximizar sats",      sub: "Recibe más Bitcoin por tu dinero",       tag: "Precio"      },
  { id: "nokyc",        label: "Sin KYC / mínimo",    sub: "Sin verificación de identidad",          tag: "Privacidad"  },
  { id: "spei",         label: "Soporta SPEI",        sub: "Depósito bancario mexicano",             tag: "Pago MX"     },
  { id: "lightning",    label: "Retiro por Lightning", sub: "Saca tus sats al instante",             tag: "⚡ LN"        },
  { id: "noncustodial", label: "No custodial",         sub: "Tú controlas tus llaves privadas",      tag: "Soberanía"   },
];

const QUICK_AMOUNTS = [500, 1_000, 5_000, 10_000, 50_000];

// ─── Score function ───────────────────────────────────────────────────────────

function scoreExchange(
  ex: Parameters<typeof calcSats>[1],
  priorities: Priority[],
  mxn: number
) {
  let score = 0;
  const weight = priorities.length + 1;

  priorities.forEach((p, i) => {
    const pts = weight - i;
    if (p === "sats") {
      const sats = calcSats(mxn, ex);
      score += (sats / 2000) * pts;
    }
    if (p === "nokyc"        && ex.kyc === "none")  score += pts * 10;
    if (p === "spei"         && ex.spei)             score += pts * 10;
    if (p === "lightning"    && ex.lightning)        score += pts * 10;
    if (p === "noncustodial" && ex.nonCustodial)     score += pts * 10;
  });

  return score;
}

const KYC_DISPLAY: Record<KycLevel, string> = {
  none: "Sin KYC",
  basic: "KYC básico",
  full: "KYC completo",
};

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
              s <= step ? "bg-[#F7931A]" : "bg-[var(--bg-elevated)]"
            }`}
          />
          {s < 3 && <div className="w-1" />}
        </div>
      ))}
      <span className="ml-2 text-[11px] font-bold tracking-widest text-[var(--fg-muted)]">
        PASO {step} DE 3
      </span>
    </div>
  );
}

// ─── Sortable item ────────────────────────────────────────────────────────────

function SortablePriorityItem({
  id,
  index,
  isFirst,
}: {
  id: Priority;
  index: number;
  isFirst: boolean;
}) {
  const p = PRIORITIES.find((x) => x.id === id)!;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors select-none ${
        isDragging ? "shadow-2xl ring-2 ring-[#F7931A44]" : ""
      } ${isFirst ? "bg-[#F7931A] text-[#0B0B0B]" : "bg-[var(--bg-elevated)] text-[var(--fg)]"}`}
    >
      {/* Rank number */}
      <span
        className={`w-7 text-xl font-black ${
          isFirst ? "text-[#0B0B0B]" : "text-[#F7931A]"
        }`}
      >
        {index + 1}
      </span>

      {/* Label + sub */}
      <div className="flex-1">
        <div className={`font-bold text-[16px] ${isFirst ? "text-[#0B0B0B]" : "text-[var(--fg)]"}`}>
          {p.label}
        </div>
        <div className={`text-[13px] ${isFirst ? "text-[#0B0B0B99]" : "text-[var(--fg-muted)]"}`}>
          {p.sub}
        </div>
      </div>

      {/* Tag */}
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
          isFirst ? "bg-[#0B0B0B22] text-[#0B0B0B]" : "bg-[var(--bg-high)] text-[var(--fg-dim)]"
        }`}
      >
        {p.tag}
      </span>

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className={`flex flex-col gap-[3px] p-2 rounded-lg cursor-grab active:cursor-grabbing touch-none transition-colors ${
          isFirst ? "hover:bg-[#0B0B0B22]" : "hover:bg-[var(--bg-high)]"
        }`}
        aria-label="Arrastrar para reordenar"
      >
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-[3px]">
            {[0, 1].map((col) => (
              <div
                key={col}
                className={`h-1 w-1 rounded-full ${
                  isFirst ? "bg-[#0B0B0B55]" : "bg-[var(--fg-muted)]"
                }`}
              />
            ))}
          </div>
        ))}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TestWizard() {
  const [step, setStep] = useState(1);
  const [orderedPriorities, setOrderedPriorities] = useState<Priority[]>(
    PRIORITIES.map((p) => p.id)
  );
  const [mxn, setMxn] = useState(1_000);
  const [rawDigits, setRawDigits] = useState("1000");
  const [focused, setFocused] = useState(false);

  // ── dnd-kit sensors ──────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedPriorities((prev) => {
        const oldIndex = prev.indexOf(active.id as Priority);
        const newIndex = prev.indexOf(over.id as Priority);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  // ── Step 2: amount ────────────────────────────────────────────────────────

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    setRawDigits(digits);
    setMxn(parseInt(digits || "0", 10));
  }

  // ── Step 3: ranked results ────────────────────────────────────────────────

  const amount = mxn > 0 ? mxn : 1_000;

  const rankedExchanges = [...exchanges].sort(
    (a, b) =>
      scoreExchange(b, orderedPriorities, amount) -
      scoreExchange(a, orderedPriorities, amount)
  );

  const displayValue = focused
    ? rawDigits
    : rawDigits
    ? parseInt(rawDigits, 10).toLocaleString("es-MX")
    : "";

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <StepIndicator step={step} />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#F7931A]">
              PASO 1 — TUS PRIORIDADES
            </span>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-[var(--fg)] leading-tight">
              ¿Qué te importa<br />más al comprar Bitcoin?
            </h2>
            <p className="mt-3 text-[15px] text-[var(--fg-muted)]">
              Arrastra para reordenar de mayor a menor importancia. El comparador usará este orden para rankear los exchanges.
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedPriorities}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {orderedPriorities.map((id, i) => (
                  <SortablePriorityItem
                    key={id}
                    id={id}
                    index={i}
                    isFirst={i === 0}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-[#F7931A] py-4 text-[17px] font-bold text-[#0B0B0B] transition-opacity hover:opacity-90 cursor-pointer"
          >
            Siguiente paso →
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#F7931A]">
              PASO 2 — TU MONTO
            </span>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-[var(--fg)] leading-tight">
              ¿Cuánto quieres<br />invertir?
            </h2>
            <p className="mt-3 text-[15px] text-[var(--fg-muted)]">
              Ingresa el monto y verás cuántos sats recibirías en cada plataforma.
            </p>
          </div>

          {/* Big input */}
          <div
            className={`flex items-center gap-3 rounded-2xl px-6 py-5 border-2 transition-all duration-150 cursor-text bg-[var(--bg-elevated)] ${
              focused ? "border-[#F7931A]" : "border-[var(--border-2)]"
            }`}
            onClick={() => document.getElementById("amount-input")?.focus()}
          >
            <span className="text-5xl font-black text-[#F7931A] leading-none">$</span>
            <input
              id="amount-input"
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleAmountChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="1,000"
              className="flex-1 bg-transparent text-5xl font-black text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] leading-none"
            />
            <span className="text-lg font-semibold text-[var(--fg-faint)] self-end mb-1">MXN</span>
          </div>

          {/* Sat preview */}
          {mxn > 0 && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F7931A11] border border-[#F7931A22] px-4 py-3">
              <span className="text-xl">₿</span>
              <span className="text-[14px] font-semibold text-[#F7931A]">
                ≈ {calcSats(mxn, rankedExchanges[0]).toLocaleString("es-MX")} sats
              </span>
              <span className="text-[13px] text-[var(--fg-muted)]">
                al mejor precio disponible ({rankedExchanges[0].name})
              </span>
            </div>
          )}

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => { setRawDigits(String(amt)); setMxn(amt); }}
                className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all cursor-pointer ${
                  mxn === amt
                    ? "bg-[#F7931A] text-[#0B0B0B] scale-105"
                    : "bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:bg-[var(--bg-high)] hover:text-[var(--fg)]"
                }`}
              >
                ${amt.toLocaleString("es-MX")}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-4 text-[15px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            >
              ← Volver
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={mxn <= 0}
              className="flex-[2] rounded-2xl bg-[#F7931A] py-4 text-[17px] font-bold text-[#0B0B0B] transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              Ver mi ranking →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#F7931A]">
              PASO 3 — RESULTADOS
            </span>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h2 className="text-4xl font-black tracking-tight text-[var(--fg)] leading-tight">
                Tu ranking<br />personalizado
              </h2>
              <div className="flex flex-col items-end gap-1 pb-1">
                <span className="text-[11px] text-[var(--fg-muted)]">Monto</span>
                <span className="text-xl font-black text-[var(--fg)]">
                  ${amount.toLocaleString("es-MX")} MXN
                </span>
              </div>
            </div>
            <p className="mt-2 text-[13px] text-[var(--fg-muted)]">
              Ordenado según tus prioridades:{" "}
              {orderedPriorities
                .slice(0, 3)
                .map((id) => PRIORITIES.find((p) => p.id === id)!.label)
                .join(" → ")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {rankedExchanges.map((ex, i) => {
              const sats = calcSats(amount, ex);
              const bestSats = calcSats(amount, rankedExchanges[0]);
              const isWinner = i === 0;
              const medals = ["🥇", "🥈", "🥉"];

              return (
                <a
                  key={ex.id}
                  href={ex.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col gap-3 rounded-2xl p-5 transition-colors ${
                    isWinner
                      ? "bg-[#F7931A] hover:opacity-95"
                      : "bg-[var(--bg-elevated)] hover:bg-[var(--bg-high)]"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-black px-2.5 py-1 rounded-full ${
                      isWinner ? "bg-[#0B0B0B22] text-[#0B0B0B]" : "bg-[var(--bg-high)] text-[var(--fg-dim)]"
                    }`}>
                      {i === 0 ? "🥇 Mejor opción" : i === 1 ? "🥈 2do lugar" : i === 2 ? "🥉 3er lugar" : `#${i + 1}`}
                    </span>
                    <div className="flex-1" />
                    {/* Sats */}
                    <div className="text-right">
                      <div className={`text-2xl font-black tabular-nums leading-none ${
                        isWinner ? "text-[#0B0B0B]" : "text-[var(--fg)]"
                      }`}>
                        {sats.toLocaleString("es-MX")}
                        <span className={`ml-1 text-sm font-semibold ${isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"}`}>
                          sats
                        </span>
                      </div>
                      {!isWinner && (
                        <div className="text-[11px] text-[var(--fg-faint)] tabular-nums">
                          ▼ {(bestSats - sats).toLocaleString("es-MX")} menos
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exchange name + type */}
                  <div className="flex items-center gap-3">
                    <ExchangeLogo exchange={ex} size={40} onOrange={isWinner} />
                    <div>
                      <div className={`font-bold text-[15px] group-hover:underline ${isWinner ? "text-[#0B0B0B]" : "text-[var(--fg)]"}`}>
                        {ex.name}
                      </div>
                      <div className={`text-xs ${isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"}`}>
                        {ex.type}
                      </div>
                    </div>
                    <div className="flex-1" />
                    {/* Stats */}
                    <div className={`text-right text-[13px] ${isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"}`}>
                      <div>${ex.btcPriceMxn.toLocaleString("es-MX")} MXN</div>
                      <div>{ex.feePct}% comisión</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {ex.spei && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isWinner
                          ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                          : "bg-[var(--green-bg)] text-[var(--accent-green)]"
                      }`}>
                        SPEI
                      </span>
                    )}
                    {ex.lightning && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isWinner
                          ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                          : "bg-[var(--yellow-bg)] text-[var(--accent-yellow)]"
                      }`}>
                        ⚡ Lightning
                      </span>
                    )}
                    {ex.nonCustodial && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isWinner
                          ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                          : "bg-[var(--bg-high)] text-[var(--fg-dim)]"
                      }`}>
                        No custodial
                      </span>
                    )}
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      isWinner
                        ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                        : "bg-[var(--bg-high)] text-[var(--fg-muted)]"
                    }`}>
                      {KYC_DISPLAY[ex.kyc]}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-3.5 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            >
              ← Cambiar monto
            </button>
            <button
              onClick={() => { setStep(1); setOrderedPriorities(PRIORITIES.map(p => p.id)); }}
              className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-3.5 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            >
              ↺ Reiniciar test
            </button>
          </div>

          <Link
            href="/"
            className="text-center text-[13px] text-[var(--fg-faint)] hover:text-[#F7931A] transition-colors"
          >
            Ver todos los precios en tiempo real →
          </Link>
        </div>
      )}
    </main>
  );
}
