import { InstitutionalEvidenceInput, InstitutionalOutcomesDatabase, InstitutionalOutcomeRecord, InstitutionalTransformationIndex } from './institutional-outcomes-types';
import { calculateConversionMetrics } from './institutional-conversion-engine';
import { discoverLearningPatterns } from './institutional-learning-engine';
import { runEvidenceAudit } from './institutional-evidence-audit-engine';

export function buildInstitutionalOutcomesDatabase(
  input: InstitutionalEvidenceInput
): InstitutionalOutcomesDatabase {

  const records = input.existingRecords || [];
  
  // 1. Calculate Conversions
  const conversionMetrics = calculateConversionMetrics(records);

  // 2. Extract Learning Patterns
  const learningPatterns = discoverLearningPatterns(records);

  // 3. Transformation Index (based exclusively on accumulated E3-E6)
  const e3_e6 = records.filter(r => ['E3','E4','E5','E6'].includes(r.level));
  
  // A simple deterministic accumulation of actions taken
  const transformationIndex: InstitutionalTransformationIndex = {
    governanceScore: e3_e6.filter(r => r.category === 'GOVERNANCE').length * 10,
    capitalAllocationScore: e3_e6.filter(r => r.category === 'CAPITAL_ALLOCATION').length * 10,
    executionScore: e3_e6.filter(r => r.category === 'EXECUTION').length * 10,
    strategyScore: e3_e6.filter(r => r.category === 'STRATEGY').length * 10,
    financialHealthScore: e3_e6.filter(r => r.category === 'FINANCIAL_HEALTH').length * 10,
    institutionalMaturityScore: e3_e6.filter(r => r.category === 'INSTITUTIONAL_MATURITY').length * 10,
  };

  // 4. Evidence Audit Engine
  const evidenceAudit = runEvidenceAudit(records, conversionMetrics);

  return {
    records,
    conversionMetrics,
    learningPatterns,
    transformationIndex,
    evidenceAudit
  };
}
