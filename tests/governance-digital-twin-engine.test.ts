import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildGovernanceDigitalTwin } from "../src/lib/governance-digital-twin-engine";
import { GovernanceDigitalTwinInput, GovernanceDigitalTwinReportLike } from "../src/lib/governance-digital-twin-types";
import { mapReportToGovernanceDigitalTwinInput } from "../src/lib/governance-digital-twin-mapper";
import { GovernanceIntelligenceNetwork } from "../src/lib/governance-intelligence-network-types";
import { GovernanceMemory } from "../src/lib/governance-memory-types";

describe("Governance Digital Twin v2.0", () => {
  const mockMemory: GovernanceMemory = {
    events: [],
    recurringTopics: [],
    recurringRisks: [],
    openActionItems: [],
    completedActionItems: [],
    institutionalLearnings: [],
  };

  const createMockIntelligence = (effectivenessRatio: number): GovernanceIntelligenceNetwork => ({
    recurringTopics: [{ topic: "T1", occurrences: 2, firstSeenAt: "A", lastSeenAt: "B" }],
    governanceFrictions: [{ topic: "F1", recurrenceCount: 2, unresolvedCycles: 2 }],
    persistentRisks: [{ riskTopic: "R1", recurrenceCount: 2 }],
    decisionEffectiveness: { decisionsCreated: 10, actionsCreated: 10, actionsCompleted: effectivenessRatio * 10, effectivenessRatio },
    institutionalMomentum: { decisionsTaken: 10, decisionsExecuted: effectivenessRatio * 10, momentumRatio: effectivenessRatio },
    institutionalLearnings: [],
    fiduciaryDisclaimer: ""
  });

  test("should return undefined if input is missing dependencies", () => {
    assert.strictEqual(buildGovernanceDigitalTwin(undefined), undefined);
    assert.strictEqual(buildGovernanceDigitalTwin({}), undefined);
  });

  test("should assign LOW classification and appropriate trajectories for ratio < 0.5", () => {
    const input: GovernanceDigitalTwinInput = {
      governanceMemory: mockMemory,
      governanceIntelligence: createMockIntelligence(0.4),
    };
    const result = buildGovernanceDigitalTwin(input);
    
    assert.ok(result);
    assert.strictEqual(result.executionCapacity.classification, "LOW");
    assert.ok(result.currentTrajectory.description.includes("congestion"));
    assert.ok(result.institutionalWarnings.includes("Execution capacity remains below institutional demand."));
    assert.ok(result.institutionalOpportunities.includes("Execution improvements may unlock institutional momentum."));
  });

  test("should assign MODERATE classification for 0.5 <= ratio < 0.8", () => {
    const input: GovernanceDigitalTwinInput = {
      governanceMemory: mockMemory,
      governanceIntelligence: createMockIntelligence(0.6),
    };
    const result = buildGovernanceDigitalTwin(input);
    
    assert.ok(result);
    assert.strictEqual(result.executionCapacity.classification, "MODERATE");
    assert.ok(result.currentTrajectory.description.includes("stable institutional momentum"));
  });

  test("should assign HIGH classification for ratio >= 0.8", () => {
    const input: GovernanceDigitalTwinInput = {
      governanceMemory: mockMemory,
      governanceIntelligence: createMockIntelligence(0.9),
    };
    const result = buildGovernanceDigitalTwin(input);
    
    assert.ok(result);
    assert.strictEqual(result.executionCapacity.classification, "HIGH");
    assert.ok(result.institutionalOpportunities.includes("High execution capacity permits acceleration of strategic roadmap."));
  });

  test("should generate risk and governance trajectories deterministically", () => {
    const input: GovernanceDigitalTwinInput = {
      governanceMemory: mockMemory,
      governanceIntelligence: createMockIntelligence(0.9),
    };
    const result = buildGovernanceDigitalTwin(input);
    
    assert.ok(result);
    assert.ok(result.riskTrajectory.description.includes("persistent exposure to 1 recurring risk domains"));
    assert.ok(result.governanceTrajectory.description.includes("Governance maturity depends on converting recurring discussions"));
    assert.ok(result.institutionalWarnings.includes("Risk recurrence indicates unresolved structural causes."));
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithIntelligence = {
      ...baseline,
      governanceMemory: mockMemory,
      governanceIntelligence: createMockIntelligence(0.9)
    };

    const input = mapReportToGovernanceDigitalTwinInput(reportWithIntelligence);
    const governanceDigitalTwin = buildGovernanceDigitalTwin(input);

    const reportWithGovernanceDigitalTwin = {
      ...reportWithIntelligence,
      ...(governanceDigitalTwin && { governanceDigitalTwin })
    };

    assert.deepStrictEqual(reportWithGovernanceDigitalTwin.scores, baseline.scores);
    assert.deepStrictEqual(reportWithGovernanceDigitalTwin.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithGovernanceDigitalTwin.classifications, baseline.classifications);
    assert.ok(reportWithGovernanceDigitalTwin.governanceDigitalTwin);
  });
});
