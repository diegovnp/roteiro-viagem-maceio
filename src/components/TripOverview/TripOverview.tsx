import { BedDouble, CalendarRange, Hourglass, MapPinned, Moon, Plane } from 'lucide-react';
import { days, trip } from '../../data/itinerary';
import { useReveal } from '../../hooks/useReveal';
import { diffDays, todayInMaceio } from '../../utils/dates';
import { activityIcon } from '../DayContent/activityIcons';
import { Footprints, PalmIcon } from '../Decor/Decor';
import { RouteMap } from '../RouteMap/RouteMap';
import './TripOverview.css';

interface Props {
  activeIndex: number;
  onGoToDay: (index: number) => void;
}

function TripStatus() {
  const today = todayInMaceio();
  const toStart = diffDays(today, trip.startDate);
  const toEnd = diffDays(today, trip.endDate);
  let text: string;
  if (toStart > 1) text = `Faltam ${toStart} dias para a viagem`;
  else if (toStart === 1) text = 'A viagem começa amanhã!';
  else if (toStart === 0) text = 'A viagem começa hoje!';
  else if (toEnd >= 0) text = `Viagem em andamento — hoje é o dia ${-toStart + 1}`;
  else text = 'Viagem concluída — que venha a próxima!';
  return (
    <p className="overview__status">
      <Hourglass size={18} aria-hidden="true" /> {text}
    </p>
  );
}

export function TripOverview({ activeIndex, onGoToDay }: Props) {
  const revealA = useReveal<HTMLDivElement>();
  const revealB = useReveal<HTMLDivElement>();
  const revealC = useReveal<HTMLDivElement>();

  return (
    <section className="overview" id="resumo" aria-labelledby="resumo-titulo">
      <PalmIcon className="overview__palm deco" />
      <div className="container">
        <div className="overview__head reveal" ref={revealA}>
          <span className="eyebrow">A viagem em resumo</span>
          <h2 className="section-title" id="resumo-titulo">
            Oito dias entre <em>coqueirais</em> e <em>piscinas naturais</em>
          </h2>
          <TripStatus />
        </div>

        <div className="overview__grid">
          <div className="overview__facts reveal" ref={revealB}>
            <ul className="facts">
              <li className="fact">
                <span className="fact__icon" aria-hidden="true">
                  <MapPinned size={22} />
                </span>
                <span className="fact__label">Destino</span>
                <span className="fact__value">{trip.destination}</span>
              </li>
              <li className="fact">
                <span className="fact__icon" aria-hidden="true">
                  <CalendarRange size={22} />
                </span>
                <span className="fact__label">Período</span>
                <span className="fact__value">{trip.periodShort}</span>
              </li>
              <li className="fact">
                <span className="fact__icon" aria-hidden="true">
                  <Moon size={22} />
                </span>
                <span className="fact__label">Duração</span>
                <span className="fact__value">{trip.duration}</span>
                <span className="fact__note">{trip.durationNote}</span>
              </li>
              <li className="fact">
                <span className="fact__icon" aria-hidden="true">
                  <BedDouble size={22} />
                </span>
                <span className="fact__label">Hospedagem</span>
                <span className="fact__value">Maragogi → Maceió</span>
                <span className="fact__note">Maragogi de 11 a 13/11 · Maceió de 13 a 18/11</span>
              </li>
            </ul>

            <div className="calendar">
              <div className="calendar__head">
                <h3>Novembro de 2026</h3>
                <Footprints className="calendar__steps deco" />
              </div>
              <ol className="calendar__days">
                {days.map((d, i) => {
                  const main = d.activities.find((a) => a.kind === 'boat' || a.kind === 'beach' || a.kind === 'walk') ?? d.activities[0];
                  const Icon = d.flags?.returnOnly ? Plane : activityIcon[main.kind];
                  return (
                    <li key={d.number}>
                      <button
                        type="button"
                        className={`calendar__day ${i === activeIndex ? 'is-active' : ''}`}
                        onClick={() => onGoToDay(i)}
                        aria-label={`Ver dia ${d.number}: ${d.weekday}, ${d.title}`}
                      >
                        <span className="calendar__wd">{d.weekdayShort}</span>
                        <span className="calendar__num">{d.date.slice(8)}</span>
                        <Icon size={16} aria-hidden="true" />
                        <span className="calendar__short">{d.short}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="overview__map reveal" ref={revealC} id="mapa">
            <div className="overview__map-head">
              <h3>A rota pelo litoral</h3>
              <p>
                Em destaque: locais do <strong>dia {activeIndex + 1}</strong>. Litoral norte, capital e litoral sul.
              </p>
            </div>
            <RouteMap mode="overview" dayNumber={activeIndex + 1} onPlaceClick={undefined} aspect={0.82} />
            <ul className="overview__legend">
              <li>
                <span className="lg lg--base" /> Bases de hospedagem
              </li>
              <li>
                <span className="lg lg--day" /> Locais do dia selecionado
              </li>
              <li>
                <span className="lg lg--route" /> Ordem das visitas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
