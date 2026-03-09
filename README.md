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

La mayoría de funcionalidades no requieren variables de entorno. La única excepción es el endpoint de sugerencias de exchanges, que abre PRs en GitHub:

```
GITHUB_TOKEN=github_pat_...   # Fine-grained token con Contents + Pull requests (R/W)
```

---

## Estructura

```
app/
  src/
    app/
      api/
        prices/       # Precios en tiempo real con cache de 45s
        suggest/      # Abre PR en GitHub al sugerir un exchange
      /               # Comparador principal
      /test           # Test personalizado
      /mapa           # Mapa historico monetario de Mexico
      /guias          # Guias de compra
      /fuentes        # Fuentes y metodologia
    components/       # Componentes React
    data/             # Exchanges y guias (datos estaticos)
    hooks/            # useLivePrices
    lib/              # Utilidades (formatBtc, etc.)
  public/
    logos/            # Logos de exchanges
    geo/              # GeoJSON y datos del mapa historico
```

---

## Exchanges incluidos

| Exchange | Tipo | API |
|---|---|---|
| Bitso | Exchange MX | Publica |
| Buda | Exchange MX | Publica |
| Kapitalex | Exchange MX | Estimada |
| Kraken | Exchange Global | Publica (XBT/MXN) |
| Aureo | Exchange MX | Estimada |
| Binance P2P | P2P Global | Publica |
| Hodl Hodl | P2P | Publica |
| RoboSats | P2P | Publica (clearnet) |
| Mostro | P2P Nostr | Estimada |
| lnp2pbot | P2P Telegram | Estimada |

Los precios se cachean en memoria por 45 segundos para reducir latencia.

---

## Test personalizado

Wizard de 3 a 5 preguntas que recomienda el exchange mas adecuado segun el perfil del usuario. El arbol de decision:

```
experiencia
├── principiante
│   ├── precio       → pago → monto → resultados
│   ├── simple       → monto → resultados
│   └── privacidad   → wallet → monto → resultados
│       └── sin banco → orientacion (wallets + cajeros)
│
├── intermedio
│   ├── precio       → pago → monto → resultados
│   ├── simple       → pago → monto → resultados
│   ├── privacidad   → wallet → monto → resultados
│   └── control      → wallet → monto → resultados
│
└── avanzado
    ├── precio       → pago → monto → resultados
    ├── simple       → pago → monto → resultados
    ├── privacidad   → wallet → profundidad → monto → resultados
    │                          ├── clearnet (sin registro)
    │                          └── deep (Tor / Nostr)
    └── control      → wallet → monto → resultados
```

El scoring pondera sats recibidos, KYC, SPEI, Lightning, custodia y complejidad operativa segun las respuestas.

---

## Sugerir un exchange

Desde la app, el boton "¿No ves tu exchange favorito?" en la tabla abre un modal. Al enviar, el backend crea automaticamente una branch y abre un PR en este repositorio con la sugerencia, incluyendo nombre y fecha. Rate limit: 3 sugerencias por IP por hora.

---

## Contribuir

Pull requests bienvenidos. Para proponer un exchange nuevo, usa el flujo de sugerencias dentro de la app o abre un PR directamente modificando `app/src/data/exchanges.ts`.

---

## Licencia

MIT
