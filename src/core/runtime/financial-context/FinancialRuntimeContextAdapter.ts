import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";
import { SegmentIntelligenceEngine } from "../institutional-context/SegmentIntelligenceEngine";
import { FinancialRuntimeContext } from "./FinancialRuntimeContextTypes";
import { mapRestrictionsToGuards } from "./FinancialRuntimeContextGuards";

export class FinancialRuntimeContextAdapter {
  private segmentEngine: SegmentIntelligenceEngine;

  constructor() {
    this.segmentEngine = new SegmentIntelligenceEngine();
  }

  public createContext(profile: InstitutionalBusinessProfile): FinancialRuntimeContext {
    // 1 & 2. Execute SegmentIntelligenceEngine
    const segmentProfile = this.segmentEngine.resolveSegmentIntelligence(profile);
    
    // 3, 4, 5. Apply downstreamRuntimeRestrictions and map to Guard objects
    const guards = mapRestrictionsToGuards(segmentProfile);

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
      }
    };
  }
}
