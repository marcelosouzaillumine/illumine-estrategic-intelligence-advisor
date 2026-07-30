import React from 'react';
import { Award, ArrowUpRight } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface OpportunityItem {
  readonly id: string;
  readonly title: string;
  readonly potentialValueText: string;
  readonly peerRank: string;
}

export interface OpportunityRankingCardProps {
  readonly opportunities: readonly OpportunityItem[];
}

export const OpportunityRankingCard: React.FC<OpportunityRankingCardProps> = ({ opportunities }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <Award className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Ranking de Oportunidades por Captura de Benchmark
        </ExecutiveText>
      </div>

      <div className="space-y-2 text-xs">
        {opportunities.map((opp, idx) => (
          <div key={opp.id} className="flex items-center justify-between p-2.5 bg-surface-container/30 rounded border border-border/30">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                #{idx + 1}
              </span>
              <span className="font-medium text-foreground">{opp.title}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-success font-semibold">{opp.potentialValueText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
