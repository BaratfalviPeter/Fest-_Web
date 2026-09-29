/** A szoba négy fala – a felülnézeti rajzon kattinthatóak. */
export type WallId = 'top' | 'right' | 'bottom' | 'left';

/** Falállapot szintjei – szorzót adnak a festési díjhoz. */
export type ConditionId = 'excellent' | 'moderate' | 'poor';

export interface ConditionOption {
  id: ConditionId;
  title: string;
  description: string;
  multiplier: number;
  image: string;
  alt: string;
}

export interface Room {
  id: string;
  name: string;
  /** Méterben megadott méretek. */
  width: number;
  length: number;
  height: number;
  /** Mennyezet festését is kérik-e. */
  paintCeiling: boolean;
  /** Azok a falak, ahonnan tapétát kell eltávolítani. */
  wallpaperWalls: WallId[];
  condition: ConditionId;
}

/** Egy szoba részletes költségbontása. */
export interface RoomCost {
  wallArea: number;
  ceilingArea: number;
  wallpaperArea: number;
  wallPaintCost: number;
  ceilingPaintCost: number;
  wallpaperRemovalCost: number;
  total: number;
}
