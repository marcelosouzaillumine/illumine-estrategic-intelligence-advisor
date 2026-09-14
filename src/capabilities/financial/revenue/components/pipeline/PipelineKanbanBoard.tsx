import React from 'react';
import { OpportunityReadModel } from '@application/revenue/pipeline/read-models/OpportunityReadModel';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveBadge } from '@/components/ui/executive-badge';

interface PipelineKanbanBoardProps {
  cards: OpportunityReadModel[];
  onSelectCard?: (id: string) => void;
}

const STAGES = [
  'Lead',
  'Qualified',
  'Discovery',
  'Solution Design',
  'Proposal',
  'Negotiation',
  'Decision',
  'Accepted',
  'Lost'
];

export function PipelineKanbanBoard({ cards, onSelectCard }: PipelineKanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[600px] w-full">
      {STAGES.map((stage) => {
        const stageCards = cards.filter((c) => c.stage === stage);
        const stageValue = stageCards.reduce((acc, c) => acc + c.value, 0);

        return (
          <div key={stage} className="flex flex-col min-w-[320px] max-w-[320px] bg-slate-50/50 border border-border rounded-3xl flex-shrink-0 overflow-hidden">
            <div className="p-5 border-b border-border bg-white/50 flex justify-between items-center">
              <div>
                <ExecutiveText variant="label" className="font-semibold">{stage}</ExecutiveText>
                <ExecutiveText variant="caption" className="text-muted-foreground mt-1">
                  {stageCards.length} opps
                </ExecutiveText>
              </div>
              <ExecutiveText variant="label" className="font-semibold text-primary">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stageValue)}
              </ExecutiveText>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {stageCards.map((card) => (
                <div 
                  key={card.id} 
                  className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 cursor-pointer transition-all"
                  onClick={() => onSelectCard?.(card.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <ExecutiveText variant="label" className="font-semibold line-clamp-1">{card.company}</ExecutiveText>
                    <ExecutiveBadge variant="neutral" className="text-[10px] uppercase font-black bg-primary/5 text-primary border-primary/20 tracking-widest">{card.probability}%</ExecutiveBadge>
                  </div>
                  <ExecutiveText variant="body" className="line-clamp-2 mb-3">{card.title}</ExecutiveText>
                  
                  <div className="flex justify-between items-center mb-3">
                    <ExecutiveText variant="label" className="font-semibold text-primary">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(card.value)}
                    </ExecutiveText>
                  </div>

                  {card.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.badges.map(badge => (
                        <ExecutiveBadge key={badge} variant="neutral" className="bg-slate-100 border-transparent text-[9px] uppercase tracking-wider font-bold">{badge}</ExecutiveBadge>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <ExecutiveText variant="caption" className="text-muted-foreground line-clamp-1 flex-1">
                      Next: {card.nextAction || 'None'}
                    </ExecutiveText>
                    <ExecutiveText variant="caption" className="text-muted-foreground/50 ml-2 whitespace-nowrap">
                      {card.lastUpdate}
                    </ExecutiveText>
                  </div>
                </div>
              ))}
              {stageCards.length === 0 && (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <ExecutiveText variant="caption" className="text-muted-foreground/50">Empty stage</ExecutiveText>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
