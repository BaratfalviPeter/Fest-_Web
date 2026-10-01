/**
 * ============================================================================
 *  SZÍNPALETTA-KONFIGURÁCIÓ – a Színtervező márkáinak és színeinek forrása
 * ============================================================================
 *
 *  Itt, ezen az egy helyen bővíthető a teljes színkészlet – kódlogika
 *  érintése nélkül. Egy jövőbeli admin felület / API ugyanezt a struktúrát
 *  (márka -> színek: név + HEX) tudja előállítani vagy felülírni.
 *
 *  BŐVÍTÉS:
 *   - Új szín:  írj egy új { name, hex } sort a megfelelő márka `colors`-ába.
 *   - Új márka: másolj egy teljes { id, name, category, colors: [...] } blokkot,
 *               adj neki EGYEDI `id`-t, és állítsd be a `category`-t
 *               ('interior' = beltéri fül, 'exterior' = homlokzat/kültér fül).
 *
 *  A HEX kódoknak érvényes 6 jegyű színkódnak kell lenniük (pl. '#f5f0e1').
 * ============================================================================
 */

/** Melyik térhez tartozik egy márka. */
export type ColorCategory = 'interior' | 'exterior';

export interface PaintColor {
  /** Megjelenő színnév, pl. "Nárcisz". */
  name: string;
  /** Érvényes HEX kód, pl. "#f7e7a1". */
  hex: string;
}

export interface PaintBrand {
  /** Egyedi, stabil azonosító (a select value-ja). */
  id: string;
  /** Megjelenő márkanév. */
  name: string;
  /** Beltéri vagy kültéri paletta. */
  category: ColorCategory;
  colors: PaintColor[];
}

/**
 * A teljes márka- és színkészlet. Ide kell új elemeket felvenni.
 */
export const PAINT_BRANDS: PaintBrand[] = [
  // ---------------------------------------------------------------- BELTÉRI
  {
    id: 'poli-farbe-platinum',
    name: 'Poli-Farbe Platinum',
    category: 'interior',
    colors: [
      { name: 'Hóvirág', hex: '#f4f6f7' },
      { name: 'Törtfehér', hex: '#f3eee4' },
      { name: 'Vanília', hex: '#f3e7c6' },
      { name: 'Nárcisz', hex: '#f7e7a1' },
      { name: 'Pasztellzöld', hex: '#c3d3b4' },
      { name: 'Égszínkék', hex: '#aec9d9' },
      { name: 'Levendula', hex: '#b7a8c9' },
      { name: 'Rózsaszirom', hex: '#e7c3c6' },
      { name: 'Meleg homok', hex: '#e3cda3' },
      { name: 'Kávé', hex: '#6f5542' },
      { name: 'Bíborka', hex: '#8e3b58' },
      { name: 'Antracit', hex: '#3b3f45' },
    ],
  },
  {
    id: 'hera-premium',
    name: 'Héra Prémium',
    category: 'interior',
    colors: [
      { name: 'Len', hex: '#e8e1d1' },
      { name: 'Porcelán', hex: '#eef0ee' },
      { name: 'Selyemfű', hex: '#b7c4b1' },
      { name: 'Menta', hex: '#bcd9cd' },
      { name: 'Búzavirág', hex: '#9fb6d4' },
      { name: 'Mályva', hex: '#c9a3b4' },
      { name: 'Mandula', hex: '#e6d3b3' },
      { name: 'Karamell', hex: '#c99a63' },
      { name: 'Mogyoró', hex: '#9c7b5a' },
      { name: 'Bazalt', hex: '#4b4f54' },
    ],
  },
  // --------------------------------------------------------------- KÜLTÉRI
  {
    // Baumit homlokzati vakolatok – a korábbi generikus "Kültéri Vakolatok"
    // helyett konkrét, ismert márka.
    id: 'baumit-life',
    name: 'Baumit Homlokzati Vakolatok (Life)',
    category: 'exterior',
    colors: [
      { name: 'Törtfehér', hex: '#eee7d7' },
      { name: 'Meleg homok', hex: '#e4d5b7' },
      { name: 'Napsárga', hex: '#e7c982' },
      { name: 'Homokkő', hex: '#d8c29a' },
      { name: 'Terrakotta', hex: '#c67b5c' },
      { name: 'Vörösagyag', hex: '#a85c43' },
      { name: 'Pasztellzöld', hex: '#aeb98f' },
      { name: 'Olívazöld', hex: '#8a8b5c' },
      { name: 'Égszínkék', hex: '#9db6c4' },
      { name: 'Kavics', hex: '#cfc6b8' },
      { name: 'Mokka', hex: '#8c6e54' },
      { name: 'Antracit', hex: '#434a4e' },
    ],
  },
];
