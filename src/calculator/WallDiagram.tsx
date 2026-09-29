import type { Room, WallId } from './types';

interface Props {
  room: Room;
  onToggleWall: (wall: WallId) => void;
}

const WALL_LABELS: Record<WallId, string> = {
  top: 'Felső fal',
  right: 'Jobb fal',
  bottom: 'Alsó fal',
  left: 'Bal fal',
};

/**
 * Interaktív 2D felülnézeti rajz.
 * A téglalap a megadott szélesség/hosszúság arányait követi.
 * A 4 fal 4 különálló, vastag, jól kattintható vonal.
 * Kattintásra a fal pirosra vált -> tapéta eltávolítás felár.
 */
export default function WallDiagram({ room, onToggleWall }: Props) {
  // A rajz arányos legyen a szoba méreteivel, de férjen bele egy fix keretbe.
  const maxDim = Math.max(room.width, room.length, 0.1);
  const boxW = (room.width / maxDim) * 200;
  const boxH = (room.length / maxDim) * 200;

  // A rajz középre igazítása egy 260x260 viewBox-ban.
  const vb = 260;
  const x0 = (vb - boxW) / 2;
  const y0 = (vb - boxH) / 2;
  const x1 = x0 + boxW;
  const y1 = y0 + boxH;

  const isActive = (w: WallId) => room.wallpaperWalls.includes(w);
  const strokeFor = (w: WallId) => (isActive(w) ? '#dc2626' : '#1d4ed8');

  const wallProps = (w: WallId) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-pressed': isActive(w),
    'aria-label': `${WALL_LABELS[w]} – tapéta eltávolítás ${isActive(w) ? 'bekapcsolva' : 'kikapcsolva'}`,
    stroke: strokeFor(w),
    strokeWidth: 14,
    strokeLinecap: 'round' as const,
    className: 'cursor-pointer transition-colors duration-150 hover:opacity-80',
    onClick: () => onToggleWall(w),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggleWall(w);
      }
    },
  });

  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-center text-sm font-medium text-gray-600">
        Kattintson azokra a falakra, ahonnan tapétát kell eltávolítanunk!
      </p>
      <svg
        viewBox={`0 0 ${vb} ${vb}`}
        className="h-56 w-56 touch-manipulation select-none"
        aria-label="Szoba felülnézeti rajz, kattintható falakkal"
      >
        {/* Padló kitöltés */}
        <rect x={x0} y={y0} width={boxW} height={boxH} fill="#eff6ff" rx={4} />

        {/* Falak (kattintható vonalak) */}
        <line x1={x0} y1={y0} x2={x1} y2={y0} {...wallProps('top')} />
        <line x1={x1} y1={y0} x2={x1} y2={y1} {...wallProps('right')} />
        <line x1={x1} y1={y1} x2={x0} y2={y1} {...wallProps('bottom')} />
        <line x1={x0} y1={y1} x2={x0} y2={y0} {...wallProps('left')} />

        {/* Méret feliratok */}
        <text x={vb / 2} y={y0 - 6} textAnchor="middle" className="fill-gray-500 text-[11px]">
          {room.width} m
        </text>
        <text
          x={x1 + 10}
          y={vb / 2}
          textAnchor="middle"
          transform={`rotate(90 ${x1 + 10} ${vb / 2})`}
          className="fill-gray-500 text-[11px]"
        >
          {room.length} m
        </text>
      </svg>

      {/* Jelmagyarázat */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-4 rounded-sm bg-primary" /> Festendő fal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-4 rounded-sm bg-red-600" /> Tapéta eltávolítás
        </span>
      </div>
    </div>
  );
}
