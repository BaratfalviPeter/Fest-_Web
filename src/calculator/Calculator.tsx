import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calculator as CalcIcon, Info, ChevronUp, ArrowRight } from 'lucide-react';
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

export default function Calculator() {
  const [rooms, setRooms] = useState<Room[]>(() => [createRoom('1. szoba')]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Zero State: amíg a felhasználó nem módosított semmit, nem mutatunk árat.
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  // A főoldali kapcsolat szekcióhoz navigálás + görgetés.
  const goToContact = () => {
    navigate('/');
    window.setTimeout(() => {
      document.getElementById('kapcsolat')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const grandTotal = useMemo(() => calcGrandTotal(rooms), [rooms]);
  const breakdown = useMemo(() => calcBreakdown(rooms), [rooms]);

  const addRoom = () => {
    setTouched(true);
    setRooms((prev) => [...prev, createRoom(`${prev.length + 1}. szoba`)]);
  };

  const updateRoom = (updated: Room) => {
    setTouched(true);
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const removeRoom = (id: string) => {
    setTouched(true);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="bg-gray-100 py-16 lg:py-20">
      <div className="section-container">
        {/* Szoba kártyák */}
        <div className="mx-auto max-w-3xl space-y-6">
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

          {/* Összesítő – a csúszkák/mezők alatt, magában a komponensben */}
          <div className="rounded-2xl bg-primary p-6 text-white shadow-lg">
            {touched ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white/80">
                      Összesített várható költség ({rooms.length} szoba)
                    </span>
                    <div className="text-3xl font-extrabold sm:text-4xl">
                      {formatHuf(grandTotal)}
                    </div>
                  </div>
                  <CalcIcon className="hidden h-12 w-12 text-white/30 sm:block" />
                </div>

                {/* Részletek – kinyíló tételes bontás */}
                <button
                  type="button"
                  onClick={() => setDetailsOpen((v) => !v)}
                  aria-expanded={detailsOpen}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
                >
                  Részletek
                  <ChevronUp
                    className={`h-4 w-4 transition-transform ${detailsOpen ? '' : 'rotate-180'}`}
                  />
                </button>

                {detailsOpen && (
                  <dl className="mt-3 space-y-1 border-t border-white/20 pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-white/80">Falfelület + mennyezet festése</dt>
                      <dd className="font-semibold">{formatHuf(breakdown.paintCost)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/80">Falállapot szorzó felár</dt>
                      <dd className="font-semibold">{formatHuf(breakdown.conditionSurcharge)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/80">Tapéta eltávolítása</dt>
                      <dd className="font-semibold">{formatHuf(breakdown.wallpaperRemovalCost)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/80">Ajtók mázolása</dt>
                      <dd className="font-semibold">{formatHuf(breakdown.doorsCost)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/80">Radiátorok festése</dt>
                      <dd className="font-semibold">{formatHuf(breakdown.radiatorsCost)}</dd>
                    </div>
                  </dl>
                )}
              </>
            ) : (
              /* Zero State – amíg nincs interakció, nincs előre kiszámolt ár */
              <div className="flex items-center gap-3 py-2">
                <Info className="h-6 w-6 shrink-0 text-white/70" />
                <div>
                  <div className="text-2xl font-extrabold">Kérem, adja meg a méreteket!</div>
                  <span className="text-sm text-white/80">
                    Állítsa be a szoba paramétereit, és azonnal megjelenik a várható költség.
                  </span>
                </div>
              </div>
            )}

            <p className="mt-4 flex items-start gap-2 text-sm text-white/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Az árkalkuláció tájékoztató jellegű. A pontos árat az ingyenes helyszíni felmérés
              során rögzítjük.
            </p>
          </div>

          {/* CTA az ajánlatkéréshez */}
          <div className="text-center">
            <button type="button" onClick={goToContact} className="btn-accent text-lg">
              Kérem az ajánlatot
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
