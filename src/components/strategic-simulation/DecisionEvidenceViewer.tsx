import React from 'react';
import { StrategicDecisionSimulator } from '../../core/runtime/strategic-simulation/StrategicDecisionSimulator';
import { Fingerprint } from 'lucide-react';

export function DecisionEvidenceViewer({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  if (sims.length === 0) return null;

  const evidence = sims[0].input.decision.evidence;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Fiduciary Lineage & Evidence</h3>
      </div>
      <div className="space-y-3">
        <div className="bg-background border border-border/50 rounded p-4 text-xs">
          <div className="font-bold text-foreground mb-3 text-sm">Decision Lineage Reference</div>
          <div className="grid grid-cols-2 gap-3 text-muted-foreground mb-4">
            <div><span className="text-foreground">Execution ID:</span> <br/>{evidence.lineage.executionId}</div>
            <div><span className="text-foreground">Timestamp:</span> <br/>{new Date(evidence.lineage.timestamp).toLocaleString()}</div>
            <div><span className="text-foreground">Linked Workflows:</span> <br/>{evidence.lineage.workflowIds?.join(', ') || 'N/A'}</div>
            <div><span className="text-foreground">Knowledge Graph Patterns:</span> <br/>{evidence.lineage.graphPatternRefs?.join(', ') || 'N/A'}</div>
          </div>
          <div className="pt-3 border-t border-border/50 flex flex-col gap-1">
            <span className="text-foreground font-bold">Lineage Hash:</span>
            <span className="font-mono text-primary break-all bg-primary/10 px-2 py-1 rounded border border-primary/20 inline-block">
              {evidence.lineage.lineageHash}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
