export class RecommendationEvolutionValidator {
  /**
   * Ensures coherence of recommendations over time.
   */
  public static validate(
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE',
    prevRecommendation: string,
    currRecommendation: string,
    improvedMetrics: string[]
  ): { severity: 'OK' | 'WARNING' | 'BLOCKING'; findings: string[] } {
    let severity: 'OK' | 'WARNING' | 'BLOCKING' = 'OK';
    const findings: string[] = [];

    if (historicalAvailability !== 'AVAILABLE') return { severity, findings };

    // E.g., if recommendation was "Restore liquidity" but liquidity improved
    const isStaleLiquidity = prevRecommendation.toLowerCase().includes('recompor liquidez') 
      && currRecommendation.toLowerCase().includes('recompor liquidez')
      && (improvedMetrics.includes('Liquidez Corrente') || improvedMetrics.includes('Liquidez Imediata'));

    if (isStaleLiquidity) {
      severity = 'WARNING';
      findings.push('[STALE_RECOMMENDATION_DETECTED] Recommendation to "restore liquidity" remains unchanged despite material improvement in liquidity metrics.');
    }

    return { severity, findings };
  }
}
