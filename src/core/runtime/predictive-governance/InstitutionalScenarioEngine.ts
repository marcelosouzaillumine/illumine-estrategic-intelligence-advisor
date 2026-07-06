import { PredictiveBase, InstitutionalSnapshot } from './PredictiveTypes';
import { TrajectoryOutput } from './InstitutionalTrajectoryEngine';

export interface ProjectedScenario {
  type: 'CONSERVADOR' | 'BASE' | 'ACELERADO';
  projectedGovernanceScore: number;
  projectedCescfScore: number;
  narrative: string;
}

export interface ScenarioOutput extends PredictiveBase {
  scenarios: ProjectedScenario[];
}

export class InstitutionalScenarioEngine {
  public evaluate(...args: unknown[]): unknown { return null; }
  public static projectScenarios(snapshots: InstitutionalSnapshot[], trajectory: TrajectoryOutput): ScenarioOutput {
    if (!snapshots || snapshots.length < 2) {
      return {
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'Histórico insuficiente para criar cenários projetados fiduciariamente válidos.',
        scenarios: []
      };
    }

    const current = snapshots[snapshots.length - 1];
    
    // Simplistic projection logic based on current trajectory
    const baseDelta = trajectory.trajectoryDirection === 'IMPROVING' ? 5 : trajectory.trajectoryDirection === 'DETERIORATING' ? -5 : 0;
    
    return {
      confidenceLevel: snapshots.length >= 4 ? 'HIGH' : 'MODERATE',
      confidenceReason: 'Cenários projetados calculando variação derivada da estabilidade institucional.',
      scenarios: [
        {
          type: 'CONSERVADOR',
          projectedGovernanceScore: Math.max(0, current.governanceScore + (baseDelta - 3)),
          projectedCescfScore: Math.max(0, current.cescfScore + (baseDelta - 2)),
          narrative: 'Se a organização enfrentar pressões macroeconômicas ou interrupção nas melhorias operacionais, os indicadores tenderão a regredir.'
        },
        {
          type: 'BASE',
          projectedGovernanceScore: Math.max(0, current.governanceScore + baseDelta),
          projectedCescfScore: Math.max(0, current.cescfScore + baseDelta),
          narrative: 'Se mantiver a trajetória atual com o mesmo ritmo de execução, a organização chegará neste cenário base.'
        },
        {
          type: 'ACELERADO',
          projectedGovernanceScore: Math.min(100, current.governanceScore + (baseDelta + 5)),
          projectedCescfScore: Math.min(100, current.cescfScore + (baseDelta + 5)),
          narrative: 'Se a organização corrigir os fatores críticos e acelerar investimentos estruturais, atingirá um estágio de maior maturidade sistêmica.'
        }
      ]
    };
  }
}
