import React, { useState, useEffect } from 'react';
import { Ride, Route, Participant, PresenceStatus } from './types';
import {
  loadRides,
  saveRides,
  loadRoutes,
  saveRoutes,
  loadParticipants,
  saveParticipants,
  formatDateShort,
} from './utils/storage';
import { TopBar } from './components/TopBar';
import { SaturdayRideCard } from './components/SaturdayRideCard';
import { RouteViewer } from './components/RouteViewer';
import { ParticipantsManager } from './components/ParticipantsManager';
import { SafetyChecklist } from './components/SafetyChecklist';
import { NewRideModal } from './components/NewRideModal';
import { AddParticipantModal } from './components/AddParticipantModal';
import { CustomRouteModal } from './components/CustomRouteModal';
import { WhatsAppBriefingModal } from './components/WhatsAppBriefingModal';
import { InstallAppModal } from './components/InstallAppModal';
import { Calendar, Plus, Compass, Sparkles, Check, ChevronRight } from 'lucide-react';

export default function App() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Navigation
  const [activeTab, setActiveTab] = useState<'passeios' | 'rotas' | 'participantes' | 'seguranca'>(
    'passeios'
  );

  // Active Ride selection
  const [selectedRideId, setSelectedRideId] = useState<string>('');

  // Modals
  const [isNewRideModalOpen, setIsNewRideModalOpen] = useState(false);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [isCustomRouteModalOpen, setIsCustomRouteModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Initial Data
  useEffect(() => {
    const loadedRides = loadRides();
    const loadedRoutes = loadRoutes();
    const loadedParticipants = loadParticipants();

    setRides(loadedRides);
    setRoutes(loadedRoutes);
    setParticipants(loadedParticipants);

    if (loadedRides.length > 0) {
      setSelectedRideId(loadedRides[0].id);
    }
  }, []);

  // Save changes to storage
  const handleSaveRide = (rideToSave: Ride) => {
    let updated: Ride[];
    const index = rides.findIndex((r) => r.id === rideToSave.id);
    if (index >= 0) {
      updated = [...rides];
      updated[index] = rideToSave;
      showToast('Passeio atualizado com sucesso!');
    } else {
      updated = [rideToSave, ...rides];
      showToast('Novo passeio de sábado agendado!');
    }

    setRides(updated);
    saveRides(updated);
    setSelectedRideId(rideToSave.id);
  };

  const handleSaveRoute = (newRoute: Route) => {
    const updated = [newRoute, ...routes];
    setRoutes(updated);
    saveRoutes(updated);
    showToast(`Rota "${newRoute.name}" cadastrada!`);

    // Optionally assign to current ride
    if (selectedRideId) {
      const rideIndex = rides.findIndex((r) => r.id === selectedRideId);
      if (rideIndex >= 0) {
        const updatedRides = [...rides];
        updatedRides[rideIndex].routeId = newRoute.id;
        setRides(updatedRides);
        saveRides(updatedRides);
      }
    }
  };

  const handleSelectRouteForRide = (routeId: string) => {
    if (!selectedRideId) return;
    const rideIndex = rides.findIndex((r) => r.id === selectedRideId);
    if (rideIndex >= 0) {
      const updatedRides = [...rides];
      updatedRides[rideIndex].routeId = routeId;
      setRides(updatedRides);
      saveRides(updatedRides);
      const chosen = routes.find((r) => r.id === routeId);
      showToast(`Rota definida para ${chosen?.name || 'o passeio'}!`);
    }
  };

  const handleSaveParticipant = (newParticipant: Participant) => {
    const updated = [newParticipant, ...participants];
    setParticipants(updated);
    saveParticipants(updated);
    showToast(`Piloto ${newParticipant.name} cadastrado no comboio!`);
  };

  const handleDeleteParticipant = (id: string) => {
    const updated = participants.filter((p) => p.id !== id);
    setParticipants(updated);
    saveParticipants(updated);
    showToast('Piloto removido da lista.');
  };

  const handleUpdatePresence = (id: string, status: PresenceStatus) => {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, presenceStatus: status } : p
    );
    setParticipants(updated);
    saveParticipants(updated);
    if (status === 'presente') {
      showToast('Presença confirmada no ponto de saída!');
    }
  };

  // Currently active ride and its route
  const currentRide = rides.find((r) => r.id === selectedRideId) || rides[0];
  const currentRoute =
    routes.find((r) => r.id === currentRide?.routeId) || routes[0];

  const currentParticipants = participants.filter(
    (p) => p.rideId === currentRide?.id
  );

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-200 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-orange-600 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl border border-orange-400/40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRide={() => {
          setEditingRide(null);
          setIsNewRideModalOpen(true);
        }}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        ridesCount={rides.length}
        participantsCount={participants.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Sábados Quick Selector Pill Strip */}
        {rides.length > 0 && (
          <div className="flex items-center justify-between gap-3 bg-[#13161c] px-4 py-2.5 rounded-xl border border-[#212631] overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Passeios de Sábado:
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {rides.map((r, index) => {
                const isSelected = r.id === currentRide?.id;
                const rParts = participants.filter((p) => p.rideId === r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRideId(r.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                        : 'bg-[#1a1f28] text-zinc-400 hover:text-white hover:bg-[#242b38]'
                    }`}
                  >
                    <span>
                      {index === 0 ? 'Próximo Sáb' : `Sáb ${formatDateShort(r.date)}`}
                    </span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-mono">
                      {rParts.length} motos
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setEditingRide(null);
                  setIsNewRideModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-orange-400 hover:text-white hover:bg-orange-600/20 border border-orange-500/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agendar Outro Sábado</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Passeios de Sábado */}
        {activeTab === 'passeios' && currentRide && currentRoute && (
          <div className="space-y-6">
            <SaturdayRideCard
              ride={currentRide}
              route={currentRoute}
              participants={currentParticipants}
              onOpenWhatsAppBriefing={() => setIsWhatsAppModalOpen(true)}
              onOpenAddParticipant={() => setIsAddParticipantModalOpen(true)}
              onEditRide={() => {
                setEditingRide(currentRide);
                setIsNewRideModalOpen(true);
              }}
              onSelectTab={setActiveTab}
            />

            {/* Quick Two-Column View: Interactive Map of the Day's Route & Participants Call Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                      Itinerário Proposto para o Sábado
                    </h3>
                    <button
                      onClick={() => setActiveTab('rotas')}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver todas as rotas de Farroupilha</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <RouteViewer
                    currentRide={currentRide}
                    allRoutes={routes}
                    activeRoute={currentRoute}
                    onSelectRouteForRide={handleSelectRouteForRide}
                    onOpenCustomRouteModal={() => setIsCustomRouteModalOpen(true)}
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                    Lista de Pilotos ({currentParticipants.length})
                  </h3>
                  <button
                    onClick={() => setIsAddParticipantModalOpen(true)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar</span>
                  </button>
                </div>

                <div className="bg-[#14171d] rounded-2xl border border-[#262c36] p-4 space-y-3">
                  {currentParticipants.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 text-xs">
                      Nenhum participante inscrito ainda. Clique em "+ Cadastrar Piloto" para adicionar.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {currentParticipants.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-[#181d24] border border-[#252b36] flex items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-sm text-white font-heading">
                              {p.name}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {p.motorcycleModel || 'Moto'} · {p.experienceLevel}
                            </div>
                            <div className="text-[11px] text-amber-400 font-mono">
                              SOS: {p.emergencyContactName} ({p.emergencyContactPhone})
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdatePresence(
                                  p.id,
                                  p.presenceStatus === 'presente'
                                    ? 'confirmado'
                                    : 'presente'
                                )
                              }
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                p.presenceStatus === 'presente'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#212733] text-zinc-300 hover:text-white'
                              }`}
                            >
                              {p.presenceStatus === 'presente'
                                ? 'No Ponto'
                                : 'Check-in'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#232936] flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Vagas do Comboio:
                    </span>
                    <span className="font-mono font-bold text-white">
                      {currentParticipants.length} / {currentRide.maxParticipants}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rotas & Trilhas */}
        {activeTab === 'rotas' && currentRide && currentRoute && (
          <RouteViewer
            currentRide={currentRide}
            allRoutes={routes}
            activeRoute={currentRoute}
            onSelectRouteForRide={handleSelectRouteForRide}
            onOpenCustomRouteModal={() => setIsCustomRouteModalOpen(true)}
          />
        )}

        {/* Tab 3: Participantes & Segurança */}
        {activeTab === 'participantes' && currentRide && (
          <ParticipantsManager
            rideTitle={currentRide.title}
            rideDateFormatted={formatDateShort(currentRide.date)}
            maxParticipants={currentRide.maxParticipants}
            participants={currentParticipants}
            onAddParticipant={() => setIsAddParticipantModalOpen(true)}
            onDeleteParticipant={handleDeleteParticipant}
            onUpdatePresence={handleUpdatePresence}
          />
        )}

        {/* Tab 4: Checklist & SOS */}
        {activeTab === 'seguranca' && <SafetyChecklist />}
      </main>

      {/* Modals */}
      <NewRideModal
        isOpen={isNewRideModalOpen}
        onClose={() => setIsNewRideModalOpen(false)}
        onSaveRide={handleSaveRide}
        availableRoutes={routes}
        existingRide={editingRide}
      />

      <AddParticipantModal
        rideId={currentRide?.id || ''}
        isOpen={isAddParticipantModalOpen}
        onClose={() => setIsAddParticipantModalOpen(false)}
        onSave={handleSaveParticipant}
      />

      <CustomRouteModal
        isOpen={isCustomRouteModalOpen}
        onClose={() => setIsCustomRouteModalOpen(false)}
        onSaveRoute={handleSaveRoute}
      />

      {currentRide && currentRoute && (
        <WhatsAppBriefingModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          ride={currentRide}
          route={currentRoute}
          participants={currentParticipants}
        />
      )}

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1d222b] bg-[#0d0f12] py-6 px-4 text-center text-xs text-zinc-500">
        <p>
          Trilhas Farroupilha · Organização e segurança para passeios de moto e trilheiros na Serra Gaúcha.
        </p>
      </footer>
    </div>
  );
}
