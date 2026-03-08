"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { calcSats, exchanges, Exchange, KycLevel } from "@/data/exchanges";
import { satsToBtc } from "@/lib/formatBtc";
import { ExchangeLogo } from "@/components/ExchangeLogo";
import { SatSymbol } from "@/components/SatSymbol";
import { getPriceForExchange, useLivePrices } from "@/hooks/useLivePrices";

// ─── Question & answer types ──────────────────────────────────────────────────

type QuestionId = "experience" | "main_priority" | "payment" | "wallet" | "privacy_depth" | "amount";
type Answers = Partial<Record<QuestionId, string>>;

interface AnswerOption {
  id: string;
  emoji: string;
  label: string;
  sub: string;
}

interface Question {
  id: QuestionId;
  eyebrow: string;
  headline: string;
  sub: string;
  /** Options can depend on prior answers */
  options: (answers: Answers) => AnswerOption[];
}

// ─── Question definitions ─────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "experience",
    eyebrow: "PARA EMPEZAR",
    headline: "¿Cuánto sabes\nsobre Bitcoin?",
    sub: "Sin juicios — todos empezamos desde cero.",
    options: () => [
      {
        id: "beginner",
        emoji: "🌱",
        label: "Soy principiante",
        sub: "Nunca he comprado Bitcoin o apenas empiezo a explorar",
      },
      {
        id: "intermediate",
        emoji: "📈",
        label: "Tengo algo de experiencia",
        sub: "Ya compré Bitcoin antes y entiendo lo básico",
      },
      {
        id: "advanced",
        emoji: "⚡",
        label: "Soy tech-savvy",
        sub: "Conozco Lightning, wallets, llaves privadas y P2P",
      },
    ],
  },

  {
    id: "main_priority",
    eyebrow: "TU PRIORIDAD",
    headline: "Si solo pudieras\nelegir una cosa...",
    sub: "¿Qué es lo más importante para ti al comprar Bitcoin?",
    options: (answers) => {
      const base: AnswerOption[] = [
        {
          id: "price",
          emoji: "💰",
          label: "Recibir el máximo de Bitcoin",
          sub: "Quiero el mejor precio y las comisiones más bajas",
        },
        {
          id: "simple",
          emoji: "🛡️",
          label: "Que sea simple y confiable",
          sub: "Prefiero una plataforma conocida y fácil de usar",
        },
        {
          id: "privacy",
          emoji: "🕵️",
          label: "Privacidad — sin dar mis datos",
          sub: "No quiero registrarme ni verificar mi identidad",
        },
      ];
      // Only show "control" option for non-beginners — beginners don't know what non-custodial means
      if (answers.experience !== "beginner") {
        base.push({
          id: "control",
          emoji: "🔑",
          label: "Control total de mis sats",
          sub: "Quiero tener mis Bitcoin en mi propia wallet, no en el exchange",
        });
      }
      return base;
    },
  },

  {
    id: "payment",
    eyebrow: "MÉTODO DE PAGO",
    // Dynamic headline/sub handled in options; we keep a sensible default here
    headline: "¿Cómo quieres\npagar?",
    sub: "Esto determina qué plataformas están disponibles para ti.",
    options: (answers) => {
      if (answers.experience === "beginner") {
        // Jargon-free framing for beginners
        return [
          {
            id: "spei",
            emoji: "🏦",
            label: "Sí, tengo cuenta de banco",
            sub: "Puedo transferir desde Banamex, BBVA, HSBC u otro banco mexicano",
          },
          {
            id: "any",
            emoji: "💵",
            label: "No tengo o prefiero efectivo",
            sub: "Muéstrame opciones que no requieran cuenta bancaria",
          },
        ];
      }
      // Intermediate / advanced
      return [
        {
          id: "spei",
          emoji: "🏦",
          label: "Transferencia SPEI",
          sub: "Desde cualquier banco mexicano, rápido y sin costo extra",
        },
        {
          id: "p2p",
          emoji: "🤝",
          label: "P2P / efectivo",
          sub: "Prefiero operar persona a persona o en efectivo",
        },
        {
          id: "any",
          emoji: "🤷",
          label: "Me da igual",
          sub: "Muéstrame todas las opciones disponibles",
        },
      ];
    },
  },

  {
    id: "wallet",
    eyebrow: "TU WALLET",
    headline: "¿Ya tienes una\nwallet de Bitcoin?",
    sub: "Esto nos ayuda a saber cómo quieres recibir tus sats.",
    options: (answers) => {
      const isControl = answers.main_priority === "control";
      const isBeginner = answers.experience === "beginner";

      if (isBeginner) {
        // Privacy path for beginners — simplified options, no jargon
        return [
          {
            id: "none",
            emoji: "📱",
            label: "No, todavía no tengo una",
            sub: "Está bien — el exchange guardará mis Bitcoin por ahora",
          },
          {
            id: "lightning",
            emoji: "⚡",
            label: "Sí — tengo Muun o Phoenix",
            sub: "Apps de Bitcoin que me permiten enviar y recibir rápido",
          },
        ];
      }

      if (isControl) {
        // Control path — no "none" option, must have own wallet
        return [
          {
            id: "lightning",
            emoji: "⚡",
            label: "Wallet Lightning",
            sub: "Phoenix, Muun, Zeus u otra wallet Lightning",
          },
          {
            id: "onchain",
            emoji: "🔐",
            label: "Wallet on-chain / hardware",
            sub: "Ledger, Trezor, Sparrow u otra wallet de Bitcoin",
          },
        ];
      }

      // Intermediate / advanced privacy path — full options
      return [
        {
          id: "none",
          emoji: "📱",
          label: "No, que el exchange lo guarde",
          sub: "Por ahora prefiero que la plataforma custodie mis Bitcoin",
        },
        {
          id: "lightning",
          emoji: "⚡",
          label: "Sí — wallet Lightning",
          sub: "Tengo una app como Phoenix, Muun o Zeus",
        },
        {
          id: "onchain",
          emoji: "🔐",
          label: "Sí — wallet on-chain / hardware",
          sub: "Tengo una Ledger, Trezor u otra wallet de Bitcoin",
        },
      ];
    },
  },

  {
    id: "privacy_depth",
    eyebrow: "NIVEL DE PRIVACIDAD",
    headline: "¿Qué tan en serio\nvas con la privacidad?",
    sub: "Ambas opciones son sin registro. Solo cuánto esfuerzo quieres poner.",
    options: () => [
      {
        id: "clearnet",
        emoji: "🕵️",
        label: "Buena privacidad, sin complicarme",
        sub: "Sin cuenta, sin foto de INE — desde el navegador normal",
      },
      {
        id: "deep",
        emoji: "🌐",
        label: "Máxima privacidad — Tor / Nostr",
        sub: "Uso Tor o Nostr y quiero la opción más anónima posible",
      },
    ],
  },
];

// ─── Branching logic ──────────────────────────────────────────────────────────

/**
 * Returns the ordered list of question IDs the user will see, given answers so far.
 * Must handle incomplete answers gracefully (called before all answers exist).
 *
 * Full decision tree:
 *
 * BEGINNER:
 *   price   → payment → amount
 *   simple  → amount                    ← shortest path (3 questions)
 *   privacy → wallet → amount
 *
 * INTERMEDIATE:
 *   price   → payment → amount
 *   simple  → payment → amount
 *   privacy → wallet  → amount
 *   control → wallet  → amount
 *
 * ADVANCED:
 *   price   → payment → amount
 *   simple  → payment → amount
 *   privacy → wallet  → privacy_depth → amount
 *   control → wallet  → amount
 */
function getPath(answers: Answers): QuestionId[] {
  const exp = answers.experience;
  const pri = answers.main_priority;

  // Always start with experience + main_priority
  const path: QuestionId[] = ["experience", "main_priority"];

  if (exp === "beginner") {
    if (pri === "simple") {
      // Shortest path — no extra questions for beginners who just want simple
      // falls through to amount
    } else if (pri === "privacy") {
      path.push("wallet");
    } else {
      // price or unknown — ask about bank account
      path.push("payment");
    }
  } else if (exp === "intermediate") {
    if (pri === "privacy" || pri === "control") {
      path.push("wallet");
    } else {
      // price, simple, or unknown
      path.push("payment");
    }
  } else if (exp === "advanced") {
    if (pri === "privacy") {
      path.push("wallet", "privacy_depth");
    } else if (pri === "control") {
      path.push("wallet");
    } else {
      // price, simple, or unknown
      path.push("payment");
    }
  } else {
    // experience not yet answered — show payment as default next question estimate
    path.push("payment");
  }

  path.push("amount");
  return path;
}

function getNextQuestionId(currentId: QuestionId, answers: Answers): QuestionId | "results" {
  const path = getPath(answers);
  const idx = path.indexOf(currentId);
  if (idx === -1 || idx === path.length - 1) return "results";
  return path[idx + 1];
}

function getPrevQuestionId(currentId: QuestionId, answers: Answers): QuestionId | null {
  const path = getPath(answers);
  const idx = path.indexOf(currentId);
  if (idx <= 0) return null;
  return path[idx - 1];
}

// ─── Score weights derived from answers ───────────────────────────────────────

interface ScoreWeights {
  sats: number;
  nokyc: number;
  spei: number;
  lightning: number;
  noncustodial: number;
  /** Per-complexity multiplier applied to the final score */
  complexityPenalty: Record<"beginner" | "intermediate" | "advanced", number>;
}

// How complex each exchange's flow is for the buyer
const EXCHANGE_COMPLEXITY: Record<string, "beginner" | "intermediate" | "advanced"> = {
  bitso: "beginner",
  buda: "beginner",
  kapitalex: "beginner",
  kraken: "beginner",      // standard global exchange, familiar UX
  aureo: "intermediate",   // requires Lightning wallet to receive sats
  binance: "intermediate", // P2P flow requires some setup
  "hodl-hodl": "advanced",
  mostro: "advanced",
  robosats: "advanced",
  lnp2pbot: "advanced",
};

const COMPLEXITY_NOTE: Record<"intermediate" | "advanced", string> = {
  intermediate:
    "Este exchange tiene un flujo un poco más técnico — necesitas tener una wallet de Lightning configurada para recibir tus sats.",
  advanced:
    "Esta plataforma está pensada para usuarios con experiencia. Requiere conocer Lightning, wallets propias u operaciones P2P.",
};

function deriveWeights(answers: Answers): ScoreWeights {
  const weights: ScoreWeights = {
    sats: 1.0,
    nokyc: 1.0,
    spei: 1.0,
    lightning: 0.5,
    noncustodial: 0.5,
    complexityPenalty: { beginner: 1.0, intermediate: 1.0, advanced: 1.0 },
  };

  // Experience → complexity tolerance
  if (answers.experience === "beginner") {
    weights.complexityPenalty = { beginner: 1.0, intermediate: 0.6, advanced: 0.2 };
  } else if (answers.experience === "intermediate") {
    weights.complexityPenalty = { beginner: 1.0, intermediate: 1.0, advanced: 0.75 };
  }
  // advanced: no penalty

  // Main priority
  if (answers.main_priority === "price") {
    weights.sats = 3.5;
  } else if (answers.main_priority === "simple") {
    weights.sats = 1.5;
    // Also boost complexity penalty — preferring "simple" means actively avoid complex flows
    weights.complexityPenalty = {
      beginner: weights.complexityPenalty.beginner * 1.0,
      intermediate: weights.complexityPenalty.intermediate * 0.7,
      advanced: weights.complexityPenalty.advanced * 0.4,
    };
  } else if (answers.main_priority === "privacy") {
    weights.nokyc = 5.0;
    weights.sats = 0.8;
  } else if (answers.main_priority === "control") {
    weights.noncustodial = 4.0;
    weights.lightning = 2.5;
    weights.sats = 0.8;
  }

  // Payment preference
  if (answers.payment === "spei") {
    // Beginner with bank → SPEI strongly preferred
    // Intermediate/advanced explicit SPEI → also strongly preferred
    weights.spei = answers.experience === "beginner" ? 3.5 : 4.0;
  } else if (answers.payment === "any" && answers.experience === "beginner") {
    // Beginner without bank → penalize SPEI-only exchanges
    weights.spei = 0.2;
  } else if (answers.payment === "p2p") {
    // P2P preference → boost nokyc, deprioritize spei exchanges
    weights.nokyc = Math.max(weights.nokyc, 2.5);
    weights.spei = 0.3;
  }

  // Wallet type
  if (answers.wallet === "lightning") {
    weights.lightning = Math.max(weights.lightning, 3.5);
  } else if (answers.wallet === "onchain") {
    weights.noncustodial = Math.max(weights.noncustodial, 3.5);
  }

  // Privacy depth (advanced + privacy path only)
  if (answers.privacy_depth === "deep") {
    // Max privacy: Tor/Nostr territory (RoboSats, Mostro, lnp2pbot)
    // Also boost lightning since those platforms are Lightning-native
    weights.nokyc = Math.max(weights.nokyc, 6.0);
    weights.lightning = Math.max(weights.lightning, 3.0);
  }

  return weights;
}

// ─── Scoring function ─────────────────────────────────────────────────────────

function scoreExchange(
  ex: Exchange & { askPrice: number },
  weights: ScoreWeights,
  mxn: number
): number {
  let score = 0;

  // Sats score (normalized so ~2000 sats ≈ 1 point baseline)
  const sats = calcSats(mxn, ex.askPrice, ex.feePct);
  score += (sats / 2000) * weights.sats;

  // Feature bonuses
  if (ex.kyc === "none") score += weights.nokyc * 8;
  if (ex.spei) score += weights.spei * 8;
  if (ex.lightning) score += weights.lightning * 8;
  if (ex.nonCustodial) score += weights.noncustodial * 8;

  // Heavy penalty when user requires SPEI but exchange doesn't support it
  if (weights.spei >= 4 && !ex.spei) score *= 0.15;

  // Complexity penalty
  const complexity = EXCHANGE_COMPLEXITY[ex.id] ?? "beginner";
  score *= weights.complexityPenalty[complexity];

  return score;
}

// ─── Curated recommendation copy ─────────────────────────────────────────────

const EXCHANGE_BLURB: Record<string, string> = {
  bitso:      "El exchange más grande de México — precio competitivo, interfaz pulida y SPEI instantáneo.",
  buda:       "Comisiones transparentes y buen precio para compras recurrentes con SPEI.",
  kapitalex:  "Comisiones bajas y SPEI directo, ideal para empezar sin complicaciones.",
  kraken:     "Exchange global de reputación sólida, precio competitivo y fácil de usar.",
  aureo:      "Envía sats directo a tu wallet Lightning en segundos, sin intermediarios.",
  binance:    "La plataforma más grande del mundo — variedad de métodos de pago y alta liquidez.",
  "hodl-hodl":"P2P sin custodia y sin registro — tus sats van directo a tu wallet.",
  robosats:   "Máxima privacidad: sin cuenta, sin datos, Tor-native y no-custodial.",
  mostro:     "Descentralizado en Nostr — sin servidor central, sin cuenta, sin custodia.",
  lnp2pbot:  "P2P en Telegram con Lightning — sin registro, rápido y privado.",
};

const PRIORITY_SUFFIX: Record<string, string> = {
  price:   "De todos los exchanges disponibles, es el que más sats te da por tu dinero.",
  simple:  "Es la opción más sencilla y confiable para alguien que está empezando.",
  privacy: "Cumple tu prioridad: no necesitas registrarte ni verificar tu identidad.",
  control: "Tus sats llegan directo a tu wallet — nunca pasan la noche en el exchange.",
};

const KYC_DISPLAY: Record<KycLevel, string> = {
  none: "Sin KYC",
  basic: "KYC básico",
  full: "KYC completo",
};

const QUICK_AMOUNTS = [500, 1_000, 5_000, 10_000, 50_000];

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  currentId,
  answers,
  onResults,
}: {
  currentId: QuestionId | "results";
  answers: Answers;
  onResults: boolean;
}) {
  const path = getPath(answers);
  // +1 for results screen
  const total = path.length + 1;
  const current = onResults ? total : path.indexOf(currentId as QuestionId) + 1;

  return (
    <div className="flex items-center gap-2 mb-10">
      <div className="flex items-center gap-1.5 flex-1">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < current;
          const active = i === current - 1;
          return (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                flex: active ? 2 : 1,
                background: filled ? "#F7931A" : "var(--bg-elevated)",
              }}
            />
          );
        })}
      </div>
      <span className="shrink-0 font-ui-mono text-[11px] font-bold tracking-widest text-[var(--fg-muted)]">
        {onResults ? "RESULTADOS" : `${current} DE ${total}`}
      </span>
    </div>
  );
}

// ─── Single question screen ───────────────────────────────────────────────────

function QuestionScreen({
  question,
  answers,
  onAnswer,
  onBack,
}: {
  question: Question;
  answers: Answers;
  onAnswer: (optionId: string) => void;
  onBack: (() => void) | null;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const options = question.options(answers);

  function handleSelect(optionId: string) {
    if (pending) return;
    setPending(optionId);
    setTimeout(() => {
      onAnswer(optionId);
      setPending(null);
    }, 380);
  }

  // Reset pending when question changes
  useEffect(() => {
    setPending(null);
  }, [question.id]);

  return (
    <div className="flex flex-col gap-6">
      {/* Headline */}
      <div>
        <span className="font-ui-mono text-xs font-bold tracking-widest text-[#F7931A]">
          {question.eyebrow}
        </span>
        <h2 className="mt-2 whitespace-pre-line text-4xl font-black tracking-tight text-[var(--fg)] leading-[1.05]">
          {question.headline}
        </h2>
        <p className="mt-3 text-[15px] text-[var(--fg-muted)]">{question.sub}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const selected = pending === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={!!pending && pending !== opt.id}
              className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200 cursor-pointer ${
                selected
                  ? "bg-[#F7931A] scale-[1.01]"
                  : "bg-[var(--bg-elevated)] hover:bg-[var(--bg-high)] disabled:opacity-40"
              }`}
              style={selected ? {
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15), 0 2px 6px rgba(247,147,26,0.25)"
              } : {
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              <span className="text-3xl shrink-0 leading-none">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bold text-[16px] ${
                    selected ? "text-[#0B0B0B]" : "text-[var(--fg)]"
                  }`}
                >
                  {opt.label}
                </div>
                <div
                  className={`mt-0.5 text-[13px] leading-snug ${
                    selected ? "text-[#0B0B0B99]" : "text-[var(--fg-muted)]"
                  }`}
                >
                  {opt.sub}
                </div>
              </div>
              {selected && (
                <span className="shrink-0 text-xl font-black text-[#0B0B0B]">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="self-start font-ui-mono text-[13px] text-[var(--fg-faint)] hover:text-[var(--fg-muted)] transition-colors cursor-pointer"
        >
          ← Volver
        </button>
      )}
    </div>
  );
}

// ─── Amount screen ────────────────────────────────────────────────────────────

function AmountScreen({
  mxn,
  rawDigits,
  onAmountChange,
  onDigitsChange,
  onNext,
  onBack,
  previewExchangeName,
  previewSats,
}: {
  mxn: number;
  rawDigits: string;
  onAmountChange: (n: number) => void;
  onDigitsChange: (s: string) => void;
  onNext: () => void;
  onBack: () => void;
  previewExchangeName: string;
  previewSats: number;
}) {
  const [focused, setFocused] = useState(false);
  const displayValue = focused
    ? rawDigits
    : rawDigits
    ? parseInt(rawDigits, 10).toLocaleString("es-MX")
    : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    onDigitsChange(digits);
    onAmountChange(parseInt(digits || "0", 10));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-ui-mono text-xs font-bold tracking-widest text-[#F7931A]">
          CASI LISTO
        </span>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-[var(--fg)] leading-[1.05]">
          ¿Cuánto quieres
          <br />
          invertir?
        </h2>
        <p className="mt-3 text-[15px] text-[var(--fg-muted)]">
          Ingresa el monto para ver exactamente cuántos sats recibirías en cada plataforma.
        </p>
      </div>

      {/* Input */}
      <div
        className={`flex items-center gap-3 rounded-2xl px-6 py-5 border-2 transition-all duration-150 cursor-text bg-[var(--bg-elevated)] ${
          focused ? "border-[#F7931A]" : "border-[var(--border-2)]"
        }`}
        style={{
          boxShadow: focused
            ? "0 0 0 3px rgba(247,147,26,0.15), inset 0 1px 2px rgba(255,255,255,0.05)"
            : "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)"
        }}
        onClick={() => document.getElementById("amount-input")?.focus()}
      >
        <span className="text-5xl font-black text-[#F7931A] leading-none">$</span>
        <input
          id="amount-input"
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="1,000"
          className="flex-1 bg-transparent text-5xl font-black text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] leading-none"
        />
        <span className="text-lg font-semibold text-[var(--fg-faint)] self-end mb-1">MXN</span>
      </div>

      {/* Sats preview */}
      {mxn > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-[#F7931A11] border border-[#F7931A22] px-4 py-3">
          <SatSymbol size={22} className="text-[#F7931A] shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-[#F7931A]">
              ≈ {previewSats.toLocaleString("es-MX")} sats
            </span>
            <span className="font-ui-mono text-[11px] text-[var(--fg-muted)]">
              {satsToBtc(previewSats)} BTC
            </span>
          </div>
          <span className="text-[13px] text-[var(--fg-muted)] ml-1">
            al mejor precio ({previewExchangeName})
          </span>
        </div>
      )}

      {/* Quick amounts */}
      <div className="flex overflow-x-auto gap-2 pb-0.5" style={{ scrollbarWidth: "none" }}>
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => {
              onDigitsChange(String(amt));
              onAmountChange(amt);
            }}
            className={`shrink-0 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all cursor-pointer ${
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
          onClick={onBack}
          className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-4 text-[15px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
        >
          ← Volver
        </button>
        <button
          onClick={onNext}
          disabled={mxn <= 0}
          className="flex-[2] rounded-2xl bg-[#F7931A] py-4 text-[17px] font-bold text-[#0B0B0B] transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Ver mi ranking →
        </button>
      </div>
    </div>
  );
}

// ─── Results screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  rankedExchanges,
  amount,
  answers,
  onRestart,
  onBack,
}: {
  rankedExchanges: (Exchange & { askPrice: number })[];
  amount: number;
  answers: Answers;
  onRestart: () => void;
  onBack: () => void;
}) {
  const bestSats = calcSats(
    amount,
    rankedExchanges[0].askPrice,
    rankedExchanges[0].feePct
  );

  // Human-readable summary of what drove the recommendation
  const priorityLabel: Record<string, string> = {
    price: "mejor precio",
    simple: "simplicidad y confianza",
    privacy: "privacidad",
    control: "control total de tus sats",
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-ui-mono text-xs font-bold tracking-widest text-[#F7931A]">
          TU RANKING PERSONALIZADO
        </span>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-black tracking-tight text-[var(--fg)] leading-[1.05]">
            Tu mejor opción
            <br />
            está aquí
          </h2>
          <div className="flex flex-col items-end gap-1 pb-1">
            <span className="font-ui-mono text-[11px] text-[var(--fg-muted)]">Monto</span>
            <span className="font-ui-mono text-xl font-black text-[var(--fg)]">
              ${amount.toLocaleString("es-MX")} MXN
            </span>
          </div>
        </div>
        {answers.main_priority && (
          <p className="mt-2 text-[13px] text-[var(--fg-muted)]">
            Optimizado para{" "}
            <span className="font-semibold text-[var(--fg)]">
              {priorityLabel[answers.main_priority] ?? "tus preferencias"}
            </span>
            {answers.payment === "spei" && " · requiere SPEI"}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {rankedExchanges.map((ex, i) => {
          const sats = calcSats(amount, ex.askPrice, ex.feePct);
          const isWinner = i === 0;
          const complexity = EXCHANGE_COMPLEXITY[ex.id] ?? "beginner";
          const note = complexity !== "beginner" ? COMPLEXITY_NOTE[complexity] : null;
          // Show note when a complex exchange wins for a beginner/intermediate user
          const showNote =
            isWinner &&
            note !== null &&
            (answers.experience === "beginner" ||
              (answers.experience === "intermediate" && complexity === "advanced"));

          return (
            <div key={ex.id} className="flex flex-col gap-2">
              <a
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col gap-3 rounded-2xl p-5 transition-colors ${
                  isWinner
                    ? "bg-[#F7931A] hover:opacity-95"
                    : "bg-[var(--bg-elevated)] hover:bg-[var(--bg-high)]"
                }`}
                style={isWinner ? {
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 8px rgba(247,147,26,0.2), 0 8px 24px rgba(0,0,0,0.35)"
                } : {
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)"
                }}
              >
                {/* Rank + sats */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-black px-2.5 py-1 rounded-full ${
                      isWinner
                        ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                        : "bg-[var(--bg-high)] text-[var(--fg-dim)]"
                    }`}
                  >
                    {i === 0
                      ? "🥇 Mejor opción"
                      : i === 1
                      ? "🥈 2do lugar"
                      : i === 2
                      ? "🥉 3er lugar"
                      : `#${i + 1}`}
                  </span>
                  <div className="flex-1" />
                  <div className="text-right">
                    <div
                      className={`flex items-center justify-end gap-1.5 text-2xl font-black tabular-nums leading-none ${
                        isWinner ? "text-[#0B0B0B]" : "text-[var(--fg)]"
                      }`}
                    >
                      <SatSymbol size={16} className={`shrink-0 self-center ${isWinner ? "opacity-50" : "opacity-40"}`} />
                      <span>{sats.toLocaleString("es-MX")}</span>
                      <span
                        className={`text-sm font-semibold ${
                          isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"
                        }`}
                      >
                        sats
                      </span>
                    </div>
                    <div
                      className={`font-ui-mono text-[11px] tabular-nums ${
                        isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"
                      }`}
                    >
                      {satsToBtc(sats)} BTC
                    </div>
                  </div>
                </div>

                {/* Exchange info */}
                <div className="flex items-center gap-3">
                  <ExchangeLogo exchange={ex} size={40} onOrange={isWinner} />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-bold text-[15px] group-hover:underline ${
                        isWinner ? "text-[#0B0B0B]" : "text-[var(--fg)]"
                      }`}
                    >
                      {ex.name}
                    </div>
                    <div
                      className={`text-xs ${
                        isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"
                      }`}
                    >
                      {/* #2 and #3: one-liner blurb always visible */}
                      {!isWinner && EXCHANGE_BLURB[ex.id]
                        ? EXCHANGE_BLURB[ex.id]
                        : ex.type}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div
                    className={`text-right font-ui-mono text-[13px] ${
                      isWinner ? "text-[#0B0B0B88]" : "text-[var(--fg-muted)]"
                    }`}
                  >
                    <div>${ex.askPrice.toLocaleString("es-MX")} MXN</div>
                    <div>{ex.feePct}% comisión</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {ex.spei && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isWinner
                          ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                          : "bg-[var(--green-bg)] text-[var(--accent-green)]"
                      }`}
                    >
                      SPEI
                    </span>
                  )}
                  {ex.lightning && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isWinner
                          ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                          : "bg-[var(--yellow-bg)] text-[var(--accent-yellow)]"
                      }`}
                    >
                      ⚡ Lightning
                    </span>
                  )}
                  {ex.nonCustodial && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isWinner
                          ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                          : "bg-[var(--bg-high)] text-[var(--fg-dim)]"
                      }`}
                    >
                      No custodial
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      isWinner
                        ? "bg-[#0B0B0B22] text-[#0B0B0B]"
                        : "bg-[var(--bg-high)] text-[var(--fg-muted)]"
                    }`}
                  >
                    {KYC_DISPLAY[ex.kyc]}
                  </span>
                </div>
              {/* Winner blurb — full explanation for #1 only */}
              {isWinner && (EXCHANGE_BLURB[ex.id] || PRIORITY_SUFFIX[answers.main_priority ?? ""]) && (
                <div className="mt-1 flex flex-col gap-1 border-t border-[#0B0B0B15] pt-3">
                  {EXCHANGE_BLURB[ex.id] && (
                    <p className="text-[13px] leading-snug text-[#0B0B0B99]">
                      {EXCHANGE_BLURB[ex.id]}
                    </p>
                  )}
                  {PRIORITY_SUFFIX[answers.main_priority ?? ""] && (
                    <p className="text-[13px] font-semibold leading-snug text-[#0B0B0BCC]">
                      {PRIORITY_SUFFIX[answers.main_priority ?? ""]}
                    </p>
                  )}
                </div>
              )}
              </a>

              {/* Contextual complexity note */}
              {showNote && (
                <div className="flex gap-2.5 rounded-xl border border-[var(--border-2)] bg-[var(--bg-raised)] px-4 py-3">
                  <span className="shrink-0 text-base leading-none mt-0.5">⚠️</span>
                  <p className="text-[12px] leading-relaxed text-[var(--fg-muted)]">
                    <span className="font-semibold text-[var(--fg)]">Heads up: </span>
                    {note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-3.5 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
        >
          ← Cambiar monto
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-3.5 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
        >
          ↺ Reiniciar
        </button>
      </div>

      <Link
        href="/"
        className="text-center text-[13px] text-[var(--fg-faint)] hover:text-[#F7931A] transition-colors"
      >
        Ver todos los precios en tiempo real →
      </Link>
    </div>
  );
}

// ─── Orientation screen (beginner, no bank account) ──────────────────────────

const WALLETS = [
  {
    name: "Wallet of Satoshi",
    emoji: "⭐",
    tagline: "La más fácil para empezar",
    desc: "Descárgala, abre y listo. No necesitas configurar nada. Ideal para tu primera compra.",
    url: "https://www.walletofsatoshi.com/",
    pill: "Recomendada para principiantes",
    pillBg: "#F7931A",
    pillText: "#0B0B0B",
  },
  {
    name: "Muun Wallet",
    emoji: "🌙",
    tagline: "Simple y con más control",
    desc: "Un poco más técnica pero muy bien diseñada. Buena opción si en el futuro quieres más control.",
    url: "https://muun.com/",
    pill: null,
    pillBg: "",
    pillText: "",
  },
  {
    name: "Phoenix Wallet",
    emoji: "🔥",
    tagline: "Para cuando quieras ir más allá",
    desc: "Potente y rápida. Ideal cuando ya entiendas un poco más cómo funciona Bitcoin.",
    url: "https://phoenix.acinq.co/",
    pill: null,
    pillBg: "",
    pillText: "",
  },
];

function OrientationScreen({
  onBack,
  onRestart,
}: {
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="font-ui-mono text-xs font-bold tracking-widest text-[#F7931A]">
          PRIMER PASO
        </span>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-[var(--fg)] leading-[1.05]">
          Necesitas una
          <br />
          wallet primero
        </h2>
        <p className="mt-3 text-[15px] text-[var(--fg-muted)] leading-relaxed">
          Sin cuenta de banco, la forma más accesible de comprar Bitcoin en México es en un{" "}
          <span className="font-semibold text-[var(--fg)]">cajero Bitcoin</span>. Pero para
          recibirlo, necesitas una wallet — una app donde guardar tus sats.
        </p>
        <p className="mt-2 text-[15px] text-[var(--fg-muted)] leading-relaxed">
          Es gratis, se descarga en tu cel y te lleva menos de 2 minutos.
        </p>
      </div>

      {/* Wallet cards */}
      <div className="flex flex-col gap-3">
        {WALLETS.map((w) => (
          <a
            key={w.name}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-high)] p-5 transition-colors"
            style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none">{w.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[15px] text-[var(--fg)] group-hover:underline">
                    {w.name}
                  </span>
                  {w.pill && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide"
                      style={{ background: w.pillBg, color: w.pillText }}
                    >
                      {w.pill}
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-semibold text-[var(--fg-dim)]">{w.tagline}</div>
              </div>
              <span className="shrink-0 text-[var(--fg-faint)] group-hover:text-[var(--fg-muted)] transition-colors text-sm">
                →
              </span>
            </div>
            <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed pl-9">{w.desc}</p>
          </a>
        ))}
      </div>

      {/* Coming soon — cajeros */}
      <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[var(--border-2)] px-5 py-4">
        <span className="text-2xl leading-none">📍</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[var(--fg)]">
              Cajeros Bitcoin cerca de ti
            </span>
            <span className="rounded-full bg-[var(--bg-high)] px-2.5 py-0.5 text-[10px] font-black text-[var(--fg-faint)] tracking-wide">
              PRÓXIMAMENTE
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-[var(--fg-muted)]">
            Estamos mapeando los cajeros en México. Ya casi.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-4 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
        >
          ← Volver
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-2xl bg-[var(--bg-elevated)] py-4 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
        >
          ↺ Reiniciar
        </button>
      </div>
    </div>
  );
}

// ─── Main wizard component ────────────────────────────────────────────────────

export function TestWizard() {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestion, setCurrentQuestion] = useState<QuestionId>("experience");
  const [showResults, setShowResults] = useState(false);
  const [mxn, setMxn] = useState(1_000);
  const [rawDigits, setRawDigits] = useState("1000");

  const { spot, prices } = useLivePrices();

  const enrichedExchanges = exchanges.map((ex) => {
    const { ask } = getPriceForExchange(prices, ex.id, spot);
    return { ...ex, askPrice: ask };
  });

  const weights = deriveWeights(answers);

  const rankedExchanges = [...enrichedExchanges].sort(
    (a, b) => scoreExchange(b, weights, mxn > 0 ? mxn : 1_000) - scoreExchange(a, weights, mxn > 0 ? mxn : 1_000)
  );

  function handleAnswer(questionId: QuestionId, optionId: string) {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    const next = getNextQuestionId(questionId, newAnswers);
    if (next === "results") {
      setShowResults(true);
    } else {
      setCurrentQuestion(next);
    }
  }

  function handleBack() {
    if (showResults) {
      setShowResults(false);
      setCurrentQuestion("amount");
      return;
    }
    const prev = getPrevQuestionId(currentQuestion, answers);
    if (prev) setCurrentQuestion(prev);
  }

  function handleAmountNext() {
    setShowResults(true);
  }

  function handleRestart() {
    setAnswers({});
    setCurrentQuestion("experience");
    setShowResults(false);
    setMxn(1_000);
    setRawDigits("1000");
  }

  // Detect the dead-end path: beginner with no bank account → orientation screen
  const showOrientation =
    !showResults &&
    answers.experience === "beginner" &&
    answers.payment === "any";

  const currentQuestionDef = QUESTIONS.find((q) => q.id === currentQuestion);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <ProgressBar
        currentId={showResults ? "amount" : currentQuestion}
        answers={answers}
        onResults={showResults}
      />

      {showOrientation ? (
        <OrientationScreen onBack={handleBack} onRestart={handleRestart} />
      ) : showResults ? (
        <ResultsScreen
          rankedExchanges={rankedExchanges}
          amount={mxn > 0 ? mxn : 1_000}
          answers={answers}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      ) : currentQuestion === "amount" ? (
        <AmountScreen
          mxn={mxn}
          rawDigits={rawDigits}
          onAmountChange={setMxn}
          onDigitsChange={setRawDigits}
          onNext={handleAmountNext}
          onBack={handleBack}
          previewExchangeName={rankedExchanges[0]?.name ?? ""}
          previewSats={
            mxn > 0
              ? calcSats(mxn, rankedExchanges[0]?.askPrice ?? 0, rankedExchanges[0]?.feePct ?? 0)
              : 0
          }
        />
      ) : currentQuestionDef ? (
        <QuestionScreen
          question={currentQuestionDef}
          answers={answers}
          onAnswer={(optionId) => handleAnswer(currentQuestion, optionId)}
          onBack={
            getPrevQuestionId(currentQuestion, answers)
              ? handleBack
              : null
          }
        />
      ) : null}
    </main>
  );
}
