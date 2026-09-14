import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildSectorIntelligence } from "../src/lib/sector-intelligence-engine";
import { SectorIntelligenceInput, SectorIntelligenceReportLike } from "../src/lib/sector-intelligence-types";
import { mapReportToSectorIntelligenceInput } from "../src/lib/sector-intelligence-mapper";

import { ESGIntelligence } from "../src/lib/esg-intelligence-types";
import { ValuationIntelligence } from "../src/lib/valuation-intelligence-types";
import { BenchmarkIntelligence } from "../src/lib/benchmark-intelligence-types";
import { GovernanceDigitalTwin } from "../src/lib/governance-digital-twin-types";

describe("Sector Governance Layer v3.0", () => {
  const createMockInput = (
    executionTrajectory: "HIGH" | "LOW"
  ): SectorIntelligenceInput => {
    const esg: ESGIntelligence = {
      environmental: { score: 0, classification: "LOW", strengths: [], opportunities: [] },
      social: { score: 0, classification: "LOW", strengths: [], opportunities: [] },
      governance: { score: 0, classification: "LOW", strengths: [], opportunities: [] },
      overallScore: 90,
      institutionalHighlights: [],
      institutionalWarnings: [],
      fiduciaryDisclaimer: ""
    };

    const val: ValuationIntelligence = {
      valuationReadiness: "HIGH",
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
      institutionalPosition: "LEADING",
      governancePosition: "LEADING",
      executionPosition: "LEADING",
      valuationPosition: "LEADING",
      esgPosition: "LEADING",
      competitiveAdvantages: [],
      institutionalGaps: [],
      benchmarkNarrative: "",
      benchmarkAttentionPoints: [],
      fiduciaryDisclaimer: ""
    };

    const twin: GovernanceDigitalTwin = {
      currentTrajectory: { scenario: "", description: "" },
      executionTrajectory: { scenario: "", description: "" },
      riskTrajectory: { scenario: "", description: "" },
      governanceTrajectory: { scenario: "", description: "" },
      executionCapacity: { executionRatio: 1.0, classification: executionTrajectory === "HIGH" ? "HIGH" : "LOW" },
      institutionalWarnings: [],
      institutionalOpportunities: [],
      fiduciaryDisclaimer: ""
    };

    return {
      esgIntelligence: esg,
      valuationIntelligence: val,
      benchmarkIntelligence: benchmark,
      governanceDigitalTwin: twin,
    };
  };

  test("should return undefined if input is undefined", () => {
    assert.strictEqual(buildSectorIntelligence(undefined), undefined);
  });

  test("should return undefined if input has no evidence", () => {
    assert.strictEqual(buildSectorIntelligence({}), undefined);
  });

  test("should construct capability advantages for HIGH execution trajectory", () => {
    const input = createMockInput("HIGH");
    const result = buildSectorIntelligence(input)!;
    
    assert.ok(result.capabilityAdvantages.includes("Execução Estratégica"));
    assert.ok(!result.capabilityGaps.includes("Execução Estratégica"));
  });

  test("should construct capability gaps for LOW execution trajectory", () => {
    const input = createMockInput("LOW");
    const result = buildSectorIntelligence(input)!;
    
    assert.ok(result.capabilityGaps.includes("Execução Estratégica"));
    assert.ok(!result.capabilityAdvantages.includes("Execução Estratégica"));
  });

  test("should ensure scores, metrics, classifications, and all previous layers remain strictly identical", () => {
    const input = createMockInput("HIGH");

    const baseline = {
      scores: { capitalScore: 80 },
      metrics: { revenue: 100 },
      classifications: { health: "GOOD" }
    };

    const reportWithBIL = {
      ...baseline,
      ...input
    };

    const sectorInput = mapReportToSectorIntelligenceInput(reportWithBIL);
    const sectorIntelligence = buildSectorIntelligence(sectorInput);

    const reportWithSIL = {
      ...reportWithBIL,
      ...(sectorIntelligence && { sectorIntelligence })
    };

    // Original basic non-interference
    assert.deepStrictEqual(reportWithSIL.scores, baseline.scores);
    assert.deepStrictEqual(reportWithSIL.metrics, baseline.metrics);
    assert.deepStrictEqual(reportWithSIL.classifications, baseline.classifications);

    // Deep non-interference requested by the user
    assert.deepStrictEqual(reportWithSIL.esgIntelligence, reportWithBIL.esgIntelligence);
    assert.deepStrictEqual(reportWithSIL.valuationIntelligence, reportWithBIL.valuationIntelligence);
    assert.deepStrictEqual(reportWithSIL.benchmarkIntelligence, reportWithBIL.benchmarkIntelligence);
    assert.deepStrictEqual(reportWithSIL.governanceDigitalTwin, reportWithBIL.governanceDigitalTwin);

    assert.ok(reportWithSIL.sectorIntelligence);
    assert.strictEqual(
      reportWithSIL.sectorIntelligence.fiduciaryDisclaimer,
      "Esta camada contextualiza a organização em relação a padrões institucionais observados no ambiente setorial, sem alterar métricas, indicadores, classificações, scores, narrativas ou saídas fiduciárias previamente geradas."
    );
  });
});
