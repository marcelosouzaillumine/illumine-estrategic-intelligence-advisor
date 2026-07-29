export interface OpportunityQualification {
  accountName: string;
  winProbabilityPercentage: number;
  dealVelocityDays: number;
  expansionPotentialBrl: number;
}

export class AccountIntelligenceEngine {
  public static evaluateAccount(accountName: string): OpportunityQualification {
    return {
      accountName,
      winProbabilityPercentage: 88,
      dealVelocityDays: 45,
      expansionPotentialBrl: 1500000
    };
  }
}
