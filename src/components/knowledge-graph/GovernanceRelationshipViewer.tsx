import React from 'react';
import { GraphQueryEngine } from '../../services/FiduciaryRuntimeAdapter';
import { Scale } from 'lucide-react';

export function GovernanceRelationshipViewer({ tenantId }: { tenantId: string }) {
  // Query for Governance elements (Decisions, Users, Violations)
  const data = GraphQueryEngine.executeQuery({
    queryId: 'GOV-REL-001',
    tenantId,
    requestorId: 'UI_GOV_VIEWER',
    intent: 'View Governance Relationships',
    nodeTypes: ['DECISION', 'USER', 'GOVERNANCE_VIOLATION']
  });

  if (!data || data.edges.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Governance Traceability</h3>
      </div>
      <div className="space-y-2">
        {data.edges.map(e => {
          const source = data.nodes.find(n => n.nodeId === e.sourceNodeId);
          const target = data.nodes.find(n => n.nodeId === e.targetNodeId);
          return (
            <div key={e.edgeId} className="flex justify-between items-center text-sm bg-background border border-border/50 rounded p-2">
               <span className="text-muted-foreground">{source?.label || 'External'}</span>
               <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold">
                 {e.type}
               </span>
               <span className="text-foreground">{target?.label || 'External'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
