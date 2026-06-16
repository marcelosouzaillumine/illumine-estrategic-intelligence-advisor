import React from 'react';
import { ExecutiveDecisionSummary } from '../../ui/executive-decision-summary';
import { ExecutiveExecutionPlan } from '../../ui/executive-execution-plan';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveSurface } from '../../ui/executive-surface';

interface Props {
  plan: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  primaryRecommendation: string;
}

export function DREExecutivePlanSection({ plan, primaryRecommendation }: Props) {
  const steps = [
    {
      domain: 'Tático Imediato',
      horizon: '0-90 dias',
      description: plan.shortTerm,
      isPrimaryStep: true
    },
    {
      domain: 'Tático-Estratégico',
      horizon: '3-6 meses',
      description: plan.mediumTerm,
      isPrimaryStep: false
    },
    {
      domain: 'Estratégico Estrutural',
      horizon: '6-12 meses',
      description: plan.longTerm,
      isPrimaryStep: false
    }
  ];

  return (
    <ExecutiveSurface variant="transparent" padding="none" className="flex flex-col items-start justify-start w-full animate-executive-fade">
      <ExecutiveHeading as="h3" variant="sectionTitle" className="mb-4">
        Plano Executivo Consolidado
      </ExecutiveHeading>
      
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <ExecutiveDecisionSummary 
          label="DIRETRIZ ESTRATÉGICA"
          severityTone="info"
          theme="Operações e Escala"
          reason={primaryRecommendation || 'Diretriz baseada no diagnóstico atual de resultado.'}
        />
        <ExecutiveExecutionPlan steps={steps} />
      </div>
    </ExecutiveSurface>
  );
}
