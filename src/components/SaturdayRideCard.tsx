import React, { useState, useEffect } from 'react';
import { Ride, Route, Participant, WeatherForecastResult } from '../types';
import { formatDatePtBr, formatDateShort } from '../utils/storage';
import { fetchFarroupilhaWeather } from '../services/weatherService';
import {
  Calendar,
  Clock,
  MapPin,
  Route as RouteIcon,
  Users,
  Share2,
  CheckCircle2,
  UserPlus,
  Edit3,
  Flag,
  CloudRain,
  CloudSun,
  AlertTriangle,
  RefreshCw,
  Droplets,
  Thermometer,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface SaturdayRideCardProps {
  ride: Ride;
  route: Route;
  participants: Participant[];
  onOpenWhatsAppBriefing: () => void;
  onOpenAddParticipant: () => void;
  onEditRide: () => void;
  onSelectTab: (tab: 'passeios' | 'rotas' | 'participantes' | 'seguranca') => void;
}

export const SaturdayRideCard: React.FC<SaturdayRideCardProps> = ({
  ride,
  route,
  participants,
  onOpenWhatsAppBriefing,
  onOpenAddParticipant,
  onEditRide,
  onSelectTab,
}) => {
  const [weather, setWeather] = useState<WeatherForecastResult | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [simulateMode, setSimulateMode] = useState<'none' | 'heavy_rain' | 'clear'>('none');

  const confirmedParticipants = participants.filter(
    (p) => p.presenceStatus === 'confirmado' || p.presenceStatus === 'presente'
  );

  const presentAtStart = participants.filter(
    (p) => p.presenceStatus === 'presente'
  );

  // Fetch weather forecast whenever ride date or simulation changes
  const checkWeather = async (simulate: 'none' | 'heavy_rain' | 'clear' = simulateMode) => {
    setLoadingWeather(true);
    try {
      const data = await fetchFarroupilhaWeather(
        ride.date,
        simulate === 'none' ? undefined : simulate
      );
      setWeather(data);
    } catch (err) {
      console.error('Falha ao verificar clima:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    checkWeather(simulateMode);
  }, [ride.date, simulateMode]);

  const handleToggleSimulation = (mode: 'heavy_rain' | 'clear') => {
    const nextMode = simulateMode === mode ? 'none' : mode;
    setSimulateMode(nextMode);
  };

  // Difficulty badge styling
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Leve':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      case 'Média':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'Difícil':
        return 'text-orange-400 bg-orange-950/60 border-orange-800';
      case 'Hard Enduro':
        return 'text-rose-400 bg-rose-950/60 border-rose-800';
      default:
        return 'text-zinc-300 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#181d24] to-[#12151b] border border-[#2b3342] overflow-hidden shadow-2xl">
      {/* Top Banner with Background Photo Scrim */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <img
          src={route.imageUrl || '/src/assets/images/farroupilha_trail_hero_1794264738421.jpg'}
          alt={route.name}
          className="w-full h-full object-cover object-center filter brightness-75 hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Measured Dark Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181d24] via-[#181d24]/60 to-black/30" />

        {/* Date and Status Chips */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {ride.dayOfWeekName || 'SÁBADO'} · {formatDateShort(ride.date)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {weather?.hasHeavyRain && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600/90 text-white shadow-lg backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta Chuva Forte</span>
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-600/90 text-white shadow-lg backdrop-blur-md uppercase tracking-wider">
              Passeio Confirmado
            </span>
          </div>
        </div>

        {/* Title on Scrim */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-wide uppercase drop-shadow-md">
            {ride.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1">
            <span className="font-semibold text-orange-400">Farroupilha / RS</span>
            <span aria-hidden="true">·</span>
            <span>{formatDatePtBr(ride.date)}</span>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Weather Forecast & Heavy Rain Alert Integration */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            weather?.hasHeavyRain
              ? 'bg-gradient-to-r from-rose-950/70 via-[#201518] to-[#1a1417] border-rose-600/80 shadow-lg shadow-rose-950/30'
              : weather?.alertLevel === 'atencao_lama'
              ? 'bg-amber-950/30 border-amber-600/60 text-zinc-200'
              : 'bg-[#151921] border-[#252c38]'
          }`}
        >
          {/* Header of Weather Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  weather?.hasHeavyRain
                    ? 'bg-rose-600 text-white'
                    : 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                }`}
              >
                {weather?.hasHeavyRain ? (
                  <CloudRain className="w-5 h-5 animate-bounce" />
                ) : (
                  <CloudSun className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Previsão para Sábado · Farroupilha/RS
                  </span>
                  {weather?.searchSource && (
                    <span className="hidden sm:inline text-[10px] text-zinc-400">
                      (Busca Integrada)
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-3">
                  <span>{weather?.weatherDescription || 'Consultando previsão...'}</span>
                </div>
              </div>
            </div>

            {/* Quick Weather Metrics & Refresh Button */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              {weather && (
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      {weather.temperatureMin}°C - {weather.temperatureMax}°C
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {weather.precipitationProbability}% ({weather.precipitationMm}mm)
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => checkWeather(simulateMode)}
                disabled={loadingWeather}
                title="Atualizar busca meteorológica"
                className="p-1.5 rounded-lg bg-[#222834] hover:bg-[#2c3342] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loadingWeather ? 'animate-spin text-orange-400' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* CRITICAL HEAVY RAIN ALERT BANNER */}
          {weather?.hasHeavyRain ? (
            <div className="pt-3.5 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide font-heading">
                    {weather.alertTitle}
                  </h4>
                  <p className="text-xs text-rose-100/90 leading-relaxed pt-0.5">
                    {weather.alertMessage}
                  </p>
                </div>
              </div>

              {/* Safety Trail Precautions in Mud/Rain */}
              <div className="p-3 rounded-lg bg-black/40 border border-rose-900/60 space-y-1.5">
                <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Recomendações e Cautela Extra nas Trilhas de Farroupilha:</span>
                </div>
                <ul className="space-y-1 text-xs text-zinc-200">
                  {weather.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">⚠️</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="pt-2 text-xs text-zinc-300 flex items-center justify-between">
              <span>{weather?.alertMessage}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Trilhas com boa aderência</span>
              </span>
            </div>
          )}

          {/* Simulation Toggle Controls for Testing Alert */}
          <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap text-[11px]">
            <span className="text-zinc-400">
              Teste de previsão:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleToggleSimulation('heavy_rain')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  simulateMode === 'heavy_rain'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-[#212733] text-zinc-400 hover:text-white'
                }`}
              >
                🌧️ Simular Chuva Forte (Ativar Alerta)
              </button>
              <button
                type="button"
                onClick={() => handleToggleSimulation('clear')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  simulateMode === 'clear'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#212733] text-zinc-400 hover:text-white'
                }`}
              >
                ☀️ Simular Tempo Bom
              </button>
              {simulateMode !== 'none' && (
                <button
                  type="button"
                  onClick={() => setSimulateMode('none')}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Tempo Real
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Horários Oficiais do Passeio: Encontro, Saída, Chegada */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#1d232c] border border-[#2b3342] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Concentração
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {ride.meetingTime}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1d232c] border border-orange-500/30 flex items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                Horário de Saída
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {ride.departureTime}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1d232c] border border-[#2b3342] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Previsão de Retorno
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {ride.arrivalTimeEstimated}
              </div>
            </div>
          </div>
        </div>

        {/* Ponto de Encontro & Rota Proposta Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ponto de Encontro */}
          <div className="p-4 rounded-xl bg-[#181d25] border border-[#262c38] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Ponto de Encontro & Largada</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {ride.meetingPoint}
            </p>
            <p className="text-xs text-zinc-400">
              Chegar 20 min antes com tanque cheio para conferência dos pneus e lista de chamada.
            </p>
          </div>

          {/* Rota Proposta */}
          <div className="p-4 rounded-xl bg-[#181d25] border border-[#262c38] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <RouteIcon className="w-4 h-4 text-orange-500" />
                <span>Rota Proposta</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getDifficultyColor(
                  route.difficulty
                )}`}
              >
                {route.difficulty}
              </span>
            </div>
            <div
              className="text-sm font-bold text-white hover:text-orange-400 cursor-pointer transition-colors"
              onClick={() => onSelectTab('rotas')}
            >
              {route.name}
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span><strong>{route.distanceKm} km</strong> de percurso</span>
              <span aria-hidden="true">·</span>
              <span><strong>+{route.elevationGainM}m</strong> serra</span>
              <span aria-hidden="true">·</span>
              <span><strong>{route.waypoints.length}</strong> paradas</span>
            </div>
          </div>
        </div>

        {/* Participantes & Vagas do Comboio */}
        <div className="p-4 rounded-xl bg-[#171b22] border border-[#262c38] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Participantes do Comboio
              </span>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              <strong className="text-orange-400 text-sm">
                {confirmedParticipants.length}
              </strong>
              /{ride.maxParticipants} vagas preenchidas
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#121419] rounded-full overflow-hidden border border-[#272d3b]">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (confirmedParticipants.length / ride.maxParticipants) * 100
                )}%`,
              }}
            />
          </div>

          {/* Quick list of participant names */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {participants.slice(0, 5).map((p) => (
                <span
                  key={p.id}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#202530] border border-[#2e3646] text-zinc-300 font-medium"
                >
                  {p.name.split(' ')[0]} {p.motorcycleModel ? `(${p.motorcycleModel})` : ''}
                </span>
              ))}
              {participants.length > 5 && (
                <span className="text-xs text-zinc-400 font-medium">
                  +{participants.length - 5} outros
                </span>
              )}
            </div>

            <button
              onClick={() => onSelectTab('participantes')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Ver lista completa e contatos SOS
            </button>
          </div>

          {presentAtStart.length > 0 && (
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 pt-1 border-t border-[#232834]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{presentAtStart.length} pilotos já presentes no ponto de encontro.</span>
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenWhatsAppBriefing}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar Briefing no WhatsApp</span>
          </button>

          <button
            onClick={onOpenAddParticipant}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#222834] hover:bg-[#2c3342] text-white font-semibold text-xs sm:text-sm border border-[#353e50] transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-orange-400" />
            <span>+ Adicionar Piloto</span>
          </button>

          <button
            onClick={onEditRide}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1b202a] hover:bg-[#232936] text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm border border-[#2a3240] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Passeio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
