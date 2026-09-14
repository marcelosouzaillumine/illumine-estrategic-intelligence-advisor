// src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts
//
// Executive Publication Runtime
// Central orchestrator of the publication governance, certification, and release authorization gates.

import {
  PublicationMetadata,
  PublicationArtifactType,
  CertificationClassification,
  PublicationSeverity
} from './publication-types';
import { FiduciaryDisclosureValidationEngine } from './FiduciaryDisclosureValidationEngine';
import { ReportIntegrityEngine } from './ReportIntegrityEngine';
import { NarrativeConsistencyEngine } from './NarrativeConsistencyEngine';
import { ExportAuthorizationEngine } from './ExportAuthorizationEngine';
import { PublicationLineageEngine } from './PublicationLineageEngine';
import { InstitutionalDisclosureAuditEngine } from './InstitutionalDisclosureAuditEngine';
import { BoardPackGovernanceEngine } from './BoardPackGovernanceEngine';
import { InstitutionalCertificationEngine } from './InstitutionalCertificationEngine';
import { PublicationGovernanceEngine } from './PublicationGovernanceEngine';

export class ExecutivePublicationRuntime {
  /**
   * Evaluates, validates, and certifies an institutional publication artifact under fiduciary publication rules.
   */
  public static evaluatePublication(
    artifactId: string,
    artifactType: PublicationArtifactType,
    report: any,
    validationResult: any,
    advisoryNarrative: any,
    isInternalView: boolean = false,
    correlationId: string = 'pub_session'
  ): PublicationMetadata {
    const timestamp = new Date().toISOString();
    const warnings: string[] = [];

    // 1. Gather all narrative text to scan for disclosures
    const narrativeTexts: string[] = [];
    if (advisoryNarrative?.sections) {
      Object.values(advisoryNarrative.sections).forEach((sec: any) => {
        if (typeof sec === 'string') {
          narrativeTexts.push(sec);
        }
      });
    }

    // 2. Validate mandatory disclosures
    const disclosureResult = FiduciaryDisclosureValidationEngine.validate(narrativeTexts);
    const hasMissingDisclosures = !disclosureResult.isValid;

    // 3. Validate report integrity (lineage and cross-runtime conflicts)
    const integrityResult = ReportIntegrityEngine.validateIntegrity(report, validationResult);
    
    // 4. Validate narrative consistency
    const consistencyResult = NarrativeConsistencyEngine.validateNarrativeCoherence(report, validationResult, advisoryNarrative);

    // 5. Board pack governance validation
    const boardPackResult = BoardPackGovernanceEngine.validateBoardPack(report, artifactType);

    // 6. Consolidate flags for classification and severity routing
    const isLineageBroken = integrityResult.errors.some(e => e.includes('Lineage quebrado') || e.includes('assinatura fiduciária'));
    const isFailClosed = validationResult?.violations?.some((v: string) => v.toLowerCase().includes('fail-closed')) || false;
    const hasContradictions = !consistencyResult.isValid;
    const isRestrictedView = (validationResult?.survivabilityScores?.composite ?? 70) < 50;

    const { classification, severity } = PublicationGovernanceEngine.resolveClassificationAndSeverity(
      isLineageBroken,
      isFailClosed,
      hasContradictions,
      hasMissingDisclosures,
      isRestrictedView
    );

    // 7. Calculate individual compliance scores (0-100 scale)
    const lineageScore = isLineageBroken ? 0 : 100;
    const integrityScore = Math.max(0, 100 - integrityResult.errors.length * 25);
    const consistencyScore = Math.max(0, 100 - (consistencyResult.contradictions.length * 25 + boardPackResult.errors.length * 20));
    
    const { disclosureScore } = InstitutionalDisclosureAuditEngine.auditDisclosures(
      disclosureResult.missingDisclosures
    );

    const hasErrors = integrityResult.errors.length > 0 || consistencyResult.contradictions.length > 0 || boardPackResult.errors.length > 0 || isLineageBroken;

    // Calculate final certification grade and overall compliance score
    const { grade, complianceScore } = InstitutionalCertificationEngine.calculateCertification(
      integrityScore,
      consistencyScore,
      lineageScore,
      disclosureScore,
      hasErrors
    );

    // 8. Assess export authorization (rigidly separates internal views from formal publication)
    const exportResult = ExportAuthorizationEngine.checkExportAuthorization(
      classification,
      artifactType,
      hasContradictions,
      hasMissingDisclosures,
      isInternalView
    );

    // 9. Propagate lineage and generate secure publication signature
    const signatureResult = PublicationLineageEngine.generateExportSignature(report, validationResult, correlationId);

    // 10. Compile warnings and errors
    integrityResult.errors.forEach(e => warnings.push(e));
    consistencyResult.contradictions.forEach(c => warnings.push(c));
    boardPackResult.errors.forEach(b => warnings.push(b));

    if (hasMissingDisclosures) {
      warnings.push(`DISCLOSURE AVISO: Faltam divulgações mandatórias fiduciárias: ${disclosureResult.missingDisclosures.join(', ')}.`);
    }

    return {
      artifactId,
      artifactType,
      certification: classification,
      severity,
      integrityScore,
      consistencyScore,
      complianceScore,
      lineageScore,
      disclosureScore,
      certificationGrade: grade,
      missingDisclosures: disclosureResult.missingDisclosures,
      warnings,
      isExportable: exportResult.isAuthorized,
      exportSignature: signatureResult.exportSignature,
      lineageHash: signatureResult.lineageHash,
      timestamp
    };
  }
}
