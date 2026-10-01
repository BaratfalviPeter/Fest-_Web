import { useEffect, useMemo, useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check, Sparkles, RotateCcw } from 'lucide-react';
import type { PaintColor, MoodTag } from '../data/colors';

interface Props {
  /** Az aktív márka színei – ezekből ajánl a kvíz. */
  brandColors: PaintColor[];
  /** A kiválasztott szín kipróbálása a vásznon (bezárja a modált). */
  onPick: (color: PaintColor) => void;
  /** Modal bezárása választás nélkül. */
  onClose: () => void;
}

type RoomId = 'nappali' | 'haloszoba' | 'gyerekszoba' | 'dolgozoszoba';
type LightId = 'dark' | 'bright';
type MoodId = 'calm' | 'warm' | 'modern';

interface Option<T extends string> {
  id: T;
  label: string;
  emoji: string;
}

const ROOMS: Option<RoomId>[] = [
  { id: 'nappali', label: 'Nappali', emoji: '🛋️' },
  { id: 'haloszoba', label: 'Hálószoba', emoji: '🛏️' },
  { id: 'gyerekszoba', label: 'Gyerekszoba', emoji: '🧸' },
  { id: 'dolgozoszoba', label: 'Dolgozószoba', emoji: '💼' },
];

const LIGHTS: Option<LightId>[] = [
  { id: 'dark', label: 'Sötétebb / kevés természetes fény', emoji: '🌑' },
  { id: 'bright', label: 'Világos / sok napsütés', emoji: '🌞' },
];

const MOODS: Option<MoodId>[] = [
  { id: 'calm', label: 'Nyugodt, pihentető', emoji: '🌿' },
  { id: 'warm', label: 'Meleg, kuckós', emoji: '☀️' },
  { id: 'modern', label: 'Modern, letisztult', emoji: '💎' },
];

interface Answers {
  room?: RoomId;
  light?: LightId;
  mood?: MoodId;
}

/** HEX -> relatív világosság (0=sötét, 1=világos), egyszerű luminancia. */
function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** A kvíz-hangulat -> a színek MoodTag címkéje. */
const MOOD_TO_TAG: Record<MoodId, MoodTag> = {
  calm: 'nyugodt',
  warm: 'meleg',
  modern: 'modern',
};

interface Recommendation {
  colors: PaintColor[];
  explanation: string;
}

/**
 * Ajánló motor: a válaszok alapján pontozza és rangsorolja a márka színeit.
 *  - a kiválasztott hangulat címkéje erős pont,
 *  - sötét szobánál a világosabb színek előnyt kapnak (a hideg sötét árnyalatok
 *    szürkévé tennék a teret), világos szobánál a modern hangulat engedi a
 *    sötétebb/kontrasztos árnyalatokat is,
 *  - a magyarázat a szabályt indokolja.
 */
function recommend(colors: PaintColor[], a: Answers): Recommendation {
  const moodTag = a.mood ? MOOD_TO_TAG[a.mood] : null;

  const scored = colors.map((c) => {
    let score = 0;
    const lum = luminance(c.hex);

    // Hangulat-egyezés
    if (moodTag && c.tags.includes(moodTag)) score += 5;
    // Elegáns a modern mellé is jól mutat
    if (a.mood === 'modern' && c.tags.includes('elegans')) score += 2;

    // Fényviszony
    if (a.light === 'dark') {
      // Sötét szobába világosabb szín kell -> jutalmazzuk a világosságot.
      score += lum * 4;
      if (a.mood === 'warm' && c.tags.includes('meleg') && lum > 0.6) score += 3;
    } else if (a.light === 'bright') {
      // Világos szobában a modern hangulat elbírja a sötétebb, kontrasztos színt.
      if (a.mood === 'modern') score += (1 - lum) * 2;
    }

    // Gyerekszobába inkább világos, barátságos árnyalat.
    if (a.room === 'gyerekszoba') score += lum * 1.5;

    return { color: c, score };
  });

  scored.sort((x, y) => y.score - x.score);
  const top = scored.slice(0, 3).map((s) => s.color);

  // Magyarázat a fő szabály szerint.
  let explanation =
    'A válaszaid alapján ezeket a színeket ajánljuk, amelyek harmonizálnak a tér hangulatával.';
  if (a.light === 'dark' && a.mood === 'warm') {
    explanation =
      'Sötétebb térbe világos, meleg árnyalatokat ajánlunk – a hideg színek szürkévé tennék a szobát, a meleg tónusok viszont otthonossá és tágasabbá varázsolják.';
  } else if (a.room === 'haloszoba' && a.mood === 'calm') {
    explanation =
      'Hálószobába hűvösebb, zöldes-kékes pasztell árnyalatokat ajánlunk: ezek bizonyítottan pihentetőek és segítik a nyugodt kikapcsolódást.';
  } else if (a.light === 'bright' && a.mood === 'modern') {
    explanation =
      'Világos, napfényes térbe elegáns szürkék és kontrasztos, tiszta árnyalatok illenek – modern, letisztult hatást keltenek.';
  } else if (a.mood === 'calm') {
    explanation =
      'Nyugodt hatáshoz lágy, visszafogott árnyalatokat válogattunk, amelyek pihentető, kiegyensúlyozott teret adnak.';
  } else if (a.mood === 'warm') {
    explanation =
      'Meleg, kuckós hangulathoz barátságos, földközeli árnyalatokat ajánlunk, amelyek otthonossá teszik a teret.';
  } else if (a.mood === 'modern') {
    explanation =
      'Modern, letisztult hatáshoz elegáns, határozott árnyalatokat válogattunk kontrasztos karakterrel.';
  }

  return { colors: top, explanation };
}

export default function ColorQuiz({ brandColors, onPick, onClose }: Props) {
  const [step, setStep] = useState(0); // 0,1,2 = kérdések, 3 = eredmény
  const [answers, setAnswers] = useState<Answers>({});

  // ESC-re zárás + háttérgörgetés tiltása.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const result = useMemo(
    () => (step === 3 ? recommend(brandColors, answers) : null),
    [step, answers, brandColors],
  );

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  // Egy választógomb-sor renderelése (az adott lépés opcióival).
  const renderOptions = <T extends string>(
    options: Option<T>[],
    current: T | undefined,
    onSelect: (id: T) => void,
  ) => (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const active = current === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            aria-pressed={active}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
              active
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {opt.emoji}
            </span>
            <span className="font-medium text-gray-800">{opt.label}</span>
            {active && <Check className="ml-auto h-5 w-5 text-primary" />}
          </button>
        );
      })}
    </div>
  );

  const STEP_TITLES = [
    'Melyik helyiséget újítod fel?',
    'Milyenek a szoba fényviszonyai?',
    'Milyen érzést szeretnél elérni?',
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Szín-kvíz"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fejléc + bezárás */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex items-center gap-2 text-xl font-extrabold text-gray-900">
            <Sparkles className="h-6 w-6 text-accent" />
            Szín-kvíz
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bezárás"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lépésjelző (a kérdéseknél) */}
        {step < 3 && (
          <div className="mt-4 flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* 1. lépés – helyiség */}
        {step === 0 && (
          <div>
            <p className="mt-5 text-lg font-semibold text-gray-900">{STEP_TITLES[0]}</p>
            {renderOptions(ROOMS, answers.room, (room) => {
              setAnswers((a) => ({ ...a, room }));
              setStep(1);
            })}
          </div>
        )}

        {/* 2. lépés – fényviszony */}
        {step === 1 && (
          <div>
            <p className="mt-5 text-lg font-semibold text-gray-900">{STEP_TITLES[1]}</p>
            {renderOptions(LIGHTS, answers.light, (light) => {
              setAnswers((a) => ({ ...a, light }));
              setStep(2);
            })}
          </div>
        )}

        {/* 3. lépés – hangulat */}
        {step === 2 && (
          <div>
            <p className="mt-5 text-lg font-semibold text-gray-900">{STEP_TITLES[2]}</p>
            {renderOptions(MOODS, answers.mood, (mood) => {
              setAnswers((a) => ({ ...a, mood }));
              setStep(3);
            })}
          </div>
        )}

        {/* Eredmény */}
        {step === 3 && result && (
          <div className="mt-5">
            <p className="text-lg font-semibold text-gray-900">Íme a javaslatunk ✨</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{result.explanation}</p>

            <ul className="mt-5 space-y-3">
              {result.colors.map((color) => (
                <li
                  key={`${color.name}-${color.hex}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-3"
                >
                  <span
                    className="h-12 w-12 shrink-0 rounded-lg ring-1 ring-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-gray-900">{color.name}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-400">
                      {color.hex}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPick(color)}
                    className="btn-primary shrink-0 px-4 py-2 text-sm"
                  >
                    Kipróbálom a szobán
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={restart}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary"
            >
              <RotateCcw className="h-4 w-4" />
              Újrakezdem a kvízt
            </button>
          </div>
        )}

        {/* Navigáció – vissza gomb a kérdéseknél (az 1. után) */}
        {step > 0 && step < 3 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Vissza
          </button>
        )}
      </div>
    </div>
  );
}
