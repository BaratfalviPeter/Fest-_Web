import { useCallback, useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface Props {
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  afterAlt: string;
}

/**
 * Interaktív előtte-utána képösszehasonlító csúszka.
 * - egér, érintés és billentyűzet (nyilak) támogatás
 * - a húzógomb finoman pulzál (jelzi, hogy mozgatható)
 * - amikor a komponens a nézetbe görget, egy apró automatikus elmozdulás
 *   is fut le, hogy idősebb ügyfeleknek is egyértelmű legyen a mozgathatóság
 */
export default function BeforeAfterSlider({ beforeSrc, beforeAlt, afterSrc, afterAlt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // %-ban, a felosztás helye
  const draggingRef = useRef(false);
  const hintedRef = useRef(false);

  // A pozíció beállítása egy kliens X koordinátából.
  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  // Egér / érintés húzás.
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setFromClientX(clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [setFromClientX]);

  // Görgetésre egyszeri, finom "hint" animáció (50% -> 62% -> 42% -> 50%).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hintedRef.current) {
            hintedRef.current = true;
            const steps = [62, 42, 50];
            steps.forEach((p, i) => {
              window.setTimeout(() => setPosition(p), 350 + i * 350);
            });
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 4));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl shadow-lg"
      onMouseDown={(e) => {
        draggingRef.current = true;
        setFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        draggingRef.current = true;
        setFromClientX(e.touches[0].clientX);
      }}
    >
      {/* UTÁNA – alsó réteg (teljes szélesség) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Címke: Utána */}
      <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white shadow">
        Utána
      </span>

      {/* ELŐTTE – felső réteg, jobbról levágva a pozíció szerint */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          draggable={false}
          // A kép a KONTÉNER szélességéhez igazodik, ne a levágott div-hez,
          // hogy ne torzuljon a felosztásnál.
          className="absolute inset-0 h-full w-full max-w-none object-cover"
          style={{ width: containerRef.current?.clientWidth ?? '100%' }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-white shadow">
          Előtte
        </span>
      </div>

      {/* Elválasztó vonal + húzógomb */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.4)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Előtte-utána csúszka mozgatása"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 animate-handle-pulse cursor-ew-resize items-center justify-center rounded-full border-2 border-primary bg-white text-primary shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MoveHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
