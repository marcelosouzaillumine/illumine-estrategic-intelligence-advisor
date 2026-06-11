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

export interface PriorityRecommendation {
  severity: "healthy" | "monitoring" | "warning" | "critical";
  content: string;
}

export interface ExecutiveDecisionPayload {
  summary: string;
  kpis: ExecutiveKPI[];
  thematicNarratives: ThematicNarrative[];
  boardConclusion: BoardConclusion;
  priorityRecommendation: PriorityRecommendation;
}
