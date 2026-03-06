"use client";

import { useState, useEffect, useRef } from "react";

interface SuggestExchangeModalProps {
  open: boolean;
  onClose: () => void;
}

export function SuggestExchangeModal({ open, onClose }: SuggestExchangeModalProps) {
  const [exchangeName, setExchangeName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open && !submitted) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, submitted]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleClose() {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setExchangeName("");
      setSubmitted(false);
    }, 250);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!exchangeName.trim()) return;
    // TODO: wire up backend — send exchangeName to your API / email / form
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
    >
      {/* Sheet / Modal */}
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-[var(--border-2)] bg-[var(--bg-raised)] shadow-2xl">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[var(--border-2)]" />
        </div>

        <div className="px-6 pt-4 pb-8 sm:pt-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="font-ui-mono text-[10px] font-bold tracking-[0.18em] text-[#F7931A]">
                SUGERENCIA
              </p>
              <h3 className="mt-1 text-[22px] font-black tracking-tight text-[var(--fg)] leading-tight">
                ¿No ves tu exchange favorito?
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)] transition-colors cursor-pointer text-lg leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {submitted ? (
            /* Success state */
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7931A1A] text-3xl">
                ₿
              </div>
              <div>
                <p className="text-[17px] font-bold text-[var(--fg)]">¡Gracias, lo tenemos en cuenta!</p>
                <p className="mt-1.5 text-[13px] text-[var(--fg-muted)] leading-relaxed">
                  Evaluaremos agregar{" "}
                  <span className="font-semibold text-[var(--fg)]">{exchangeName}</span>{" "}
                  próximamente.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 rounded-2xl bg-[var(--bg-elevated)] px-8 py-3 text-[14px] font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* Form state */
            <>
              <p className="mb-5 text-[14px] leading-relaxed text-[var(--fg-muted)]">
                Dinos qué exchange te gustaría ver aquí y lo evaluamos para agregarlo a la comparación.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label
                    htmlFor="exchange-suggestion"
                    className="mb-1.5 block font-ui-mono text-[10px] font-bold tracking-[0.15em] text-[var(--fg-muted)]"
                  >
                    NOMBRE DEL EXCHANGE
                  </label>
                  <input
                    ref={inputRef}
                    id="exchange-suggestion"
                    type="text"
                    value={exchangeName}
                    onChange={(e) => setExchangeName(e.target.value)}
                    placeholder="ej. OKX, Bitget, Coinbase..."
                    maxLength={60}
                    className="w-full rounded-xl border border-[var(--border-2)] bg-[var(--bg-elevated)] px-4 py-3 text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] outline-none focus:border-[#F7931A] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!exchangeName.trim()}
                  className="w-full rounded-2xl bg-[#F7931A] py-3.5 text-[15px] font-bold text-[#0B0B0B] transition-opacity hover:opacity-90 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                >
                  Enviar sugerencia
                </button>
              </form>

              <p className="mt-4 text-center font-ui-mono text-[10px] text-[var(--fg-faint)]">
                No almacenamos datos personales — solo el nombre del exchange.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
