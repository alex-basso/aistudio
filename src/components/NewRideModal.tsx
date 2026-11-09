import React, { useState, useEffect } from 'react';
import { Ride, Route } from '../types';
import { getUpcomingSaturdays, formatDateShort, formatDatePtBr } from '../utils/storage';
import { X, Calendar, Clock, MapPin, Route as RouteIcon, Users, AlertCircle } from 'lucide-react';

interface NewRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRide: (ride: Ride) => void;
  availableRoutes: Route[];
  existingRide?: Ride | null;
}

export const NewRideModal: React.FC<NewRideModalProps> = ({
  isOpen,
  onClose,
  onSaveRide,
  availableRoutes,
  existingRide,
}) => {
  const upcomingSaturdays = getUpcomingSaturdays(6);

  const [date, setDate] = useState<string>(
    existingRide?.date || upcomingSaturdays[0] || '2026-11-14'
  );
  const [title, setTitle] = useState(
    existingRide?.title || 'Trilhão dos Vales de Farroupilha'
  );
  const [description, setDescription] = useState(
    existingRide?.description ||
      'Passeio de moto e trilheiros pelo interior de Farroupilha, explorando cachoeiras, vales e estradões coloniais.'
  );
  const [meetingPoint, setMeetingPoint] = useState(
    existingRide?.meetingPoint || 'Posto Trevo Farroupilha (RST-453, km 118)'
  );
  const [meetingTime, setMeetingTime] = useState(
    existingRide?.meetingTime || '07:30'
  );
  const [departureTime, setDepartureTime] = useState(
    existingRide?.departureTime || '08:00'
  );
  const [arrivalTimeEstimated, setArrivalTimeEstimated] = useState(
    existingRide?.arrivalTimeEstimated || '13:00'
  );
  const [routeId, setRouteId] = useState(
    existingRide?.routeId || availableRoutes[0]?.id || 'rota-salto-ventoso'
  );
  const [maxParticipants, setMaxParticipants] = useState(
    existingRide?.maxParticipants || 25
  );
  const [briefingNotes, setBriefingNotes] = useState(
    existingRide?.briefingNotes ||
      'Obrigatório capacete fechado, botas de trilha e colete. Tanque cheio na largada. Cada piloto deve levar hidratação.'
  );

  useEffect(() => {
    if (existingRide) {
      setDate(existingRide.date);
      setTitle(existingRide.title);
      setDescription(existingRide.description);
      setMeetingPoint(existingRide.meetingPoint);
      setMeetingTime(existingRide.meetingTime);
      setDepartureTime(existingRide.departureTime);
      setArrivalTimeEstimated(existingRide.arrivalTimeEstimated);
      setRouteId(existingRide.routeId);
      setMaxParticipants(existingRide.maxParticipants);
      setBriefingNotes(existingRide.briefingNotes);
    }
  }, [existingRide]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rideToSave: Ride = {
      id: existingRide ? existingRide.id : `ride-${Date.now()}`,
      date,
      dayOfWeekName: 'Sábado',
      title: title.trim() || 'Passeio de Sábado em Farroupilha',
      description: description.trim(),
      meetingPoint: meetingPoint.trim(),
      meetingTime,
      departureTime,
      arrivalTimeEstimated,
      routeId,
      status: existingRide ? existingRide.status : 'agendado',
      briefingNotes: briefingNotes.trim(),
      maxParticipants: Number(maxParticipants) || 25,
    };

    onSaveRide(rideToSave);
    onClose();
  };

  const MEETING_POINT_SUGGESTIONS = [
    'Posto Trevo Farroupilha (RST-453, km 118)',
    'Praça da Imigração Italiana (Nova Milano - Farroupilha)',
    'Santuário de Caravaggio (Estacionamento Inferior)',
    'Posto Shell Centro (Rua Coronel Pena de Moraes)',
    'Trevo de Acesso à Linha Julieta',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14171d] rounded-2xl border border-[#2a313e] w-full max-w-xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#181d24] border-b border-[#2a313e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide">
              {existingRide ? 'Editar Passeio de Sábado' : 'Agendar Novo Passeio de Sábado'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seletor de Sábados */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Data do Passeio (Sábados Recomendados) *
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {upcomingSaturdays.map((sat: string, idx: number) => (
                <button
                  key={sat}
                  type="button"
                  onClick={() => setDate(sat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    date === sat
                      ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                      : 'bg-[#1b202a] border-[#2b3342] text-zinc-400 hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'Próximo Sáb' : `Sáb ${formatDateShort(sat)}`}
                </button>
              ))}
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-[#1b202a] border border-[#2b3342] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
            />
            <p className="text-[11px] text-zinc-400 pt-1">
              Data selecionada: <strong className="text-white">{formatDatePtBr(date)}</strong>
            </p>
          </div>

          {/* Título do Passeio */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Nome do Passeio / Edição *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Trilhão Salto Ventoso - Edição Primavera"
              className="w-full px-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Horários: Concentração, Saída, Previsão de Chegada */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Concentração *
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1">
                Horário Saída *
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#1b202a] border border-orange-500/50 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Previsão Retorno *
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={arrivalTimeEstimated}
                  onChange={(e) => setArrivalTimeEstimated(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ponto de Encontro */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Ponto de Encontro em Farroupilha *
            </label>
            <input
              type="text"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              placeholder="Ex: Posto Trevo Farroupilha (RST-453)"
              className="w-full px-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 mb-2"
              required
            />
            {/* Quick point chips */}
            <div className="flex flex-wrap gap-1.5">
              {MEETING_POINT_SUGGESTIONS.map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setMeetingPoint(pt)}
                  className="text-[11px] px-2 py-0.5 rounded bg-[#1e2430] border border-[#2d3545] text-zinc-300 hover:text-white hover:border-zinc-500 cursor-pointer"
                >
                  {pt.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Rota Proposta para o Dia */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Rota Proposta para o Dia *
            </label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
            >
              {availableRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.distanceKm} km · Nível {r.difficulty} · {r.region})
                </option>
              ))}
            </select>
          </div>

          {/* Limite de Participantes & Briefing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Limite de Motos
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Avisos do Briefing & Equipamentos
              </label>
              <input
                type="text"
                value={briefingNotes}
                onChange={(e) => setBriefingNotes(e.target.value)}
                placeholder="Ex: Tanque cheio, botas de trilha e colete..."
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232936]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold hover:bg-zinc-800/50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              {existingRide ? 'Salvar Alterações' : 'Criar Passeio do Sábado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
