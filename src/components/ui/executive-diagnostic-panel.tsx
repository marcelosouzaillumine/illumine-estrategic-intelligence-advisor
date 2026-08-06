import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveText } from './executive-typography';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveCallout } from './executive-callout';

export interface ExecutiveDiagnosticPanelProps {
  question: string;
  statusBadge?: React.ReactNode;
  observation: string;
  evidence: string;
  financialMeaning: string;
  executiveQuestion?: string;
  confidence?: string;
  technicalIndex?: string | number;
  className?: string;
}

export const ExecutiveDiagnosticRhythm = {
  questionToBadge: "gap-4",     // 16px
  badgeToObservation: "mt-4",   // 16px
  observationToEvidence: "mt-8",// 32px
  evidenceToMeaning: "gap-2",   // 8px
  meaningToAction: "mt-6",      // 24px
  actionLabelToAction: "gap-1"  // 4px
};

export function ExecutiveDiagnosticPanel({
  question,
  statusBadge,
  observation,
  evidence,
  financialMeaning,
  executiveQuestion,
  confidence,
  technicalIndex,
  className
}: ExecutiveDiagnosticPanelProps) {
  return (
    <div className={cn("flex flex-col w-full animate-executive-fade relative", className)}>
      
      {/* 0. Pergunta Analítica */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveDiagnosticRhythm.questionToBadge)}>
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

      {/* 1. Observação (Fato) */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveDiagnosticRhythm.badgeToObservation)}>
        <ExecutiveHeading as="h3" variant="moduleTitle" className="max-w-[65ch]">
          {observation}
        </ExecutiveHeading>
      </div>

      {/* 2. Evidência & Significado */}
      <div className={cn("flex flex-col w-full", ExecutiveDiagnosticRhythm.observationToEvidence, ExecutiveDiagnosticRhythm.evidenceToMeaning)}>
        <ExecutiveText variant="microLabel" className="text-executive-muted">
          Evidência Primária
        </ExecutiveText>
        <ExecutiveHeading as="h4" variant="submoduleTitle">
          {evidence}
        </ExecutiveHeading>
        <div className="mt-4">
          <ExecutiveText variant="microLabel" className="text-executive-muted">
            Significado Financeiro
          </ExecutiveText>
          <ExecutiveText variant="bodyLarge" as="p" className="max-w-[70ch] mt-1 text-executive-secondary">
            {financialMeaning}
          </ExecutiveText>
        </div>
      </div>

      {/* 3. Executive Question */}
      {executiveQuestion && (
        <div className={cn("flex flex-col items-start w-full", ExecutiveDiagnosticRhythm.meaningToAction, ExecutiveDiagnosticRhythm.actionLabelToAction)}>
          <ExecutiveText variant="microLabel" className="text-executive-muted mb-1">
            Questão para Deliberação do Board
          </ExecutiveText>
          <ExecutiveCallout variant="info" className="w-full">
            <ExecutiveText variant="bodyStrong" as="p" className="text-foreground font-medium">
              {executiveQuestion}
            </ExecutiveText>
          </ExecutiveCallout>
        </div>
      )}

    </div>
  );
}
