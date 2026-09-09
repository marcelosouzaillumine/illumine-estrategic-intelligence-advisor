import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildCapitalAllocationIntelligence } from "../src/lib/capital-allocation-intelligence-engine";
import { CapitalAllocationIntelligenceInput } from "../src/lib/capital-allocation-intelligence-types";
import { mapReportToCapitalAllocationIntelligenceInput } from "../src/lib/capital-allocation-intelligence-mapper";

import { SectorIntelligence } from "../src/lib/sector-intelligence-types";
import { BenchmarkIntelligence } from "../src/lib/benchmark-intelligence-types";
import { ValuationIntelligence } from "../src/lib/valuation-intelligence-types";
import { ESGIntelligence } from "../src/lib/esg-intelligence-types";
import { GovernanceDigitalTwin } from "../src/lib/governance-digital-twin-types";

describe("Capital Allocation Governance Layer v3.0", () => {
  const createMockInput = (
    deficiencies: boolean
  ): CapitalAllocationIntelligenceInput => {
    const sector: SectorIntelligence = {
      sectorRiskProfile: [],
      sectorOpportunityProfile: [],
      sectorStrategicSignals: [],
      requiredInstitutionalCapabilities: [],
      capabilityGaps: deficiencies ? ["Execução Estratégica"] : [],
      capabilityAdvantages: [],
      sectorMaturitySignals: [],
      sectorExecutionRequirements: [],
      sectorGovernanceRequirements: [],
      fiduciaryDisclaimer: ""
    };

    const benchmark: BenchmarkIntelligence = {
      institutionalPosition: "LEADING",
      governancePosition: "LEADING",
      executionPosition: deficiencies ? "EARLY" : "LEADING",
      valuationPosition: "LEADING",
      esgPosition: "LEADING",
      competitiveAdvantages: [],
      institutionalGaps: [],
      benchmarkNarrative: "",
      benchmarkAttentionPoints: [],
      fiduciaryDisclaimer: ""
    };

    const valuation: ValuationIntelligence = {
      valuationReadiness: deficiencies ? "LOW" : "HIGH",
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

    const esg: ESGIntelligence = {
      environmental: { score: 0, classification: "HIGH", strengths: [], opportunities: [] },
      social: { score: 0, classification: "HIGH", strengths: [], opportunities: [] },
      governance: { score: 0, classification: deficiencies ? "LOW" : "HIGH", strengths: [], opportunities: [] },
      overallScore: 90,
      institutionalHighlights: [],
      institutionalWarnings: [],
      fiduciaryDisclaimer: ""
    };

    const twin: GovernanceDigitalTwin = {
      currentTrajectory: { scenario: "", description: "" },
      executionTrajectory: { scenario: "", description: "" },
      riskTrajectory: { scenario: "", description: "" },
      governanceTrajectory: { scenario: "", description: "" },
      executionCapacity: { executionRatio: 1.0, classification: deficiencies ? "LOW" : "HIGH" },
      institutionalWarnings: [],
      institutionalOpportunities: [],
      fiduciaryDisclaimer: ""
    };

    return {
      sectorIntelligence: sector,
      benchmarkIntelligence: benchmark,
      valuationIntelligence: valuation,
      esgIntelligence: esg,
      governanceDigitalTwin: twin,
    };
  };

  test("should return undefined if input is undefined", () => {
    assert.strictEqual(buildCapitalAllocationIntelligence(undefined), undefined);
  });

  test("should return undefined if input has no evidence", () => {
    assert.strictEqual(buildCapitalAllocationIntelligence({}), undefined);
  });

  test("should generate correct priorities for deficiencies", () => {
    const input = createMockInput(true);
    const result = buildCapitalAllocationIntelligence(input)!;
    
    assert.ok(result.capabilityInvestmentPriorities.includes("Execução Estratégica"));
    assert.ok(result.executionAccelerationPriorities.includes("Fortalecimento da capacidade de execução institucional"));
    assert.ok(result.governanceInvestmentPriorities.includes("Desenvolvimento de maturidade operacional"));
    assert.ok(result.valueCreationPriorities.includes("Fortalecimento da narrativa institucional de criação de valor"));
    assert.ok(result.valueProtectionPriorities.includes("Reforço dos mecanismos de governança"));
  });

  test("should generate empty priorities for healthy architecture", () => {
    const input = createMockInput(false);
    const result = buildCapitalAllocationIntelligence(input)!;
    
    assert.strictEqual(result.capabilityInvestmentPriorities.length, 0);
    assert.strictEqual(result.executionAccelerationPriorities.length, 0);
    assert.strictEqual(result.governanceInvestmentPriorities.length, 0);
    assert.strictEqual(result.valueCreationPriorities.length, 0);
    assert.strictEqual(result.valueProtectionPriorities.length, 0);
  });

  test("should ensure scores, metrics, classifications, and all previous layers remain strictly identical", () => {
    const input = createMockInput(true);

    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithSIL = {
      ...baseline,
      ...input
    };

    const cailInput = mapReportToCapitalAllocationIntelligenceInput(reportWithSIL);
    const cailIntelligence = buildCapitalAllocationIntelligence(cailInput);

    const reportWithCAIL = {
      ...reportWithSIL,
      ...(cailIntelligence && { capitalAllocationIntelligence: cailIntelligence })
    };

    // Original basic non-interference
    assert.deepStrictEqual(reportWithCAIL.scores, baseline.scores);
    assert.deepStrictEqual(reportWithCAIL.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithCAIL.classifications, baseline.classifications);

    // Deep non-interference
    assert.deepStrictEqual(reportWithCAIL.esgIntelligence, reportWithSIL.esgIntelligence);
    assert.deepStrictEqual(reportWithCAIL.valuationIntelligence, reportWithSIL.valuationIntelligence);
    assert.deepStrictEqual(reportWithCAIL.benchmarkIntelligence, reportWithSIL.benchmarkIntelligence);
    assert.deepStrictEqual(reportWithCAIL.governanceDigitalTwin, reportWithSIL.governanceDigitalTwin);
    assert.deepStrictEqual(reportWithCAIL.sectorIntelligence, reportWithSIL.sectorIntelligence);

    assert.ok(reportWithCAIL.capitalAllocationIntelligence);
    assert.strictEqual(
      reportWithCAIL.capitalAllocationIntelligence.fiduciaryDisclaimer,
      "Esta camada identifica prioridades institucionais de alocação de capital a partir das inteligências previamente produzidas, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias existentes."
    );
  });
});
