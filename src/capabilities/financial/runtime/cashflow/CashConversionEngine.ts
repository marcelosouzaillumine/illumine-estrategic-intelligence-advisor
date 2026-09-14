// src/core/runtime/cashflow/CashConversionEngine.ts
import { CashConversionMetrics } from './cashflow-types';

export function calculateCashConversion(
  ebitda: number, 
  workingCapitalVariation: number, 
  capex: number, 
  operatingCashFlow: number
): CashConversionMetrics {
  
  // Refinamento 2: Reconciliação completa antes de concluir sustentabilidade/qualidade
  // EBITDA não é proxy primária. Subtraímos variação de giro e capex operacional.
  const theoreticalCashFromOps = ebitda - workingCapitalVariation;
  const freeCashFlowOperational = operatingCashFlow - capex;
  
  // Conversão de Caixa: mede o quanto da operação efetivamente vira caixa pós-giro
  let conversionRatio = 0;
  if (theoreticalCashFromOps > 0) {
    conversionRatio = operatingCashFlow / theoreticalCashFromOps;
  } else if (operatingCashFlow > 0 && theoreticalCashFromOps <= 0) {
    conversionRatio = 1; // Geração anômala positiva contra base teórica negativa
  }

  let qualityOfEarnings: 'ALTA' | 'MÉDIA' | 'BAIXA' | 'INSUFICIENTE' = 'INSUFICIENTE';

  if (freeCashFlowOperational > 0 && conversionRatio >= 0.8) {
    qualityOfEarnings = 'ALTA';
  } else if (operatingCashFlow > 0 && conversionRatio >= 0.5) {
    qualityOfEarnings = 'MÉDIA';
  } else if (operatingCashFlow > 0) {
    qualityOfEarnings = 'BAIXA';
  } else {
    qualityOfEarnings = 'INSUFICIENTE';
  }

  return {
    ebitda,
    workingCapitalVariation,
    capex,
    operatingCashFlow,
    conversionRatio,
    qualityOfEarnings
  };
}
