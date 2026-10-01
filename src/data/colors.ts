/**
 * Színtervező adatforrás.
 *
 * A márkák és színek a dedikált konfigurációs fájlban élnek
 * (src/config/colorsConfig.ts) – ott bővíthetők kódlogika érintése nélkül.
 * Ez a modul csak re-exportálja őket, és a sablonképeket (SCENE_IMAGES),
 * a tér-füleket (SPACE_TABS) és a segédfüggvényeket adja hozzá.
 */

export {
  PAINT_BRANDS,
  type ColorCategory,
  type PaintColor,
  type PaintBrand,
} from '../config/colorsConfig';
import { PAINT_BRANDS, type ColorCategory, type PaintBrand } from '../config/colorsConfig';

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
      // A homlokzatnál NINCS esti mód – csak nappali nézet (nincs nightImageUrl).
      imageUrl: asset('images/visualizer/exterior/exterior-base.jpg'),
      maskUrl: asset('images/visualizer/exterior/exterior-mask.png'),
      alt: 'Családi ház napsütötte homlokzata – vakolatszín előnézet maszkolással',
    },
  ],
};

/** Segédfüggvény: az adott kategóriához tartozó márkák. */
export function brandsByCategory(category: ColorCategory): PaintBrand[] {
  return PAINT_BRANDS.filter((b) => b.category === category);
}
