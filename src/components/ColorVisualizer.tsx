import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Check, Palette, Loader2 } from 'lucide-react';
import {
  SPACE_TABS,
  SCENE_IMAGES,
  brandsByCategory,
  type ColorCategory,
  type PaintColor,
} from '../data/colors';

/**
 * Rejtett SVG a kültéri „kapart vakolat" textúrához – egyetlen, univerzális,
 * SZIGORÚAN MONOKRÓM zaj (kódból generált, nincs képfájl).
 *
 * A filter maga rajzolja a zajt (nem a SourceGraphic-ot dolgozza fel), és a
 * feColorMatrix-szal fekete + változó alfa csatornává alakítja: nincs
 * színinformáció, így NEM módosítja a falfesték szaturációját. A réteget
 * multiply + alacsony opacity-vel visszük a színre -> csak apró, sötét
 * mikro-árnyékokat (a vakolat gödröcskéit) ad hozzá.
 */
function PlasterTextureFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter id="plaster-grain" x="0%" y="0%" width="100%" height="100%">
          {/* Egyenletes, ritkább szemcse – azonos X/Y baseFrequency
              (kisebb érték = nagyobb minta = természetesebb szemcsézettség). */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.1 0.1"
            numOctaves={2}
            seed={7}
            stitchTiles="stitch"
            result="noise"
          />
          {/*
            Monokróm konverzió: minden RGB csatorna 0 (fekete), az ALFA a zaj
            luminanciájából jön (utolsó sor R,G,B súlyok). Így fekete pöttyök
            változó átlátszósággal, SEMMI szín -> nem torzítja a tónust.
          */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0.6 0.3 0.1 0 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default function ColorVisualizer() {
  // Aktuális tér (beltéri / kültéri).
  const [category, setCategory] = useState<ColorCategory>('interior');
  // Karuszel aktuális képindexe.
  const [imageIndex, setImageIndex] = useState(0);
  // Aktuális márka id-je.
  const brands = useMemo(() => brandsByCategory(category), [category]);
  const [brandId, setBrandId] = useState<string>(brands[0]?.id ?? '');
  // Kiválasztott szín.
  const [selected, setSelected] = useState<PaintColor | null>(brands[0]?.colors[0] ?? null);

  // Szinkronizált betöltés: amíg a báziskép ÉS a maszk be nem töltött,
  // töltés-animációt mutatunk, a képtartalmat pedig rejtve tartjuk.
  const [imgReady, setImgReady] = useState(false);

  const images = SCENE_IMAGES[category];
  const activeBrand = brands.find((b) => b.id === brandId) ?? brands[0];
  // Lehet undefined, ha egy kategóriához (még) nincs kép (pl. kültér).
  const currentImage = images[imageIndex];

  // A báziskép és a maszk EGYÜTTES előtöltése – csak akkor mutatjuk a
  // képtartalmat, ha mindkettő onload eseménye lefutott (nincs "ugrás",
  // amikor a kisebb maszk hamarabb érkezik, mint a nagyobb bázisfotó).
  useEffect(() => {
    if (!currentImage) return;
    let cancelled = false;
    setImgReady(false);

    const base = new Image();
    const mask = new Image();
    let loaded = 0;
    const onOne = () => {
      loaded += 1;
      if (loaded === 2 && !cancelled) setImgReady(true);
    };
    base.onload = onOne;
    base.onerror = onOne; // hibánál se ragadjon be a spinner
    mask.onload = onOne;
    mask.onerror = onOne;
    base.src = currentImage.imageUrl;
    mask.src = currentImage.maskUrl;

    return () => {
      cancelled = true;
    };
  }, [currentImage]);

  // Tér váltásakor visszaállítjuk a márkát, színt, képindexet és a textúrát.
  const changeCategory = (next: ColorCategory) => {
    if (next === category) return;
    const nextBrands = brandsByCategory(next);
    setCategory(next);
    setImageIndex(0);
    setBrandId(nextBrands[0]?.id ?? '');
    setSelected(nextBrands[0]?.colors[0] ?? null);
  };

  const changeBrand = (id: string) => {
    setBrandId(id);
    const b = brands.find((x) => x.id === id);
    setSelected(b?.colors[0] ?? null);
  };

  const prevImage = () =>
    setImageIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
  const nextImage = () =>
    setImageIndex((i) => (images.length ? (i + 1) % images.length : 0));

  // Közös CSS maszk-beállítás a szín- és a fény-réteghez (ugyanaz a falmaszk).
  // A base <img> object-cover-jével egyező cover/center vágás; azonos méret
  // miatt pixelpontos illeszkedés.
  const maskStyle: CSSProperties = currentImage
    ? {
        WebkitMaskImage: `url(${currentImage.maskUrl})`,
        maskImage: `url(${currentImage.maskUrl})`,
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }
    : {};

  return (
    <section id="szintervezo" className="bg-white py-14 lg:py-16">
      {/* Rejtett SVG textúra-filter (kódból generált monokróm zaj) */}
      <PlasterTextureFilter />

      <div className="section-container">
        {/* Tér választó tabok */}
        <div className="mx-auto flex max-w-md rounded-xl bg-gray-100 p-1" role="tablist" aria-label="Tér választó">
          {SPACE_TABS.map((tab) => {
            const active = tab.id === category;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => changeCategory(tab.id)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  active ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-5">
          {/* Képtér + karuszel */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
              <div className="relative aspect-[4/3]">
                {/* Töltés-animáció – amíg a báziskép és a maszk együtt be nem töltött */}
                {currentImage && !imgReady && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-100">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                )}

                {currentImage ? (
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      imgReady ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {/* ALSÓ RÉTEG: az eredeti, berendezett fotó */}
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/*
                      VALÓSÁGHŰ FAL-SZÍNEZÉS – kétrétegű blend, hogy a sötét
                      színek se lapítsák el a falat:

                      1) SZÍN-RÉTEG (multiply, opacity 1.0): a szín teljes,
                         eredeti tónusban rávetül, megtartva a fal árnyékait
                         és textúráját.
                      2) FÉNY-RÉTEG (screen, opacity 0.18): maga a bázis fotó,
                         a falmaszkkal maszkolva, a szín fölött. Csak enyhén
                         hozza vissza a csúcsfényeket – épp annyira, hogy a fal
                         ne legyen lapos, de a sötét színek NE fakuljanak ki
                         (a túl magas érték rózsaszínesíti a sötét tónusokat).

                      Mindkét réteg UGYANAZT a falmaszkot használja, így a hatás
                      pontosan a falra korlátozódik. */}
                    {selected && (
                      <>
                        {/* 1) Szín-réteg – multiply */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundColor: selected.hex,
                            mixBlendMode: 'multiply',
                            opacity: 1,
                            ...maskStyle,
                            // Prémium átmenet: színváltáskor a fal elegánsan úszik át.
                            transition: 'background-color 0.4s ease-in-out',
                            zIndex: 10,
                          }}
                        />
                        {/* 2) Fény-réteg – a bázis fotó screen módban visszahozza a csúcsfényeket */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage: `url(${currentImage.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            mixBlendMode: 'screen',
                            opacity: 0.18,
                            ...maskStyle,
                            zIndex: 11,
                          }}
                        />

                        {/* 3) VAKOLAT-TEXTÚRA (csak kültéren): univerzális, monokróm
                            „kapart vakolat" zaj. A filter maga rajzolja a fekete
                            (alfás) szemcsét – NINCS szín, így nem torzítja a
                            festék tónusát. A soft-light blend megőrzi az alatta
                            lévő szín telítettségét, a nagyon alacsony opacity
                            miatt pedig épp csak egy finom mikro-árnyékolás marad.
                            A falmaszk a falra korlátozza. */}
                        {category === 'exterior' && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              filter: 'url(#plaster-grain)',
                              mixBlendMode: 'soft-light',
                              opacity: 0.06,
                              ...maskStyle,
                              zIndex: 12,
                            }}
                          />
                        )}
                      </>
                    )}

                    {/* Lapozó nyilak – csak ha több kép van */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          aria-label="Előző kép"
                          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          aria-label="Következő kép"
                          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Aktuális szín badge a képen */}
                    {selected && (
                      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur">
                        <span
                          className="inline-block h-4 w-4 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: selected.hex }}
                        />
                        {selected.name}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Üres állapot – ehhez a térhez még nincs feltöltött kép */
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 p-6 text-center text-gray-500">
                    <Palette className="h-10 w-10 text-gray-400" />
                    <p className="font-medium">Ehhez a térhez hamarosan érkeznek a képek.</p>
                    <p className="text-sm">Válassza a „Beltéri Színek" fület a próbához.</p>
                  </div>
                )}
              </div>

              {/* Pöttyök – csak ha több kép van */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 py-3">
                  {images.map((img, i) => (
                    <button
                      key={img.imageUrl}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      aria-label={`${i + 1}. kép`}
                      aria-current={i === imageIndex}
                      className={`h-2.5 rounded-full transition-all ${
                        i === imageIndex ? 'w-6 bg-primary' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Paletta panel */}
          <div className="lg:col-span-2">
            {/* Márka select */}
            <label htmlFor="brand-select" className="mb-1.5 block text-sm font-medium text-gray-700">
              Válasszon márkát
            </label>
            <select
              id="brand-select"
              value={brandId}
              onChange={(e) => changeBrand(e.target.value)}
              className="select-premium"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Kiválasztott szín neve, nagy betűvel */}
            <div className="mt-6">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Kiválasztott szín
              </span>
              <p className="text-2xl font-extrabold text-gray-900">
                {selected ? selected.name : 'Válasszon színt'}
              </p>
            </div>

            {/* Swatch grid */}
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
              {activeBrand?.colors.map((color) => {
                const isActive = selected?.name === color.name && selected?.hex === color.hex;
                return (
                  <button
                    key={`${color.name}-${color.hex}`}
                    type="button"
                    onClick={() => setSelected(color)}
                    aria-pressed={isActive}
                    aria-label={color.name}
                    title={color.name}
                    className={`relative aspect-square rounded-xl ring-2 ring-offset-2 transition-all ${
                      isActive ? 'ring-primary' : 'ring-transparent hover:ring-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-primary shadow">
                          <Check className="h-4 w-4" />
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-gray-400">
              A megjelenített színek a képernyő beállításaitól függően eltérhetnek a valós
              árnyalattól.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
