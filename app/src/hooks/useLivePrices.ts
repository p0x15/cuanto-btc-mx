"use client";

import { useEffect, useState, useCallback } from "react";
import { BTC_SPOT_MXN } from "@/data/exchanges";

export interface LivePrices {
  spot: number;        // último precio BTC/MXN de Bitso
  ask: number;         // precio ask de Bitso (lo que pagas)
  updatedAt: Date | null;
  loading: boolean;
  error: boolean;
}

const REFRESH_MS = 60_000; // refresca cada 60 segundos

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 10)  return "ahora mismo";
  if (secs < 60)  return `hace ${secs}s`;
  const mins = Math.floor(secs / 60);
  return `hace ${mins} min`;
}

export function useLivePrices(): LivePrices & { timeAgoStr: string } {
  const [data, setData] = useState<Omit<LivePrices, "loading" | "error">>({
    spot: BTC_SPOT_MXN,
    ask:  BTC_SPOT_MXN,
    updatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [tick, setTick]       = useState(0); // para forzar re-render del timeAgo

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      if (json.spot) {
        setData({ spot: json.spot, ask: json.ask, updatedAt: new Date(json.updatedAt) });
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const fetchInterval = setInterval(fetchPrices, REFRESH_MS);
    // Tick cada 15s para actualizar "hace X min"
    const tickInterval  = setInterval(() => setTick(t => t + 1), 15_000);
    return () => {
      clearInterval(fetchInterval);
      clearInterval(tickInterval);
    };
  }, [fetchPrices]);

  // Suppress unused variable warning for tick
  void tick;

  const timeAgoStr = data.updatedAt
    ? timeAgo(data.updatedAt)
    : "cargando...";

  return { ...data, loading, error, timeAgoStr };
}

/**
 * Dado el precio spot en vivo, escala el precio mock de un exchange
 * proporcionalmente para mantener los spreads relativos correctos.
 *
 * Ejemplo: si Bitso estaba en $541k (mock) y ahora está en $600k,
 * Volabit (que estaba en $559k mock) escalaría a ~$619k.
 */
export function scalePrice(mockPrice: number, liveSpot: number): number {
  const ratio = liveSpot / BTC_SPOT_MXN;
  return Math.round(mockPrice * ratio);
}
