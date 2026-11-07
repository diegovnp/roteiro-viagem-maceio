import {
  Bike,
  Building2,
  Car,
  Eye,
  Footprints,
  Hotel,
  Landmark,
  Moon,
  Plane,
  Sailboat,
  Sunset,
  Utensils,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import type { ActivityKind } from '../../types/itinerary';

export const activityIcon: Record<ActivityKind, LucideIcon> = {
  flight: Plane,
  car: Car,
  beach: Waves,
  boat: Sailboat,
  food: Utensils,
  hotel: Hotel,
  walk: Footprints,
  tour: Landmark,
  viewpoint: Eye,
  quad: Bike,
  city: Building2,
  sunset: Sunset,
  tide: Moon,
};

export const activityLabel: Record<ActivityKind, string> = {
  flight: 'Voo',
  car: 'Carro',
  beach: 'Praia',
  boat: 'Barco',
  food: 'Alimentação',
  hotel: 'Hospedagem',
  walk: 'Caminhada',
  tour: 'Passeio',
  viewpoint: 'Mirante',
  quad: 'Quadriciclo',
  city: 'Cidade',
  sunset: 'Fim de tarde',
  tide: 'Maré',
};
