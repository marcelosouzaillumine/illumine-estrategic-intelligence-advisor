// src/core/runtime/cashflow/CashConversionEngine.ts
import { CashConversionMetrics } from './cashflow-types';

export function calculateCashConversion(
  ebitda: number, 
  workingCapitalVariation: number, 
  capex: number, 
  operatingCashFlow: number
): CashConversionMetrics {
  
  // A conversão de caixa real considera o que sobra da operação (OCF) versus a promessa de caixa (EBITDA)
  // Mas a reconciliação real passa por subtrair a variação de capital de giro do EBITDA.
  const theoreticalCashFromOps = ebitda - workingCapitalVariation;
  
  // Evitar divisão por zero e distorções (EBITDA negativo ou nulo)
  let conversionRatio = 0;
  if (ebitda > 0) {
    conversionRatio = operatingCashFlow / ebitda;
  }

  let qualityOfEarnings: 'ALTA' | 'MÉDIA' | 'BAIXA' | 'INSUFICIENTE' = 'INSUFICIENTE';

  if (ebitda <= 0) {
    qualityOfEarnings = 'INSUFICIENTE';
  } else if (conversionRatio > 0.8) {
    qualityOfEarnings = 'ALTA';
  } else if (conversionRatio > 0.5) {
    qualityOfEarnings = 'MÉDIA';
  } else {
    qualityOfEarnings = 'BAIXA';
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
