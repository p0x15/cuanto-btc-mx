import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "¿A cuánto está el Bitcoin en México? | cuantobtc.lat",
  description:
    "Compara el precio del Bitcoin en pesos (MXN) en tiempo real: Bitso, Kraken, Buda, Binance, Aureo y más exchanges mexicanos.",
  metadataBase: new URL("https://www.cuantobtc.lat"),
  openGraph: {
    title: "¿A cuánto está el Bitcoin en México?",
    description:
      "Compara precios en tiempo real en todos los exchanges: Bitso, Kraken, Buda, Binance, Aureo y más.",
    url: "https://www.cuantobtc.lat",
    siteName: "cuantobtc.lat",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿A cuánto está el Bitcoin en México?",
    description:
      "Compara precios en tiempo real en todos los exchanges mexicanos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
