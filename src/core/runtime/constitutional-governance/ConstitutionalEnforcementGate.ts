// src/core/runtime/constitutional-governance/ConstitutionalEnforcementGate.ts
//
// Constitutional Enforcement Gate
// Hard boundary that intercepts runtime execution across critical domains and enforces blocks and restrictions.

import { ConstitutionalGovernanceMetadata } from './constitutional-types';
import { ConstitutionalRestrictionEngine } from './ConstitutionalRestrictionEngine';

export interface EnforcementGateResult {
  isBlocked: boolean;
  quarantineRequired: boolean;
  restrictedExport: boolean;
  confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'BLOCKED';
  recoveryNarrativeBlocked: boolean;
  optimisticNarrativeBlocked: boolean;
  scoreCeiling: number;
  restrictions: string[];
}

export class ConstitutionalEnforcementGate {
  /**
   * Checks the constitutional metadata and returns the enforcement flags for the specified target.
   */
  public static enforce(
    metadata: ConstitutionalGovernanceMetadata,
    target: 'Snapshot' | 'BoardPack' | 'StrategicIntelligence' | 'Narrative' | 'Export' | 'Scores' | 'Readiness' | 'Telemetry'
  ): EnforcementGateResult {
    const restrictionResult = ConstitutionalRestrictionEngine.translateRestrictions(metadata);

    // A violation is critical if any axiom is broken, fail-closed is active, lineage is missing, or forbidden override occurred.
    const isCriticalViolation =
      metadata.integrityState === 'AXIOM_VIOLATION' ||
      metadata.integrityState === 'CONSTITUTIONAL_FAIL_CLOSED' ||
      metadata.axiomViolations.length > 0 ||
      metadata.overrideAttempts.some(a => a.authorizationStatus === 'ATTEMPTED_FORBIDDEN') ||
      restrictionResult.isBlocked;

    const isQuarantined = restrictionResult.isQuarantined || isCriticalViolation;
    const isBlocked = restrictionResult.isBlocked || isCriticalViolation;

    const restrictions = restrictionResult.restrictions.map(r => r.description);

    // Mapped confidence
    let confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'BLOCKED' = 'HIGH_CONFIDENCE';
    if (restrictionResult.trajectoryConfidence === 'BLOCKED') {
      confidenceLevel = 'BLOCKED';
    } else if (restrictionResult.trajectoryConfidence === 'LOW') {
      confidenceLevel = 'LOW_CONFIDENCE';
    } else if (restrictionResult.trajectoryConfidence === 'MODERATE') {
      confidenceLevel = 'MEDIUM_CONFIDENCE';
    }

    return {
      isBlocked: isBlocked,
      quarantineRequired: isQuarantined,
      restrictedExport: isQuarantined,
      confidenceLevel,
      recoveryNarrativeBlocked: isQuarantined,
      optimisticNarrativeBlocked: isQuarantined,
      scoreCeiling: restrictionResult.scoreCeiling,
      restrictions
    };
  }
}
