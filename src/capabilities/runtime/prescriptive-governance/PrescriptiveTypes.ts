export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type ImpactLevel = 'SYSTEMIC' | 'SIGNIFICANT' | 'MODERATE' | 'MARGINAL';

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT_HISTORY';

export interface PrescriptiveConfidence {
  confidenceLevel: ConfidenceLevel;
  confidenceReason: string;
}

export type TrackArea = 'LIQUIDITY' | 'GOVERNANCE' | 'CAPITAL' | 'OPERATIONS' | 'ESG';

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  expectedOutcome: string;
  primaryTrack: TrackArea;
}

export interface ExecutivePriority extends PrescriptiveConfidence {
  actionId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  impact: ImpactLevel;
  track: TrackArea;
  priorityScore: number; // 0-100 (assigned by FiduciaryPriorityEngine)
  priorityRank: number; // 1 = highest priority
  priorityReason: string;
  actionPlan: ActionPlan;
}

export interface InstitutionalCapacity extends PrescriptiveConfidence {
  capacityScore: number; // 0-100
  financialCapacity: 'STRONG' | 'CONSTRAINED' | 'CRITICAL';
  operationalCapacity: 'ELASTIC' | 'AT_CAPACITY' | 'OVERLOADED';
  governanceCapacity: 'MATURE' | 'DEVELOPING' | 'FRAGILE';
  maxConcurrentInterventions: number;
}

export interface InterventionTrack {
  track: TrackArea;
  title: string;
  description: string;
  sequencedActions: ExecutivePriority[];
}

export type AgendaCategory = 'INFORMATIVO' | 'DELIBERATIVO' | 'MONITORAMENTO';

export interface BoardAgendaItem {
  id: string;
  category: AgendaCategory;
  topic: string;
  context: string;
  associatedAction?: ExecutivePriority;
}

export interface BoardAgenda {
  dateGenerated: string;
  items: BoardAgendaItem[];
}

export interface BoardResolution {
  id: string;
  agendaItemId: string;
  title: string;
  recommendationType: 'DELIBERACAO' | 'DIRECIONAMENTO_ESTRATEGICO';
  recommendedDraft: string; // Must contain "Minuta recomendada para deliberação"
  justification: string;
  executionTrack: TrackArea;
}
