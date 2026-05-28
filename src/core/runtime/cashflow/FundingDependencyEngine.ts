// src/core/runtime/cashflow/FundingDependencyEngine.ts
import { FundingDependencyMetrics } from './cashflow-types';

export function calculateFundingDependency(
  operatingCashFlow: number,
  financingCashFlow: number,
  thirdPartyFunding: number, // Ex: Captação de Empréstimos
  equityFunding: number // Ex: Aporte de Sócios
): FundingDependencyMetrics {
  
  let dependencyStatus: 'AUTOFINANCIADA' | 'ALAVANCAGEM_CONTROLADA' | 'ALAVANCAGEM_CRÍTICA' | 'DEPENDÊNCIA_SÓCIOS' = 'AUTOFINANCIADA';

  if (operatingCashFlow > 0 && financingCashFlow <= 0) {
    dependencyStatus = 'AUTOFINANCIADA';
  } else if (equityFunding > 0 && equityFunding > thirdPartyFunding && operatingCashFlow <= 0) {
    dependencyStatus = 'DEPENDÊNCIA_SÓCIOS';
  } else if (thirdPartyFunding > 0) {
    // Relying on debt
    if (operatingCashFlow > 0) {
      dependencyStatus = 'ALAVANCAGEM_CONTROLADA';
    } else {
      dependencyStatus = 'ALAVANCAGEM_CRÍTICA';
    }
  } else if (operatingCashFlow <= 0 && financingCashFlow > 0) {
    dependencyStatus = 'ALAVANCAGEM_CRÍTICA';
  }

  return {
    thirdPartyFunding,
    equityFunding,
    operationalFunding: operatingCashFlow > 0 ? operatingCashFlow : 0,
    dependencyStatus
  };
}
