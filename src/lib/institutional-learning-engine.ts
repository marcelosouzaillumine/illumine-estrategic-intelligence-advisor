import { InstitutionalOutcomeRecord, InstitutionalLearningPattern } from './institutional-outcomes-types';

export function discoverLearningPatterns(records: InstitutionalOutcomeRecord[]): InstitutionalLearningPattern[] {
  const patterns: InstitutionalLearningPattern[] = [];
  
  // Example pattern: Bottleneck (Insights that never become Decisions)
  const insights = records.filter(r => r.level === 'E1' || r.level === 'E2');
  const decisions = records.filter(r => r.level === 'E3');

  // If there are many insights but few decisions, flag an Execution Failure
  if (insights.length > 0 && (decisions.length / insights.length) < 0.3) {
    patterns.push({
      patternId: `pat-fail-${Date.now()}`,
      type: 'EXECUTION_FAILURE',
      frequency: insights.length - decisions.length,
      description: 'High volume of intelligence generated with low decision conversion.',
      evidenceLinks: insights.map(i => i.id)
    });
  }

  // Example pattern: Transformation Driver (Actions that lead directly to Measured Results)
  const actions = records.filter(r => r.level === 'E4');
  const measured = records.filter(r => r.level === 'E6');

  if (actions.length > 0 && measured.length > 0 && (measured.length / actions.length) > 0.5) {
    patterns.push({
      patternId: `pat-driver-${Date.now()}`,
      type: 'TRANSFORMATION_DRIVER',
      frequency: measured.length,
      description: 'High conversion from executed actions to measurably positive results.',
      evidenceLinks: measured.map(m => m.id)
    });
  }

  return patterns;
}
