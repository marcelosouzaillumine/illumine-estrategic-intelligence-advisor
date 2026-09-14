import { DecisionMemoryRecord } from '../../institutional-memory/models/DecisionMemoryRecord';

export class DecisionQualityAssessment {
  /**
   * Avalia a qualidade da decisão separada do resultado final.
   * Decisões boas podem ter resultados ruins por fatores externos.
   */
  static assessQuality(
    record: DecisionMemoryRecord,
    executionQuality: 'HIGH' | 'MEDIUM' | 'LOW',
    externalFactors: string[]
  ): 'HIGH' | 'MEDIUM' | 'LOW' {
    
    let baseScore = record.confidenceScore;
    
    // Se houve fatores externos massivos, a qualidade intrínseca da decisão inicial
    // pode ser protegida (mantém HIGH se as premissas eram corretas na época).
    if (externalFactors.length > 0 && record.review?.conclusion === 'INVALIDATED') {
        // Lógica de mitigação de penalidade baseada em fatores externos imprevisíveis
        return 'MEDIUM';
    }

    if (record.review?.conclusion === 'CONFIRMED') {
        return 'HIGH';
    }

    return 'LOW';
  }
}
