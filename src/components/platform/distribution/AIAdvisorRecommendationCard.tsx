import React from 'react';
import { Sparkles } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisorRecommendationContract } from '@illumine/executive-contracts';

export interface AIAdvisorRecommendationCardProps {
  readonly recommendation: AdvisorRecommendationContract;
}

export const AIAdvisorRecommendationCard: React.FC<AIAdvisorRecommendationCardProps> = ({ recommendation }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Recomendação Cognitiva Preditiva de Advisor (IA Council)
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Confiança: {recommendation.matchConfidencePercent}%
        </ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        <strong className="text-foreground">Justificativa da IA: </strong>{recommendation.reasoningJustification}
      </p>
    </ExecutiveSurface>
  );
};
