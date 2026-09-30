/**
 * ============================================================================
 *  ÁRKONFIGURÁCIÓ – az árkalkulátor EGYETLEN igazságforrása
 * ============================================================================
 *
 *  Itt, ezen az egy helyen frissíthető MINDEN ár, egységár és szorzó –
 *  programozói tudás nélkül is. A kalkulátor logikájához NEM kell hozzányúlni;
 *  elég az alábbi számokat átírni (pl. az éves áremeléskor).
 *
 *  Fontos: csak a számértékeket módosítsd, a szerkezetet (kulcsneveket,
 *  zárójeleket, vesszőket) hagyd változatlanul.
 * ============================================================================
 */

export const PRICING = {
  /** Négyzetméter-alapú egységárak (Ft / m²). */
  perSquareMeter: {
    /** Falfestés alapdíj (munkadíj + anyag) Ft/m². */
    basePainting: 1500,
    /** Mennyezetfestés Ft/m². */
    ceilingPainting: 1500,
    /** Régi tapéta eltávolításának felára Ft/m². */
    wallpaperRemoval: 1000,
  },

  /**
   * Falállapot szorzók – a festés díját szorozzák (a felület állapota
   * határozza meg a szükséges előkészítést).
   *   excellent (Kiváló):      1.0×  – sima fal, csak tisztasági festés
   *   moderate  (Enyhén rossz): 1.5× – foltos, kisebb repedések, részleges glett
   *   poor      (Nagyon rossz): 2.2× – mély repedések, teljes glettelés + hálózás
   */
  conditionMultipliers: {
    excellent: 1.0,
    moderate: 1.5,
    poor: 2.2,
  },

  /**
   * Szükséges festékrétegek száma a falállapot alapján.
   *   Kiváló (tisztasági festés): 1 réteg
   *   Enyhén / Nagyon rossz:      2 réteg
   */
  coatsByCondition: {
    excellent: 1,
    moderate: 2,
    poor: 2,
  },

  /** Fix áras extrák (Ft / darab). */
  extrasPerUnit: {
    /** Ajtók mázolása Ft/db. */
    door: 15000,
    /** Radiátorok festése Ft/db. */
    radiator: 10000,
  },

  /**
   * Festékszükséglet becslése.
   * Egy liter festék hány m²-t fed egy réteggel (ökölszabály).
   */
  paint: {
    coverageM2PerLiter: 10,
  },
} as const;

export type PricingConfig = typeof PRICING;
