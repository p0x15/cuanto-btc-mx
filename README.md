# CuantoBTC

Comparador de exchanges de Bitcoin en México en tiempo real. Calcula cuántos satoshis recibirías en cada plataforma dado un monto en pesos, con precios actualizados desde las APIs públicas de cada exchange.

Disponible en [cuantobtc.lat](https://cuantobtc.lat)

---

## Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

---

## Correr localmente

```bash
git clone https://github.com/p0x15/donde-btc-mx.git
cd donde-btc-mx/app
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

No se requieren variables de entorno para correr el proyecto. Todos los precios se obtienen de APIs públicas.

---

## Estructura

```
app/
  src/
    app/          # Rutas (/, /test, /mapa, /guias, /fuentes)
    components/   # Componentes React
    data/         # Exchanges y guías (datos estáticos)
    hooks/        # useLivePrices
    lib/          # Utilidades
    types/        # Tipos TypeScript
  public/
    logos/        # Logos de exchanges
    geo/          # GeoJSON y datos del mapa histórico
```

---

## Exchanges incluidos

| Exchange | Tipo | API |
|---|---|---|
| Bitso | Exchange MX | Pública |
| Buda | Exchange MX | Pública |
| Kapitalex | Exchange MX | Estimada |
| Kraken | Exchange Global | Pública (XBT/MXN) |
| Aureo | Exchange MX | Estimada |
| Binance P2P | P2P Global | Pública |
| Hodl Hodl | P2P | Pública |
| RoboSats | P2P | Pública (clearnet) |
| Mostro | P2P Nostr | Estimada |
| lnp2pbot | P2P Telegram | Estimada |

Los precios se cachean en memoria por 45 segundos para reducir latencia.

---

## Contribuir

Pull requests bienvenidos. Si quieres proponer agregar un exchange, usa el botón "¿No ves tu exchange favorito?" dentro de la app.

---

## Licencia

MIT
