// src/core/runtime/decision-policy/DecisionPolicyEngine.ts
//
// Sovereign Decision Policy Engine

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { DecisionPolicyProfile, PolicyContext } from './policy-types';
import { SectorGovernanceProfileEngine } from './SectorGovernanceProfileEngine';
import { StrategicPostureEngine } from './StrategicPostureEngine';
import { SurvivabilityToleranceEngine } from './SurvivabilityToleranceEngine';
import { InstitutionalRiskAppetiteEngine } from './InstitutionalRiskAppetiteEngine';
import { InstitutionalMaterialityEngine } from './InstitutionalMaterialityEngine';

export class DecisionPolicyEngine {
  /**
   * Applies the contextual decision policy layer to an executive decision.
   * Runs BEFORE survivability scoring, compliance validation, and enforcement.
   */
  public static applyPolicy(
    decision: ExecutiveDecision,
    report: any
  ): PolicyContext {
    // 1. Resolve Profile Selection under the precedence rule:
    //    Explicit config > BusinessIdentity dynamic inference > BALANCED
    let activeProfile: DecisionPolicyProfile = 'BALANCED';

    const explicitProfile = report?.tenantConfig?.policyProfile || report?.policyProfile;
    
    if (explicitProfile) {
      activeProfile = explicitProfile as DecisionPolicyProfile;
    } else {
      const sectorAnalysis = SectorGovernanceProfileEngine.analyzeSector(report);
      const postureAnalysis = StrategicPostureEngine.analyzePosture(report);
      activeProfile = sectorAnalysis.suggestedProfile || postureAnalysis.suggestedProfile || 'BALANCED';
    }

    // 2. Load Appetites and Tolerances
    const riskAppetite = InstitutionalRiskAppetiteEngine.getBounds(activeProfile);
    const survivabilityTolerance = SurvivabilityToleranceEngine.getTolerances(activeProfile);
    const sectorInfo = SectorGovernanceProfileEngine.analyzeSector(report);

    // 3. Compute Materiality
    const materiality = InstitutionalMaterialityEngine.evaluateMateriality(decision, report);

    // 4. Resolve Flexibility Modifiers based on profile
    const allowLeverageExceptions = activeProfile === 'TURNAROUND' || activeProfile === 'HYPER_GROWTH';
    const degradeNonConstitutionalAlerts = !materiality.isMaterial || activeProfile === 'HYPER_GROWTH';
    const bypassMinorBlocks = !materiality.isMaterial;

    return {
      activeProfile,
      riskAppetite,
      materiality,
      survivabilityTolerance,
      flexibilityModifiers: {
        allowLeverageExceptions,
        degradeNonConstitutionalAlerts,
        bypassMinorBlocks
      },
      sectorGovernance: {
        isStrictLiquidityRequired: sectorInfo.isStrictLiquidityRequired,
        allowDistribution: sectorInfo.allowDistribution
      },
      timestamp: new Date().toISOString()
    };
  }
}
