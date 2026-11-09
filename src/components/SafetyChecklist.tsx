import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Phone, AlertTriangle, Wrench, HeartPulse, Sparkles } from 'lucide-react';

export const SafetyChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'pilot-1': true,
    'pilot-2': true,
    'pilot-3': true,
    'bike-1': true,
  });

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const CHECKLIST_SECTIONS = [
    {
      title: 'Equipamentos Obrigatórios do Piloto',
      icon: <ShieldAlert className="w-4 h-4 text-orange-500" />,
      items: [
        { id: 'pilot-1', label: 'Capacete fechado de trilha com queixeira e óculos limpos' },
        { id: 'pilot-2', label: 'Botas de motocross/enduro com cano rígido e travas firmes' },
        { id: 'pilot-3', label: 'Colete integral com protetor de coluna e peito' },
        { id: 'pilot-4', label: 'Joelheiras articuladas e cotoveleiras de proteção' },
        { id: 'pilot-5', label: 'Luvas de trilha com reforço e grip de manete' },
        { id: 'pilot-6', label: 'Mochila de hidratação tipo Camelbak (mínimo 2 litros de água)' },
      ],
    },
    {
      title: 'Inspeção Rápida da Moto',
      icon: <Wrench className="w-4 h-4 text-amber-500" />,
      items: [
        { id: 'bike-1', label: 'Tanque 100% abastecido na largada (sem reserva)' },
        { id: 'bike-2', label: 'Pressão dos pneus ajustada para barro/pedra (8 a 12 psi)' },
        { id: 'bike-3', label: 'Travas de pneu dianteiro e traseiro apertadas' },
        { id: 'bike-4', label: 'Pastilhas de freio dianteira e traseira com espessura segura' },
        { id: 'bike-5', label: 'Nível de óleo de motor e líquido de arrefecimento do radiador' },
        { id: 'bike-6', label: 'Corrente lubrificada e com folga adequada para pulo' },
      ],
    },
    {
      title: 'Kit de Emergência & Ferramentas no Comboio',
      icon: <HeartPulse className="w-4 h-4 text-emerald-500" />,
      items: [
        { id: 'tool-1', label: 'Câmaras de ar reservas (aro 21 dianteiro e aro 18 traseiro)' },
        { id: 'tool-2', label: 'Espátulas de pneu reforçadas e bomba manual ou cartucho de CO2' },
        { id: 'tool-3', label: 'Emenda de corrente compatível com o passe do grupo' },
        { id: 'tool-4', label: 'Canivete de chaves Allen, chave de vela e alicate' },
        { id: 'tool-5', label: 'Abraçadeiras de nylon (enforca-gato) e fita silver tape' },
        { id: 'tool-6', label: 'Corda ou cinta elástica para reboque em subidas íngremes' },
      ],
    },
  ];

  const FARROUPILHA_EMERGENCY_CONTACTS = [
    { name: 'Corpo de Bombeiros de Farroupilha', phone: '193 / (54) 3261-1200' },
    { name: 'Hospital Beneficente São Carlos (Farroupilha)', phone: '(54) 3261-1100' },
    { name: 'SAMU - Emergência Médica', phone: '192' },
    { name: 'Brigada Militar - 36º BPM Farroupilha', phone: '190 / (54) 3268-2320' },
    { name: 'Polícia Rodoviária Estadual (RST-453 Farroupilha)', phone: '(54) 3268-1250' },
  ];

  const totalItems = CHECKLIST_SECTIONS.reduce((acc, s) => acc + s.items.length, 0);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = Math.round((totalChecked / totalItems) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14171d] rounded-2xl border border-[#262c36] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Segurança do Trilheiro</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-wide">
            Checklist de Segurança & Telefones Úteis de Farroupilha
          </h2>
          <p className="text-xs text-zinc-400 pt-0.5">
            Trilhas na serra exigem preparação completa. Garanta que todas as motos e pilotos estejam aptos antes da largada.
          </p>
        </div>

        {/* Progress pill */}
        <div className="bg-[#1b202a] border border-[#2b3342] px-4 py-2.5 rounded-xl text-right">
          <div className="text-[11px] text-zinc-400 font-semibold uppercase">
            Prontidão da Trilha
          </div>
          <div className="text-lg font-bold font-mono text-orange-400">
            {totalChecked}/{totalItems} ({progressPct}%)
          </div>
        </div>
      </div>

      {/* Grid of Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CHECKLIST_SECTIONS.map((section, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#14171d] border border-[#262c36] space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-[#232936]">
                {section.icon}
                <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                  {section.title}
                </h4>
              </div>

              <div className="space-y-2.5 pt-3">
                {section.items.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                        isChecked
                          ? 'bg-orange-950/20 border-orange-800/60 text-zinc-200'
                          : 'bg-[#181d24] border-[#252b36] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-orange-600 text-white'
                            : 'border border-zinc-600 bg-black/40'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={isChecked ? 'line-through opacity-70' : ''}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 pt-2 text-right">
              {section.items.filter((i) => checkedItems[i.id]).length}/{section.items.length} itens conferidos
            </div>
          </div>
        ))}
      </div>

      {/* Farroupilha Rural Emergency & SOS Directory */}
      <div className="bg-[#14171d] rounded-2xl border border-rose-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider">
              Contatos de Emergência Rural · Farroupilha/RS
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-0.5 rounded">
            Plantão 24 Horas
          </span>
        </div>

        <p className="text-xs text-zinc-300">
          No interior de Farroupilha (linhas Julieta, Salto Ventoso, Nova Milano), em caso de incidente ou fratura, ligue imediatamente para os serviços de atendimento ou informe as coordenadas mais próximas ao trevo de acesso.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FARROUPILHA_EMERGENCY_CONTACTS.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#181d24] border border-[#2b3342] flex items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-zinc-300">
                  {c.name}
                </div>
                <div className="text-xs font-bold font-mono text-orange-400">
                  {c.phone}
                </div>
              </div>
              <a
                href={`tel:${c.phone.split('/')[0].replace(/\D/g, '')}`}
                className="w-8 h-8 rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Ligar agora"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
