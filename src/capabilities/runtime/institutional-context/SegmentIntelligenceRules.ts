import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";
import { 
  SegmentIntelligenceProfile, 
  SegmentIntelligenceAuditEntry,
  DownstreamRuntimeRestrictions
} from "./SegmentIntelligenceTypes";

type RuleContext = {
  profile: InstitutionalBusinessProfile;
  result: Partial<SegmentIntelligenceProfile>;
  restrictions: DownstreamRuntimeRestrictions;
  auditTrail: SegmentIntelligenceAuditEntry[];
  constraints: string[];
  adjustments: string[];
};

export function applyNoSegmentNoDiagnosisRule(ctx: RuleContext) {
  const { profile, restrictions, auditTrail } = ctx;
  if (!profile.segmentoOperacional || !profile.modeloOperacional) {
    restrictions.allowStrongConclusions = false;
    restrictions.allowLongitudinalMaturityClaims = false;
    
    auditTrail.push({
      ruleName: "No Segment, No Strong Diagnosis",
      sourceFieldsUsed: ["segmentoOperacional", "modeloOperacional"],
      deterministicTrigger: "Missing segment or operating model",
      confidenceImpact: "RESTRICT",
      limitationCreated: "Cannot emit strong contextual diagnosis",
      downstreamImplication: "RESTRICT_STRONG_CONCLUSIONS"
    });
  }
}

export function applyCapitalCycleMismatchRule(ctx: RuleContext) {
  const { profile, restrictions, auditTrail, constraints } = ctx;
  const isInventoryHeavy = profile.intensidadeEstoque === "HIGH";
  const isLongCycle = profile.perfilCicloFinanceiro === "LONG";
  const isHealthcare = profile.segmentoOperacional?.toLowerCase().includes("hospital") || profile.segmentoOperacional?.toLowerCase().includes("saúde") || profile.segmentoOperacional?.toLowerCase().includes("clinica");
  
  if (isInventoryHeavy || isLongCycle || isHealthcare) {
    restrictions.allowStaticLiquidityInterpretation = false;
    
    ctx.result.workingCapitalCycleProfile = "MISMATCH_RISK";
    constraints.push("Static liquidity metrics (e.g. Current Ratio) are insufficient due to capital cycle mismatch risks.");

    auditTrail.push({
      ruleName: "Capital Cycle Mismatch",
      sourceFieldsUsed: ["intensidadeEstoque", "perfilCicloFinanceiro", "segmentoOperacional"],
      deterministicTrigger: `Inventory: ${isInventoryHeavy}, Cycle: ${isLongCycle}, Healthcare: ${isHealthcare}`,
      confidenceImpact: "RESTRICT",
      limitationCreated: "Prevented standard static liquidity checks",
      downstreamImplication: "PREVENT_STATIC_LIQUIDITY_INTERPRETATION"
    });
  }
}

export function applyNGORule(ctx: RuleContext) {
  const { profile, restrictions, auditTrail, constraints } = ctx;
  const isNGO = profile.segmentoOperacional?.toLowerCase().includes("ong") || 
                profile.segmentoOperacional?.toLowerCase().includes("sem fins lucrativos");
  
  if (isNGO) {
    restrictions.allowStandardProfitabilityMetrics = false;
    constraints.push("Profitability metrics must be translated to Institutional Sustainability metrics.");
    
    auditTrail.push({
      ruleName: "NGO Sustainability Isolation",
      sourceFieldsUsed: ["segmentoOperacional"],
      deterministicTrigger: "Identified NGO or non-profit segment",
      confidenceImpact: "NEUTRAL",
      limitationCreated: "Standard profitability analysis is disabled",
      downstreamImplication: "ISOLATE_SUSTAINABILITY_FROM_PROFITABILITY"
    });
  }
}

export function applyAssetIntensityRule(ctx: RuleContext) {
  const { profile, restrictions, auditTrail, adjustments } = ctx;
  if (profile.intensidadeCapital === "LIGHT") {
    ctx.result.assetIntensityProfile = "ASSET_LIGHT";
    restrictions.allowPatrimonialScoring = false; // Need special scoring
    adjustments.push("Use asset-light patrimonial expectations.");

    auditTrail.push({
      ruleName: "Asset-Light Patrimonial Adjustment",
      sourceFieldsUsed: ["intensidadeCapital"],
      deterministicTrigger: "Capital intensity explicitly set to LIGHT",
      confidenceImpact: "NEUTRAL",
      limitationCreated: "Standard asset-heavy patrimonial expectations disabled",
      downstreamImplication: "ADJUST_PATRIMONIAL_EXPECTATIONS"
    });
  } else if (profile.intensidadeCapital === "INTENSIVE") {
    ctx.result.assetIntensityProfile = "ASSET_HEAVY";
  }
}

export function applyRevenueModelRule(ctx: RuleContext) {
  const { profile, auditTrail, constraints } = ctx;
  const isProjectBased = profile.modeloOperacional?.toLowerCase().includes("projeto") || 
                         profile.segmentoOperacional?.toLowerCase().includes("consultoria");
  
  if (isProjectBased) {
    ctx.result.revenueModelSensitivity = "PROJECT_BASED";
    constraints.push("Revenue is project-based; expect high volatility and concentration risk.");
    
    auditTrail.push({
      ruleName: "Project-Based Revenue Volatility",
      sourceFieldsUsed: ["modeloOperacional", "segmentoOperacional"],
      deterministicTrigger: "Identified project-based operating model",
      confidenceImpact: "NEUTRAL",
      limitationCreated: "Expect revenue concentration",
      downstreamImplication: "REQUIRE_CONTEXTUAL_THRESHOLDS"
    });
  } else if (profile.modeloOperacional?.toLowerCase().includes("recorrente")) {
    ctx.result.revenueModelSensitivity = "RECURRING";
  }
}
