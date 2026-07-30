export interface PriorityItem {
  readonly itemId: string;
  readonly title: string;
  readonly category: 'TOP_3' | 'QUICK_WIN' | 'STRATEGIC_PROJECT' | 'CRITICAL_RISK';
  readonly urgencyScore: number;
  readonly financialImpactScore: number;
  readonly strategicImpactScore: number;
  readonly expectedReturnDays: number;
}

export interface ExecutivePrioritizationContract {
  readonly prioritizationId: string;
  readonly companyId: string;
  readonly items: readonly PriorityItem[];
  readonly top3Priorities: readonly PriorityItem[];
  readonly quickWins: readonly PriorityItem[];
  readonly strategicProjects: readonly PriorityItem[];
  readonly criticalRisks: readonly PriorityItem[];
  readonly generatedAt: string;
}
