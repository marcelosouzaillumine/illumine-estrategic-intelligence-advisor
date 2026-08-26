import { FiduciaryTimelineSection } from '../institutional-reporting-types';
import { CashIntelligenceRuntimeOutput } from '../../cash-intelligence/CashIntelligenceTypes';

export class FiduciaryTimelineEngine {
  /**
   * Extrai a evolução fiduciária longitudinal a partir do histórico bruto de outputs.
   */
  public static extract(historicalOutputs: CashIntelligenceRuntimeOutput[]): FiduciaryTimelineSection {
    if (!historicalOutputs || historicalOutputs.length === 0) {
      return {
        runwayEvolution: [],
        burnEvolution: [],
        fcoEvolution: [],
        fcfEvolution: [],
        liquidityQualityEvolution: [],
        dependencyRecurrence: 0,
        artificialLiquidityFrequency: 0,
        ebitdaToCashConsistency: false,
        trajectoryMarkers: [],
        periodsCovered: 0,
        timelineIntegrityStatus: 'INSUFFICIENT_HISTORY',
        fiduciaryWarnings: []
      };
    }

    const n = historicalOutputs.length;
    let artificialCount = 0;
    const dependencyClasses = ['DEPENDENCIA_DE_CAPITALIZACAO', 'LIQUIDEZ_ARTIFICIAL', 'LEVERAGED_SURVIVAL', 'DISTRESS_FINANCING'];

    historicalOutputs.forEach(o => {
      if (dependencyClasses.includes(o.liquidityClassification.classification as string)) {
        artificialCount++;
      }
    });

    const hasBlocked = historicalOutputs.some(
      o => !o.isAvailable || o.reconciliationAlerts.reconciliationStatus === 'BLOCKED' || o.reconciliationAlerts.reconciliationStatus === 'CASH_RECONCILIATION_FAIL_CLOSED'
    );

    const syntheticProfits = historicalOutputs.filter(o => o.universalIndicators.conversaoEbitdaCaixa.alert === 'SYNTHETIC_PROFIT_ALERT').length;

    let ebitdaConsistency = true;
    if (syntheticProfits > 0 && syntheticProfits < n / 2) {
      ebitdaConsistency = false;
    } else if (syntheticProfits >= n / 2) {
      ebitdaConsistency = false;
    }

    return {
      runwayEvolution: historicalOutputs.map(o => o.continuityRisk.projectedRunwayMonths),
      burnEvolution: historicalOutputs.map(o => o.universalIndicators.burnRateOperacional.value),
      // Inferindo fco e fcf, idealmente deveriam estar no payload (mockados como 0 se n houver)
      fcoEvolution: historicalOutputs.map(o => 0), 
      fcfEvolution: historicalOutputs.map(o => 0),
      liquidityQualityEvolution: historicalOutputs.map(o => o.liquidityClassification.classification),
      dependencyRecurrence: (artificialCount / n) >= 0.5 ? 1 : 0,
      artificialLiquidityFrequency: (artificialCount / n),
      ebitdaToCashConsistency: ebitdaConsistency,
      trajectoryMarkers: [
        hasBlocked ? 'INTERRUPÇÃO_RECONCILIACAO' : 'RECONCILIACAO_INTEGRA',
        (artificialCount / n) >= 0.5 ? 'ALTA_ALAVANCAGEM' : 'ESTABILIDADE_OPERACIONAL'
      ],
      periodsCovered: n,
      timelineIntegrityStatus: hasBlocked ? 'BROKEN' : 'VALID',
      fiduciaryWarnings: []
    };
  }
}
