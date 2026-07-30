import React from 'react';
import { Share2 } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { EnterpriseKnowledgeGraphContract } from '@illumine/executive-contracts';

export interface KnowledgeGraphHardeningCardProps {
  readonly graph: EnterpriseKnowledgeGraphContract;
}

export const KnowledgeGraphHardeningCard: React.FC<KnowledgeGraphHardeningCardProps> = ({ graph }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Enterprise Knowledge Graph Hardening
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Score de Hardening: {graph.graphHardeningScore}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Entidades Conectadas: <strong className="text-foreground">{graph.totalEntitiesCount} nós</strong></span>
        <span>Arestas Causais: <strong className="text-primary">{graph.totalCausalEdgesCount} conexões</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
