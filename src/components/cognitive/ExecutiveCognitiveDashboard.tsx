import React from 'react';
import { BrainCircuit, Database, Network, Target } from 'lucide-react';

interface ExecutiveCognitiveDashboardProps {
  metrics: {
    totalEvidences: number;
    totalDrivers: number;
    totalRisks: number;
    totalDecisions: number;
    totalRelations: number;
    evidenceCoverage: string;
    explainabilityCoverage: string;
    graphCoverage: string;
  };
}

export const ExecutiveCognitiveDashboard: React.FC<ExecutiveCognitiveDashboardProps> = ({ metrics }) => {
  return (
    <div className="p-6 md:p-8 rounded-[32px] border border-slate-200 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-950/30 backdrop-blur-md space-y-6 shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
        <BrainCircuit className="text-primary w-6 h-6" />
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Executive Cognitive Dashboard</span>
          <h3 className="text-base font-black text-foreground mt-0.5">Métricas do Knowledge Graph Institucional</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface-container/30 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Evidências</span>
          </div>
          <div className="text-2xl font-light text-foreground">{metrics.totalEvidences}</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase">Cobertura: {metrics.evidenceCoverage}</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container/30 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Decisões & Drivers</span>
          </div>
          <div className="text-2xl font-light text-foreground">{metrics.totalDecisions + metrics.totalDrivers}</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase">Cobertura: {metrics.explainabilityCoverage}</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container/30 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Network size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Relações Causais</span>
          </div>
          <div className="text-2xl font-light text-foreground">{metrics.totalRelations}</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase">Grafo: {metrics.graphCoverage}</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-container/30 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BrainCircuit size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Riscos Mapeados</span>
          </div>
          <div className="text-2xl font-light text-foreground">{metrics.totalRisks}</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase">Traceabilidade garantida</div>
        </div>
      </div>
    </div>
  );
};
