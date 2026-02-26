"use client";

import { useState } from "react";
import Image from "next/image";
import { Exchange } from "@/data/exchanges";

interface ExchangeLogoProps {
  exchange: Exchange;
  size?: number;       // px, default 40
  rounded?: string;    // tailwind class, default "rounded-xl"
  /** Si true (winner card naranja), fuerza fondo oscuro en vez del color del exchange */
  onOrange?: boolean;
}

export function ExchangeLogo({
  exchange,
  size = 40,
  rounded = "rounded-xl",
  onOrange = false,
}: ExchangeLogoProps) {
  const [imgError, setImgError] = useState(false);

  const bgStyle = onOrange
    ? { background: "#0B0B0B22" }
    : { background: `${exchange.color}22` };

  const textStyle = onOrange
    ? { color: "#0B0B0B" }
    : { color: exchange.color };

  if (imgError) {
    // Fallback: letra inicial con color del exchange
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center font-black ${rounded}`}
        style={{ width: size, height: size, fontSize: size * 0.45, ...bgStyle, ...textStyle }}
      >
        {exchange.name[0]}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden ${rounded}`}
      style={{ width: size, height: size, background: "var(--bg-elevated)" }}
    >
      <Image
        src={exchange.logo}
        alt={`${exchange.name} logo`}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}
