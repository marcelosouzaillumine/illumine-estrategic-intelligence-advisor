// src/core/runtime/audit-assurance/AssuranceCertificationEngine.ts
//
// Assurance Certification Engine
// Computes auditability scores, checks veto overrides, and resolves final classifications and grades.

import { AssuranceClassification, FiduciaryAssuranceGrade } from './audit-types';

export interface CertificationScores {
  auditabilityScore: number;
  explainabilityScore: number;
  evidenceIntegrityScore: number;
  lineageReproducibilityScore: number;
  regulatoryReadinessScore: number;
}

export interface VetoTriggers {
  brokenLineage: boolean;
  orphanedDependency: boolean;
  nonReproducibleOutput: boolean;
  tamperedEvidenceSignature: boolean;
  missingEvidencePackage: boolean;
  failedReconstruction: boolean;
  activeFailClosedState: boolean;
}

export class AssuranceCertificationEngine {
  /**
   * Computes the final fiduciary grade and classification, enforcing non-bypassable veto rules.
   */
  public certify(
    scores: CertificationScores,
    vetoes: VetoTriggers,
    context: {
      allEvidenceDimensionsPresent: boolean;
      causalChainReconstructable: boolean;
      hasDisclosureIssues: boolean;
    }
  ): {
    classification: AssuranceClassification;
    grade: FiduciaryAssuranceGrade;
    overallScore: number;
    vetoTriggered: boolean;
    triggeredVetoes: string[];
  } {
    const triggeredVetoes: string[] = [];
    if (vetoes.brokenLineage) triggeredVetoes.push('broken lineage');
    if (vetoes.orphanedDependency) triggeredVetoes.push('orphaned dependency');
    if (vetoes.nonReproducibleOutput) triggeredVetoes.push('non-reproducible critical output');
    if (vetoes.tamperedEvidenceSignature) triggeredVetoes.push('tampered evidence signature');
    if (vetoes.missingEvidencePackage) triggeredVetoes.push('missing mandatory evidence package');
    if (vetoes.failedReconstruction) triggeredVetoes.push('failed reconstruction of severity or classification');
    if (vetoes.activeFailClosedState) triggeredVetoes.push('active fail-closed state from an upstream runtime');

    const vetoTriggered = triggeredVetoes.length > 0;

    // Calculate baseline weighted score
    const overallScore = Math.round(
      scores.auditabilityScore * 0.2 +
      scores.explainabilityScore * 0.2 +
      scores.evidenceIntegrityScore * 0.2 +
      scores.lineageReproducibilityScore * 0.2 +
      scores.regulatoryReadinessScore * 0.2
    );

    // If any veto triggers, force FAIL_CLOSED and grade F
    if (vetoTriggered) {
      return {
        classification: 'FAIL_CLOSED',
        grade: 'F',
        overallScore: Math.min(overallScore, 50),
        vetoTriggered: true,
        triggeredVetoes
      };
    }

    // Determine letter grade
    let grade: FiduciaryAssuranceGrade = 'F';
    if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 70) grade = 'C';
    else if (overallScore >= 60) grade = 'D';

    // AssuranceClassification may only be AUDIT_READY when:
    // * all required evidence dimensions are present;
    // * lineage is reproducible;
    // * causal chain is reconstructable;
    // * certification grade is A or B;
    // * no fail-closed or non-reproducible state exists.
    const meetsAuditReady =
      context.allEvidenceDimensionsPresent &&
      scores.lineageReproducibilityScore >= 80 &&
      context.causalChainReconstructable &&
      (grade === 'A' || grade === 'B') &&
      !vetoes.activeFailClosedState &&
      !vetoes.nonReproducibleOutput;

    let classification: AssuranceClassification;

    if (meetsAuditReady) {
      classification = 'AUDIT_READY';
    } else if (context.hasDisclosureIssues) {
      classification = 'DISCLOSURE_LIMITED';
    } else if (scores.lineageReproducibilityScore < 80) {
      classification = 'TRACEABILITY_RESTRICTED';
    } else {
      classification = 'ASSURANCE_DEGRADED';
    }

    return {
      classification,
      grade,
      overallScore,
      vetoTriggered: false,
      triggeredVetoes: []
    };
  }
}
