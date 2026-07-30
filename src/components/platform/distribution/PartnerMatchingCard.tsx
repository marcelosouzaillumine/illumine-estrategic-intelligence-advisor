import React from 'react';
import { UserCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { PartnerDistributionContract } from '@illumine/executive-contracts';

export interface PartnerMatchingCardProps {
  readonly distribution: PartnerDistributionContract;
}

export const PartnerMatchingCard: React.FC<PartnerMatchingCardProps> = ({ distribution }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Matching de Advisor & Distribuição Automatizada
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Score de Match: {distribution.matchingScore}%
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Vertical: <strong className="text-foreground">{distribution.matchedIndustryVertical}</strong></span>
        <span>Região Geo: <strong className="text-foreground">{distribution.matchedGeographicRegion}</strong></span>
        <span>Status: <strong className="text-success">{distribution.status}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
