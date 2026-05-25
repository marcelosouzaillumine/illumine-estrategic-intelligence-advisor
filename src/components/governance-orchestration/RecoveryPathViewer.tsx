import React from 'react';
import { InstitutionalOrchestrationEngine } from '../../core/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
import { HeartPulse } from 'lucide-react';

export function RecoveryPathViewer({ tenantId }: { tenantId: string }) {
  const coord = InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord || coord.recovery.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <HeartPulse className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Recovery Path Projection</h3>
      </div>
      <div className="space-y-4">
        {coord.recovery.map(rec => (
          <div key={rec.strategyId} className="flex flex-col gap-2 p-3 bg-background border border-amber-500/30 rounded">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground uppercase">{rec.domain}</span>
              <span className="text-xs text-amber-500 font-bold">
                T+{rec.recoveryTimelineMonths} meses
              </span>
            </div>
            <span className="text-sm text-foreground">{rec.containmentAction}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
