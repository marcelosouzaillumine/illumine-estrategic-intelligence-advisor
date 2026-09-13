import { InstitutionalBusinessProfile } from "../../../runtime/institutional-identity/InstitutionalBusinessProfile";
import { SegmentIntelligenceEngine } from "../../../runtime/institutional-context/SegmentIntelligenceEngine";
import { FinancialRuntimeContext } from "./FinancialRuntimeContextTypes";
import { mapRestrictionsToGuards } from "./FinancialRuntimeContextGuards";
import { LifecycleContextBuilder } from "../../../../core/runtime/lifecycle";
import { LifecycleSemanticAuthority } from "../../../../core/runtime/lifecycle";

export class FinancialRuntimeContextAdapter {
  private segmentEngine: SegmentIntelligenceEngine;

  constructor() {
    this.segmentEngine = new SegmentIntelligenceEngine();
  }

  public createContext(
    profile: InstitutionalBusinessProfile,
    lifecycleParams?: {
      foundationYear?: number;
      analysisYear: number;
      historicalCycles: number;
      capitalSocial: number;
      revenue: number;
      netIncome: number;
    }
  ): FinancialRuntimeContext {
    // 1 & 2. Execute SegmentIntelligenceEngine
    const segmentProfile = this.segmentEngine.resolveSegmentIntelligence(profile);
    
    // 3, 4, 5. Apply downstreamRuntimeRestrictions and map to Guard objects
    const guards = mapRestrictionsToGuards(segmentProfile);

    // Build lifecycle context if params are provided
    let lifecycle;
    let lifecycleProfile;
    if (lifecycleParams) {
      lifecycle = LifecycleContextBuilder.build(lifecycleParams);
      lifecycleProfile = LifecycleSemanticAuthority.getSemanticProfile(lifecycle);
    }

    // 6. Return deterministic FinancialRuntimeContext
    return {
      institutionalBusinessProfile: profile,
      segmentIntelligenceProfile: segmentProfile,
      requiredContextBeforeExecution: guards.requiredContextBeforeExecution,
      allowedConclusions: guards.allowedConclusions,
      blockedConclusions: guards.blockedConclusions,
      interpretationWarnings: guards.interpretationWarnings,
      requiredDisclosures: guards.requiredDisclosures,
      contextualConfidence: segmentProfile.confidenceLevel,
      auditTrail: segmentProfile.auditTrail,
      runtimeGuards: {
        passedPropagationIntegrityCheck: guards.passedPropagationIntegrityCheck,
        failClosedTriggered: guards.failClosedTriggered
      },
      lifecycle,
      lifecycleProfile,
      runtimeAudit: {
        lifecycleProfilePresent: !!lifecycleProfile,
        lifecycleStage: lifecycleProfile?.lifecycleStage || 'N/A',
        semanticSource: lifecycleProfile ? 'ELSA' : 'LEGACY'
      }
    };
  }
}

