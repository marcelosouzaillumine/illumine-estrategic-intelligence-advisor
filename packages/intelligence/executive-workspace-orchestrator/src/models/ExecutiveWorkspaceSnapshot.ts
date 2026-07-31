import { InstitutionalLesson, LearningPattern } from '@illumine/institutional-learning-intelligence';
import { Recommendation } from '@illumine/architecture-governance-recommendation';
import { ExecutiveDecisionContext } from '@illumine/executive-decision-intelligence';
import { ExecutiveAdvisorRuntimeContext } from '@illumine/executive-advisor-runtime';
import { ExecutiveSituation } from './ExecutiveSituation';
import { ExecutiveNarrativeBlock } from './ExecutiveNarrativeBlock';
import { ExecutiveDecisionForensicsPackage } from '@illumine/executive-decision-forensics';

export interface RecommendationConfidence {
  readonly overallConfidence: number;
  readonly evidenceQuality: number;
  readonly historicalSimilarity: number;
  readonly patternStability: number;
  readonly institutionalConfidence: number;
  readonly dataFreshness: number;
  readonly consistencyScore: number;
  readonly executiveTrust: number;
}

export interface ExecutiveTrustIndex {
  readonly explainability: number;
  readonly traceability: number;
  readonly evidence: number;
  readonly governance: number;
  readonly historicalValidation: number;
  readonly confidence: number;
  readonly overallScore: number;
}

export interface IntelligenceDensity {
  readonly contextPresent: boolean;
  readonly interpretationPresent: boolean;
  readonly recommendationPresent: boolean;
  readonly justificationPresent: boolean;
  readonly historyPresent: boolean;
  readonly learningPresent: boolean;
  readonly nextStepPresent: boolean;
  readonly ownerPresent: boolean;
  readonly timeHorizonPresent: boolean;
  readonly riskPresent: boolean;
  readonly impactPresent: boolean;
  readonly densityScore: number;
  readonly findings: readonly string[];
}

export interface ExecutiveWorkspaceCertificationMetadata {
  readonly snapshotId: string;
  readonly certificationStatus: 'CERTIFIED' | 'UNCERTIFIED';
  readonly eahiScore: number;
  readonly cognitiveGovernanceScore: number;
  readonly tenantIsolationValidated: boolean;
  readonly explainabilityValidated: boolean;
  readonly generatedBy: string;
  readonly validationTimestamp: string;
}

export interface ExecutiveWorkspaceSnapshot {
  readonly snapshotId: string;
  readonly version: string;
  readonly generatedAt: string;
  readonly sourceLineage: string;
  
  readonly executiveContext: ExecutiveAdvisorRuntimeContext;
  readonly situation: ExecutiveSituation;
  readonly narrative: ExecutiveNarrativeBlock;
  
  readonly recommendations: readonly Recommendation[];
  readonly pendingDecisions: readonly ExecutiveDecisionContext[];
  readonly institutionalLearning: readonly InstitutionalLesson[];
  readonly institutionalPatterns: readonly LearningPattern[];
  
  readonly recommendationConfidence: RecommendationConfidence;
  readonly executiveTrustIndex: ExecutiveTrustIndex;
  readonly intelligenceDensity: IntelligenceDensity;
  
  readonly forensicsPackage?: ExecutiveDecisionForensicsPackage;
  readonly certificationMetadata?: ExecutiveWorkspaceCertificationMetadata;
}
