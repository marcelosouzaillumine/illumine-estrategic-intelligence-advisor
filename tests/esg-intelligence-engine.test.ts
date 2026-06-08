import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildESGIntelligence } from "../src/lib/esg-intelligence-engine";
import { ESGIntelligenceInput, ESGIntelligenceReportLike } from "../src/lib/esg-intelligence-types";
import { mapReportToESGIntelligenceInput } from "../src/lib/esg-intelligence-mapper";
import { GovernanceMemory } from "../src/lib/governance-memory-types";
import { GovernanceIntelligenceNetwork } from "../src/lib/governance-intelligence-network-types";
import { GovernanceDigitalTwin } from "../src/lib/governance-digital-twin-types";

describe("ESG Intelligence Layer v3.0", () => {
  const createMockInput = (
    envEvents: number,
    socEvents: number,
    execRatio: number,
    frictions: number
  ): ESGIntelligenceInput => {
    const memory: GovernanceMemory = {
      events: [],
      recurringTopics: [],
      recurringRisks: [],
      openActionItems: [],
      completedActionItems: [],
      institutionalLearnings: [],
    };

    for (let i = 0; i < envEvents; i++) {
      memory.events.push({
        eventId: `env-${i}`,
        timestamp: "2026-06-01T10:00:00Z",
        eventType: "BOARD_DECISION",
        title: "Decision",
        description: "Aprovar política ambiental de sustentabilidade",
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      });
    }

    for (let i = 0; i < socEvents; i++) {
      memory.events.push({
        eventId: `soc-${i}`,
        timestamp: "2026-06-01T10:00:00Z",
        eventType: "BOARD_DECISION",
        title: "Decision",
        description: "Engajamento com stakeholder social",
        sourceLayer: "BNL",
        relatedTopics: [],
        relatedRisks: [],
        relatedDecisions: [],
      });
    }

    const intelligence: GovernanceIntelligenceNetwork = {
      recurringTopics: [],
      governanceFrictions: Array(frictions).fill({ topic: "Friction", recurrenceCount: 2, unresolvedCycles: 2 }),
      persistentRisks: [],
      decisionEffectiveness: { decisionsCreated: 10, actionsCreated: 10, actionsCompleted: execRatio * 10, effectivenessRatio: execRatio },
      institutionalMomentum: { decisionsTaken: 10, decisionsExecuted: execRatio * 10, momentumRatio: execRatio },
      institutionalLearnings: ["Learning 1"],
      fiduciaryDisclaimer: ""
    };

    const twin: GovernanceDigitalTwin = {
      currentTrajectory: { scenario: "", description: "" },
      executionTrajectory: { scenario: "", description: "" },
      riskTrajectory: { scenario: "", description: "" },
      governanceTrajectory: { scenario: "", description: "" },
      executionCapacity: { executionRatio: execRatio, classification: execRatio >= 0.8 ? "HIGH" : "LOW" },
      institutionalWarnings: [],
      institutionalOpportunities: [],
      fiduciaryDisclaimer: ""
    };

    return {
      governanceMemory: memory,
      governanceIntelligence: intelligence,
      governanceDigitalTwin: twin,
    };
  };

  test("should return undefined if input is missing dependencies", () => {
    assert.strictEqual(buildESGIntelligence(undefined), undefined);
    assert.strictEqual(buildESGIntelligence({}), undefined);
  });

  test("should evaluate Environmental (E) dimension correctly", () => {
    // 1 event = 40 + 20 = 60 (MODERATE)
    // 3 events = 40 + 60 = 100 (HIGH)
    const moderateResult = buildESGIntelligence(createMockInput(1, 0, 0.5, 0))!;
    assert.strictEqual(moderateResult.environmental.score, 60);
    assert.strictEqual(moderateResult.environmental.classification, "MODERATE");

    const highResult = buildESGIntelligence(createMockInput(3, 0, 0.5, 0))!;
    assert.strictEqual(highResult.environmental.score, 100);
    assert.strictEqual(highResult.environmental.classification, "HIGH");
  });

  test("should evaluate Social (S) dimension correctly", () => {
    // 0 events = 40 (LOW)
    // 1 event = 60 (MODERATE)
    const lowResult = buildESGIntelligence(createMockInput(0, 0, 0.5, 0))!;
    assert.strictEqual(lowResult.social.score, 40);
    assert.strictEqual(lowResult.social.classification, "LOW");

    const moderateResult = buildESGIntelligence(createMockInput(0, 1, 0.5, 0))!;
    assert.strictEqual(moderateResult.social.score, 60);
    assert.strictEqual(moderateResult.social.classification, "MODERATE");
  });

  test("should evaluate Governance (G) dimension correctly", () => {
    // ExecRatio = 0.9, Frictions = 0 -> 0.9*60 + 40 = 94 (HIGH)
    const highResult = buildESGIntelligence(createMockInput(0, 0, 0.9, 0))!;
    assert.strictEqual(highResult.governance.score, 94);
    assert.strictEqual(highResult.governance.classification, "HIGH");

    // ExecRatio = 0.5, Frictions = 2 -> 0.5*60 + 20 = 50 (MODERATE)
    const moderateResult = buildESGIntelligence(createMockInput(0, 0, 0.5, 2))!;
    assert.strictEqual(moderateResult.governance.score, 50);
    assert.strictEqual(moderateResult.governance.classification, "MODERATE");
  });

  test("should calculate overall score correctly", () => {
    const result = buildESGIntelligence(createMockInput(1, 1, 0.5, 2))!;
    // E = 60, S = 60, G = 50 -> Overall = Math.round(170 / 3) = 57
    assert.strictEqual(result.overallScore, 57);
  });

  test("should generate highlights and warnings deterministically", () => {
    const result = buildESGIntelligence(createMockInput(0, 0, 0.4, 2))!;
    assert.ok(result.institutionalWarnings.includes("Execution capacity remains below institutional demand."));
    assert.ok(result.institutionalWarnings.includes("Governance friction remains recurrent."));
    assert.ok(result.institutionalHighlights.includes("Institutional learning processes are active."));
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithGDT = {
      ...baseline,
      ...createMockInput(1, 1, 0.8, 0)
    };

    const input = mapReportToESGIntelligenceInput(reportWithGDT);
    const esgIntelligence = buildESGIntelligence(input);

    const reportWithESG = {
      ...reportWithGDT,
      ...(esgIntelligence && { esgIntelligence })
    };

    assert.deepStrictEqual(reportWithESG.scores, baseline.scores);
    assert.deepStrictEqual(reportWithESG.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithESG.classifications, baseline.classifications);
    assert.ok(reportWithESG.esgIntelligence);
  });
});
