import Link from "next/link";

export function TestBanner() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10 md:py-14 flex flex-col md:flex-row gap-8 md:gap-10 items-start">
        {/* Left — copy */}
        <div className="flex-1 flex flex-col gap-5">
          <span className="text-xs font-bold tracking-[0.15em] text-[#F7931A]">
            ¿QUIERES MÁS CONTROL?
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[var(--fg)] leading-tight">
            Personaliza tu<br />búsqueda
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-[var(--fg-muted)]">
            Filtra por nivel de KYC, soporte Lightning, exchanges no custodiales y más.
            El comparador inteligente ordena los resultados según lo que realmente te importa a ti.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/test"
              className="rounded-full bg-[#F7931A] px-7 py-3.5 text-[15px] font-bold text-[#0B0B0B] transition-opacity hover:opacity-90"
            >
              Hacer el test personalizado →
            </Link>
            <Link
              href="/guias"
              className="rounded-full bg-[var(--bg-elevated)] px-7 py-3.5 text-[15px] font-semibold text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              ¿Cómo funciona?
            </Link>
          </div>
        </div>

        {/* Right — feature cards */}
        <div className="flex flex-col gap-3 w-full md:w-80">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--fg-faint)]">
            QUÉ PUEDES FILTRAR
          </p>
          {[
            { icon: "🔒", title: "Nivel de KYC",       sub: "Sin verificación, básico o completo"   },
            { icon: "⚡", title: "Lightning Network",   sub: "Retiros instantáneos de sats"           },
            { icon: "🔑", title: "Custodia",            sub: "Tú controlas tus llaves privadas"       },
            { icon: "🏦", title: "SPEI",                sub: "Depósito bancario desde México"         },
          ].map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-4 rounded-xl bg-[var(--bg-elevated)] px-4 py-3.5"
            >
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-sm font-bold text-[var(--fg)]">{f.title}</div>
                <div className="text-xs text-[var(--fg-muted)]">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
