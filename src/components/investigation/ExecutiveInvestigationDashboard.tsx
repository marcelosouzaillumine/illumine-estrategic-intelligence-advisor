import React from 'react';
import { UIMetrics } from '../../viewmodels/investigation/BoardInvestigationViewModel';
import { Database, Network, Target, BrainCircuit, ShieldAlert } from 'lucide-react';

interface ExecutiveInvestigationDashboardProps {
  metrics?: UIMetrics;
}

export const ExecutiveInvestigationDashboard: React.FC<ExecutiveInvestigationDashboardProps> = ({ metrics }) => {
  return (
    <div className="card-premium p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Target className="text-indigo-500 w-6 h-6" />
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Board Investigation</span>
          <h3 className="text-h3 font-display font-black text-foreground mt-0.5">Visão Geral da Investigação</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface-container space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database size={16} />
            <span className="text-eyebrow text-muted-foreground">Evidências</span>
          </div>
          <div className="text-h2 font-display font-black text-foreground tabular-nums">
            {metrics ? metrics.totalEvidences : <span className="text-sm italic">não disponível</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BrainCircuit size={16} />
            <span className="text-eyebrow text-muted-foreground">Drivers</span>
          </div>
          <div className="text-h2 font-display font-black text-foreground tabular-nums">
            {metrics ? metrics.totalDrivers : <span className="text-sm italic">não disponível</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldAlert size={16} />
            <span className="text-eyebrow text-muted-foreground">Riscos Conectados</span>
          </div>
          <div className="text-h2 font-display font-black text-foreground tabular-nums">
            {metrics ? metrics.totalConnectedRisks : <span className="text-sm italic">não disponível</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target size={16} />
            <span className="text-eyebrow text-muted-foreground">Decisões Relacionadas</span>
          </div>
          <div className="text-h2 font-display font-black text-foreground tabular-nums">
            {metrics ? metrics.totalConnectedDecisions : <span className="text-sm italic">não disponível</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Network size={16} />
            <span className="text-eyebrow text-muted-foreground">Relações Totais</span>
          </div>
          <div className="text-h2 font-display font-black text-foreground tabular-nums">
            {metrics ? metrics.totalRelations : <span className="text-sm italic">não disponível</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
