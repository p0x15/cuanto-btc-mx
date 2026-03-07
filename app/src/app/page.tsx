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
              <p>Para exchanges cerrados sin API pública (Aureo, Kapitalex, etc.), tomamos el precio Spot global de Bitcoin (vía CoinGecko) y le aplicamos un diferencial (spread) estimado basado en observaciones históricas de su plataforma. Por ejemplo, sabemos empíricamente que Aureo suele vender ~1.2% por debajo del Spot global, mientras que otros venden 1-2% por encima. A esto le sumamos sus comisiones de red o plataforma publicadas.</p>
            </div>
            <p className="text-[10px] text-[var(--fg-faint)] mt-2">
              *Nota: CuantoBTC es una herramienta informativa. Los precios finales pueden variar ligeramente al momento de hacer la compra real en cada plataforma dependiendo de la liquidez del momento.
            </p>
          </div>
        </details>
      </div>

      <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-4 px-4 md:px-16">
          <span className="font-ui-mono text-[11px] text-[var(--fg-faint)]">
            CuantoBTC — datos en tiempo real de exchanges mexicanos.
          </span>
          <div className="flex-1" />
          <a
            href="https://github.com/p0x15/donde-btc-mx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-ui-mono text-[11px] text-[var(--fg-faint)] hover:text-[#F7931A] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Open source
          </a>
          <span className="font-ui-mono text-[11px] text-[var(--fg-faint)] hidden md:inline">·</span>
          <span className="font-ui-mono text-[11px] text-[var(--fg-faint)] hidden md:inline">hecho en México ₿</span>
        </div>
      </footer>

      {/* keep room for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
