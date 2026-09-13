import React from 'react';
import { Target, Activity, AlertTriangle, FileText } from 'lucide-react';

interface ExecutiveScenarioDashboardProps {
  totalScenarios: number;
  totalImpacts: number;
  totalRisks: number;
  totalEvidences: number;
}

export const ExecutiveScenarioDashboard: React.FC<ExecutiveScenarioDashboardProps> = ({
  totalScenarios,
  totalImpacts,
  totalRisks,
  totalEvidences
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="card-premium p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-eyebrow text-muted-foreground block">Cenários Disponíveis</span>
          <Target className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalScenarios || "—"}</span>
        </div>
      </div>
      
      <div className="card-premium p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-eyebrow text-muted-foreground block">Impactos Ativos</span>
          <Activity className="w-5 h-5 text-sky-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalImpacts || "—"}</span>
        </div>
      </div>

      <div className="card-premium p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-eyebrow text-muted-foreground block">Vetores de Risco</span>
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalRisks || "—"}</span>
        </div>
      </div>

      <div className="card-premium p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-eyebrow text-muted-foreground block">Lastro Probatório</span>
          <FileText className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalEvidences || "—"}</span>
        </div>
      </div>
    </div>
  );
};
