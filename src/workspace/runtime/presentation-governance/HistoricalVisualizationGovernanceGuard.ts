

/**
 * Historical Visualization Governance Guard
 * 
 * Enforces canonical rules for all historical charts, ensuring:
 * 1. Semantic color compliance (no purples/violets, only institutional palette).
 * 2. Visual layout compliance (no legends inside charts, proper contrast).
 * 3. Narrative compliance (insight summary must be present, must not contradict fiduciary status).
 */

export interface HistoricalVisualizationAuditInput {
  hasInsightNarrative: boolean;
  legendPosition: 'top' | 'inside' | 'bottom' | 'none';
  usedColors: string[];
  fiduciaryStatus: string;
  narrativeText: string;
}

export interface HistoricalVisualizationAuditResult {
  isValid: boolean;
  violations: string[];
}

export class HistoricalVisualizationGovernanceGuard {
  private static FORBIDDEN_COLORS = ['purple', 'violet', 'magenta', '#800080', '#EE82EE', '#FF00FF'];
  
  // Minimal alarmist terms that should NOT appear in HEALTHY/RESILIENT narratives
  private static ALARMIST_TERMS = ['colapso', 'falência', 'insustentável', 'crítico', 'emergência'];

  public static validate(input: HistoricalVisualizationAuditInput): HistoricalVisualizationAuditResult {
    const violations: string[] = [];

    // 1. Narrative Compliance
    if (!input.hasInsightNarrative || !input.narrativeText.trim()) {
      violations.push('Phase 4 Violation: Historical visualization must include an executive insight narrative.');
    }

    // 2. Legend Position Compliance
    if (input.legendPosition === 'inside') {
      violations.push('Phase 1 Violation: Legend must not be placed inside the chart area. Use top header or dedicated component.');
    }

    // 3. Color Compliance
    const invalidColors = input.usedColors.filter(color => 
      this.FORBIDDEN_COLORS.some(forbidden => color.toLowerCase().includes(forbidden))
    );
    if (invalidColors.length > 0) {
      violations.push(`Phase 2/10 Violation: Forbidden colors detected (${invalidColors.join(', ')}). Use ExecutiveChartSemanticPalette.`);
    }

    // 4. Semantic Sync Compliance (Phase 8)
    if (input.fiduciaryStatus === 'HEALTHY' || input.fiduciaryStatus === 'RESILIENT') {
      const alarmistMatch = this.ALARMIST_TERMS.find(term => input.narrativeText.toLowerCase().includes(term));
      if (alarmistMatch) {
        violations.push(`Phase 8 Violation: Narrative contains alarmist term "${alarmistMatch}" but fiduciary status is ${input.fiduciaryStatus}.`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
