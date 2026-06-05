import React from 'react';
import { InstitutionalOrchestrationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { ChevronsUp } from 'lucide-react';

export function EscalationOrchestrationPanel({ tenantId }: { tenantId: string }) {
  const coord = InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChevronsUp className="text-rose-500" />
        <h3 className="text-sm font-semibold text-foreground">Escalation Sequence</h3>
      </div>
      <div className="text-center p-4 bg-rose-500/10 border border-rose-500/20 rounded mb-4">
        <span className="text-xs text-rose-500 font-bold uppercase block mb-1">Target Audience</span>
        <span className="text-lg font-bold text-foreground">{coord.escalation.targetAudience.replace(/_/g, ' ')}</span>
      </div>
      <div className="space-y-2">
        {coord.escalation.steps.map((step, idx) => (
          <div key={idx} className="p-2 text-sm text-foreground bg-background border border-border/50 rounded flex gap-2 items-center">
            <span className="text-muted-foreground font-mono text-xs">{idx + 1}.</span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
