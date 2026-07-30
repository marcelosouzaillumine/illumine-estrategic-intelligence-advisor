import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { ExecutiveRecommendationObject } from '@illumine/executive-contracts';

export interface RecommendationCardProps {
  readonly recommendation: ExecutiveRecommendationObject;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-sm">{recommendation.title}</h3>
        </div>
        <ExecutiveBadge variant="info">Trust Score: {recommendation.advisoryTrustScore}</ExecutiveBadge>
      </div>

      <p className="text-xs text-foreground font-medium">{recommendation.recommendationStatement}</p>
      <p className="text-xs text-muted-foreground">{recommendation.strategicRationale}</p>

      {/* CounterArguments Evidentiary Bundle */}
      <div className="p-2.5 rounded bg-background/50 border border-border/30 text-xs space-y-1">
        <span className="font-bold text-amber-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Contrapontos & Premissas de Risco (counterArguments):
        </span>
        <ul className="list-disc list-inside text-muted-foreground space-y-0.5 pl-1">
          {recommendation.evidenceBundle.counterArguments.map((arg, idx) => (
            <li key={idx}>{arg}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center text-xs pt-1 border-t border-border/20">
        <span className="text-emerald-400 font-bold">{recommendation.evidenceBundle.expectedImpact}</span>
        <ExecutiveBadge variant="success">Chancela Humana Requerida</ExecutiveBadge>
      </div>
    </ExecutiveSurface>
  );
};
