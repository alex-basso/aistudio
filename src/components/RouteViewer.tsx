import React, { useState } from 'react';
import { Route, Ride } from '../types';
import {
  Mountain,
  Navigation,
  Clock,
  MapPin,
  Flag,
  Coffee,
  Fuel,
  AlertTriangle,
  Plus,
  Check,
  Compass,
} from 'lucide-react';
import { InteractiveTrailMap } from './InteractiveTrailMap';

interface RouteViewerProps {
  currentRide: Ride;
  allRoutes: Route[];
  activeRoute: Route;
  onSelectRouteForRide: (routeId: string) => void;
  onOpenCustomRouteModal: () => void;
}

export const RouteViewer: React.FC<RouteViewerProps> = ({
  currentRide,
  allRoutes,
  activeRoute,
  onSelectRouteForRide,
  onOpenCustomRouteModal,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(activeRoute.id);
  const route = allRoutes.find((r) => r.id === selectedRouteId) || activeRoute;

  const isAppliedToRide = currentRide.routeId === route.id;

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Leve':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
      case 'Média':
        return 'text-amber-400 bg-amber-950/70 border-amber-800';
      case 'Difícil':
        return 'text-orange-400 bg-orange-950/70 border-orange-800';
      case 'Hard Enduro':
        return 'text-rose-400 bg-rose-950/70 border-rose-800';
      default:
        return 'text-zinc-300 bg-zinc-800 border-zinc-700';
    }
  };

  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'encontro':
        return <Flag className="w-4 h-4 text-amber-400" />;
      case 'combustivel':
        return <Fuel className="w-4 h-4 text-blue-400" />;
      case 'almoco':
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      case 'obstaculo':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'mirante':
        return <Mountain className="w-4 h-4 text-purple-400" />;
      case 'chegada':
        return <Flag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Navigation className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Route Selector Strip & Custom Route Creator CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#14171d] p-4 rounded-2xl border border-[#262c36]">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Catálogo de Rotas de Farroupilha
          </h3>
          <p className="text-xs text-zinc-400">
            Escolha uma das trilhas consagradas da Serra Gaúcha ou crie um trajeto livre para o sábado.
          </p>
        </div>

        <button
          onClick={onOpenCustomRouteModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-400 hover:text-orange-300 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Criar Rota Livre</span>
        </button>
      </div>

      {/* Route Navigation Cards Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {allRoutes.map((r) => {
          const isSelected = r.id === selectedRouteId;
          const isCurrentRide = r.id === currentRide.routeId;

          return (
            <div
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 relative ${
                isSelected
                  ? 'bg-[#1e2430] border-orange-500 ring-2 ring-orange-500/30'
                  : 'bg-[#15181f] border-[#252b37] hover:border-zinc-500 hover:bg-[#191e27]'
              }`}
            >
              {isCurrentRide && (
                <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-orange-600 text-white uppercase tracking-wider">
                  No Sábado Atual
                </div>
              )}

              <div className="space-y-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase inline-block ${getDifficultyBadge(
                    r.difficulty
                  )}`}
                >
                  {r.difficulty}
                </span>
                <h4 className="font-bold text-sm text-white line-clamp-1 font-heading">
                  {r.name}
                </h4>
                <div className="text-[11px] text-zinc-400 truncate">
                  {r.region}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-[#232936]">
                <span className="font-mono font-bold text-white">
                  {r.distanceKm} km
                </span>
                <span>{r.durationEst}</span>
                <span>+{r.elevationGainM}m</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View of Selected Route */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Hero Info & Actions */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-[#14171d] border border-[#262c36] overflow-hidden">
            <div className="relative h-44 w-full">
              <img
                src={route.imageUrl || '/src/assets/images/farroupilha_trail_hero_1794264738421.jpg'}
                alt={route.name}
                className="w-full h-full object-cover filter brightness-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171d] via-[#14171d]/50 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase inline-block mb-1 ${getDifficultyBadge(
                    route.difficulty
                  )}`}
                >
                  {route.difficulty}
                </span>
                <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide">
                  {route.name}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {route.description}
              </p>

              {/* Key Route Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-[#232936]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    Distância
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {route.distanceKm} <span className="text-xs text-zinc-400">km</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    Tempo Est.
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {route.durationEst}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    Desnível
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    +{route.elevationGainM} <span className="text-xs text-zinc-400">m</span>
                  </div>
                </div>
              </div>

              {/* Piso & Terreno */}
              <div>
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Piso Predominante
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {route.terrain.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#1f242e] border border-[#2f3747] text-zinc-300 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Apply to Current Ride */}
              <div className="pt-2">
                {isAppliedToRide ? (
                  <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600/15 border border-orange-500/40 text-orange-400 font-bold text-xs uppercase tracking-wider">
                    <Check className="w-4 h-4" />
                    <span>Esta é a Rota Selecionada para o Sábado</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectRouteForRide(route.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Definir como Rota do Sábado Atual</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map & Waypoints Timeline */}
        <div className="lg:col-span-7 space-y-5">
          <InteractiveTrailMap
            route={route}
            departureTime={currentRide.departureTime}
            arrivalTime={currentRide.arrivalTimeEstimated}
          />

          {/* Waypoints Timeline List */}
          <div className="bg-[#14171d] rounded-2xl border border-[#262c36] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Cronograma de Paradas & Pontos de Apoio
              </h4>
              <span className="text-xs text-zinc-400 font-mono">
                {route.waypoints.length} paradas planejadas
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#28303f]">
              {route.waypoints.map((wp) => (
                <div key={wp.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#181d25] border-2 border-orange-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-orange-400">
                      {wp.order}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181d24] border border-[#242a35] group-hover:border-[#384254] transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded">
                          {wp.timeSuggested}
                        </span>
                        <h5 className="text-sm font-bold text-white font-heading tracking-wide">
                          {wp.title}
                        </h5>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getWaypointIcon(wp.type)}
                        <span className="text-[11px] font-medium text-zinc-400 capitalize hidden sm:inline">
                          {wp.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-300 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{wp.locationName}</span>
                      {wp.elevationM && (
                        <span className="text-zinc-500 text-[11px]">
                          ({wp.elevationM}m)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 pt-1.5 leading-relaxed">
                      {wp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
