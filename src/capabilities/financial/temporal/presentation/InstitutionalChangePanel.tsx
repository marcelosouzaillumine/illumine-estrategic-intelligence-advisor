import React from 'react';
import { Layers } from 'lucide-react';
import { TemporalLineage } from '../../../../types/temporal/TemporalLineage';

interface InstitutionalChangePanelProps {
  lineage: TemporalLineage | null;
}

export const InstitutionalChangePanel: React.FC<InstitutionalChangePanelProps> = ({ lineage }) => {
  if (!lineage) {
    return (
      <div className="p-6 bg-surface-container rounded-xl border border-border text-center">
        <Layers size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Selecione uma transição temporal para visualizar as mudanças de topologia.</p>
      </div>
    );
  }

  const nodesChanged = lineage.changedNodes.length;
  const relsChanged = lineage.changedRelationships.length;
  const totalChanges = nodesChanged + relsChanged;

  return (
    <div className="space-y-4">
      <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
        <Layers size={16} className="text-sky-400" /> Delta Topológico
      </h3>

      <div className="bg-surface-container border border-border p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total de Alterações</span>
          <span className="text-lg font-black text-foreground bg-surface-container-highest px-3 py-1 rounded-lg">{totalChanges}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-bold uppercase tracking-widest">
              <span>Nós Afetados</span>
              <span>{nodesChanged}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full" 
                style={{ width: `${totalChanges > 0 ? (nodesChanged / totalChanges) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-bold uppercase tracking-widest">
              <span>Arestas Afetadas</span>
              <span>{relsChanged}</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full" 
                style={{ width: `${totalChanges > 0 ? (relsChanged / totalChanges) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {totalChanges > 0 && (
          <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed italic">
            * O motor determinístico de linhagem atesta que essa estrutura reflete exclusivamente as mutações registradas neste ciclo, sem inferências.
          </p>
        )}
      </div>
    </div>
  );
};
