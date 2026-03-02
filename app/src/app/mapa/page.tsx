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
      <div className="shrink-0 px-4 md:px-8 pt-5 pb-2">
        <span className="text-[10px] font-bold tracking-[0.15em] text-[#F7931A]">
          HISTORIA MONETARIA
        </span>
        <h1 className="mt-0.5 text-xl md:text-2xl font-black tracking-tight text-[var(--fg)]">
          La Historia del Dinero en México
        </h1>
      </div>

      {/* Map fills all remaining height */}
      <div className="flex-1 overflow-hidden min-h-0">
        <HistoryMapClient />
      </div>
    </div>
  );
}
