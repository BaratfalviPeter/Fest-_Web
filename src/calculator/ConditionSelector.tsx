import { Check } from 'lucide-react';
import type { ConditionId } from './types';
import { CONDITION_OPTIONS } from './constants';

interface Props {
  value: ConditionId;
  onChange: (id: ConditionId) => void;
}

/**
 * Kötelező vizuális falállapot választó – 3 egymás melletti kártya.
 */
export default function ConditionSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CONDITION_OPTIONS.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={selected}
            className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
              selected
                ? 'border-primary shadow-md ring-2 ring-primary/20'
                : 'border-gray-200 hover:border-primary/40'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={opt.image}
                alt={opt.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {selected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{opt.title}</span>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                  {opt.multiplier}×
                </span>
              </div>
              <p className="mt-1 text-xs leading-snug text-gray-500">{opt.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
