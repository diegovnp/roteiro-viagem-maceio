import { ChevronDown, Clock, Heart, Images, LocateFixed, MapPin, Navigation, TriangleAlert } from 'lucide-react';
import { useId, useState } from 'react';
import { photos } from '../../data/photos';
import { mapsUrl, places } from '../../data/places';
import type { Activity } from '../../types/itinerary';
import { SmartImage } from '../SmartImage/SmartImage';
import { activityIcon, activityLabel } from './activityIcons';

interface Props {
  activity: Activity;
  step: number | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isMapActive: boolean;
  onShowOnMap: (placeId: string) => void;
  /** Foto de capa do dia — evita repetir a mesma foto no detalhe. */
  coverId: string;
}

export function ActivityCard({ activity, step, isFavorite, onToggleFavorite, isMapActive, onShowOnMap, coverId }: Props) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const detailsId = useId();
  const Icon = activityIcon[activity.kind];
  const place = activity.placeId ? places[activity.placeId] : undefined;
  const hasDetails = Boolean(place);
  const showPhoto = !!place?.photo && !!photos[place.photo] && place.photo !== coverId;

  return (
    <li
      className={`act act--${activity.kind} ${open ? 'is-open' : ''} ${isMapActive ? 'is-map-active' : ''}`}
      id={`atividade-${activity.id}`}
    >
      <span className="act__icon" aria-hidden="true" title={activityLabel[activity.kind]}>
        <Icon size={20} strokeWidth={2.2} />
      </span>

      <div className="act__card">
        <div className="act__head">
          <div className="act__main">
            <div className="act__tags">
              {activity.time && (
                <span className="act__time">
                  <Clock size={14} aria-hidden="true" /> {activity.time}
                </span>
              )}
              {activity.duration && <span className="act__duration">{activity.duration}</span>}
              {activity.condition && (
                <span className="act__condition">
                  <TriangleAlert size={14} aria-hidden="true" /> {activity.condition}
                </span>
              )}
            </div>
            <h4 className="act__title">
              {step !== null && (
                <span className="act__step" aria-label={`Ponto ${step} no mapa`}>
                  {step}
                </span>
              )}
              {activity.title}
            </h4>
            {activity.description && <p className="act__desc">{activity.description}</p>}
            {place && (
              <p className="act__place">
                <MapPin size={14} aria-hidden="true" /> {place.area}
              </p>
            )}
          </div>

          <button
            type="button"
            className={`act__fav ${isFavorite ? 'is-on' : ''}`}
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remover "${activity.title}" dos favoritos` : `Favoritar "${activity.title}"`}
          >
            <Heart size={20} aria-hidden="true" />
          </button>
        </div>

        {hasDetails && (
          <>
            <button
              type="button"
              className="act__toggle"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => {
                setOpen((v) => !v);
                setEverOpened(true);
              }}
            >
              {open ? 'Menos detalhes' : 'Localização e fotos'}
              <ChevronDown size={18} aria-hidden="true" />
            </button>

            <div className="act__details" id={detailsId}>
              <div className="act__details-inner">
                {showPhoto && everOpened && (
                  <SmartImage photoId={place!.photo} sizes="(min-width: 1024px) 520px, 90vw" className="act__photo" showCredit />
                )}
                <div className="act__actions">
                  <a className="btn btn--ghost btn--small" href={mapsUrl(place!.mapsQuery)} target="_blank" rel="noopener noreferrer">
                    <Navigation size={16} aria-hidden="true" /> Abrir no mapa
                  </a>
                  <button type="button" className="btn btn--ghost btn--small" onClick={() => onShowOnMap(place!.id)}>
                    <LocateFixed size={16} aria-hidden="true" /> Ver no mapa do dia
                  </button>
                  <a
                    className="btn btn--ghost btn--small"
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place!.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Images size={16} aria-hidden="true" /> Ver fotos
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
