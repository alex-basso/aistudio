import React from 'react';
import { Compass, Calendar, Route, Users, ShieldAlert, Plus, Smartphone } from 'lucide-react';

interface TopBarProps {
  activeTab: 'passeios' | 'rotas' | 'participantes' | 'seguranca';
  setActiveTab: (tab: 'passeios' | 'rotas' | 'participantes' | 'seguranca') => void;
  onOpenNewRide: () => void;
  onOpenInstallModal?: () => void;
  ridesCount: number;
  participantsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRide,
  onOpenInstallModal,
  ridesCount,
  participantsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0f12]/95 backdrop-blur-md border-b border-[#222730] px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Zone: 1-line text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-orange-600/20 text-white">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-heading text-xl lg:text-2xl font-bold tracking-wider text-white uppercase whitespace-nowrap">
              TRILHAS FARROUPILHA
            </span>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
              <span>Serra Gaúcha / RS</span>
              <span aria-hidden="true">·</span>
              <span>Passeios aos Sábados</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: clean typography, single line */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 p-1 bg-[#161a22] rounded-xl border border-[#232936]">
          <button
            onClick={() => setActiveTab('passeios')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'passeios'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Passeios de Sábado</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
              {ridesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rotas')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'rotas'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Route className="w-4 h-4 shrink-0" />
            <span>Rotas & Trilhas</span>
          </button>

          <button
            onClick={() => setActiveTab('participantes')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'participantes'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Participantes</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
              {participantsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('seguranca')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'seguranca'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Checklist & SOS</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Como instalar no celular"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#1c222c] hover:bg-[#252c38] text-zinc-300 hover:text-white border border-[#2d3544] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden lg:inline">Instalar App</span>
            </button>
          )}

          <button
            onClick={onOpenNewRide}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] rounded-xl shadow-lg shadow-orange-600/25 transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Novo Passeio</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-[#1e232c] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('passeios')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'passeios' ? 'bg-orange-600 text-white' : 'text-zinc-400'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sábados</span>
        </button>
        <button
          onClick={() => setActiveTab('rotas')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'rotas' ? 'bg-orange-600 text-white' : 'text-zinc-400'
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>Rotas</span>
        </button>
        <button
          onClick={() => setActiveTab('participantes')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'participantes' ? 'bg-orange-600 text-white' : 'text-zinc-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pilotos</span>
        </button>
        <button
          onClick={() => setActiveTab('seguranca')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'seguranca' ? 'bg-orange-600 text-white' : 'text-zinc-400'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Checklist</span>
        </button>
      </div>
    </header>
  );
};
