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
import { sha256 } from '../executive/types';

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
  }): boolean {
    const currentLineageHash = this.computeLineageHash();
    const result = this.overrideEngine.evaluateOverrideAttempt({
      ...params,
      constitutionalLineageHash: currentLineageHash
    });

    this.auditEngine.logRecord(result.auditRecord);

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
    role: string
  ): { isSuccess: boolean; reasons: string[] } {
    const currentDoctrine = this.doctrineEngine.getActiveDoctrine();
    const currentPolicy = this.policyEngine.getActivePolicy();

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

    // 7. Resolve the final integrity state
    const integrityState = this.governanceEngine.resolveIntegrityState({
      hasAxiomViolation: axiomEvaluation.isViolated,
      hasVetoTriggered: policyEvaluation.vetoTriggered,
      hasConflict: !consistency.isConsistent,
      hasPolicyViolation: policyEvaluation.isViolated,
      hasErosionDetected: erosion.erosionDetected,
      isCompatible
    });

    const lineageHash = this.computeLineageHash();

    // Construct the compatibility status map for all 10 core domains
    const compMatrix = this.compatibilityEngine.getCompatibilityMatrix();
    const compatibilityStatus: Record<string, boolean> = {};
    for (const key of Object.keys(compMatrix)) {
      // If any pairing for a domain is incompatible, mark the domain status as false.
      compatibilityStatus[key] = !Object.values(compMatrix[key]).includes(false);
    }

    return {
      constitutionalVersion: this.constitutionalVersion,
      doctrineVersion: activeDoctrine.doctrineVersion,
      policyVersion: activePolicy.policyVersion,
      migrationVersion: this.migrationVersion,
      constitutionalLineageHash: lineageHash,
      integrityState,
      detectedConflicts: consistency.conflicts,
      axiomViolations: axiomEvaluation.violations,
      overrideAttempts: this.overrideEngine.getOverrideHistory(),
      compatibilityStatus,
      auditRecords: this.auditEngine.getLogs()
    };
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
