// src/core/runtime/cashflow/cashflow-adapter.ts
import { CashFlowDiagnostics } from './cashflow-types';
import { calculateOperationalMetrics } from './CashFlowOperationalEngine';
import { calculateCashConversion } from './CashConversionEngine';
import { calculateTreasuryPressure } from './TreasuryPressureEngine';
import { calculateLiquiditySustainability } from './LiquiditySustainabilityEngine';
import { calculateFundingDependency } from './FundingDependencyEngine';
import { composeCashFlowNarrative } from './CashFlowNarrativeComposer';

export function runCashFlowRuntime(
  dfcData: any[],
  ebitda: number,
  workingCapitalVariation: number,
  capex: number,
  debtService: number,
  availableCash: number,
  thirdPartyFunding: number,
  equityFunding: number
): { diagnostics: CashFlowDiagnostics; narrative: string } {
  
  if (!dfcData || dfcData.length === 0) {
    return {
      diagnostics: {
        isAvailable: false,
        operational: null,
        conversion: null,
        treasury: null,
        sustainability: null,
        funding: null
      },
      narrative: 'DFC indisponível para análise institucional.'
    };
  }

  const operational = calculateOperationalMetrics(dfcData);
  
  // Safe fallback if metrics couldn't be calculated
  if (!operational) {
    return {
      diagnostics: {
        isAvailable: false,
        operational: null,
        conversion: null,
        treasury: null,
        sustainability: null,
        funding: null
      },
      narrative: 'DFC indisponível para análise institucional.'
    };
  }

  const conversion = calculateCashConversion(ebitda, workingCapitalVariation, capex, operational.operatingCashFlow);
  const treasury = calculateTreasuryPressure(debtService, availableCash, operational.operatingCashFlow);
  const sustainability = calculateLiquiditySustainability(operational.operatingCashFlow, capex);
  const funding = calculateFundingDependency(operational.operatingCashFlow, operational.financingCashFlow, thirdPartyFunding, equityFunding);

  const diagnostics: CashFlowDiagnostics = {
    isAvailable: true,
    operational,
    conversion,
    treasury,
    sustainability,
    funding
  };

  const narrative = composeCashFlowNarrative(diagnostics);

  return { diagnostics, narrative };
}
