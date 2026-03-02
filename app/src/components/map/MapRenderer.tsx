"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { GeoGeometryObjects } from "d3-geo";
import type { GeoData, GeoFeature, Era, MapData } from "@/types/map";
import { getFeatureColor, lighten } from "@/lib/mapColors";

interface Props {
  geoData: GeoData;
  era: Era;
  mapData: MapData;
  selectedId: string | null;
  isPlaceholder: boolean;
  onSelect: (featureId: string, featureName: string) => void;
}

function getFeatureId(f: GeoFeature): string {
  return String(f.properties?.id ?? f.properties?.ID ?? f.id ?? "");
}

function getFeatureName(f: GeoFeature): string {
  return String(f.properties?.name ?? f.properties?.Name ?? getFeatureId(f));
}

// ─── Zone helpers ─────────────────────────────────────────────────────────────

/** Find the zone a featureId belongs to */
function findZone(featureId: string, zones: MapData["zones"][string]) {
  if (!featureId || !zones) return null;
  const direct = zones.find((z) => z.id === featureId);
  if (direct) return direct;
  return zones.find((z) => z.estados_actuales?.includes(featureId)) ?? null;
}

/** Returns the set of feature IDs to highlight for a given selection */
function getHighlightedIds(
  selectedId: string | null,
  eraId: string,
  zones: MapData["zones"][string]
): Set<string> {
  if (!selectedId) return new Set();

  // Era 5 (presente): each state is its own zone — only highlight itself
  if (eraId === "presente") return new Set([selectedId]);

  // Eras 1-4: highlight all states in the same zone
  const zone = findZone(selectedId, zones);
  if (!zone) return new Set([selectedId]);

  const ids = new Set<string>();
  ids.add(selectedId);
  if (zone.id) ids.add(zone.id);
  zone.estados_actuales?.forEach((id) => ids.add(id));
  return ids;
}

export function MapRenderer({
  geoData,
  era,
  mapData,
  selectedId,
  isPlaceholder,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 480 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) {
        const maxH = Math.min(Math.round(window.innerHeight * 0.65), 600);
        setDims({ w: width, h: Math.min(Math.round(width * 0.58), maxH) });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 180);
    return () => clearTimeout(t);
  }, [era.id]);

  const { pathGen } = useMemo(() => {
    if (!geoData || dims.w === 0) return { pathGen: null };
    const proj = geoMercator().fitSize(
      [dims.w, dims.h],
      geoData as unknown as GeoGeometryObjects
    );
    return { pathGen: geoPath(proj) };
  }, [geoData, dims]);

  const zones = mapData.zones[era.id] ?? [];
  const banc = mapData.bancarizacion_nacional.estados;

  // The zone the selected state belongs to (for color)
  const selectedZone = useMemo(
    () => (selectedId ? findZone(selectedId, zones) : null),
    [selectedId, zones]
  );

  // All feature IDs that should be highlighted
  const highlightedIds = useMemo(
    () => getHighlightedIds(selectedId, era.id, zones),
    [selectedId, era.id, zones]
  );

  const handleClick = useCallback(
    (f: GeoFeature) => { onSelect(getFeatureId(f), getFeatureName(f)); },
    [onSelect]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      {/* Placeholder badge */}
      {isPlaceholder &&
        (era.id === "prehispanica" || era.id === "nueva_espana" || era.id === "independiente") && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] px-2.5 py-1 text-[10px] text-[var(--fg-muted)] font-medium">
            Fronteras modernas como placeholder
          </div>
        )}

      <svg
        width={dims.w}
        height={dims.h}
        className="overflow-visible block"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.18s ease" }}
        aria-label={`Mapa de México — ${era.label}`}
        onMouseMove={handleMouseMove}
      >
        {pathGen &&
          geoData.features.map((feature, idx) => {
            const fid = getFeatureId(feature);
            const d = pathGen(feature as unknown as GeoGeometryObjects);
            if (!d) return null;

            const base = getFeatureColor(fid, era.id, zones, banc);
            const isHighlighted = highlightedIds.has(fid);
            const isHovered = fid === hoveredId && !isHighlighted;

            // Color logic:
            // - Highlighted (in selected zone): use zone color lightened
            // - Hovered: lighten base
            // - Default: base color
            let fill: string;
            if (isHighlighted && selectedId) {
              const zoneColor = selectedZone?.color;
              fill = zoneColor ? lighten(zoneColor, 45) : lighten(base, 50);
            } else if (isHovered) {
              fill = lighten(base, 35);
            } else {
              // Dim non-highlighted states when something is selected
              fill = selectedId && era.id !== "presente" ? `${base}99` : base;
            }

            const stroke = isHighlighted ? "#ffffff" : "var(--bg)";
            const strokeWidth = isHighlighted ? 1.5 : 0.6;

            return (
              <path
                key={fid || idx}
                d={d}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                style={{ cursor: "pointer", transition: "fill 0.15s ease" }}
                onClick={() => handleClick(feature)}
                onMouseEnter={() => {
                  setHoveredId(fid);
                  setHoveredName(getFeatureName(feature));
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setHoveredName(null);
                }}
                aria-label={getFeatureName(feature)}
              />
            );
          })}
      </svg>

      {/* Hover tooltip */}
      {hoveredId && hoveredName && (
        <div
          className="hidden md:block absolute z-20 pointer-events-none"
          style={{ left: mousePos.x + 12, top: mousePos.y - 28 }}
        >
          <div className="rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-2.5 py-1.5 shadow-lg">
            <span className="text-[11px] font-semibold text-[var(--fg)] whitespace-nowrap">
              {hoveredName}
            </span>
          </div>
        </div>
      )}

      {/* Presente legend */}
      {era.id === "presente" && (
        <div className="absolute bottom-3 left-3 rounded-xl bg-[var(--bg-raised)]/92 border border-[var(--border)] px-4 py-3 backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
            Bancarización
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--fg-muted)]">30%</span>
            <div className="h-2.5 w-24 rounded-full" style={{ background: "linear-gradient(to right, #F7931A, #15803d)" }} />
            <span className="text-[11px] font-semibold text-[var(--fg-muted)]">72%</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#F7931A] font-semibold">+ Bitcoin</span>
            <span className="text-[10px] text-[#15803d] font-semibold">+ Banco</span>
          </div>
        </div>
      )}

      {/* Eras 1-4 legend */}
      {(era.id === "prehispanica" || era.id === "nueva_espana" || era.id === "independiente" || era.id === "siglo_xx") && (
        <div className="absolute bottom-3 left-3 rounded-xl bg-[var(--bg-raised)]/92 border border-[var(--border)] px-4 py-3 backdrop-blur-md">
          {zones.map((z) => (
            <div key={z.id} className="flex items-center gap-2.5 mb-2 last:mb-0">
              <div className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ background: z.color ?? "#3d3d3d" }} />
              <span className="text-[12px] font-medium text-[var(--fg-dim)] leading-tight">{z.name}</span>
            </div>
          ))}
        </div>
      )}


    </div>
  );
}
