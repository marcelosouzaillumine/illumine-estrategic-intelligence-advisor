import React from 'react';
import { ExecutiveDecisionSummary } from '../../ui/executive-decision-summary';
import { ExecutiveExecutionPlan } from '../../ui/executive-execution-plan';
import { ExecutiveSectionHeader } from '../../ui/executive-section-header';
import { ExecutiveText } from '../../ui/executive-typography';
import { BalanceSheetExecutivePlanBuilder } from '../../../core/runtime/executive-consolidation/BalanceSheetExecutivePlanBuilder';

export type ExecutivePlanAction = {
  prazo: string;
  acao: string;
  executionMetadata?: any;
};

export type BalanceSheetExecutivePlanProps = {
  planFinanceiro?: any;
  planOperacional?: any;
  planGovernanca?: any;
  dominantRiskFamily?: string;
  strategicSeverity?: string;
  strategicSeverityReason?: string;
};

export const BalanceSheetExecutivePlan = ({
  planFinanceiro,
  planOperacional,
  planGovernanca,
  dominantRiskFamily,
  strategicSeverity,
  strategicSeverityReason
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

  const steps = [];
  if (planFinanceiro) {
    steps.push({
      domain: planFinanceiro.prazo,
      horizon: '0-90 dias',
      description: planFinanceiro.acao,
      isPrimaryStep: true
    });
  }
  if (planOperacional) {
    steps.push({
      domain: planOperacional.prazo,
      horizon: '3-6 meses',
      description: planOperacional.acao,
      isPrimaryStep: false
    });
  }
  if (planGovernanca) {
    steps.push({
      domain: planGovernanca.prazo,
      horizon: '6-12 meses',
      description: planGovernanca.acao,
      isPrimaryStep: false
    });
  }

  const finalReason = (strategicSeverityReason && strategicSeverityReason.toLowerCase().includes('insuficiente')) 
    ? 'Plano tático gerado com base nas diretrizes institucionais padrão, priorizando resiliência patrimonial e otimização da alocação de recursos.'
    : (strategicSeverityReason || 'Diretriz baseada no diagnóstico atual do balanço.');

  return (
    <div className="flex flex-col items-start justify-start w-full mb-12">
      <ExecutiveSectionHeader 
        title="Plano Executivo Consolidado" 
        className="mb-8"
      />
      
      <div className="w-full flex flex-col items-start justify-start gap-8">
        {steps.length > 0 ? (
          <>
            <ExecutiveDecisionSummary 
              label={getSeverityLabel(strategicSeverity)}
              severityTone={getSeverityTone(strategicSeverity)}
              theme={dominantRiskFamily || 'Diretriz Estratégica'}
              reason={finalReason}
            />
            <ExecutiveExecutionPlan steps={steps} />
          </>
        ) : (
          <ExecutiveText as="div" variant="bodyLarge" className="text-executive-secondary max-w-[78ch]">
            Nenhum plano executivo foi gerado.
          </ExecutiveText>
        )}
      </div>
    </div>
  );
};
