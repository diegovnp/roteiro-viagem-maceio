import { Hand } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DayContent } from './components/DayContent/DayContent';
import { DayTimeline } from './components/DayTimeline/DayTimeline';
import { Favorites } from './components/Favorites/Favorites';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { QuickSummary } from './components/QuickSummary/QuickSummary';
import { RouteTrail } from './components/RouteTrail/RouteTrail';
import { Toast, type ToastMessage } from './components/Toast/Toast';
import { TripChecklist, totalChecklistItems, type ChecklistState } from './components/TripChecklist/TripChecklist';
import { TripOverview } from './components/TripOverview/TripOverview';
import { days, trip } from './data/itinerary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMediaQuery } from './hooks/useMediaQuery';
import { MotionContext } from './hooks/useMotion';
import { todayInMaceio } from './utils/dates';

const HERO_PHOTO = 'antunes';

type SheetName = 'checklist' | 'favorites' | 'summary' | null;

/** Lê "#dia-3" da URL → índice 2. */
function indexFromHash(): number | null {
  const m = window.location.hash.match(/^#dia-(\d)$/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= days.length ? n - 1 : null;
}

const EMPTY_CHECKLIST: ChecklistState = { checked: [], custom: [] };

export default function App() {
  const [index, setIndex] = useState(() => indexFromHash() ?? 0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [sheet, setSheet] = useState<SheetName>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [heroBottom, setHeroBottom] = useState(() => window.innerHeight);
  const [announce, setAnnounce] = useState('');

  const [visited, setVisited] = useLocalStorage<number[]>('roteiro-maceio:visitados', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('roteiro-maceio:favoritos', []);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('roteiro-maceio:notas', {});
  const [checklist, setChecklist] = useLocalStorage<ChecklistState>('roteiro-maceio:checklist', EMPTY_CHECKLIST);
  const [readingMode, setReadingMode] = useLocalStorage<boolean>('roteiro-maceio:modo-leitura', false);
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const reduced = readingMode || systemReduced;

  const indexRef = useRef(index);
  indexRef.current = index;
  const dayAnchorRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number>();

  const today = todayInMaceio();
  const todayIndex = days.findIndex((d) => d.date === today);

  // Modo leitura → atributo no <html> (desliga animações e decorações via CSS)
  useEffect(() => {
    document.documentElement.dataset.reading = readingMode ? 'on' : 'off';
  }, [readingMode]);

  // Posição do hero: define cabeçalho sólido e exibição da roleta
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = heroWrapRef.current;
      if (el) setHeroBottom(el.getBoundingClientRect().bottom);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const headerSolid = heroBottom < 160;
  const dockVisible = heroBottom < window.innerHeight * 0.45;

  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  /** Rola até o início do dia, se ele não estiver confortavelmente visível. */
  const revealDay = useCallback(
    (force = false) => {
      const el = dayAnchorRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const header = window.innerWidth >= 1024 ? 68 + 190 : 60;
      if (force || top < header || top > window.innerHeight * 0.55) {
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    },
    [reduced],
  );

  const goTo = useCallback(
    (next: number, opts: { scroll?: boolean } = {}) => {
      const clamped = Math.max(0, Math.min(days.length - 1, next));
      const current = indexRef.current;
      if (clamped !== current) setDirection(clamped > current ? 1 : -1);
      setIndex(clamped);
      const d = days[clamped];
      setAnnounce(`Dia ${d.number}, ${d.weekday}: ${d.title}`);
      history.replaceState(null, '', `#dia-${clamped + 1}`);
      requestAnimationFrame(() => revealDay(opts.scroll));
    },
    [revealDay],
  );

  // Link direto (#dia-N) ao abrir a página ou ao mudar o hash
  useEffect(() => {
    if (indexFromHash() !== null) {
      requestAnimationFrame(() => dayAnchorRef.current?.scrollIntoView({ block: 'start' }));
    }
    const onHash = () => {
      const i = indexFromHash();
      if (i !== null) goTo(i, { scroll: true });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [goTo]);

  // Marca o dia como visto quando o conteúdo dele aparece na tela
  useEffect(() => {
    const el = dayAnchorRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const n = days[index].number;
          setVisited((v) => (v.includes(n) ? v : [...v, n].sort((a, b) => a - b)));
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, setVisited]);

  const toggleFavorite = useCallback(
    (id: string) => {
      const on = favorites.includes(id);
      setFavorites(on ? favorites.filter((x) => x !== id) : [...favorites, id]);
      showToast(on ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    },
    [favorites, setFavorites, showToast],
  );

  const setNote = useCallback(
    (dayNumber: number, text: string) => setNotes((n) => ({ ...n, [dayNumber]: text })),
    [setNotes],
  );

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const data = { title: `${trip.title} — ${trip.tagline}`, text: `Roteiro da viagem: ${trip.period}`, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copiado!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      showToast(ok ? 'Link copiado!' : url);
    }
  };

  const checklistTotal = totalChecklistItems(checklist);
  const checklistDone = checklist.checked.length;
  const motion = useMemo(() => ({ readingMode, setReadingMode, reduced }), [readingMode, setReadingMode, reduced]);
  const day = days[index];

  return (
    <MotionContext.Provider value={motion}>
      <a href="#roteiro" className="skip-link">
        Pular para o roteiro
      </a>

      <Header
        solid={headerSolid}
        favoritesCount={favorites.length}
        checklistLeft={Math.max(0, checklistTotal - checklistDone)}
        onOpenChecklist={() => setSheet('checklist')}
        onOpenFavorites={() => setSheet('favorites')}
        onShare={share}
      />

      <main>
        <div ref={heroWrapRef}>
          <Hero photoId={HERO_PHOTO} onExplore={() => revealDay(true)} />
        </div>

        <TripOverview activeIndex={index} onGoToDay={(i) => goTo(i, { scroll: true })} />

        <section className="itinerary" id="roteiro" aria-labelledby="roteiro-titulo">
          <div className="container">
            <div className="itinerary__head">
              <span className="eyebrow">Roteiro dia a dia</span>
              <h2 className="section-title" id="roteiro-titulo">
                Uma rota de férias, <em>um dia de cada vez</em>
              </h2>
              <p className="itinerary__hint">
                <Hand size={18} aria-hidden="true" />
                <span className="only-mobile">Gire a roleta lá embaixo, toque em um dia ou deslize a foto de capa.</span>
                <span className="only-desktop">Clique em uma parada da trilha ou use as setas para navegar.</span>
              </p>
              <div className="itinerary__visited" aria-label={`Você já viu ${visited.length} de ${days.length} dias`}>
                {days.map((d) => (
                  <span key={d.number} className={visited.includes(d.number) ? 'is-on' : ''} aria-hidden="true" />
                ))}
                <small>
                  {visited.length} de {days.length} dias vistos
                </small>
              </div>
            </div>

            <div className="itinerary__trail">
              <RouteTrail activeIndex={index} onSelect={(i) => goTo(i)} visited={visited} todayIndex={todayIndex} />
            </div>

            <div ref={dayAnchorRef} className="itinerary__day" id="roteiro-dia">
              <DayContent
                key={day.number}
                day={day}
                direction={direction}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                note={notes[day.number] ?? ''}
                onNoteChange={(t) => setNote(day.number, t)}
                onPrev={() => goTo(index - 1)}
                onNext={() => goTo(index + 1)}
                onOpenSummary={() => setSheet('summary')}
                isToday={index === todayIndex}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <DayTimeline
        activeIndex={index}
        onSelect={(i) => goTo(i)}
        visited={visited}
        todayIndex={todayIndex}
        hidden={!dockVisible || sheet !== null}
      />

      <TripChecklist open={sheet === 'checklist'} onClose={() => setSheet(null)} state={checklist} onChange={setChecklist} />
      <Favorites
        open={sheet === 'favorites'}
        onClose={() => setSheet(null)}
        favorites={favorites}
        onToggle={toggleFavorite}
        onGoToDay={(i) => goTo(i, { scroll: true })}
      />
      <QuickSummary open={sheet === 'summary'} onClose={() => setSheet(null)} index={index} onSelect={(i) => goTo(i)} />

      <Toast toast={toast} />
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </MotionContext.Provider>
  );
}
