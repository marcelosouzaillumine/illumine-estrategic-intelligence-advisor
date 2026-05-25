import { RiskSignal } from './EarlyWarningTypes';

export class GraphPatternWarningEngine {
  static detectGraphAnomalies(tenantId: string): RiskSignal[] {
    // MOCK: Operational Parasitism causing alerts multiple times
    return [
      {
        source: 'KNOWLEDGE_GRAPH',
        value: 0.75,
        metadata: {
          insight: 'Ciclo detectado: Systemic Risk (Operational Parasitism) -> Governance Violation repetido.',
          graphPatternIds: ['PATT-KG-09']
        }
      }
    ];
  }
}
