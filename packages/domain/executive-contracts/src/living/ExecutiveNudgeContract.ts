export interface ExecutiveNudgeContract {
  readonly nudgeId: string;
  readonly reasonText: string;
  readonly expectedBenefitText: string;
  readonly suggestedActionText: string;
  readonly impactLevel: 'HIGH' | 'MODERATE' | 'LOW';
  readonly priorityRank: number; // 1, 2, ou 3 (máximo 3 por dia)
}
