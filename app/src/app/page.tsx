import { Navbar } from "@/components/Navbar";
import { HomePage } from "@/components/HomePage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-16 md:pb-0">
      <Navbar />
      <HomePage />
      <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto max-w-[1400px] flex items-center gap-3 px-4 md:px-8 py-5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F7931A] text-xs font-black text-[#0B0B0B]">
            ₿
          </span>
          <span className="text-sm font-bold text-[var(--fg-faint)]">CuantoBTC</span>
          <div className="flex-1" />
          <span className="text-xs text-[var(--fg-ghost)]">
            Proyecto de código abierto · No somos un exchange · Solo comparamos precios
          </span>
        </div>
      </footer>
    </div>
  );
}
