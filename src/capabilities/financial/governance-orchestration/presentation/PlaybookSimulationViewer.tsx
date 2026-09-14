import React from 'react';
import { InstitutionalOrchestrationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { ShieldAlert } from 'lucide-react';

export function PlaybookSimulationViewer({ tenantId }: { tenantId: string }) {
  const coord = InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Playbook Impact & Tradeoffs</h3>
      </div>
      <div className="mb-4">
        <div className="text-xs text-muted-foreground font-bold uppercase mb-2">Tempo de Estabilização Esperado</div>
        <div className="text-2xl font-bold text-foreground">{coord.projection.expectedStabilizationTime} <span className="text-sm text-muted-foreground">meses</span></div>
      </div>
      <div className="space-y-2 border-t border-border/50 pt-4">
        <div className="text-xs text-muted-foreground font-bold uppercase mb-2">Trade-offs Institucionais</div>
        {coord.projection.tradeoffs.map((td, idx) => (
          <div key={idx} className="p-2 text-sm text-rose-500 bg-critical-soft0/10 border border-rose-500/20 rounded">
            {td}
          </div>
        ))}
      </div>
    </div>
  );
}
