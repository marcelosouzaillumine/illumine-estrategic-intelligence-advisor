/**
 * Illumine OS™ Financial Governance Boundary
 * Financial Pipeline Orchestrator (CFDI v2.1)
 * 
 * Pipeline Version: 2.1.0
 * UNIFIED ENTRY POINT FOR THE FINANCIAL GOVERNANCE LAYER.
 * 
 * Flow:
 * Raw Firestore Docs ➔ CanonicalFinancialNormalizer
 * ➔ FinancialIntegrityValidator
 * ➔ CrossStatementValidator
 * ➔ FinancialDataQualityScoreEngine
 * ➔ FinancialHealthIndexEngine
 * ➔ FinancialCertificationEngine
 * ➔ FinancialCertificationLedger
 * ➔ FinancialDecisionTrustSignal & FinancialGovernanceContract
 */

import { 
  CanonicalFinancialEntry, 
  FinancialStatementType, 
  CertifiedFinancialDataset, 
  FinancialDecisionTrustSignal, 
  FinancialGovernanceContract,
  FinancialDecisionPermissionMatrixResolver
} from '../../../../../../packages/executive-contracts/src/financial/index';
import { CanonicalFinancialNormalizer } from '../../../../adapters/persistence/CanonicalFinancialNormalizer';
import { FinancialIntegrityValidator } from '../validation/FinancialIntegrityValidator';
import { CrossStatementValidator } from '../validation/CrossStatementValidator';
import { FinancialDataQualityScoreEngine } from '../quality/FinancialDataQualityScoreEngine';
import { FinancialHealthIndexEngine } from '../quality/FinancialHealthIndexEngine';
import { FinancialCertificationEngine } from '../certification/FinancialCertificationEngine';
import { FinancialCertificationLedger } from '../certification/FinancialCertificationLedger';
import { FinancialObservatory } from '../observability/FinancialObservatory';

export class FinancialPipelineOrchestrator {
  public static async processAndCertify(
    rawEntries: any[],
    allHistoryEntries: any[],
    targetClientId: string,
    targetStatementType: FinancialStatementType,
    targetYear: number,
    tenantId: string,
    actorId: string
  ): Promise<FinancialGovernanceContract> {
    // Step 1: Normalize Raw Docs to Canonical Entries via single authorized point
    const normalizedTargetEntries = CanonicalFinancialNormalizer.normalizeBatch(rawEntries, targetClientId, targetYear);
    const normalizedHistoryEntries = CanonicalFinancialNormalizer.normalizeBatch(allHistoryEntries, targetClientId, targetYear);

    // Filter to requested target statement type
    const isolatedEntries = Object.freeze(
      normalizedTargetEntries.filter(e => e.statementType === targetStatementType)
    );

    // Step 2: Validate Integrity (FIN-001..FIN-010)
    const integrityViolations = FinancialIntegrityValidator.validate(
      isolatedEntries,
      targetClientId,
      targetStatementType,
      targetYear
    );

    // Step 3: Cross-Statement Batimento
    const crossViolations = CrossStatementValidator.validateCrossStatements(
      [...normalizedTargetEntries, ...normalizedHistoryEntries],
      targetYear
    );

    const allViolations = Object.freeze([...integrityViolations, ...crossViolations]);

    // Step 4: Quality & Health Engines
    const qualityScore = FinancialDataQualityScoreEngine.calculate(isolatedEntries, allViolations);
    const healthIndex = FinancialHealthIndexEngine.calculate(isolatedEntries, qualityScore, allViolations);

    // Step 5: Certification Engine
    const certification = FinancialCertificationEngine.certify(isolatedEntries, qualityScore, allViolations);

    // Generate SHA-256 dataset hash fingerprint
    const datasetHash = this.computeSHA256Hash(isolatedEntries, targetClientId, targetYear, certification.certifiedAt);

    // Step 6: Assemble Fiduciary Certified Financial Dataset
    const dataset: CertifiedFinancialDataset = Object.freeze({
      id: `dataset-${targetClientId}-${targetStatementType}-${targetYear}`,
      clientId: targetClientId,
      datasetHash,
      statementTypes: Object.freeze([targetStatementType]),
      entries: isolatedEntries,
      certification,
      healthIndex,
      generatedAt: certification.certifiedAt,
      pipelineVersion: '2.1.0'
    });

    // Step 7: Record Audit Ledger Event & Telemetry
    await new FinancialCertificationLedger().certify(dataset.id, {}, tenantId, actorId);
    FinancialObservatory.trackDataset(dataset);

    // Step 8: Resolve Decision Permission Matrix
    const permissionMatrix = FinancialDecisionPermissionMatrixResolver.resolve(
      certification.status,
      healthIndex.index
    );

    const trustSignal: FinancialDecisionTrustSignal = Object.freeze({
      financialCertificationStatus: certification.status,
      financialHealthIndex: healthIndex.index,
      dataConfidence: certification.confidence,
      allowedDecisionLevel: permissionMatrix.allowedDecisionLevel,
      datasetHash
    });

    const governanceContract: FinancialGovernanceContract = Object.freeze({
      dataset,
      trustSignal,
      certificationStatus: certification.status,
      runtimePermission: permissionMatrix.runtimePermission
    });

    return governanceContract;
  }

  private static computeSHA256Hash(entries: ReadonlyArray<CanonicalFinancialEntry>, clientId: string, year: number, timestamp: string): string {
    const rawString = `${clientId}:${year}:${timestamp}:${entries.map(e => `${e.accountCode}:${e.amount}`).join('|')}`;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256-${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
}
