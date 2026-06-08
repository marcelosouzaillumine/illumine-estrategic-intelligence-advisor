import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildGovernanceIntelligenceNetwork } from "../src/lib/governance-intelligence-network-engine";
import { GovernanceIntelligenceInput, GovernanceIntelligenceReportLike } from "../src/lib/governance-intelligence-network-types";
import { mapReportToGovernanceIntelligenceInput } from "../src/lib/governance-intelligence-network-mapper";
import { GovernanceMemory } from "../src/lib/governance-memory-types";

describe("Governance Intelligence Network v2.0", () => {
  const mockMemory: GovernanceMemory = {
    events: [
      {
        eventId: "e1",
        timestamp: "2026-06-01T10:00:00Z",
        eventType: "BOARD_DECISION",
        title: "Decision",
        description: "Approve Q1 Budget",
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
      {
        eventId: "e2",
        timestamp: "2026-06-02T10:00:00Z",
        eventType: "ACTION_PLAN_CREATED",
        title: "Action",
        description: "Hire new CFO",
        sourceLayer: "MNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
      {
        eventId: "e3",
        timestamp: "2026-06-03T10:00:00Z",
        eventType: "ACTION_PLAN_CREATED",
        title: "Action",
        description: "Hire new CFO",
        sourceLayer: "MNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
      {
        eventId: "e4",
        timestamp: "2026-06-04T10:00:00Z",
        eventType: "RISK_ESCALATED",
        title: "Risk",
        description: "Liquidity Risk",
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
      {
        eventId: "e5",
        timestamp: "2026-06-05T10:00:00Z",
        eventType: "RISK_CLOSED",
        title: "Risk",
        description: "Liquidity Risk",
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
      {
        eventId: "e6",
        timestamp: "2026-06-06T10:00:00Z",
        eventType: "RISK_ESCALATED",
        title: "Risk",
        description: "Liquidity Risk",
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
      {
        eventId: "e7",
        timestamp: "2026-06-07T10:00:00Z",
        eventType: "ACTION_PLAN_COMPLETED",
        title: "Action",
        description: "Update Governance Policy",
        sourceLayer: "MNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      },
    ],
    recurringTopics: [],
    recurringRisks: [],
    openActionItems: [],
    completedActionItems: [],
    institutionalLearnings: [],
  };

  test("should return undefined if no governanceMemory is provided", () => {
    assert.strictEqual(buildGovernanceIntelligenceNetwork(undefined), undefined);
    assert.strictEqual(buildGovernanceIntelligenceNetwork({}), undefined);
  });

  test("should build governance intelligence correctly from memory events", () => {
    const reportLike: GovernanceIntelligenceReportLike = {
      governanceMemory: mockMemory,
    };
    
    const input: GovernanceIntelligenceInput = mapReportToGovernanceIntelligenceInput(reportLike);
    const result = buildGovernanceIntelligenceNetwork(input);

    assert.ok(result);

    // 1. Recurrence Detection
    // "Hire new CFO" appears twice
    assert.strictEqual(result.recurringTopics.length, 1);
    assert.strictEqual(result.recurringTopics[0].topic, "Hire new CFO");
    assert.strictEqual(result.recurringTopics[0].occurrences, 2);

    // 2. Friction Detection
    // "Hire new CFO" created twice but never completed
    assert.strictEqual(result.governanceFrictions.length, 1);
    assert.strictEqual(result.governanceFrictions[0].topic, "Hire new CFO");
    assert.strictEqual(result.governanceFrictions[0].recurrenceCount, 2);
    assert.strictEqual(result.governanceFrictions[0].unresolvedCycles, 2);

    // 3. Persistent Risks
    // "Liquidity Risk" escalated twice and closed once => persistent
    assert.strictEqual(result.persistentRisks.length, 1);
    assert.strictEqual(result.persistentRisks[0].riskTopic, "Liquidity Risk");
    assert.strictEqual(result.persistentRisks[0].recurrenceCount, 2);

    // 4. Decision Effectiveness
    // Decisions created: 1
    // Actions created: 2
    // Actions completed: 1
    // Effectiveness: 1 / 2 = 0.5
    assert.strictEqual(result.decisionEffectiveness.decisionsCreated, 1);
    assert.strictEqual(result.decisionEffectiveness.actionsCreated, 2);
    assert.strictEqual(result.decisionEffectiveness.actionsCompleted, 1);
    assert.strictEqual(result.decisionEffectiveness.effectivenessRatio, 0.5);

    // 5. Institutional Momentum
    // Decisions taken: 1
    // Decisions executed (actions completed): 1
    // Momentum: 1 / 1 = 1
    assert.strictEqual(result.institutionalMomentum.decisionsTaken, 1);
    assert.strictEqual(result.institutionalMomentum.decisionsExecuted, 1);
    assert.strictEqual(result.institutionalMomentum.momentumRatio, 1);
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithMemory = {
      ...baseline,
      governanceMemory: mockMemory
    };

    const input = mapReportToGovernanceIntelligenceInput(reportWithMemory);
    const governanceIntelligence = buildGovernanceIntelligenceNetwork(input);

    const reportWithGovernanceIntelligence = {
      ...reportWithMemory,
      ...(governanceIntelligence && { governanceIntelligence })
    };

    assert.deepStrictEqual(reportWithGovernanceIntelligence.scores, baseline.scores);
    assert.deepStrictEqual(reportWithGovernanceIntelligence.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithGovernanceIntelligence.classifications, baseline.classifications);
    assert.ok(reportWithGovernanceIntelligence.governanceIntelligence);
  });
});
