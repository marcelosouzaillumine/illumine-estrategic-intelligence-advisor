import React from 'react';
import { X, ShieldCheck, FileText, Bot, HelpCircle } from 'lucide-react';

export interface ExecutiveIntelligenceDrawerProps {
  isOpen: boolean;
  pageContext: string;
  onClose: () => void;
}

export const ExecutiveIntelligenceDrawer: React.FC<ExecutiveIntelligenceDrawerProps> = ({
  isOpen,
  pageContext,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-96 flex-col border-l border-slate-800 bg-slate-900/95 text-slate-100 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          <h2 className="text-sm font-semibold">Executive Advisor — {pageContext}</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        <section className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/50">
          <h3 className="font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
            <FileText className="h-4 w-4" /> Resumo Executivo
          </h3>
          <p className="text-slate-300">
            Detecção de variação em {pageContext}: desvio operacional em despesas comerciais e oportunidade de recuperação de margem.
          </p>
        </section>

        <section className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/50">
          <h3 className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Evidências Auditadas
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>CMV +8% em relação ao trimestre anterior</li>
            <li>Despesas logísticas +12% acima da meta</li>
            <li>Volume de vendas -4% em relação ao orçamento</li>
          </ul>
        </section>

        <section className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/50">
          <h3 className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
            <Bot className="h-4 w-4" /> Agentes Consultados
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-blue-400 border border-blue-500/20 font-mono text-[10px]">CFO Agent</span>
            <span className="rounded bg-purple-500/10 px-2 py-0.5 text-purple-400 border border-purple-500/20 font-mono text-[10px]">Risk Agent</span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">Simulation Agent</span>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-800 p-4 bg-slate-950">
        <div className="relative">
          <input
            type="text"
            placeholder="Pergunte sobre esta análise..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <HelpCircle className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
};
