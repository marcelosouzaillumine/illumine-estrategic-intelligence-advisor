import { SegmentIntelligenceProfile } from "../../../runtime/institutional-context/SegmentIntelligenceTypes";
import { 
  BlockedConclusion, 
  AllowedConclusion, 
  ConclusionPermissionLevel,
  RequiredContextBeforeExecution
} from "./FinancialRuntimeContextTypes";

export function mapRestrictionsToGuards(profile: SegmentIntelligenceProfile) {
  const restrictions = profile.downstreamRuntimeRestrictions;
  const auditTrail = profile.auditTrail;
  
  const blockedConclusions: BlockedConclusion[] = [];
  const allowedConclusions: AllowedConclusion[] = [];
  const interpretationWarnings: string[] = [];
  const requiredDisclosures: string[] = [];

  const unmappedRestrictions = new Set(
    Object.entries(restrictions)
      .filter(([_, value]) => value === false)
      .map(([key, _]) => key)
  );

  // Mapping allowStrongConclusions
  if (!restrictions.allowStrongConclusions) {
    unmappedRestrictions.delete("allowStrongConclusions");
    
    const triggerAudit = auditTrail.find(a => a.downstreamImplication === "RESTRICT_STRONG_CONCLUSIONS");
    
    blockedConclusions.push({
      conclusionType: "STRONG_DIAGNOSIS",
      deterministicTrigger: triggerAudit?.deterministicTrigger || "Missing core institutional context",
      limitationCreated: triggerAudit?.limitationCreated || "Cannot emit strong diagnosis without segment and operating model",
      sourceRule: triggerAudit?.ruleName || "No Segment, No Strong Diagnosis"
    });
    
    allowedConclusions.push({
      conclusionType: "BASELINE_OBSERVATION",
      permissionLevel: "RESTRICTED",
      warning: "Observations are restricted due to low contextual confidence."
    });
  } else {
    allowedConclusions.push({
      conclusionType: "STRONG_DIAGNOSIS",
      permissionLevel: "FULL_ALLOWED"
    });
  }

  // Mapping allowStaticLiquidityInterpretation
  if (!restrictions.allowStaticLiquidityInterpretation) {
    unmappedRestrictions.delete("allowStaticLiquidityInterpretation");
    const triggerAudit = auditTrail.find(a => a.downstreamImplication === "PREVENT_STATIC_LIQUIDITY_INTERPRETATION");
    
    blockedConclusions.push({
      conclusionType: "STATIC_LIQUIDITY_ASSESSMENT",
      deterministicTrigger: triggerAudit?.deterministicTrigger || "Capital Cycle Mismatch Risk Detected",
      limitationCreated: triggerAudit?.limitationCreated || "Prevented standard static liquidity checks",
      sourceRule: triggerAudit?.ruleName || "Capital Cycle Mismatch"
    });
    
    allowedConclusions.push({
      conclusionType: "CONTEXTUAL_LIQUIDITY_ASSESSMENT",
      permissionLevel: "ALLOWED_WITH_DISCLOSURE",
      disclosureRequired: "Must consider structural capital cycle mismatches (e.g. inventory or repasses) when evaluating liquidity."
    });
    interpretationWarnings.push("Static liquidity metrics are unreliable for this profile.");
  } else {
    allowedConclusions.push({
      conclusionType: "STATIC_LIQUIDITY_ASSESSMENT",
      permissionLevel: "FULL_ALLOWED"
    });
  }

  // Mapping allowStandardProfitabilityMetrics
  if (!restrictions.allowStandardProfitabilityMetrics) {
    unmappedRestrictions.delete("allowStandardProfitabilityMetrics");
    const triggerAudit = auditTrail.find(a => a.downstreamImplication === "ISOLATE_SUSTAINABILITY_FROM_PROFITABILITY");
    
    blockedConclusions.push({
      conclusionType: "STANDARD_PROFITABILITY_SCORING",
      deterministicTrigger: triggerAudit?.deterministicTrigger || "Non-profit or NGO operation",
      limitationCreated: triggerAudit?.limitationCreated || "Standard profitability analysis is disabled",
      sourceRule: triggerAudit?.ruleName || "NGO Sustainability Isolation"
    });
    
    allowedConclusions.push({
      conclusionType: "INSTITUTIONAL_SUSTAINABILITY_SCORING",
      permissionLevel: "FULL_ALLOWED"
    });
    requiredDisclosures.push("Profitability terminology must be replaced with institutional sustainability parameters.");
  } else {
    allowedConclusions.push({
      conclusionType: "STANDARD_PROFITABILITY_SCORING",
      permissionLevel: "FULL_ALLOWED"
    });
  }

  // Mapping allowPatrimonialScoring
  if (!restrictions.allowPatrimonialScoring) {
    unmappedRestrictions.delete("allowPatrimonialScoring");
    const triggerAudit = auditTrail.find(a => a.downstreamImplication === "ADJUST_PATRIMONIAL_EXPECTATIONS");
    
    blockedConclusions.push({
      conclusionType: "ASSET_HEAVY_PATRIMONIAL_SCORING",
      deterministicTrigger: triggerAudit?.deterministicTrigger || "Asset-light operation",
      limitationCreated: triggerAudit?.limitationCreated || "Standard asset-heavy patrimonial expectations disabled",
      sourceRule: triggerAudit?.ruleName || "Asset-Light Patrimonial Adjustment"
    });
    
    allowedConclusions.push({
      conclusionType: "ASSET_LIGHT_PATRIMONIAL_SCORING",
      permissionLevel: "ALLOWED_WITH_DISCLOSURE",
      disclosureRequired: "Patrimonial score adjusted for Asset-Light expectations."
    });
  } else {
    allowedConclusions.push({
      conclusionType: "ASSET_HEAVY_PATRIMONIAL_SCORING",
      permissionLevel: "FULL_ALLOWED"
    });
  }

  // Mapping allowLongitudinalMaturityClaims
  if (!restrictions.allowLongitudinalMaturityClaims) {
    unmappedRestrictions.delete("allowLongitudinalMaturityClaims");
    blockedConclusions.push({
      conclusionType: "LONGITUDINAL_MATURITY_ASSESSMENT",
      deterministicTrigger: "Insufficient confidence or data",
      limitationCreated: "Cannot emit maturity claims without stable context",
      sourceRule: "Contextual Confidence Guard"
    });
  } else {
    allowedConclusions.push({
      conclusionType: "LONGITUDINAL_MATURITY_ASSESSMENT",
      permissionLevel: "FULL_ALLOWED"
    });
  }

  // Propagation Integrity Check
  let failClosedTriggered = false;
  if (unmappedRestrictions.size > 0) {
    failClosedTriggered = true;
    for (const lost of unmappedRestrictions) {
      blockedConclusions.push({
        conclusionType: "ALL_DOWNSTREAM_EVALUATION",
        deterministicTrigger: `Unmapped restriction: ${lost}`,
        limitationCreated: "A critical restriction was not mapped by the financial adapter, triggering fail-closed.",
        sourceRule: "Propagation Integrity Guard"
      });
      interpretationWarnings.push(`Fatal Error: Unmapped restriction ${lost}. Run aborted.`);
    }
    // Block everything if there is an unmapped restriction
    allowedConclusions.forEach(a => a.permissionLevel = "BLOCKED");
  }
  
  // If the profile confidence itself is restricted, fail closed on strong conclusions
  if (profile.confidenceLevel === "RESTRICTED") {
    failClosedTriggered = true;
  }

  const passedPropagationIntegrityCheck = (unmappedRestrictions.size === 0);

  const requiredContextBeforeExecution: RequiredContextBeforeExecution = {
    segmentValidated: profile.segmentClassification !== "UNKNOWN" && profile.segmentClassification !== "",
    operatingModelValidated: profile.operatingModelClassification !== "UNKNOWN" && profile.operatingModelClassification !== "",
    capitalCycleValidated: profile.workingCapitalCycleProfile !== "UNKNOWN",
    historicalDensityValidated: profile.confidenceMatrix.historicalDensityProxy > 0.5,
    restrictionsMapped: passedPropagationIntegrityCheck
  };

  return {
    blockedConclusions,
    allowedConclusions,
    interpretationWarnings,
    requiredDisclosures,
    passedPropagationIntegrityCheck,
    failClosedTriggered,
    requiredContextBeforeExecution
  };
}
