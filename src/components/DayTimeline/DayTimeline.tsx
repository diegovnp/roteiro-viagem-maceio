import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react';
import { days } from '../../data/itinerary';
import { useMotion } from '../../hooks/useMotion';
import { dayMonth, longDate } from '../../utils/dates';
import { CompassRose } from '../Decor/Decor';
import './DayTimeline.css';

interface Props {
  activeIndex: number;
  onSelect: (index: number) => void;
  visited: number[];
  todayIndex: number;
  hidden?: boolean;
}

/**
 * Roleta de dias (celular/tablet): trilha horizontal com rolagem por arraste
 * e "snap" no centro. Os marcadores se curvam como uma roda conforme se
 * afastam do centro. Arrastar seleciona o dia que para no centro; mudar o
 * dia por outros controles gira a roleta até ele.
 */
export function DayTimeline({ activeIndex, onSelect, visited, todayIndex, hidden }: Props) {
  const { reduced } = useMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const programmatic = useRef(false);
  const settleTimer = useRef<number>();
  const raf = useRef<number>();
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  /** Curvatura da roleta: cada marcador desce e gira conforme a distância do centro. */
  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const w = el.offsetWidth || 1;
      const d = (el.offsetLeft + w / 2 - center) / w;
      const ad = Math.min(Math.abs(d), 4);
      const y = ad * ad * 5;
      const rot = Math.max(-36, Math.min(36, d * 9));
      const scale = 1 - Math.min(ad * 0.07, 0.25);
      // A curvatura vai no elemento interno: transformar o próprio item deslocaria os pontos de "snap"
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      inner.style.transform = `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      inner.style.opacity = String(1 - Math.min(ad * 0.16, 0.6));
    });
  }, []);

  const nearestIndex = () => {
    const track = trackRef.current;
    if (!track) return activeRef.current;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  };

  const settle = () => {
    if (programmatic.current) {
      programmatic.current = false;
      return;
    }
    const i = nearestIndex();
    if (i !== activeRef.current) onSelect(i);
  };

  const onScroll = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(paint);
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 140);
  };

  const scrollToIndex = useCallback(
    (i: number, smooth: boolean) => {
      const track = trackRef.current;
      const el = itemRefs.current[i];
      if (!track || !el) return;
      const left = el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2;
      if (Math.abs(left - track.scrollLeft) < 2) {
        paint();
        return;
      }
      programmatic.current = true;
      track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
      if (!smooth) paint();
    },
    [paint],
  );

  // Gira a roleta até o dia ativo sempre que ele muda por qualquer controle
  useEffect(() => {
    scrollToIndex(activeIndex, !reduced);
  }, [activeIndex, reduced, scrollToIndex]);

  // Posição inicial e ajustes ao redimensionar
  useLayoutEffect(() => {
    scrollToIndex(activeRef.current, false);
    const onResize = () => scrollToIndex(activeRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [scrollToIndex]);

  useEffect(
    () => () => {
      window.clearTimeout(settleTimer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const userInteracting = () => {
    programmatic.current = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = Math.max(0, Math.min(days.length - 1, activeIndex + (e.key === 'ArrowRight' ? 1 : -1)));
      onSelect(next);
      requestAnimationFrame(() => itemRefs.current[next]?.focus({ preventScroll: true }));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : days.length - 1;
      onSelect(next);
      requestAnimationFrame(() => itemRefs.current[next]?.focus({ preventScroll: true }));
    }
  };

  const progress = ((activeIndex + 1) / days.length) * 100;

  return (
    <nav className={`dock ${hidden ? 'is-hidden' : ''}`} aria-label="Dias da viagem" aria-hidden={hidden || undefined}>
      <div className="dock__panel">
        <div className="dock__top">
          <span className="dock__counter">
            Dia <strong>{activeIndex + 1}</strong> de {days.length}
          </span>
          <span className="dock__progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </span>
          <span className="dock__seen">{visited.length}/8 vistos</span>
        </div>

        <div className="dock__row">
          <button
            type="button"
            className="dock__arrow"
            onClick={() => onSelect(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Dia anterior"
            tabIndex={hidden ? -1 : 0}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>

          <div className="wheel">
            <CompassRose
              className="wheel__compass deco"
              style={{ transform: `translateX(-50%) rotate(${activeIndex * -45}deg)` }}
            />
            <svg className="wheel__arc" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M-10 18 Q 200 66 410 18" />
            </svg>
            <span className="wheel__pin" aria-hidden="true">
              <svg viewBox="0 0 24 32">
                <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0Z" />
                <circle cx="12" cy="11.5" r="4.5" fill="#fff" />
              </svg>
            </span>

            <div
              className="wheel__track"
              ref={trackRef}
              onScroll={onScroll}
              onPointerDown={userInteracting}
              onTouchStart={userInteracting}
              onWheel={userInteracting}
              onKeyDown={onKeyDown}
            >
              {days.map((d, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={d.number}
                    ref={(el) => (itemRefs.current[i] = el)}
                    type="button"
                    className={`wheel__item ${isActive ? 'is-active' : ''} ${visited.includes(d.number) ? 'is-visited' : ''}`}
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Dia ${d.number}, ${d.weekday}, ${longDate(d.date)}: ${d.title}${i === todayIndex ? ' (hoje)' : ''}`}
                    tabIndex={hidden ? -1 : isActive ? 0 : -1}
                  >
                    <span className="wheel__inner">
                      <span className="wheel__bubble">
                        <span className="wheel__wd">{d.weekdayShort}</span>
                        <span className="wheel__date">{dayMonth(d.date)}</span>
                      </span>
                      <span className="wheel__label">{i === todayIndex ? 'Hoje' : d.short}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="dock__arrow"
            onClick={() => onSelect(activeIndex + 1)}
            disabled={activeIndex === days.length - 1}
            aria-label="Próximo dia"
            tabIndex={hidden ? -1 : 0}
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}
