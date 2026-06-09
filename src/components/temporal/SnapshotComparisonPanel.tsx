import React from 'react';
import { ArrowRight, Activity, Zap } from 'lucide-react';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';

interface SnapshotComparisonPanelProps {
  lineage: TemporalLineage | null;
}

export const SnapshotComparisonPanel: React.FC<SnapshotComparisonPanelProps> = ({ lineage }) => {
  if (!lineage) {
    return (
      <div className="p-6 bg-surface-container rounded-xl border border-border text-center">
        <Activity size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Selecione dois snapshots para realizar a comparação de linhagem.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
        <Zap size={16} className="text-rose-400" /> Análise de Evolução Estrutural
      </h3>

      <div className="grid grid-cols-3 gap-4 items-center bg-surface-container p-6 rounded-xl border border-border">
        {/* Source */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Snapshot de Origem</span>
          <div className="bg-surface-container-highest border border-border px-3 py-2 rounded-lg font-mono text-xs text-muted-foreground">
            {lineage.sourceSnapshotId.substring(0, 8)}...
          </div>
        </div>

        {/* Transition */}
        <div className="text-center flex flex-col items-center">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2
            ${lineage.transitionType === 'REGRESSION' ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' :
              lineage.transitionType === 'EVOLUTION' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
              'bg-primary border-primary text-primary'
            }`}>
            {lineage.transitionType}
          </span>
          <ArrowRight className="text-muted-foreground" size={20} />
        </div>

        {/* Target */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Snapshot de Destino</span>
          <div className="bg-surface-container-highest border border-border px-3 py-2 rounded-lg font-mono text-xs text-muted-foreground">
            {lineage.targetSnapshotId.substring(0, 8)}...
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-4 rounded-xl border border-border">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Nós Alterados ({lineage.changedNodes.length})</h4>
          <ul className="space-y-2">
            {lineage.changedNodes.map(nodeId => (
              <li key={nodeId} className="text-xs font-mono text-foreground bg-surface-container-highest px-2 py-1 rounded border border-border">
                {nodeId}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface-container p-4 rounded-xl border border-border">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Relações Alteradas ({lineage.changedRelationships.length})</h4>
          <ul className="space-y-2">
            {lineage.changedRelationships.map(relId => (
              <li key={relId} className="text-xs font-mono text-foreground bg-surface-container-highest px-2 py-1 rounded border border-border">
                {relId}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
