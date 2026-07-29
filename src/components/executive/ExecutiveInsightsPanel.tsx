import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export interface ExecutiveInsightsPanelProps {
  pageTitle: string;
  decisionsCount?: number;
  risksCount?: number;
  opportunitiesCount?: number;
  onExplore?: () => void;
}

export const ExecutiveInsightsPanel: React.FC<ExecutiveInsightsPanelProps> = ({
  pageTitle,
  decisionsCount = 1,
  risksCount = 3,
  opportunitiesCount = 2,
  onExplore
}) => {
  return (
    <div className="mb-6 rounded-xl border border-blue-900/40 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Executive Insights — {pageTitle}
            </h3>
            <p className="text-xs text-slate-400">Inteligência contextual ativa e diagnósticos operacionais</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2.5 py-1 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Decisões recomendadas: <strong>{decisionsCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Riscos monitorados: <strong>{risksCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Oportunidades: <strong>{opportunitiesCount}</strong></span>
          </div>

          {onExplore && (
            <button
              onClick={onExplore}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <span>Abrir análise</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
