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

/** Fix áras extra tételek (darabszám-alapú). */
export interface RoomExtras {
  /** Ajtók mázolása (db). */
  doors: number;
  /** Radiátorok festése (db). */
  radiators: number;
}

export interface Room {
  id: string;
  name: string;
  /** Méterben megadott méretek. */
  width: number;
  length: number;
  height: number;
  /** Van-e eltávolítandó tapéta (a rajz csak ekkor jelenik meg). */
  hasWallpaper: boolean;
  /** Azok a falak, ahonnan tapétát kell eltávolítani. */
  wallpaperWalls: WallId[];
  condition: ConditionId;
  /** Fix áras extrák. */
  extras: RoomExtras;
}

/** Egy szoba részletes költségbontása. */
export interface RoomCost {
  /** Fal + mennyezet együttes festendő felülete (m²). */
  paintableArea: number;
  wallArea: number;
  ceilingArea: number;
  wallpaperArea: number;
  /** Falállapot szorzó (pl. 1, 1.5, 2.2). */
  conditionMultiplier: number;
  /** Festés költsége az állapotszorzóval együtt. */
  paintCost: number;
  /** Csak a szorzó miatti felár (paintCost - alapköltség). */
  conditionSurcharge: number;
  wallpaperRemovalCost: number;
  /** Ajtók + radiátorok együttes fix költsége. */
  extrasCost: number;
  doorsCost: number;
  radiatorsCost: number;
  /** Szükséges festékrétegek száma (kiváló=1, egyéb=2). */
  coats: number;
  /** Becsült festékmennyiség literben (paintableArea * coats / 10). */
  paintLiters: number;
  total: number;
}

/**
 * A kalkuláció összegzése – ezt adja át az Árkalkulátor a Kapcsolat
 * oldalnak (React Router state), és ez kerül a levélbe is.
 */
export interface QuoteSummary {
  /** Szobák száma. */
  roomCount: number;
  /** Összes festendő felület (fal + mennyezet), m². */
  totalPaintableArea: number;
  /** Becsült festékmennyiség literben. */
  totalPaintLiters: number;
  /** Összesített várható költség (Ft). */
  grandTotal: number;
  /** Soronkénti szoba-összefoglalók a levélhez / összesítő kártyához. */
  rooms: QuoteRoom[];
}

export interface QuoteRoom {
  name: string;
  /** Méret szöveg, pl. "4 × 5 × 2.7 m". */
  dimensions: string;
  /** Falállapot megnevezése, pl. "Kiváló". */
  condition: string;
  /** Szoba részösszeg (Ft). */
  total: number;
}
