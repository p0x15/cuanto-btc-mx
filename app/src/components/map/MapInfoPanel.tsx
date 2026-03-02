"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Era, MapData, ZoneEntry, BitcoinParalelo } from "@/types/map";
import { resolveZoneData } from "@/lib/mapColors";

// ─── Era config ──────────────────────────────────────────────────────────────

const ERA_STYLE: Record<string, { color: string; dimColor: string; icon: string }> = {
  prehispanica:  { color: "#D97706", dimColor: "rgba(217,119,6,0.12)",  icon: "🏺" },
  nueva_espana:  { color: "#7C3AED", dimColor: "rgba(124,58,237,0.12)", icon: "⚓" },
  independiente: { color: "#B45309", dimColor: "rgba(180,83,9,0.12)",   icon: "⚔️"  },
  siglo_xx:      { color: "#DC2626", dimColor: "rgba(220,38,38,0.12)",  icon: "📉" },
  presente:      { color: "#F7931A", dimColor: "rgba(247,147,26,0.12)", icon: "⚡" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRemesas(v: number) {
  return v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v}M`;
}

function bancColor(banc: number) {
  return banc < 40 ? "#F7931A" : banc < 55 ? "#eab308" : "#22c55e";
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

// ─── Stagger animation hook ───────────────────────────────────────────────────

function useStagger(active: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (active) setTick((t) => t + 1);
  }, [active]);
  return tick;
}

// ─── Section: Left — identity ─────────────────────────────────────────────────

function LeftCol({
  selectedId,
  displayName,
  era,
  mapData,
  zoneData,
  onClear,
  eraStyle,
  animKey,
}: {
  selectedId: string;
  displayName: string;
  era: Era;
  mapData: MapData;
  zoneData: ZoneEntry | null;
  onClear: () => void;
  eraStyle: { color: string; dimColor: string; icon: string };
  animKey: number;
}) {
  const banc = mapData.bancarizacion_nacional.estados[selectedId];
  const remesas = mapData.remesas_2024.estados[selectedId];
  const remesasRank =
    Object.entries(mapData.remesas_2024.estados)
      .sort(([, a], [, b]) => b - a)
      .findIndex(([id]) => id === selectedId) + 1;

  return (
    <div
      key={animKey}
      className="flex flex-col gap-3 min-w-0"
      style={{ animation: "panelFadeUp 0.3s ease both" }}
    >
      {/* Era badge + close */}
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
          style={{ background: eraStyle.dimColor, color: eraStyle.color }}
        >
          {era.year} · {era.label}
        </span>
        <button
          onClick={onClear}
          className="rounded-full p-1 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Era icon + name */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">{eraStyle.icon}</span>
        <div>
          <h3 className="text-[17px] font-black text-[var(--fg)] leading-tight">{displayName}</h3>
          {zoneData?.capital && (
            <p className="text-[10px] text-[var(--fg-muted)] mt-0.5">{zoneData.capital}</p>
          )}
        </div>
      </div>

      {/* Dinero medio pill */}
      {zoneData?.dinero?.medio && (
        <p
          className="text-[11px] font-semibold rounded-lg px-2.5 py-1.5 leading-snug"
          style={{ background: eraStyle.dimColor, color: eraStyle.color }}
        >
          {truncate(zoneData.dinero.medio, 70)}
        </p>
      )}

      {/* Stats — presente */}
      {era.id === "presente" && (
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {banc !== undefined && (
            <div className="rounded-xl bg-[var(--bg-elevated)] p-2.5">
              <div className="text-[8px] font-bold tracking-widest uppercase text-[var(--fg-muted)] mb-1">
                Bancarización
              </div>
              <div className="text-[22px] font-black leading-none" style={{ color: bancColor(banc) }}>
                {banc}%
              </div>
              <div className="text-[8px] text-[var(--fg-muted)] mt-0.5 leading-tight">con cuenta formal</div>
            </div>
          )}
          {remesas !== undefined && (
            <div className="rounded-xl bg-[var(--bg-elevated)] p-2.5">
              <div className="text-[8px] font-bold tracking-widest uppercase text-[var(--fg-muted)] mb-1">
                Remesas 2024
              </div>
              <div className="text-[19px] font-black text-[var(--fg)] leading-none">
                {formatRemesas(remesas)}
              </div>
              <div className="text-[8px] text-[var(--fg-muted)] mt-0.5 leading-tight">
                USD · #{remesasRank} nacional
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats — siglo_xx */}
      {era.id === "siglo_xx" && (banc !== undefined || remesas !== undefined) && (
        <div className="rounded-xl bg-[var(--bg-elevated)] p-2.5 mt-auto">
          <div className="text-[8px] font-bold tracking-widest uppercase text-[var(--fg-muted)] mb-2">
            Legado · hoy
          </div>
          <div className="grid grid-cols-2 gap-1">
            {remesas !== undefined && (
              <div>
                <div className="text-[15px] font-black text-[var(--fg)]">{formatRemesas(remesas)}</div>
                <div className="text-[8px] text-[var(--fg-muted)]">remesas #{remesasRank}</div>
              </div>
            )}
            {banc !== undefined && (
              <div>
                <div className="text-[15px] font-black" style={{ color: bancColor(banc) }}>{banc}%</div>
                <div className="text-[8px] text-[var(--fg-muted)]">bancarización</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Center — dato curioso as hero ────────────────────────────────────

function CenterCol({
  zoneData,
  eraId,
  eraStyle,
  animKey,
}: {
  zoneData: ZoneEntry | null;
  eraId: string;
  eraStyle: { color: string; dimColor: string };
  animKey: number;
}) {
  const dato = zoneData?.dinero?.dato_curioso;
  const desc = zoneData?.dinero?.descripcion;

  // Siglo XX special: show crisis timeline
  if (eraId === "siglo_xx" && !dato) {
    return (
      <div
        key={animKey}
        className="flex flex-col gap-2"
        style={{ animation: "panelFadeUp 0.3s 0.05s ease both" }}
      >
        <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: eraStyle.color }}>
          Las tres grandes crisis
        </div>
        {[
          { year: "1976", desc: "El peso pasa de $12.50 a $20 por dólar de un día para otro. Primera devaluación en 22 años." },
          { year: "1982", desc: "99% de inflación. Nacionalización bancaria. Inflación acumulada del sexenio: 4,030%." },
          { year: "1994", desc: '"Error de Diciembre." 50% de devaluación en semanas. Tasas de interés al 100%.' },
        ].map((c, i) => (
          <div
            key={c.year}
            className="flex gap-3 rounded-xl p-3"
            style={{ background: eraStyle.dimColor, animationDelay: `${0.08 * i}s` }}
          >
            <span className="text-[13px] font-black shrink-0 w-8" style={{ color: eraStyle.color }}>
              {c.year}
            </span>
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">{c.desc}</p>
          </div>
        ))}
        {desc && (
          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)] mt-1">{truncate(desc, 200)}</p>
        )}
      </div>
    );
  }

  return (
    <div
      key={animKey}
      className="flex flex-col gap-3"
      style={{ animation: "panelFadeUp 0.3s 0.05s ease both" }}
    >
      {/* dato_curioso as hero */}
      {dato && (
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: eraStyle.dimColor }}
        >
          {/* Big decorative quote mark */}
          <span
            className="absolute top-1 left-3 text-[52px] leading-none font-black select-none opacity-25"
            style={{ color: eraStyle.color }}
          >
            "
          </span>
          <div className="relative pl-3">
            <div
              className="text-[9px] font-bold tracking-widest uppercase mb-2"
              style={{ color: eraStyle.color }}
            >
              Dato curioso
            </div>
            <p
              className="text-[13px] font-semibold leading-snug text-[var(--fg)]"
            >
              {dato}
            </p>
          </div>
        </div>
      )}

      {/* Description — supporting context */}
      {desc && (
        <div>
          {!dato && (
            <div
              className="text-[9px] font-bold tracking-widest uppercase mb-1.5"
              style={{ color: eraStyle.color }}
            >
              Contexto histórico
            </div>
          )}
          <p className="text-[12px] leading-relaxed text-[var(--fg-muted)]">
            {truncate(desc, 280)}
          </p>
        </div>
      )}

      {!dato && !desc && (
        <p className="text-[12px] text-[var(--fg-muted)]">
          Haz click en un estado para ver su historia monetaria.
        </p>
      )}
    </div>
  );
}

// ─── Section: Right — Bitcoin parallel ────────────────────────────────────────

function RightCol({
  zoneData,
  eraId,
  selectedId,
  mapData,
  animKey,
}: {
  zoneData: ZoneEntry | null;
  eraId: string;
  selectedId: string;
  mapData: MapData;
  animKey: number;
}) {
  const data = zoneData?.bitcoin_paralelo;
  const banc = mapData.bancarizacion_nacional.estados[selectedId] ?? 49;

  const fallback =
    eraId === "presente"
      ? banc < 45
        ? `Con solo ${banc}% de bancarización, Lightning Network conecta a este estado a la economía global sin cuenta bancaria. Cada satoshi llega en segundos.`
        : `Bitcoin como reserva de valor frente al peso. Con inflación histórica de más de 100,000% desde 1970, ahorrar en sats protege el trabajo de años.`
      : "Bitcoin es el primero en la historia en separar el dinero del Estado — algo que ninguna de estas civilizaciones pudo lograr.";

  const displayData = data ?? fallback;

  return (
    <div
      key={animKey}
      className="flex flex-col gap-3"
      style={{ animation: "panelFadeUp 0.3s 0.1s ease both" }}
    >
      <div className="rounded-2xl border border-[#F7931A]/30 bg-[#F7931A]/8 p-4 flex flex-col gap-2.5 flex-1">
        {typeof displayData === "string" ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-base">₿</span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#F7931A]">
                Paralelo Bitcoin
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--fg-muted)]">{displayData}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-base">⚡</span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#F7931A]">
                {(displayData as BitcoinParalelo).caso_uso}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--fg-muted)]">
              {truncate((displayData as BitcoinParalelo).descripcion, 200)}
            </p>
            {(displayData as BitcoinParalelo).ahorro_comision && (
              <div className="rounded-xl bg-[#F7931A]/10 border border-[#F7931A]/20 px-3 py-2">
                <span className="text-[12px] font-bold text-[#F7931A]">
                  💰 {(displayData as BitcoinParalelo).ahorro_comision}
                </span>
              </div>
            )}
            {(displayData as BitcoinParalelo).apps_recomendadas && (
              <div className="flex flex-wrap gap-1.5">
                {(displayData as BitcoinParalelo).apps_recomendadas!.map((app) => (
                  <span
                    key={app}
                    className="rounded-full bg-[var(--bg-high)] px-2 py-0.5 text-[9px] font-semibold text-[var(--fg-muted)]"
                  >
                    {app}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      {eraId === "presente" && (
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/8 hover:bg-[#F7931A]/15 px-4 py-2.5 transition-colors group"
        >
          <div>
            <div className="text-[8px] font-bold tracking-widest uppercase text-[#F7931A] mb-0.5">
              ¿Listo para comprar?
            </div>
            <div className="text-[12px] font-semibold text-[var(--fg)]">
              Ver dónde comprar Bitcoin →
            </div>
          </div>
          <span className="text-[#F7931A] text-lg group-hover:translate-x-0.5 transition-transform">₿</span>
        </Link>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  selectedId: string | null;
  selectedName: string | null;
  era: Era;
  mapData: MapData;
  onClear: () => void;
}

export function MapInfoPanel({ selectedId, selectedName, era, mapData, onClear }: Props) {
  const zoneData = selectedId ? resolveZoneData(selectedId, era.id, mapData) : null;
  const displayName = zoneData?.name ?? selectedName ?? selectedId ?? "";
  const eraStyle = ERA_STYLE[era.id] ?? ERA_STYLE.presente;
  const animKey = useStagger(!!selectedId);

  if (!selectedId) return null;

  return (
    <>
      {/* Keyframe injected once */}
      <style>{`
        @keyframes panelFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Accent stripe at top */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${eraStyle.color}, transparent)` }} />

      <div className="grid grid-cols-[220px_1fr_280px] gap-0 divide-x divide-[var(--border)] px-0">
        {/* Col 1 */}
        <div className="px-5 py-4">
          <LeftCol
            selectedId={selectedId}
            displayName={displayName}
            era={era}
            mapData={mapData}
            zoneData={zoneData}
            onClear={onClear}
            eraStyle={eraStyle}
            animKey={animKey}
          />
        </div>

        {/* Col 2 */}
        <div className="px-5 py-4">
          <CenterCol
            zoneData={zoneData}
            eraId={era.id}
            eraStyle={eraStyle}
            animKey={animKey}
          />
        </div>

        {/* Col 3 */}
        <div className="px-5 py-4">
          <RightCol
            zoneData={zoneData}
            eraId={era.id}
            selectedId={selectedId}
            mapData={mapData}
            animKey={animKey}
          />
        </div>
      </div>
    </>
  );
}
