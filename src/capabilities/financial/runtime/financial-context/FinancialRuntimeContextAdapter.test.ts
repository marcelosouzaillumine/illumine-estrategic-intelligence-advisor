import { test, describe } from "node:test";
import assert from "node:assert";
import { FinancialRuntimeContextAdapter } from "./FinancialRuntimeContextAdapter";
import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";
import { SegmentIntelligenceProfile } from "../institutional-context/SegmentIntelligenceTypes";
import * as guards from "./FinancialRuntimeContextGuards";

describe("FinancialRuntimeContextAdapter", () => {
  const adapter = new FinancialRuntimeContextAdapter();

  test("Mature industrial profile - all allowed", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Indústria",
      modeloOperacional: "Manufatura",
      intensidadeEstoque: "MODERATE",
      intensidadeCapital: "MODERATE",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "MODERATE_MARGIN",
    };
    const context = adapter.createContext(profile);
    assert.strictEqual(context.requiredContextBeforeExecution.restrictionsMapped, true);
    assert.strictEqual(context.runtimeGuards.failClosedTriggered, false);
    
    const strongDiagnosis = context.allowedConclusions.find(c => c.conclusionType === "STRONG_DIAGNOSIS");
    assert.strictEqual(strongDiagnosis?.permissionLevel, "FULL_ALLOWED");
  });

  test("Incomplete institutional profile - triggers fail closed", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: ""
    };
    const context = adapter.createContext(profile);
    assert.strictEqual(context.runtimeGuards.failClosedTriggered, true);
    assert.strictEqual(context.requiredContextBeforeExecution.segmentValidated, false);
    
    const blockedStrong = context.blockedConclusions.find(c => c.conclusionType === "STRONG_DIAGNOSIS");
    assert.ok(blockedStrong);
  });

  test("Hospital with long receivables", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Hospital e Saúde",
      modeloOperacional: "Clínica Médica",
      perfilCicloFinanceiro: "LONG",
      intensidadeCapital: "MODERATE",
      intensidadeEstoque: "MODERATE",
      perfilMargem: "MODERATE_MARGIN"
    };
    const context = adapter.createContext(profile);
    const blockedLiquidity = context.blockedConclusions.find(c => c.conclusionType === "STATIC_LIQUIDITY_ASSESSMENT");
    assert.ok(blockedLiquidity);
    const allowedContextualLiquidity = context.allowedConclusions.find(c => c.conclusionType === "CONTEXTUAL_LIQUIDITY_ASSESSMENT");
    assert.strictEqual(allowedContextualLiquidity?.permissionLevel, "ALLOWED_WITH_DISCLOSURE");
  });

  test("NGO with restricted funds", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "ONG Sustentabilidade",
      modeloOperacional: "Projetos Sociais",
      intensidadeCapital: "LIGHT",
      intensidadeEstoque: "LOW",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "LOW_MARGIN"
    };
    const context = adapter.createContext(profile);
    const blockedProfitability = context.blockedConclusions.find(c => c.conclusionType === "STANDARD_PROFITABILITY_SCORING");
    assert.ok(blockedProfitability);
    
    const allowedSustainability = context.allowedConclusions.find(c => c.conclusionType === "INSTITUTIONAL_SUSTAINABILITY_SCORING");
    assert.strictEqual(allowedSustainability?.permissionLevel, "FULL_ALLOWED");
  });

  test("Asset-light consulting company", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Consultoria",
      modeloOperacional: "Serviços B2B",
      intensidadeCapital: "LIGHT",
      intensidadeEstoque: "LOW",
      perfilCicloFinanceiro: "SHORT",
      perfilMargem: "HIGH_MARGIN"
    };
    const context = adapter.createContext(profile);
    const blockedPatrimonial = context.blockedConclusions.find(c => c.conclusionType === "ASSET_HEAVY_PATRIMONIAL_SCORING");
    assert.ok(blockedPatrimonial);
    
    const allowedPatrimonial = context.allowedConclusions.find(c => c.conclusionType === "ASSET_LIGHT_PATRIMONIAL_SCORING");
    assert.strictEqual(allowedPatrimonial?.permissionLevel, "ALLOWED_WITH_DISCLOSURE");
  });

  test("Inventory-heavy company with apparent liquidity", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Comércio Atacadista",
      modeloOperacional: "Distribuição",
      intensidadeCapital: "MODERATE",
      intensidadeEstoque: "HIGH",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "MODERATE_MARGIN"
    };
    const context = adapter.createContext(profile);
    const blockedLiquidity = context.blockedConclusions.find(c => c.conclusionType === "STATIC_LIQUIDITY_ASSESSMENT");
    assert.ok(blockedLiquidity);
  });

  test("Early-stage company with high cash but low historical density", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Tech Startup",
      modeloOperacional: "SaaS"
    };
    const context = adapter.createContext(profile);
    assert.strictEqual(context.requiredContextBeforeExecution.historicalDensityValidated, false);
    const blockedMaturity = context.blockedConclusions.find(c => c.conclusionType === "LONGITUDINAL_MATURITY_ASSESSMENT");
    assert.ok(blockedMaturity);
  });

  test("Unknown segment attempting strong diagnosis", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "",
      modeloOperacional: ""
    };
    const context = adapter.createContext(profile);
    const blockedStrong = context.blockedConclusions.find(c => c.conclusionType === "STRONG_DIAGNOSIS");
    assert.ok(blockedStrong);
  });

  test("Unmapped restriction failure (Silent restriction loss test)", () => {
    const fakeSegmentProfile = {
      downstreamRuntimeRestrictions: {
        allowStrongConclusions: true,
        allowStaticLiquidityInterpretation: true,
        allowStandardProfitabilityMetrics: true,
        allowPatrimonialScoring: true,
        allowLongitudinalMaturityClaims: true,
        allowFakeFeature: false 
      },
      auditTrail: [],
      confidenceLevel: "HIGH",
      confidenceMatrix: { historicalDensityProxy: 1.0 }
    } as any as SegmentIntelligenceProfile;

    const guardsResult = guards.mapRestrictionsToGuards(fakeSegmentProfile);
    
    assert.strictEqual(guardsResult.passedPropagationIntegrityCheck, false);
    assert.strictEqual(guardsResult.failClosedTriggered, true);
    
    const triggerBlock = guardsResult.blockedConclusions.find(c => c.deterministicTrigger.includes("allowFakeFeature"));
    assert.ok(triggerBlock);
  });
});
