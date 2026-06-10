import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { BalanceSheetRiskDivergenceViewModel } from './view-models';
import { cn } from '../../../lib/utils';

export function BalanceSheetRiskDivergenceSection({
  viewModel
}: {
  viewModel: BalanceSheetRiskDivergenceViewModel;
}) {
  const getToneClass = (tone: string) => {
    switch (tone) {
      case 'primary': return 'text-primary font-black text-lg';
      case 'success': return 'text-emerald-600 font-black text-lg';
      case 'warning': return 'text-amber-600 font-black text-lg';
      case 'critical': return 'text-rose-600 font-black text-lg';
      default: return 'text-primary font-black text-lg';
    }
  };

  return (
    <div className="bg-surface-container/30 rounded-[32px] p-8 border border-border mt-12 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-xl font-black text-primary mb-4">Análise de Divergência de Risco</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Classificação Matemática</span>
              <span className="text-lg font-black text-primary">
                {viewModel.mathClassificationLabel}
              </span>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Classificação Fiduciária</span>
              <span className={getToneClass(viewModel.fiduciaryClassificationTone)}>
                {viewModel.fiduciaryClassificationLabel}
              </span>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Indicador de Síntese</span>
              <span className="text-lg font-black text-primary">
                {viewModel.globalScore} <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">pontos</span>
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-rose-500/[0.03] to-transparent border border-rose-200/50 p-6 sm:p-8 rounded-[32px] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 p-8 opacity-[0.03]">
              <AlertTriangle size={180} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30">
                <AlertTriangle size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-lg font-black text-primary tracking-tight">Ofensores Fiduciários Críticos</h4>
                <p className="text-[11px] font-bold text-rose-600/80 uppercase tracking-[0.2em] mt-1">Matriz de Impacto Estrutural</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              {viewModel.criticalOffenders.map((offender, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group">
                  <div className="flex items-center gap-4 w-full sm:w-[35%]">
                    <div className="w-1.5 h-1.5 rounded-full bg-critical-soft0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                    <span className="text-[13px] font-black text-muted-foreground">{offender.metricName}</span>
                  </div>
                  <div className="w-full sm:w-[20%]">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-critical-soft text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-100/50 group-hover:bg-critical-soft0 group-hover:text-white group-hover:border-rose-500 transition-all duration-300">
                      {offender.classification}
                    </span>
                  </div>
                  <div className="w-full sm:w-[45%] flex items-center justify-between gap-4 pl-4 sm:border-l border-border">
                    <span className="text-xs font-bold text-muted-foreground leading-snug group-hover:text-muted-foreground transition-colors">{offender.impact}</span>
                    <div className="p-1.5 bg-surface-container/30 rounded-md text-muted-foreground group-hover:text-rose-500 group-hover:bg-critical-soft transition-colors">
                      <AlertCircle size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
