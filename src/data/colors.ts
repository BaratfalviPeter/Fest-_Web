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
  /** Az eredeti, berendezett fotó (alsó réteg). */
  imageUrl: string;
  /**
   * Opcionális esti/lámpafényes változat UGYANARRÓL a kameraállásról.
   * Ha meg van adva, megjelenik a Nappali/Esti kapcsoló. A maszk azonos
   * (pixelpontos egyezés), így nem kell külön esti maszk.
   */
  nightImageUrl?: string;
  /**
   * A falfelületet kijelölő maszk kép (PNG, alfa csatornával).
   * A színréteg CSS mask-image-ként EZT használja: ahol a maszk átlátszó,
   * ott az eredeti fotó marad (bútor, padló), ahol látszó, ott színeződik (fal).
   */
  maskUrl: string;
  alt: string;
}

/**
 * A public/ mappán belüli elérési utak elé a Vite base URL-je kerül,
 * hogy lokálisan (/) és GitHub Pages-en (/Fest-_Web/) is helyes legyen.
 *
 * Új kép felvétele:
 *   1. tedd a base + mask párost a public/images/visualizer/<kategória>/ alá,
 *   2. vegyél fel egy új { imageUrl, maskUrl, alt } bejegyzést a listába
 *      az `asset('images/visualizer/...')` segédfüggvénnyel.
 */
const asset = (p: string): string => `${import.meta.env.BASE_URL}${p}`;

/**
 * Sablonképek terenként – pixelpontos base + mask párokkal.
 * A színréteg mix-blend-mode: multiply + CSS maszk révén csak a falakra vetül.
 */
export const SCENE_IMAGES: Record<ColorCategory, SceneImage[]> = {
  interior: [
    {
      imageUrl: asset('images/visualizer/interior/living-room-base.jpg'),
      nightImageUrl: asset('images/visualizer/interior/living-room-base-night.jpg'),
      maskUrl: asset('images/visualizer/interior/living-room-mask.png'),
      alt: 'Világos nappali szürke kanapéval – falszín előnézet maszkolással',
    },
  ],
  exterior: [
    {
      imageUrl: asset('images/visualizer/exterior/exterior-base.jpg'),
      nightImageUrl: asset('images/visualizer/exterior/exterior-base-night.jpg'),
      maskUrl: asset('images/visualizer/exterior/exterior-mask.png'),
      alt: 'Családi ház napsütötte homlokzata – vakolatszín előnézet maszkolással',
    },
  ],
};

/** Segédfüggvény: az adott kategóriához tartozó márkák. */
export function brandsByCategory(category: ColorCategory): PaintBrand[] {
  return PAINT_BRANDS.filter((b) => b.category === category);
}
