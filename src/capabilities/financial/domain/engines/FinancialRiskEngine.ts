import { NormalizedBalanceSheet } from '../models/NormalizedBalanceSheet';
import { RiskExposure } from '../../../../core/intelligence/contracts/RiskExposure';
import { FinancialRiskRules } from '../rules/FinancialRiskRules';

export class FinancialRiskEngine {
  static analyze(data: NormalizedBalanceSheet): RiskExposure[] {
    const exposures: RiskExposure[] = [];

    for (const rule of FinancialRiskRules) {
      const risk = rule.evaluate(data);
      if (risk) {
        exposures.push(risk);
      }
    }

    return exposures;
  }
}
