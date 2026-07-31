import { Recommendation } from '@illumine/architecture-governance-recommendation';
import { InstitutionalLesson, LearningPattern } from '@illumine/institutional-learning-intelligence';
import { ExecutiveDecisionContext } from '@illumine/executive-decision-intelligence';

export class SnapshotResolver {
  resolveRecommendations(recommendations: readonly Recommendation[]): readonly Recommendation[] {
    // Remove duplications, sort by priority
    return [...recommendations].sort((a, b) => {
      if ((a as any).priority === 'CRITICAL') return -1;
      if ((b as any).priority === 'CRITICAL') return 1;
      return 0;
    });
  }

  resolveLearnings(learnings: readonly InstitutionalLesson[]): readonly InstitutionalLesson[] {
    // Keep only the highest confidence ones
    return learnings.filter(l => l.confidence.level === 'validated' || l.confidence.level === 'established');
  }

  resolvePatterns(patterns: readonly LearningPattern[]): readonly LearningPattern[] {
    return patterns.filter(p => p.maturity === 'INSTITUTIONAL_PRINCIPLE' || p.maturity === 'VALIDATED_PATTERN');
  }
}
