// src/core/runtime/causal-intelligence/InstitutionalPressurePropagationEngine.ts

import { PressureVector } from './types';

export class InstitutionalPressurePropagationEngine {
  public static evaluate(
    fco: number,
    workingCapitalVariation: number,
    receivables: number,
    inventory: number,
    availableCash: number,
    thirdPartyFunding: number,
    dreNetIncome: number
  ): PressureVector[] {
    const vectors: PressureVector[] = [];

    // 1. Sales & Revenue to Working Capital locking pressure
    let salesToWCPressure = 0;
    if (receivables > 0 || inventory > 0) {
      const activeAssets = receivables + inventory;
      const divisor = Math.max(availableCash + Math.abs(dreNetIncome), 1000);
      salesToWCPressure = Math.min(activeAssets / divisor, 1.0);
    }
    vectors.push({
      sourceLayer: 'SALES',
      targetLayer: 'CASH_FLOW',
      pressureIndex: Number(salesToWCPressure.toFixed(2)),
      description: 'Pressão de conversão de vendas em caixa devido à retenção de ativos circulantes.'
    });

    // 2. Working Capital lock to Cash Flow drain
    let wcToCashPressure = 0;
    if (workingCapitalVariation > 0 && fco < 0) {
      const absFCO = Math.abs(fco);
      wcToCashPressure = Math.min(workingCapitalVariation / Math.max(absFCO, 1000), 1.0);
    }
    vectors.push({
      sourceLayer: 'WORKING_CAPITAL',
      targetLayer: 'CASH_FLOW',
      pressureIndex: Number(wcToCashPressure.toFixed(2)),
      description: 'Dreno de caixa operacional gerado por expansão e necessidade de capital de giro.'
    });

    // 3. Financing dependency to Solvency stress
    let finToSolvencyPressure = 0;
    if (thirdPartyFunding > 0) {
      finToSolvencyPressure = Math.min(thirdPartyFunding / Math.max(availableCash, 1000), 1.0);
    }
    vectors.push({
      sourceLayer: 'FINANCING',
      targetLayer: 'SOLVENCY',
      pressureIndex: Number(finToSolvencyPressure.toFixed(2)),
      description: 'Dependência de captação de recursos externos para manutenção da solvência imediata.'
    });

    return vectors;
  }
}
