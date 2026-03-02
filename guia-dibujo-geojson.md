# Guía: Dibujo de polígonos GeoJSON históricos
## Donde BTC MX — Mapa interactivo "La Historia del Dinero en México"

Herramienta de dibujo: **geojson.io** (geojson.io)  
Destino final de los archivos: `app/public/geo/`  
Herramienta de validación: pegar el JSON en geojson.io y verificar visualmente

---

## Convenciones para todos los archivos

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "altiplano_central",
        "name": "Altiplano Central (Mexicas)",
        "era": "prehispanica"
      },
      "geometry": { ... }
    }
  ]
}
```

- Cada zona = un `Feature` con su `id` coincidiendo exactamente con el `id` en `map-data.json`
- Usar `MultiPolygon` cuando una zona tenga partes discontinuas (ej. área maya incluye península + tierras altas de Chiapas)
- Precisión suficiente: no necesitas trazar municipios exactos, solo la forma cultural aproximada
- Si una zona tiene costa, incluir la costa pero no el mar

---

## ERA 1: Mesoamérica prehispánica (~1400 d.C.)
**Archivo destino:** `app/public/geo/prehispanica.json`  
**Zonas a dibujar: 5**

### Mapa de referencia recomendado
**Fuente primaria:** Wikipedia Commons — "Mesoamerica regions map"  
URL: `https://commons.wikimedia.org/wiki/File:Mesoamerica_regions_map.svg`  
También útil: `https://commons.wikimedia.org/wiki/File:Late_Preclassic_Mesoamerica.png`

Para el norte árido (fuera de Mesoamérica):  
URL: `https://commons.wikimedia.org/wiki/File:Oasisamerica_en.svg`

**Cómo usarlo en geojson.io:**  
No se puede cargar una imagen SVG directamente. Proceso:
1. Abre geojson.io
2. En otra pestaña, abre el mapa de referencia en Wikipedia
3. Dibuja los polígonos a ojo usando los ríos y costas del mapa base de geojson.io como guía de orientación

---

### Zona 1 — `altiplano_central` ⭐ PRIORIDAD ALTA
**Nombre:** Altiplano Central (Mexicas / Triple Alianza)  
**Color en mapa:** `#C0392B` (rojo)

**Qué dibujar:**  
El corazón del Imperio Mexica en 1400-1521. No todo Mesoamérica, solo el área bajo control directo o tributario de Tenochtitlán.

**Límites aproximados:**
- Norte: Sierra Madre Oriental (línea ~Tula, Hidalgo hacia el norte de Veracruz)
- Sur: Costa de Guerrero y Oaxaca (costa del Pacífico hasta ~Huatulco, costa del Golfo hasta ~Coatzacoalcos)
- Este: Llega hasta la Mixteca y parte de Puebla, pero NO incluye Oaxaca central (eso es zapoteca)
- Oeste: No incluye el occidente purépecha (Michoacán)

**Estados modernos de referencia:** CDMX, Estado de México, Hidalgo, Morelos, Tlaxcala (aliado/enemigo), gran parte de Puebla, costa de Guerrero, norte de Oaxaca, sur de Veracruz

**Nota importante:** Tlaxcala era un enclave independiente dentro del territorio mexica. Para el MVP puedes incluirlo en el polígono mexica con una nota en el panel lateral.

---

### Zona 2 — `area_maya` ⭐ PRIORIDAD ALTA
**Nombre:** Área Maya  
**Color en mapa:** `#27AE60` (verde)

**Qué dibujar:**  
Área de influencia maya en ~1400 d.C. (período Posclásico tardío). Incluye dos partes discontinuas → usar `MultiPolygon`.

**Parte 1 — Tierras bajas del norte (Yucatán):**
- Toda la Península de Yucatán: Yucatán, Campeche, Quintana Roo
- Incluir parte norte de Tabasco

**Parte 2 — Tierras altas del sur:**
- Chiapas (zona de los Altos y Selva Lacandona)
- Conecta con Guatemala, pero solo dibujar territorio mexicano actual

**Referencias visuales:**
- `https://commons.wikimedia.org/wiki/File:Maya_civilization_location_map-blank.svg`
- El área maya es la mejor documentada cartográficamente

---

### Zona 3 — `zapoteca` ⭐ PRIORIDAD ALTA
**Nombre:** Oaxaca (Zapotecas / Mixtecas)  
**Color en mapa:** `#F39C12` (naranja)

**Qué dibujar:**  
En 1400 d.C., la región oaxaqueña estaba dividida entre zapotecas (Valle Central) y mixtecas (Mixteca Alta y Baja). Para el MVP, dibujar la región cultural oaxaqueña como una sola zona.

**Límites aproximados:**
- Prácticamente el estado moderno de Oaxaca, más la Mixteca poblana (suroeste de Puebla)
- Al norte limita con el territorio mexica (Sierra Madre del Sur)
- Al sur llega a la costa del Pacífico

**Nota:** En 1400, los mexicas estaban en proceso de conquista de partes de Oaxaca. El mapa debe mostrar la zona cultural, no el control político estricto.

---

### Zona 4 — `purepecha` ⭐ PRIORIDAD ALTA
**Nombre:** Occidente Purépecha (Tariácuri / Tzintzuntzan)  
**Color en mapa:** `#8E44AD` (morado)

**Qué dibujar:**  
El Imperio Purépecha fue el único que resistió militarmente a los mexicas. Sus fronteras en ~1400 eran bastante definidas.

**Límites aproximados:**
- Núcleo: Michoacán casi completo (alrededor del Lago de Pátzcuaro)
- Norte: llega hasta el río Lerma (parte de Guanajuato sur y Jalisco sur)
- Oeste: parte de Jalisco (no toda) y norte de Colima
- Sur: limite con la costa michoacana

**Referencias visuales:**
- `https://commons.wikimedia.org/wiki/File:Tarascan_state.png`
- Este es uno de los mejores mapas disponibles para esta zona

---

### Zona 5 — `norte_arido` PRIORIDAD MEDIA
**Nombre:** Norte árido (Culturas del desierto)  
**Color en mapa:** `#95A5A6` (gris)

**Qué dibujar:**  
Todo el territorio al norte de la frontera de Mesoamérica. Es la zona más grande pero menos detallada históricamente.

**Límites:**
- Sur: La "frontera" norte de Mesoamérica corría aproximadamente por el río Lerma-Santiago (Jalisco/Nayarit) hacia el este por Querétaro, San Luis Potosí, hasta el sur de Tamaulipas
- Norte: Las fronteras actuales de México (con EE.UU.)
- Este y Oeste: Costas de ambos mares

**Nota:** Esta zona incluía múltiples culturas (chichimecas, paquimenses, etc.) muy distintas. El polígono es simplificado deliberadamente para el MVP.

---

## ERA 2: Nueva España (1521–1821)
**Archivo destino:** `app/public/geo/nueva_espana.json`  
**Zonas a dibujar: 5–6 intendencias**

### Mapa de referencia recomendado
**Fuente primaria (excelente calidad):**  
`https://commons.wikimedia.org/wiki/File:Intendencias_Nueva_Espa%C3%B1a_1786.svg`

Este mapa SVG de Wikipedia muestra las intendencias de 1786 (Ordenanzas de Intendencias de Gálvez) con fronteras bastante precisas. Es la mejor referencia disponible libremente.

**Proceso:**
1. Descarga el SVG de Wikipedia Commons
2. Úsalo como referencia visual en otra pestaña mientras dibujas en geojson.io

---

### Intendencias a dibujar (6 zonas)

| id | Nombre | Color | Prioridad |
|---|---|---|---|
| `intendencia_mexico` | Intendencia de México | `#C0392B` | Alta |
| `intendencia_guadalajara` | Intendencia de Guadalajara | `#2980B9` | Alta |
| `intendencia_veracruz` | Intendencia de Veracruz | `#27AE60` | Alta |
| `intendencia_oaxaca` | Intendencia de Oaxaca | `#F39C12` | Alta |
| `intendencia_norte` | Provincias Internas del Norte | `#95A5A6` | Media |
| `intendencia_yucatan` | Intendencia de Yucatán | `#8E44AD` | Media |

**Nota sobre el norte:** Las "Provincias Internas" (Chihuahua, Sonora, Texas, California, Nuevo México) pueden tratarse como una sola zona para el MVP dado que sus fronteras exactas cambiaron frecuentemente y el territorio es muy grande.

**Intendencias menores** (Guanajuato, Valladolid/Michoacán, Puebla, San Luis Potosí, Zacatecas) pueden omitirse en MVP y agruparse en las principales. Si hay tiempo, agregarlas mejora el detalle.

---

## ERA 3: México independiente (1821–1910)
**Archivo destino:** `app/public/geo/independiente.json`

### Decisión de diseño para el MVP
Esta era representa *caos monetario* — 40 monedas simultáneas, fronteras disputadas, guerras civiles. El mapa más honesto no es uno de fronteras políticas precisas sino uno que muestre la **fragmentación**.

**Opción A (recomendada para MVP):** Un solo polígono del territorio nacional con subdivisiones por las principales regiones emisoras de moneda. No se requiere precisión extrema — el mensaje visual es el caos.

**Opción B:** Usar el mapa de estados de 1857 (Constitución de Reforma).  
Referencia: `https://commons.wikimedia.org/wiki/File:Mexico_1857_states_map.png`

**Recomendación:** Para el hackathon, usar `estados.json` (los 32 estados modernos) coloreados todos con el mismo color de "caos" y un overlay de texto explicativo. Dibuja los polígonos propios solo si hay tiempo después de terminar las eras 1 y 2.

---

## Orden de trabajo recomendado

```
Día 1:
  1. altiplano_central (mexica) — forma relativamente conocida
  2. area_maya — mejor documentada, MultiPolygon
  3. zapoteca — esencialmente Oaxaca + Mixteca poblana
  4. purepecha — Michoacán + sur de Jalisco

Día 2:
  5. norte_arido — zona grande, dibujo rápido
  6. intendencias Nueva España (4 principales)

Si sobra tiempo:
  7. intendencias menores Nueva España
  8. Era independiente (o usar estados.json con color)
```

---

## Cómo dibujar en geojson.io paso a paso

1. Ir a **geojson.io**
2. El mapa base ya tiene referencias geográficas (ríos, costas, ciudades)
3. Usar la herramienta **Polygon** (ícono de pentágono en la barra izquierda)
4. Hacer click en los vértices del polígono siguiendo el mapa de referencia en otra pestaña
5. Cerrar el polígono haciendo doble click en el último punto
6. En el panel derecho aparece el JSON — editar `properties` para agregar `id`, `name`, `era`
7. Para `MultiPolygon`: dibujar el segundo polígono por separado y luego editar el JSON manualmente para combinarlos
8. Cuando termines todas las zonas de una era, copiar todo el JSON del panel derecho
9. Guardarlo en el archivo `.json` correspondiente

### Tips
- Usa Ctrl+Z para deshacer un punto mal puesto
- El río Lerma-Santiago es una buena referencia para separar mexicas de purépechas
- La Sierra Madre del Sur separa la costa de Guerrero del altiplano
- La Península de Yucatán es fácil de identificar visualmente

---

## Validación antes de pasar a código

Antes de dar los archivos al agente para implementar, verifica:

- [ ] Cada `id` en los GeoJSON coincide exactamente con el `id` en `map-data.json`
- [ ] No hay polígonos que se superpongan significativamente (algo de overlap en fronteras está bien)
- [ ] El `FeatureCollection` es JSON válido (pegarlo en jsonlint.com)
- [ ] Cada zona tiene al menos `id`, `name` y `era` en `properties`
- [ ] Los archivos van en `app/public/geo/` con los nombres exactos referenciados en `map-data.json`

---

*Generado: Feb 2026 — Donde BTC MX*
