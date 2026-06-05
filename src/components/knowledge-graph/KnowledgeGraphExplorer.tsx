import React, { useEffect, useState } from 'react';
import { GraphQueryEngine } from '../../services/FiduciaryRuntimeAdapter';
import { InstitutionalMemoryEngine } from '../../services/FiduciaryRuntimeAdapter';
import { GraphQueryResult } from '../../services/FiduciaryRuntimeAdapter';
import { Network, Database } from 'lucide-react';

export function KnowledgeGraphExplorer({ tenantId }: { tenantId: string }) {
  const [graphData, setGraphData] = useState<GraphQueryResult | null>(null);

  useEffect(() => {
    // Injeta mock
    InstitutionalMemoryEngine.injectMockFixture(tenantId);
    
    // Consulta todos os nós do mock
    const result = GraphQueryEngine.executeQuery({
      queryId: 'EXPLORE-001',
      tenantId,
      requestorId: 'UI_EXPLORER',
      intent: 'Load full demo graph'
    });
    
    setGraphData(result);
  }, [tenantId]);

  if (!graphData) return <div className="text-muted-foreground p-4">Carregando grafo fiduciário...</div>;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Semantic Nodes Explorer</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nós Identificados ({graphData.nodes.length})</div>
          {graphData.nodes.map(n => (
            <div key={n.nodeId} className="flex items-center gap-3 bg-background p-3 rounded border border-border">
              <Database size={14} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{n.label}</div>
                <div className="text-[10px] uppercase font-mono text-primary mt-1">{n.type}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Arestas Fiduciárias ({graphData.edges.length})</div>
          {graphData.edges.map(e => {
             const source = graphData.nodes.find(n => n.nodeId === e.sourceNodeId);
             const target = graphData.nodes.find(n => n.nodeId === e.targetNodeId);
             return (
              <div key={e.edgeId} className="bg-background p-3 rounded border border-border/50 text-xs">
                <span className="font-medium text-foreground">{source?.label}</span>
                <span className="mx-2 text-[10px] uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                  {e.type}
                </span>
                <span className="font-medium text-foreground">{target?.label}</span>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
