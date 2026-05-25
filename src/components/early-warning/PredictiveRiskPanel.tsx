import React from 'react';
import { PredictiveGovernanceDetector } from '../../core/runtime/early-warning/PredictiveGovernanceDetector';
import { Activity } from 'lucide-react';

export function PredictiveRiskPanel({ tenantId }: { tenantId: string }) {
  const risks = PredictiveGovernanceDetector.detectGovernanceDeterioration(tenantId);

  if (risks.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-orange-500" />
        <h3 className="text-sm font-semibold text-foreground">Governance Deterioration Radar</h3>
      </div>
      <div className="space-y-2">
        {risks.map((r, i) => (
          <div key={i} className="p-3 bg-background border border-border/50 rounded text-sm text-foreground">
            <span className="font-bold text-orange-500 mr-2">[{r.source}]</span>
            {r.metadata.insight}
          </div>
        ))}
      </div>
    </div>
  );
}
