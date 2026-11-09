import React, { useState } from 'react';
import { Ride, Route, Participant } from '../types';
import { generateWhatsAppBriefing } from '../utils/storage';
import { X, Share2, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

interface WhatsAppBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  route: Route;
  participants: Participant[];
  weatherAlert?: string;
}

export const WhatsAppBriefingModal: React.FC<WhatsAppBriefingModalProps> = ({
  isOpen,
  onClose,
  ride,
  route,
  participants,
  weatherAlert,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const briefingText = generateWhatsAppBriefing(ride, route, participants, weatherAlert);

  const handleCopy = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(briefingText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14171d] rounded-2xl border border-[#2a313e] w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#181d24] border-b border-[#2a313e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide">
              Briefing para Grupo do WhatsApp
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-300">
            Mensagem formatada com todos os dados do passeio, horários de saída/chegada em Farroupilha, rota proposta e pilotos confirmados:
          </p>

          <div className="relative">
            <pre className="w-full h-72 p-4 bg-[#0d0f13] border border-[#252b36] rounded-xl text-xs font-mono text-zinc-200 whitespace-pre-wrap overflow-y-auto leading-relaxed select-all">
              {briefingText}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                  : 'bg-[#1b202a] border-[#2c3342] text-zinc-300 hover:text-white hover:border-zinc-500'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Briefing Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
