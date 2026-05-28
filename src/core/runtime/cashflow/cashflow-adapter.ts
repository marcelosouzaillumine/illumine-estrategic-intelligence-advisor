import { ConsolidatedCashFlowReport } from './cashflow-types';
import { CashFlowOperationalEngine } from './CashFlowOperationalEngine';
import { CashConversionEngine } from './CashConversionEngine';
import { TreasuryPressureEngine } from './TreasuryPressureEngine';
import { LiquiditySustainabilityEngine } from './LiquiditySustainabilityEngine';
import { FundingDependencyEngine } from './FundingDependencyEngine';

export class CashFlowAdapter {
  public static process(
    rawData: any,
    ebitda: number,
    lucroLiquido: number,
    bpSummary: any,
    dreData: any
  ): ConsolidatedCashFlowReport {
    const cashFlowData = rawData?.cashFlowData;
    const hasCashFlow = !!cashFlowData && Array.isArray(cashFlowData) && cashFlowData.length > 0;

    if (!hasCashFlow) {
      const blockMsg = 'DFC indisponível para análise institucional.';
      return {
        isAvailable: false,
        operational: {
          operatingCashFlow: 0,
          ebitda: ebitda,
          ebitdaToCashConversion: null,
          ebitdaConversionQuality: 'FALTA_DADO',
          selfSufficiencyIndex: null,
          isSelfSustained: false,
          narrative: blockMsg
        },
        conversion: {
          receivablesAging: 0,
          payablesAging: 0,
          cashConversionCycleDays: null,
          conversionEfficiency: 'FALTA_DADO',
          inventoryDrainImpact: null,
          isGrowthConsumingLiquidity: false,
          narrative: blockMsg
        },
        treasury: {
          currentCashBalance: 0,
          monthlyCashBurnRate: 0,
          runwayMonths: null,
          runwayClassification: 'FALTA_DADO',
          daysToRupture: null,
          shortTermObligations: 0,
          pressureRatio: 0,
          pressureClassification: 'FALTA_DADO',
          narrative: blockMsg
        },
        liquidity: {
          lcr: null,
          sustainabilityScore: 0,
          sustainabilityClassification: 'FALTA_DADO',
          operationalCoverageMonths: null,
          narrative: blockMsg
        },
        funding: {
          fundingInflows: 0,
          partnerInjections: 0,
          totalExternalFunding: 0,
          dependencyClassification: 'FALTA_DADO',
          fundingDependencyRatio: null,
          debtAmortizationCoverage: null,
          narrative: blockMsg
        },
        overallNarrative: blockMsg
      };
    }

    const doc = cashFlowData[0];

    const operational = CashFlowOperationalEngine.calculate(doc, ebitda);
    const conversion = CashConversionEngine.calculate(doc, bpSummary, dreData);
    const treasury = TreasuryPressureEngine.calculate(doc);
    const liquidity = LiquiditySustainabilityEngine.calculate(doc, treasury.runwayMonths, operational.operatingCashFlow);
    const funding = FundingDependencyEngine.calculate(doc);

    // Build consolidated overall narrative
    let overallNarrative = `A dinâmica de caixa apresenta geração operacional de ${operational.operatingCashFlow >= 0 ? 'superavitária' : 'deficitária'} de R$ ${operational.operatingCashFlow.toLocaleString('pt-BR')}.`;
    if (treasury.runwayMonths !== null) {
      overallNarrative += ` A liquidez disponível suporta aproximadamente ${treasury.runwayMonths.toFixed(1)} meses de operação.`;
    }
    overallNarrative += ` A sustentabilidade do caixa é classificada como ${liquidity.sustainabilityClassification.toLowerCase()}, sob dependência de fomento ${funding.dependencyClassification.toLowerCase()}.`;

    return {
      isAvailable: true,
      operational,
      conversion,
      treasury,
      liquidity,
      funding,
      overallNarrative
    };
  }
}
