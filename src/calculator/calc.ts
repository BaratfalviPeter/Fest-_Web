import type { Room, RoomCost, WallId } from './types';
import { PRICES, EXTRA_PRICES, CONDITION_OPTIONS } from './constants';
import { PRICING } from '../config/pricing';

/**
 * Egy adott fal felülete (m²).
 * A "top" és "bottom" falak hossza a szélesség, a "left"/"right" falaké a hosszúság.
 */
export function wallSegmentArea(room: Room, wall: WallId): number {
  const base = wall === 'top' || wall === 'bottom' ? room.width : room.length;
  return base * room.height;
}

/** Falállapot szorzó kikeresése. */
export function conditionMultiplier(room: Room): number {
  return CONDITION_OPTIONS.find((c) => c.id === room.condition)?.multiplier ?? 1;
}

/** Egy liter festék hány m²-t fed egy réteggel (a központi konfigurációból). */
export const COVERAGE_M2_PER_LITER = PRICING.paint.coverageM2PerLiter;

/**
 * Szükséges festékrétegek száma a falállapot alapján (a konfigurációból).
 *   Kiváló (tisztasági festés): 1 réteg
 *   Enyhén rossz / Nagyon rossz: 2 réteg
 */
export function coatsForCondition(room: Room): number {
  return PRICING.coatsByCondition[room.condition];
}

/**
 * Egy szoba teljes költségbontása.
 * Szakmai logika: ajtókat és ablakokat NEM vonunk le.
 *   Falfelület   = 2 * (szélesség + hosszúság) * belmagasság
 *   Mennyezet    = szélesség * hosszúság  (MINDIG hozzáadva a festendő felülethez)
 *   Tapéta felár = kijelölt falszakaszok (hossz * belmagasság) területére
 *   Extrák       = ajtók * 15 000 Ft + radiátorok * 10 000 Ft (fix, szorzómentes)
 */
export function calcRoomCost(room: Room): RoomCost {
  const wallArea = 2 * (room.width + room.length) * room.height;
  const ceilingArea = room.width * room.length;
  // A mennyezet mindig része a festendő felületnek.
  const paintableArea = wallArea + ceilingArea;
  const multiplier = conditionMultiplier(room);

  // Tapéta terület csak akkor számít, ha a szobában van eltávolítandó tapéta.
  const wallpaperArea = room.hasWallpaper
    ? room.wallpaperWalls.reduce((sum, wall) => sum + wallSegmentArea(room, wall), 0)
    : 0;

  // Festés az állapotszorzóval, és külön a szorzó miatti felár.
  const paintBase = paintableArea * PRICES.alapFestes;
  const paintCost = paintBase * multiplier;
  const conditionSurcharge = paintCost - paintBase;

  const wallpaperRemovalCost = wallpaperArea * PRICES.tapetaEltavolitas;

  const doorsCost = room.extras.doors * EXTRA_PRICES.ajto;
  const radiatorsCost = room.extras.radiators * EXTRA_PRICES.radiator;
  const extrasCost = doorsCost + radiatorsCost;

  // Festékszükséglet: réteg(ek) * felület / lefedettség.
  const coats = coatsForCondition(room);
  const paintLiters = (paintableArea * coats) / COVERAGE_M2_PER_LITER;

  const total = paintCost + wallpaperRemovalCost + extrasCost;

  return {
    paintableArea,
    wallArea,
    ceilingArea,
    wallpaperArea,
    conditionMultiplier: multiplier,
    paintCost,
    conditionSurcharge,
    wallpaperRemovalCost,
    extrasCost,
    doorsCost,
    radiatorsCost,
    coats,
    paintLiters,
    total,
  };
}

/** Az összes szoba együttes költsége. */
export function calcGrandTotal(rooms: Room[]): number {
  return rooms.reduce((sum, room) => sum + calcRoomCost(room).total, 0);
}

/** Az összes szoba összesített, tételes bontása (a részletek panelhez). */
export interface CostBreakdown {
  paintCost: number;
  conditionSurcharge: number;
  wallpaperRemovalCost: number;
  doorsCost: number;
  radiatorsCost: number;
  extrasCost: number;
  /** Összes becsült festékmennyiség literben. */
  paintLiters: number;
  total: number;
}

export function calcBreakdown(rooms: Room[]): CostBreakdown {
  return rooms.reduce<CostBreakdown>(
    (acc, room) => {
      const c = calcRoomCost(room);
      return {
        // A festés nettó (szorzó nélküli) alaprésze külön a felártól.
        paintCost: acc.paintCost + (c.paintCost - c.conditionSurcharge),
        conditionSurcharge: acc.conditionSurcharge + c.conditionSurcharge,
        wallpaperRemovalCost: acc.wallpaperRemovalCost + c.wallpaperRemovalCost,
        doorsCost: acc.doorsCost + c.doorsCost,
        radiatorsCost: acc.radiatorsCost + c.radiatorsCost,
        extrasCost: acc.extrasCost + c.extrasCost,
        paintLiters: acc.paintLiters + c.paintLiters,
        total: acc.total + c.total,
      };
    },
    {
      paintCost: 0,
      conditionSurcharge: 0,
      wallpaperRemovalCost: 0,
      doorsCost: 0,
      radiatorsCost: 0,
      extrasCost: 0,
      paintLiters: 0,
      total: 0,
    },
  );
}
