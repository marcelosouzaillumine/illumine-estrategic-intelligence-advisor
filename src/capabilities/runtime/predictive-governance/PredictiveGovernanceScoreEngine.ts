import { PredictiveBase, InstitutionalSnapshot } from './PredictiveTypes';
import { InstitutionalTrajectoryEngine } from './InstitutionalTrajectoryEngine';

export type GovernanceScoreClassification = 
  | 'FORTE_TENDENCIA_POSITIVA'
  | 'EVOLUCAO_SUSTENTAVEL'
  | 'ATENCAO_PREVENTIVA'
  | 'RISCO_CRESCENTE'
  | 'INTERVENCAO_NECESSARIA';

export interface ScoreOutput extends PredictiveBase {
  predictiveScore: number; // 0-100
  classification: GovernanceScoreClassification;
}

export class PredictiveGovernanceScoreEngine {
  public static computeScore(snapshots: InstitutionalSnapshot[]): ScoreOutput {
    if (!snapshots || snapshots.length < 2) {
      return {
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'Dados insuficientes para compor o score preditivo institucional.',
        predictiveScore: 0,
        classification: 'ATENCAO_PREVENTIVA'
      };
    }

    const trajectory = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);
    const score = trajectory.trajectoryScore; // Derived from trajectory base logic for this MVP
    
    let classification: GovernanceScoreClassification = 'ATENCAO_PREVENTIVA';
    if (score >= 90) classification = 'FORTE_TENDENCIA_POSITIVA';
    else if (score >= 75) classification = 'EVOLUCAO_SUSTENTAVEL';
    else if (score >= 50) classification = 'ATENCAO_PREVENTIVA';
    else if (score >= 25) classification = 'RISCO_CRESCENTE';
    else classification = 'INTERVENCAO_NECESSARIA';

    return {
      confidenceLevel: trajectory.confidenceLevel,
      confidenceReason: 'Score quantificado com base no alinhamento vetorial macro dos indicadores institucionais preditivos.',
      predictiveScore: score,
      classification
    };
  }
}
