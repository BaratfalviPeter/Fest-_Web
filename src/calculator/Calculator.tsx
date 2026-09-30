import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calculator as CalcIcon, Info, ChevronUp, ArrowRight, PaintBucket } from 'lucide-react';
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
  // Zero State: üres induló lista – a felület akkor "indul el", ha a
  // felhasználó hozzáad egy szobát.
  const [rooms, setRooms] = useState<Room[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();

  const hasRooms = rooms.length > 0;

  // A főoldali kapcsolat szekcióhoz navigálás + görgetés.
  const goToContact = () => {
    navigate('/');
    window.setTimeout(() => {
      document.getElementById('kapcsolat')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const grandTotal = useMemo(() => calcGrandTotal(rooms), [rooms]);
  const breakdown = useMemo(() => calcBreakdown(rooms), [rooms]);

  const addRoom = () => setRooms((prev) => [...prev, createRoom(`${prev.length + 1}. szoba`)]);

  const updateRoom = (updated: Room) =>
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

  const removeRoom = (id: string) => setRooms((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="bg-gray-100 py-16 lg:py-20">
      <div className="section-container">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Zero State – üres kezdőképernyő, csak a hozzáadás gomb + kedvcsináló szöveg */}
          {!hasRooms ? (
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-white p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalcIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Kezdjük el a kalkulációt!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Adja hozzá az első festendő szobát, állítsa be a méreteket és a paramétereket, és
                azonnal megkapja a várható költséget és a festékszükségletet.
              </p>
              <button
                type="button"
                onClick={addRoom}
                className="btn-primary mt-6 text-lg"
              >
                <Plus className="h-5 w-5" />
                Új szoba hozzáadása
              </button>
            </div>
          ) : (
            <>
              {/* Szoba kártyák */}
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

              {/* Összesítő – a mezők alatt, magában a komponensben */}
              <div className="rounded-2xl bg-primary p-6 text-white shadow-lg">
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

                {/* Becsült festékszükséglet – összesítve */}
                <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <PaintBucket className="h-4 w-4" />
                    Becsült festékszükséglet
                  </span>
                  <span className="text-xl font-extrabold">
                    {breakdown.paintLiters.toFixed(1)} l
                  </span>
                </div>
                <p className="mt-1.5 text-xs italic text-white/70">
                  A szükséges festékmennyiség az eredeti falszíntől, a felülettől és a festék
                  típusától függően változhat, ez az érték csupán iránymutató becslés.
                </p>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
