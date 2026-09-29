import { useMemo, useState } from 'react';
import { Plus, Calculator as CalcIcon, Info, ChevronUp } from 'lucide-react';
import type { Room } from './types';
import { DEFAULT_ROOM, formatHuf } from './constants';
import { calcGrandTotal, calcBreakdown } from './calc';
import RoomCard from './RoomCard';

let roomCounter = 0;
const nextId = () => `room-${Date.now()}-${roomCounter++}`;

function createRoom(name: string): Room {
  return {
    id: nextId(),
    name,
    width: DEFAULT_ROOM.width,
    length: DEFAULT_ROOM.length,
    height: DEFAULT_ROOM.height,
    hasWallpaper: false,
    wallpaperWalls: [],
    condition: 'excellent',
    extras: { doors: 0, radiators: 0 },
  };
}

/** Egy sor a tételes bontásban. */
function BreakdownRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className={muted ? 'text-gray-500' : 'text-gray-700'}>{label}</span>
      <span className={`font-semibold ${muted ? 'text-gray-500' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

export default function Calculator() {
  const [rooms, setRooms] = useState<Room[]>(() => [createRoom('1. szoba')]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const grandTotal = useMemo(() => calcGrandTotal(rooms), [rooms]);
  const breakdown = useMemo(() => calcBreakdown(rooms), [rooms]);

  const addRoom = () => setRooms((prev) => [...prev, createRoom(`${prev.length + 1}. szoba`)]);

  const updateRoom = (updated: Room) =>
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

  const removeRoom = (id: string) => setRooms((prev) => prev.filter((r) => r.id !== id));

  return (
    <section id="kalkulator" className="bg-gray-100 py-20 lg:py-28">
      <div className="section-container">
        {/* Fejléc */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Azonnali kalkuláció
          </span>
          <h2 className="mt-2 flex items-center justify-center gap-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <CalcIcon className="h-8 w-8 text-primary" />
            Interaktív Árkalkulátor
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Adja hozzá a festendő szobákat, állítsa be a paramétereket, és azonnal láthatja a
            várható költséget.
          </p>
        </div>

        {/* Szoba kártyák */}
        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          {rooms.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              index={i}
              canRemove={rooms.length > 1}
              onChange={updateRoom}
              onRemove={removeRoom}
            />
          ))}

          <button
            type="button"
            onClick={addRoom}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-white py-5 font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5"
          >
            <Plus className="h-5 w-5" />
            Új szoba hozzáadása
          </button>

          {/* Nem-sticky összefoglaló (asztali nézethez, tartalomba ágyazva) */}
          <div className="rounded-2xl bg-primary p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white/80">
                  Összesített várható költség ({rooms.length} szoba)
                </span>
                <div className="text-3xl font-extrabold sm:text-4xl">{formatHuf(grandTotal)}</div>
              </div>
              <CalcIcon className="hidden h-12 w-12 text-white/30 sm:block" />
            </div>

            {/* Tételes bontás közvetlenül a kártyán is */}
            <dl className="mt-5 space-y-1 border-t border-white/20 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/80">Festés (fal + mennyezet)</dt>
                <dd className="font-semibold">{formatHuf(breakdown.paintCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/80">Falállapot felár</dt>
                <dd className="font-semibold">{formatHuf(breakdown.conditionSurcharge)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/80">Tapéta eltávolítás</dt>
                <dd className="font-semibold">{formatHuf(breakdown.wallpaperRemovalCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/80">Extrák (ajtók + radiátorok)</dt>
                <dd className="font-semibold">{formatHuf(breakdown.extrasCost)}</dd>
              </div>
            </dl>

            <p className="mt-4 flex items-start gap-2 text-sm text-white/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Az árkalkuláció tájékoztató jellegű. A pontos árat az ingyenes helyszíni felmérés
              során rögzítjük.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky összeg sáv (főleg mobilon) – kinyíló Részletek panellel */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
        {/* Részletek panel (accordion) */}
        {detailsOpen && (
          <div className="section-container border-b border-gray-100 py-4">
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                Költségek részletezése
              </h3>
              <div className="divide-y divide-gray-100">
                <BreakdownRow
                  label="Falfelület + mennyezet festése"
                  value={formatHuf(breakdown.paintCost)}
                />
                <BreakdownRow
                  label="Falállapot szorzó felár"
                  value={formatHuf(breakdown.conditionSurcharge)}
                />
                <BreakdownRow
                  label="Tapéta eltávolítása"
                  value={formatHuf(breakdown.wallpaperRemovalCost)}
                />
                <BreakdownRow label="Ajtók mázolása" value={formatHuf(breakdown.doorsCost)} muted />
                <BreakdownRow
                  label="Radiátorok festése"
                  value={formatHuf(breakdown.radiatorsCost)}
                  muted
                />
                <div className="flex items-center justify-between pt-2 text-base">
                  <span className="font-bold text-gray-900">Összesen</span>
                  <span className="font-extrabold text-primary">{formatHuf(breakdown.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="section-container flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              aria-expanded={detailsOpen}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary"
            >
              Részletek
              <ChevronUp
                className={`h-3.5 w-3.5 transition-transform ${detailsOpen ? '' : 'rotate-180'}`}
              />
            </button>
            <span className="block truncate text-xl font-extrabold text-primary sm:text-2xl">
              {formatHuf(grandTotal)}
            </span>
          </div>
          <a href="#kapcsolat" className="btn-accent shrink-0 whitespace-nowrap">
            Kérem az ajánlatot
          </a>
        </div>
      </div>
    </section>
  );
}
