import type { ZoneEntry, MapData } from "@/types/map";

// ─── Color utilities ────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function interpolateColor(value: number, min: number, max: number, hexA: string, hexB: string) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

export function lighten(hex: string, amount = 40): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

// ─── Core color logic ────────────────────────────────────────────────────────
//
// This function is the single source of truth for feature colors.
// It handles both placeholder (estados.json, featureId = "MX-OAX") and
// real custom GeoJSON (featureId = "zapoteca") transparently.
//
export function getFeatureColor(
  featureId: string,
  eraId: string,
  zones: ZoneEntry[],
  bancPorEstado: Record<string, number>
): string {
  // ── Eras 1-2: zone-based palette ──────────────────────────────────────────
  if (eraId === "prehispanica" || eraId === "nueva_espana") {
    // Real GeoJSON: featureId matches zone id directly
    const direct = zones.find((z) => z.id === featureId);
    if (direct?.color) return direct.color;
    // Placeholder: featureId is "MX-XXX" → find parent zone via estados_actuales
    const parent = zones.find((z) => z.estados_actuales?.includes(featureId));
    return parent?.color ?? "#3d3d3d";
  }

  // ── Eras 3-4: zone-based palette (same logic as eras 1-2) ─────────────────
  if (eraId === "independiente" || eraId === "siglo_xx") {
    const direct = zones.find((z) => z.id === featureId);
    if (direct?.color) return direct.color;
    const parent = zones.find((z) => z.estados_actuales?.includes(featureId));
    if (parent?.color) return parent.color;
    // Fallback if zone data not found
    return eraId === "independiente" ? "#92400e" : "#7f1d1d";
  }

  // ── Era 5: present — choropleth by bancarización ───────────────────────────
  // Low banc (30%) = Bitcoin orange (most Bitcoin-relevant)
  // High banc (72%) = dark green (more financially included)
  if (eraId === "presente") {
    const pct = bancPorEstado[featureId] ?? 49;
    return interpolateColor(pct, 30, 72, "#F7931A", "#15803d");
  }

  return "#3d3d3d";
}

// ─── Zone/state data resolver ────────────────────────────────────────────────
//
// Same dual-mode logic: works with both real zone IDs and placeholder state IDs.
//
export function resolveZoneData(
  featureId: string,
  eraId: string,
  mapData: MapData
): ZoneEntry | null {
  const zones = mapData.zones[eraId] ?? [];
  // Direct match (real custom GeoJSON)
  const direct = zones.find((z) => z.id === featureId);
  if (direct) return direct;
  // Fallback: placeholder — find zone that covers this state
  const parent = zones.find((z) => z.estados_actuales?.includes(featureId));
  return parent ?? null;
}
