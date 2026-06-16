import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveExecutionStep } from '../../types/executive/ExecutiveDecisionWorkspaceModel';
import { ExecutiveText, ExecutiveMetric } from './executive-typography';

export interface ExecutiveExecutionPlanProps {
  steps: ExecutiveExecutionStep[];
  className?: string;
}

export function ExecutiveExecutionPlan({ steps, className }: ExecutiveExecutionPlanProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className={cn("w-full pt-8 flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-1.5">
        <ExecutiveText variant="sectionTitle" as="h3">Plano de Execução Prioritário</ExecutiveText>
        <ExecutiveText variant="sectionSubtitle" as="p">Sequência recomendada de iniciativas para implementação das decisões estratégicas.</ExecutiveText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
        {steps.map((step, index) => {
          const numberSymbol = String.fromCharCode(9312 + index); // ①, ②, ③...
          const isLast = index === steps.length - 1;
          
          return (
            <div key={index} className="flex flex-col relative">
              <div 
                className={cn(
                  "flex flex-col gap-3 p-5 rounded-xl transition-all duration-300 relative h-full md:mr-4 mb-4 md:mb-0",
                  step.isPrimaryStep 
                    ? "bg-slate-50 border border-slate-200 shadow-sm" 
                    : "bg-transparent border border-transparent hover:bg-slate-50/50"
                )}
              >
                {/* Connecting Line for Desktop */}
                {!isLast && (
                  <div className="hidden md:block absolute top-8 -right-2 w-4 h-px bg-slate-200 z-10" />
                )}

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ExecutiveMetric variant="metricCompact" as="span" className="text-executive-primary">
                      {numberSymbol}
                    </ExecutiveMetric>
                    <ExecutiveText variant="cardTitle" as="span" className="uppercase text-executive-primary">
                      {step.domain}
                    </ExecutiveText>
                  </div>
                  {step.isPrimaryStep && (
                    <ExecutiveText variant="caption" as="span" className="text-executive-primary bg-slate-200 px-2 py-0.5 rounded-sm">
                      Etapa Atual
                    </ExecutiveText>
                  )}
                </div>
                
                <div className="mb-1">
                  <ExecutiveText variant="label">{step.horizon}</ExecutiveText>
                </div>
                
                <ExecutiveText variant="body" as="p">
                  {step.description}
                </ExecutiveText>

                {step.expectedResult && (
                  <div className="mt-2 pt-3 border-t border-border/50">
                    <div className="mb-1">
                      <ExecutiveText variant="label">RESULTADO ESPERADO</ExecutiveText>
                    </div>
                    <ExecutiveText variant="bodyStrong" as="span" className="text-executive-primary">
                      {step.expectedResult}
                    </ExecutiveText>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
