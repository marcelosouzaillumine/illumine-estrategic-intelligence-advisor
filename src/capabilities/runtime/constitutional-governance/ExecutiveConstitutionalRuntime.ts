// src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts
//
// Executive Constitutional Runtime
// Central orchestrator that runs all sub-engines to compile, sign, and verify the constitutional governance state.

import {
  ConstitutionalGovernanceMetadata,
  ConstitutionalIntegrityState,
  FiduciaryAxiom,
  FiduciaryDoctrine,
  RuntimePolicy,
  ConstitutionalOverrideAttempt,
  ConstitutionalAuditRecord
} from './constitutional-types';

import { FiduciaryAxiomEngine } from './FiduciaryAxiomEngine';
import { FiduciaryDoctrineEngine } from './FiduciaryDoctrineEngine';
import { RuntimePolicyEngine } from './RuntimePolicyEngine';
import { ConstitutionalMigrationEngine } from './ConstitutionalMigrationEngine';
import { GovernanceOverrideEngine } from './GovernanceOverrideEngine';
import { DoctrineConsistencyEngine } from './DoctrineConsistencyEngine';
import { RuntimeCompatibilityEngine } from './RuntimeCompatibilityEngine';
import { ConstitutionalAuditEngine } from './ConstitutionalAuditEngine';
import { ConstitutionalGovernanceEngine } from './ConstitutionalGovernanceEngine';
import { sha256 } from '../../../platform/crypto/sha256';
import { RuntimeExecutionLogger } from '../../../core/runtime/observability/RuntimeExecutionLogger';
import { SemanticComplianceAuditRuntime } from './SemanticComplianceAuditRuntime';
import { SemanticLineagePayload } from './SemanticLineageReport';
import { getErrorMessage, getErrorStack } from '../../../types/runtime/RuntimeErrorGuards';
import { ConstitutionalGraphAdapter } from '../../../core/knowledge-graph/adapters/ConstitutionalGraphAdapter';

export class ExecutiveConstitutionalRuntime {
  public readonly axiomEngine = new FiduciaryAxiomEngine();
  public readonly doctrineEngine = new FiduciaryDoctrineEngine();
  public readonly policyEngine = new RuntimePolicyEngine();
  public readonly migrationEngine = new ConstitutionalMigrationEngine();
  public readonly overrideEngine = new GovernanceOverrideEngine();
  public readonly consistencyEngine = new DoctrineConsistencyEngine();
  public readonly compatibilityEngine = new RuntimeCompatibilityEngine();
  public readonly auditEngine = new ConstitutionalAuditEngine();
  public readonly governanceEngine = new ConstitutionalGovernanceEngine();

  private constitutionalVersion = '1.0.0';
  private migrationVersion = '1.0.0';

  constructor() {
    // Log initialization event
    this.auditEngine.logRecord({
      recordId: 'AUD-INIT-001',
      timestamp: new Date().toISOString(),
      type: 'AXIOM_AUDIT',
      details: 'Constitutional Governance Runtime inicializado com axiomas fundamentais.',
      actor: 'SYSTEM',
      role: 'SovereignKernel',
      constitutionalLineageHash: 'SEED-CONSTITUTIONAL-LINEAGE-HASH'
    });
  }

  /**
   * Executes a constitutional override request.
   * Logs an audit record for the attempt, regardless of whether it is approved, rejected, forbidden, or unauthorized.
   */
  public requestOverride(params: {
    actor: string;
    role: string;
    reason: string;
    target: string;
    affectedDoctrineOrPolicy: string;
    executionId?: string;
  }): boolean {
    const currentLineageHash = this.computeLineageHash();
    const result = this.overrideEngine.evaluateOverrideAttempt({
      ...params,
      constitutionalLineageHash: currentLineageHash
    });

    this.auditEngine.logRecord(result.auditRecord);

    // Log Telemetry Event
    const execId = params.executionId || 'override-exec-id';
    RuntimeExecutionLogger.logEvent(
      execId,
      'CONSTITUTIONAL_OVERRIDE_ATTEMPT',
      { actor: params.actor, target: params.target, authorizationStatus: result.attempt.authorizationStatus }
    );

    if (result.attempt.authorizationStatus === 'ATTEMPTED_FORBIDDEN') {
      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_FORBIDDEN_ACTION', { actor: params.actor, target: params.target });
    }

    if (result.isApproved) {
      // If a policy threshold was overridden, we could apply runtime configurations here.
      // E.g., dynamically adjust policy thresholds temporarily.
      return true;
    }

    return false;
  }

  /**
   * Evaluates and executes a doctrine and policy migration.
   * Ensures migrations do not weaken any fiduciary safeguards.
   */
  public executeMigration(
    proposedDoctrine: FiduciaryDoctrine,
    proposedPolicy: RuntimePolicy,
    actor: string,
    role: string,
    executionId?: string
  ): { isSuccess: boolean; reasons: string[] } {
    const currentDoctrine = this.doctrineEngine.getActiveDoctrine();
    const currentPolicy = this.policyEngine.getActivePolicy();
    const execId = executionId || 'migration-exec-id';

    // 1. Verify that the axioms are not being altered or weakened during this transition (Axiom Supremacy)
    const axiomIntegrity = this.axiomEngine.validateAxiomIntegrity(this.axiomEngine.getAxioms());
    if (!axiomIntegrity.isValid) {
      this.auditEngine.logRecord({
        recordId: `AUD-MIG-ERR-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'MIGRATION_EXECUTE',
        details: `Migração abortada: Violação na integridade dos axiomas fiduciários inalteráveis. Detalhes: ${axiomIntegrity.violations.join('; ')}`,
        actor,
        role,
        constitutionalLineageHash: this.computeLineageHash()
      });

      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_FORBIDDEN_ACTION', { action: 'weaken_axioms', actor });

      return { isSuccess: false, reasons: axiomIntegrity.violations };
    }

    // 2. Validate migration safety constraints
    const safety = this.migrationEngine.validateMigrationSafety(
      currentDoctrine,
      proposedDoctrine,
      currentPolicy,
      proposedPolicy
    );

    if (!safety.isSafe) {
      this.auditEngine.logRecord({
        recordId: `AUD-MIG-ERR-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'MIGRATION_EXECUTE',
        details: `Migração rejeitada por violar salvaguardas constitucionais. Motivos: ${safety.blockReasons.join('; ')}`,
        actor,
        role,
        constitutionalLineageHash: this.computeLineageHash()
      });

      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_MIGRATION_EVENT', { actor, success: false, proposedVersion: proposedDoctrine.doctrineVersion, reasons: safety.blockReasons });

      return { isSuccess: false, reasons: safety.blockReasons };
    }

    // 3. Apply the migration updates
    this.doctrineEngine.publishDoctrine(proposedDoctrine);
    this.policyEngine.updatePolicy(proposedPolicy);
    this.migrationVersion = proposedDoctrine.doctrineVersion;

    this.auditEngine.logRecord({
      recordId: `AUD-MIG-OK-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'MIGRATION_EXECUTE',
      details: `Migração executada com sucesso para doutrina ${proposedDoctrine.doctrineVersion} e política ${proposedPolicy.policyVersion}.`,
      actor,
      role,
      constitutionalLineageHash: this.computeLineageHash()
    });

    RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_MIGRATION_EVENT', { actor, success: true, proposedVersion: proposedDoctrine.doctrineVersion });

    return { isSuccess: true, reasons: [] };
  }

  /**
   * Evaluates the current state metrics and returns the certified constitutional governance metadata.
   */
  public evaluateRuntimeState(payload: {
    availableCash?: number;
    leverageRatio?: number;
    projectedRunwayMonths?: number;
    hasBrokenLineage?: boolean;
    hasTamperedSignature?: boolean;
    compliance?: {
      confidenceLevel?: string;
      runtimeMode?: string;
    };
    resilienceReport?: {
      confidenceLevel?: string;
    };
    failClosedTriggered?: boolean;
    deploymentReadiness?: {
      deploymentBlocked?: boolean;
    };
    survivalReport?: {
      activeSurvivalMode?: string;
      blockedActions?: string[];
    };
    lineageHash?: string;
    executionId?: string;
    semanticSource?: string;
    renderedContent?: string;
    semanticLineagePayload?: import('./SemanticLineageReport').SemanticLineagePayload;
    semanticScope?: 'EXECUTIVE' | 'TECHNICAL_AUDIT';
  }): ConstitutionalGovernanceMetadata {
    const activeDoctrine = this.doctrineEngine.getActiveDoctrine();
    const activePolicy = this.policyEngine.getActivePolicy();

    // 1. Evaluate Fiduciary Axiom violations
    const axiomEvaluation = this.axiomEngine.evaluateReportAxioms(payload);

    // 2. Evaluate Policy threshold violations and veto triggers
    const policyEvaluation = this.policyEngine.evaluateState(payload);

    // 3. Verify cross-runtime policy-doctrine consistency
    const consistency = this.consistencyEngine.verifyConsistency(activeDoctrine, activePolicy);

    // 4. Validate domain compatibility
    const compatibility = this.compatibilityEngine.validateFrameworkCompatibility();

    // 5. Detect potential governance erosion
    const erosion = this.auditEngine.detectGovernanceErosion();

    // 6. Check doctrine version compatibility with system version (e.g., active doctrine version)
    const isCompatible = this.doctrineEngine.isCompatible(activeDoctrine.doctrineVersion);

    // 7. Evaluate Semantic Constitutional Compliance (SCCF v1.0)
    let hasSemanticViolation = false;
    const semanticViolations: string[] = [];
    if (payload.semanticSource && payload.semanticLineagePayload) {
      try {
        const semanticReport = SemanticComplianceAuditRuntime.evaluate(
          payload.semanticSource,
          payload.renderedContent || '',
          payload.semanticLineagePayload,
          payload.semanticScope || 'EXECUTIVE'
        );
        if (semanticReport.complianceStatus === 'NON_COMPLIANT') {
          hasSemanticViolation = true;
          semanticViolations.push(...semanticReport.violations);
        }
      } catch (err: unknown) {
        hasSemanticViolation = true;
        semanticViolations.push(getErrorMessage(err));
        this.auditEngine.logRecord({
          recordId: `AUD-SEM-ERR-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'AXIOM_AUDIT',
          details: `Falha crítica na conformidade semântica: ${getErrorMessage(err)}`,
          actor: 'SYSTEM',
          role: 'SovereignKernel',
          constitutionalLineageHash: this.computeLineageHash()
        });
      }
    }

    // 8. Resolve the final integrity state
    const integrityState = this.governanceEngine.resolveIntegrityState({
      hasAxiomViolation: axiomEvaluation.isViolated || hasSemanticViolation,
      hasVetoTriggered: policyEvaluation.vetoTriggered,
      hasConflict: !consistency.isConsistent,
      hasPolicyViolation: policyEvaluation.isViolated,
      hasErosionDetected: erosion.erosionDetected,
      isCompatible
    });

    const lineageHash = this.computeLineageHash();

    // Log Telemetry Events
    const execId = payload.executionId || 'eval-exec-id';
    if (axiomEvaluation.isViolated || hasSemanticViolation) {
      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_QUARANTINE_ACTIVATION', { reason: 'axiom_violation' });
      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_FORBIDDEN_ACTION', { violation: 'axiom_violation' });
    }
    if (integrityState === 'CONSTITUTIONAL_FAIL_CLOSED') {
      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_QUARANTINE_ACTIVATION', { reason: 'fail_closed' });
    }
    if (consistency.conflicts.length > 0) {
      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_DOCTRINE_DRIFT', { conflicts: consistency.conflicts });
    }
    if (erosion.erosionDetected) {
      RuntimeExecutionLogger.logEvent(execId, 'CONSTITUTIONAL_EROSION_PATTERN', { warnings: erosion.warnings });
    }


    // Construct the compatibility status map for all 10 core domains
    const compMatrix = this.compatibilityEngine.getCompatibilityMatrix();
    const compatibilityStatus: Record<string, boolean> = {};
    for (const key of Object.keys(compMatrix)) {
      // If any pairing for a domain is incompatible, mark the domain status as false.
      compatibilityStatus[key] = !Object.values(compMatrix[key]).includes(false);
    }

    const metadata: ConstitutionalGovernanceMetadata = {
      constitutionalVersion: this.constitutionalVersion,
      doctrineVersion: activeDoctrine.doctrineVersion,
      policyVersion: activePolicy.policyVersion,
      migrationVersion: this.migrationVersion,
      constitutionalLineageHash: lineageHash,
      integrityState,
      detectedConflicts: consistency.conflicts,
      axiomViolations: [...axiomEvaluation.violations, ...semanticViolations],
      overrideAttempts: this.overrideEngine.getOverrideHistory(),
      compatibilityStatus,
      auditRecords: this.auditEngine.getLogs(),
      status: integrityState === 'CONSTITUTIONALLY_STABLE' ? 'APPROVED' : 'REJECTED'
    };
    
    // [Knowledge Graph Integration] Chamada Passiva
    ConstitutionalGraphAdapter.registerConstitutionalGraph(metadata, execId).catch(err => {
      console.warn('[ConstitutionalGraphAdapter] Async error ignored:', err);
    });

    return metadata;
  }

  /**
   * Helper to compute a signed constitutional lineage hash based on active states.
   */
  private computeLineageHash(): string {
    const activeDoctrine = this.doctrineEngine.getActiveDoctrine();
    const activePolicy = this.policyEngine.getActivePolicy();
    const overrides = this.overrideEngine.getOverrideHistory();
    const logs = this.auditEngine.getLogs();

    const parts = [
      activeDoctrine.doctrineLineageHash,
      activePolicy.policyVersion,
      JSON.stringify(activePolicy.thresholds),
      overrides.length.toString(),
      logs.length.toString()
    ];

    return `CONST-SHA256-${sha256(parts.join('|')).substring(0, 32).toUpperCase()}`;
  }
}
