import React from 'react';
import { Award } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { DecisionTrustContract } from '@illumine/executive-contracts';

export interface ConfidenceBreakdownCardProps {
  readonly trustContract: DecisionTrustContract;
}

export const ConfidenceBreakdownCard: React.FC<ConfidenceBreakdownCardProps> = ({ trustContract }) => {
  const bd = trustContract.confidenceBreakdown;

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <Award className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Composição da Confiança Decisória ({trustContract.overallConfidenceScore}%)
        </ExecutiveText>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mt-2">
        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Qualidade de Dados</span>
          <span className="font-bold text-foreground">{bd.dataQualityScore}%</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Volume Histórico</span>
          <span className="font-bold text-foreground">{bd.historicalVolumeScore}%</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Benchmark Coberto</span>
          <span className="font-bold text-foreground">{bd.benchmarkCoverageScore}%</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Estabilidade de Tendência</span>
          <span className="font-bold text-foreground">{bd.trendStabilityScore}%</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Consenso do Conselho</span>
          <span className="font-bold text-success">{bd.councilConsensusScore}%</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Match Knowledge Graph</span>
          <span className="font-bold text-foreground">{bd.knowledgeGraphMatchScore}%</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
