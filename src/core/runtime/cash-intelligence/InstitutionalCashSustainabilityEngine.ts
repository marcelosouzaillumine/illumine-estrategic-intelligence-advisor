import { CashFlowReconciliationEngine } from './CashFlowReconciliationEngine';
import { EarningsQualityEngine } from './EarningsQualityEngine';
import { SyntheticProfitDetectionEngine } from './SyntheticProfitDetectionEngine';
import { OperatingCashIntegrityEngine } from './OperatingCashIntegrityEngine';
import { CashConversionStressEngine } from './CashConversionStressEngine';
import { LiquidityConsumptionVelocityEngine } from './LiquidityConsumptionVelocityEngine';
import { WorkingCapitalDrainDetector } from './WorkingCapitalDrainDetector';
import { DebtDependencyPressureEngine } from './DebtDependencyPressureEngine';
import { InstitutionalCashSustainabilityReport } from './types';

export class InstitutionalCashSustainabilityEngine {
  /**
   * Ponto de entrada fiduciário mestre para orquestração da saúde e resiliência de caixa.
   */
  public static evaluate(
    dfcData: any[],
    dreNetIncome: number,
    dreEbitda: number,
    bpCashEquivalentsStart: number,
    bpCashEquivalentsEnd: number,
    fco: number,
    workingCapitalVariation: number,
    receivables: number,
    inventory: number,
    availableCash: number,
    thirdPartyFunding: number
  ): InstitutionalCashSustainabilityReport {
    // 1. Reconciliation Layer
    const reconciliation = CashFlowReconciliationEngine.validate(
      dfcData,
      dreNetIncome,
      bpCashEquivalentsStart,
      bpCashEquivalentsEnd,
      fco,
      0,
      0
    );

    // Se houver restrição bloqueante ou indisponibilidade, retornamos o fail-closed.
    if (!reconciliation.isReconcilable) {
      return {
        isAvailable: false,
        confidence: reconciliation.confidence,
        reconciliation,
        signals: {},
        overallNarrative: reconciliation.disclosures[0] || 'DFC indisponível ou inconciliável para análise fiduciária.',
        fiduciaryDisclosures: reconciliation.disclosures
      };
    }

    // 2. Compute Signals
    const operatingCashIntegrity = OperatingCashIntegrityEngine.evaluate(fco, dreEbitda);
    const earningsCashConversion = EarningsQualityEngine.evaluate(dreNetIncome, dreEbitda, fco);
    const syntheticProfitRisk = SyntheticProfitDetectionEngine.evaluate(dreNetIncome, fco, workingCapitalVariation, receivables, inventory);
    const cashConversionStress = CashConversionStressEngine.evaluate(fco, dreEbitda);
    const liquidityConsumptionVelocity = LiquidityConsumptionVelocityEngine.evaluate(fco, availableCash);
    const workingCapitalPressure = WorkingCapitalDrainDetector.evaluate(workingCapitalVariation, fco);
    const debtDependencyPressure = DebtDependencyPressureEngine.evaluate(fco, thirdPartyFunding);

    // 3. Overall Narrative Synthesis
    let overallNarrative = 'A dinâmica institucional de geração, retenção e sustentação de caixa encontra-se preservada sob a óptica fiduciária.';
    if (operatingCashIntegrity.classification === 'CRITICAL' || earningsCashConversion.classification === 'CRITICAL') {
      overallNarrative = 'Deterioração severa na matriz de sustentabilidade de caixa. A arquitetura de liquidez não é sustentada pelas operações primárias.';
    } else if (operatingCashIntegrity.classification === 'DETERIORATING' || debtDependencyPressure.classification === 'DETERIORATING') {
      overallNarrative = 'Asfixia gradual de liquidez. A operação demanda financiamento externo para cobrir o dreno estrutural das operações.';
    }

    const fiduciaryDisclosures = [
      ...reconciliation.disclosures,
      `Matriz avaliada com aderência à DFC contábil e variabilidade máxima rastreada de ${(reconciliation.variancePercentage * 100).toFixed(1)}%.`
    ];

    return {
      isAvailable: true,
      confidence: reconciliation.confidence,
      reconciliation,
      signals: {
        operatingCashIntegrity,
        earningsCashConversion,
        liquidityConsumptionVelocity,
        workingCapitalPressure,
        debtDependencyPressure,
        syntheticProfitRisk,
      },
      overallNarrative,
      fiduciaryDisclosures
    };
  }
}
