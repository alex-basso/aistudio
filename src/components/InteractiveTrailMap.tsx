import React, { useState } from 'react';
import { Route, Waypoint } from '../types';
import { MapPin, Navigation, Mountain, Clock, Flag, Fuel, Coffee, AlertTriangle } from 'lucide-react';

interface InteractiveTrailMapProps {
  route: Route;
  departureTime?: string;
  arrivalTime?: string;
}

export const InteractiveTrailMap: React.FC<InteractiveTrailMapProps> = ({
  route,
  departureTime = '08:00',
  arrivalTime = '13:00',
}) => {
  const [selectedWpId, setSelectedWpId] = useState<string | null>(
    route.waypoints[0]?.id || null
  );

  const selectedWaypoint =
    route.waypoints.find((w) => w.id === selectedWpId) || route.waypoints[0];

  // Map coordinates representation for Farroupilha regions
  // We can render a stylized, topography SVG map of Farroupilha interior
  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'encontro':
        return <Flag className="w-3.5 h-3.5 text-amber-400" />;
      case 'combustivel':
        return <Fuel className="w-3.5 h-3.5 text-blue-400" />;
      case 'almoco':
        return <Coffee className="w-3.5 h-3.5 text-emerald-400" />;
      case 'obstaculo':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'mirante':
        return <Mountain className="w-3.5 h-3.5 text-purple-400" />;
      case 'chegada':
        return <Flag className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Navigation className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  return (
    <div className="bg-[#14171d] rounded-2xl border border-[#262c36] overflow-hidden flex flex-col">
      {/* Map Header */}
      <div className="px-5 py-3.5 bg-[#181d24] border-b border-[#262c36] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-orange-500" />
          <h3 className="text-base font-bold text-white tracking-wide uppercase font-heading">
            Mapa Esquemático & Altimetria · {route.region}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>Saída: <strong className="text-white font-mono">{departureTime}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Chegada: <strong className="text-white font-mono">{arrivalTime}</strong></span>
          <span aria-hidden="true">·</span>
          <span>{route.waypoints.length} waypoints</span>
        </div>
      </div>

      {/* Stylized Visual Vector Map of Farroupilha Trail */}
      <div className="relative w-full h-72 sm:h-80 bg-[#0e1116] overflow-hidden border-b border-[#262c36] select-none">
        {/* Topographic Background Contour Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="topo-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#475569"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-grid)" />
          {/* Topographic organic elevation lines */}
          <path
            d="M -50 120 Q 150 40 350 140 T 750 100 T 1150 160"
            fill="none"
            stroke="#ea580c"
            strokeWidth="1.2"
            opacity="0.4"
          />
          <path
            d="M -30 180 Q 200 100 450 200 T 850 170 T 1250 220"
            fill="none"
            stroke="#d97706"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M -20 240 Q 180 220 500 270 T 900 240 T 1300 280"
            fill="none"
            stroke="#64748b"
            strokeWidth="0.8"
            opacity="0.3"
          />
        </svg>

        {/* Trail Path Line with Animated Pulse */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 320"
          preserveAspectRatio="none"
        >
          {/* Shadow track */}
          <path
            d="M 80 230 C 180 180, 240 260, 360 160 S 520 80, 620 180 S 700 120, 720 140"
            fill="none"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          {/* Mud / Dirt Trail line */}
          <path
            d="M 80 230 C 180 180, 240 260, 360 160 S 520 80, 620 180 S 700 120, 720 140"
            fill="none"
            stroke="#ea580c"
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Farroupilha Geographic Anchors */}
        <div className="absolute top-4 left-6 text-[11px] font-semibold text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-sm pointer-events-none">
          Trevo RST-453 · Farroupilha Centro
        </div>
        <div className="absolute bottom-4 right-6 text-[11px] font-semibold text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-sm pointer-events-none">
          Vale dos Vinhedos / Cânions do Interior
        </div>

        {/* Interactive Waypoint Pins */}
        <div className="absolute inset-0">
          {route.waypoints.map((wp, index) => {
            const total = route.waypoints.length;
            // Distribute points along the curve
            const leftPct = 10 + (index / Math.max(1, total - 1)) * 80;
            // Wave curve vertical positioning
            const verticalOffsets = [70, 52, 68, 35, 55, 42];
            const topPct = verticalOffsets[index % verticalOffsets.length];

            const isSelected = selectedWpId === wp.id;

            return (
              <div
                key={wp.id}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 group"
                onClick={() => setSelectedWpId(wp.id)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-xl transition-all ${
                    isSelected
                      ? 'bg-orange-600 border-white text-white ring-4 ring-orange-500/30 scale-110'
                      : 'bg-[#181d24] border-zinc-500 text-zinc-200 hover:border-orange-400'
                  }`}
                >
                  {getWaypointIcon(wp.type)}
                </div>

                {/* Pin Tooltip */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#1a1f29] border border-[#2f3747] text-white text-[11px] px-2.5 py-1 rounded-md shadow-2xl pointer-events-none transition-opacity duration-150 ${
                    isSelected
                      ? 'opacity-100 z-30'
                      : 'opacity-0 group-hover:opacity-100 z-10'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="text-orange-400 font-mono">
                      {wp.timeSuggested}
                    </span>
                    <span>{wp.title}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate max-w-[180px]">
                    {wp.locationName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Waypoint Detail Card */}
      {selectedWaypoint && (
        <div className="p-4 sm:p-5 bg-[#171b22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded">
                Parada #{selectedWaypoint.order} · {selectedWaypoint.timeSuggested}
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                {selectedWaypoint.type}
              </span>
            </div>
            <h4 className="text-lg font-bold text-white font-heading tracking-wide">
              {selectedWaypoint.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>{selectedWaypoint.locationName}</span>
              {selectedWaypoint.elevationM && (
                <>
                  <span aria-hidden="true" className="text-zinc-500">·</span>
                  <span className="font-mono text-zinc-400">
                    Alt: {selectedWaypoint.elevationM}m
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              {selectedWaypoint.description}
            </p>
          </div>

          {/* Quick Waypoint Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-center">
            {route.waypoints.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setSelectedWpId(wp.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                  selectedWpId === wp.id
                    ? 'bg-orange-600 border-orange-500 text-white'
                    : 'bg-[#1e2430] border-[#2c3444] text-zinc-300 hover:text-white hover:border-zinc-500'
                }`}
              >
                #{wp.order} {wp.timeSuggested}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Altitude & Terrain Profile Bar */}
      <div className="px-5 py-3 bg-[#11141a] border-t border-[#262c36] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-orange-500" />
          <span className="text-zinc-300 font-medium">Elevação da Serra:</span>
          <span className="font-mono text-white font-bold">
            +{route.elevationGainM}m acumulados
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 text-[11px]">Tipo de Terreno:</span>
          {route.terrain.map((t, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#1d222c] border border-[#2e3746] text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
