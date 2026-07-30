import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ExecutiveFinalDecisionCardProps {
  readonly finalRecommendation: string;
  readonly isUnanimous: boolean;
}

export const ExecutiveFinalDecisionCard: React.FC<ExecutiveFinalDecisionCardProps> = ({ finalRecommendation, isUnanimous }) => {
  return (
    <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Parecer Final Homologado pelo Conselho
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={isUnanimous ? 'success' : 'warning'}>
          {isUnanimous ? 'Unânime' : 'Maioria Qualificada'}
        </ExecutiveBadge>
      </div>
      <p className="text-foreground text-xs leading-relaxed font-medium">
        {finalRecommendation}
      </p>
    </ExecutiveSurface>
  );
};
