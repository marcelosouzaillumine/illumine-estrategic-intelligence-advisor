export interface ExecutiveClarityScore {
  scoreId: string;
  tenantId: string;
  overallClarityScore: number; // 0 to 1 (1 = maximum clarity)
  informationHierarchyScore: number;
  attentionFocusScore: number;
  decisionReadinessScore: number;
  recommendation: string;
}

export interface CognitiveComplexityProfile {
  profileId: string;
  role: 'CFO' | 'CONTROLLER' | 'BOARD_MEMBER' | 'ADVISOR';
  complexityZones: ComplexityZone[];
  prioritySignals: string[];
  suppressedNoise: string[];
}

export interface ComplexityZone {
  zone: string;
  currentComplexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'OVERLOAD';
  recommendedAction: string;
}

export interface StorytellingNarrative {
  narrativeId: string;
  headline: string;
  context: string;
  keyRisk: string;
  recommendedFocus: string;
}

export interface AttentionMapEntry {
  section: string;
  priorityWeight: number; // 0 to 1
  cognitiveLoad: number;  // 0 to 1
  actionable: boolean;
}
