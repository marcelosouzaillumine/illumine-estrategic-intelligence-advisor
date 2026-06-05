import React from 'react';
import { InstitutionalOperatingSystem } from '../../services/FiduciaryRuntimeAdapter';
import { GitMerge } from 'lucide-react';

export function InstitutionalDependencyGraph({ tenantId }: { tenantId: string }) {
  const state = InstitutionalOperatingSystem.getState(tenantId);
  if (!state || state.dependencies.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitMerge className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Operational Bottlenecks</h3>
      </div>
      <div className="space-y-3">
        {state.dependencies.map(dep => (
          <div key={dep.dependencyId} className="p-3 bg-background border border-amber-500/30 rounded flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">{dep.bottleneckNode}</span>
              <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded uppercase">{dep.criticality}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Impacted Workflows: <span className="text-foreground font-mono bg-border/30 px-1 rounded">{dep.impactedWorkflows.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
