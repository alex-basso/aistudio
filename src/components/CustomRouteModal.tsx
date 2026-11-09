import React, { useState } from 'react';
import { Route, Waypoint, DifficultyLevel, WaypointType } from '../types';
import { X, Route as RouteIcon, Plus, Trash2, MapPin, Clock } from 'lucide-react';

interface CustomRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRoute: (route: Route) => void;
}

export const CustomRouteModal: React.FC<CustomRouteModalProps> = ({
  isOpen,
  onClose,
  onSaveRoute,
}) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Farroupilha - Interior');
  const [distanceKm, setDistanceKm] = useState(40);
  const [durationEst, setDurationEst] = useState('4h00');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Média');
  const [elevationGainM, setElevationGainM] = useState(480);
  const [description, setDescription] = useState('');
  const [terrainInput, setTerrainInput] = useState('Barro Vermelho, Pedras, Estradão');

  const [waypoints, setWaypoints] = useState<
    { title: string; locationName: string; timeSuggested: string; type: WaypointType }[]
  >([
    {
      title: 'Ponto de Partida',
      locationName: 'Farroupilha',
      timeSuggested: '08:00',
      type: 'encontro',
    },
    {
      title: 'Trilha Principal & Desafio',
      locationName: 'Interior de Farroupilha',
      timeSuggested: '09:30',
      type: 'trilha',
    },
    {
      title: 'Retorno & Confraternização',
      locationName: 'Farroupilha',
      timeSuggested: '12:30',
      type: 'chegada',
    },
  ]);

  if (!isOpen) return null;

  const handleAddWaypoint = () => {
    setWaypoints([
      ...waypoints,
      {
        title: `Parada #${waypoints.length + 1}`,
        locationName: 'Ponto na trilha',
        timeSuggested: '10:30',
        type: 'mirante',
      },
    ]);
  };

  const handleRemoveWaypoint = (index: number) => {
    if (waypoints.length <= 1) return;
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const handleUpdateWaypoint = (index: number, field: string, value: string) => {
    const updated = [...waypoints];
    updated[index] = { ...updated[index], [field]: value };
    setWaypoints(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const terrainArray = terrainInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const formattedWaypoints: Waypoint[] = waypoints.map((wp, idx) => ({
      id: `wp-cust-${Date.now()}-${idx}`,
      order: idx + 1,
      title: wp.title.trim() || `Parada #${idx + 1}`,
      type: wp.type,
      timeSuggested: wp.timeSuggested,
      description: `Parada técnica programada na rota de Farroupilha.`,
      locationName: wp.locationName.trim() || 'Interior de Farroupilha',
    }));

    const newRoute: Route = {
      id: `rota-custom-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      region: region.trim(),
      distanceKm: Number(distanceKm) || 35,
      durationEst: durationEst.trim() || '4h00',
      difficulty,
      terrain: terrainArray.length > 0 ? terrainArray : ['Terra Batida', 'Cascalho'],
      elevationGainM: Number(elevationGainM) || 450,
      description:
        description.trim() ||
        `Rota personalizada criada para os trilheiros de Farroupilha, com ${distanceKm} km e paradas estratégicas.`,
      imageUrl: '/src/assets/images/nova_milano_dirt_road_1794264738492.jpg',
      waypoints: formattedWaypoints,
      isCustom: true,
    };

    onSaveRoute(newRoute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14171d] rounded-2xl border border-[#2a313e] w-full max-w-xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#181d24] border-b border-[#2a313e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <RouteIcon className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide">
              Criar Rota Personalizada Livre
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
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Nome da Rota Proposta *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Trilha da Linha 30 & Ponte dos Arcos"
              className="w-full px-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Região em Farroupilha
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ex: Linha 30 / Nova Sardenha"
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nível de Dificuldade
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Leve">Leve (Estradão / Mistas)</option>
                <option value="Média">Média (Barro e Pedras)</option>
                <option value="Difícil">Difícil (Subidas e Valos)</option>
                <option value="Hard Enduro">Hard Enduro (Extremo)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Distância (km)
              </label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Tempo Estimado
              </label>
              <input
                type="text"
                value={durationEst}
                onChange={(e) => setDurationEst(e.target.value)}
                placeholder="4h30"
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Desnível (+m)
              </label>
              <input
                type="number"
                value={elevationGainM}
                onChange={(e) => setElevationGainM(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Tipos de Terreno (separados por vírgula)
            </label>
            <input
              type="text"
              value={terrainInput}
              onChange={(e) => setTerrainInput(e.target.value)}
              placeholder="Ex: Barro Vermelho, Pedras, Travessia de Rio, Lajeado"
              className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Waypoints / Paradas */}
          <div className="space-y-2 pt-2 border-t border-[#232936]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">
                Paradas & Waypoints da Rota
              </label>
              <button
                type="button"
                onClick={handleAddWaypoint}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Parada</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {waypoints.map((wp, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-lg bg-[#181d24] border border-[#252b36] flex items-center gap-2"
                >
                  <span className="text-xs font-mono font-bold text-zinc-500 shrink-0">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={wp.title}
                    onChange={(e) => handleUpdateWaypoint(index, 'title', e.target.value)}
                    placeholder="Nome da parada"
                    className="flex-1 px-2 py-1 bg-[#12151b] border border-[#2b3342] rounded text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="time"
                    value={wp.timeSuggested}
                    onChange={(e) =>
                      handleUpdateWaypoint(index, 'timeSuggested', e.target.value)
                    }
                    className="w-20 px-1 py-1 bg-[#12151b] border border-[#2b3342] rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                  {waypoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWaypoint(index)}
                      className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232936]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              Salvar Rota Proposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
