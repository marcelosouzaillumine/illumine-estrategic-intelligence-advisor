// src/core/runtime/audit-assurance/RegulatoryAssuranceEngine.ts
//
// Regulatory Assurance Engine
// Validates audit completeness, disclosure adequacy, and compliance readiness for inspections.

import { EvidencePackage, AuditTrailEntry } from './audit-types';

export class RegulatoryAssuranceEngine {
  /**
   * Verifies if all 10 context dimensions are populated within the evidence package.
   */
  public validateCompleteness(pkg: EvidencePackage): { complete: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    const dimensions: Array<keyof EvidencePackage> = [
      'sourceReferences',
      'causalDependencies',
      'calculationLineage',
      'runtimeAssumptions',
      'confidenceDerivation',
      'severityPropagation',
      'decisionDependencies',
      'simulationAssumptions',
      'treasuryDependencies',
      'survivabilityDependencies'
    ];

    for (const dim of dimensions) {
      const fieldVal = pkg[dim];
      if (!fieldVal || (Array.isArray(fieldVal) && fieldVal.length === 0)) {
        missingFields.push(String(dim));
      }
    }

    return {
      complete: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Asserts whether all required statutory disclosures are satisfied by the publication context.
   */
  public validateDisclosureAdequacy(
    availableDisclosures: string[],
    mandatoryDisclosures: string[]
  ): { adequate: boolean; missing: string[] } {
    const missing = mandatoryDisclosures.filter(
      mand => !availableDisclosures.some(av => av.toLowerCase().includes(mand.toLowerCase()))
    );

    return {
      adequate: missing.length === 0,
      missing
    };
  }

  /**
   * Evaluates the percentage of trace steps that propagate a valid lineage hash.
   */
  public checkTraceabilityCoverage(trail: AuditTrailEntry[]): number {
    if (!trail || trail.length === 0) return 0;
    const trackedSteps = trail.filter(
      entry => entry.lineageHashes && entry.lineageHashes.length > 0
    ).length;

    return Math.round((trackedSteps / trail.length) * 100);
  }
}
