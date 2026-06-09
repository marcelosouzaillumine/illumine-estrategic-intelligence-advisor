import React from 'react';
import { useBoardMode, BoardModeViewModel } from '../../../hooks/useBoardMode';
import { BoardIntelligenceInput } from '../../../services/BoardRuntimeAdapter';
import { AlertTriangle, ShieldCheck, Activity, Target, Presentation, Scale, Eye } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils';

interface BoardModeDashboardProps {
  input: BoardIntelligenceInput;
}

export function BoardModeDashboard({ input }: BoardModeDashboardProps) {
  const viewModel = useBoardMode(input);
  if (!viewModel) return null;
  const { risks, attentionItems, resolutions, agenda } = viewModel;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Presentation size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="text-amber-400" size={24} />
            <h2 className="text-2xl font-black">Board Intelligence Layer (BIL)</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl mb-8">
            Painel consolidado para aconselhamento fiduciário. Informações processadas determinísticamente a partir 
            da inteligência de execução e valuation institucional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Cenário Fiduciário</p>
              <p className="text-xl font-black text-white truncate">{input.scenarioName}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Enterprise Value Projetado</p>
              <p className="text-xl font-black text-emerald-400">{formatCurrency(input.enterpriseValue)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Impacto (Delta)</p>
              <p className={cn("text-xl font-black", input.valueDelta >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {input.valueDelta >= 0 ? '+' : ''}{formatCurrency(input.valueDelta)}
              </p>
            </div>
            <div className={cn(
              "p-5 rounded-2xl border",
              risks.overallRisk === 'Baixo' ? "bg-emerald-900/30 border-emerald-800 text-emerald-400" :
              risks.overallRisk === 'Moderado' ? "bg-blue-900/30 border-blue-800 text-blue-400" :
              risks.overallRisk === 'Elevado' ? "bg-amber-900/30 border-amber-800 text-amber-400" :
              "bg-rose-900/30 border-rose-800 text-rose-400"
            )}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Risco Geral</p>
              <p className="text-xl font-black uppercase">{risks.overallRisk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RISCOS FIDUCIARIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck className="text-slate-400" size={16} /> Radar Fiduciário
            </h3>
            
            <div className="space-y-4">
              <RiskRow label="Risco Financeiro" data={risks.financialRisk} />
              <RiskRow label="Risco Institucional" data={risks.institutionalRisk} />
              <RiskRow label="Risco de Execução" data={risks.executionRisk} />
              <RiskRow label="Risco de Governança" data={risks.governanceRisk} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Board Pack Generator</h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
              <Presentation className="text-slate-300 mx-auto mb-2" size={32} />
              <p className="text-xs text-slate-400 font-bold mb-3">Versão Visual (Interactive)</p>
              <button disabled className="w-full py-2 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg cursor-not-allowed border border-slate-200">
                Exportar PDF (Em Breve)
              </button>
            </div>
          </div>
        </div>

        {/* PAUTA & DELIBERACOES */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target className="text-blue-500" size={16} /> Recomendações de Deliberação
            </h3>
            
            {resolutions.map((res, i) => (
              <div key={i} className="mb-4 last:mb-0 bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded">
                    {res.action}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{res.topic}</h4>
                <p className="text-sm text-slate-600 mb-3">{res.justification}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  <span>Impacto Esperado:</span> {res.impact}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Eye className="text-purple-500" size={16} /> Radar de Atenção (Monitorar vs Escalar)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attentionItems.map((item, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border",
                  item.category === 'Escalar' ? "bg-rose-50 border-rose-200" :
                  item.category === 'Deliberar' ? "bg-amber-50 border-amber-200" :
                  "bg-slate-50 border-slate-200"
                )}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      item.category === 'Escalar' ? "text-rose-600" :
                      item.category === 'Deliberar' ? "text-amber-600" :
                      "text-slate-500"
                    )}>{item.category}</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border">{item.urgency}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.rationale}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* AGENDA PREVIEW */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-300">Pauta Fiduciária Sugerida</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AgendaCol block={agenda.estrategia} />
          <AgendaCol block={agenda.financas} />
          <AgendaCol block={agenda.governanca} />
          <AgendaCol block={agenda.riscos} />
        </div>
      </div>

    </div>
  );
}

function RiskRow({ label, data }: { label: string, data: { level: string, reason: string } }) {
  return (
    <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-slate-700">{label}</span>
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
          data.level === 'Baixo' ? "bg-emerald-100 text-emerald-700" :
          data.level === 'Moderado' ? "bg-blue-100 text-blue-700" :
          data.level === 'Elevado' ? "bg-amber-100 text-amber-700" :
          "bg-rose-100 text-rose-700"
        )}>{data.level}</span>
      </div>
      <p className="text-[10px] text-slate-500">{data.reason}</p>
    </div>
  );
}

function AgendaCol({ block }: { block: any }) {
  return (
    <div>
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-800">
        {block.title}
      </h4>
      <ul className="space-y-3">
        {block.items.map((item: string, i: number) => (
          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span className={item.includes('DELIBERAÇÃO') || item.includes('ATENÇÃO') || item.includes('ESCALADA') ? "text-amber-400 font-bold" : ""}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
