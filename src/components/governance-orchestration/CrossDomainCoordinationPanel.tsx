import React from 'react';
import { InstitutionalOrchestrationEngine } from '../../core/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
import { Network } from 'lucide-react';

export function CrossDomainCoordinationPanel({ tenantId }: { tenantId: string }) {
  const coord = InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord || coord.crossDomain.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-foreground">Cross-Domain Responses</h3>
      </div>
      <div className="space-y-4">
        {coord.crossDomain.map(cd => (
          <div key={cd.impactId} className="p-4 bg-background border border-border/50 rounded grid grid-cols-[100px_1fr] gap-4 items-center">
            <div className="text-center border-r border-border/50 pr-4">
              <div className="text-[10px] text-muted-foreground uppercase mb-1">{cd.sourceDomain}</div>
              <div className="text-muted-foreground text-xs">&rarr;</div>
              <div className="text-[10px] text-indigo-500 font-bold uppercase mt-1">{cd.targetDomain}</div>
            </div>
            <div className="pl-2">
              <div className="text-sm text-foreground">{cd.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
