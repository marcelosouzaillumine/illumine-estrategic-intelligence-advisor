import React from 'react';
import { GitMerge } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { EntityResolutionContract } from '@illumine/executive-contracts';

export interface EntityResolutionCardProps {
  readonly resolution: EntityResolutionContract;
}

export const EntityResolutionCard: React.FC<EntityResolutionCardProps> = ({ resolution }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Entity Resolution Engine & Desambiguação
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Match Confidence: {resolution.matchConfidencePercent}%
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>ID Canônico: <strong className="text-foreground">{resolution.canonicalEntityId}</strong></span>
        <span>Estratégia: <strong className="text-primary">{resolution.resolutionStrategy}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
