import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Fuentes y Bibliografía — CuantoBTC",
  description:
    "Fuentes académicas, institucionales y primarias consultadas para el mapa interactivo de la Historia del Dinero en México.",
};

// ─── Raw bibliography data ────────────────────────────────────────────────────
// Parsed from BIBLIOGRAFIA-HISTORIA-DINERO-MX.md

const SECTIONS = [
  {
    era: "Era 1",
    title: "Mesoamérica Prehispánica (~1200–1521 d.C.)",
    color: "#D97706",
    subsections: [
      {
        heading: "Fuentes primarias coloniales",
        sources: [
          {
            n: 1,
            text: 'Durán, Fray Diego. <em>Historia de las Indias de Nueva España e Islas de Tierra Firme</em> (siglo XVI). Fuente primaria para precios de esclavos en mantas de algodón (quachtli), plumas y joyas entre los mexicas.',
            url: null,
          },
          {
            n: 2,
            text: 'Clavijero, Francisco Javier. <em>Historia Antigua de México</em> (1780). Documenta las variedades de cacao usadas como moneda vs. las usadas como bebida.',
            url: null,
          },
        ],
      },
      {
        heading: "Artículos y publicaciones académicas",
        sources: [
          { n: 3, text: '"El cacao como dinero." <em>Arqueología Mexicana</em>.', url: "https://arqueologiamexicana.mx/mexico-antiguo/el-cacao-como-dinero" },
          { n: 4, text: '"Los medios de intercambio en la época prehispánica y la Colonia." <em>Arqueología Mexicana</em>.', url: "https://arqueologiamexicana.mx/mexico-antiguo/los-medios-de-intercambio-en-la-epoca-prehispanica-y-la-colonia" },
          { n: 5, text: '"El tipo de dinero que usaron los mexicas bajo el dominio español." <em>Arqueología Mexicana</em>.', url: "https://arqueologiamexicana.mx/mexico-antiguo/el-tipo-de-dinero-que-usaron-los-mexicas-bajo-el-dominio-espanol" },
          { n: 6, text: '"Economía mexica." <em>Portal Académico CCH, UNAM</em>.', url: "https://e1.portalacademico.cch.unam.mx/alumno/historiademexico1/unidad2/culturamexica/economia" },
          { n: 7, text: '"Intercambio y circulación. Comercio y tributo del oro." <em>Arqueología Mexicana</em>.', url: "https://arqueologiamexicana.mx/mexico-antiguo/intercambio-y-circulacion-comercio-y-tributo-del-oro" },
          { n: 8, text: '"La moneda de cobre en las sociedades mesoamericanas." <em>SciELO México</em>, 2021.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1607-050X2021000200096" },
          { n: 9, text: '"La Moneda de Cobre en Sociedades Mesoamericanas." <em>Academia.edu</em>.', url: "https://www.academia.edu/49253449/La_Moneda_de_Cobre_en_Sociedades_Mesoamericanas" },
          { n: 10, text: '"El quetzal, el ave sagrada de mayas y aztecas." <em>National Geographic Historia</em>.', url: "https://historia.nationalgeographic.com.es/a/quetzal-ave-sagrada-mayas-aztecas_13337" },
          { n: 11, text: '"El Quetzal, de dios maya a mascota." <em>UNAM Global</em>.', url: "https://unamglobal.unam.mx/global_revista/el-quetzal-epifania-de-la-libertad-en-peligro-de-extincion/" },
          { n: 12, text: '"Paquimé, la ciudad de las guacamayas." <em>México Desconocido</em>.', url: "https://www.mexicodesconocido.com.mx/paquime-la-ciudad-de-las-guacamayas.html" },
          { n: 13, text: '"Archaeological Zone of Paquimé, Casas Grandes." <em>UNESCO World Heritage Centre</em>.', url: "https://whc.unesco.org/en/list/560/" },
          { n: 14, text: '"Paquimé." <em>INAH Chihuahua</em>.', url: "http://www.inahchihuahua.gob.mx/sections.pl?id=43" },
          { n: 15, text: '"Casas Grandes." <em>World History Encyclopedia</em>.', url: "https://www.worldhistory.org/Casas_Grandes/" },
          { n: 16, text: '"Las culturas zapoteca y mixteca en Oaxaca." <em>México Histórico</em>.', url: "https://www.mexicohistorico.com/paginas/Las-culturas-zapoteca-y-mixteca-en-Oaxaca.html" },
          { n: 17, text: '"De los zapotecos a los mixtecos: El pasado mesoamericano de Monte Albán." <em>SEP Nueva Escuela Mexicana</em>.', url: "https://nuevaescuelamexicana.sep.gob.mx/contenido/coleccion/de-los-zapotecos-a-los-mixtecos-el-pasado-mesoamericano-de-monte-alban/" },
          { n: 18, text: '"P\'urhépechas — Etnografía." <em>Atlas de los Pueblos Indígenas de México, INPI</em>.', url: "http://atlas.inpi.gob.mx/purhepecha-etnografia/" },
          { n: 19, text: '"El dinero más sabroso: El uso del cacao como medio de pago." <em>Blog Numismático</em>, 2021.', url: "https://blognumismatico.com/2021/01/22/el-dinero-mas-sabroso-el-uso-del-cacao-como-medio-de-pago/" },
          { n: 20, text: '"Los aztecas y el uso del cacao como moneda." <em>Banco Central de la República Argentina (BCRA)</em>.', url: "https://www.bcra.gob.ar/Pdfs/BCRAyVos/Cuadernillo_Cacao.pdf" },
        ],
      },
      {
        heading: "Enciclopedias y referencias generales",
        sources: [
          { n: 21, text: '"Paquimé." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Paquim%C3%A9" },
          { n: 22, text: '"Pueblo purépecha." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Pueblo_pur%C3%A9pecha" },
        ],
      },
    ],
  },
  {
    era: "Era 2",
    title: "Nueva España (1521–1821)",
    color: "#7C3AED",
    subsections: [
      {
        heading: "Plata y el Real de a Ocho",
        sources: [
          { n: 23, text: 'Marichal, Carlos. "El peso de plata hispanoamericano como moneda universal." <em>El Colegio de México</em>.', url: "https://carlosmarichal.colmex.mx/pdfs/peso-plata.pdf" },
          { n: 24, text: '"Consideraciones sobre el comercio y el papel de la plata hispanoamericana en la temprana globalización, siglos XVI-XIX." <em>SciELO México</em>, 2018.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S2448-65312018000300197" },
          { n: 25, text: '"La Nueva España, protagonista de la primera globalización económica de la historia." <em>UNAM Global</em>.', url: "https://unamglobal.unam.mx/global_revista/la-nueva-espana-protagonista-de-la-primera-globalizacion-economica-de-la-historia/" },
          { n: 26, text: '"Spanish dollar." <em>Wikipedia</em>.', url: "https://en.wikipedia.org/wiki/Spanish_dollar" },
          { n: 27, text: '"Dollar sign." <em>Wikipedia</em>.', url: "https://en.wikipedia.org/wiki/Dollar_sign" },
          { n: 28, text: '"La Economía del México Virreinal: Motor y Eje de la Nueva España." <em>Instituto Cultural Helénico</em>.', url: "https://helenico.edu.mx/la-economia-del-mexico-virreinal-motor-y-eje-de-la-nueva-espana/" },
        ],
      },
      {
        heading: "Comercio colonial y sistema de flotas",
        sources: [
          { n: 29, text: '"Flotas, Control del Comercio y Consulado de Comerciantes." <em>Lifeder</em>.', url: "https://www.lifeder.com/flotas-control-comercio-consulado-comerciantes-nueva-espana/" },
          { n: 30, text: '"Las flotas, el control del comercio y el Consulado de Comerciantes." <em>SEP Nueva Escuela Mexicana</em>.', url: "https://nuevaescuelamexicana.sep.gob.mx/contenido/coleccion/las-flotas-el-control-del-comercio-y-el-consulado-de-comerciantes-2/" },
          { n: 31, text: '"Reformas en Nueva España: Reformas Borbónicas." <em>Historia Mexicana</em>.', url: "https://lahistoriamexicana.mx/virreinato/reformas-nueva-espana-reformas-borbonicas" },
          { n: 32, text: '"Intendencia de Guadalajara." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Intendencia_de_Guadalajara" },
        ],
      },
      {
        heading: "Grana cochinilla",
        sources: [
          { n: 33, text: '"La grana cochinilla de México se exporta al mundo. Siglo XVI." <em>Arqueología Mexicana</em>.', url: "https://arqueologiamexicana.mx/mexico-antiguo/la-grana-cochinilla-de-mexico-se-exporta-al-mundo-siglo-xvi" },
          { n: 34, text: '"Oaxaca: geografía histórica de la Grana Cochinilla." <em>SciELO México</em>.', url: "https://www.scielo.org.mx/pdf/igeo/n36/n36a7.pdf" },
          { n: 35, text: '"La grana cochinilla, un colorante prehispánico muy actual." <em>UNAM Global</em>.', url: "https://unamglobal.unam.mx/global_revista/grana-cochinilla-colorante-prehispanico-actual/" },
          { n: 36, text: '"Historia de Oaxaca: La Edad de Oro Rojo de Oaxaca (Grana Cochinilla)." <em>Vive Oaxaca</em>.', url: "https://www.viveoaxaca.org/2018/11/GranaHistoria.html" },
          { n: 37, text: '"Mercados globales de la América española: el comercio de lana vicuña y grana cochinilla en el siglo XVIII." <em>SciELO México</em>, 2016.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-22532016000100184" },
          { n: 38, text: '"Evolución de la producción y el comercio de la grana cochinilla." <em>Revista de Indias, CSIC</em>.', url: "https://revistadeindias.revistas.csic.es/index.php/revistadeindias/article/download/346/408/825" },
        ],
      },
    ],
  },
  {
    era: "Era 3",
    title: "México Independiente y Porfiriato (1821–1910)",
    color: "#B45309",
    subsections: [
      {
        heading: "Casas de moneda y caos monetario",
        sources: [
          { n: 39, text: '"Las casas de moneda foráneas, 1810-1905." <em>Estudios Históricos, INAH</em>.', url: "https://www.estudioshistoricos.inah.gob.mx/revistaHistorias/wp-content/uploads/historias_71_61-86.pdf" },
          { n: 40, text: '"Un Recorrido por las Casas de Moneda de México y sus Monedas." <em>Cenumex</em>.', url: "https://cenumex.com/un-recuento-de-las-casas-de-moneda-de-mexico-y-sus-monedas/" },
          { n: 41, text: '"El comienzo de las Casas de Moneda Provisionales." <em>El Dato Numismático</em>.', url: "https://eldatonumismatico.com/el-comienzo-de-las-casas-de-moneda-provisionales/" },
          { n: 42, text: '"Casa de Moneda de México." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Casa_de_Moneda_de_M%C3%A9xico" },
          { n: 43, text: '"Historia numismática de México." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Historia_numism%C3%A1tica_de_M%C3%A9xico" },
          { n: 44, text: '"Historia de la moneda y del billete en México." <em>Banco de México / Periódico Oficial de Jalisco</em>, febrero 2018.', url: "https://apiperiodico.jalisco.gob.mx/api/sites/periodicooficial.jalisco.gob.mx/files/historia_de_la_moneda_y_del_billete_en_mexico-_banco_de_mexico.pdf" },
          { n: 45, text: '"El día que Guanajuato tuvo su propio Banco y fabricó sus billetes." <em>La Silla Rota</em>, 2021.', url: "https://lasillarota.com/guanajuato/reportajes/2021/11/28/el-dia-que-guanajuato-tuvo-su-propio-banco-fabrico-sus-billetes-360074.html" },
        ],
      },
      {
        heading: "Reforma monetaria de 1905",
        sources: [
          { n: 46, text: '"La reforma monetaria de 1905." <em>Boletín del Archivo General de la Nación</em>.', url: "https://bagn.archivos.gob.mx/index.php/legajos/article/download/322/315" },
          { n: 47, text: '"Patrón oro y estabilidad cambiaria en México, 1905-1910." <em>SciELO México</em>, 2009.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-22532009000200005" },
          { n: 48, text: '"La reforma monetaria limanturiana (1905)." <em>Relaciones, El Colegio de Michoacán</em>.', url: "https://sitios.colmich.edu.mx/relaciones25/index.php/numeros-anteriores/10-articulos/1054-articulo-68-67-la-reforma-monetaria-limanturiana-1905" },
          { n: 49, text: '"La reforma monetaria de 1905 y la flexibilización de los medios de pago en México." <em>Investigaciones de Historia Económica, Elsevier</em>, 2011.', url: "https://www.elsevier.es/es-revista-investigaciones-historia-economica-economic-328-articulo-la-reforma-monetaria-1905-flexibilizacion-S1698698911700054" },
          { n: 50, text: '"Mecanismos de control monetario en el Porfiriato (1892-1908)." <em>SciELO México</em>, 2025.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext_plus&pid=S2448-718X2025000400833" },
        ],
      },
      {
        heading: "Economía del Porfiriato y desigualdad regional",
        sources: [
          { n: 51, text: '"La política industrial del Porfiriato a la Revolución." <em>SciELO México</em>, 2020.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1665-952X2020000100165" },
          { n: 52, text: '"Empresarios y sociedades empresariales en el norte de México." <em>Raco.cat</em>.', url: "https://www.raco.cat/index.php/HistoriaIndustrial/article/download/62521/84832" },
          { n: 53, text: '"Propietarios, empresarios y empresa en el norte de México." <em>PUEDJS, UNAM</em>.', url: "https://puedjs.unam.mx/derechas_en_mexico/propietarios-empresarios-y-empresa-en-el-norte-de-mexico/" },
          { n: 54, text: '"Economía del Porfiriato." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Econom%C3%ADa_del_Porfiriato" },
          { n: 55, text: '"Industrialización, empresas y trabajadores industriales." <em>Repositorio, El Colegio de México</em>.', url: "https://repositorio.colmex.mx/downloads/jq085k66k?locale=es" },
        ],
      },
    ],
  },
  {
    era: "Era 4",
    title: "Siglo XX — Crisis y Devaluaciones (1929–2000)",
    color: "#DC2626",
    subsections: [
      {
        heading: "Devaluaciones e inflación",
        sources: [
          { n: 56, text: '"Devaluación del peso mexicano." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Devaluaci%C3%B3n_del_peso_mexicano" },
          { n: 57, text: '"A 40 años de devaluaciones, crisis recurrentes y desregulaciones." <em>SciELO México</em>, 2016.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0301-70362016000400003" },
          { n: 58, text: '"Las crisis económicas de México del 1976 y 1982." <em>Sincronía, Universidad de Guadalajara</em>.', url: "http://sincronia.cucsh.udg.mx/jimenezw06.htm" },
          { n: 59, text: '"La devaluación que ya llegó." <em>Coparmex</em>.', url: "https://coparmex.org.mx/la-devaluacion-que-ya-llego/" },
          { n: 60, text: '"Crisis económica en México de 1994." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Crisis_econ%C3%B3mica_en_M%C3%A9xico_de_1994" },
          { n: 61, text: '"Devaluaciones históricas del peso Mexicano." <em>Eumed.net</em>, 2017.', url: "https://www.eumed.net/cursecon/ecolat/mx/2017/devaluaciones-peso-mexico.html" },
          { n: 62, text: '"Miguel de la Madrid — La crisis de 1982."', url: "https://sexeniode1982a1983.home.blog/" },
        ],
      },
      {
        heading: "Salario mínimo y poder adquisitivo",
        sources: [
          { n: 63, text: '"Salario mínimo en México, 1935-2021, poder adquisitivo de acuerdo a la inflación." <em>MexicoMaxico.org</em>.', url: "http://www.mexicomaxico.org/Voto/SalMinInf.htm" },
          { n: 64, text: '"Devaluación vs. Inflación, México." <em>MexicoMaxico.org</em>.', url: "http://www.mexicomaxico.org/Voto/DevInf.htm" },
          { n: 65, text: '"Inflación México, INPC e inflación anualizada, 1886-2022." <em>MexicoMaxico.org</em>.', url: "http://www.mexicomaxico.org/Voto/InflacionMexico.htm" },
          { n: 66, text: '"Salario mínimo e inflación en México. Un análisis desde la inflación de costos." <em>SciELO México</em>, 2024.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S2448-66552024000100029" },
        ],
      },
      {
        heading: "Petróleo y estados petroleros",
        sources: [
          { n: 67, text: '"Petróleo y crecimiento económico en México 1938-2006." <em>SciELO México</em>, 2008.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1665-952X2008000300004" },
          { n: 68, text: '"Expropiación del petróleo en México." <em>Wikipedia, la enciclopedia libre</em>.', url: "https://es.wikipedia.org/wiki/Expropiaci%C3%B3n_del_petr%C3%B3leo_en_M%C3%A9xico" },
          { n: 69, text: '"Expropiación petrolera: el giro histórico de 1938." <em>UNAM Global</em>.', url: "https://unamglobal.unam.mx/global_revista/expropiacion-petrolera-el-giro-historico-de-1938/" },
          { n: 70, text: '"El impacto de la industria petrolera en Veracruz." <em>México Histórico</em>.', url: "https://www.mexicohistorico.com/paginas/El-impacto-de-la-industria-petrolera-en-Veracruz.html" },
          { n: 71, text: '"Aniversario de la Expropiación Petrolera." <em>CNDH México</em>.', url: "https://www.cndh.org.mx/noticia/aniversario-de-la-expropiacion-petrolera" },
        ],
      },
      {
        heading: "Migración y remesas",
        sources: [
          { n: 72, text: '"El proceso de asentamiento de la migración México-Estados Unidos." <em>SciELO México</em>, 2011.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-74252011000200008" },
          { n: 73, text: '"Migración México/Estados Unidos en la década de crisis." <em>SciELO México</em>, 2014.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1607-050X2014000300001" },
          { n: 74, text: '"Panorama de la migración en México." <em>SEGOB, Política Migratoria</em>.', url: "https://portales.segob.gob.mx/es/PoliticaMigratoria/Panorama_de_la_migracion_en_Mexico" },
          { n: 75, text: '"Éxodo laboral de mexicanos en el entorno del Programa Bracero." <em>SciELO México</em>, 2022.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1665-44202022000200384" },
          { n: 76, text: '"Migración entre México y Estados Unidos: historia, problemáticas, teorías." <em>SciELO México</em>, 2012.', url: "https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1870-35502012000100009" },
        ],
      },
      {
        heading: "Pobreza, desigualdad y empresariado",
        sources: [
          { n: 77, text: '"Concentra pobreza población indígena y rural; Economía Social, vía para superarla." <em>Frente a la Pobreza</em>.', url: "https://www.frentealapobreza.mx/post/com-2512" },
          { n: 78, text: '"Más de 40 años después, México aún vive los estragos del sexenio de José López Portillo." <em>El Imparcial</em>, 2025.', url: "https://www.elimparcial.com/mexico/2025/12/02/mas-de-40-anos-despues-mexico-aun-vive-los-estragos-del-sexenio-de-jose-lopez-portillo/" },
          { n: 79, text: '"¿Bajo cuál gobierno presidencial subió más la inflación en México?" <em>El Imparcial</em>, 2025.', url: "https://www.elimparcial.com/mexico/2025/12/18/bajo-el-gobierno-de-que-presidente-subio-mas-la-inflacion-en-mexico/" },
        ],
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FuentesPage() {
  const totalSources = SECTIONS.reduce(
    (acc, s) => acc + s.subsections.reduce((a, sub) => a + sub.sources.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-[860px] px-4 md:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/mapa"
            className="mb-6 inline-flex items-center gap-1.5 font-ui-mono text-[11px] text-[var(--fg-faint)] hover:text-[#F7931A] transition-colors"
          >
            ← Volver al mapa
          </Link>

          <div className="flex items-center gap-2.5 font-ui-mono text-[10px] font-medium tracking-[0.2em] text-[var(--fg-muted)] mb-4">
            <span className="h-px w-6 bg-[#F7931A]" />
            BIBLIOGRAFÍA
          </div>

          <h1 className="text-[36px] md:text-[48px] font-black tracking-tight text-[var(--fg)] leading-[0.96] mb-4">
            Fuentes y<br />Referencias
          </h1>
          <p className="text-[15px] text-[var(--fg-muted)] leading-relaxed max-w-[560px]">
            Fuentes académicas, institucionales y primarias consultadas y verificadas para el contenido
            del mapa interactivo de la Historia del Dinero en México.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 font-ui-mono text-[11px] text-[var(--fg-faint)]">
            <span><span className="font-bold text-[var(--fg-dim)]">{totalSources}</span> fuentes consultadas</span>
            <span className="h-3 w-px bg-[var(--border-2)]" />
            <span>Fecha de consulta: <span className="font-bold text-[var(--fg-dim)]">28 de febrero de 2026</span></span>
            <span className="h-3 w-px bg-[var(--border-2)]" />
            <span>Prioridad: UNAM · INAH · Banxico · SciELO México</span>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-12">
          {SECTIONS.map((section) => (
            <div key={section.era}>
              {/* Era header */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 font-ui-mono text-[10px] font-bold"
                  style={{ background: `${section.color}20`, color: section.color }}
                >
                  {section.era}
                </span>
                <h2 className="text-[18px] md:text-[20px] font-black tracking-tight text-[var(--fg)]">
                  {section.title}
                </h2>
              </div>

              <div className="flex flex-col gap-8">
                {section.subsections.map((sub) => (
                  <div key={sub.heading}>
                    <h3 className="font-ui-mono text-[10px] font-bold tracking-[0.15em] text-[var(--fg-muted)] mb-3 uppercase">
                      {sub.heading}
                    </h3>
                    <div className="flex flex-col gap-0">
                      {sub.sources.map((source, idx) => (
                        <div
                          key={source.n}
                          className={`flex gap-4 py-3 ${
                            idx < sub.sources.length - 1
                              ? "border-b border-[var(--border)]"
                              : ""
                          }`}
                        >
                          <span className="shrink-0 font-ui-mono text-[11px] font-bold text-[var(--fg-faint)] w-7 text-right mt-0.5">
                            {source.n}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] leading-relaxed text-[var(--fg-muted)]"
                              dangerouslySetInnerHTML={{ __html: source.text }}
                            />
                            {source.url && (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block font-ui-mono text-[10px] text-[var(--fg-faint)] hover:text-[#F7931A] transition-colors break-all"
                              >
                                {source.url}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Methodological notes */}
        <div className="mt-14 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
          <h3 className="font-ui-mono text-[10px] font-bold tracking-[0.15em] text-[var(--fg-muted)] mb-4 uppercase">
            Notas metodológicas
          </h3>
          <ul className="flex flex-col gap-2.5">
            {[
              "Todas las URLs fueron consultadas el 28 de febrero de 2026.",
              "Los datos con confianza alta fueron verificados en al menos dos fuentes independientes.",
              "Los datos con confianza media tienen respaldo académico pero con matices o debates abiertos.",
              "Se priorizaron fuentes institucionales mexicanas (UNAM, INAH, Banxico, SciELO México, Arqueología Mexicana, SEP) sobre fuentes secundarias.",
              "Las fuentes primarias coloniales (Durán, Clavijero) se citan de forma indirecta a través de publicaciones académicas que las analizan.",
            ].map((note, i) => (
              <li key={i} className="flex gap-3 text-[13px] text-[var(--fg-muted)] leading-relaxed">
                <span className="shrink-0 text-[#F7931A] mt-0.5">·</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center font-ui-mono text-[11px] text-[var(--fg-faint)]">
          CuantoBTC — hecho en México ₿
        </p>
      </main>

      {/* keep room for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
