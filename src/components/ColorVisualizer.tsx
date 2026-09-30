import { useMemo, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Check, Palette, ArrowRight } from 'lucide-react';
import {
  SPACE_TABS,
  SCENE_IMAGES,
  brandsByCategory,
  type ColorCategory,
  type PaintColor,
} from '../data/colors';
import { PLASTER_TEXTURES, type PlasterTextureId } from '../data/textures';

/**
 * Rejtett SVG a vakolat-textúrák <filter> definícióival.
 * Minden filter kizárólag kódból generált (feTurbulence / feDisplacementMap),
 * nincs külső képfájl. A ColorVisualizer a maszkolt színrétegre CSS
 * filter: url(#id) révén osztja ki ezeket.
 */
function PlasterFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Kapart / szemcsés: finom, egyenletes zaj – azonos X és Y baseFrequency. */}
        <filter id="plaster-scraped" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.9"
            numOctaves={2}
            seed={7}
            stitchTiles="stitch"
            result="noise"
          />
          {/* A zajt a forrás fényerejéhez keverjük, hogy szemcsés struktúrát adjon. */}
          <feColorMatrix in="noise" type="saturate" values="0" result="grain" />
          <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
        </filter>

        {/* Húzott: irányított, vonalas barázdák – aszimmetrikus baseFrequency,
            így a zaj vízszintes csíkokká nyúlik (kavicshúzás imitálása). */}
        <filter id="plaster-dragged" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.6"
            numOctaves={2}
            seed={11}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="lines" />
          <feBlend in="SourceGraphic" in2="lines" mode="multiply" />
        </filter>

        {/* Körkörös dörzsölt: turbulencia + elmozdítás -> örvénylő eldolgozás. */}
        <filter id="plaster-circular" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.03 0.03"
            numOctaves={3}
            seed={4}
            stitchTiles="stitch"
            result="swirl"
          />
          <feColorMatrix in="swirl" type="saturate" values="0" result="swirlGray" />
          {/* Enyhe elmozdítás a körkörös, kézzel dörzsölt hatásért. */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="swirlGray"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feBlend in="displaced" in2="swirlGray" mode="multiply" />
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
  // Kiválasztott vakolat-textúra (csak kültéri nézetben releváns).
  const [textureId, setTextureId] = useState<PlasterTextureId>('none');

  const images = SCENE_IMAGES[category];
  const activeBrand = brands.find((b) => b.id === brandId) ?? brands[0];
  // Lehet undefined, ha egy kategóriához (még) nincs kép (pl. kültér).
  const currentImage = images[imageIndex];

  // Tér váltásakor visszaállítjuk a márkát, színt, képindexet és a textúrát.
  const changeCategory = (next: ColorCategory) => {
    if (next === category) return;
    const nextBrands = brandsByCategory(next);
    setCategory(next);
    setImageIndex(0);
    setBrandId(nextBrands[0]?.id ?? '');
    setSelected(nextBrands[0]?.colors[0] ?? null);
    setTextureId('none'); // új tér -> alapból sima felület
  };

  // Az aktív textúra metaadatai (blend, opacity, filterId).
  const activeTexture = PLASTER_TEXTURES.find((t) => t.id === textureId) ?? PLASTER_TEXTURES[0];

  const changeBrand = (id: string) => {
    setBrandId(id);
    const b = brands.find((x) => x.id === id);
    setSelected(b?.colors[0] ?? null);
  };

  const prevImage = () =>
    setImageIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
  const nextImage = () =>
    setImageIndex((i) => (images.length ? (i + 1) % images.length : 0));

  const goToCalculator = () =>
    document.getElementById('kalkulator')?.scrollIntoView({ behavior: 'smooth' });

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
    <section id="szintervezo" className="bg-white py-20 lg:py-28">
      {/* Rejtett SVG textúra-filterek (kódból generált, nincs képfájl) */}
      <PlasterFilters />

      <div className="section-container">
        {/* Fejléc */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Próbálja ki online
          </span>
          <h2 className="mt-2 flex items-center justify-center gap-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <Palette className="h-8 w-8 text-primary" />
            Interaktív Színtervező
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Válasszon teret, márkát és színt – és nézze meg azonnal, hogyan mutatna otthonában.
          </p>
        </div>

        {/* Tér választó tabok */}
        <div className="mx-auto mt-8 flex max-w-md rounded-xl bg-gray-100 p-1" role="tablist" aria-label="Tér választó">
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
                {currentImage ? (
                  <>
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

                        {/* 3) TEXTÚRA-RÉTEG (csak kültéren, ha van kiválasztott textúra):
                            kódból generált SVG filter adja a vakolat struktúráját.
                            A falmaszk a falra korlátozza; a finom blend + alacsony
                            opacity miatt nem sötétíti túl a festéket. */}
                        {category === 'exterior' && activeTexture.filterId && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              backgroundColor: selected.hex,
                              filter: `url(#${activeTexture.filterId})`,
                              mixBlendMode: activeTexture.blend,
                              opacity: activeTexture.opacity,
                              transition: 'opacity 0.4s ease-in-out',
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
                  </>
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Vakolat textúra választó – KIZÁRÓLAG kültéri nézetben */}
            {category === 'exterior' && (
              <div className="mt-5">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Vakolat textúrája
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Vakolat textúrája">
                  {PLASTER_TEXTURES.map((tex) => {
                    const active = tex.id === textureId;
                    return (
                      <button
                        key={tex.id}
                        type="button"
                        onClick={() => setTextureId(tex.id)}
                        aria-pressed={active}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          active
                            ? 'border-primary bg-primary text-white shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        {tex.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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

        {/* CTA */}
        <div className="mt-12 text-center">
          <button onClick={goToCalculator} className="btn-accent text-lg">
            Megvan az álomszín? Kérjen rá árajánlatot!
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
