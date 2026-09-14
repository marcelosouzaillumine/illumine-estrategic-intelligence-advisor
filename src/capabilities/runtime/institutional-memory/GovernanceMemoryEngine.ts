import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';

export type FiduciaryEvolutionTrend = 'IMPROVING' | 'STABLE' | 'DETERIORATING' | 'INSUFFICIENT_HISTORY';

export interface GovernanceTrajectory {
  trend: FiduciaryEvolutionTrend;
  confidence: 'LOW' | 'MODERATE' | 'HIGH';
  evidence: string[];
}

export class GovernanceMemoryEngine {
  /**
   * Consolidates institutional trajectory by analyzing the severity progression of events.
   */
  public static consolidate(ledger: InstitutionalDecisionLedger, historicalCyclesCount: number): GovernanceTrajectory {
    if (historicalCyclesCount < 2) {
      return {
        trend: 'INSUFFICIENT_HISTORY',
        confidence: 'LOW',
        evidence: ['Não há ciclos históricos suficientes para determinar uma trajetória evolutiva fiduciária.']
      };
    }

    const events = ledger.getEvents();
    if (events.length === 0) {
      return {
        trend: 'STABLE',
        confidence: 'LOW',
        evidence: ['Nenhum evento registrado no ledger para análise longitudinal.']
      };
    }

    // Basic heuristic: count deterioration vs improvement events
    let deteriorationCount = 0;
    let improvementCount = 0;

    for (const e of events) {
      if (e.eventType.includes('DETERIORATION') || e.severity === 'CRITICAL' || e.severity === 'HIGH') {
        deteriorationCount++;
      }
      if (e.eventType.includes('IMPROVEMENT') || e.eventType.includes('RESOLUTION')) {
        improvementCount++;
      }
    }

    const evidence: string[] = [];
    let trend: FiduciaryEvolutionTrend = 'STABLE';

    if (deteriorationCount > improvementCount && deteriorationCount >= 2) {
      trend = 'DETERIORATING';
      evidence.push(`Identificada deterioração estrutural persistente com ${deteriorationCount} eventos de risco acumulados.`);
    } else if (improvementCount > deteriorationCount && improvementCount >= 2) {
      trend = 'IMPROVING';
      evidence.push(`Identificada melhoria fiduciária sustentada com ${improvementCount} marcos de resolução no histórico.`);
    } else {
      evidence.push(`Trajetória estável ou em transição, sem vetor dominante absoluto.`);
    }

    return {
      trend,
      confidence: historicalCyclesCount >= 4 ? 'HIGH' : 'MODERATE',
      evidence
    };
  }
}
