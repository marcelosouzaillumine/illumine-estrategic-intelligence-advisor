import React from 'react';
import { GraphQueryResult } from '../../core/runtime/knowledge-graph/KnowledgeGraphTypes';

export function SemanticRelationshipPanel({ data }: { data?: GraphQueryResult | null }) {
  if (!data || data.edges.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Semantic Triples</h3>
      <div className="space-y-2">
        {data.edges.map(e => {
          const source = data.nodes.find(n => n.nodeId === e.sourceNodeId);
          const target = data.nodes.find(n => n.nodeId === e.targetNodeId);
          
          return (
            <div key={e.edgeId} className="flex flex-col md:flex-row items-center gap-2 p-2 bg-background border border-border/30 rounded text-sm">
              <span className="text-muted-foreground w-full md:w-1/3 truncate text-right">{source?.label}</span>
              <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase"> {e.type} </span>
              <span className="text-foreground w-full md:w-1/3 truncate">{target?.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
