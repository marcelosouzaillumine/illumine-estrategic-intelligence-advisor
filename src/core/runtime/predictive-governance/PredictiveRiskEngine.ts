import { PredictiveBase, InstitutionalSnapshot } from './PredictiveTypes';

export enum EmergingRiskCategory {
  LIQUIDITY_RISK = 'LIQUIDITY_RISK',
  GOVERNANCE_RISK = 'GOVERNANCE_RISK',
  EXECUTION_RISK = 'EXECUTION_RISK',
  CAPITAL_RISK = 'CAPITAL_RISK',
  SUSTAINABILITY_RISK = 'SUSTAINABILITY_RISK',
  INSTITUTIONAL_RISK = 'INSTITUTIONAL_RISK'
}

export interface EmergingRisk {
  category: EmergingRiskCategory;
  severityLabel: 'HIGH' | 'CRITICAL' | 'ELEVATED';
  causalExplanation: string;
}

export interface PredictiveRiskOutput extends PredictiveBase {
  emergingRisks: EmergingRisk[];
}

export class PredictiveRiskEngine {
  public static evaluateRisks(snapshots: InstitutionalSnapshot[]): PredictiveRiskOutput {
    if (!snapshots || snapshots.length < 3) {
      return {
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'São necessários pelo menos 3 ciclos consecutivos para identificar tendências de risco ocultas.',
        emergingRisks: []
      };
    }

    const risks: EmergingRisk[] = [];
    
    // Check consecutive deterioration
    let dfcDegradation = 0;
    let govDegradation = 0;

    for (let i = 1; i < snapshots.length; i++) {
      if (snapshots[i].dfcHealth < snapshots[i-1].dfcHealth) dfcDegradation++;
      else dfcDegradation = 0;

      if (snapshots[i].governanceScore < snapshots[i-1].governanceScore) govDegradation++;
      else govDegradation = 0;
    }

    if (dfcDegradation >= 2) {
      risks.push({
        category: EmergingRiskCategory.LIQUIDITY_RISK,
        severityLabel: 'HIGH',
        causalExplanation: 'Sinal preditivo: métricas de caixa em deterioração por 3 ciclos consecutivos.'
      });
    }

    if (govDegradation >= 2) {
      risks.push({
        category: EmergingRiskCategory.GOVERNANCE_RISK,
        severityLabel: 'ELEVATED',
        causalExplanation: 'Sinal preditivo: maturidade fiduciária e governança em queda persistente.'
      });
    }

    return {
      confidenceLevel: snapshots.length >= 4 ? 'HIGH' : 'MODERATE',
      confidenceReason: 'Riscos baseados na correlação de desgaste serial em múltiplos vetores ao longo dos últimos ciclos.',
      emergingRisks: risks
    };
  }
}
