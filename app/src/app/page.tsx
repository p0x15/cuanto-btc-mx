import { Navbar } from "@/components/Navbar";
import { HomePage } from "@/components/HomePage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-16 md:pb-0">
      <Navbar />
      <HomePage />
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-16">
        <details className="group cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-4 transition-colors hover:bg-[var(--bg-elevated)]">
          <summary className="font-ui-mono text-xs font-medium text-[var(--fg-muted)] outline-none group-open:mb-4 group-open:text-[var(--fg)]">
            ℹ️ ¿Cómo se calculan los precios en CuantoBTC?
          </summary>
          <div className="flex flex-col gap-4 font-ui-mono text-[11px] leading-relaxed text-[var(--fg-dim)]">
            <p>
              CuantoBTC obtiene los precios del mercado en tiempo real para ofrecerte la comparación más transparente posible.
              Sin embargo, no todos los exchanges tienen APIs públicas disponibles. Así es como calculamos lo que ves:
            </p>
            <div>
              <p className="font-semibold text-[var(--fg)] mb-1">● Conexión Directa (En Vivo)</p>
              <p>Para exchanges con APIs públicas (Bitso, Binance P2P, Hodl Hodl), nos conectamos directamente a sus servidores cada vez que visitas la página para obtener el precio exacto de venta (Ask) o la mejor oferta P2P en el momento.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--fg)] mb-1">○ Estimación Inteligente</p>
              <p>Para exchanges cerrados sin API pública (Aureo, Volabit, etc.), tomamos el precio Spot global de Bitcoin (vía CoinGecko) y le aplicamos un diferencial (spread) estimado basado en observaciones históricas de su plataforma. Por ejemplo, sabemos empíricamente que Aureo suele vender ~1.2% por debajo del Spot global, mientras que otros venden 1-2% por encima. A esto le sumamos sus comisiones de red o plataforma publicadas.</p>
            </div>
            <p className="text-[10px] text-[var(--fg-faint)] mt-2">
              *Nota: CuantoBTC es una herramienta informativa. Los precios finales pueden variar ligeramente al momento de hacer la compra real en cada plataforma dependiendo de la liquidez del momento.
            </p>
          </div>
        </details>
      </div>

      <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center px-4 md:px-16">
          <span className="font-ui-mono text-[11px] text-[var(--fg-faint)]">
            CuantoBTC — datos en tiempo real de exchanges mexicanos.
          </span>
          <div className="flex-1" />
          <span className="font-ui-mono text-[11px] text-[var(--fg-faint)]">hecho en México ₿</span>
        </div>
      </footer>

      {/* keep room for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
