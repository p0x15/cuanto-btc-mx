import { Navbar } from "@/components/Navbar";
import { TestWizard } from "@/components/TestWizard";

export const metadata = {
  title: "Test Personalizado — Donde BTC MX",
  description: "Encuentra el mejor exchange de Bitcoin para ti según tus prioridades: KYC, Lightning, SPEI y más.",
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-16 md:pb-0">
      <Navbar />
      <TestWizard />
    </div>
  );
}
