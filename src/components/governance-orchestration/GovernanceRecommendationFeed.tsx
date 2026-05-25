import React from 'react';
import { InstitutionalOrchestrationEngine } from '../../core/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
import { Fingerprint } from 'lucide-react';

export function GovernanceRecommendationFeed({ tenantId }: { tenantId: string }) {
  const coord = InstitutionalOrchestrationEngine.getActiveCoordination(tenantId);
  if (!coord) return null;

  const rec = coord.recommendation;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Recommendation Lineage</h3>
      </div>
      <div className="space-y-3">
        <div className="bg-background border border-border/50 rounded p-4 text-xs">
          <div className="font-bold text-foreground mb-3 text-sm">{rec.title}</div>
          <div className="text-muted-foreground mb-4">{rec.evidence.rationale}</div>
          <div className="grid grid-cols-2 gap-3 text-muted-foreground mb-4 pt-3 border-t border-border/50">
            <div><span className="text-foreground">Governance Context:</span> <br/>{rec.evidence.lineage.governanceContext}</div>
            <div><span className="text-foreground">Execution ID:</span> <br/>{rec.evidence.lineage.executionId}</div>
            <div><span className="text-foreground">Linked Workflows:</span> <br/>{rec.evidence.lineage.workflowIds?.join(', ') || 'N/A'}</div>
            <div><span className="text-foreground">Linked Simulations:</span> <br/>{rec.evidence.lineage.simulationIds?.join(', ') || 'N/A'}</div>
          </div>
          <div className="pt-3 border-t border-border/50 flex flex-col gap-1">
            <span className="text-foreground font-bold">Lineage Hash:</span>
            <span className="font-mono text-primary break-all bg-primary/10 px-2 py-1 rounded border border-primary/20 inline-block">
              {rec.evidence.lineage.lineageHash}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
