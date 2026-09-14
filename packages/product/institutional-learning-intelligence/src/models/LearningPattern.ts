import { InstitutionalLesson } from './InstitutionalLesson';

export type PatternMaturity = 
  | 'CANDIDATE_PATTERN' 
  | 'OBSERVED_PATTERN' 
  | 'VALIDATED_PATTERN' 
  | 'INSTITUTIONAL_PRINCIPLE';

export interface LearningPattern {
  readonly patternId: string;
  readonly description: string;
  readonly maturity: PatternMaturity;
  readonly supportingLessons: readonly InstitutionalLesson[];
  readonly causalEvidenceAssessment: {
    readonly correlationStrength: 'WEAK' | 'MODERATE' | 'STRONG' | 'PROVEN_CAUSALITY';
    readonly evidenceBase: string;
    readonly validationCriteria: readonly string[];
  };
}
