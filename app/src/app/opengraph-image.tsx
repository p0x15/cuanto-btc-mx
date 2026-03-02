import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "¿A cuánto está el Bitcoin en México?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0B0B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle orange glow */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Bitcoin symbol */}
        <div
          style={{
            fontSize: 96,
            color: "#F7931A",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ₿
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 54,
            color: "#FFFFFF",
            fontWeight: 800,
            marginTop: 24,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          ¿A cuánto está el Bitcoin
        </div>
        <div
          style={{
            fontSize: 54,
            color: "#FFFFFF",
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          en México?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#888888",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Compara en tiempo real: Bitso · Kraken · Buda · Binance · Aureo
        </div>

        {/* Domain badge */}
        <div
          style={{
            marginTop: 40,
            background: "#F7931A",
            color: "#000000",
            fontSize: 22,
            fontWeight: 700,
            padding: "10px 28px",
            borderRadius: 999,
          }}
        >
          cuantobtc.lat
        </div>
      </div>
    ),
    { ...size }
  );
}
