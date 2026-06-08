import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildBenchmarkIntelligence } from "../src/lib/benchmark-intelligence-engine";
import { BenchmarkIntelligenceInput, BenchmarkIntelligenceReportLike } from "../src/lib/benchmark-intelligence-types";
import { mapReportToBenchmarkIntelligenceInput } from "../src/lib/benchmark-intelligence-mapper";

import { GovernanceIntelligenceNetwork } from "../src/lib/governance-intelligence-network-types";
import { GovernanceDigitalTwin } from "../src/lib/governance-digital-twin-types";
import { ESGIntelligence } from "../src/lib/esg-intelligence-types";
import { ValuationIntelligence } from "../src/lib/valuation-intelligence-types";
import { GovernanceMemory } from "../src/lib/governance-memory-types";

describe("Benchmark Intelligence Layer v3.0", () => {
  const createMockInput = (
    type: "HIGH" | "LOW"
  ): BenchmarkIntelligenceInput => {
    const isHigh = type === "HIGH";

    const intelligence: GovernanceIntelligenceNetwork = {
      recurringTopics: [],
      governanceFrictions: isHigh ? [] : [{ topic: "Friction", recurrenceCount: 2, unresolvedCycles: 2 }],
      persistentRisks: isHigh ? [] : [{ riskTopic: "Risk", recurrenceCount: 2 }],
      decisionEffectiveness: { decisionsCreated: 10, actionsCreated: 10, actionsCompleted: isHigh ? 10 : 2, effectivenessRatio: isHigh ? 1.0 : 0.2 },
      institutionalMomentum: { decisionsTaken: 10, decisionsExecuted: isHigh ? 10 : 2, momentumRatio: isHigh ? 1.0 : 0.2 },
      institutionalLearnings: isHigh ? ["Learned"] : [],
      fiduciaryDisclaimer: ""
    };

    const twin: GovernanceDigitalTwin = {
      currentTrajectory: { scenario: "", description: "" },
      executionTrajectory: { scenario: "", description: "" },
      riskTrajectory: { scenario: "", description: "" },
      governanceTrajectory: { scenario: "", description: "" },
      executionCapacity: { executionRatio: isHigh ? 1.0 : 0.2, classification: isHigh ? "HIGH" : "LOW" },
      institutionalWarnings: [],
      institutionalOpportunities: [],
      fiduciaryDisclaimer: ""
    };

    const esg: ESGIntelligence = {
      environmental: { score: 0, classification: "LOW", strengths: [], opportunities: [] },
      social: { score: 0, classification: "LOW", strengths: [], opportunities: [] },
      governance: { score: 0, classification: "LOW", strengths: [], opportunities: [] },
      overallScore: isHigh ? 90 : 30,
      institutionalHighlights: [],
      institutionalWarnings: [],
      fiduciaryDisclaimer: ""
    };

    const val: ValuationIntelligence = {
      valuationReadiness: isHigh ? "HIGH" : "LOW",
      valueCreationSignals: [],
      valueDestructionRisks: [],
      governanceValuationImpact: "",
      esgValuationImpact: "",
      executionValuationImpact: "",
      memoryValuationImpact: "",
      valuationNarrative: "",
      valuationAttentionPoints: [],
      fiduciaryDisclaimer: ""
    };

    return {
      governanceIntelligence: intelligence,
      governanceDigitalTwin: twin,
      esgIntelligence: esg,
      valuationIntelligence: val,
      governanceMemory: { institutionalLearnings: isHigh ? ["Learn"] : [], recurringRisks: [], openActionItems: [], completedActionItems: [], events: [], recurringTopics: [] }
    };
  };

  test("should return undefined if input is undefined", () => {
    assert.strictEqual(buildBenchmarkIntelligence(undefined), undefined);
  });

  test("should return undefined if input has no evidence", () => {
    assert.strictEqual(buildBenchmarkIntelligence({}), undefined);
  });

  test("should classify LEADING institutional position", () => {
    const input = createMockInput("HIGH");
    const result = buildBenchmarkIntelligence(input)!;
    assert.strictEqual(result.institutionalPosition, "LEADING");
  });

  test("should classify EARLY institutional position", () => {
    const input = createMockInput("LOW");
    const result = buildBenchmarkIntelligence(input)!;
    assert.strictEqual(result.institutionalPosition, "EARLY");
  });

  test("should generate competitive advantages", () => {
    const input = createMockInput("HIGH");
    const result = buildBenchmarkIntelligence(input)!;
    assert.ok(result.competitiveAdvantages.some(a => a.category === "Governance"));
    assert.ok(result.competitiveAdvantages.some(a => a.category === "Execution"));
    assert.ok(result.competitiveAdvantages.some(a => a.category === "Memory"));
  });

  test("should generate institutional gaps", () => {
    const input = createMockInput("LOW");
    const result = buildBenchmarkIntelligence(input)!;
    assert.ok(result.institutionalGaps.some(g => g.category === "Governance"));
    assert.ok(result.institutionalGaps.some(g => g.category === "Execution"));
    assert.ok(result.institutionalGaps.some(g => g.category === "Friction"));
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithValuation = {
      ...baseline,
      ...createMockInput("HIGH")
    };

    const input = mapReportToBenchmarkIntelligenceInput(reportWithValuation);
    const benchmarkIntelligence = buildBenchmarkIntelligence(input);

    const reportWithBenchmark = {
      ...reportWithValuation,
      ...(benchmarkIntelligence && { benchmarkIntelligence })
    };

    assert.deepStrictEqual(reportWithBenchmark.scores, baseline.scores);
    assert.deepStrictEqual(reportWithBenchmark.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithBenchmark.classifications, baseline.classifications);
    assert.ok(reportWithBenchmark.benchmarkIntelligence);
  });
});
