import React from 'react';
import { Network, GitBranch, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { KnowledgeGraphNode } from '@illumine/executive-contracts';

export interface ExecutiveKnowledgeGraphProps {
  readonly companyName: string;
  readonly nodes: readonly KnowledgeGraphNode[];
}

export const ExecutiveKnowledgeGraph: React.FC<ExecutiveKnowledgeGraphProps> = ({ companyName, nodes }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Grafo Institucional de Conhecimento ({companyName})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="info">
          {nodes.length} Nós Mapeados
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {nodes.map((node) => (
          <div key={node.nodeId} className="p-2 bg-surface-container/30 rounded border border-border/30 flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">{node.nodeType}</span>
              <span className="font-medium text-foreground text-xs">{node.label}</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
