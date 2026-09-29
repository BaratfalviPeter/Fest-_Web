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

// Színek: kék = festendő fal, narancs = tapéta eltávolítása.
const PAINT_COLOR = '#2563eb'; // blue-600
const WALLPAPER_COLOR = '#f97316'; // orange-500

/**
 * Interaktív 2D felülnézeti rajz (SVG).
 * - halvány mérnöki rácsminta a szoba belsejében
 * - a 4 fal 4 különálló, vastag szakasz; a sarkoknál 45°-ban vágott végek,
 *   szándékos réssel, hogy elkülönüljenek
 * - a méret-feliratok lekerekített, fehér, árnyékolt kapszulákban (badge) lebegnek
 * - kattintásra a fal narancsra vált -> tapéta eltávolítás felár
 */
export default function WallDiagram({ room, onToggleWall }: Props) {
  const vb = 300;
  const margin = 46; // hely a badge-eknek a falakon kívül
  const gap = 6; // szándékos rés a sarkoknál (a 45°-os vágás miatt)
  const stroke = 16; // falvastagság

  // A rajz arányos a szoba méreteivel, de belefér a keretbe.
  const maxDim = Math.max(room.width, room.length, 0.1);
  const usable = vb - margin * 2;
  const boxW = (room.width / maxDim) * usable;
  const boxH = (room.length / maxDim) * usable;

  const x0 = (vb - boxW) / 2;
  const y0 = (vb - boxH) / 2;
  const x1 = x0 + boxW;
  const y1 = y0 + boxH;

  const isActive = (w: WallId) => room.wallpaperWalls.includes(w);
  const colorFor = (w: WallId) => (isActive(w) ? WALLPAPER_COLOR : PAINT_COLOR);

  const t = stroke / 2; // falvastagság fele (a középvonaltól kifelé/befelé)

  // Minden falat vastag, 45°-ban gérvágott végű poligonként rajzolunk.
  // A "gap" a sarkokban látható szándékos rés, ami elkülöníti a 4 szakaszt.
  // A pontok a fal külső és belső élét követik, a végeken 45°-os vágással.
  const wallPolygon = (w: WallId): string => {
    switch (w) {
      case 'top':
        return [
          [x0 + gap, y0 - t],
          [x1 - gap, y0 - t],
          [x1 - gap - t, y0 + t],
          [x0 + gap + t, y0 + t],
        ]
          .map((p) => p.join(','))
          .join(' ');
      case 'bottom':
        return [
          [x1 - gap, y1 + t],
          [x0 + gap, y1 + t],
          [x0 + gap + t, y1 - t],
          [x1 - gap - t, y1 - t],
        ]
          .map((p) => p.join(','))
          .join(' ');
      case 'right':
        return [
          [x1 + t, y0 + gap],
          [x1 + t, y1 - gap],
          [x1 - t, y1 - gap - t],
          [x1 - t, y0 + gap + t],
        ]
          .map((p) => p.join(','))
          .join(' ');
      case 'left':
        return [
          [x0 - t, y1 - gap],
          [x0 - t, y0 + gap],
          [x0 + t, y0 + gap + t],
          [x0 + t, y1 - gap - t],
        ]
          .map((p) => p.join(','))
          .join(' ');
    }
  };

  const wall = (w: WallId) => (
    <polygon
      key={w}
      points={wallPolygon(w)}
      fill={colorFor(w)}
      role="button"
      tabIndex={0}
      aria-pressed={isActive(w)}
      aria-label={`${WALL_LABELS[w]} – tapéta eltávolítás ${isActive(w) ? 'bekapcsolva' : 'kikapcsolva'}`}
      className="cursor-pointer transition-colors duration-150 hover:opacity-80"
      onClick={() => onToggleWall(w)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleWall(w);
        }
      }}
    />
  );

  // Lekerekített, fehér, árnyékolt badge egy felirathoz (méret-kapszula).
  const Badge = ({
    cx,
    cy,
    text,
    vertical = false,
  }: {
    cx: number;
    cy: number;
    text: string;
    vertical?: boolean;
  }) => {
    const w = 40;
    const h = 22;
    return (
      <g transform={vertical ? `rotate(-90 ${cx} ${cy})` : undefined} style={{ pointerEvents: 'none' }}>
        <rect
          x={cx - w / 2}
          y={cy - h / 2}
          width={w}
          height={h}
          rx={11}
          fill="#ffffff"
          filter="url(#badge-shadow)"
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-700"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          {text}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center text-sm font-medium text-gray-600">
        Kattintson azokra a falakra, ahonnan tapétát kell eltávolítanunk!
      </p>

      <svg
        viewBox={`0 0 ${vb} ${vb}`}
        className="h-72 w-72 touch-manipulation select-none"
        aria-label="Szoba felülnézeti rajz, kattintható falakkal"
      >
        <defs>
          {/* Halvány mérnöki rácsminta */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
          {/* Lágy árnyék a méret-badge-ekhez */}
          <filter id="badge-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Padló + rács */}
        <rect x={x0} y={y0} width={boxW} height={boxH} fill="#fafafa" />
        <rect x={x0} y={y0} width={boxW} height={boxH} fill="url(#grid)" />
        <rect
          x={x0}
          y={y0}
          width={boxW}
          height={boxH}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Falak – 4 különálló, 45°-ban gérvágott szakasz */}
        {wall('top')}
        {wall('right')}
        {wall('bottom')}
        {wall('left')}

        {/* Méret badge-ek a falakon kívül, középre igazítva */}
        <Badge cx={(x0 + x1) / 2} cy={y0 - 24} text={`${room.width} m`} />
        <Badge cx={(x0 + x1) / 2} cy={y1 + 24} text={`${room.width} m`} />
        <Badge cx={x0 - 24} cy={(y0 + y1) / 2} text={`${room.length} m`} vertical />
        <Badge cx={x1 + 24} cy={(y0 + y1) / 2} text={`${room.length} m`} vertical />
      </svg>

      {/* Jelmagyarázat */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span className="font-semibold text-gray-700">Jelmagyarázat:</span>
        <span className="flex items-center gap-2 text-gray-600">
          <span
            className="inline-block h-3.5 w-5 rounded-[3px]"
            style={{ backgroundColor: PAINT_COLOR }}
          />
          Festendő fal
        </span>
        <span className="flex items-center gap-2 text-gray-600">
          <span
            className="inline-block h-3.5 w-5 rounded-[3px]"
            style={{ backgroundColor: WALLPAPER_COLOR }}
          />
          Tapéta eltávolítása
        </span>
      </div>
    </div>
  );
}
