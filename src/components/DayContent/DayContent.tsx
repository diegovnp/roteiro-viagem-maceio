import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  Map as MapIcon,
  Moon,
  NotebookPen,
  PlaneTakeoff,
  Repeat2,
  Route,
} from 'lucide-react';
import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { days } from '../../data/itinerary';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { Day } from '../../types/itinerary';
import { longDate } from '../../utils/dates';
import { placesOfDay, RouteMap } from '../RouteMap/RouteMap';
import { SmartImage } from '../SmartImage/SmartImage';
import { ActivityCard } from './ActivityCard';
import './DayContent.css';

interface Props {
  day: Day;
  direction: 1 | -1;
  favorites: string[];
  onToggleFavorite: (activityId: string) => void;
  note: string;
  onNoteChange: (text: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenSummary: () => void;
  isToday: boolean;
}

export function DayContent({
  day,
  direction,
  favorites,
  onToggleFavorite,
  note,
  onNoteChange,
  onPrev,
  onNext,
  onOpenSummary,
  isToday,
}: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [mapOpen, setMapOpen] = useState(false);
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [draft, setDraft] = useState(note);
  const mapRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const dayPlaces = placesOfDay(day.number);
  const prevDay = days[day.number - 2];
  const nextDay = days[day.number];

  // Ao trocar de dia, limpa o destaque e carrega a anotação do novo dia
  useEffect(() => {
    setActivePlace(null);
    setDraft(note);
    setSaved('idle');
  }, [day.number]);

  // Salvamento automático das notas (com pequeno atraso)
  useEffect(() => {
    if (draft === note) return;
    setSaved('saving');
    const t = window.setTimeout(() => {
      onNoteChange(draft);
      setSaved('saved');
    }, 450);
    return () => window.clearTimeout(t);
  }, [draft, note, onNoteChange]);

  const showOnMap = (placeId: string) => {
    setActivePlace(placeId);
    setMapOpen(true);
    requestAnimationFrame(() => {
      mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const onMapPlace = (placeId: string) => {
    setActivePlace(placeId);
    const act = day.activities.find((a) => a.placeId === placeId);
    if (act) {
      document.getElementById(`atividade-${act.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Gesto de deslizar na capa para trocar de dia
  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  const showMap = isDesktop || mapOpen;

  return (
    <article
      className={`day ${direction > 0 ? 'from-right' : 'from-left'}`}
      aria-labelledby={`dia-${day.number}-titulo`}
      key={day.number}
    >
      <header className="day__cover" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <SmartImage
          photoId={day.cover}
          sizes="(min-width: 1240px) 1180px, (min-width: 768px) 92vw, 100vw"
          className="day__cover-img"
          showCredit
          fallbackLabel={day.title}
        />
        <div className="day__cover-shade" aria-hidden="true" />
        <div className="day__cover-text">
          <div className="day__badges">
            <span className="day__badge day__badge--num">
              Dia {day.number} <span>de {days.length}</span>
            </span>
            {isToday && <span className="day__badge day__badge--today">Hoje</span>}
            {day.base && (
              <span className="day__badge">
                <BedDouble size={15} aria-hidden="true" /> Base: {day.base}
              </span>
            )}
          </div>
          <p className="day__date">
            <time dateTime={day.date}>
              {day.weekday}, {longDate(day.date)}
            </time>
          </p>
          <h2 className="day__title" id={`dia-${day.number}-titulo`} tabIndex={-1}>
            {day.title}
          </h2>
        </div>
      </header>

      <div className="day__body">
        <aside className="day__side">
          <p className="day__summary">{day.summary}</p>

          {day.flags?.returnOnly && (
            <div className="callout callout--night">
              <Moon size={22} aria-hidden="true" />
              <div>
                <strong>Dia apenas de retorno</strong>
                <p>A saída da hospedagem acontece durante a madrugada, para o voo das 04h.</p>
              </div>
            </div>
          )}

          {day.flags?.multiStop && (
            <div className="callout callout--route">
              <Route size={22} aria-hidden="true" />
              <div>
                <strong>Dia com várias paradas</strong>
                <p>A quantidade de praias pode exigir ajustes conforme o tempo disponível.</p>
              </div>
            </div>
          )}

          {day.flags?.swappable && (
            <div className="callout callout--swap">
              <Repeat2 size={22} aria-hidden="true" />
              <div>
                <strong>Dia flexível</strong>
                <p>Possibilidade de substituir este dia por repetir algum destino preferido.</p>
              </div>
            </div>
          )}

          {day.tide && (
            <div className="tide" role="group" aria-label="Maré informada no roteiro">
              <div className="tide__wave deco" aria-hidden="true">
                <svg viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M0 20c25-14 50-14 75 0s50 14 75 0 37-10 50-6v26H0z" />
                </svg>
              </div>
              <p className="tide__label">{day.tide.label}</p>
              <p className="tide__value">
                <strong>{day.tide.height}</strong>
                <span>às {day.tide.time}</span>
              </p>
              {day.tide.note && <p className="tide__note">{day.tide.note}</p>}
              <p className="tide__disclaimer">
                Referência do roteiro, não é dado oficial. Confira a tábua de marés antes de sair.
              </p>
            </div>
          )}

          <div className="day__quick">
            <button type="button" className="btn btn--ghost" onClick={onOpenSummary}>
              <ClipboardList size={18} aria-hidden="true" /> Resumo rápido
            </button>
            {!isDesktop && dayPlaces.length > 0 && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  const next = !mapOpen;
                  setMapOpen(next);
                  if (next) {
                    window.setTimeout(() => mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
                  }
                }}
                aria-expanded={mapOpen}
                aria-controls={`mapa-dia-${day.number}`}
              >
                <MapIcon size={18} aria-hidden="true" /> {mapOpen ? 'Ocultar mapa' : 'Mapa do dia'}
              </button>
            )}
          </div>

          {dayPlaces.length > 0 && showMap && (
            <div className="day__map" ref={mapRef} id={`mapa-dia-${day.number}`}>
              <RouteMap
                mode="day"
                dayNumber={day.number}
                activePlaceId={activePlace}
                onPlaceClick={onMapPlace}
                aspect={isDesktop ? 1.1 : 1.35}
              />
            </div>
          )}
        </aside>

        <div className="day__main">
          <h3 className="day__h3">
            Programação <span>{day.activities.length} etapas</span>
          </h3>
          <ol className="schedule">
            {day.activities.map((a) => {
              const step = a.placeId ? dayPlaces.indexOf(a.placeId) + 1 : null;
              return (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  step={step}
                  coverId={day.cover}
                  isFavorite={favorites.includes(a.id)}
                  onToggleFavorite={() => onToggleFavorite(a.id)}
                  isMapActive={!!a.placeId && a.placeId === activePlace}
                  onShowOnMap={showOnMap}
                />
              );
            })}
            <li className="schedule__end" aria-hidden="true">
              {day.flags?.returnOnly ? <PlaneTakeoff size={18} /> : <CheckCircle2 size={18} />}
            </li>
          </ol>

          {day.tips.length > 0 && (
            <section className="tips" aria-labelledby={`dicas-${day.number}`}>
              <h3 id={`dicas-${day.number}`}>
                <Lightbulb size={20} aria-hidden="true" /> Observações e dicas
              </h3>
              <ul>
                {day.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="notes" aria-labelledby={`notas-${day.number}`}>
            <h3 id={`notas-${day.number}`}>
              <NotebookPen size={20} aria-hidden="true" /> Minhas anotações
            </h3>
            <label className="visually-hidden" htmlFor={`nota-${day.number}`}>
              Anotações pessoais do dia {day.number}
            </label>
            <textarea
              id={`nota-${day.number}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Restaurantes para testar, horário do barco, lembretes…"
              rows={4}
            />
            <p className="notes__status" aria-live="polite">
              {saved === 'saving' ? 'Salvando…' : saved === 'saved' ? 'Salvo neste dispositivo' : 'Fica salvo só neste dispositivo'}
            </p>
          </section>

          <nav className="day__pager" aria-label="Navegar entre os dias">
            {prevDay ? (
              <button type="button" className="pager-btn" onClick={onPrev}>
                <ArrowLeft size={20} aria-hidden="true" />
                <span>
                  <small>Dia {prevDay.number}</small>
                  {prevDay.short}
                </span>
              </button>
            ) : (
              <span />
            )}
            {nextDay ? (
              <button type="button" className="pager-btn pager-btn--next" onClick={onNext}>
                <span>
                  <small>Dia {nextDay.number}</small>
                  {nextDay.short}
                </span>
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
