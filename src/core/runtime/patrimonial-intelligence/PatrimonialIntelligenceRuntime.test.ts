import { test, describe } from "node:test";
import assert from "node:assert";
import { PatrimonialIntelligenceRuntime, SimpleBPSummary } from "./PatrimonialIntelligenceRuntime";
import { FinancialRuntimeContextAdapter } from "../financial-context/FinancialRuntimeContextAdapter";
import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";

describe("PatrimonialIntelligenceRuntime", () => {
  const runtime = new PatrimonialIntelligenceRuntime();
  const contextAdapter = new FinancialRuntimeContextAdapter();

  const mockBP: SimpleBPSummary = {
    ativoTotal: 1000,
    ativoCirculante: 500,
    passivoTotal: 1000,
    passivoCirculante: 300,
    patrimonioLiquido: 700,
    estoques: 50,
    isBalanced: true
  };

  test("Missing FinancialRuntimeContext fails closed", () => {
    const output = runtime.evaluatePatrimonialStructure(undefined, mockBP);
    assert.strictEqual(output.confidenceLevel, "RESTRICTED");
    assert.strictEqual(output.bpDataIntegrityStatus, "MISSING");
    assert.strictEqual(output.patrimonialDiagnosis[0].code, "INSUFFICIENT_CONTEXT_FOR_STRONG_DIAGNOSIS");
  });

  test("Missing BP summary fails closed", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Indústria",
      modeloOperacional: "Manufatura"
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, undefined);
    assert.strictEqual(output.bpDataIntegrityStatus, "MISSING");
    assert.strictEqual(output.patrimonialDiagnosis[0].code, "INCONSISTENT_BP_DATA_PREVENTS_DIAGNOSIS");
  });

  test("BP inconsistency test (fails closed)", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Indústria",
      modeloOperacional: "Manufatura",
      intensidadeCapital: "MODERATE",
      intensidadeEstoque: "MODERATE",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "MODERATE_MARGIN",
    };
    const context = contextAdapter.createContext(profile);
    const badBP: SimpleBPSummary = { ...mockBP, isBalanced: false };
    const output = runtime.evaluatePatrimonialStructure(context, badBP);
    
    assert.strictEqual(output.bpDataIntegrityStatus, "INCONSISTENT");
    const block = output.blockedPatrimonialConclusions.find(c => c.conclusionType === "ALL_PATRIMONIAL_CONCLUSIONS");
    assert.ok(block);
  });

  test("Mature industrial company", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Indústria",
      modeloOperacional: "Manufatura",
      intensidadeCapital: "MODERATE",
      intensidadeEstoque: "MODERATE",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "MODERATE_MARGIN",
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, mockBP);
    
    assert.strictEqual(output.bpDataIntegrityStatus, "VALIDATED");
    const healthyDiag = output.patrimonialDiagnosis.find(d => d.code === "PATRIMONIAL_STRUCTURE_HEALTHY");
    assert.ok(healthyDiag);
  });

  test("Inventory-heavy company with apparent liquidity", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Varejo",
      modeloOperacional: "Comércio",
      intensidadeEstoque: "HIGH",
      intensidadeCapital: "MODERATE",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "MODERATE_MARGIN",
    };
    const context = contextAdapter.createContext(profile);
    const heavyBP: SimpleBPSummary = { ...mockBP, estoques: 200 }; // 40% of 500
    const output = runtime.evaluatePatrimonialStructure(context, heavyBP);
    
    const distortedDiag = output.patrimonialDiagnosis.find(d => d.code === "APPARENT_LIQUIDITY_DISTORTED_BY_INVENTORY");
    assert.ok(distortedDiag);
    assert.ok(output.legacyEngineMigrationNotes.includes("CURRENT_RATIO_STRONG_CONCLUSION_BLOCKED"));
  });

  test("Asset-light consulting company", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Consultoria",
      modeloOperacional: "Serviços",
      intensidadeCapital: "LIGHT",
      intensidadeEstoque: "LOW",
      perfilCicloFinanceiro: "SHORT",
      perfilMargem: "HIGH_MARGIN",
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, mockBP);
    
    const assetLightDiag = output.patrimonialDiagnosis.find(d => d.code === "ASSET_LIGHT_STRUCTURE_VALIDATED");
    assert.ok(assetLightDiag);
    assert.ok(output.legacyEngineMigrationNotes.includes("LOW_FIXED_ASSET_PENALTY_SUSPENDED_FOR_ASSET_LIGHT"));
  });

  test("Healthcare operation with long receivables", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Hospital e Saúde",
      modeloOperacional: "Clínica",
      perfilCicloFinanceiro: "LONG",
      intensidadeCapital: "MODERATE",
      intensidadeEstoque: "MODERATE",
      perfilMargem: "MODERATE_MARGIN",
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, mockBP);
    
    const diag = output.patrimonialDiagnosis.find(d => d.code === "HEALTHCARE_RECEIVABLES_REQUIRE_REPASSE_VALIDATION");
    assert.ok(diag);
  });

  test("NGO with restricted funds", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "ONG",
      modeloOperacional: "Educação",
      intensidadeCapital: "LIGHT",
      intensidadeEstoque: "LOW",
      perfilCicloFinanceiro: "MODERATE",
      perfilMargem: "LOW_MARGIN",
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, mockBP);
    
    const diag = output.patrimonialDiagnosis.find(d => d.code === "NGO_SUSTAINABILITY_REQUIRES_RESTRICTED_FUND_SEPARATION");
    assert.ok(diag);
    assert.ok(output.legacyEngineMigrationNotes.includes("GENERIC_PROFITABILITY_INTERPRETATION_BLOCKED_FOR_NGO"));
  });

  test("Unknown segment / incomplete profile fails downstream", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: ""
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, mockBP);
    
    assert.strictEqual(output.confidenceLevel, "RESTRICTED");
    const diag = output.patrimonialDiagnosis.find(d => d.code === "INSUFFICIENT_CONTEXT_FOR_STRONG_DIAGNOSIS");
    assert.ok(diag);
  });

  test("Early-stage company blocks maturity claims", () => {
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: "Tech",
      modeloOperacional: "SaaS",
      perfilCicloFinanceiro: "MODERATE"
      // Missing other fields = low historical density proxy
    };
    const context = contextAdapter.createContext(profile);
    const output = runtime.evaluatePatrimonialStructure(context, mockBP);
    
    const maturityBlock = output.blockedPatrimonialConclusions.find(c => c.conclusionType === "LONGITUDINAL_MATURITY_CLAIMS");
    assert.ok(maturityBlock);
  });
  
});
