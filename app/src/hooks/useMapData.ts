"use client";

import { useState, useEffect } from "react";
import type { MapData, GeoData } from "@/types/map";

// ─── GeoJSON fetcher with automatic fallback ──────────────────────────────────
//
// Tries to load the era's specific GeoJSON file. If the file doesn't exist yet
// (user hasn't drawn it), silently falls back to estados.json (modern states).
//
// When the real file is dropped into public/geo/, the next era change
// automatically picks it up — zero code changes required.
//
async function fetchGeoWithFallback(geoFile: string): Promise<GeoData> {
  try {
    const res = await fetch(`/geo/${geoFile}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`${geoFile} not found (${res.status})`);
    return await res.json();
  } catch {
    // File not drawn yet — use modern state boundaries as placeholder
    const fallback = await fetch("/geo/estados.json", { cache: "no-store" });
    return await fallback.json();
  }
}

// ─── Static map metadata ───────────────────────────────────────────────────────
export function useMapMeta(): MapData | null {
  const [mapData, setMapData] = useState<MapData | null>(null);
  useEffect(() => {
    fetch("/geo/map-data.json")
      .then((r) => r.json())
      .then(setMapData);
  }, []);
  return mapData;
}

// ─── Dynamic GeoJSON per era ──────────────────────────────────────────────────
export function useGeoData(geoFile: string | null) {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useEffect(() => {
    if (!geoFile) return;
    setLoading(true);

    const targetFile = geoFile;
    fetchGeoWithFallback(targetFile).then(async (data) => {
      // Detect if we got the fallback by checking if the real file exists
      let usedFallback = false;
      try {
        const probe = await fetch(`/geo/${targetFile}`, {
          method: "HEAD",
          cache: "no-store",
        });
        usedFallback = !probe.ok;
      } catch {
        usedFallback = true;
      }

      setGeoData(data);
      setIsPlaceholder(usedFallback);
      setLoading(false);
    });
  }, [geoFile]);

  return { geoData, loading, isPlaceholder };
}
