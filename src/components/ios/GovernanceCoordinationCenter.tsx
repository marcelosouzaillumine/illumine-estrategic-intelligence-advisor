import React from 'react';
import { Workflow } from 'lucide-react';
import { InstitutionalOperatingSystem } from '../../services/FiduciaryRuntimeAdapter';

export function GovernanceCoordinationCenter({ tenantId }: { tenantId: string }) {
  const state = InstitutionalOperatingSystem.getState(tenantId);
  if (!state) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Workflow className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Coordination Center (Projections)</h3>
      </div>
      <div className="space-y-4">
        {state.projections.map(proj => (
          <div key={proj.projectionId} className="flex flex-col gap-2 p-3 bg-background border border-border/50 rounded">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground uppercase">{proj.domain.replace(/_/g, ' ')}</span>
              <span className="text-[10px] text-muted-foreground font-bold">
                T+{proj.timeframeMonths} meses
              </span>
            </div>
            <span className="text-sm text-foreground">{proj.projectedState}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
