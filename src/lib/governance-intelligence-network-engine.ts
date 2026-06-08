import type {
  GovernanceIntelligenceInput,
  GovernanceIntelligenceNetwork,
  GovernancePattern,
  GovernanceFriction,
  PersistentRisk,
  DecisionEffectiveness,
  InstitutionalMomentum,
} from "./governance-intelligence-network-types";

const FIDUCIARY_DISCLAIMER =
  "Esta camada de inteligência governamental extrai padrões unicamente a partir de registros imutáveis, sem interferir em scores, métricas ou dados financeiros subjacentes.";

export function buildGovernanceIntelligenceNetwork(
  input: GovernanceIntelligenceInput | undefined,
): GovernanceIntelligenceNetwork | undefined {
  if (!input?.governanceMemory) {
    return undefined;
  }

  const memory = input.governanceMemory;

  const recurringTopics: GovernancePattern[] = [];
  const governanceFrictions: GovernanceFriction[] = [];
  const persistentRisks: PersistentRisk[] = [];
  const institutionalLearnings: string[] = [];

  // 1. Recurring Topics Detector
  const topicCounts: Record<string, { count: number; first: string; last: string }> = {};
  
  memory.events.forEach((event) => {
    if (["BOARD_DECISION", "ACTION_PLAN_CREATED", "STRATEGIC_RECOMMENDATION"].includes(event.eventType)) {
      const topic = event.description; // Na ausência de NLP, usamos a descrição exata do evento para detectar reincidência nesta POC
      
      if (!topicCounts[topic]) {
        topicCounts[topic] = { count: 1, first: event.timestamp, last: event.timestamp };
      } else {
        topicCounts[topic].count += 1;
        topicCounts[topic].last = event.timestamp;
        if (event.timestamp < topicCounts[topic].first) topicCounts[topic].first = event.timestamp;
      }
    }
  });

  Object.entries(topicCounts).forEach(([topic, data]) => {
    if (data.count > 1) {
      recurringTopics.push({
        topic,
        occurrences: data.count,
        firstSeenAt: data.first,
        lastSeenAt: data.last,
      });
    }
  });

  // 2. Governance Friction Detector
  // Frictions occur when there are repeated action creations or recommendations without completion
  const actionCounts: Record<string, number> = {};
  const completionCounts: Record<string, number> = {};

  memory.events.forEach((event) => {
    if (event.eventType === "ACTION_PLAN_CREATED" || event.eventType === "STRATEGIC_RECOMMENDATION") {
      actionCounts[event.description] = (actionCounts[event.description] || 0) + 1;
    } else if (event.eventType === "ACTION_PLAN_COMPLETED") {
      completionCounts[event.description] = (completionCounts[event.description] || 0) + 1;
    }
  });

  Object.entries(actionCounts).forEach(([topic, creations]) => {
    const completions = completionCounts[topic] || 0;
    if (creations > 1 && completions === 0) {
      governanceFrictions.push({
        topic,
        recurrenceCount: creations,
        unresolvedCycles: creations,
      });
    }
  });

  // 3. Persistent Risk Detector
  const riskEscalations: Record<string, number> = {};
  const riskClosures: Record<string, number> = {};

  memory.events.forEach((event) => {
    if (event.eventType === "RISK_ESCALATED") {
      riskEscalations[event.description] = (riskEscalations[event.description] || 0) + 1;
    } else if (event.eventType === "RISK_CLOSED") {
      riskClosures[event.description] = (riskClosures[event.description] || 0) + 1;
    }
  });

  Object.entries(riskEscalations).forEach(([risk, escalations]) => {
    const closures = riskClosures[risk] || 0;
    // Persistente se fechou e abriu de novo
    if (escalations > 1 && closures > 0 && escalations > closures) {
      persistentRisks.push({
        riskTopic: risk,
        recurrenceCount: escalations,
      });
    }
  });

  // 4. Decision Effectiveness
  const decisionsCreated = memory.events.filter((e) => e.eventType === "BOARD_DECISION").length;
  const actionsCreated = memory.events.filter((e) => e.eventType === "ACTION_PLAN_CREATED").length;
  const actionsCompleted = memory.events.filter((e) => e.eventType === "ACTION_PLAN_COMPLETED").length;
  
  const effectivenessRatio = actionsCreated > 0 ? actionsCompleted / actionsCreated : 0;
  
  const decisionEffectiveness: DecisionEffectiveness = {
    decisionsCreated,
    actionsCreated,
    actionsCompleted,
    effectivenessRatio,
  };

  // 5. Institutional Momentum
  // Using actionsCompleted as executed decisions proxy for momentum calculation
  const momentumRatio = decisionsCreated > 0 ? actionsCompleted / decisionsCreated : 0;
  
  const institutionalMomentum: InstitutionalMomentum = {
    decisionsTaken: decisionsCreated,
    decisionsExecuted: actionsCompleted,
    momentumRatio,
  };

  // 6. Institutional Learnings
  if (recurringTopics.length > 0) {
    institutionalLearnings.push(`${recurringTopics.length} tópicos apareceram de forma recorrente em ciclos de governança recentes.`);
  }
  
  if (actionsCreated > actionsCompleted) {
    institutionalLearnings.push(`A capacidade de execução (${actionsCompleted}) está abaixo do volume de deliberações e planos definidos (${actionsCreated}).`);
  }
  
  if (persistentRisks.length > 0) {
    institutionalLearnings.push(`A recorrência de ${persistentRisks.length} riscos já tratados sugere que causas raízes estruturais podem permanecer não resolvidas.`);
  }

  return {
    recurringTopics,
    governanceFrictions,
    persistentRisks,
    decisionEffectiveness,
    institutionalMomentum,
    institutionalLearnings,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
