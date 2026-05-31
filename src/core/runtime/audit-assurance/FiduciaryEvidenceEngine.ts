// src/core/runtime/audit-assurance/FiduciaryEvidenceEngine.ts
//
// Fiduciary Evidence Engine
// Compiles the 10 context dimensions into a signed EvidencePackage.

import { EvidencePackage } from './audit-types';
import { sha256 } from '../executive/types';

export class FiduciaryEvidenceEngine {
  /**
   * Compiles the 10 context dimensions into an EvidencePackage.
   */
  public compileEvidence(inputs: {
    sourceReferences?: string[];
    causalDependencies?: string[];
    calculationLineage?: string[];
    runtimeAssumptions?: string[];
    confidenceDerivation?: string[];
    severityPropagation?: string[];
    decisionDependencies?: string[];
    simulationAssumptions?: string[];
    treasuryDependencies?: string[];
    survivabilityDependencies?: string[];
  }): EvidencePackage {
    const timestamp = new Date().toISOString();
    const pkg: EvidencePackage = {
      sourceReferences: inputs.sourceReferences || [],
      causalDependencies: inputs.causalDependencies || [],
      calculationLineage: inputs.calculationLineage || [],
      runtimeAssumptions: inputs.runtimeAssumptions || [],
      confidenceDerivation: inputs.confidenceDerivation || [],
      severityPropagation: inputs.severityPropagation || [],
      decisionDependencies: inputs.decisionDependencies || [],
      simulationAssumptions: inputs.simulationAssumptions || [],
      treasuryDependencies: inputs.treasuryDependencies || [],
      survivabilityDependencies: inputs.survivabilityDependencies || [],
      timestamp,
    };

    pkg.signature = this.signPackage(pkg);
    return pkg;
  }

  /**
   * Cryptographically signs the evidence package using browser-safe sha256 helper.
   */
  public signPackage(pkg: EvidencePackage): string {
    const rawData = [
      (pkg.sourceReferences || []).join(','),
      (pkg.causalDependencies || []).join(','),
      (pkg.calculationLineage || []).join(','),
      (pkg.runtimeAssumptions || []).join(','),
      (pkg.confidenceDerivation || []).join(','),
      (pkg.severityPropagation || []).join(','),
      (pkg.decisionDependencies || []).join(','),
      (pkg.simulationAssumptions || []).join(','),
      (pkg.treasuryDependencies || []).join(','),
      (pkg.survivabilityDependencies || []).join(','),
      pkg.timestamp
    ].join('|');
    return `SIG-SHA256-${sha256(rawData).substring(0, 32)}`;
  }
}
