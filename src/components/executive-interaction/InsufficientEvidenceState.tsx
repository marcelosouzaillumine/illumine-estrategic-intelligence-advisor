import React from 'react';
import { Database, TrendingUp } from 'lucide-react';

interface InsufficientEvidenceStateProps {
  title?: string;
  description?: string;
}

export const InsufficientEvidenceState: React.FC<InsufficientEvidenceStateProps> = ({
  title = 'Histórico de Dados Insuficiente',
  description = 'O motor analítico requer ao menos 3 meses de lançamentos contábeis e transações homologadas para computar tendências causais e score de exposição de risco.'
}) => {
  return (
    <div className="card-premium p-10 text-center max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20 shadow-inner">
        <Database className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-slate-200 uppercase tracking-wider">{title}</h4>
        <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono font-bold">Aguardando Volume Transacional</p>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-medium">
        {description}
      </p>

      <div className="pt-4 border-t border-border/10 flex justify-center gap-6 text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Requisito: Mínimo 3 Meses
        </span>
      </div>
    </div>
  );
};
