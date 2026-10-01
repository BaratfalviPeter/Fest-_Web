/**
 * ============================================================================
 *  SZÍNPALETTA-KONFIGURÁCIÓ – a Színtervező márkáinak és színeinek forrása
 * ============================================================================
 *
 *  Itt, ezen az egy helyen bővíthető a teljes színkészlet – kódlogika
 *  érintése nélkül. Egy jövőbeli admin felület / API ugyanezt a struktúrát
 *  (márka -> színek: név + HEX + címkék) tudja előállítani vagy felülírni.
 *
 *  BŐVÍTÉS:
 *   - Új szín:  írj egy új { name, hex, tags } sort a megfelelő márka
 *               `colors`-ába. A `tags` a hangulat-szűrőhöz kell (lásd MOODS).
 *   - Új márka: másolj egy teljes { id, name, category, colors: [...] } blokkot,
 *               adj neki EGYEDI `id`-t, és állítsd be a `category`-t
 *               ('interior' = beltéri fül, 'exterior' = homlokzat/kültér fül).
 *
 *  A HEX kódoknak érvényes 6 jegyű színkódnak kell lenniük (pl. '#f5f0e1').
 * ============================================================================
 */

/** Melyik térhez tartozik egy márka. */
export type ColorCategory = 'interior' | 'exterior';

/** Hangulat-címkék – ezekkel szűr a Hangulat-ajánló. */
export type MoodTag = 'nyugodt' | 'modern' | 'meleg' | 'elegans';

export interface PaintColor {
  /** Megjelenő színnév, pl. "Nárcisz". */
  name: string;
  /** Érvényes HEX kód, pl. "#f7e7a1". */
  hex: string;
  /** Hangulat-címkék a szűrőhöz (egy szín több hangulathoz is tartozhat). */
  tags: MoodTag[];
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
 * Hangulat-ajánló opciók. A `tag` null = "Összes szín" (nincs szűrés).
 * Új hangulat: vegyél fel egy új bejegyzést, és adj a színekhez ilyen tag-et.
 */
export interface Mood {
  id: string;
  label: string;
  emoji: string;
  tag: MoodTag | null;
}

export const MOODS: Mood[] = [
  { id: 'all', label: 'Összes szín', emoji: '🎨', tag: null },
  { id: 'calm', label: 'Nyugodt', emoji: '🌿', tag: 'nyugodt' },
  { id: 'modern', label: 'Modern', emoji: '🏙️', tag: 'modern' },
  { id: 'warm', label: 'Meleg', emoji: '☀️', tag: 'meleg' },
  { id: 'elegant', label: 'Elegáns', emoji: '💎', tag: 'elegans' },
];

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
      { name: 'Hóvirág', hex: '#f4f6f7', tags: ['nyugodt', 'modern'] },
      { name: 'Törtfehér', hex: '#f3eee4', tags: ['nyugodt', 'elegans'] },
      { name: 'Vanília', hex: '#f3e7c6', tags: ['meleg', 'nyugodt'] },
      { name: 'Nárcisz', hex: '#f7e7a1', tags: ['meleg'] },
      { name: 'Pasztellzöld', hex: '#c3d3b4', tags: ['nyugodt'] },
      { name: 'Égszínkék', hex: '#aec9d9', tags: ['nyugodt'] },
      { name: 'Levendula', hex: '#b7a8c9', tags: ['nyugodt', 'elegans'] },
      { name: 'Rózsaszirom', hex: '#e7c3c6', tags: ['meleg', 'nyugodt'] },
      { name: 'Meleg homok', hex: '#e3cda3', tags: ['meleg'] },
      { name: 'Kávé', hex: '#6f5542', tags: ['meleg', 'elegans'] },
      { name: 'Bíborka', hex: '#8e3b58', tags: ['elegans'] },
      { name: 'Antracit', hex: '#3b3f45', tags: ['modern', 'elegans'] },
    ],
  },
  {
    id: 'hera-premium',
    name: 'Héra Prémium',
    category: 'interior',
    colors: [
      { name: 'Len', hex: '#e8e1d1', tags: ['nyugodt', 'meleg'] },
      { name: 'Porcelán', hex: '#eef0ee', tags: ['modern', 'nyugodt'] },
      { name: 'Selyemfű', hex: '#b7c4b1', tags: ['nyugodt'] },
      { name: 'Menta', hex: '#bcd9cd', tags: ['nyugodt'] },
      { name: 'Búzavirág', hex: '#9fb6d4', tags: ['nyugodt', 'modern'] },
      { name: 'Mályva', hex: '#c9a3b4', tags: ['elegans', 'meleg'] },
      { name: 'Mandula', hex: '#e6d3b3', tags: ['meleg', 'nyugodt'] },
      { name: 'Karamell', hex: '#c99a63', tags: ['meleg'] },
      { name: 'Mogyoró', hex: '#9c7b5a', tags: ['meleg', 'elegans'] },
      { name: 'Bazalt', hex: '#4b4f54', tags: ['modern', 'elegans'] },
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
      { name: 'Törtfehér', hex: '#eee7d7', tags: ['nyugodt', 'elegans'] },
      { name: 'Meleg homok', hex: '#e4d5b7', tags: ['meleg'] },
      { name: 'Napsárga', hex: '#e7c982', tags: ['meleg'] },
      { name: 'Homokkő', hex: '#d8c29a', tags: ['meleg', 'nyugodt'] },
      { name: 'Terrakotta', hex: '#c67b5c', tags: ['meleg'] },
      { name: 'Vörösagyag', hex: '#a85c43', tags: ['meleg', 'elegans'] },
      { name: 'Pasztellzöld', hex: '#aeb98f', tags: ['nyugodt'] },
      { name: 'Olívazöld', hex: '#8a8b5c', tags: ['nyugodt'] },
      { name: 'Égszínkék', hex: '#9db6c4', tags: ['nyugodt', 'modern'] },
      { name: 'Kavics', hex: '#cfc6b8', tags: ['modern', 'nyugodt'] },
      { name: 'Mokka', hex: '#8c6e54', tags: ['meleg', 'elegans'] },
      { name: 'Antracit', hex: '#434a4e', tags: ['modern', 'elegans'] },
    ],
  },
];
