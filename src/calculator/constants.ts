import type { ConditionOption } from './types';
import { PRICING } from '../config/pricing';

/**
 * Árak (Ft / m²) – a központi árkonfigurációból (src/config/pricing.ts).
 * A számokat OTT módosítsd, ne itt.
 */
export const PRICES = {
  alapFestes: PRICING.perSquareMeter.basePainting,
  mennyezetFestes: PRICING.perSquareMeter.ceilingPainting,
  tapetaEltavolitas: PRICING.perSquareMeter.wallpaperRemoval,
} as const;

/**
 * Fix áras extrák (Ft / darab) – a központi árkonfigurációból.
 */
export const EXTRA_PRICES = {
  ajto: PRICING.extrasPerUnit.door,
  radiator: PRICING.extrasPerUnit.radiator,
} as const;

/**
 * Falállapot választó opciók. A megjelenítési adatok (cím, leírás, kép, alt)
 * itt vannak, a SZORZÓ viszont a központi árkonfigurációból jön.
 */
export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    id: 'excellent',
    title: 'Kiváló',
    description: 'Sima fal, csak tisztasági festés szükséges.',
    multiplier: PRICING.conditionMultipliers.excellent,
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
    alt: 'Kiváló állapotú, sima fal – csak tisztasági festés',
  },
  {
    id: 'moderate',
    title: 'Enyhén rossz',
    description: 'Foltos felület, kisebb repedések, részleges glettelés.',
    multiplier: PRICING.conditionMultipliers.moderate,
    image:
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=400&q=80',
    alt: 'Enyhén rossz állapotú, foltos fal apró repedésekkel',
  },
  {
    id: 'poor',
    title: 'Nagyon rossz',
    description: 'Mély repedések, teljes glettelés és hálózás szükséges.',
    multiplier: PRICING.conditionMultipliers.poor,
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
} as const;

/** Forint formázás ezres tagolással. */
export const formatHuf = (value: number): string =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
