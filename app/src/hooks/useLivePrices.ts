"use client";

import { useEffect, useState, useCallback } from "react";

/* ─── Types ────────────────────────────────────────────────────── */

export interface ExchangePrice {
  ask: number;
  source: "live" | "estimated";
}

export interface LivePrices {
  spot: number;
  prices: Record<string, ExchangePrice>;
  updatedAt: Date | null;
  loading: boolean;
  error: boolean;
}

const REFRESH_MS = 60_000;

/* ─── Time formatting ──────────────────────────────────────────── */

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "ahora mismo";
  if (secs < 60) return `hace ${secs}s`;
  const mins = Math.floor(secs / 60);
  return `hace ${mins} min`;
}

/* ─── Hook ─────────────────────────────────────────────────────── */

export function useLivePrices(): LivePrices & { timeAgoStr: string } {
  const [data, setData] = useState<{
    spot: number;
    prices: Record<string, ExchangePrice>;
    updatedAt: Date | null;
  }>({
    spot: 1_250_000, // fallback until API responds
    prices: {},
    updatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      if (json.spot && json.prices) {
        setData({
          spot: json.spot,
          prices: json.prices,
          updatedAt: new Date(json.updatedAt),
        });
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
    const tickInterval = setInterval(() => setTick(t => t + 1), 15_000);
    return () => {
      clearInterval(fetchInterval);
      clearInterval(tickInterval);
    };
  }, [fetchPrices]);

  void tick;

  const timeAgoStr = data.updatedAt
    ? timeAgo(data.updatedAt)
    : "cargando...";

  return { ...data, loading, error, timeAgoStr };
}

/**
 * Get the ask price for a specific exchange.
 * Returns the live/estimated price, or falls back to spot if not available.
 */
export function getPriceForExchange(
  prices: Record<string, ExchangePrice>,
  exchangeId: string,
  fallbackSpot: number
): { ask: number; source: "live" | "estimated" } {
  const p = prices[exchangeId];
  if (p) return p;
  return { ask: fallbackSpot, source: "estimated" };
}
