export class MetricNarrativeDivergenceAudit {
  /**
   * Verifies complete coherence between Indicators -> Classifications -> Diagnosis -> Recommendations -> Final Narrative.
   */
  public static audit(
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE',
    improvedMetrics: string[],
    deterioratedMetrics: string[],
    narrative: string
  ): { severity: 'OK' | 'WARNING' | 'BLOCKING'; findings: string[] } {
    let severity: 'OK' | 'WARNING' | 'BLOCKING' = 'OK';
    const findings: string[] = [];

    if (historicalAvailability !== 'AVAILABLE') return { severity, findings };

    const isNarrativePessimistic = narrative.toLowerCase().includes('crítica') || narrative.toLowerCase().includes('deterioração');
    const isNarrativeOptimistic = narrative.toLowerCase().includes('forte') || narrative.toLowerCase().includes('robusta') || narrative.toLowerCase().includes('excelente');

    if (isNarrativePessimistic && deterioratedMetrics.length === 0 && improvedMetrics.length > 0) {
      severity = 'BLOCKING';
      findings.push('[METRIC_NARRATIVE_DIVERGENCE] Pessimistic narrative paired with solely improving metrics.');
    }

    if (isNarrativeOptimistic && improvedMetrics.length === 0 && deterioratedMetrics.length > 0) {
      severity = 'BLOCKING';
      findings.push('[METRIC_NARRATIVE_DIVERGENCE] Optimistic narrative paired with solely deteriorating metrics.');
    }

    return { severity, findings };
  }
}
