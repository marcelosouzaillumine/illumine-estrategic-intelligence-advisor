// src/core/runtime/constitutional-governance/ConstitutionalGovernanceEngine.ts
//
// Constitutional Governance Engine
// Resolves the final system-wide ConstitutionalIntegrityState based on evaluations of the underlying layers.

import { ConstitutionalIntegrityState } from './constitutional-types';

export class ConstitutionalGovernanceEngine {
  /**
   * Evaluates outcomes from other engine validations and resolves the system's final integrity state.
   * Priority hierarchy goes from CONSTITUTIONAL_FAIL_CLOSED down to CONSTITUTIONALLY_STABLE.
   */
  public resolveIntegrityState(params: {
    hasAxiomViolation: boolean;
    hasVetoTriggered: boolean;
    hasConflict: boolean;
    hasPolicyViolation: boolean;
    hasErosionDetected: boolean;
    isCompatible: boolean;
  }): ConstitutionalIntegrityState {
    // 1. Any axiom violation or policy veto trigger immediately forces fail-closed
    if (params.hasAxiomViolation || params.hasVetoTriggered) {
      return 'CONSTITUTIONAL_FAIL_CLOSED';
    }

    // 2. Core logical/structural conflicts force CONSTITUTIONAL_CONFLICT
    if (params.hasConflict) {
      return 'CONSTITUTIONAL_CONFLICT';
    }

    // 3. Active policy violations force POLICY_DRIFT
    if (params.hasPolicyViolation) {
      return 'POLICY_DRIFT';
    }

    // 4. Incompatibility or audit-detected erosion triggers DOCTRINE_WARNING
    if (!params.isCompatible || params.hasErosionDetected) {
      return 'DOCTRINE_WARNING';
    }

    // 5. Otherwise, the system is stable
    return 'CONSTITUTIONALLY_STABLE';
  }
}
