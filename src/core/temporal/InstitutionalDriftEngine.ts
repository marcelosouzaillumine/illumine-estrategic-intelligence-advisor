import { TimelineRepository } from './TimelineRepository';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';

export interface DriftReport {
  newRisksDetected: number;
  causalChanges: number;
  structuralPivots: number;
  constitutionalBreaches: number;
  analyzedLineages: number;
}

/**
 * Institutional Drift Engine
 * 
 * Camada observacional que analisa a deriva temporal.
 * NÃO GERA novas recomendações. NÃO EXECUTA motores fiduciários.
 * Apenas agrupa e contabiliza o que já ocorreu com base nas linhagens (Lineages).
 */
export class InstitutionalDriftEngine {
  constructor(private readonly repository: TimelineRepository) {}

  async detectDrift(tenantId: string, timelineId: string): Promise<DriftReport> {
    const timeline = await this.repository.getTimeline(tenantId, timelineId);
    if (!timeline) {
      return { newRisksDetected: 0, causalChanges: 0, structuralPivots: 0, constitutionalBreaches: 0, analyzedLineages: 0 };
    }

    const events = await this.repository.getEvents(tenantId, timelineId);
    
    // Contabiliza apenas os eventos reais extraídos do repositório
    const riskEvents = events.filter(e => e.eventType === 'RISK_EMERGED');
    const causalEvents = events.filter(e => e.eventType === 'RELATIONSHIP_CREATED' || e.eventType === 'RELATIONSHIP_DELETED');

    // Analisando base nas evoluções já catalogadas (Lineages persistidas via repositório/timeline)
    const lineages = timeline.lineages || [];
    
    const pivots = lineages.filter(l => l.transitionType === 'STRUCTURAL_PIVOT');
    const breaches = lineages.filter(l => l.transitionType === 'CONSTITUTIONAL_BREACH');

    return {
      newRisksDetected: riskEvents.length,
      causalChanges: causalEvents.length,
      structuralPivots: pivots.length,
      constitutionalBreaches: breaches.length,
      analyzedLineages: lineages.length
    };
  }
}
