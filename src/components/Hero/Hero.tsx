import { CalendarDays, ChevronDown, MapPin } from 'lucide-react';
import { trip } from '../../data/itinerary';
import { BoatIcon, ShellIcon, StarfishIcon, SunIcon, Waves } from '../Decor/Decor';
import { SmartImage } from '../SmartImage/SmartImage';
import './Hero.css';

interface Props {
  photoId: string;
  onExplore: () => void;
}

export function Hero({ photoId, onExplore }: Props) {
  return (
    <section className="hero" id="topo" aria-labelledby="hero-title">
      <SmartImage photoId={photoId} sizes="100vw" priority className="hero__bg" showCredit />
      <div className="hero__shade" aria-hidden="true" />

      <SunIcon className="hero__sun deco" />
      <ShellIcon className="hero__float hero__float--shell deco" />
      <StarfishIcon className="hero__float hero__float--star deco" />
      <BoatIcon className="hero__boat deco" />

      <div className="hero__content container">
        <p className="hero__kicker">
          <MapPin size={16} aria-hidden="true" /> Alagoas · Brasil
        </p>
        <h1 id="hero-title" className="hero__title">
          Maceió <span className="hero__dash" aria-hidden="true">—</span>
          <span className="visually-hidden"> — </span>
          <em>uma viagem pelo paraíso de Alagoas</em>
        </h1>
        <p className="hero__subtitle">{trip.subtitle}</p>

        <div className="hero__meta">
          <span className="hero__chip">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>11 a 18</strong> de novembro de 2026
            </span>
          </span>
        </div>

        <button type="button" className="btn btn--primary hero__cta" onClick={onExplore}>
          Explorar roteiro
          <ChevronDown size={20} aria-hidden="true" className="hero__cta-icon" />
        </button>
      </div>

      <Waves className="deco-waves" />
    </section>
  );
}
