import { GovernanceMemoryEngine, GovernanceTrajectory } from './GovernanceMemoryEngine';
import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';
import { InstitutionalTrajectoryGuard } from './InstitutionalTrajectoryGuard';

export type ContinuityStatus = 
  | 'DETERIORAÇÃO_PROGRESSIVA'
  | 'ESTABILIZAÇÃO_OPERACIONAL'
  | 'MELHORIA_SUSTENTADA'
  | 'RISCO_RECORRENTE'
  | 'DIAGNÓSTICO_INICIAL'
  | 'INCONCLUSIVO';

export interface ContinuityInsight {
  status: ContinuityStatus;
  narrative: string;
}

export class InstitutionalContinuityResolver {
  /**
   * Generates longitudinal interpretations of the client's institutional state.
   */
  public static resolve(ledger: InstitutionalDecisionLedger, historicalCyclesCount: number): ContinuityInsight {
    if (!InstitutionalTrajectoryGuard.canEmitEvolutionaryClaims(historicalCyclesCount)) {
      return {
        status: 'DIAGNÓSTICO_INICIAL',
        narrative: 'Histórico insuficiente para determinar a continuidade evolutiva da organização.'
      };
    }

    const trajectory = GovernanceMemoryEngine.consolidate(ledger, historicalCyclesCount);
    
    // Check for recurring risks
    const events = ledger.getEvents();
    const recurringRisksCount = events.filter(e => e.eventType === 'RECURRING_RISK').length;

    if (trajectory.trend === 'DETERIORATING') {
      return {
        status: 'DETERIORAÇÃO_PROGRESSIVA',
        narrative: 'A organização apresenta deterioração progressiva contínua nos fundamentos operacionais ou na governança fiduciária ao longo dos últimos ciclos.'
      };
    }

    if (trajectory.trend === 'IMPROVING' && recurringRisksCount === 0) {
      return {
        status: 'MELHORIA_SUSTENTADA',
        narrative: 'Consolidação de evolução fiduciária estrutural mantida através de múltiplos ciclos ininterruptos.'
      };
    }

    if (recurringRisksCount >= 2) {
      return {
        status: 'RISCO_RECORRENTE',
        narrative: 'Problemas operacionais ou de capital persistem ou reincidem com frequência, limitando a estabilidade institucional.'
      };
    }

    if (trajectory.trend === 'STABLE') {
      return {
        status: 'ESTABILIZAÇÃO_OPERACIONAL',
        narrative: 'A trajetória encontra-se em platô de estabilização, sem agravamento crítico mas ainda sem evolução estrutural confirmada.'
      };
    }

    return {
      status: 'INCONCLUSIVO',
      narrative: 'Trajetória mista que impede uma classificação unificada neste momento.'
    };
  }
}
