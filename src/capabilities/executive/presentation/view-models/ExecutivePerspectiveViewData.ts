export type ExecutiveTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'attention'
  | 'warning'
  | 'critical';

export type ExecutiveIconKey = 
  | 'trending-up'
  | 'users'
  | 'dollar-sign'
  | 'layers'
  | 'target'
  | 'bar-chart';

export interface ExecutivePerspectiveViewData {
  header: {
    confidenceLevel: string;
    confidenceTone: ExecutiveTone;
    executivePosture: string;
    segmentLabel: string;
    modelLabel: string;
  };
  institutionalContext?: {
    operationalSegment: { 
      label: string; 
      confidenceTone?: ExecutiveTone; 
      inferenceModeLabel?: string 
    };
    operationalModel: { label: string };
    financialProfile: { label: string };
    institutionalMaturity: { label: string };
    strategicConfidence: { label: string; tone: ExecutiveTone };
    interpretativeLimitations: string[];
    prudencyApplied?: {
      reasons: Array<{ title: string; description: string; severity: ExecutiveTone }>;
    };
  };
  diagnosis: {
    executiveSummary: string;
    institutionalDiagnosis: string;
    dominantRisks: Array<{
      id: string;
      label: string;
      description?: string;
      severity: ExecutiveTone;
      source?: string;
    }>;
    strategicPriorities: Array<{
      id: string;
      label: string;
      rationale?: string;
      priority: ExecutiveTone;
    }>;
  };
  actionMatrix: Array<{
    id: string;
    action: string;
    managementArea: {
      label: string;
      icon: ExecutiveIconKey;
      tone: ExecutiveTone;
    };
    priority: {
      label: string;
      tone: ExecutiveTone;
    };
    timeline: string;
    expectedImpact?: string;
    executionRisk?: string;
    monitoringKpi?: string;
    fiduciaryEvidence?: string;
  }>;
  causalModeration?: {
    blockedFalsePositives: string[];
    causalConflicts: string[];
  };
}
