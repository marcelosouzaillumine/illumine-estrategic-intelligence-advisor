import { InstitutionalTimelineEvent } from './IOSTypes';

export class UnifiedGovernanceTimeline {
  static buildTimeline(tenantId: string): InstitutionalTimelineEvent[] {
    const events = [
      {
        eventId: 'EVT-1',
        tenantId,
        domain: 'EARLY_WARNING',
        eventType: 'ALERT',
        title: 'Queda de Liquidez Detectada',
        description: 'Alerta cruzado com dados de Benchmark apontando stress atípico.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        severity: 'WARNING'
      },
      {
        eventId: 'EVT-2',
        tenantId,
        domain: 'STRATEGIC_SIMULATION',
        eventType: 'SIMULATION',
        title: 'Projeção de Ruptura',
        description: 'Simulação indica ruptura de fluxo de caixa em T+6 meses se nada for feito.',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        severity: 'CRITICAL'
      },
      {
        eventId: 'EVT-3',
        tenantId,
        domain: 'GOVERNANCE_ORCHESTRATION',
        eventType: 'PLAYBOOK_ACTIVATION',
        title: 'Liquidity Crisis Playbook Recomendado',
        description: 'Orquestração acionou plano de contenção. Aguardando Board.',
        timestamp: new Date().toISOString(),
        severity: 'INFO'
      }
    ] as InstitutionalTimelineEvent[];
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
