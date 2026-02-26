"use client";

import { useState } from "react";
import { HeroInput } from "@/components/HeroInput";
import { ExchangeTable } from "@/components/ExchangeTable";
import { TestBanner } from "@/components/TestBanner";

export function HomePage() {
  const [mxn, setMxn] = useState(1_000);

  return (
    <>
      <HeroInput mxn={mxn} onChange={setMxn} />
      <ExchangeTable mxn={mxn} />
      <TestBanner />
    </>
  );
}
