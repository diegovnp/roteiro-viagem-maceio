import { ChevronLeft, ChevronRight } from 'lucide-react';
import { days } from '../../data/itinerary';
import { dayMonth, longDate } from '../../utils/dates';
import { BoatIcon, PalmIcon, ShellIcon, SunIcon } from '../Decor/Decor';
import './RouteTrail.css';

interface Props {
  activeIndex: number;
  onSelect: (index: number) => void;
  visited: number[];
  todayIndex: number;
}

const N = days.length;
/** Posição de cada parada na trilha (em % da largura/altura). */
const stops = days.map((_, i) => ({
  x: 4 + (i * 92) / (N - 1),
  y: 50 + Math.sin(i * 1.15 + 0.4) * 22,
}));

/** Curva suave (Catmull-Rom → Bézier) passando pelas paradas. */
function trailPath(): string {
  const p = stops.map((s) => [s.x * 10, s.y]);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const PATH = trailPath();

/**
 * Trilha ilustrada (desktop): uma rota ondulada com as 8 paradas.
 * O barquinho navega até o dia selecionado e o trecho percorrido fica colorido.
 */
export function RouteTrail({ activeIndex, onSelect, visited, todayIndex }: Props) {
  const progress = (activeIndex / (N - 1)) * 100;
  const pos = stops[activeIndex];

  return (
    <nav className="trail" aria-label="Dias da viagem">
      <button
        type="button"
        className="trail__arrow"
        onClick={() => onSelect(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Dia anterior"
      >
        <ChevronLeft size={26} aria-hidden="true" />
      </button>

      <div className="trail__track">
        <SunIcon className="trail__deco trail__deco--sun deco" />
        <PalmIcon className="trail__deco trail__deco--palm deco" />
        <ShellIcon className="trail__deco trail__deco--shell deco" />

        <svg className="trail__svg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={PATH} className="trail__line" />
          <path d={PATH} className="trail__done" pathLength={100} style={{ strokeDasharray: `${progress} 100` }} />
        </svg>

        <span
          className={`trail__boat ${pos.y >= 50 ? 'is-below' : ''}`}
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          aria-hidden="true"
        >
          <BoatIcon />
        </span>

        <ol className="trail__stops">
          {days.map((d, i) => {
            const isActive = i === activeIndex;
            const s = stops[i];
            return (
              <li key={d.number} style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                <button
                  type="button"
                  className={`trail__stop ${isActive ? 'is-active' : ''} ${visited.includes(d.number) ? 'is-visited' : ''} ${
                    s.y < 50 ? 'label-below' : 'label-above'
                  }`}
                  onClick={() => onSelect(i)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Dia ${d.number}, ${d.weekday}, ${longDate(d.date)}: ${d.title}${i === todayIndex ? ' (hoje)' : ''}`}
                >
                  <span className="trail__dot">{d.number}</span>
                  <span className="trail__text">
                    <span className="trail__date">
                      {d.weekdayShort} · {dayMonth(d.date)}
                      {i === todayIndex && <em> · hoje</em>}
                    </span>
                    <span className="trail__short">{d.short}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <button
        type="button"
        className="trail__arrow"
        onClick={() => onSelect(activeIndex + 1)}
        disabled={activeIndex === N - 1}
        aria-label="Próximo dia"
      >
        <ChevronRight size={26} aria-hidden="true" />
      </button>
    </nav>
  );
}
