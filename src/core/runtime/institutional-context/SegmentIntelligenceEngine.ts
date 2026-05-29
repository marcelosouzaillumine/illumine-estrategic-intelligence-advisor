import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";
import { 
  SegmentIntelligenceProfile, 
  DownstreamRuntimeRestrictions,
  SegmentIntelligenceAuditEntry
} from "./SegmentIntelligenceTypes";
import { calculateConfidenceMatrix } from "./ContextualConfidenceMatrix";
import { 
  applyNoSegmentNoDiagnosisRule,
  applyCapitalCycleMismatchRule,
  applyNGORule,
  applyAssetIntensityRule,
  applyRevenueModelRule
} from "./SegmentIntelligenceRules";

export class SegmentIntelligenceEngine {
  public resolveSegmentIntelligence(profile: InstitutionalBusinessProfile): SegmentIntelligenceProfile {
    const confidenceMatrix = calculateConfidenceMatrix(profile);
    
    const restrictions: DownstreamRuntimeRestrictions = {
      allowStrongConclusions: true,
      allowStaticLiquidityInterpretation: true,
      allowStandardProfitabilityMetrics: true,
      allowPatrimonialScoring: true,
      allowLongitudinalMaturityClaims: true
    };

    const auditTrail: SegmentIntelligenceAuditEntry[] = [];
    const financialInterpretationConstraints: string[] = [];
    const recommendedRuntimeAdjustments: string[] = [];

    const result: Partial<SegmentIntelligenceProfile> = {
      segmentClassification: profile.segmentoOperacional || "UNKNOWN",
      operatingModelClassification: profile.modeloOperacional || "UNKNOWN",
      assetIntensityProfile: "MODERATE", // defaults overridden by rules
      workingCapitalCycleProfile: "MODERATE",
      revenueModelSensitivity: "STANDARD",
      marginStructureProfile: profile.perfilMargem ? profile.perfilMargem : "UNKNOWN",
      governanceComplexityLevel: profile.criticidadeOperacional ? profile.criticidadeOperacional : "UNKNOWN",
      institutionalMaturityContext: "UNKNOWN"
    };

    const ctx = {
      profile,
      result,
      restrictions,
      auditTrail,
      constraints: financialInterpretationConstraints,
      adjustments: recommendedRuntimeAdjustments
    };

    // Apply deterministic rules
    applyNoSegmentNoDiagnosisRule(ctx);
    applyCapitalCycleMismatchRule(ctx);
    applyNGORule(ctx);
    applyAssetIntensityRule(ctx);
    applyRevenueModelRule(ctx);

    // Final overrides based on confidence
    if (confidenceMatrix.overallConfidence === "RESTRICTED") {
      restrictions.allowStrongConclusions = false;
      restrictions.allowLongitudinalMaturityClaims = false;
    }

    return {
      segmentClassification: result.segmentClassification as string,
      operatingModelClassification: result.operatingModelClassification as string,
      assetIntensityProfile: result.assetIntensityProfile as any,
      workingCapitalCycleProfile: result.workingCapitalCycleProfile as any,
      revenueModelSensitivity: result.revenueModelSensitivity as any,
      marginStructureProfile: result.marginStructureProfile as any,
      governanceComplexityLevel: result.governanceComplexityLevel as any,
      institutionalMaturityContext: result.institutionalMaturityContext as any,
      confidenceLevel: confidenceMatrix.overallConfidence,
      confidenceMatrix,
      downstreamRuntimeRestrictions: restrictions,
      financialInterpretationConstraints,
      recommendedRuntimeAdjustments,
      auditTrail
    };
  }
}
