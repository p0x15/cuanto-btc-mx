export type KycLevel = "none" | "basic" | "full";

export type ApiSource =
  | "bitso"
  | "buda"
  | "binance-p2p"
  | "hodl-hodl"
  | "robosats"
  | "kraken"
  | "coingecko-scaled";

export interface Exchange {
  id: string;
  name: string;
  slug: string;
  type: string;
  /** Where we get the live price from */
  apiSource: ApiSource;
  /** Comisión en % que cobra al comprar */
  feePct: number;
  /**
   * For exchanges without a public API ("coingecko-scaled"),
   * this is the estimated spread % above CoinGecko spot.
   * e.g. 0.03 = ~3% above spot.
   */
  spreadEstimate: number;
  spei: boolean;
  lightning: boolean;
  nonCustodial: boolean;
  kyc: KycLevel;
  url: string;
  color: string;
  logo: string;
}

export const exchanges: Exchange[] = [
  {
    id: "bitso",
    name: "Bitso",
    slug: "bitso",
    type: "Exchange MX",
    apiSource: "bitso",
    feePct: 1.4,
    spreadEstimate: 0,
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "full",
    url: "https://bitso.com",
    color: "#00B4D8",
    logo: "/logos/bitso.png",
  },

  {
    id: "kraken",
    name: "Kraken",
    slug: "kraken",
    type: "Exchange Global",
    apiSource: "kraken",
    feePct: 0.4,
    spreadEstimate: 0,
    spei: false,
    lightning: false,
    nonCustodial: false,
    kyc: "full",
    url: "https://kraken.com",
    color: "#5741D9",
    logo: "/logos/kraken.png",  // add kraken.png to /public/logos/ for the full logo
  },
  {
    id: "buda",
    name: "Buda.com",
    slug: "buda",
    type: "Exchange LATAM",
    apiSource: "buda",
    feePct: 2.5,
    spreadEstimate: 0,
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
    apiSource: "hodl-hodl",
    feePct: 0.6,
    spreadEstimate: 0,
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
    apiSource: "coingecko-scaled",
    feePct: 0.99,
    spreadEstimate: -0.012,     // ~1.2% below spot (verified manually)
    spei: true,
    lightning: false,
    nonCustodial: false,
    kyc: "basic",
    url: "https://www.aureobitcoin.com/es",
    color: "#EAB308",
    logo: "/logos/aureo.jpg",
  },
  {
    id: "binance",
    name: "Binance P2P",
    slug: "binance",
    type: "Exchange Global · P2P",
    apiSource: "binance-p2p",
    feePct: 0.5,
    spreadEstimate: 0,
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
    apiSource: "coingecko-scaled",
    feePct: 1.2,
    spreadEstimate: 0.02,       // ~2% above spot
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
    apiSource: "coingecko-scaled",
    feePct: 0.6,
    spreadEstimate: 0.03,       // ~3% above spot (P2P premium)
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
    apiSource: "robosats",
    feePct: 0.3,
    spreadEstimate: 0.03,       // fallback if API unreachable
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
    apiSource: "coingecko-scaled",
    feePct: 0.6,
    spreadEstimate: 0.025,      // ~2.5% above spot
    spei: true,
    lightning: true,
    nonCustodial: true,
    kyc: "none",
    url: "https://t.me/lnp2pBot",
    color: "#0088CC",
    logo: "/logos/lnp2pbot.png",
  },
];

/**
 * Calcula cuántos satoshis recibes al gastar `mxn` pesos en un exchange.
 * `askPrice` is the price the exchange charges per BTC (including spread).
 * Fórmula: floor( mxn / askPrice * (1 - fee/100) * 1e8 )
 */
export function calcSats(mxn: number, askPrice: number, feePct: number): number {
  const btcAmount = (mxn / askPrice) * (1 - feePct / 100);
  return Math.floor(btcAmount * 1e8);
}
