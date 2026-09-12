export interface ExecutiveKPI {
  label: string;
  value: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export interface ThematicNarrative {
  title: string;
  content: string;
}

export interface BoardConclusion {
  title: string;
  content: string;
}

export interface InstitutionalObservation {
  severity: "healthy" | "monitoring" | "warning" | "critical";
  content: string;
}

export interface ExecutiveDecisionPayload {
  summary: string;
  kpis: ExecutiveKPI[];
  thematicNarratives: ThematicNarrative[];
  boardConclusion: BoardConclusion;
  institutionalObservation: InstitutionalObservation;
  priorityRecommendation?: string;
}

export interface ExecutiveStrategicDiagnosisPayload {
  analysisYear: number;
  generatedAt: string;
  currentSituation: string;
  strategicSignificance?: string;
  outlook: string;
  institutionalObservation?: string | { severity: string; content: string; };
  severityState?: "healthy" | "warning" | "critical" | "neutral";
  observationSeverity?: "low" | "medium" | "high";
  primaryDriver?: string;
  dominantStrength?: string;
  secondaryAttention?: string;
  moduleContext?: string;
  strategicPriority?: string;
  priorityRecommendation?: string;
  recommendationPriority?: string;
}
