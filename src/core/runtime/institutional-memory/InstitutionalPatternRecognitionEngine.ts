import { InstitutionalMemoryRecord, PatternSignal, InstitutionalPatternType, InstitutionalRecurrenceLevel } from './types';

export class InstitutionalPatternRecognitionEngine {
  /**
   * Evaluates historical records to detect recurrences and patterns.
   * Does NOT generate predictive conclusions, only surfaces historical frequency.
   */
  public static detectPatterns(records: InstitutionalMemoryRecord[]): PatternSignal[] {
    if (records.length === 0) return [];

    // Group by category to find repeated alerts
    const groups: Record<string, InstitutionalMemoryRecord[]> = {};
    records.forEach(record => {
      const cat = record.governanceCategory || 'General';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(record);
    });

    const patterns: PatternSignal[] = [];

    Object.entries(groups).forEach(([category, catRecords]) => {
      const count = catRecords.length;
      let recurrence: InstitutionalRecurrenceLevel = 'ISOLATED';

      if (count >= 6) {
        recurrence = 'SYSTEMIC';
      } else if (count >= 4) {
        recurrence = 'CHRONIC';
      } else if (count === 3) {
        recurrence = 'RECURRING';
      } else if (count === 2) {
        recurrence = 'OCCASIONAL';
      }

      // Map categories to pattern types deterministically
      let patternType: InstitutionalPatternType = 'RECURRING_ALERT';
      const cleanCat = category.toLowerCase();
      if (cleanCat.includes('liquidez') || cleanCat.includes('liquidity')) {
        patternType = 'LIQUIDITY_DETERIORATION';
      } else if (cleanCat.includes('caixa') || cleanCat.includes('cash')) {
        patternType = 'CASH_FLOW_STRESS';
      } else if (cleanCat.includes('fiduciária') || cleanCat.includes('fiduciary')) {
        patternType = 'FIDUCIARY_ESCALATION';
      } else if (cleanCat.includes('margem') || cleanCat.includes('margin')) {
        patternType = 'MARGIN_PRESSURE';
      } else if (cleanCat.includes('conformidade') || cleanCat.includes('compliance')) {
        patternType = 'GOVERNANCE_BREACH';
      } else if (cleanCat.includes('contágio') || cleanCat.includes('contagion')) {
        patternType = 'OPERATIONAL_CONTAGION';
      } else if (cleanCat.includes('drift')) {
        patternType = 'STRATEGIC_DRIFT';
      }

      // Sort records by date to find bounds
      const sorted = [...catRecords].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      patterns.push({
        patternType,
        recurrence,
        frequencyCount: count,
        firstDetected: sorted[0].timestamp,
        lastDetected: sorted[sorted.length - 1].timestamp,
        evidenceRecordIds: sorted.map(r => r.memoryId)
      });
    });

    return patterns;
  }
}
