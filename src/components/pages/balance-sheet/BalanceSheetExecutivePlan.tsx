import React from 'react';
import { ExecutiveActionCard } from '../../ui/executive-action-card';
import { ExecutiveDecisionSummary } from '../../ui/executive-decision-summary';
import { ExecutiveActionGrid } from '../../ui/executive-action-grid';

export type ExecutivePlanAction = {
  prazo: string;
  acao: string;
};

export type BalanceSheetExecutivePlanProps = {
  executivePlan?: string;
  dominantRiskFamily?: string;
  executiveInterpretation?: {
    strategicSeverity?: string;
    strategicSeverityReason?: string;
    planFinanceiro?: ExecutivePlanAction;
    planOperacional?: ExecutivePlanAction;
    planGovernanca?: ExecutivePlanAction;
  };
};

export const BalanceSheetExecutivePlan = ({
  executivePlan,
  dominantRiskFamily,
  executiveInterpretation
}: BalanceSheetExecutivePlanProps) => {
  
  const getSeverityTone = (severity?: string) => {
    switch(severity) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'warning';
      case 'MODERATE': return 'info';
      default: return 'success';
    }
  };

  const getSeverityLabel = (severity?: string) => {
    switch(severity) {
      case 'CRITICAL': return 'CRÍTICA';
      case 'HIGH': return 'ALTA';
      case 'MODERATE': return 'MODERADA';
      default: return 'MONITORAMENTO';
    }
  };

  return (
    <div className="flex flex-col items-start justify-start w-full mb-12">
      <h3 className="text-[28px] lg:text-[30px] font-semibold leading-[1.2] tracking-tight text-foreground mb-8">
        Plano Executivo Consolidado
      </h3>
      
      <div className="w-full flex flex-col items-start justify-start gap-8">
        {executivePlan && executivePlan.includes('|') ? (
          <>
            <ExecutiveDecisionSummary 
              severityLabel={getSeverityLabel(executiveInterpretation?.strategicSeverity)}
              severityTone={getSeverityTone(executiveInterpretation?.strategicSeverity)}
              theme={dominantRiskFamily || 'Diretriz Estratégica'}
              reason={executiveInterpretation?.strategicSeverityReason || 'Análise Executiva'}
            />
            
            <ExecutiveActionGrid>
              {[
                { title: 'Financeiro', plan: executiveInterpretation?.planFinanceiro },
                { title: 'Operacional', plan: executiveInterpretation?.planOperacional },
                { title: 'Governança', plan: executiveInterpretation?.planGovernanca }
              ].map((frente, i) => {
                if (!frente.plan) return null;
                return (
                  <ExecutiveActionCard 
                    key={i}
                    category={frente.title}
                    timeline={frente.plan.prazo}
                    action={frente.plan.acao}
                  />
                );
              })}
            </ExecutiveActionGrid>
          </>
        ) : (
          <p className="text-[16px] font-normal leading-[1.75] text-foreground/80 max-w-[78ch]">
            {executivePlan}
          </p>
        )}
      </div>
    </div>
  );
};
