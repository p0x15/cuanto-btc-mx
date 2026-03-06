import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HistoryMapClient } from "@/components/map/HistoryMapClient";

export const metadata = {
  title: "Historia del Dinero en México — CuantoBTC",
  description:
    "Mapa interactivo: 600 años de dinero en México desde el cacao mexica hasta Bitcoin. Bancarización y remesas por estado.",
};

export default function MapaPage() {
  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-[var(--bg)]">
      <Navbar />

      {/* Compact page header */}
      <div className="shrink-0 px-4 md:px-8 pt-5 pb-2 flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#F7931A]">
            HISTORIA MONETARIA
          </span>
          <h1 className="mt-0.5 text-xl md:text-2xl font-black tracking-tight text-[var(--fg)]">
            La Historia del Dinero en México
          </h1>
        </div>
        <Link
          href="/fuentes"
          className="shrink-0 mt-1 flex items-center gap-1.5 rounded-lg border border-[var(--border-2)] bg-[var(--bg-raised)] px-3 py-1.5 font-ui-mono text-[10px] font-semibold text-[var(--fg-muted)] hover:border-[#F7931A44] hover:text-[#F7931A] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Fuentes
        </Link>
      </div>

      {/* Map fills all remaining height */}
      <div className="flex-1 overflow-hidden min-h-0">
        <HistoryMapClient />
      </div>
    </div>
  );
}
