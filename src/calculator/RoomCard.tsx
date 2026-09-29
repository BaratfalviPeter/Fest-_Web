import { Trash2, Ruler, PencilRuler, Palette, Sparkles, DoorOpen, Thermometer, Minus, Plus } from 'lucide-react';
import type { Room, WallId, ConditionId } from './types';
import { calcRoomCost } from './calc';
import { formatHuf } from './constants';
import WallDiagram from './WallDiagram';
import ConditionSelector from './ConditionSelector';

interface Props {
  room: Room;
  index: number;
  canRemove: boolean;
  onChange: (room: Room) => void;
  onRemove: (id: string) => void;
}

interface DimField {
  key: 'width' | 'length' | 'height';
  label: string;
}

const DIM_FIELDS: DimField[] = [
  { key: 'width', label: 'Szélesség (m)' },
  { key: 'length', label: 'Hosszúság (m)' },
  { key: 'height', label: 'Belmagasság (m)' },
];

/** Plusz/mínusz gombos léptető (stepper) egész számokhoz. */
function Stepper({
  value,
  onChange,
  min = 0,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  ariaLabel: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(value + 1);
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-300">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label={`${ariaLabel} csökkentése`}
        className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className="w-10 select-none text-center text-sm font-bold text-gray-900"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        aria-label={`${ariaLabel} növelése`}
        className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 transition-colors hover:bg-gray-100"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function RoomCard({ room, index, canRemove, onChange, onRemove }: Props) {
  const cost = calcRoomCost(room);

  const setDim = (key: DimField['key'], raw: string) => {
    const value = Math.max(0, Number(raw) || 0);
    onChange({ ...room, [key]: value });
  };

  const toggleWall = (wall: WallId) => {
    const has = room.wallpaperWalls.includes(wall);
    onChange({
      ...room,
      wallpaperWalls: has
        ? room.wallpaperWalls.filter((w) => w !== wall)
        : [...room.wallpaperWalls, wall],
    });
  };

  const setHasWallpaper = (checked: boolean) =>
    // Kikapcsoláskor a kijelölt falakat is nullázzuk, hogy ne maradjon rejtett felár.
    onChange({ ...room, hasWallpaper: checked, wallpaperWalls: checked ? room.wallpaperWalls : [] });

  const setCondition = (condition: ConditionId) => onChange({ ...room, condition });

  const setExtra = (key: 'doors' | 'radiators', value: number) =>
    onChange({ ...room, extras: { ...room.extras, [key]: value } });

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Fejléc */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {index + 1}
          </span>
          <input
            type="text"
            value={room.name}
            onChange={(e) => onChange({ ...room, name: e.target.value })}
            className="rounded-md border border-transparent bg-transparent px-1 text-lg font-bold text-gray-900 hover:border-gray-200 focus:border-primary focus:outline-none"
            aria-label="Szoba neve"
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(room.id)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
            aria-label={`${room.name} eltávolítása`}
          >
            <Trash2 className="h-4 w-4" />
            Törlés
          </button>
        )}
      </div>

      {/* 1. lépés: Méretek */}
      <div className="mt-6">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          <Ruler className="h-4 w-4" /> 1. Méretek
        </h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {DIM_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-xs font-medium text-gray-600">{f.label}</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={room[f.key]}
                onChange={(e) => setDim(f.key, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Festendő felület (fal + mennyezet): <strong>{cost.paintableArea.toFixed(1)} m²</strong>{' '}
          — ebből fal {cost.wallArea.toFixed(1)} m², mennyezet {cost.ceilingArea.toFixed(1)} m²
          (a mennyezet automatikusan beleszámít; ajtókat/ablakokat nem vonunk le).
        </p>
      </div>

      {/* 2. lépés: Felülnézet + tapéta (feltételes) */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          <PencilRuler className="h-4 w-4" /> 2. Tapéta eltávolítás
        </h4>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={room.hasWallpaper}
            onChange={(e) => setHasWallpaper(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          Van eltávolítandó tapéta?
        </label>

        {/* A rajz csak akkor jelenik meg, ha van eltávolítandó tapéta. */}
        {room.hasWallpaper && (
          <div className="mt-4">
            <WallDiagram room={room} onToggleWall={toggleWall} />
          </div>
        )}
      </div>

      {/* 3. lépés: Falállapot */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          <Palette className="h-4 w-4" /> 3. Falállapot
        </h4>
        <p className="mt-1 mb-3 text-xs text-gray-500">
          Válassza ki a falak jelenlegi állapotát – ez befolyásolja a szükséges előkészítést.
        </p>
        <ConditionSelector value={room.condition} onChange={setCondition} />
      </div>

      {/* 4. lépés: Extrák */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          <Sparkles className="h-4 w-4" /> 4. Extrák
        </h4>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <DoorOpen className="h-5 w-5 text-primary" />
              <div>
                <span className="block text-sm font-medium text-gray-800">Ajtók mázolása</span>
                <span className="text-xs text-gray-500">15 000 Ft / db</span>
              </div>
            </div>
            <Stepper
              value={room.extras.doors}
              onChange={(v) => setExtra('doors', v)}
              ariaLabel="Ajtók száma"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-primary" />
              <div>
                <span className="block text-sm font-medium text-gray-800">Radiátorok festése</span>
                <span className="text-xs text-gray-500">10 000 Ft / db</span>
              </div>
            </div>
            <Stepper
              value={room.extras.radiators}
              onChange={(v) => setExtra('radiators', v)}
              ariaLabel="Radiátorok száma"
            />
          </div>
        </div>
      </div>

      {/* Szoba részösszeg */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <span className="text-sm font-medium text-gray-600">Szoba részösszeg</span>
        <span className="text-lg font-extrabold text-primary">{formatHuf(cost.total)}</span>
      </div>
    </article>
  );
}
