import { useMemo, useState } from 'react';
import { Plus, Calculator as CalcIcon, Info } from 'lucide-react';
import type { Room } from './types';
import { DEFAULT_ROOM, formatHuf } from './constants';
import { calcGrandTotal } from './calc';
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
    paintCeiling: DEFAULT_ROOM.paintCeiling,
    wallpaperWalls: [],
    condition: 'excellent',
  };
}

export default function Calculator() {
  const [rooms, setRooms] = useState<Room[]>(() => [createRoom('1. szoba')]);

  const grandTotal = useMemo(() => calcGrandTotal(rooms), [rooms]);

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
                  Összesített várható költség ({rooms.length}{' '}
                  {rooms.length === 1 ? 'szoba' : 'szoba'})
                </span>
                <div className="text-3xl font-extrabold sm:text-4xl">{formatHuf(grandTotal)}</div>
              </div>
              <CalcIcon className="hidden h-12 w-12 text-white/30 sm:block" />
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Az árkalkuláció tájékoztató jellegű. A pontos árat az ingyenes helyszíni felmérés
              során rögzítjük.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky összeg sáv (főleg mobilon) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="section-container flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <span className="block text-xs font-medium text-gray-500">
              Összesített várható költség
            </span>
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
