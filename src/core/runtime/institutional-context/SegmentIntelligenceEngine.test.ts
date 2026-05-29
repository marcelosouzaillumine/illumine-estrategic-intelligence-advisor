import { test, describe } from "node:test";
import assert from "node:assert";
import { SegmentIntelligenceEngine } from "./SegmentIntelligenceEngine";
import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";

describe("SegmentIntelligenceEngine", () => {
  const engine = new SegmentIntelligenceEngine();

  test("Unknown segment - should restrict strong diagnostics", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: ""
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.confidenceLevel, "RESTRICTED");
    assert.strictEqual(result.downstreamRuntimeRestrictions.allowStrongConclusions, false);
    
    const ruleFired = result.auditTrail.find(r => r.ruleName === "No Segment, No Strong Diagnosis");
    assert.ok(ruleFired);
  });

  test("Missing operating model - should trigger fail closed rule", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Indústria"
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.confidenceLevel, "RESTRICTED");
    assert.strictEqual(result.downstreamRuntimeRestrictions.allowStrongConclusions, false);
  });

  test("High liquidity but low historical density - asset light", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "SaaS",
      modeloOperacional: "Software as a Service",
      intensidadeCapital: "LIGHT"
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.assetIntensityProfile, "ASSET_LIGHT");
    assert.strictEqual(result.downstreamRuntimeRestrictions.allowPatrimonialScoring, false);
  });

  test("Inventory-heavy company with weak cash conversion risk", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Comércio",
      modeloOperacional: "Varejo",
      intensidadeEstoque: "HIGH"
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.workingCapitalCycleProfile, "MISMATCH_RISK");
    assert.strictEqual(result.downstreamRuntimeRestrictions.allowStaticLiquidityInterpretation, false);
  });

  test("Healthcare operation with delayed third-party repasses", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Hospital e Saúde",
      modeloOperacional: "Clínica Médica"
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.workingCapitalCycleProfile, "MISMATCH_RISK");
    assert.strictEqual(result.downstreamRuntimeRestrictions.allowStaticLiquidityInterpretation, false);
  });

  test("NGO with surplus but restricted funds", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "ONG Sustentabilidade",
      modeloOperacional: "Projetos Sociais"
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.downstreamRuntimeRestrictions.allowStandardProfitabilityMetrics, false);
    const rule = result.auditTrail.find(r => r.ruleName === "NGO Sustainability Isolation");
    assert.ok(rule);
  });

  test("Project-based consulting company with revenue concentration", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Consultoria",
      modeloOperacional: "Projetos"
    };
    const result = engine.resolveSegmentIntelligence(profile);
    assert.strictEqual(result.revenueModelSensitivity, "PROJECT_BASED");
    const rule = result.auditTrail.find(r => r.ruleName === "Project-Based Revenue Volatility");
    assert.ok(rule);
  });
});
