import React from 'react';
import { Target, Zap } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveAdvisoryOpportunity } from '@illumine/executive-contracts';
import { useTranslation } from "react-i18next";
import { useExecutiveFormatter } from '../../../core/localization';

export interface ExecutiveOpportunityCardProps {
  readonly opportunity: ExecutiveAdvisoryOpportunity;
  readonly priorityScore: number;
}

export const ExecutiveOpportunityCard: React.FC<ExecutiveOpportunityCardProps> = ({ opportunity, priorityScore }) => {
  // @ts-ignore
  const { t } = useTranslation('advisory/insights');
  const formatter = useExecutiveFormatter();

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            {t('title', { id: opportunity.opportunityId })}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="critical" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>{t('priorityScore', { score: priorityScore })}</span>
        </ExecutiveBadge>
      </div>

      <ExecutiveText variant="bodyStandard" className="font-bold text-foreground mb-1">
        {t('detectedSignal', { signal: opportunity.detectedSignal })}
      </ExecutiveText>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>{t('estimatedImpact')} <strong className="text-success">{formatter.currency(opportunity.businessImpact)}</strong></span>
        <span>{t('recommendedDate')} <strong className="text-foreground">{opportunity.recommendedDecisionDate}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
