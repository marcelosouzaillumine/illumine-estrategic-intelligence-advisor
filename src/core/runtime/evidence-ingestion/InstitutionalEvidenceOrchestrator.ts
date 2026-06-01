import { InstitutionalEvidenceInput, InstitutionalEvidenceValidationOutput } from './InstitutionalEvidenceTypes';
import { InstitutionalEvidenceIngestionEngine } from './InstitutionalEvidenceIngestionEngine';
import { EvidenceDocumentClassificationEngine } from './EvidenceDocumentClassificationEngine';
import { FiduciaryEvidenceValidationEngine } from './FiduciaryEvidenceValidationEngine';
import { AccountingReconciliationEngine } from './AccountingReconciliationEngine';
import { EvidenceLineageAuditEngine } from './EvidenceLineageAuditEngine';

export class InstitutionalEvidenceOrchestrator {
  public static evaluate(input: InstitutionalEvidenceInput): InstitutionalEvidenceValidationOutput {
    const unresolvedIssues: string[] = [];
    const recommendations: string[] = [];
    const blockedReasons: string[] = [];

    // 1. Ingestion
    const ingestion = InstitutionalEvidenceIngestionEngine.validate(input);
    unresolvedIssues.push(...ingestion.issues);
    recommendations.push(...ingestion.recommendations);

    // 2. Classification
    const classification = EvidenceDocumentClassificationEngine.validate(input);
    unresolvedIssues.push(...classification.issues);
    recommendations.push(...classification.recommendations);

    // 3. Validation
    const validation = FiduciaryEvidenceValidationEngine.validate(input);
    unresolvedIssues.push(...validation.issues);
    recommendations.push(...validation.recommendations);

    // 4. Reconciliation
    const reconciliation = AccountingReconciliationEngine.validate(input);
    unresolvedIssues.push(...reconciliation.issues);

    // 5. Audit & Lineage
    const lineage = EvidenceLineageAuditEngine.validate(input);
    unresolvedIssues.push(...lineage.issues);

    // Evaluate Fail-Closed Evidence Protection
    let evidenceStatus: 'UNVALIDATED' | 'PARTIALLY_VALIDATED' | 'VALIDATED' | 'FIDUCIARY_TRUSTED' = 'FIDUCIARY_TRUSTED';
    let fiduciaryInterpretationBlocked = false;
    let confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';

    if (unresolvedIssues.some(i => i.startsWith('CRITICAL:'))) {
      fiduciaryInterpretationBlocked = true;
      evidenceStatus = 'UNVALIDATED';
      confidenceLevel = 'LOW';
      blockedReasons.push('Critical validation or reconciliation issues detected.');
    } else {
      if (reconciliation.reconciliationStatus === 'PARTIAL' || validation.temporalConsistencyStatus === 'PARTIAL') {
        evidenceStatus = 'PARTIALLY_VALIDATED';
        confidenceLevel = 'MODERATE';
      } else if (reconciliation.reconciliationStatus === 'RECONCILED' && validation.evidenceIntegrityStatus === 'VALIDATED') {
        evidenceStatus = 'VALIDATED';
        if (lineage.lineageValidationStatus === 'VALIDATED') {
          evidenceStatus = 'FIDUCIARY_TRUSTED';
        }
      }
    }

    // Edge case: Mocks in production
    const hasMocks = input.uploadedDocuments.some(d => d.isSyntheticMock);
    if (hasMocks && input.environmentConfiguration.environmentType === 'PRODUCTION') {
      fiduciaryInterpretationBlocked = true;
      evidenceStatus = 'UNVALIDATED';
      confidenceLevel = 'LOW';
      blockedReasons.push('Synthetic evidence detected in a PRODUCTION environment.');
    }

    if (fiduciaryInterpretationBlocked) {
       // Cap evidenceStatus if blocked
       if (evidenceStatus !== 'UNVALIDATED') {
          evidenceStatus = 'PARTIALLY_VALIDATED';
       }
    }

    let narrative = `Evidência classificada como ${evidenceStatus}.`;
    if (fiduciaryInterpretationBlocked) {
      narrative += ' Interpretação Fiduciária Bloqueada. Os motores analíticos do EFOS irão atuar com confiança degradada e em regime de fail-closed.';
    }

    return {
      evidenceStatus,
      fiduciaryInterpretationBlocked,
      evidenceIntegrityStatus: validation.evidenceIntegrityStatus,
      reconciliationStatus: reconciliation.reconciliationStatus,
      tenantIsolationStatus: ingestion.status,
      temporalConsistencyStatus: validation.temporalConsistencyStatus,
      lineageValidationStatus: lineage.lineageValidationStatus,
      duplicateEvidenceDetected: classification.duplicateEvidenceDetected,
      conflictingEvidenceDetected: classification.conflictingEvidenceDetected,
      unresolvedEvidenceIssues: unresolvedIssues,
      reconciliationWarnings: reconciliation.warnings,
      blockedInterpretationReasons: blockedReasons,
      evidenceRecommendations: recommendations,
      evidenceNarrative: narrative,
      uploadAuditTrail: lineage.auditTrail,
      lineageHash: lineage.lineageHash || 'UNHASHED',
      confidenceLevel
    };
  }
}
