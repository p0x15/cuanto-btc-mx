import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Guías — Donde BTC MX",
  description: "Aprende sobre KYC, Lightning Network, custodia y cómo comprar Bitcoin en México.",
};

const guides = [
  {
    slug: "que-es-kyc",
    icon: "🔒",
    title: "¿Qué es KYC?",
    description:
      "Know Your Customer: la verificación de identidad que exigen la mayoría de los exchanges regulados. Te explicamos qué datos piden y por qué importa para tu privacidad.",
    readTime: "3 min",
    tags: ["Privacidad", "Regulación"],
  },
  {
    slug: "lightning-network",
    icon: "⚡",
    title: "Lightning Network",
    description:
      "La capa 2 de Bitcoin que permite retiros instantáneos con comisiones mínimas. Cómo funciona y qué exchanges en México lo soportan.",
    readTime: "4 min",
    tags: ["Técnico", "Velocidad"],
  },
  {
    slug: "custodial-vs-no-custodial",
    icon: "🔑",
    title: "Custodial vs No Custodial",
    description:
      '"Not your keys, not your coins." Qué significa que un exchange guarde tus BTC y por qué muchos bitcoiners prefieren controlar sus propias llaves.',
    readTime: "5 min",
    tags: ["Seguridad", "Soberanía"],
  },
  {
    slug: "que-son-los-sats",
    icon: "₿",
    title: "¿Qué son los sats?",
    description:
      "Un satoshi es la unidad mínima de Bitcoin: 0.00000001 BTC. Por qué pensar en sats en lugar de BTC te ayuda a entender mejor lo que estás comprando.",
    readTime: "2 min",
    tags: ["Básico"],
  },
  {
    slug: "como-usar-spei",
    icon: "🏦",
    title: "Cómo comprar BTC con SPEI",
    description:
      "Guía paso a paso para depositar pesos mexicanos vía SPEI en los exchanges que lo soportan. Límites, tiempos y qué esperar.",
    readTime: "4 min",
    tags: ["México", "Básico"],
  },
  {
    slug: "comparar-exchanges",
    icon: "📊",
    title: "Cómo comparar exchanges",
    description:
      "Más allá del precio: comisiones ocultas, spread, liquidez, reputación y soporte. Todo lo que debes revisar antes de elegir dónde comprar.",
    readTime: "6 min",
    tags: ["Análisis"],
  },
];

export default function GuiasPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-16 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.15em] text-[#F7931A]">
            APRENDE
          </span>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--fg)]">
            Guías de Bitcoin en México
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-[var(--fg-muted)]">
            Todo lo que necesitas saber para comprar Bitcoin de forma segura,
            inteligente y soberana desde México.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <div
              key={g.slug}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)] p-6 transition-colors hover:border-[var(--border-2)] hover:bg-[var(--bg-elevated)] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{g.icon}</span>
                <span className="text-[11px] font-medium text-[var(--fg-muted)]">
                  {g.readTime} lectura
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-[var(--fg)] group-hover:text-[#F7931A] transition-colors">
                  {g.title}
                </h2>
                <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">
                  {g.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2 flex-wrap">
                {g.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--bg-high)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] px-6 py-5 flex items-center gap-4">
          <span className="text-2xl">📝</span>
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">
              Más guías en camino
            </p>
            <p className="text-xs text-[var(--fg-muted)]">
              Este proyecto es de código abierto. Si quieres contribuir una guía,{" "}
              <a
                href="https://github.com"
                className="text-[#F7931A] hover:underline"
              >
                abre un PR en GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex-1" />
          <Link
            href="/"
            className="rounded-full bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors"
          >
            ← Volver a comparar
          </Link>
        </div>
      </main>
    </div>
  );
}
