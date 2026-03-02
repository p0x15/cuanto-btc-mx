export interface Era {
  id: string;
  label: string;
  year: string;
  geoFile: string;
  description: string;
  moneda: string;
  color_scheme: string;
}

export interface BitcoinParalelo {
  caso_uso: string;
  descripcion: string;
  ahorro_comision?: string;
  apps_recomendadas?: string[];
}

export interface ZoneEntry {
  id: string;
  name: string;
  capital?: string;
  color?: string;
  /** Present in placeholder mode — list of MX-XXX state IDs this zone covers */
  estados_actuales?: string[];
  dinero: {
    medio: string;
    descripcion: string;
    dato_curioso?: string;
  };
  bitcoin_paralelo: string | BitcoinParalelo;
  // eras 4-5
  bancarizacion?: number;
  remesas_usd_millones?: number;
  remesas_rank?: number;
  crisis_afectadas?: string[];
}

export interface MapData {
  eras: Era[];
  zones: Record<string, ZoneEntry[]>;
  bancarizacion_nacional: {
    promedio: number;
    fuente: string;
    estados: Record<string, number>;
  };
  remesas_2024: {
    total_usd_millones: number;
    fuente: string;
    estados: Record<string, number>;
  };
}

export interface GeoFeatureProperties {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  [key: string]: unknown;
}

export interface GeoFeature {
  type: "Feature";
  id?: string | number;
  properties: GeoFeatureProperties;
  geometry: unknown;
}

export interface GeoData {
  type: "FeatureCollection";
  features: GeoFeature[];
}
