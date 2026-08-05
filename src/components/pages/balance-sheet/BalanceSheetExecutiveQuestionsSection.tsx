import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { cn } from '../../../lib/utils';

export interface DecisionTriggerPayload {
  trigger: string;
  businessContext: string;
  questionForBoard: string;
  requiredDecision: boolean;
}

export function BalanceSheetExecutiveQuestionsSection({ triggers }: { triggers: DecisionTriggerPayload[] }) {
  if (!triggers || triggers.length === 0) return null;

  return (
    <div className="w-full my-12">
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
        <div className="text-primary flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground leading-tight tracking-tight">
          Questões Executivas para o Conselho (Decision Triggers)
        </ExecutiveHeading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {triggers.map((trigger, idx) => (
          <ExecutiveSurface key={idx} padding="md" radius="md" className="border border-border shadow-md bg-card flex flex-col gap-4">
            <div>
              <ExecutiveText variant="microLabel" className="text-executive-muted uppercase tracking-wider font-semibold mb-1">
                Trigger Institucional
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-foreground font-medium">
                {trigger.trigger}
              </ExecutiveText>
            </div>
            
            <div className="bg-surface-high p-3 rounded-md border border-border/50">
              <ExecutiveText variant="microLabel" className="text-executive-muted uppercase tracking-wider font-semibold mb-1">
                Contexto da Operação
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-executive-secondary">
                {trigger.businessContext}
              </ExecutiveText>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">
              <ExecutiveText variant="microLabel" className="text-primary uppercase tracking-wider font-semibold">
                Questão para o Conselho
              </ExecutiveText>
              <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground leading-snug">
                {trigger.questionForBoard}
              </ExecutiveHeading>
              {trigger.requiredDecision && (
                <div className="mt-2 inline-flex items-center w-fit px-2 py-1 rounded-full bg-state-warning-soft border border-state-warning-border">
                  <span className="w-2 h-2 rounded-full bg-state-warning-foreground mr-2" />
                  <span className="text-xs font-semibold text-state-warning-foreground">Deliberação Requerida</span>
                </div>
              )}
            </div>
          </ExecutiveSurface>
        ))}
      </div>
    </div>
  );
}
