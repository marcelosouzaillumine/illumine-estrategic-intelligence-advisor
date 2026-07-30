export interface ExecutiveMissionContract {
  readonly missionId: string;
  readonly dailyMissionText: string;
  readonly targetOutcome: string;
  readonly priorityCategory: 'LIQUIDITY' | 'MARGIN' | 'RISK_MITIGATION' | 'GOVERNANCE';
}
