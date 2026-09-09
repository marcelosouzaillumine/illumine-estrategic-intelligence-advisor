import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildExecutiveSovereigntyProfile } from "../src/lib/executive-sovereignty-engine";
import { ExecutiveSovereigntyInput } from "../src/lib/executive-sovereignty-types";
import { mapReportToExecutiveSovereigntyInput } from "../src/lib/executive-sovereignty-mapper";

import { SectorIntelligence } from "../src/lib/sector-intelligence-types";
import { BenchmarkIntelligence } from "../src/lib/benchmark-intelligence-types";
import { ValuationIntelligence } from "../src/lib/valuation-intelligence-types";
import { ESGIntelligence } from "../src/lib/esg-intelligence-types";
import { GovernanceDigitalTwin } from "../src/lib/governance-digital-twin-types";
import { CapitalAllocationIntelligence } from "../src/lib/capital-allocation-intelligence-types";

describe("Executive Sovereignty Layer (ESL) v3.0", () => {
  const createMockInput = (
    scenario: "FOUNDATIONAL" | "DEVELOPING" | "ADVANCED" | "SOVEREIGN"
  ): ExecutiveSovereigntyInput => {

    const executionCapacity =
      scenario === "SOVEREIGN" || scenario === "ADVANCED" ? "HIGH" :
      scenario === "DEVELOPING" ? "MODERATE" : "LOW";

    const valuationReadiness =
      scenario === "SOVEREIGN" || scenario === "ADVANCED" ? "HIGH" : "LOW";

    const benchmarkPosition =
      scenario === "SOVEREIGN" ? "LEADING" : "EARLY";

    const esgGovClass =
      scenario === "SOVEREIGN" ? "HIGH" : "LOW";

    const twin: GovernanceDigitalTwin = {
      currentTrajectory: { scenario: "", description: "" },
      executionTrajectory: { scenario: "", description: "" },
      riskTrajectory: { scenario: "", description: "" },
      governanceTrajectory: { scenario: "", description: "" },
      executionCapacity: { executionRatio: 1.0, classification: executionCapacity },
      institutionalWarnings: [],
      institutionalOpportunities: [],
      fiduciaryDisclaimer: ""
    };

    const esg: ESGIntelligence = {
      environmental: { score: 0, classification: "HIGH", strengths: [], opportunities: [] },
      social: { score: 0, classification: "HIGH", strengths: [], opportunities: [] },
      governance: { score: 0, classification: esgGovClass, strengths: [], opportunities: [] },
      overallScore: 90,
      institutionalHighlights: [],
      institutionalWarnings: [],
      fiduciaryDisclaimer: ""
    };

    const val: ValuationIntelligence = {
      valuationReadiness: valuationReadiness,
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

    const benchmark: BenchmarkIntelligence = {
      institutionalPosition: benchmarkPosition,
      governancePosition: "LEADING",
      executionPosition: "LEADING",
      valuationPosition: "LEADING",
      esgPosition: "LEADING",
      competitiveAdvantages: [{ category: "Execution", advantage: "Speed" }],
      institutionalGaps: [],
      benchmarkNarrative: "",
      benchmarkAttentionPoints: [],
      fiduciaryDisclaimer: ""
    };

    const sector: SectorIntelligence = {
      sectorRiskProfile: [],
      sectorOpportunityProfile: ["Market Expansion"],
      sectorStrategicSignals: [],
      requiredInstitutionalCapabilities: [],
      capabilityGaps: scenario === "FOUNDATIONAL" ? ["Tech"] : [],
      capabilityAdvantages: scenario === "SOVEREIGN" ? ["Network"] : [],
      sectorMaturitySignals: [],
      sectorExecutionRequirements: [],
      sectorGovernanceRequirements: [],
      fiduciaryDisclaimer: ""
    };

    const capital: CapitalAllocationIntelligence = {
      strategicInvestmentPriorities: [],
      capabilityInvestmentPriorities: [],
      governanceInvestmentPriorities: scenario === "FOUNDATIONAL" ? ["Gov Dev"] : [],
      executionAccelerationPriorities: [],
      valueProtectionPriorities: [],
      valueCreationPriorities: [],
      fiduciaryDisclaimer: ""
    };

    return {
      governanceDigitalTwin: twin,
      esgIntelligence: esg,
      valuationIntelligence: val,
      benchmarkIntelligence: benchmark,
      sectorIntelligence: sector,
      capitalAllocationIntelligence: capital
    };
  };

  test("should return undefined if input is undefined", () => {
    assert.strictEqual(buildExecutiveSovereigntyProfile(undefined), undefined);
  });

  test("should return undefined if input has no governance layers", () => {
    assert.strictEqual(buildExecutiveSovereigntyProfile({}), undefined);
  });

  test("should classify SOVEREIGN correctly", () => {
    const input = createMockInput("SOVEREIGN");
    const result = buildExecutiveSovereigntyProfile(input)!;
    assert.strictEqual(result.sovereigntyClassification, "SOVEREIGN");
  });

  test("should classify ADVANCED correctly", () => {
    const input = createMockInput("ADVANCED");
    const result = buildExecutiveSovereigntyProfile(input)!;
    assert.strictEqual(result.sovereigntyClassification, "ADVANCED");
  });

  test("should classify FOUNDATIONAL correctly", () => {
    const input = createMockInput("FOUNDATIONAL");
    const result = buildExecutiveSovereigntyProfile(input)!;
    assert.strictEqual(result.sovereigntyClassification, "FOUNDATIONAL");
  });

  test("should classify DEVELOPING correctly", () => {
    const input = createMockInput("DEVELOPING");
    const result = buildExecutiveSovereigntyProfile(input)!;
    assert.strictEqual(result.sovereigntyClassification, "DEVELOPING");
  });

  test("should extract strengths, constraints, opportunities and dependencies deterministically", () => {
    const input = createMockInput("FOUNDATIONAL");
    const result = buildExecutiveSovereigntyProfile(input)!;

    assert.ok(result.sovereigntyStrengths.includes("Speed"));
    assert.ok(result.sovereigntyConstraints.includes("Tech"));
    assert.ok(result.sovereigntyDependencies.includes("Gov Dev"));
    assert.ok(result.sovereigntyRisks.includes("Fraqueza estrutural de governança ESG impõe restrições severas à soberania"));
    assert.ok(result.sovereigntyOpportunities.includes("Market Expansion"));
  });

  test("should ensure scores, metrics, classifications, and all previous layers remain strictly identical", () => {
    const input = createMockInput("SOVEREIGN");

    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithCAIL = {
      ...baseline,
      ...input
    };

    const eslInput = mapReportToExecutiveSovereigntyInput(reportWithCAIL);
    const eslIntelligence = buildExecutiveSovereigntyProfile(eslInput);

    const reportWithESL = {
      ...reportWithCAIL,
      ...(eslIntelligence && { executiveSovereignty: eslIntelligence })
    };

    // Original basic non-interference
    assert.deepStrictEqual(reportWithESL.scores, baseline.scores);
    assert.deepStrictEqual(reportWithESL.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithESL.classifications, baseline.classifications);

    // Deep non-interference
    assert.deepStrictEqual(reportWithESL.governanceDigitalTwin, reportWithCAIL.governanceDigitalTwin);
    assert.deepStrictEqual(reportWithESL.esgIntelligence, reportWithCAIL.esgIntelligence);
    assert.deepStrictEqual(reportWithESL.valuationIntelligence, reportWithCAIL.valuationIntelligence);
    assert.deepStrictEqual(reportWithESL.benchmarkIntelligence, reportWithCAIL.benchmarkIntelligence);
    assert.deepStrictEqual(reportWithESL.sectorIntelligence, reportWithCAIL.sectorIntelligence);
    assert.deepStrictEqual(reportWithESL.capitalAllocationIntelligence, reportWithCAIL.capitalAllocationIntelligence);

    assert.ok(reportWithESL.executiveSovereignty);
    assert.strictEqual(
      reportWithESL.executiveSovereignty.fiduciaryDisclaimer,
      "Esta camada consolida as inteligências institucionais previamente produzidas para avaliar o grau de soberania executiva da organização, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias existentes."
    );
  });
});
