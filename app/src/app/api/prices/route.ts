import { NextResponse } from "next/server";

export const revalidate = 0;

/**
 * GET /api/prices
 * - spot: precio neutral de CoinGecko BTC/MXN (para el ticker del navbar)
 * - ask/bid: precio real de Bitso (para la fila de Bitso en la tabla)
 * Ambas APIs son públicas y no requieren API key.
 */
export async function GET() {
  try {
    const [cgRes, bitsoRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn",
        { headers: { "Accept": "application/json" }, next: { revalidate: 0 } }
      ),
      fetch(
        "https://api.bitso.com/v3/ticker/?book=btc_mxn",
        { headers: { "Accept": "application/json" }, next: { revalidate: 0 } }
      ),
    ]);

    if (!cgRes.ok)    throw new Error(`CoinGecko error ${cgRes.status}`);
    if (!bitsoRes.ok) throw new Error(`Bitso error ${bitsoRes.status}`);

    const [cgData, bitsoData] = await Promise.all([
      cgRes.json(),
      bitsoRes.json(),
    ]);

    const spot = Math.round(cgData.bitcoin.mxn);
    const ask  = Math.round(parseFloat(bitsoData.payload.ask));
    const bid  = Math.round(parseFloat(bitsoData.payload.bid));

    return NextResponse.json(
      { spot, ask, bid, updatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=55, stale-while-revalidate=10",
        },
      }
    );
  } catch (err) {
    console.error("[/api/prices]", err);
    return NextResponse.json(
      { error: "No se pudo obtener el precio en vivo" },
      { status: 503 }
    );
  }
}
