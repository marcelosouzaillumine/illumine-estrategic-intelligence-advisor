import { RuntimeConfidence, RuntimeViolation } from '../../../runtime/types';
import { ConsolidationEntity, EliminationRecord } from './types';

export class ConsolidatedConfidenceResolver {
  static resolve(
    entities: ConsolidationEntity[],
    confidenceByEntity: Record<string, RuntimeConfidence>,
    eliminations: EliminationRecord[],
    bpMissing: string[],
    dreMissing: string[]
  ): { confidence: RuntimeConfidence; violations: RuntimeViolation[]; warnings: string[] } {
    const confidenceLevels: Record<RuntimeConfidence, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
    let minConfidence: RuntimeConfidence = 'HIGH';
    const violations: RuntimeViolation[] = [];
    const warnings: string[] = [];

    // 1. Herdar a pior confiança entre as entidades ativas
    for (const entity of entities) {
      const conf = confidenceByEntity[entity.id] || 'HIGH';
      if (confidenceLevels[conf] < confidenceLevels[minConfidence]) {
        minConfidence = conf;
      }
    }

    // 2. Degradar por falta de peças contábeis
    if (bpMissing.length > 0) {
      warnings.push(`Entidades sem BP: ${bpMissing.join(', ')}`);
      minConfidence = 'LOW';
    }

    if (dreMissing.length > 0) {
      warnings.push(`Entidades sem DRE: ${dreMissing.join(', ')}`);
      minConfidence = 'LOW';
    }

    // 3. Degradar por eliminação UNMATCHED imaterial (a material já foi gerada no EliminationEngine)
    const unmatchedImmaterial = eliminations.filter(e => e.status === 'UNMATCHED' && !e.isMaterial);
    if (unmatchedImmaterial.length > 0) {
      if (confidenceLevels[minConfidence] > confidenceLevels['MEDIUM']) {
        minConfidence = 'MEDIUM';
        warnings.push('Confidence rebaixada para MEDIUM devido a intercompany UNMATCHED imaterial.');
      }
    }

    // 4. Degradar se houver violation CRITICAL repassada pelo EliminationEngine
    const hasCritical = eliminations.some(e => e.violation && e.violation.severity === 'CRITICAL');
    if (hasCritical) {
      minConfidence = 'LOW';
    }

    return { confidence: minConfidence, violations, warnings };
  }
}
