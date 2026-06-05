import React from 'react';
import { ScenarioDeteriorationWatcher } from '../../services/FiduciaryRuntimeAdapter';
import { Zap } from 'lucide-react';

export function ScenarioDeteriorationPanel({ tenantId }: { tenantId: string }) {
  const deteriorations = ScenarioDeteriorationWatcher.watchScenarios(tenantId);

  if (deteriorations.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Scenario Survivability Warning</h3>
      </div>
      <div className="space-y-2">
        {deteriorations.map((d, i) => (
          <div key={i} className="p-3 bg-background border border-border/50 rounded text-sm text-foreground flex justify-between items-center">
             <span>{String(d.metadata.insight)}</span>
             <div className="text-xs text-red-400 mt-2">Impacts: {((d.metadata.impactedIndicators as unknown as string[]) || []).join(', ')}</div>
             <span className="text-[10px] text-muted-foreground font-mono bg-surface-container px-2 py-0.5 rounded border border-border">
               {(d.metadata.scenarioIds as string[] | undefined)?.join(', ')}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}
