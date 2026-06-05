import React from 'react';
import { GraphQueryEngine } from '../../services/FiduciaryRuntimeAdapter';
import { Fingerprint } from 'lucide-react';

export function SemanticLineageViewer({ tenantId }: { tenantId: string }) {
  // Puxa arestas apenas para mostrar as assinaturas hash de lineage
  const data = GraphQueryEngine.executeQuery({
    queryId: 'LINEAGE-VIEW',
    tenantId,
    requestorId: 'UI_VIEWER',
    intent: 'List Lineages'
  });

  if (!data) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Semantic Lineage Hashes (Audit)</h3>
      </div>
      <div className="space-y-2">
        {data.edges.map(e => (
          <div key={e.edgeId} className="flex justify-between items-center text-xs p-2 bg-background border border-border/50 rounded">
            <span className="text-muted-foreground uppercase font-mono">{e.edgeId}</span>
            <div className="flex items-center gap-3">
              <span className="text-foreground">{e.type}</span>
              <span className="text-primary/70 font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                {e.semanticLineage.lineageHash}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
