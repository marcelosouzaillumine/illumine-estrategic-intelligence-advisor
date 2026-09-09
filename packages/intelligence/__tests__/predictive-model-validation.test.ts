/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { RiskPredictionContract, OpportunityPredictionContract } from '@illumine/executive-contracts';

describe('@illumine/governance (Wave 18.9 Predictive Model Validation)', () => {
  it('should validate RiskPredictionContract and OpportunityPredictionContract schemas', () => {
    const risk: RiskPredictionContract = {
      riskId: 'risk-cash-01',
      title: 'Risco de Ruptura de Caixa Operacional',
      riskCategory: 'CASH_SHORTAGE',
      probabilityPercent: 78.5,
      impactSeverity: 'HIGH',
      timeHorizonDays: 60,
      expectedFinancialImpact: 450000,
      leadingIndicators: ['REDUCTION_PMR', 'WORKING_CAPITAL_PRESSURE'],
      confidenceScore: 92.0
    };

    const opp: OpportunityPredictionContract = {
      opportunityId: 'opp-margin-01',
      title: 'Captura de Eficiência em Custos Variáveis',
      expectedGainValue: 320000,
      probabilityPercent: 85.0,
      timeHorizonDays: 90,
      investmentRequiredValue: 40000,
      confidenceScore: 95.0,
      affectedKPIs: ['EBITDA_MARGIN', 'GROSS_MARGIN']
    };

    expect(risk.riskCategory).toBe('CASH_SHORTAGE');
    expect(opp.expectedGainValue).toBeGreaterThan(opp.investmentRequiredValue);
  });
});
