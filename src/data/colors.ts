/**
 * Színtervező adatforrás.
 *
 * === BŐVÍTÉSI ÚTMUTATÓ (programozói tudás nélkül is) ===
 * Új szín:   írj egy új { name, hex } sort a megfelelő márka `colors` tömbjébe.
 * Új márka:  másolj egy teljes { id, name, category, colors: [...] } blokkot,
 *            adj neki egyedi `id`-t, és állítsd be a `category`-t.
 * Kategória: 'interior' = csak Beltéri fülön, 'exterior' = csak Homlokzat/Kültér
 *            fülön jelenik meg.
 *
 * A HEX kódoknak érvényes 6 jegyű színkódnak kell lenniük (pl. '#f5f0e1').
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
  {
    id: 'poli-farbe-platinum',
    name: 'Poli-Farbe Platinum',
    category: 'interior',
    colors: [
      { name: 'Hóvirág', hex: '#f4f6f7' },
      { name: 'Nárcisz', hex: '#f7e7a1' },
      { name: 'Bíborka', hex: '#8e3b58' },
      { name: 'Hamvaska', hex: '#a7a9ac' },
    ],
  },
  {
    id: 'hera-premium',
    name: 'Héra Prémium',
    category: 'interior',
    colors: [
      { name: 'Len', hex: '#e8e1d1' },
      { name: 'Selyemfű', hex: '#b7c4b1' },
      { name: 'Bazalt', hex: '#4b4f54' },
      { name: 'Mandula', hex: '#e6d3b3' },
    ],
  },
  {
    id: 'kulteri-vakolatok',
    name: 'Kültéri Vakolatok',
    category: 'exterior',
    colors: [
      { name: 'Homokdűne', hex: '#e4d5b7' },
      { name: 'Terrakotta', hex: '#c67b5c' },
      { name: 'Olívazöld', hex: '#8a8b5c' },
      { name: 'Vörösagyag', hex: '#a85c43' },
      { name: 'Kavics', hex: '#cfc6b8' },
      { name: 'Mokka', hex: '#8c6e54' },
    ],
  },
];

/** A tér-választó fülek. */
export interface SpaceTab {
  id: ColorCategory;
  label: string;
}

export const SPACE_TABS: SpaceTab[] = [
  { id: 'interior', label: 'Beltéri Színek' },
  { id: 'exterior', label: 'Homlokzat / Kültér' },
];

export interface SceneImage {
  src: string;
  alt: string;
}

/**
 * Sablonképek terenként. Világos, neutrális Unsplash fotók, hogy a
 * mix-blend-mode: multiply réteg valósághűen vetüljön a falakra.
 */
export const SCENE_IMAGES: Record<ColorCategory, SceneImage[]> = {
  interior: [
    {
      src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Világos, minimál nappali kanapéval – falszín előnézet',
    },
    {
      src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      alt: 'Neutrális hálószoba ággyal – falszín előnézet',
    },
    {
      src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
      alt: 'Világos étkező tér – falszín előnézet',
    },
  ],
  exterior: [
    {
      src: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
      alt: 'Családi ház homlokzata – vakolatszín előnézet',
    },
    {
      src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern ház külső homlokzata – vakolatszín előnézet',
    },
    {
      src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      alt: 'Kertes ház homlokzata – vakolatszín előnézet',
    },
  ],
};

/** Segédfüggvény: az adott kategóriához tartozó márkák. */
export function brandsByCategory(category: ColorCategory): PaintBrand[] {
  return PAINT_BRANDS.filter((b) => b.category === category);
}
