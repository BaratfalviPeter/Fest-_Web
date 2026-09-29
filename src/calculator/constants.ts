import type { ConditionOption } from './types';

/**
 * Árak (Ft / m²). A számítás egésze innen olvas – itt módosíthatók az egységárak.
 */
export const PRICES = {
  alapFestes: 1500, // falfestés alapdíj Ft/m²
  mennyezetFestes: 1500, // mennyezetfestés Ft/m²
  tapetaEltavolitas: 1000, // tapéta eltávolítás felár Ft/m²
} as const;

/**
 * Falállapot választó opciók a szorzókkal.
 */
export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    id: 'excellent',
    title: 'Kiváló',
    description: 'Sima fal, csak tisztasági festés szükséges.',
    multiplier: 1,
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
    alt: 'Kiváló állapotú, sima fal – csak tisztasági festés',
  },
  {
    id: 'moderate',
    title: 'Enyhén rossz',
    description: 'Foltos felület, kisebb repedések, részleges glettelés.',
    multiplier: 1.5,
    image:
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=400&q=80',
    alt: 'Enyhén rossz állapotú, foltos fal apró repedésekkel',
  },
  {
    id: 'poor',
    title: 'Nagyon rossz',
    description: 'Mély repedések, teljes glettelés és hálózás szükséges.',
    multiplier: 2.2,
    image:
      'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=400&q=80',
    alt: 'Nagyon rossz állapotú fal mély repedésekkel, leomló vakolattal',
  },
];

/** Alapértelmezett szoba méretek egy új szoba hozzáadásakor. */
export const DEFAULT_ROOM = {
  width: 4,
  length: 5,
  height: 2.7,
  paintCeiling: true,
} as const;

/** Forint formázás ezres tagolással. */
export const formatHuf = (value: number): string =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
