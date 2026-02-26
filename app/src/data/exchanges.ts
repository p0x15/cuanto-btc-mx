export type KycLevel = "none" | "basic" | "full";

export interface Exchange {
  id: string;
  name: string;
  slug: string;
  type: string;
  /** Precio BTC en MXN (antes de comisión) */
  btcPriceMxn: number;
  /** Comisión en % que cobra al comprar */
  feePct: number;
  spei: boolean;
  lightning: boolean;
  nonCustodial: boolean;
  kyc: KycLevel;
  url: string;
  color: string; // accent color para el logo placeholder
  logo: string;  // ruta relativa a /public
}

/**
 * Mock data — precios aproximados al momento del diseño.
 * btcPriceMxn es el precio efectivo que el exchange cobra (ya incluye spread).
 * Los sats se calculan: floor((mxn / btcPriceMxn) * (1 - feePct/100) * 1e8)
 */
export const exchanges: Exchange[] = [
  {
    id: "bitso",
    name: "Bitso",
    slug: "bitso",
    type: "Exchange MX",
    btcPriceMxn: 541_000,
    feePct: 1.4,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "full",
    url: "https://bitso.com",
    color: "#00B4D8",
    logo: "/logos/bitso.png",
  },

  {
    id: "volabit",
    name: "Volabit",
    slug: "volabit",
    type: "Exchange MX",
    btcPriceMxn: 559_000,
    feePct: 2.0,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "basic",
    url: "https://volabit.com",
    color: "#7C3AED",
    logo: "/logos/volabit.jpg",
  },
  {
    id: "buda",
    name: "Buda.com",
    slug: "buda",
    type: "Exchange LATAM",
    btcPriceMxn: 568_800,
    feePct: 2.5,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "full",
    url: "https://buda.com",
    color: "#10B981",
    logo: "/logos/buda.jpg",
  },
  {
    id: "hodl-hodl",
    name: "Hodl Hodl",
    slug: "hodl-hodl",
    type: "P2P · No custodial",
    btcPriceMxn: 590_000,
    feePct: 0.6,
    spei: false,
    lightning: false,
    nonCustodial: true,
    kyc: "none",
    url: "https://hodlhodl.com",
    color: "#F59E0B",
    logo: "/logos/hodl-hodl.png",
  },
  {
    id: "aureo",
    name: "Aureo",
    slug: "aureo",
    type: "Exchange MX",
    btcPriceMxn: 545_000,
    feePct: 1.5,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "basic",
    url: "https://aureo.mx",
    color: "#EAB308",
    logo: "/logos/aureo.jpg",
  },
  {
    id: "binance",
    name: "Binance P2P",
    slug: "binance",
    type: "Exchange Global · P2P",
    btcPriceMxn: 538_000,
    feePct: 0.5,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "full",
    url: "https://p2p.binance.com",
    color: "#F3BA2F",
    logo: "/logos/binance.png",
  },
  {
    id: "kapitalex",
    name: "Kapitalex",
    slug: "kapitalex",
    type: "Exchange MX",
    btcPriceMxn: 548_000,
    feePct: 1.2,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "full",
    url: "https://kapitalex.com",
    color: "#3B82F6",
    logo: "/logos/kapitalex.png",
  },
  {
    id: "mostro",
    name: "Mostro",
    slug: "mostro",
    type: "P2P Nostr · No custodial",
    btcPriceMxn: 555_000,
    feePct: 0.6,
    spei: false,
    lightning: true,
    nonCustodial: true,
    kyc: "none",
    url: "https://mostro.network",
    color: "#8B5CF6",
    logo: "/logos/mostro.jpg",
  },
  {
    id: "robosats",
    name: "RoboSats",
    slug: "robosats",
    type: "P2P · No custodial",
    btcPriceMxn: 558_000,
    feePct: 0.3,
    spei: false,
    lightning: true,
    nonCustodial: true,
    kyc: "none",
    url: "https://robosats.com",
    color: "#06B6D4",
    logo: "/logos/robosats.png",
  },
  {
    id: "lnp2pbot",
    name: "lnp2pBot",
    slug: "lnp2pbot",
    type: "P2P Telegram · ⚡ Lightning",
    btcPriceMxn: 552_000,
    feePct: 0.6,
    spei: true,
    lightning: true,
    nonCustodial: true,
    kyc: "none",
    url: "https://t.me/lnp2pBot",
    color: "#0088CC",
    logo: "/logos/lnp2pbot.png",
  },
];

/** BTC spot de referencia en MXN (fuente de mercado) */
export const BTC_SPOT_MXN = 534_000;

/** Cuándo se actualizaron los datos */
export const LAST_UPDATED = "hace 2 min";

/**
 * Calcula cuántos satoshis recibes al gastar `mxn` pesos en un exchange.
 * Fórmula: floor( mxn / precioEfectivo * (1 - fee/100) * 1e8 )
 */
export function calcSats(mxn: number, exchange: Exchange): number {
  const effectivePrice = exchange.btcPriceMxn;
  const btcAmount = (mxn / effectivePrice) * (1 - exchange.feePct / 100);
  return Math.floor(btcAmount * 1e8);
}
