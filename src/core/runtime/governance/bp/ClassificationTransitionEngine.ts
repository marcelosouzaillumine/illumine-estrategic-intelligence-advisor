export class ClassificationTransitionEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Audits classification changes.
   * Blocks extreme changes without quantitative justification.
   */
  public static auditTransition(
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE',
    prevClassification: string,
    currClassification: string,
    improvedMetrics: string[]
  ): { severity: 'OK' | 'WARNING' | 'BLOCKING'; findings: string[] } {
    let severity: 'OK' | 'WARNING' | 'BLOCKING' = 'OK';
    const findings: string[] = [];

    if (historicalAvailability !== 'AVAILABLE' || prevClassification === currClassification) {
      return { severity, findings };
    }

    const isExtremeImprovement = prevClassification.includes('Restrita') && currClassification.includes('Excelente');
    const isExtremeDeterioration = prevClassification.includes('Excelente') && currClassification.includes('Restrita');

    if (isExtremeImprovement && improvedMetrics.length === 0) {
      severity = 'BLOCKING';
      findings.push('[UNEXPLAINED_CLASSIFICATION_TRANSITION] Transition from "Restrita" to "Excelente" without material improvement in metrics.');
    }

    if (isExtremeDeterioration && improvedMetrics.length > 0) {
      severity = 'WARNING';
      findings.push('[UNEXPLAINED_CLASSIFICATION_TRANSITION] Extreme deterioration detected despite material improvements in some metrics. Please verify.');
    }

    return { severity, findings };
  }
}
