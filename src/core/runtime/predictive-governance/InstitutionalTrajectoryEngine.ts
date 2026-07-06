import { PredictiveBase, TrajectoryDirection, InstitutionalSnapshot } from './PredictiveTypes';

export interface TrajectoryOutput extends PredictiveBase {
  trajectoryScore: number;
  trajectoryDirection: TrajectoryDirection;
  causalExplanation: string;
}

export class InstitutionalTrajectoryEngine {
  public evaluate(...args: unknown[]): unknown { return null; }
  public static calculateTrajectory(snapshots: InstitutionalSnapshot[]): TrajectoryOutput {
    if (!snapshots || snapshots.length < 2) {
      return {
        trajectoryScore: 0,
        trajectoryDirection: 'STABLE',
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'São necessários pelo menos 2 ciclos históricos para projetar uma trajetória confiável.',
        causalExplanation: 'Histórico insuficiente para projeção.'
      };
    }

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    
    // Simplification for the architecture proof: aggregating average improvements
    const diffGov = last.governanceScore - first.governanceScore;
    const diffBp = last.bpHealth - first.bpHealth;
    const diffDfc = last.dfcHealth - first.dfcHealth;
    
    const overallDiff = diffGov + diffBp + diffDfc;

    let direction: TrajectoryDirection = 'STABLE';
    if (overallDiff > 10) direction = 'IMPROVING';
    if (overallDiff < -10) direction = 'DETERIORATING';

    const score = Math.max(0, Math.min(100, 50 + overallDiff));
    
    let confidenceReason = 'Projeção baseada em histórico recente de métricas essenciais de liquidez, governança e patrimônio.';
    let confidenceLevel: PredictiveBase['confidenceLevel'] = 'LOW';
    if (snapshots.length >= 4) {
      confidenceLevel = 'HIGH';
      confidenceReason = 'Projeção suportada por 4 ou mais ciclos consolidados de dados institucionais consistentes.';
    } else if (snapshots.length >= 3) {
      confidenceLevel = 'MODERATE';
      confidenceReason = 'Projeção suportada por 3 ciclos de dados institucionais.';
    }

    return {
      trajectoryScore: score,
      trajectoryDirection: direction,
      confidenceLevel,
      confidenceReason,
      causalExplanation: direction === 'IMPROVING' 
        ? 'A organização apresenta evolução agregada nos indicadores primários nos ciclos recentes.'
        : direction === 'DETERIORATING'
          ? 'A organização apresenta degradação estrutural agregada nos indicadores primários, indicando trajetória provável de risco sistêmico.'
          : 'A organização mantém métricas estáveis sem inclinação direcional severa.'
    };
  }
}
