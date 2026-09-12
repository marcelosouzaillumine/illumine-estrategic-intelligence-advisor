import { StrategicRiskProjection, InstitutionalConsequence } from './StrategicSimulationTypes';

export class StrategicStressCascade {
  static triggerCascade(consequences: InstitutionalConsequence[]): StrategicRiskProjection[] {
    // Se há consequências graves, gera um risco de cascata
    const hasHighSeverity = consequences.some(c => c.severity === 'HIGH' || c.severity === 'CRITICAL');
    
    if (hasHighSeverity) {
      return [
        {
          riskId: 'RISK-CASC-' + Date.now(),
          description: 'O Efeito Dominó na cadeia de suprimentos pode acionar cláusulas de quebra de contrato (Covenants) em até 6 meses.',
          probability: 0.65,
          impact: 0.9
        }
      ];
    }
    return [];
  }
}
