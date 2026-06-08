import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildValuationIntelligence } from "../src/lib/valuation-intelligence-engine";
import { ValuationIntelligenceInput, ValuationIntelligenceReportLike } from "../src/lib/valuation-intelligence-types";
import { mapReportToValuationIntelligenceInput } from "../src/lib/valuation-intelligence-mapper";

import { UnifiedFinancialNarrative } from "../src/lib/unified-financial-narrative-types";
import { ExecutiveFinancialStory } from "../src/lib/executive-financial-story-types";
import { GovernanceIntelligenceNetwork } from "../src/lib/governance-intelligence-network-types";
import { GovernanceDigitalTwin } from "../src/lib/governance-digital-twin-types";
import { ESGIntelligence } from "../src/lib/esg-intelligence-types";
import { GovernanceMemory } from "../src/lib/governance-memory-types";

describe("Valuation Intelligence Layer v3.0", () => {
  const createMockInput = (
    evidenceCount: number,
    esgScore: number,
    execClassification: "HIGH" | "MODERATE" | "LOW"
  ): ValuationIntelligenceInput => {
    const input: ValuationIntelligenceInput = {};

    if (evidenceCount >= 1) {
      input.unifiedFinancialNarrative = { valueCreationSummary: "Creation summary" } as unknown as UnifiedFinancialNarrative;
    }
    if (evidenceCount >= 2) {
      input.executiveFinancialStory = {} as ExecutiveFinancialStory;
    }
    if (evidenceCount >= 3) {
      input.governanceIntelligence = {
        decisionEffectiveness: { effectivenessRatio: 0.9 },
        persistentRisks: [],
        governanceFrictions: [],
        recurringTopics: [],
        institutionalMomentum: { momentumRatio: 0.9, decisionsTaken: 1, decisionsExecuted: 1 },
        institutionalLearnings: [],
        fiduciaryDisclaimer: ""
      } as unknown as GovernanceIntelligenceNetwork;
    }
    if (evidenceCount >= 4) {
      input.governanceDigitalTwin = {
        executionCapacity: { classification: execClassification, executionRatio: 0.9 }
      } as unknown as GovernanceDigitalTwin;
    }
    if (evidenceCount >= 5) {
      input.esgIntelligence = {
        overallScore: esgScore
      } as ESGIntelligence;
    }
    if (evidenceCount >= 6) {
      input.governanceMemory = {
        institutionalLearnings: ["Learned"],
        recurringRisks: []
      } as unknown as GovernanceMemory;
    }

    return input;
  };

  test("should return undefined if input is undefined", () => {
    assert.strictEqual(buildValuationIntelligence(undefined), undefined);
  });

  test("should return undefined if input has no evidence", () => {
    assert.strictEqual(buildValuationIntelligence({}), undefined);
  });

  test("should classify HIGH readiness (>= 5 sources)", () => {
    const input = createMockInput(6, 90, "HIGH");
    const result = buildValuationIntelligence(input)!;
    assert.strictEqual(result.valuationReadiness, "HIGH");
  });

  test("should classify MODERATE readiness (3 or 4 sources)", () => {
    const input = createMockInput(3, 90, "HIGH");
    const result = buildValuationIntelligence(input)!;
    assert.strictEqual(result.valuationReadiness, "MODERATE");
  });

  test("should classify LOW readiness (1 or 2 sources)", () => {
    const input = createMockInput(1, 90, "HIGH");
    const result = buildValuationIntelligence(input)!;
    assert.strictEqual(result.valuationReadiness, "LOW");
  });

  test("should identify ESG risk if ESG score < 50", () => {
    const input = createMockInput(5, 40, "HIGH");
    const result = buildValuationIntelligence(input)!;
    
    const esgRisk = result.valueDestructionRisks.find(r => r.source === "ESG");
    assert.ok(esgRisk);
    assert.ok(esgRisk.risk.includes("Baixa maturidade ESG"));
  });

  test("should identify Execution risk if Digital Twin execution capacity is LOW", () => {
    const input = createMockInput(4, 90, "LOW");
    const result = buildValuationIntelligence(input)!;
    
    const execRisk = result.valueDestructionRisks.find(r => r.source === "EXECUTION");
    assert.ok(execRisk);
    assert.ok(execRisk.risk.includes("Baixa capacidade de execução"));
  });

  test("should not interfere with scores, metrics, and classifications during conditional spread", () => {
    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithESG = {
      ...baseline,
      ...createMockInput(6, 80, "HIGH")
    };

    const input = mapReportToValuationIntelligenceInput(reportWithESG);
    const valuationIntelligence = buildValuationIntelligence(input);

    const reportWithValuation = {
      ...reportWithESG,
      ...(valuationIntelligence && { valuationIntelligence })
    };

    assert.deepStrictEqual(reportWithValuation.scores, baseline.scores);
    assert.deepStrictEqual(reportWithValuation.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithValuation.classifications, baseline.classifications);
    assert.ok(reportWithValuation.valuationIntelligence);
  });
});
