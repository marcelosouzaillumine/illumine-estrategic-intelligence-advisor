import React from 'react';
import { UIWarRoomImpact } from '../../viewmodels/war-room/WarRoomViewModel';
import { Activity, GitBranch } from 'lucide-react';

interface ImpactExplorerProps {
  impacts: UIWarRoomImpact[];
}

export const ImpactExplorer: React.FC<ImpactExplorerProps> = ({ impacts }) => {
  if (impacts.length === 0) {
    return (
      <div className="card-premium p-6 h-full flex flex-col items-center justify-center">
        <GitBranch className="w-8 h-8 text-muted-foreground mb-3" />
        <h4 className="text-sm font-bold text-foreground">Nenhum impacto registrado.</h4>
        <p className="text-xs text-muted-foreground mt-2 text-center max-w-sm">
          Selecione um cenário no catálogo para visualizar as consequências e impactos já calculados.
        </p>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-container-highest flex items-center justify-between">
        <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-500" />
          Impactos Estratégicos Simulados
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {impacts.map(impact => (
          <div key={impact.id} className="p-4 bg-surface-container/40 border border-border/50 rounded-xl relative group hover:border-border-hover transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-surface-container-high group-hover:bg-sky-500 transition-colors" />
            
            <div className="flex justify-between items-start mb-3 ml-2">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                impact.severity === 'CRITICAL' ? 'bg-critical-soft0/20 text-rose-400 border border-rose-500/30' :
                impact.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                impact.severity === 'MEDIUM' ? 'bg-warning-soft0/20 text-amber-400 border border-amber-500/30' :
                'bg-surface-container-highest text-muted-foreground border border-border'
              }`}>
                {impact.severity} IMPACT
              </span>
              <span className="text-[9px] font-mono uppercase bg-surface-container-highest text-muted-foreground px-2 py-0.5 rounded border border-border">
                {impact.type}
              </span>
            </div>
            
            <p className="text-xs text-foreground font-medium ml-2 leading-relaxed">
              {impact.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
