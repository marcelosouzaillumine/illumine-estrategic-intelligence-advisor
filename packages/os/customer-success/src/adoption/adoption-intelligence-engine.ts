export interface AdoptionMetrics {
  activeExecutiveUsersCount: number;
  monthlyBoardMeetingsSimulated: number;
  declarativePagesVisitedPercentage: number;
}

export class AdoptionIntelligenceEngine {
  public static getMetrics(tenantId: string): AdoptionMetrics {
    return {
      activeExecutiveUsersCount: 12,
      monthlyBoardMeetingsSimulated: 4,
      declarativePagesVisitedPercentage: 92.5
    };
  }
}
