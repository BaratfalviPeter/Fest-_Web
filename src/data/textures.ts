/**
 * Kültéri vakolat-textúrák – KIZÁRÓLAG kódból generált SVG minták (nincs
 * külső képfájl). Minden textúrához tartozik egy SVG <filter> (a filterId
 * alapján), amit a ColorVisualizer rejtett <svg>-je definiál, és amit a
 * maszkolt színrétegre CSS `filter: url(#filterId)` révén osztunk ki.
 *
 * === BŐVÍTÉSI ÚTMUTATÓ ===
 * Új textúra: vegyél fel egy új bejegyzést ide (id, label, filterId, blend,
 * opacity), és definiáld a hozzá tartozó <filter id="filterId"> elemet a
 * ColorVisualizer PlasterFilters komponensében.
 */

export type PlasterTextureId = 'none' | 'scraped' | 'dragged' | 'circular';

export interface PlasterTexture {
  id: PlasterTextureId;
  label: string;
  /** A hozzá tartozó SVG <filter> id-je (üres, ha nincs textúra). */
  filterId: string;
  /** A textúra-réteg blend módja (finom hatáshoz). */
  blend: 'multiply' | 'overlay' | 'soft-light';
  /** A textúra-réteg átlátszósága – alacsony, hogy ne sötétítsen túl. */
  opacity: number;
}

export const PLASTER_TEXTURES: PlasterTexture[] = [
  {
    id: 'none',
    label: 'Sima',
    filterId: '',
    blend: 'multiply',
    opacity: 0,
  },
  {
    // Kapart / szemcsés: finom, egyenletes zaj (azonos X és Y frekvencia).
    id: 'scraped',
    label: 'Kapart (szemcsés)',
    filterId: 'plaster-scraped',
    blend: 'soft-light',
    opacity: 0.35,
  },
  {
    // Húzott: irányított, vonalas barázdák (aszimmetrikus baseFrequency).
    id: 'dragged',
    label: 'Húzott',
    filterId: 'plaster-dragged',
    blend: 'soft-light',
    opacity: 0.4,
  },
  {
    // Körkörös dörzsölt: örvénylő minta (turbulencia + elmozdítás).
    id: 'circular',
    label: 'Körkörös',
    filterId: 'plaster-circular',
    blend: 'soft-light',
    opacity: 0.4,
  },
];
