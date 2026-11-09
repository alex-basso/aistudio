import React from 'react';
import { X, Smartphone, Share, PlusSquare, CheckCircle2, Apple, Play } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14171d] rounded-2xl border border-[#2a313e] w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#181d24] border-b border-[#2a313e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide">
              Como Instalar no iPhone ou Android
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* iOS Safari Guide */}
          <div className="p-4 rounded-xl bg-[#181d24] border border-[#2a313e] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-heading">
              <Apple className="w-4 h-4 text-zinc-300" />
              <span>No iPhone (iOS / Safari)</span>
            </div>
            <ol className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Abra este link no navegador <strong>Safari</strong> do iPhone.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Toque no botão de <strong>Compartilhar</strong>
                  <Share className="w-3.5 h-3.5 inline text-blue-400" />
                  (quadrado com seta para cima na barra inferior).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>
                  <PlusSquare className="w-3.5 h-3.5 inline text-orange-400" />.
                </span>
              </li>
            </ol>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>O app rodará em tela cheia (standalone) com ícone exclusivo na tela!</span>
            </div>
          </div>

          {/* Android Guide */}
          <div className="p-4 rounded-xl bg-[#181d24] border border-[#2a313e] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-heading">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>No Android (Chrome)</span>
            </div>
            <ol className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Toque no menu de três pontos (⋮) no canto superior direito do Chrome.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
              </li>
            </ol>
          </div>

          {/* App Store Publishing Info */}
          <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-800/40 text-xs text-zinc-300 space-y-1">
            <div className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">
              Deseja publicar na App Store da Apple?
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Para publicar formalmente na loja da Apple, basta empacotar este código com o <strong>Capacitor</strong> (<code className="text-orange-300 font-mono">npx cap add ios</code>), abrir no Xcode no Mac e enviar com uma conta Apple Developer.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
