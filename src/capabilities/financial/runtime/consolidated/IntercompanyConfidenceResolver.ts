import { EliminationMatchConfidence } from './consolidated-types';

export class IntercompanyConfidenceResolver {
  /**
   * Avalia a confiança de uma eliminação com base nos valores apresentados por duas entidades.
   * Tolerâncias:
   * EXACT_MATCH: diferença == 0
   * PROBABLE_MATCH: diferença <= 1%
   * LOW_CONFIDENCE_MATCH: diferença <= 10%
   * UNRECONCILED: diferença > 10% ou ausência de uma perna
   */
  public resolveMatchConfidence(
    sourceAmount: number,
    targetAmount: number
  ): { confidence: EliminationMatchConfidence; discrepancy: number } {
    if (sourceAmount === 0 && targetAmount === 0) {
      return { confidence: 'EXACT_MATCH', discrepancy: 0 };
    }

    if (sourceAmount === 0 || targetAmount === 0) {
      return { confidence: 'UNRECONCILED', discrepancy: Math.max(sourceAmount, targetAmount) };
    }

    const discrepancy = Math.abs(sourceAmount - targetAmount);
    const maxAmount = Math.max(sourceAmount, targetAmount);
    const diffPercentage = discrepancy / maxAmount;

    if (discrepancy === 0) {
      return { confidence: 'EXACT_MATCH', discrepancy };
    } else if (diffPercentage <= 0.01) {
      return { confidence: 'PROBABLE_MATCH', discrepancy };
    } else if (diffPercentage <= 0.10) {
      return { confidence: 'LOW_CONFIDENCE_MATCH', discrepancy };
    } else {
      return { confidence: 'UNRECONCILED', discrepancy };
    }
  }

  /**
   * Agrega a confiança de todas as eliminações processadas no grupo.
   */
  public resolveOverallEliminationConfidence(matches: EliminationMatchConfidence[]): EliminationMatchConfidence {
    if (matches.length === 0) return 'EXACT_MATCH';

    if (matches.includes('UNRECONCILED')) return 'UNRECONCILED';
    if (matches.includes('LOW_CONFIDENCE_MATCH')) return 'LOW_CONFIDENCE_MATCH';
    if (matches.includes('PROBABLE_MATCH')) return 'PROBABLE_MATCH';

    return 'EXACT_MATCH';
  }
}
