import { mapBounds } from '../data/map';

/** Dimensões do sistema de coordenadas do mapa esquemático (unidades SVG). */
export const MAP_W = 900;
export const MAP_H = 1000;

/** Projeção equiretangular simples — suficiente para um mapa ilustrativo. */
export function project([lat, lng]: [number, number]): [number, number] {
  const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * MAP_W;
  const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * MAP_H;
  return [x, y];
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Enquadramento que contém todos os pontos, com margem e tamanho mínimo. */
export function fitViewBox(points: [number, number][], aspect: number, minW = 120, pad = 0.35): ViewBox {
  if (points.length === 0) return { x: 0, y: 0, w: MAP_W, h: MAP_H };
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  let w = maxX - minX;
  let h = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  w = Math.max(w * (1 + pad * 2), minW);
  h = Math.max(h * (1 + pad * 2), minW / aspect);
  if (w / h > aspect) h = w / aspect;
  else w = h * aspect;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
