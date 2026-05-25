import { BPSummary } from '../../../lib/bpEngine';
type FinancialMetrics = any;

export interface CapitalStructureOutput {
  qualityRating: string;
  elasticity: string;
  rolloverRisk: string;
  operationalDependency: string;
}

export function translateCapitalStructure(bpSummary: BPSummary | undefined, metrics: FinancialMetrics | undefined): CapitalStructureOutput {
  if (!bpSummary || !metrics || !metrics.hasData) {
    return {
      qualityRating: '[INSUFFICIENT_DATA]',
      elasticity: '[INSUFFICIENT_DATA]',
      rolloverRisk: '[INSUFFICIENT_DATA]',
      operationalDependency: '[INSUFFICIENT_DATA]'
    };
  }

  // Quality Rating
  let qualityRating = 'Qualidade Adequada';
  if (bpSummary.creditosSocios > Math.max(0, bpSummary.patrimonioLiquido)) {
    qualityRating = 'Alavancagem via Sócios (Atenção)';
  } else if (bpSummary.passivosFinanceiros > bpSummary.fornecedores * 2) {
    qualityRating = 'Dívida Bancária Dominante';
  } else if (bpSummary.fornecedores > bpSummary.passivosFinanceiros) {
    qualityRating = 'Passivo Operacional (Funding via Fornecedores)';
  }

  // Elasticity
  let elasticity = 'Inflexível (CGL Negativo/Nulo)';
  if (metrics.cgl > metrics.ncg) {
    elasticity = 'Alta (CGL supera NCG)';
  } else if (metrics.cgl > 0) {
    elasticity = 'Parcial (CGL não cobre NCG total)';
  }

  // Rollover Risk
  let rolloverRisk = 'Baixo a Moderado';
  if (metrics.qualidadeEndividamento > 0.7) {
    rolloverRisk = 'Alto Risco (Forte concentração no Curto Prazo)';
  } else if (metrics.qualidadeEndividamento > 0.5) {
    rolloverRisk = 'Atenção (Curto Prazo pressionado)';
  }

  // Operational Dependency (Banking Dependence)
  let operationalDependency = 'Moderada';
  if (metrics.dependenciaBancaria < 0.2) {
    operationalDependency = 'Baixa (Independente de Bancos)';
  } else if (metrics.dependenciaBancaria > 0.5) {
    operationalDependency = 'Alta (Refém de Crédito Externo)';
  }

  return {
    qualityRating,
    elasticity,
    rolloverRisk,
    operationalDependency
  };
}
