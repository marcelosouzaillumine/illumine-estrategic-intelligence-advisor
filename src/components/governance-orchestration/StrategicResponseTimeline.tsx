import React from 'react';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';
import { ListTree } from 'lucide-react';

export function StrategicResponseTimeline({ tenantId }: { tenantId: string }) {
  const coord = FiduciaryRuntimeAdapter.InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ListTree className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Action Plan Timeline</h3>
      </div>
      <div className="relative border-l border-border/50 ml-3 space-y-6 mt-4">
        {coord.plan.actions.map((action, idx) => (
          <div key={idx} className="relative pl-6">
            <div className="absolute w-3 h-3 bg-success-soft0 rounded-full -left-1.5 top-1.5 border-2 border-background"></div>
            <div className="text-sm font-medium text-foreground mt-1">{action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
