// src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts
//
// Executive Assurance Runtime
// Central orchestrator coordinates all 10 sub-engines to audit, trace, verify, and certify runtime transactions.

import {
  AssuranceMetadata,
  EvidencePackage,
  AuditTrailEntry
} from './audit-types';
import { FiduciaryEvidenceEngine } from './FiduciaryEvidenceEngine';
import { RuntimeExplainabilityEngine, ExplainabilityContext } from './RuntimeExplainabilityEngine';
import { AuditTrailEngine } from './AuditTrailEngine';
import { CausalChainEngine, CausalVector } from './CausalChainEngine';
import { RegulatoryAssuranceEngine } from './RegulatoryAssuranceEngine';
import { EvidenceIntegrityEngine } from './EvidenceIntegrityEngine';
import { InstitutionalForensicsEngine } from './InstitutionalForensicsEngine';
import { AuditReconstructionEngine } from './AuditReconstructionEngine';
import { AssuranceCertificationEngine, CertificationScores, VetoTriggers } from './AssuranceCertificationEngine';
import { InstitutionalAuditEngine } from './InstitutionalAuditEngine';
import { sha256 } from '../executive/types';

export class ExecutiveAssuranceRuntime {
  private evidenceEngine = new FiduciaryEvidenceEngine();
  private explainabilityEngine = new RuntimeExplainabilityEngine();
  private auditTrailEngine = new AuditTrailEngine();
  private causalChainEngine = new CausalChainEngine();
  private regulatoryAssuranceEngine = new RegulatoryAssuranceEngine();
  private evidenceIntegrityEngine = new EvidenceIntegrityEngine();
  private forensicsEngine = new InstitutionalForensicsEngine();
  private reconstructionEngine = new AuditReconstructionEngine();
  private certificationEngine = new AssuranceCertificationEngine();
  private auditEngine = new InstitutionalAuditEngine();

  // Accessors for sub-engines to enable granular testing and forensic audits
  public getEvidenceEngine() { return this.evidenceEngine; }
  public getExplainabilityEngine() { return this.explainabilityEngine; }
  public getAuditTrailEngine() { return this.auditTrailEngine; }
  public getCausalChainEngine() { return this.causalChainEngine; }
  public getRegulatoryAssuranceEngine() { return this.regulatoryAssuranceEngine; }
  public getEvidenceIntegrityEngine() { return this.evidenceIntegrityEngine; }
  public getForensicsEngine() { return this.forensicsEngine; }
  public getReconstructionEngine() { return this.reconstructionEngine; }
  public getCertificationEngine() { return this.certificationEngine; }
  public getAuditEngine() { return this.auditEngine; }

  /**
   * Evaluates any runtime execution or output, running completeness, signature, lineage,
   * causal chain, and dry-run reconstruction checks, and yields a certified AssuranceMetadata package.
   */
  public evaluateExecution(inputs: {
    correlationId?: string;
    evidenceInputs: Parameters<FiduciaryEvidenceEngine['compileEvidence']>[0];
    explainabilityInputs: ExplainabilityContext;
    causalVectors: CausalVector[];
    trailEntries: Omit<AuditTrailEntry, 'timestamp'>[];
    scores?: Partial<CertificationScores>;
    reconstructionPayload?: {
      original: any;
      reconstructed: any;
    };
    mandatoryDisclosures?: string[];
    availableDisclosures?: string[];
  }): AssuranceMetadata {
    const correlationId = inputs.correlationId || `corr-${Math.random().toString(36).substring(2, 10)}`;
    const auditId = `aud-${sha256(correlationId).substring(0, 12)}`;
    const timestamp = new Date().toISOString();

    // 1. Compile Evidence Package
    const evidencePackage = this.evidenceEngine.compileEvidence(inputs.evidenceInputs);

    // 2. Set Up and Verify Audit Trail Chronology
    this.auditTrailEngine.clear();
    for (const ent of inputs.trailEntries) {
      this.auditTrailEngine.logEntry(ent);
    }
    const auditTrail = this.auditTrailEngine.getTrail();
    const chronologyValid = this.auditTrailEngine.verifyChronology(auditTrail);

    // 3. Trace Causal Chains
    const causalChainTrace = this.causalChainEngine.traceCausalChain(inputs.causalVectors);
    const hasCyclic = this.causalChainEngine.hasCyclicDependency(inputs.causalVectors);
    const causalChainReconstructable = !hasCyclic && inputs.causalVectors.length > 0;

    // 4. Generate Portuguese Explainability Narratives
    const explainabilityNarrative = this.explainabilityEngine.explainState(inputs.explainabilityInputs);

    // 5. Verify Regulatory Sufficiency & Completeness
    const completenessResult = this.regulatoryAssuranceEngine.validateCompleteness(evidencePackage);
    const disclosureResult = this.regulatoryAssuranceEngine.validateDisclosureAdequacy(
      inputs.availableDisclosures || [],
      inputs.mandatoryDisclosures || []
    );

    // 6. Verify Evidence Integrity
    const isSignatureValid = this.evidenceIntegrityEngine.validateSignature(evidencePackage);
    const isLineageChainValid = this.evidenceIntegrityEngine.validateLineageChain(auditTrail);
    const orphanResult = this.evidenceIntegrityEngine.detectOrphanedDependencies(
      evidencePackage.causalDependencies,
      evidencePackage.sourceReferences
    );

    // 7. Perform Replay/Reconstruction Dry Run
    let reconstructionVerified = true;
    let failedReconSeverityOrClass = false;

    if (inputs.reconstructionPayload) {
      const reconResult = this.reconstructionEngine.verifyReconstruction(
        inputs.reconstructionPayload.original,
        inputs.reconstructionPayload.reconstructed
      );
      reconstructionVerified = reconResult.verified;
      failedReconSeverityOrClass = reconResult.discrepancies.some(
        disc => disc.includes('severity classifications') || disc.includes('assurance classifications')
      );
    }

    // 8. Calculate Metric Scores
    const auditabilityScore = completenessResult.complete ? 100 : 100 - (completenessResult.missingFields.length * 10);
    const explainabilityScore = Object.keys(explainabilityNarrative).length > 0 ? 100 : 50;
    const evidenceIntegrityScore = isSignatureValid && !orphanResult.hasOrphans ? 100 : (orphanResult.hasOrphans ? 40 : 80);
    
    const lineageCoverage = this.regulatoryAssuranceEngine.checkTraceabilityCoverage(auditTrail);
    const lineageReproducibilityScore = isLineageChainValid && chronologyValid ? lineageCoverage : 0;
    const regulatoryReadinessScore = disclosureResult.adequate ? 100 : 100 - (disclosureResult.missing.length * 15);

    const baseScores: CertificationScores = {
      auditabilityScore: inputs.scores?.auditabilityScore ?? Math.max(0, auditabilityScore),
      explainabilityScore: inputs.scores?.explainabilityScore ?? Math.max(0, explainabilityScore),
      evidenceIntegrityScore: inputs.scores?.evidenceIntegrityScore ?? Math.max(0, evidenceIntegrityScore),
      lineageReproducibilityScore: inputs.scores?.lineageReproducibilityScore ?? Math.max(0, lineageReproducibilityScore),
      regulatoryReadinessScore: inputs.scores?.regulatoryReadinessScore ?? Math.max(0, regulatoryReadinessScore),
    };

    // Determine non-bypassable vetoes
    const isUpstreamFailClosed = inputs.explainabilityInputs.isDecisionBlocked ||
      auditTrail.some(entry => entry.failClosedPropagation || entry.severityState === 'FAIL_CLOSED' || entry.severityState === 'FAIL_CLOSED');

    const vetoes: VetoTriggers = {
      brokenLineage: !isLineageChainValid || !chronologyValid,
      orphanedDependency: orphanResult.hasOrphans,
      nonReproducibleOutput: !reconstructionVerified,
      tamperedEvidenceSignature: !isSignatureValid,
      missingEvidencePackage: !completenessResult.complete,
      failedReconstruction: failedReconSeverityOrClass,
      activeFailClosedState: !!isUpstreamFailClosed
    };

    // Certify grade & classification
    const certResult = this.certificationEngine.certify(
      baseScores,
      vetoes,
      {
        allEvidenceDimensionsPresent: completenessResult.complete,
        causalChainReconstructable,
        hasDisclosureIssues: !disclosureResult.adequate
      }
    );

    // Compute cumulative audit lineage hash
    const lineageHash = sha256(
      [
        evidencePackage.signature || '',
        auditTrail.flatMap(e => e.lineageHashes).join(','),
        causalChainTrace.join(','),
        certResult.classification,
        certResult.grade
      ].join('::')
    ).substring(0, 32);

    const assuranceMetadata: AssuranceMetadata = {
      auditId,
      classification: certResult.classification,
      grade: certResult.grade,
      scores: {
        auditabilityScore: baseScores.auditabilityScore,
        explainabilityScore: baseScores.explainabilityScore,
        evidenceIntegrityScore: baseScores.evidenceIntegrityScore,
        lineageReproducibilityScore: baseScores.lineageReproducibilityScore,
        regulatoryReadinessScore: baseScores.regulatoryReadinessScore,
        overallScore: certResult.overallScore
      },
      evidencePackage,
      auditTrail,
      causalChainTrace,
      explainabilityNarrative,
      reconstructionVerified,
      lineageHash,
      correlationId,
      timestamp
    };

    // Register metadata into historical logs
    this.auditEngine.registerAudit(assuranceMetadata);

    return assuranceMetadata;
  }
}
