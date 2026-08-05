import React from 'react';
import { Compass, Lightbulb, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveRecommendationContract } from '@illumine/executive-contracts';
import { useTranslation } from "react-i18next";
import { useExecutiveFormatter } from '../../../core/localization';

export interface ExecutiveRecommendationCardProps {
  readonly recommendation: ExecutiveRecommendationContract;
}

export const ExecutiveRecommendationCard: React.FC<ExecutiveRecommendationCardProps> = ({ recommendation }) => {
  // @ts-ignore
  const { t } = useTranslation('advisory/recommendations');
  const formatter = useExecutiveFormatter();

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            {t('title')}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          {t('confidence', { percent: recommendation.confidence })}
        </ExecutiveBadge>
      </div>

      <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground mb-2">
        {recommendation.selectedRecommendation}
      </ExecutiveText>

      <div className="p-3 bg-surface-container/30 rounded border border-border/30 mb-3 text-xs">
        <span className="font-bold text-foreground block mb-1">{t('kpiShift')}</span>
        <span className="text-success font-semibold">{recommendation.expectedKPIShift}</span>
      </div>

      <div className="space-y-1 text-xs">
        <span className="font-bold text-foreground block">{t('alternatives')}</span>
        {recommendation.alternatives.map((alt) => (
          <div key={alt.alternativeId} className="flex items-center justify-between text-muted-foreground p-1.5 bg-surface-container/20 rounded">
            <span>{alt.title}</span>
            <span className="text-foreground font-medium">{t('impact')} {formatter.currency(alt.expectedImpact)}</span>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
