/**
 * Contorno ESQUEMÁTICO do litoral de Alagoas, de norte a sul
 * (pares [latitude, longitude] aproximados). Serve apenas para dar
 * contexto visual ao mapa ilustrado — não tem precisão cartográfica.
 */
export const coastline: [number, number][] = [
  [-8.86, -35.135],
  [-8.93, -35.16],
  [-8.975, -35.19],
  [-9.012, -35.217],
  [-9.04, -35.234],
  [-9.074, -35.255],
  [-9.128, -35.279],
  [-9.169, -35.296],
  [-9.205, -35.322],
  [-9.239, -35.345],
  [-9.27, -35.367],
  [-9.305, -35.404],
  [-9.36, -35.45],
  [-9.42, -35.5],
  [-9.48, -35.55],
  [-9.53, -35.59],
  [-9.57, -35.634],
  [-9.61, -35.67],
  [-9.64, -35.686],
  [-9.661, -35.69],
  [-9.669, -35.703],
  [-9.673, -35.718],
  [-9.682, -35.735],
  [-9.7, -35.765],
  [-9.735, -35.805],
  [-9.775, -35.833],
  [-9.81, -35.868],
  [-9.84, -35.89],
  [-9.862, -35.92],
  [-9.9, -35.965],
  [-9.96, -36.03],
];

/** Limites da área desenhada (latitude/longitude). */
export const mapBounds = {
  north: -8.86,
  south: -9.96,
  west: -36.05,
  east: -35.05,
};
