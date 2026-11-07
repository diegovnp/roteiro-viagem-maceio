import { ChevronLeft, ChevronRight, ClipboardList, Waves } from 'lucide-react';
import { days } from '../../data/itinerary';
import { longDate } from '../../utils/dates';
import { activityIcon } from '../DayContent/activityIcons';
import { Sheet } from '../Sheet/Sheet';
import './QuickSummary.css';

interface Props {
  open: boolean;
  onClose: () => void;
  index: number;
  onSelect: (index: number) => void;
}

/** Visão compacta da programação do dia, para consultar rapidinho. */
export function QuickSummary({ open, onClose, index, onSelect }: Props) {
  const day = days[index];
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Resumo rápido"
      icon={<ClipboardList size={24} aria-hidden="true" />}
      footer={
        <div className="qs-nav">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => onSelect(index - 1)} disabled={index === 0}>
            <ChevronLeft size={18} aria-hidden="true" /> Dia anterior
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => onSelect(index + 1)}
            disabled={index === days.length - 1}
          >
            Próximo dia <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      }
    >
      <p className="qs-date">
        Dia {day.number} · {day.weekday}, {longDate(day.date)}
      </p>
      <h3 className="qs-title">{day.title}</h3>

      {day.tide && (
        <p className="qs-tide">
          <Waves size={18} aria-hidden="true" /> {day.tide.label}: <strong>{day.tide.height}</strong> às{' '}
          <strong>{day.tide.time}</strong>
          {day.tide.note && <small> — {day.tide.note}</small>}
        </p>
      )}

      <ol className="qs-list">
        {day.activities.map((a) => {
          const Icon = activityIcon[a.kind];
          return (
            <li key={a.id}>
              <Icon size={18} aria-hidden="true" />
              <span>
                {a.time && <span className="qs-time">{a.time} · </span>}
                {a.title}
                {a.condition && <em className="qs-cond"> ({a.condition.toLowerCase()})</em>}
              </span>
            </li>
          );
        })}
      </ol>

      {(day.flags?.multiStop || day.flags?.swappable || day.flags?.returnOnly) && (
        <p className="qs-flag">
          {day.flags?.multiStop && 'Dia com várias paradas: pode exigir ajustes conforme o tempo disponível.'}
          {day.flags?.swappable && 'Possibilidade de substituir este dia por repetir um destino preferido.'}
          {day.flags?.returnOnly && 'Apenas retorno: saída da hospedagem durante a madrugada.'}
        </p>
      )}
    </Sheet>
  );
}
