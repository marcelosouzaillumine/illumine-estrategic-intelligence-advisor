import type {
  GovernanceMemory,
  GovernanceMemoryEvent,
  GovernanceMemoryInput,
} from "./governance-memory-types";

export function buildGovernanceMemory(
  input: GovernanceMemoryInput | undefined,
): GovernanceMemory | undefined {
  if (!input || Object.keys(input).length === 0) {
    return undefined;
  }

  const events: GovernanceMemoryEvent[] = [];
  const recurringTopics: string[] = [];
  const recurringRisks: string[] = [];
  const openActionItems: string[] = [];
  const completedActionItems: string[] = [];
  const institutionalLearnings: string[] = [];

  const timestamp = new Date().toISOString();

  // Extract events from BoardNarrative
  if (input.boardNarrative?.decisionPoints?.length) {
    input.boardNarrative.decisionPoints.forEach((decision, index) => {
      events.push({
        eventId: `evt-bnl-dec-${Date.now()}-${index}`,
        timestamp,
        eventType: "BOARD_DECISION",
        title: "Board Decision Point",
        description: decision,
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [decision],
      });
    });
  }

  if (input.boardNarrative?.recommendedBoardActions?.length) {
    input.boardNarrative.recommendedBoardActions.forEach((action, index) => {
      events.push({
        eventId: `evt-bnl-act-${Date.now()}-${index}`,
        timestamp,
        eventType: "ACTION_PLAN_CREATED",
        title: "Recommended Board Action",
        description: action,
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      });
      openActionItems.push(action);
    });
  }

  // Extract from AdvisoryNarrative
  if (input.advisoryNarrative?.advisoryRecommendations?.length) {
    input.advisoryNarrative.advisoryRecommendations.forEach((rec, index) => {
      events.push({
        eventId: `evt-anl-rec-${Date.now()}-${index}`,
        timestamp,
        eventType: "STRATEGIC_RECOMMENDATION",
        title: "Advisory Recommendation",
        description: rec,
        sourceLayer: "ANL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      });
    });
  }

  // Extract from ManagementNarrative
  if (input.managementNarrative?.managementActionPlan?.length) {
    input.managementNarrative.managementActionPlan.forEach((plan, index) => {
      events.push({
        eventId: `evt-mnl-act-${Date.now()}-${index}`,
        timestamp,
        eventType: "ACTION_PLAN_CREATED",
        title: "Management Action Plan",
        description: plan,
        sourceLayer: "MNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      });
      openActionItems.push(plan);
    });
  }

  // Detect basic recurrences deterministically (exact matches)
  // For v2.0 baseline, we just look at what's present. More complex logic would need DB historicals.
  // Here we just consolidate what we have right now into the memory snapshot.
  
  // Basic recurring topic extraction logic (placeholder for deterministic approach)
  if (input.boardNarrative?.fiduciaryQuestions?.length && input.advisoryNarrative?.executiveReflectionQuestions?.length) {
    // If the same text is in both, mark as recurring
    const boardQs = input.boardNarrative.fiduciaryQuestions;
    const advisoryQs = input.advisoryNarrative.executiveReflectionQuestions;
    boardQs.forEach(bq => {
      if (advisoryQs.includes(bq)) {
        recurringTopics.push(bq);
      }
    });
  }

  if (events.length === 0) {
    return undefined; // Fail safe if no events can be built
  }

  if (recurringTopics.length > 0) {
    institutionalLearnings.push(`Identificamos ${recurringTopics.length} tópicos transversais entre as camadas fiduciárias e consultivas neste ciclo.`);
  }

  return {
    events,
    recurringTopics,
    recurringRisks,
    openActionItems,
    completedActionItems,
    institutionalLearnings,
  };
}
