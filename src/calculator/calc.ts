import type { Room, RoomCost, WallId } from './types';
import { PRICES, CONDITION_OPTIONS } from './constants';

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

/**
 * Egy szoba teljes költségbontása.
 * Szakmai logika: ajtókat és ablakokat NEM vonunk le.
 *   Falfelület   = 2 * (szélesség + hosszúság) * belmagasság
 *   Mennyezet    = szélesség * hosszúság
 *   Tapéta felár = kijelölt falszakaszok (hossz * belmagasság) területére
 */
export function calcRoomCost(room: Room): RoomCost {
  const wallArea = 2 * (room.width + room.length) * room.height;
  const ceilingArea = room.width * room.length;
  const multiplier = conditionMultiplier(room);

  const wallpaperArea = room.wallpaperWalls.reduce(
    (sum, wall) => sum + wallSegmentArea(room, wall),
    0,
  );

  const wallPaintCost = wallArea * PRICES.alapFestes * multiplier;
  const ceilingPaintCost = room.paintCeiling
    ? ceilingArea * PRICES.mennyezetFestes * multiplier
    : 0;
  const wallpaperRemovalCost = wallpaperArea * PRICES.tapetaEltavolitas;

  const total = wallPaintCost + ceilingPaintCost + wallpaperRemovalCost;

  return {
    wallArea,
    ceilingArea,
    wallpaperArea,
    wallPaintCost,
    ceilingPaintCost,
    wallpaperRemovalCost,
    total,
  };
}

/** Az összes szoba együttes költsége. */
export function calcGrandTotal(rooms: Room[]): number {
  return rooms.reduce((sum, room) => sum + calcRoomCost(room).total, 0);
}
