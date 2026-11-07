import { useEffect, useMemo, useRef, useState } from 'react';
import { days } from '../../data/itinerary';
import { coastline } from '../../data/map';
import { places } from '../../data/places';
import { useMotion } from '../../hooks/useMotion';
import { fitViewBox, MAP_H, MAP_W, project, type ViewBox } from '../../utils/geo';
import './RouteMap.css';

interface Props {
  /** `overview`: litoral inteiro. `day`: aproxima nos locais do dia, numerados. */
  mode: 'overview' | 'day';
  /** Dia em destaque. */
  dayNumber?: number;
  /** Local em destaque (pulsa). */
  activePlaceId?: string | null;
  onPlaceClick?: (placeId: string) => void;
  className?: string;
  /** Proporção largura/altura do quadro. */
  aspect?: number;
}

/** Ids dos locais de um dia, na ordem do roteiro, sem repetição. */
export function placesOfDay(dayNumber: number): string[] {
  const day = days.find((d) => d.number === dayNumber);
  if (!day) return [];
  const ids: string[] = [];
  day.activities.forEach((a) => {
    if (a.placeId && !ids.includes(a.placeId)) ids.push(a.placeId);
  });
  return ids;
}

const OVERVIEW_LABELS: Record<string, 'left' | 'right'> = {
  maragogi: 'left',
  patacho: 'left',
  milagres: 'left',
  ipioca: 'left',
  maceio: 'left',
  aeroporto: 'left',
  frances: 'left',
  barra: 'right',
  gunga: 'left',
};

const BASES = ['maragogi', 'maceio'];

export function RouteMap({ mode, dayNumber, activePlaceId, onPlaceClick, className = '', aspect = MAP_W / MAP_H }: Props) {
  const { reduced } = useMotion();

  const dayPlaces = useMemo(() => (dayNumber ? placesOfDay(dayNumber) : []), [dayNumber]);

  const target: ViewBox = useMemo(() => {
    if (mode === 'day' && dayPlaces.length) {
      return fitViewBox(
        dayPlaces.map((id) => project(places[id].coords)),
        aspect,
        110,
        0.45,
      );
    }
    // Visão geral: enquadra o litoral visitado (Maragogi → Gunga)
    return fitViewBox([project([-8.93, -35.15]), project([-9.9, -35.98])], aspect, 200, 0.06);
  }, [mode, dayPlaces, aspect]);

  // Transição suave do enquadramento (zoom) entre os dias
  const [vb, setVb] = useState<ViewBox>(target);
  const vbRef = useRef(vb);
  vbRef.current = vb;

  useEffect(() => {
    if (reduced) {
      setVb(target);
      return;
    }
    const from = vbRef.current;
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = ease(t);
      setVb({
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);

  const k = vb.w / MAP_W; // fator de escala para manter textos e marcadores legíveis

  const coastPts = coastline.map(project);
  const coastPath = coastPts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const landPath = `M-200 -200 L${coastPts[0][0]} -200 ${coastPath.replace('M', 'L')} L${coastPts[coastPts.length - 1][0]} ${MAP_H + 200} L-200 ${MAP_H + 200} Z`;

  const toPath = (ids: string[]) =>
    ids
      .map((id, i) => {
        const [x, y] = project(places[id].coords);
        return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

  // Visão geral: um trecho por dia (o dia selecionado em destaque). Dia: só o trecho dele.
  const segments = useMemo(
    () =>
      (mode === 'overview' ? days.map((d) => d.number) : dayNumber ? [dayNumber] : [])
        .map((n) => ({ n, ids: placesOfDay(n) }))
        .filter((seg) => seg.ids.length > 1),
    [mode, dayNumber],
  );
  const activeSegment = segments.find((seg) => seg.n === dayNumber);

  const allIds = Object.keys(places);
  const visibleIds = mode === 'overview' ? allIds : dayPlaces;
  const routeId = `route-${mode}-${dayNumber ?? 0}`;

  return (
    <div
      className={`route-map route-map--${mode} ${className}`}
      style={{ ['--map-aspect' as string]: String(aspect) }}
    >
      <svg
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        role="img"
        aria-label={
          mode === 'overview'
            ? 'Mapa esquemático do litoral de Alagoas com os destinos da viagem, de Maragogi ao Gunga'
            : `Mapa esquemático com os locais do dia ${dayNumber}, numerados na ordem do roteiro`
        }
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#bdeee8" />
            <stop offset="1" stopColor="#7fd6d0" />
          </linearGradient>
          <pattern id="sea-lines" width="60" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 12c10-6 20-6 30 0s20 6 30 0" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
          </pattern>
          <pattern id="land-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#d8c294" />
          </pattern>
        </defs>

        <rect x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} fill="url(#sea)" />
        <rect x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} fill="url(#sea-lines)" />
        <path d={landPath} fill="#f6ead2" />
        <path d={landPath} fill="url(#land-dots)" opacity=".7" />
        <path d={coastPath} fill="none" stroke="#fff" strokeWidth={6 * k} strokeLinejoin="round" opacity=".8" />
        <path d={coastPath} fill="none" stroke="#e2c995" strokeWidth={1.6 * k} strokeLinejoin="round" />

        {mode === 'overview' && (
          <g className="route-map__geo-labels" aria-hidden="true">
            <text x={170} y={420} fontSize={34} letterSpacing={12}>
              ALAGOAS
            </text>
            <text x={600} y={800} fontSize={24} letterSpacing={6} className="route-map__sea-label">
              OCEANO ATLÂNTICO
            </text>
          </g>
        )}

        {/* Linha pontilhada: ORDEM das visitas, não o traçado real das estradas */}
        {segments.map((seg) => (
          <path
            key={seg.n}
            id={`${routeId}-${seg.n}`}
            d={toPath(seg.ids)}
            className={`route-map__route ${seg.n === dayNumber ? 'is-active' : ''}`}
            strokeWidth={(seg.n === dayNumber ? 3.2 : 2.2) * k}
            strokeDasharray={`${2 * k} ${(seg.n === dayNumber ? 8 : 7) * k}`}
            style={{ ['--period' as string]: String(10 * k) }}
          />
        ))}

        {!reduced && activeSegment && (
          <g className="route-map__car deco" aria-hidden="true" key={`car-${activeSegment.n}`}>
            <circle r={11 * k} fill="var(--coral-500)" stroke="#fff" strokeWidth={3 * k} />
            <path d="M-5 1h10l-1.5-4h-7zM-6 1h12v3h-12z" fill="#fff" transform={`scale(${k})`} />
            <animateMotion dur={`${Math.max(5, activeSegment.ids.length * 2.2)}s`} repeatCount="indefinite" rotate="0">
              <mpath href={`#${routeId}-${activeSegment.n}`} />
            </animateMotion>
          </g>
        )}

        {visibleIds.map((id) => {
          const place = places[id];
          const [x, y] = project(place.coords);
          const inDay = dayNumber ? placesOfDay(dayNumber).includes(id) : false;
          const isActive = activePlaceId === id;
          const isBase = BASES.includes(id);
          const stepIndex = mode === 'day' ? dayPlaces.indexOf(id) : -1;
          const label = mode === 'overview' ? OVERVIEW_LABELS[id] : undefined;
          const r = (mode === 'day' ? 15 : isBase ? 10 : 6.5) * k * (isActive ? 1.25 : 1);
          const cls = [
            'route-map__pin',
            inDay && 'is-in-day',
            isActive && 'is-active',
            isBase && 'is-base',
            mode === 'overview' && dayNumber && !inDay && 'is-dim',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <g
              key={id}
              className={cls}
              transform={`translate(${x} ${y})`}
              onClick={onPlaceClick ? () => onPlaceClick(id) : undefined}
              role={onPlaceClick ? 'button' : undefined}
              tabIndex={onPlaceClick ? 0 : undefined}
              aria-label={onPlaceClick ? `${stepIndex >= 0 ? `${stepIndex + 1}. ` : ''}${place.name}` : undefined}
              onKeyDown={
                onPlaceClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onPlaceClick(id);
                      }
                    }
                  : undefined
              }
            >
              <title>{place.name}</title>
              {isActive && <circle className="route-map__pulse" r={r} />}
              <circle r={r} className="route-map__dot" strokeWidth={2.5 * k} />
              {stepIndex >= 0 && (
                <text className="route-map__num" fontSize={15 * k} dy={5.2 * k} textAnchor="middle">
                  {stepIndex + 1}
                </text>
              )}
              {label && (
                <text
                  className="route-map__label"
                  x={label === 'left' ? -r - 8 * k : r + 8 * k}
                  dy={5 * k}
                  fontSize={(isBase ? 21 : 17) * k}
                  textAnchor={label === 'left' ? 'end' : 'start'}
                >
                  {id === 'piscinas' ? 'Piscinas naturais' : id === 'maragogi' ? 'Maragogi' : place.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="route-map__note">
        Mapa esquemático · posições aproximadas · a linha indica a ordem das visitas, não o traçado das estradas
      </p>
    </div>
  );
}
