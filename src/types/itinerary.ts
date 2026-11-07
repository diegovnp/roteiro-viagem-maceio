/**
 * Tipos do roteiro. Os dados ficam em `src/data/itinerary.ts`
 * e os créditos/arquivos das fotos em `src/data/photos.ts`.
 */

/** Tipo de atividade — define o ícone exibido no card. */
export type ActivityKind =
  | 'flight'
  | 'car'
  | 'beach'
  | 'boat'
  | 'food'
  | 'hotel'
  | 'walk'
  | 'tour'
  | 'viewpoint'
  | 'quad'
  | 'city'
  | 'sunset'
  | 'tide';

/** Foto otimizada servida a partir de `public/images`. */
export interface Photo {
  id: string;
  /** Texto alternativo (acessibilidade). */
  alt: string;
  /** Larguras disponíveis em `public/images/<id>-<largura>.webp` (ou miniaturas remotas). */
  widths: number[];
  /**
   * Quando presente, a foto é servida pelas miniaturas oficiais do Wikimedia Commons
   * (`<base>/<largura>px-<file>`) em vez de `public/images`. Rode `npm run images`
   * para baixá-la e otimizá-la localmente.
   */
  remote?: { base: string; file: string };
  /** Proporção original (largura / altura) — evita saltos de layout. */
  ratio: number;
  /** Cor média, usada como fundo enquanto a imagem carrega. */
  color: string;
  /** Posição de enquadramento (CSS object-position). */
  focus?: string;
  credit: {
    author: string;
    license: string;
    licenseUrl?: string;
    /** Página do arquivo no Wikimedia Commons. */
    source: string;
  };
}

export interface Place {
  id: string;
  name: string;
  /** Município / região, para contexto. */
  area: string;
  /** Texto usado na busca do Google Maps. */
  mapsQuery: string;
  /** Posição aproximada [latitude, longitude] — usada apenas no mapa esquemático. */
  coords: [number, number];
  photo?: string;
}

export interface Activity {
  id: string;
  kind: ActivityKind;
  title: string;
  /** Somente quando o horário foi informado no roteiro. */
  time?: string;
  /** Duração aproximada, somente quando informada. */
  duration?: string;
  description?: string;
  placeId?: string;
  /** Condição do roteiro original: "se houver tempo", "se estiver favorável"... */
  condition?: string;
}

export interface Tide {
  label: string;
  height: string;
  time: string;
  note?: string;
}

export interface Day {
  /** 1 a 8 */
  number: number;
  /** ISO yyyy-mm-dd */
  date: string;
  weekday: string;
  weekdayShort: string;
  title: string;
  /** Rótulo curto usado na roleta. */
  short: string;
  summary: string;
  cover: string;
  base?: string;
  tide?: Tide;
  activities: Activity[];
  tips: string[];
  /** Avisos de destaque (dia com várias paradas, dia substituível, retorno...). */
  flags?: {
    multiStop?: boolean;
    swappable?: boolean;
    returnOnly?: boolean;
  };
}
