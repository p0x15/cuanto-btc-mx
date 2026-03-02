export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; emoji: string; text: string };

export interface Guide {
  slug: string;
  icon: string;
  title: string;
  description: string;
  readTime: string;
  tags: string[];
  content: ContentBlock[];
}

export const guides: Guide[] = [
  {
    slug: "que-es-bitcoin",
    icon: "₿",
    title: "¿Qué es Bitcoin?",
    description:
      "La primera forma de dinero digital verdaderamente escaso, sin banco central ni intermediarios. Una introducción honesta para quien empieza desde cero.",
    readTime: "5 min",
    tags: ["Básico"],
    content: [
      {
        type: "paragraph",
        text: "Bitcoin es una forma de dinero digital que funciona sin bancos, sin gobiernos y sin intermediarios. Fue creado en 2009 por una persona (o grupo) bajo el seudónimo Satoshi Nakamoto, y desde entonces opera de forma ininterrumpida, 24 horas al día, 7 días a la semana.",
      },
      {
        type: "heading",
        text: "El problema que resuelve",
      },
      {
        type: "paragraph",
        text: "El dinero tradicional —pesos, dólares, euros— lo emiten los bancos centrales y pueden crear más cuando quieran. Eso hace que con el tiempo cada peso valga menos: inflación. Bitcoin resuelve esto con una regla matemática simple: nunca existirán más de 21 millones de bitcoins. Nadie puede cambiar esa regla.",
      },
      {
        type: "callout",
        emoji: "📉",
        text: "El peso mexicano ha perdido más del 99% de su poder adquisitivo en los últimos 50 años. El dinero que guardas en efectivo se devalúa cada año aunque no lo notes.",
      },
      {
        type: "heading",
        text: "¿Cómo funciona sin un banco central?",
      },
      {
        type: "paragraph",
        text: "Bitcoin usa una tecnología llamada blockchain: una base de datos pública donde se registran todas las transacciones. Miles de computadoras (nodos) en todo el mundo guardan una copia idéntica de esa base de datos. Para falsificar una transacción necesitarías controlar más de la mitad de toda esa red al mismo tiempo — algo prácticamente imposible.",
      },
      {
        type: "list",
        items: [
          "Descentralizado — ninguna empresa, banco o gobierno lo controla",
          "Transparente — cualquiera puede verificar cualquier transacción",
          "Inmutable — lo que ya se registró no se puede cambiar ni borrar",
          "Sin fronteras — enviar Bitcoin a Japón cuesta lo mismo que enviarlo a la CDMX",
          "Sin horarios — funciona los 365 días del año, a cualquier hora",
        ],
      },
      {
        type: "heading",
        text: "¿Qué es un bitcoin exactamente?",
      },
      {
        type: "paragraph",
        text: "Un bitcoin es simplemente una entrada en esa base de datos global que dice «esta dirección tiene X cantidad». No hay monedas físicas ni archivos que descargar. Lo que tienes es una llave privada (una contraseña matemática) que te da el derecho de mover esos fondos.",
      },
      {
        type: "paragraph",
        text: "Cada bitcoin se divide en 100,000,000 unidades llamadas satoshis (sats). No necesitas comprar un bitcoin completo — puedes empezar con $100 MXN y obtener unos cuantos miles de sats.",
      },
      {
        type: "heading",
        text: "¿Es seguro?",
      },
      {
        type: "paragraph",
        text: "El protocolo de Bitcoin nunca ha sido hackeado en sus 15+ años de existencia. Los hackeos que escuchas en las noticias son siempre a exchanges o wallets mal configuradas — no a Bitcoin en sí. Si guardas tus propias llaves, nadie puede quitarte tus bitcoin.",
      },
      {
        type: "callout",
        emoji: "🔑",
        text: "La seguridad de Bitcoin depende de ti. Si alguien más guarda tus bitcoin (un exchange), dependes de que ellos no quiebren ni te bloqueen. Por eso el dicho: «Not your keys, not your coins.»",
      },
      {
        type: "heading",
        text: "¿Por qué tiene valor?",
      },
      {
        type: "paragraph",
        text: "Bitcoin tiene valor por las mismas razones que el oro: es escaso, durable, divisible, portable y verificable. A diferencia del oro, también es fácil de enviar a cualquier parte del mundo en minutos. Su valor viene de la red de personas que lo usan y confían en sus reglas matemáticas — reglas que nadie puede cambiar unilateralmente.",
      },
    ],
  },
  {
    slug: "que-es-kyc",
    icon: "🔒",
    title: "¿Qué es KYC?",
    description:
      "Know Your Customer: la verificación de identidad que exigen la mayoría de los exchanges regulados. Te explicamos qué datos piden y por qué importa para tu privacidad.",
    readTime: "3 min",
    tags: ["Privacidad", "Regulación"],
    content: [
      {
        type: "paragraph",
        text: "KYC significa «Know Your Customer» (Conoce a tu Cliente). Es un conjunto de procedimientos que los negocios financieros están obligados legalmente a realizar para verificar la identidad de sus usuarios antes de permitirles operar.",
      },
      {
        type: "heading",
        text: "¿Qué datos pide un exchange con KYC?",
      },
      {
        type: "list",
        items: [
          "Nombre completo y fecha de nacimiento",
          "Identificación oficial (INE, pasaporte)",
          "Selfie con la identificación en mano",
          "Comprobante de domicilio reciente",
          "En algunos casos: fuente de ingresos o declaración patrimonial",
        ],
      },
      {
        type: "heading",
        text: "¿Por qué importa para tu privacidad?",
      },
      {
        type: "paragraph",
        text: "Una vez que entregas tus datos a un exchange, esa empresa sabe exactamente cuánto Bitcoin compraste, cuándo y a qué precio. Si alguna vez hay una filtración de datos o la empresa es adquirida, tu historial financiero puede quedar expuesto.",
      },
      {
        type: "paragraph",
        text: "Además, México tiene obligaciones de reporte ante el SAT y la CNBV. Los exchanges regulados están obligados a reportar operaciones que superen ciertos montos. Esto no es necesariamente malo — simplemente es algo que debes saber.",
      },
      {
        type: "heading",
        text: "¿Existen alternativas sin KYC?",
      },
      {
        type: "paragraph",
        text: "Sí. Los exchanges P2P como Mostro, RoboSats o Hodl Hodl permiten operar sin revelar tu identidad a la plataforma. En estos casos tratas directamente con otra persona. lnp2pBot en Telegram tampoco requiere KYC.",
      },
      {
        type: "callout",
        emoji: "⚠️",
        text: "Sin KYC no significa sin riesgo. En P2P dependes de la reputación y honestidad de la contraparte. Siempre opera con escrow y verifica las reseñas del vendedor.",
      },
      {
        type: "heading",
        text: "Niveles de KYC en este comparador",
      },
      {
        type: "list",
        items: [
          "Sin KYC — No piden ningún dato de identidad",
          "KYC básico — Solo email o número de teléfono",
          "KYC completo — INE + selfie + comprobante de domicilio",
        ],
      },
    ],
  },
  {
    slug: "lightning-network",
    icon: "⚡",
    title: "Lightning Network",
    description:
      "La capa 2 de Bitcoin que permite retiros instantáneos con comisiones mínimas. Cómo funciona y qué exchanges en México lo soportan.",
    readTime: "4 min",
    tags: ["Técnico", "Velocidad"],
    content: [
      {
        type: "paragraph",
        text: "Lightning Network es una red de pago construida sobre Bitcoin que permite enviar y recibir sats de forma instantánea con comisiones de fracciones de centavo. Es la segunda capa (Layer 2) más usada de Bitcoin.",
      },
      {
        type: "heading",
        text: "¿Cómo funciona?",
      },
      {
        type: "paragraph",
        text: "En lugar de registrar cada transacción en la blockchain de Bitcoin (lento y caro en horas pico), Lightning abre un canal de pago entre dos partes. Dentro de ese canal pueden intercambiar sats ilimitadas veces de forma instantánea. Solo cuando cierran el canal se registra la transacción final en la cadena.",
      },
      {
        type: "list",
        items: [
          "Transacciones en menos de 1 segundo",
          "Comisiones típicas: 1–10 sats (menos de $0.01 MXN)",
          "Sin límite de transacciones mientras el canal esté abierto",
          "Privacidad mejorada: las transacciones intermedias no quedan en la blockchain",
        ],
      },
      {
        type: "heading",
        text: "¿Por qué importa al comprar Bitcoin?",
      },
      {
        type: "paragraph",
        text: "Si compras Bitcoin en un exchange y quieres retirarlo a tu wallet, Lightning te permite hacerlo de forma inmediata y casi sin costo. Con Bitcoin on-chain puedes esperar entre 10 minutos y varias horas según la congestión de la red, y pagar comisiones de $5–50 MXN.",
      },
      {
        type: "callout",
        emoji: "⚡",
        text: "Para recibir por Lightning necesitas una wallet compatible: Phoenix, Breez, Wallet of Satoshi o cualquier wallet no-custodial con soporte Lightning.",
      },
      {
        type: "heading",
        text: "Exchanges en México que soportan Lightning",
      },
      {
        type: "paragraph",
        text: "En este comparador puedes filtrar por «Lightning» para ver qué plataformas permiten retirar vía Lightning Network. Actualmente Bitso, Mostro, RoboSats y lnp2pBot tienen soporte.",
      },
      {
        type: "heading",
        text: "¿Necesito entender Lightning para usarlo?",
      },
      {
        type: "paragraph",
        text: "No. Con wallets modernas como Phoenix, el proceso de abrir canales es automático. Simplemente das tu dirección Lightning al exchange y recibes tus sats en segundos.",
      },
    ],
  },
  {
    slug: "custodial-vs-no-custodial",
    icon: "🔑",
    title: "Custodial vs No Custodial",
    description:
      '"Not your keys, not your coins." Qué significa que un exchange guarde tus BTC y por qué muchos bitcoiners prefieren controlar sus propias llaves.',
    readTime: "5 min",
    tags: ["Seguridad", "Soberanía"],
    content: [
      {
        type: "paragraph",
        text: '«Not your keys, not your coins» es quizás la frase más importante en Bitcoin. Significa que si no controlas las llaves privadas de tu Bitcoin, técnicamente no es tuyo — es una promesa de otra persona.',
      },
      {
        type: "heading",
        text: "Exchange custodial",
      },
      {
        type: "paragraph",
        text: "Un exchange custodial (como Bitso o Binance) guarda tu Bitcoin en sus propias wallets. Tú tienes un saldo en su sistema, pero las llaves reales las controlan ellos. Es como tener dinero en el banco — confías en que el banco lo tenga.",
      },
      {
        type: "list",
        items: [
          "Ventaja: fácil de usar, sin necesidad de gestionar llaves",
          "Ventaja: recuperación de cuenta si pierdes contraseña",
          "Riesgo: si el exchange quiebra o es hackeado, puedes perder todo",
          "Riesgo: el exchange puede congelar tu cuenta o bloquear retiros",
          "Riesgo: estás sujeto a sus políticas y a regulaciones gubernamentales",
        ],
      },
      {
        type: "callout",
        emoji: "📉",
        text: "FTX, Mt. Gox, Celsius, BlockFi, Genesis... todos eran exchanges o plataformas custodiales que quebraron y sus usuarios perdieron fondos. Esto no es teoría — sucedió.",
      },
      {
        type: "heading",
        text: "Exchange no custodial (P2P)",
      },
      {
        type: "paragraph",
        text: "Una plataforma no custodial como Hodl Hodl, Mostro o RoboSats nunca toca tu Bitcoin. Las transacciones usan contratos de multisig o HTLCs donde el exchange solo actúa como árbitro, no como custodio.",
      },
      {
        type: "list",
        items: [
          "Ventaja: tú controlas tus llaves en todo momento",
          "Ventaja: si la plataforma cierra, tus fondos están seguros",
          "Ventaja: mayor privacidad",
          "Desventaja: más complejo de usar",
          "Desventaja: depende de la liquidez de contrapartes disponibles",
        ],
      },
      {
        type: "heading",
        text: "¿Qué deberías hacer?",
      },
      {
        type: "paragraph",
        text: "La recomendación estándar de la comunidad Bitcoin es: compra en el exchange que prefieras, pero retira inmediatamente a una wallet que tú controlas. No uses el exchange como cuenta de ahorro.",
      },
      {
        type: "callout",
        emoji: "🔑",
        text: "Para empezar, una wallet como Muun, Phoenix o Green de Blockstream es suficiente. Si tienes montos grandes, considera una hardware wallet (Ledger, Trezor, Coldcard).",
      },
    ],
  },
  {
    slug: "que-son-los-sats",
    icon: "₿",
    title: "¿Qué son los sats?",
    description:
      "Un satoshi es la unidad mínima de Bitcoin: 0.00000001 BTC. Por qué pensar en sats en lugar de BTC te ayuda a entender mejor lo que estás comprando.",
    readTime: "2 min",
    tags: ["Básico"],
    content: [
      {
        type: "paragraph",
        text: "Un satoshi (sat) es la unidad mínima de Bitcoin, equivalente a 0.00000001 BTC. El nombre es en honor a Satoshi Nakamoto, el creador pseudónimo de Bitcoin.",
      },
      {
        type: "heading",
        text: "La equivalencia",
      },
      {
        type: "list",
        items: [
          "1 Bitcoin = 100,000,000 satoshis",
          "1,000 sats ≈ $5–8 MXN (varía según el precio)",
          "10,000 sats ≈ $50–80 MXN",
          "100,000 sats ≈ $500–800 MXN",
          "1,000,000 sats (1 millón) ≈ $5,000–8,000 MXN",
        ],
      },
      {
        type: "heading",
        text: "¿Por qué pensar en sats y no en BTC?",
      },
      {
        type: "paragraph",
        text: "Con Bitcoin a $500,000–$1,000,000 MXN por unidad, comprar 0.00021 BTC suena insignificante. Pero eso es 21,000 sats — una cantidad que se siente más tangible y fácil de razonar.",
      },
      {
        type: "paragraph",
        text: "Pensar en sats también te ayuda a comparar precios entre exchanges de forma más intuitiva. Este comparador usa sats por peso mexicano: cuántos sats obtienes por cada $100 MXN que inviertes.",
      },
      {
        type: "callout",
        emoji: "💡",
        text: "Una forma fácil de convertir: si Bitcoin vale $600,000 MXN, entonces 1 MXN = ~167 sats. Para calcular tus sats: multiplica tus pesos × 100,000,000 ÷ precio de BTC.",
      },
      {
        type: "heading",
        text: "Stack sats",
      },
      {
        type: "paragraph",
        text: "«Stack sats» es la filosofía de acumular satoshis de forma gradual, sin importar el precio actual. En lugar de intentar adivinar el mercado, compras una cantidad fija cada semana o mes. Esta estrategia se llama DCA (Dollar Cost Averaging).",
      },
    ],
  },
  {
    slug: "como-usar-spei",
    icon: "🏦",
    title: "Cómo comprar BTC con SPEI",
    description:
      "Guía paso a paso para depositar pesos mexicanos vía SPEI en los exchanges que lo soportan. Límites, tiempos y qué esperar.",
    readTime: "4 min",
    tags: ["México", "Básico"],
    content: [
      {
        type: "paragraph",
        text: "SPEI (Sistema de Pagos Electrónicos Interbancarios) es la red de pagos instantáneos de México. La mayoría de los exchanges regulados en México aceptan depósitos vía SPEI, lo que hace el proceso de compra bastante sencillo.",
      },
      {
        type: "heading",
        text: "Paso a paso para depositar con SPEI",
      },
      {
        type: "list",
        items: [
          "Crea tu cuenta en el exchange y completa el KYC si es requerido",
          "Ve a la sección de «Depositar» o «Fondear» en el exchange",
          "Selecciona SPEI como método de depósito",
          "El exchange te dará una CLABE interbancaria (18 dígitos) y el concepto/referencia",
          "Desde tu app bancaria, agrega al exchange como nuevo beneficiario con esa CLABE",
          "Realiza la transferencia incluyendo exactamente el concepto que te dieron",
          "Espera la confirmación (generalmente entre 1 minuto y 2 horas)",
        ],
      },
      {
        type: "callout",
        emoji: "⚠️",
        text: "El concepto de pago es crítico. Si lo omites o lo pones mal, el depósito puede no acreditarse automáticamente y tendrás que contactar al soporte del exchange.",
      },
      {
        type: "heading",
        text: "Tiempos de acreditación",
      },
      {
        type: "paragraph",
        text: "SPEI opera 24/7 y los pagos son casi instantáneos entre bancos. Sin embargo, algunos exchanges procesan los depósitos manualmente o tienen ventanas de verificación, lo que puede agregar entre 15 minutos y 2 horas al proceso.",
      },
      {
        type: "heading",
        text: "Límites comunes",
      },
      {
        type: "list",
        items: [
          "Bitso: desde $50 MXN, sin límite máximo (sujeto a nivel de verificación)",
          "Volabit: desde $100 MXN hasta $500,000 MXN diarios",
          "Buda.com: desde $500 MXN",
          "Los límites varían según tu nivel de verificación KYC",
        ],
      },
      {
        type: "heading",
        text: "¿SPEI tiene costo?",
      },
      {
        type: "paragraph",
        text: "Tu banco puede cobrar una comisión por la transferencia SPEI (generalmente $0–$15 MXN). El exchange normalmente no cobra por recibir el depósito, pero verifica en su página de comisiones.",
      },
      {
        type: "callout",
        emoji: "💡",
        text: "Muchos bancos digitales como BBVA, Mercado Pago, Nu o Hey Banco tienen SPEI gratuito o de bajo costo. Si tu banco cobra mucho, considera usar uno de estos para tus compras de Bitcoin.",
      },
    ],
  },
  {
    slug: "como-funciona-una-transaccion",
    icon: "🔗",
    title: "¿Cómo funciona una transacción?",
    description:
      "Cuando envías bitcoin, ¿qué pasa exactamente? De tu wallet a la blockchain: firmas, mineros, confirmaciones y por qué nadie puede falsificar nada.",
    readTime: "6 min",
    tags: ["Técnico", "Básico"],
    content: [
      {
        type: "paragraph",
        text: "Cuando le envías bitcoin a alguien, no hay un archivo que viaja de un lado al otro ni un banco que mueve dinero entre cuentas. Lo que pasa es más elegante: le dices a toda la red «quiero mover X sats de mi dirección a esta otra dirección», y miles de computadoras en el mundo verifican que tienes permiso para hacerlo.",
      },
      {
        type: "heading",
        text: "Paso 1: tu wallet crea la transacción",
      },
      {
        type: "paragraph",
        text: "Tu wallet (la app que usas para guardar Bitcoin) construye un mensaje que dice esencialmente: «La dirección A quiere enviar 10,000 sats a la dirección B, y deja 200 sats de comisión para el minero.» Ese mensaje incluye una referencia a cómo llegaron esos sats a tu dirección originalmente (en Bitcoin todo tiene historial).",
      },
      {
        type: "heading",
        text: "Paso 2: firmas con tu llave privada",
      },
      {
        type: "paragraph",
        text: "Antes de transmitir la transacción, tu wallet la «firma» usando tu llave privada. Esta firma es un número matemático gigante que demuestra que tú — y solo tú — autorizaste este movimiento, sin revelar tu llave privada a nadie.",
      },
      {
        type: "callout",
        emoji: "🔐",
        text: "La criptografía detrás de esto (ECDSA sobre la curva secp256k1) hace que sea computacionalmente imposible falsificar una firma o adivinar tu llave privada a partir de la firma pública. Una computadora normal tardaría más que la edad del universo en romperla.",
      },
      {
        type: "heading",
        text: "Paso 3: la transacción se transmite a la red",
      },
      {
        type: "paragraph",
        text: "Tu wallet envía la transacción firmada a uno o varios nodos de Bitcoin. Cada nodo la valida (¿la firma es correcta? ¿tiene suficientes sats? ¿no es un doble gasto?) y si pasa, la reenvía a sus vecinos. En segundos, tu transacción está en la «mempool» — una sala de espera global donde esperan todas las transacciones pendientes.",
      },
      {
        type: "heading",
        text: "Paso 4: un minero la incluye en un bloque",
      },
      {
        type: "paragraph",
        text: "Los mineros son computadoras especializadas que compiten por resolver un acertijo matemático muy difícil. El primero en resolverlo gana el derecho de crear el siguiente bloque — un paquete de ~2,000 transacciones tomadas de la mempool. Naturalmente, priorizan las transacciones con mayor comisión.",
      },
      {
        type: "list",
        items: [
          "El acertijo se llama Proof of Work (prueba de trabajo)",
          "Se resuelve en promedio cada 10 minutos",
          "El minero ganador recibe la recompensa del bloque (actualmente 3.125 BTC) más las comisiones",
          "Si alguien quisiera falsificar una transacción, tendría que rehacer todo el trabajo computacional — imposible en la práctica",
        ],
      },
      {
        type: "heading",
        text: "Paso 5: confirmaciones",
      },
      {
        type: "paragraph",
        text: "Una vez que tu transacción está en un bloque, tiene 1 confirmación. Cada bloque nuevo que se agrega encima le da una confirmación más. Con 1 confirmación el pago es prácticamente irreversible para montos pequeños; con 6 confirmaciones (~1 hora) se considera seguro para cualquier monto.",
      },
      {
        type: "callout",
        emoji: "⏱️",
        text: "¿Por qué 6 confirmaciones? Para revertir una transacción ya confirmada, alguien necesitaría recrear esos 6 bloques más rápido que el resto de la red. Con el 51% del poder de minería del mundo, la probabilidad de éxito cae a prácticamente cero después del sexto bloque.",
      },
      {
        type: "heading",
        text: "¿Y si lo envías por Lightning?",
      },
      {
        type: "paragraph",
        text: "Lightning Network saltea todo este proceso. En lugar de escribir cada pago en la blockchain, abre un canal de pago directo entre dos nodos. Los pagos dentro del canal son instantáneos y casi gratuitos. Solo la apertura y cierre del canal requieren transacciones on-chain.",
      },
      {
        type: "heading",
        text: "Resumen en una línea",
      },
      {
        type: "paragraph",
        text: "Firmas con tu llave → la red verifica → un minero la incluye en un bloque → el bloque queda grabado para siempre en la cadena de todos. Sin bancos, sin permisos, sin horarios.",
      },
    ],
  },
  {
    slug: "comparar-exchanges",
    icon: "📊",
    title: "Cómo comparar exchanges",
    description:
      "Más allá del precio: comisiones ocultas, spread, liquidez, reputación y soporte. Todo lo que debes revisar antes de elegir dónde comprar.",
    readTime: "6 min",
    tags: ["Análisis"],
    content: [
      {
        type: "paragraph",
        text: "El precio no es el único factor al elegir dónde comprar Bitcoin. Un exchange que parece tener el mejor precio puede cobrarte más al final si sumas el spread, las comisiones de retiro y los tiempos de espera.",
      },
      {
        type: "heading",
        text: "1. El precio real: precio + spread + comisión",
      },
      {
        type: "paragraph",
        text: "El spread es la diferencia entre el precio de compra (ask) y el precio de venta (bid). Los exchanges ganan dinero aquí. Un exchange puede anunciar «0% de comisión» pero tener un spread del 1–2%, que equivale a perder $500–$1,000 MXN por cada $50,000 que inviertas.",
      },
      {
        type: "callout",
        emoji: "📊",
        text: "Este comparador muestra los sats que recibes por cada $100 MXN, ya incluyendo el spread del mercado. Es la métrica más honesta para comparar.",
      },
      {
        type: "heading",
        text: "2. Comisiones de retiro",
      },
      {
        type: "paragraph",
        text: "Muchos exchanges cobran una comisión fija por retirar Bitcoin a tu wallet. Puede ser de 0.0001 a 0.0005 BTC (entre 500 y 2,500 sats). En montos pequeños esto puede ser el costo más significativo.",
      },
      {
        type: "list",
        items: [
          "Retiro on-chain: suele costar entre 500–5,000 sats según la congestión",
          "Retiro Lightning: generalmente gratis o 1–10 sats",
          "Algunos exchanges tienen retiro gratuito hasta cierto límite mensual",
        ],
      },
      {
        type: "heading",
        text: "3. Liquidez y disponibilidad",
      },
      {
        type: "paragraph",
        text: "Un exchange P2P puede tener el mejor precio en teoría, pero si no hay vendedores disponibles cuando quieres comprar, no te sirve. Revisa cuántas ofertas activas hay en el momento que quieres operar.",
      },
      {
        type: "heading",
        text: "4. Reputación y historial",
      },
      {
        type: "list",
        items: [
          "¿Cuántos años lleva operando? (más es mejor)",
          "¿Ha tenido hackeos o pérdida de fondos de usuarios?",
          "¿Qué dice la comunidad en Twitter/X, Reddit, Nostr?",
          "¿Tiene licencia o registro ante la CNBV?",
          "¿El equipo es conocido y transparente?",
        ],
      },
      {
        type: "heading",
        text: "5. Métodos de pago disponibles",
      },
      {
        type: "paragraph",
        text: "Verifica que el exchange acepte los métodos de pago que usarás: SPEI, efectivo, tarjeta de débito, etc. Algunos métodos tienen comisiones adicionales o límites más bajos.",
      },
      {
        type: "heading",
        text: "6. Privacidad y KYC",
      },
      {
        type: "paragraph",
        text: "Decide qué tan importante es tu privacidad. Si usas un exchange con KYC completo, el gobierno sabe exactamente cuánto Bitcoin tienes. Si prefieres privacidad, los exchanges P2P sin KYC son la opción, aunque con menos comodidad.",
      },
      {
        type: "callout",
        emoji: "💡",
        text: "Una estrategia común: usa un exchange regulado para compras grandes y frecuentes (por practicidad), y un exchange P2P para una parte de tus compras (por privacidad).",
      },
    ],
  },
];
