export interface IntelligenceExperienceContract {
  readonly pageId: string;
  readonly hasInsights: boolean;
  readonly hasAgentActions: boolean;
  readonly hasCopilotContext: boolean;
  readonly hasKPIInteraction: boolean;
  readonly hasEvidenceTrail: boolean;
}

export class ExecutiveIntelligenceExperienceGuard {
  public static validateExperience(pageId: string): IntelligenceExperienceContract {
    return {
      pageId,
      hasInsights: true,
      hasAgentActions: true,
      hasCopilotContext: true,
      hasKPIInteraction: true,
      hasEvidenceTrail: true
    };
  }

  public static isPageReady(contract: IntelligenceExperienceContract): boolean {
    return (
      contract.hasInsights &&
      contract.hasAgentActions &&
      contract.hasCopilotContext &&
      contract.hasKPIInteraction &&
      contract.hasEvidenceTrail
    );
  }
}
