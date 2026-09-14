import { InstitutionalLesson } from '../models/InstitutionalLesson';
import { LearningPattern, PatternMaturity } from '../models/LearningPattern';

export class DecisionPatternRecognitionEngine {
  evaluateCausalEvidence(lessons: InstitutionalLesson[]): 'WEAK' | 'MODERATE' | 'STRONG' | 'PROVEN_CAUSALITY' {
    const validatedCount = lessons.filter(l => l.confidence.level === 'validated' || l.confidence.level === 'established').length;
    if (validatedCount >= 10) return 'PROVEN_CAUSALITY';
    if (validatedCount >= 5) return 'STRONG';
    if (validatedCount >= 2) return 'MODERATE';
    return 'WEAK';
  }

  inferPattern(lessons: InstitutionalLesson[], description: string): LearningPattern {
    const strength = this.evaluateCausalEvidence(lessons);
    
    let maturity: PatternMaturity = 'CANDIDATE_PATTERN';
    if (strength === 'MODERATE') maturity = 'OBSERVED_PATTERN';
    if (strength === 'STRONG') maturity = 'VALIDATED_PATTERN';
    if (strength === 'PROVEN_CAUSALITY') maturity = 'INSTITUTIONAL_PRINCIPLE';

    return {
      patternId: `PAT-${Date.now()}`,
      description,
      maturity,
      supportingLessons: lessons,
      causalEvidenceAssessment: {
        correlationStrength: strength,
        evidenceBase: `Based on ${lessons.length} lessons`,
        validationCriteria: []
      }
    };
  }
}
