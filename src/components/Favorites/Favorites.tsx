import { ArrowRight, Heart, Trash2 } from 'lucide-react';
import { days } from '../../data/itinerary';
import { dayMonth } from '../../utils/dates';
import { activityIcon } from '../DayContent/activityIcons';
import { Sheet } from '../Sheet/Sheet';
import './Favorites.css';

interface Props {
  open: boolean;
  onClose: () => void;
  favorites: string[];
  onToggle: (activityId: string) => void;
  onGoToDay: (index: number) => void;
}

export function Favorites({ open, onClose, favorites, onToggle, onGoToDay }: Props) {
  const groups = days
    .map((d, index) => ({ day: d, index, items: d.activities.filter((a) => favorites.includes(a.id)) }))
    .filter((g) => g.items.length > 0);

  return (
    <Sheet open={open} onClose={onClose} title="Meus favoritos" icon={<Heart size={24} aria-hidden="true" />}>
      {groups.length === 0 ? (
        <div className="fav-empty">
          <Heart size={40} aria-hidden="true" />
          <p>
            <strong>Nenhum favorito ainda.</strong>
          </p>
          <p>Toque no coração ao lado de uma praia ou passeio para guardá-lo aqui.</p>
        </div>
      ) : (
        groups.map(({ day, index, items }) => (
          <section key={day.number} className="fav-group" aria-labelledby={`fav-d${day.number}`}>
            <header>
              <h3 id={`fav-d${day.number}`}>
                Dia {day.number} · {day.weekdayShort} {dayMonth(day.date)}
              </h3>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => {
                  onGoToDay(index);
                  onClose();
                }}
              >
                Ver dia <ArrowRight size={16} aria-hidden="true" />
              </button>
            </header>
            <ul>
              {items.map((a) => {
                const Icon = activityIcon[a.kind];
                return (
                  <li key={a.id}>
                    <span className="fav-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span className="fav-title">{a.title}</span>
                    <button type="button" className="icon-btn" onClick={() => onToggle(a.id)} aria-label={`Remover "${a.title}" dos favoritos`}>
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
      <p className="fav-note">Favoritos ficam salvos apenas neste dispositivo.</p>
    </Sheet>
  );
}
