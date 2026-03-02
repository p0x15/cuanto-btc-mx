"use client";

import { useState, useCallback } from "react";
import { useMapMeta, useGeoData } from "@/hooks/useMapData";
import { EraSlider } from "./EraSlider";
import { MapRenderer } from "./MapRenderer";
import { ZonePanel } from "./ZonePanel";
import { MapMobileFallback } from "./MapMobileFallback";

export function HistoryMap() {
  const mapData = useMapMeta();
  const [eraIndex, setEraIndex] = useState(0);
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);

  const activeEra = mapData?.eras[eraIndex] ?? null;
  const { geoData, loading: geoLoading, isPlaceholder } = useGeoData(
    activeEra?.geoFile ?? null
  );

  const handleEraChange = useCallback((i: number) => {
    setEraIndex(i);
    setSelected(null);
  }, []);

  const handleSelect = useCallback((id: string, name: string) => {
    setSelected((prev) => (prev?.id === id ? null : { id, name }));
  }, []);

  const handleClear = useCallback(() => setSelected(null), []);

  if (!mapData) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--fg-muted)] text-sm">
        Cargando mapa…
      </div>
    );
  }

  const panelOpen = selected !== null;

  return (
    <div className="h-full flex flex-col">

      {/* Era timeline — fixed height */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-raised)]">
        <div className="px-4 md:px-6">
          <EraSlider eras={mapData.eras} activeIndex={eraIndex} onChange={handleEraChange} />
        </div>
      </div>

      {/* ── DESKTOP: fills remaining height ── */}
      <div className="hidden lg:flex flex-1 min-h-0 gap-4 px-4 md:px-6 py-4">

        {/* Map — flex-1, fills height */}
        <div
          className="min-w-0 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-raised)] relative"
          style={{
            flex: 1,
            transition: "flex 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {geoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-raised)]/80 z-20">
              <div className="text-[var(--fg-muted)] text-sm animate-pulse">Cargando…</div>
            </div>
          )}
          {geoData && activeEra && (
            <MapRenderer
              geoData={geoData}
              era={activeEra}
              mapData={mapData}
              selectedId={selected?.id ?? null}
              isPlaceholder={isPlaceholder}
              onSelect={handleSelect}
            />
          )}

          {/* Wiggle keyframe */}
          <style>{`
            @keyframes float-hint {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-4px); }
            }
          `}</style>

          {/* Era description card — floating top-right, fades when state selected */}
          {activeEra && (
            <div
              className="absolute top-4 right-4 z-10 pointer-events-none"
              style={{
                opacity: panelOpen ? 0 : 1,
                transform: `translateY(${panelOpen ? "-6px" : "0px"})`,
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)]/92 backdrop-blur-md px-6 py-4 max-w-[400px] shadow-lg">
                <p className="text-[32px] font-black text-[var(--fg)] leading-tight mb-2">
                  {activeEra.label}
                </p>
                <p className="text-[15px] leading-relaxed text-[var(--fg-muted)]">
                  {activeEra.description}
                </p>
              </div>

              {/* Wiggle CTA — below the title card */}
              <div className="flex justify-end mt-2">
                <div
                  style={{
                    animation: "float-hint 3s ease-in-out infinite",
                  }}
                  className="flex items-center gap-2 rounded-full border border-[#F7931A]/50 bg-[var(--bg-raised)]/95 backdrop-blur-md px-3.5 py-1.5 shadow-md"
                >
                  <span className="text-sm">👆</span>
                  <span className="text-[11px] font-semibold text-[var(--fg)]">
                    Toca una zona para aprender más
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side panel — slides in from right, fills height */}
        {activeEra && (
          <div
            className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)] overflow-hidden flex flex-col"
            style={{
              width: panelOpen ? "560px" : "0px",
              opacity: panelOpen ? 1 : 0,
              transform: panelOpen ? "translateX(0)" : "translateX(24px)",
              transition:
                "width 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, transform 0.42s ease",
              pointerEvents: panelOpen ? "auto" : "none",
            }}
          >
            <ZonePanel
              selectedId={selected?.id ?? null}
              selectedName={selected?.name ?? null}
              era={activeEra}
              mapData={mapData}
              onClear={handleClear}
            />
          </div>
        )}
      </div>

      {/* ── MOBILE fallback ── */}
      <MapMobileFallback />
    </div>
  );
}
