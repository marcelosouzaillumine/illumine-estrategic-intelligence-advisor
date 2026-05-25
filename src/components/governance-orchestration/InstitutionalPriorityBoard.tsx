import React from 'react';
import { InstitutionalOrchestrationEngine } from '../../core/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
import { AlertCircle } from 'lucide-react';

export function InstitutionalPriorityBoard({ tenantId }: { tenantId: string }) {
  const coord = InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord || coord.priorities.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-rose-500" />
        <h3 className="text-sm font-semibold text-foreground">Priorização Institucional (Sugerida)</h3>
      </div>
      <div className="space-y-3">
        {coord.priorities.map(prio => (
          <div key={prio.priorityId} className="flex flex-col gap-1 p-3 bg-background border border-rose-500/30 rounded">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground uppercase">{prio.domain}</span>
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {prio.urgency}
              </span>
            </div>
            <span className="text-sm text-foreground font-medium">{prio.action}</span>
            <span className="text-xs text-muted-foreground mt-1">Razão: {prio.rationale}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
