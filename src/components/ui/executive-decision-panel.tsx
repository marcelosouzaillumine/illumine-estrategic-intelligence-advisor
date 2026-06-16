import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveText } from './executive-typography';

export interface ExecutiveDecisionPanelProps {
  question: string;
  statusBadge?: React.ReactNode;
  opinion: string;
  driver: string;
  implication: string;
  action: string;
  confidence?: string;
  technicalIndex?: string | number;
  className?: string;
}

export const ExecutiveDecisionRhythm = {
  questionToBadge: "gap-4",     // 16px
  badgeToOpinion: "mt-4",       // 16px
  opinionToDriver: "mt-8",      // 32px
  driverToImplication: "gap-2", // 8px
  implicationToAction: "mt-6",  // 24px
  actionLabelToAction: "gap-1"  // 4px
};

export function ExecutiveDecisionPanel({
  question,
  statusBadge,
  opinion,
  driver,
  implication,
  action,
  confidence,
  technicalIndex,
  className
}: ExecutiveDecisionPanelProps) {
  return (
    <div className={cn("flex flex-col w-full animate-executive-fade relative", className)}>
      
      {/* 0. Pergunta Executiva */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveDecisionRhythm.questionToBadge)}>
        <ExecutiveText variant="moduleSubtitle" as="p" className="text-executive-muted border-l-2 border-border pl-3">
          {question}
        </ExecutiveText>
        
        {/* Status Badge e Metadados Técnicos */}
        <div className="w-full flex items-center gap-4 flex-wrap mt-4">
          {statusBadge && (
            <div className="flex justify-start">
              {statusBadge}
            </div>
          )}
          
          {(confidence || technicalIndex) && (
            <div className="flex items-center gap-2 text-[12px] font-medium text-executive-muted uppercase tracking-wider">
              {confidence && (
                <span>Confiança: <span className="text-executive-primary">{confidence}</span></span>
              )}
              {confidence && technicalIndex && (
                <span className="text-border">•</span>
              )}
              {technicalIndex && (
                <span>Índice Técnico: <span className="text-executive-primary">{technicalIndex}</span></span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 1. Parecer Executivo */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveDecisionRhythm.badgeToOpinion)}>
        <ExecutiveText variant="moduleTitle" as="h3" className="max-w-[65ch]">
          {opinion}
        </ExecutiveText>
      </div>

      {/* 2. Driver & Implicação */}
      <div className={cn("flex flex-col w-full", ExecutiveDecisionRhythm.opinionToDriver, ExecutiveDecisionRhythm.driverToImplication)}>
        <ExecutiveText variant="microLabel" className="text-executive-muted">
          Principal Driver
        </ExecutiveText>
        <ExecutiveText variant="submoduleTitle" as="h4">
          {driver}
        </ExecutiveText>
        <ExecutiveText variant="bodyLarge" as="p" className="max-w-[70ch] mt-1 text-executive-secondary">
          {implication}
        </ExecutiveText>
      </div>

      {/* 3. Ação Tática */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveDecisionRhythm.implicationToAction, ExecutiveDecisionRhythm.actionLabelToAction)}>
        <ExecutiveText variant="microLabel" className="text-executive-muted">
          Ação Tática
        </ExecutiveText>
        <div className="bg-executive-primary/5 px-4 py-3 rounded-md border-l-2 border-executive-primary mt-1">
          <ExecutiveText variant="bodyStrong" as="p" className="text-executive-primary">
            {action}
          </ExecutiveText>
        </div>
      </div>

    </div>
  );
}
