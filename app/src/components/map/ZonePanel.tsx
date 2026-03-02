"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import type { Era, MapData, ZoneEntry, BitcoinParalelo } from "@/types/map";
import { resolveZoneData } from "@/lib/mapColors";

// ─── Era palette ─────────────────────────────────────────────────────────────

const ERA_STYLE: Record<string, { color: string; bg: string; icon: string }> = {
  prehispanica:  { color: "#D97706", bg: "rgba(217,119,6,0.10)",  icon: "🏺" },
  nueva_espana:  { color: "#7C3AED", bg: "rgba(124,58,237,0.10)", icon: "⚓" },
  independiente: { color: "#B45309", bg: "rgba(180,83,9,0.10)",   icon: "⚔️"  },
  siglo_xx:      { color: "#DC2626", bg: "rgba(220,38,38,0.10)",  icon: "📉" },
  presente:      { color: "#F7931A", bg: "rgba(247,147,26,0.10)", icon: "⚡" },
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function bancColor(b: number) {
  return b < 40 ? "#F7931A" : b < 55 ? "#eab308" : "#22c55e";
}
function fmtRemesas(v: number) {
  return v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v}M`;
}
// lerp between two values
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  selectedId: string | null;
  selectedName: string | null;
  era: Era;
  mapData: MapData;
  onClear: () => void;
}

// ─── Content sub-components ───────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-elevated)] px-5 py-4 flex-1">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)] mb-1.5">
        {label}
      </div>
      <div className="text-[42px] font-black leading-none" style={{ color: color ?? "var(--fg)" }}>
        {value}
      </div>
      <div className="text-[12px] text-[var(--fg-muted)] mt-1.5 leading-snug">{sub}</div>
    </div>
  );
}

function DatoHero({ dato, eraColor, eraBg }: { dato: string; eraColor: string; eraBg: string }) {
  return (
    <div className="rounded-2xl relative overflow-hidden p-5" style={{ background: eraBg }}>
      <span
        className="absolute -top-3 left-4 text-[80px] leading-none font-black select-none opacity-20"
        style={{ color: eraColor }}
      >
        "
      </span>
      <div className="relative">
        <div className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: eraColor }}>
          💡 Dato curioso
        </div>
        <p className="text-[18px] font-semibold leading-snug text-[var(--fg)]">{dato}</p>
      </div>
    </div>
  );
}

function DineroSection({ dinero, eraColor, eraBg }: { dinero: ZoneEntry["dinero"]; eraColor: string; eraBg: string }) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)]">
        Forma de dinero
      </div>
      <div className="rounded-xl px-4 py-3 text-[15px] font-bold leading-snug" style={{ background: eraBg, color: eraColor }}>
        {dinero.medio}
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--fg-muted)]">{dinero.descripcion}</p>
      {dinero.dato_curioso && (
        <DatoHero dato={dinero.dato_curioso} eraColor={eraColor} eraBg={eraBg} />
      )}
    </div>
  );
}

function BitcoinSection({ data, eraId, banc }: { data: string | BitcoinParalelo | undefined; eraId: string; banc?: number }) {
  const fallback =
    eraId === "presente"
      ? banc !== undefined && banc < 45
        ? `Con solo ${banc}% de bancarización, Lightning Network conecta a este estado a la economía global sin cuenta bancaria. Cada satoshi llega en segundos.`
        : `Bitcoin como reserva de valor frente al peso. Con inflación histórica acumulada de más de 100,000% desde 1970, ahorrar en sats protege el trabajo de años.`
      : "Bitcoin es el primero en la historia en separar el dinero del Estado — algo que ninguna de estas civilizaciones pudo lograr.";

  const d = data ?? fallback;

  return (
    <div className="rounded-2xl border border-[#F7931A]/30 bg-[#F7931A]/6 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <span className="text-[11px] font-bold tracking-widest uppercase text-[#F7931A]">
          {typeof d !== "string" ? (d as BitcoinParalelo).caso_uso : "Paralelo Bitcoin"}
        </span>
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--fg-muted)]">
        {typeof d === "string" ? d : (d as BitcoinParalelo).descripcion}
      </p>
      {typeof d !== "string" && (d as BitcoinParalelo).ahorro_comision && (
        <div className="rounded-xl bg-[#F7931A]/10 border border-[#F7931A]/20 px-4 py-3">
          <p className="text-[16px] font-bold text-[#F7931A]">
            💰 {(d as BitcoinParalelo).ahorro_comision}
          </p>
        </div>
      )}
      {typeof d !== "string" && (d as BitcoinParalelo).apps_recomendadas && (
        <div className="flex flex-wrap gap-2">
          {(d as BitcoinParalelo).apps_recomendadas!.map((app) => (
            <span key={app} className="rounded-full bg-[var(--bg-high)] border border-[var(--border)] px-3 py-1 text-[11px] font-semibold text-[var(--fg-muted)]">
              {app}
            </span>
          ))}
        </div>
      )}
      {eraId === "presente" && (
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl border border-[#F7931A]/40 bg-[#F7931A]/10 hover:bg-[#F7931A]/20 px-4 py-3 transition-colors group"
        >
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#F7931A] mb-0.5">¿Listo para comprar?</div>
            <div className="text-[15px] font-bold text-[var(--fg)]">Ver dónde comprar Bitcoin →</div>
          </div>
          <span className="text-[#F7931A] text-xl group-hover:translate-x-0.5 transition-transform">₿</span>
        </Link>
      )}
    </div>
  );
}

function SigloXXTimeline({ stateName }: { stateName: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[14px] leading-relaxed text-[var(--fg-muted)]">
        Como todo México, {stateName} vivió las tres grandes crisis del peso moderno:
      </p>
      <div className="space-y-2.5">
        {[
          { year: "1976", desc: "Primera devaluación en 22 años. El peso pasa de $12.50 a $20 por dólar de un día para otro. Inflación: 27% anual." },
          { year: "1982", desc: "99% de inflación. Nacionalización bancaria. El peso llega a $150 por dólar. Inflación acumulada del sexenio: 4,030%." },
          { year: "1994", desc: '"Error de Diciembre". 50% de devaluación en semanas. Tasas de interés al 100%. Crisis bancaria sistémica.' },
        ].map((c) => (
          <div key={c.year} className="flex gap-4 rounded-2xl bg-[var(--bg-elevated)] px-4 py-3.5">
            <span className="text-[13px] font-black text-red-400 shrink-0 w-10 pt-0.5">{c.year}</span>
            <p className="text-[14px] leading-relaxed text-[var(--fg-muted)]">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#F7931A]/25 bg-[#F7931A]/6 p-4">
        <p className="text-[15px] leading-relaxed text-[var(--fg-dim)]">
          ₿ &nbsp;$1,000 MXN en 1970 equivalen a menos de $1 peso real en 1994. Una pérdida de más del 99.99%. Bitcoin no tiene secretario de Hacienda.
        </p>
      </div>
    </div>
  );
}

function EraContext({ era, mapData }: { era: Era; mapData: MapData }) {
  const eraStyle = ERA_STYLE[era.id] ?? ERA_STYLE.presente;
  const zones = mapData.zones[era.id] ?? [];
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[var(--bg-elevated)] p-4">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)] mb-2">Dinero de la era</div>
        <p className="text-[15px] font-semibold text-[var(--fg)] leading-snug">{era.moneda}</p>
      </div>
      {zones.length > 1 && zones.some((z) => z.color) && (
        <div className="space-y-2.5">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)]">Regiones en el mapa</div>
          {zones.map((z) => (
            <div key={z.id} className="flex items-start gap-3">
              <div className="w-3.5 h-3.5 rounded-sm shrink-0 mt-0.5" style={{ background: z.color ?? "#3d3d3d" }} />
              <div>
                <p className="text-[13px] font-semibold text-[var(--fg-dim)]">{z.name}</p>
                {z.dinero?.medio && <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">{z.dinero.medio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {era.id === "presente" && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)]">Bancarización en México</div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#F7931A] font-bold">30%</span>
            <div className="h-2.5 flex-1 rounded-full" style={{ background: "linear-gradient(to right, #F7931A, #15803d)" }} />
            <span className="text-[11px] text-[#15803d] font-bold">72%</span>
          </div>
          <p className="text-[12px] text-[var(--fg-muted)] leading-relaxed">
            Chiapas: 30%. CDMX: 72%.{" "}
            <span style={{ color: eraStyle.color }}>Los estados más naranja necesitan más Bitcoin.</span>
          </p>
        </div>
      )}
      <div className="flex items-center gap-2.5 pt-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--fg-muted)] shrink-0">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        <p className="text-[12px] text-[var(--fg-muted)]">Haz click en cualquier estado para ver su historia</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ZonePanel({ selectedId, selectedName, era, mapData, onClear }: Props) {
  const zoneData = selectedId ? resolveZoneData(selectedId, era.id, mapData) : null;
  const displayName = zoneData?.name ?? selectedName ?? selectedId ?? "";
  const eraStyle = ERA_STYLE[era.id] ?? ERA_STYLE.presente;

  // If the zone has its own color (eras 1-4), use that instead of the era color
  const zoneColor = zoneData?.color;
  const accentColor = zoneColor ?? eraStyle.color;
  const accentBg = zoneColor ? hexToRgba(zoneColor, 0.12) : eraStyle.bg;

  const banc = selectedId ? mapData.bancarizacion_nacional.estados[selectedId] : undefined;
  const remesas = selectedId ? mapData.remesas_2024.estados[selectedId] : undefined;
  const remesasRank = selectedId
    ? Object.entries(mapData.remesas_2024.estados)
        .sort(([, a], [, b]) => b - a)
        .findIndex(([id]) => id === selectedId) + 1
    : 0;

  // ── Collapsing header ──────────────────────────────────────────────────────
  const [scrollY, setScrollY] = useState(0);

  // Reset on state change
  useEffect(() => { setScrollY(0); }, [selectedId]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  }, []);

      // progress: 0 = fully expanded, 1 = fully collapsed (threshold: 64px)
      // Note: accentColor/accentBg computed above are used for content sections
  const THRESHOLD = 64;
  const p = Math.min(1, scrollY / THRESHOLD);

  // ── Derived header values ──────────────────────────────────────────────────
  // Header padding
  const headerPtPx = lerp(20, 10, p);
  const headerPbPx = lerp(16, 8, p);

  // State name font size: 22 → 15
  const nameFontSize = lerp(26, 16, p);

  // Icon row opacity + height: disappears quickly
  const iconRowOpacity = lerp(1, 0, p * 2);   // gone at p=0.5
  const iconRowMaxH = lerp(36, 0, p * 2);     // collapses height too

  // Capital opacity: gone at p=0.4
  const capitalOpacity = lerp(1, 0, p * 2.5);
  const capitalMaxH = lerp(20, 0, p * 2.5);

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Accent stripe */}
      <div className="h-[3px] shrink-0" style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }} />

      {/* ── Collapsing header ── */}
      <div
        className="shrink-0 border-b border-[var(--border)] overflow-hidden"
        style={{
          paddingTop: `${headerPtPx}px`,
          paddingBottom: `${headerPbPx}px`,
          paddingLeft: "24px",
          paddingRight: "24px",
          transition: "padding 0.1s ease",
        }}
      >
        {selectedId ? (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Icon + era badge row — collapses away */}
              <div
                style={{
                  opacity: iconRowOpacity,
                  maxHeight: `${iconRowMaxH}px`,
                  overflow: "hidden",
                  marginBottom: iconRowMaxH > 2 ? "8px" : "0px",
                  transition: "max-height 0.15s ease, opacity 0.15s ease, margin 0.15s ease",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{eraStyle.icon}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
                    style={{ background: accentBg, color: accentColor }}
                  >
                    {era.year} · {era.label}
                  </span>
                </div>
              </div>

              {/* State name — shrinks in place */}
              <h2
                className="font-black text-[var(--fg)] leading-tight truncate"
                style={{
                  fontSize: `${nameFontSize}px`,
                  transition: "font-size 0.15s ease",
                }}
              >
                {displayName}
              </h2>

              {/* Capital — collapses away */}
              {zoneData?.capital && (
                <div
                  style={{
                    opacity: capitalOpacity,
                    maxHeight: `${capitalMaxH}px`,
                    overflow: "hidden",
                    transition: "max-height 0.15s ease, opacity 0.15s ease",
                  }}
                >
                  <p className="text-[12px] text-[var(--fg-muted)] mt-1">📍 {zoneData.capital}</p>
                </div>
              )}

              {/* Compact era badge — fades IN as header collapses */}
              <div
                style={{
                  opacity: Math.max(0, p - 0.5) * 2, // appears after p=0.5
                  maxHeight: p > 0.5 ? "20px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.15s ease, opacity 0.15s ease",
                }}
              >
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: accentColor }}
                  >
                    {eraStyle.icon} {era.year} · {era.label}
                  </span>
              </div>
            </div>

            {/* Close button — always visible */}
            <button
              onClick={onClear}
              className="shrink-0 rounded-full p-2 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          /* No selection — static era header */
          <div className="flex items-center gap-3">
            <span className="text-2xl">{eraStyle.icon}</span>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: eraStyle.color }}>
                {era.year}
              </p>
              <h2 className="text-[16px] font-black text-[var(--fg)]">{era.label}</h2>
            </div>
          </div>
        )}
      </div>

      {/* ── Scrollable content — THIS is what scrolls, not the page ── */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-6 pb-8"
        onScroll={handleScroll}
      >
        {!selectedId ? (
          <EraContext era={era} mapData={mapData} />
        ) : (
          <>
            {/* PRESENTE */}
            {era.id === "presente" && (
              <>
                {(banc !== undefined || remesas !== undefined) && (
                  <div className="flex gap-3">
                    {banc !== undefined && (
                      <StatCard label="Bancarización" value={`${banc}%`} sub="adultos con cuenta bancaria formal" color={bancColor(banc)} />
                    )}
                    {remesas !== undefined && (
                      <StatCard label="Remesas 2024" value={fmtRemesas(remesas)} sub={`USD · #${remesasRank} en México`} />
                    )}
                  </div>
                )}
                {zoneData?.dinero && (
                  <DineroSection dinero={zoneData.dinero} eraColor={accentColor} eraBg={accentBg} />
                )}
                <BitcoinSection data={zoneData?.bitcoin_paralelo} eraId={era.id} banc={banc} />
              </>
            )}

            {/* SIGLO XX */}
            {era.id === "siglo_xx" && (
              <>
                {zoneData?.dinero ? (
                  <DineroSection dinero={zoneData.dinero} eraColor={accentColor} eraBg={accentBg} />
                ) : (
                  <SigloXXTimeline stateName={displayName} />
                )}
                {(banc !== undefined || remesas !== undefined) && (
                  <div className="rounded-2xl bg-[var(--bg-elevated)] px-5 py-4 space-y-3">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)]">El legado de las crisis · hoy</div>
                    <div className="flex gap-6">
                      {remesas !== undefined && (
                        <div>
                          <div className="text-[28px] font-black text-[var(--fg)] leading-none">{fmtRemesas(remesas)}</div>
                          <div className="text-[11px] text-[var(--fg-muted)] mt-1">remesas 2024 · #{remesasRank}</div>
                        </div>
                      )}
                      {banc !== undefined && (
                        <div>
                          <div className="text-[28px] font-black leading-none" style={{ color: bancColor(banc) }}>{banc}%</div>
                          <div className="text-[11px] text-[var(--fg-muted)] mt-1">bancarización hoy</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {zoneData?.bitcoin_paralelo && (
                  <BitcoinSection data={zoneData.bitcoin_paralelo} eraId={era.id} banc={banc} />
                )}
              </>
            )}

            {/* ERAS HISTÓRICAS */}
            {(era.id === "prehispanica" || era.id === "nueva_espana" || era.id === "independiente") && (
              <>
                {zoneData?.dinero ? (
                  <DineroSection dinero={zoneData.dinero} eraColor={accentColor} eraBg={accentBg} />
                ) : (
                  <p className="text-[14px] text-[var(--fg-muted)]">Selecciona una zona del mapa para ver su sistema monetario.</p>
                )}
                <BitcoinSection data={zoneData?.bitcoin_paralelo} eraId={era.id} banc={banc} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
