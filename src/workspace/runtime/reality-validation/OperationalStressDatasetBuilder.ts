import { GoldenDatasetProfile } from './RealityValidationTypes';
import { RealityValidationAuditLogger } from './RealityValidationAuditLogger';

export class OperationalStressDatasetBuilder {
  static buildStressProfile(tenantId: string, dataset: GoldenDatasetProfile): {
    stressLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    criticalEntities: string[];
    primaryStressor: string;
  } {
    const criticalEntities = dataset.entities
      .filter(e => e.liquidityPressure === 'CRITICAL' || e.liquidityPressure === 'HIGH')
      .map(e => e.name);

    const stressLevel = dataset.complexityScore > 0.9 ? 'CRITICAL'
      : dataset.complexityScore > 0.8 ? 'HIGH'
      : dataset.complexityScore > 0.6 ? 'MEDIUM' : 'LOW';

    RealityValidationAuditLogger.logEvent(tenantId, 'STRESS_TRIGGERED',
      'Nível de stress: ' + stressLevel + ' para dataset ' + dataset.name);

    return {
      stressLevel,
      criticalEntities,
      primaryStressor: dataset.stressFactors[0] ?? 'Nenhum fator crítico identificado'
    };
  }
}
