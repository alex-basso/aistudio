import React, { useState } from 'react';
import { Participant, ExperienceLevel, PresenceStatus } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Trash2,
  Bike,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

interface ParticipantsManagerProps {
  rideTitle: string;
  rideDateFormatted: string;
  maxParticipants: number;
  participants: Participant[];
  onAddParticipant: () => void;
  onDeleteParticipant: (id: string) => void;
  onUpdatePresence: (id: string, status: PresenceStatus) => void;
}

export const ParticipantsManager: React.FC<ParticipantsManagerProps> = ({
  rideTitle,
  rideDateFormatted,
  maxParticipants,
  participants,
  onAddParticipant,
  onDeleteParticipant,
  onUpdatePresence,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | PresenceStatus>('todos');
  const [levelFilter, setLevelFilter] = useState<'todos' | ExperienceLevel>('todos');

  // Filter participants
  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      (p.motorcycleModel && p.motorcycleModel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.emergencyContactName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || p.presenceStatus === statusFilter;
    const matchesLevel = levelFilter === 'todos' || p.experienceLevel === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const confirmedCount = participants.filter(
    (p) => p.presenceStatus === 'confirmado' || p.presenceStatus === 'presente'
  ).length;

  const presentCount = participants.filter((p) => p.presenceStatus === 'presente').length;

  const getExperienceBadge = (level: ExperienceLevel) => {
    switch (level) {
      case 'Iniciante':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
      case 'Intermediário':
        return 'text-amber-400 bg-amber-950/70 border-amber-800';
      case 'Avançado':
        return 'text-orange-400 bg-orange-950/70 border-orange-800';
      case 'Hard Enduro':
        return 'text-rose-400 bg-rose-950/70 border-rose-800';
      default:
        return 'text-zinc-300 bg-zinc-800 border-zinc-700';
    }
  };

  const getCleanPhone = (phone: string) => phone.replace(/\D/g, '');

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#14171d] rounded-2xl border border-[#262c36] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Gestão de Chamada & Segurança</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-wide">
            Participantes do Comboio · {rideTitle}
          </h2>
          <p className="text-xs text-zinc-400 pt-0.5">
            {rideDateFormatted} · {confirmedCount} confirmados ({presentCount} presentes na largada) de {maxParticipants} vagas.
          </p>
        </div>

        <button
          onClick={onAddParticipant}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Cadastrar Piloto</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#14171d] rounded-2xl border border-[#262c36] p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, moto ou contato de emergência..."
              className="w-full pl-10 pr-4 py-2 bg-[#1b202a] border border-[#2b3342] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Nível:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="bg-[#1b202a] border border-[#2b3342] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            >
              <option value="todos">Todos os Níveis</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Hard Enduro">Hard Enduro</option>
            </select>
          </div>
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <span className="text-xs text-zinc-400 mr-1 whitespace-nowrap">Status:</span>
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'todos'
                ? 'bg-orange-600 text-white'
                : 'bg-[#1b202a] text-zinc-400 hover:text-white'
            }`}
          >
            Todos ({participants.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmado')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'confirmado'
                ? 'bg-orange-600 text-white'
                : 'bg-[#1b202a] text-zinc-400 hover:text-white'
            }`}
          >
            Confirmados ({participants.filter((p) => p.presenceStatus === 'confirmado').length})
          </button>
          <button
            onClick={() => setStatusFilter('presente')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'presente'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1b202a] text-zinc-400 hover:text-white'
            }`}
          >
            Presentes na Saída ({presentCount})
          </button>
          <button
            onClick={() => setStatusFilter('pendente')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'pendente'
                ? 'bg-amber-600 text-white'
                : 'bg-[#1b202a] text-zinc-400 hover:text-white'
            }`}
          >
            Pendentes ({participants.filter((p) => p.presenceStatus === 'pendente').length})
          </button>
        </div>
      </div>

      {/* Participants Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#14171d] rounded-2xl border border-[#262c36] p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase font-heading">
            Nenhum participante encontrado
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Não há pilotos cadastrados com esses filtros de busca. Clique no botão acima para adicionar um novo participante ao passeio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const isPresent = p.presenceStatus === 'presente';
            const isConfirmed = p.presenceStatus === 'confirmado';

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                  isPresent
                    ? 'bg-[#141c17] border-emerald-800/80 shadow-md shadow-emerald-950/20'
                    : isConfirmed
                    ? 'bg-[#161a22] border-[#293140]'
                    : 'bg-[#16171b] border-[#252830] opacity-85'
                }`}
              >
                {/* Header: Name, Motorcycle & Delete */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white font-heading tracking-wide">
                        {p.name}
                      </h4>
                      {p.motorcycleModel ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-orange-400 pt-0.5">
                          <Bike className="w-3.5 h-3.5 shrink-0" />
                          <span>{p.motorcycleModel}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-500 pt-0.5">Moto não informada</div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getExperienceBadge(
                          p.experienceLevel
                        )}`}
                      >
                        {p.experienceLevel}
                      </span>
                      <button
                        onClick={() => onDeleteParticipant(p.id)}
                        title="Remover participante"
                        className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Telefone do Piloto */}
                  <div className="flex items-center justify-between text-xs text-zinc-300 pt-1 border-t border-[#232936]">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-mono">{p.phone}</span>
                    </div>

                    <a
                      href={`https://wa.me/55${getCleanPhone(p.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Contato de Emergência (Requisito Crítico de Segurança) */}
                  <div className="p-2.5 rounded-lg bg-[#111419] border border-amber-900/30 space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      <span>Contato de Emergência (SOS)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-zinc-200 font-medium truncate max-w-[150px]">
                        {p.emergencyContactName}
                      </span>
                      <a
                        href={`tel:${getCleanPhone(p.emergencyContactPhone)}`}
                        className="font-mono text-amber-400 hover:text-amber-300 font-bold hover:underline"
                      >
                        {p.emergencyContactPhone}
                      </a>
                    </div>
                  </div>

                  {p.notes && (
                    <p className="text-[11px] text-zinc-400 italic">
                      "{p.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Row: Check-in Presence Toggle */}
                <div className="pt-2 border-t border-[#232936] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-zinc-400 font-medium">
                    Status na Trilha:
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onUpdatePresence(
                          p.id,
                          isPresent ? 'confirmado' : 'presente'
                        )
                      }
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#212733] text-zinc-300 hover:text-white hover:bg-[#2b3342]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isPresent ? 'No Ponto de Saída' : 'Marcar Presente'}</span>
                    </button>

                    {!isPresent && (
                      <select
                        value={p.presenceStatus}
                        onChange={(e) =>
                          onUpdatePresence(p.id, e.target.value as PresenceStatus)
                        }
                        className="bg-[#1b202a] border border-[#2b3342] text-[11px] text-zinc-300 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="confirmado">Confirmado</option>
                        <option value="pendente">Pendente</option>
                        <option value="cancelado">Cancelou</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
