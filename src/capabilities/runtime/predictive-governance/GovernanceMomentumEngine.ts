import { PredictiveBase, InstitutionalSnapshot } from './PredictiveTypes';

export type MomentumDirection = 'ACCELERATING' | 'STABLE' | 'DECELERATING';

export interface MomentumOutput extends PredictiveBase {
  momentumScore: number;
  momentumDirection: MomentumDirection;
}

export class GovernanceMomentumEngine {
  public static calculateMomentum(snapshots: InstitutionalSnapshot[]): MomentumOutput {
    if (!snapshots || snapshots.length < 3) {
      return {
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'São necessários pelo menos 3 ciclos históricos para medir aceleração de governança.',
        momentumScore: 0,
        momentumDirection: 'STABLE'
      };
    }

    const current = snapshots[snapshots.length - 1].governanceScore;
    const mid = snapshots[snapshots.length - 2].governanceScore;
    const oldest = snapshots[snapshots.length - 3].governanceScore;

    const currentDelta = current - mid;
    const previousDelta = mid - oldest;
    
    let direction: MomentumDirection = 'STABLE';
    if (currentDelta > previousDelta + 2) direction = 'ACCELERATING';
    if (currentDelta < previousDelta - 2) direction = 'DECELERATING';

    return {
      confidenceLevel: 'HIGH',
      confidenceReason: 'Medição da derivada de segunda ordem da pontuação de Governança nos últimos 3 ciclos.',
      momentumScore: currentDelta,
      momentumDirection: direction
    };
  }
}
