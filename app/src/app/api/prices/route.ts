import { NextResponse } from "next/server";
import { exchanges } from "@/data/exchanges";

export const dynamic = "force-dynamic";

/* ─── Types ────────────────────────────────────────────────────── */

interface ExchangePrice {
  ask: number;
  source: "live" | "estimated";
}

interface PricesResponse {
  spot: number;
  prices: Record<string, ExchangePrice>;
  updatedAt: string;
}

/* ─── Helper: safe JSON fetch with timeout ─────────────────────── */

// ─── Server-side in-memory cache ───────────────────────────────────────────

interface CacheEntry {
  data: PricesResponse;
  ts: number;
}

let serverCache: CacheEntry | null = null;
const CACHE_TTL_MS = 45_000; // 45 seconds

// ─── Helper: safe JSON fetch with timeout ─────────────────────── */

async function safeFetch(
  url: string,
  opts?: RequestInit,
  timeoutMs = 4000
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ─── Individual exchange fetchers ────────────────────────────── */

/** CoinGecko — neutral spot reference */
async function fetchCoinGeckoSpot(): Promise<number | null> {
  const res = await safeFetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn",
    { headers: { Accept: "application/json" } }
  );
  if (!res) return null;
  const data = await res.json();
  return Math.round(data.bitcoin?.mxn) || null;
}

/** Bitso — ask price from public ticker */
async function fetchBitsoAsk(): Promise<number | null> {
  const res = await safeFetch(
    "https://api.bitso.com/v3/ticker/?book=btc_mxn",
    { headers: { Accept: "application/json" } }
  );
  if (!res) return null;
  const data = await res.json();
  const ask = parseFloat(data.payload?.ask);
  return isNaN(ask) ? null : Math.round(ask);
}

/** Buda.com — min_ask from public ticker (both URLs tried in parallel) */
async function fetchBudaAsk(): Promise<number | null> {
  const urls = [
    "https://www.buda.com/api/v2/markets/btc-mxn/ticker.json",
    "https://www.buda.com/api/v2/markets/btc-mxn/ticker",
  ];

  const results = await Promise.all(
    urls.map((url) => safeFetch(url, { headers: { Accept: "application/json" } }))
  );

  for (const res of results) {
    if (!res) continue;
    const data = await res.json();
    const minAsk = data.ticker?.min_ask;
    if (Array.isArray(minAsk)) {
      const val = parseFloat(minAsk[0]);
      if (!isNaN(val)) return Math.round(val);
    }
    const lastPrice = data.ticker?.last_price;
    if (Array.isArray(lastPrice)) {
      const val = parseFloat(lastPrice[0]);
      if (!isNaN(val)) return Math.round(val);
    }
  }
  return null;
}

/** Binance P2P — median price from top merchant ads */
async function fetchBinanceP2PAsk(): Promise<number | null> {
  const body = {
    asset: "BTC",
    fiat: "MXN",
    tradeType: "BUY",
    page: 1,
    rows: 10,
    publisherType: "merchant",
    payTypes: [],
  };
  const res = await safeFetch(
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
    4000
  );
  if (!res) return null;
  const data = await res.json();
  const ads = data.data;
  if (!Array.isArray(ads) || ads.length === 0) return null;

  // Get prices from top ads and use median
  const prices = ads
    .map((ad: { adv?: { price?: string } }) => parseFloat(ad.adv?.price ?? "0"))
    .filter((p: number) => p > 0)
    .sort((a: number, b: number) => a - b);

  if (prices.length === 0) return null;
  const mid = Math.floor(prices.length / 2);
  return Math.round(prices[mid]);
}

/** Hodl Hodl — median price from MXN sell offers */
async function fetchHodlHodlAsk(): Promise<number | null> {
  const res = await safeFetch(
    "https://hodlhodl.com/api/v1/offers?filters[currency_code]=MXN&filters[side]=sell&sort_by=price&sort_direction=asc&pagination[limit]=10",
    { headers: { Accept: "application/json" } }
  );
  if (!res) return null;
  const data = await res.json();
  const offers = data.offers;
  if (!Array.isArray(offers) || offers.length === 0) return null;

  const prices = offers
    .map((o: { price?: string }) => parseFloat(o.price ?? "0"))
    .filter((p: number) => p > 0)
    .sort((a: number, b: number) => a - b);

  if (prices.length === 0) return null;
  const mid = Math.floor(prices.length / 2);
  return Math.round(prices[mid]);
}

/** Kraken — ask price from public ticker (XBT/MXN pair) */
async function fetchKrakenAsk(): Promise<number | null> {
  const res = await safeFetch(
    "https://api.kraken.com/0/public/Ticker?pair=XBTMXN",
    { headers: { Accept: "application/json" } }
  );
  if (!res) return null;
  const data = await res.json();
  if (data.error?.length) return null;
  // Kraken returns result keyed by pair name; ask is result[pair].a[0]
  const result = data.result as Record<string, { a: string[] }> | undefined;
  if (!result) return null;
  const pair = Object.values(result)[0];
  const ask = parseFloat(pair?.a?.[0] ?? "0");
  return isNaN(ask) || ask === 0 ? null : Math.round(ask);
}

/** RoboSats — median price from MXN order book (currency ID 28 = MXN, type 1 = sell) */
async function fetchRoboSatsAsk(): Promise<number | null> {
  // RoboSats runs primarily on Tor; their clearnet API may or may not respond
  const res = await safeFetch(
    "https://unsafe.robosats.com/api/book/?currency=28&type=1",
    { headers: { Accept: "application/json" } },
    3000 // clearnet mirror de Tor — si no responde en 3s, no vale esperar
  );
  if (!res) return null;
  const orders = await res.json();
  if (!Array.isArray(orders) || orders.length === 0) return null;

  const prices = orders
    .map((o: { price?: number }) => o.price ?? 0)
    .filter((p: number) => p > 0)
    .sort((a: number, b: number) => a - b);

  if (prices.length === 0) return null;
  const mid = Math.floor(prices.length / 2);
  return Math.round(prices[mid]);
}

/* ─── Main handler ────────────────────────────────────────────── */

export async function GET() {
  // Serve from cache if fresh
  if (serverCache && Date.now() - serverCache.ts < CACHE_TTL_MS) {
    return NextResponse.json(serverCache.data, {
      headers: { "Cache-Control": "public, s-maxage=45, stale-while-revalidate=10" },
    });
  }

  try {
    // Fire all requests in parallel
    const [spot, bitsoAsk, budaAsk, binanceAsk, hodlAsk, roboAsk, krakenAsk] =
      await Promise.all([
        fetchCoinGeckoSpot(),
        fetchBitsoAsk(),
        fetchBudaAsk(),
        fetchBinanceP2PAsk(),
        fetchHodlHodlAsk(),
        fetchRoboSatsAsk(),
        fetchKrakenAsk(),
      ]);

    // We need at least CoinGecko or Bitso for a reference price
    const refSpot = spot ?? bitsoAsk ?? 1_250_000; // last resort hardcoded fallback

    // Map exchange API source → live price
    const liveMap: Record<string, number | null> = {
      bitso: bitsoAsk,
      buda: budaAsk,
      "binance-p2p": binanceAsk,
      "hodl-hodl": hodlAsk,
      robosats: roboAsk,
      kraken: krakenAsk,
    };

    // Build per-exchange prices
    const prices: Record<string, ExchangePrice> = {};

    for (const ex of exchanges) {
      if (ex.apiSource === "coingecko-scaled") {
        // No API — estimate from spot × (1 + spread)
        prices[ex.id] = {
          ask: Math.round(refSpot * (1 + ex.spreadEstimate)),
          source: "estimated",
        };
      } else {
        const livePrice = liveMap[ex.apiSource];
        if (livePrice) {
          prices[ex.id] = { ask: livePrice, source: "live" };
        } else {
          // API failed — fallback to estimated
          prices[ex.id] = {
            ask: Math.round(refSpot * (1 + (ex.spreadEstimate || 0.01))),
            source: "estimated",
          };
        }
      }
    }

    const response: PricesResponse = {
      spot: refSpot,
      prices,
      updatedAt: new Date().toISOString(),
    };

    // Store in server-side cache
    serverCache = { data: response, ts: Date.now() };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=45, stale-while-revalidate=10",
      },
    });
  } catch (err) {
    console.error("[/api/prices]", err);
    return NextResponse.json(
      { error: "No se pudo obtener precios en vivo" },
      { status: 503 }
    );
  }
}
