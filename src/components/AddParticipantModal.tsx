import React, { useState } from 'react';
import { Participant, ExperienceLevel, PresenceStatus } from '../types';
import { X, UserPlus, Phone, ShieldAlert, Bike, User } from 'lucide-react';

interface AddParticipantModalProps {
  rideId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (participant: Participant) => void;
}

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  rideId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediário');
  const [motorcycleModel, setMotorcycleModel] = useState('');
  const [notes, setNotes] = useState('');
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus>('confirmado');

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome do participante é obrigatório.';
    if (!phone.trim()) newErrors.phone = 'Telefone do piloto é obrigatório.';
    if (!emergencyContactName.trim())
      newErrors.emergencyContactName = 'Nome do contato de emergência é obrigatório.';
    if (!emergencyContactPhone.trim())
      newErrors.emergencyContactPhone = 'Telefone de emergência é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      rideId,
      name: name.trim(),
      phone: phone.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      experienceLevel,
      motorcycleModel: motorcycleModel.trim() || undefined,
      notes: notes.trim() || undefined,
      presenceStatus,
      createdAt: new Date().toISOString(),
    };

    onSave(newParticipant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14171d] rounded-2xl border border-[#2a313e] w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#181d24] border-b border-[#2a313e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide">
              Cadastrar Piloto no Passeio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Nome do Participante *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mateus 'Trator' Silveira"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Telefone & Modelo da Moto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Telefone / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(54) 99999-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Modelo da Moto
              </label>
              <div className="relative">
                <Bike className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={motorcycleModel}
                  onChange={(e) => setMotorcycleModel(e.target.value)}
                  placeholder="Ex: Honda CRF 250F / KTM 300"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1b202a] border border-[#2b3342] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Nível de Experiência */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Nível de Experiência em Trilhas *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Iniciante', 'Intermediário', 'Avançado', 'Hard Enduro'] as ExperienceLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      experienceLevel === lvl
                        ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                        : 'bg-[#1b202a] border-[#2b3342] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Seção de Segurança: Contato de Emergência */}
          <div className="p-4 rounded-xl bg-[#12151c] border border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Dados de Emergência (Obrigatório para Trilhas)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Nome do Contato SOS *
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Ex: Camila Basso (Esposa)"
                  className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                {errors.emergencyContactName && (
                  <p className="text-[10px] text-rose-400 mt-0.5">
                    {errors.emergencyContactName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Telefone de Emergência SOS *
                </label>
                <input
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="(54) 99999-1188"
                  className="w-full px-3 py-2 bg-[#1b202a] border border-[#2b3342] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                />
                {errors.emergencyContactPhone && (
                  <p className="text-[10px] text-rose-400 mt-0.5">
                    {errors.emergencyContactPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Observações (Equipamentos / Apoio)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Leva câmara reserva de 18'', rádio comunicador..."
              className="w-full px-4 py-2 bg-[#1b202a] border border-[#2b3342] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Inicial de Presença */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-400">Status inicial de presença:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPresenceStatus('confirmado')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  presenceStatus === 'confirmado'
                    ? 'bg-orange-600 text-white'
                    : 'bg-[#1b202a] text-zinc-400'
                }`}
              >
                Confirmado
              </button>
              <button
                type="button"
                onClick={() => setPresenceStatus('pendente')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  presenceStatus === 'pendente'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#1b202a] text-zinc-400'
                }`}
              >
                Pendente
              </button>
            </div>
          </div>

          {/* Action Buttons */}
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
              Confirmar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
