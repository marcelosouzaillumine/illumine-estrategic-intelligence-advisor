import React from 'react';
import { Activity } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { EnterpriseDataHealthScore } from '../../../../packages/core/enterprise-knowledge-foundation/src/EnterpriseDataHealthIndexEngine';

export interface EnterpriseDataHealthIndexCardProps {
  readonly healthScore: EnterpriseDataHealthScore;
}

export const EnterpriseDataHealthIndexCard: React.FC<EnterpriseDataHealthIndexCardProps> = ({ healthScore }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-success" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Enterprise Data Health Index
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Índice Composto: {healthScore.compositeIndex}
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mt-2">
        <div>Completeness: <strong className="text-foreground">{healthScore.completenessScore}%</strong></div>
        <div>Freshness: <strong className="text-foreground">{healthScore.freshnessScore}%</strong></div>
        <div>Consistency: <strong className="text-foreground">{healthScore.consistencyScore}%</strong></div>
        <div>Reliability: <strong className="text-foreground">{healthScore.reliabilityScore}%</strong></div>
        <div>Lineage: <strong className="text-primary">{healthScore.lineageScore}%</strong></div>
      </div>
    </ExecutiveSurface>
  );
};
