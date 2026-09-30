import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '../data/content';

interface Props {
  images: GalleryImage[];
}

/**
 * Kattintható galéria rács + teljes képernyős, lapozható lightbox.
 * Vezérlés: kattintás a képre (nyit), nyilak (lapoz), ESC (zár),
 * kattintás a háttérre (zár).
 */
export default function LightboxGallery({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  // Billentyűzet-vezérlés + a háttér görgetésének letiltása nyitott állapotban.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next]);

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      {/* Rács – 6 kép, asztalin 3x2 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`${image.alt} – nagyítás`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/20" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Képnézegető"
          onClick={close}
        >
          {/* Bezárás */}
          <button
            type="button"
            onClick={close}
            aria-label="Bezárás"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Előző */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Előző kép"
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Kép */}
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.alt} · {(openIndex ?? 0) + 1} / {images.length}
            </figcaption>
          </figure>

          {/* Következő */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Következő kép"
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </>
  );
}
