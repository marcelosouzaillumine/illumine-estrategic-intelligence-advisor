// tests/constitutional-governance.test.ts
//
// Sovereign Institutional Policy, Doctrine & Constitutional Governance Test Suite

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveConstitutionalRuntime } from '../src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime';
import { FiduciaryAxiom } from '../src/core/runtime/constitutional-governance/constitutional-types';

describe('Constitutional Governance Layer', () => {

  describe('FiduciaryAxiomEngine & Axiom Supremacy', () => {
    it('should load all 8 immutable fiduciary axioms', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const axioms = runtime.axiomEngine.getAxioms();

      assert.equal(axioms.length, 8);
      const keys = axioms.map(a => a.key);
      assert.ok(keys.includes('survivability_supremacy'));
      assert.ok(keys.includes('fail_closed_doctrine'));
      assert.ok(keys.includes('fiduciary_neutrality'));
      assert.ok(keys.includes('lineage_integrity'));
      assert.ok(keys.includes('deterministic_explainability'));
      assert.ok(keys.includes('treasury_preservation_priority'));
      assert.ok(keys.includes('disclosure_transparency'));
      assert.ok(keys.includes('audit_reconstructability'));
    });

    it('should reject modifications to immutable axioms', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const axioms = runtime.axiomEngine.getAxioms();

      // Attempt to modify an axiom
      const tamperedAxioms = axioms.map(a => {
        if (a.key === 'survivability_supremacy') {
          return { ...a, description: 'Descrição enfraquecida de teste.' };
        }
        return a;
      });

      const validation = runtime.axiomEngine.validateAxiomIntegrity(tamperedAxioms);
      assert.equal(validation.isValid, false);
      assert.ok(validation.violations.some(v => v.includes('descrição')));
    });

    it('should reject missing axioms in migration payload', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const axioms = runtime.axiomEngine.getAxioms();

      // Remove an axiom
      const incompleteAxioms = axioms.filter(a => a.key !== 'fail_closed_doctrine');

      const validation = runtime.axiomEngine.validateAxiomIntegrity(incompleteAxioms);
      assert.equal(validation.isValid, false);
      assert.ok(validation.violations.some(v => v.includes('Remoção do axioma')));
    });

    it('should flag axiom violation when low confidence is not handled by fail-closed', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const payload = {
        compliance: { confidenceLevel: 'LOW_CONFIDENCE', runtimeMode: 'NORMAL' },
        lineageHash: 'valid-lineage-hash'
      };

      const result = runtime.axiomEngine.evaluateReportAxioms(payload);
      assert.equal(result.isViolated, true);
      assert.ok(result.violations.some(v => v.includes('fail-closed doctrine')));
    });

    it('should flag axiom violation when lineage is missing', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const payload = {
        compliance: { confidenceLevel: 'HIGH_CONFIDENCE', runtimeMode: 'NORMAL' },
        lineageHash: '' // missing lineage
      };

      const result = runtime.axiomEngine.evaluateReportAxioms(payload);
      assert.equal(result.isViolated, true);
      assert.ok(result.violations.some(v => v.includes('lineage integrity')));
    });

    it('should flag axiom violation when survival mode has no restrictions', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const payload = {
        survivalReport: {
          activeSurvivalMode: 'SURVIVAL_MODE',
          blockedActions: [] // Empty blocks
        },
        lineageHash: 'valid-lineage-hash'
      };

      const result = runtime.axiomEngine.evaluateReportAxioms(payload);
      assert.equal(result.isViolated, true);
      assert.ok(result.violations.some(v => v.includes('survivability supremacy')));
    });
  });

  describe('FiduciaryDoctrineEngine & Versioning', () => {
    it('should keep track of active doctrine and publish transitions', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const initial = runtime.doctrineEngine.getActiveDoctrine();

      assert.equal(initial.doctrineVersion, '1.0.0');

      const published = runtime.doctrineEngine.publishDoctrine({
        doctrineVersion: '1.1.0',
        ruleset: { ...initial.ruleset, treasuryReserveThreshold: 150000 },
        compatibilityReferences: ['1.0.0', '1.1.0'],
        propagationScope: ['compliance', 'decision-intelligence'],
        migrationRequirements: []
      });

      assert.equal(published.doctrineVersion, '1.1.0');
      assert.ok(published.doctrineLineageHash.startsWith('DOC-SHA256-'));
      assert.equal(runtime.doctrineEngine.getActiveDoctrine().doctrineVersion, '1.1.0');
      assert.equal(runtime.doctrineEngine.getDoctrineHistory().length, 2);
    });

    it('should validate compatibility reference checks', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      assert.equal(runtime.doctrineEngine.isCompatible('1.0.0'), true);
      assert.equal(runtime.doctrineEngine.isCompatible('2.0.0'), false);
    });
  });

  describe('RuntimePolicyEngine', () => {
    it('should evaluate safe state metrics without violations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const evaluation = runtime.policyEngine.evaluateState({
        availableCash: 120000,
        leverageRatio: 2.1,
        projectedRunwayMonths: 6,
        hasBrokenLineage: false,
        hasTamperedSignature: false
      });

      assert.equal(evaluation.isViolated, false);
      assert.equal(evaluation.vetoTriggered, false);
      assert.equal(evaluation.violations.length, 0);
    });

    it('should detect cash floor violations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const evaluation = runtime.policyEngine.evaluateState({
        availableCash: 25000, // below 50000 minAvailableCash
        leverageRatio: 2.1,
        projectedRunwayMonths: 6
      });

      assert.equal(evaluation.isViolated, true);
      assert.ok(evaluation.violations[0].includes('caixa disponível'));
    });

    it('should detect leverage ratio violations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const evaluation = runtime.policyEngine.evaluateState({
        availableCash: 120000,
        leverageRatio: 4.2, // above 3.5 limit
        projectedRunwayMonths: 6
      });

      assert.equal(evaluation.isViolated, true);
      assert.ok(evaluation.violations[0].includes('índice de alavancagem'));
    });

    it('should detect runway months violations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const evaluation = runtime.policyEngine.evaluateState({
        availableCash: 120000,
        leverageRatio: 2.1,
        projectedRunwayMonths: 2 // below 3 minimum
      });

      assert.equal(evaluation.isViolated, true);
      assert.ok(evaluation.violations[0].includes('runway projetado'));
    });

    it('should trigger policy vetoes on lineage breakage or signature tampering', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const evaluation = runtime.policyEngine.evaluateState({
        hasBrokenLineage: true,
        hasTamperedSignature: true
      });

      assert.equal(evaluation.isViolated, true);
      assert.equal(evaluation.vetoTriggered, true);
      assert.ok(evaluation.violations.some(v => v.includes('VETO POLÍTICO: Quebra de lineage')));
      assert.ok(evaluation.violations.some(v => v.includes('VETO POLÍTICO: Assinatura fiduciária')));
    });
  });

  describe('ConstitutionalMigrationEngine', () => {
    it('should block migration that weakens fail-closed safeguards', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const proposedDoc = {
        ...currentDoc,
        ruleset: { ...currentDoc.ruleset, failClosedOnLowConfidence: false } // Weakened
      };
      const currentPolicy = runtime.policyEngine.getActivePolicy();

      const validation = runtime.migrationEngine.validateMigrationSafety(
        currentDoc,
        proposedDoc,
        currentPolicy,
        currentPolicy
      );

      assert.equal(validation.isSafe, false);
      assert.ok(validation.blockReasons.some(r => r.includes('fail-closed')));
    });

    it('should block migration that reduces lineage propagation scope', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const proposedDoc = {
        ...currentDoc,
        propagationScope: ['compliance'] // Reduced scope from original 4 items
      };
      const currentPolicy = runtime.policyEngine.getActivePolicy();

      const validation = runtime.migrationEngine.validateMigrationSafety(
        currentDoc,
        proposedDoc,
        currentPolicy,
        currentPolicy
      );

      assert.equal(validation.isSafe, false);
      assert.ok(validation.blockReasons.some(r => r.includes('reduz as exigências de propagação')));
    });

    it('should block migration that suppresses disclosure obligations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const currentPolicy = runtime.policyEngine.getActivePolicy();
      const proposedPolicy = {
        ...currentPolicy,
        publicationCertificationPolicies: ['block_unauthorized_board_packs'] // Removed 'require_disclosure_on_restricted'
      };

      const validation = runtime.migrationEngine.validateMigrationSafety(
        currentDoc,
        currentDoc,
        currentPolicy,
        proposedPolicy
      );

      assert.equal(validation.isSafe, false);
      assert.ok(validation.blockReasons.some(r => r.includes('disclosure')));
    });

    it('should block migration that lowers runway survivability minimums', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const currentPolicy = runtime.policyEngine.getActivePolicy();
      const proposedPolicy = {
        ...currentPolicy,
        survivabilityMinimums: { projectedRunwayMonths: 1 } // Lowered from 3
      };

      const validation = runtime.migrationEngine.validateMigrationSafety(
        currentDoc,
        currentDoc,
        currentPolicy,
        proposedPolicy
      );

      assert.equal(validation.isSafe, false);
      assert.ok(validation.blockReasons.some(r => r.includes('sobrevivência')));
    });

    it('should block migration that weakens treasury restrictions', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const currentPolicy = runtime.policyEngine.getActivePolicy();
      const proposedPolicy = {
        ...currentPolicy,
        treasuryRestrictions: [] // Weakened from original 2 restrictions
      };

      const validation = runtime.migrationEngine.validateMigrationSafety(
        currentDoc,
        currentDoc,
        currentPolicy,
        proposedPolicy
      );

      assert.equal(validation.isSafe, false);
      assert.ok(validation.blockReasons.some(r => r.includes('restrições ativas de tesouraria')));
    });

    it('should block migration that compromises audit reconstructability', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const currentPolicy = runtime.policyEngine.getActivePolicy();
      const proposedPolicy = {
        ...currentPolicy,
        assuranceVetoRules: [] // Removed security/signature vetos
      };

      const validation = runtime.migrationEngine.validateMigrationSafety(
        currentDoc,
        currentDoc,
        currentPolicy,
        proposedPolicy
      );

      assert.equal(validation.isSafe, false);
      assert.ok(validation.blockReasons.some(r => r.includes('compromete a auditabilidade')));
    });
  });

  describe('GovernanceOverrideEngine & Audit Log Integration', () => {
    it('should reject overrides on axioms and log them as ATTEMPTED_FORBIDDEN', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const approved = runtime.requestOverride({
        actor: 'Dr. Silva',
        role: 'FiduciaryOfficer',
        reason: 'Urgência extrema na reconfiguração fiduciária.',
        target: 'fail_closed_doctrine', // Axiom target
        affectedDoctrineOrPolicy: 'Axioms v1'
      });

      assert.equal(approved, false);
      const attempts = runtime.overrideEngine.getOverrideHistory();
      assert.equal(attempts.length, 1);
      assert.equal(attempts[0].authorizationStatus, 'ATTEMPTED_FORBIDDEN');

      const logs = runtime.auditEngine.getLogs();
      // First is System Initialization, second is Override Attempt
      assert.equal(logs.length, 2);
      assert.equal(logs[1].type, 'OVERRIDE_ATTEMPT');
      assert.equal(logs[1].overrideAttempt?.authorizationStatus, 'ATTEMPTED_FORBIDDEN');
    });

    it('should reject overrides by unauthorized roles and log them as UNAUTHORIZED', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const approved = runtime.requestOverride({
        actor: 'Dev John',
        role: 'Operator', // unauthorized role
        reason: 'Ignorar limite temporariamente para testes.',
        target: 'minAvailableCash',
        affectedDoctrineOrPolicy: 'Policy v1'
      });

      assert.equal(approved, false);
      const attempts = runtime.overrideEngine.getOverrideHistory();
      assert.equal(attempts[0].authorizationStatus, 'UNAUTHORIZED');
    });

    it('should reject overrides without a sufficient reason and log them as REJECTED', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const approved = runtime.requestOverride({
        actor: 'Dr. Silva',
        role: 'FiduciaryOfficer',
        reason: 'Curto', // Reason < 10 chars
        target: 'minAvailableCash',
        affectedDoctrineOrPolicy: 'Policy v1'
      });

      assert.equal(approved, false);
      const attempts = runtime.overrideEngine.getOverrideHistory();
      assert.equal(attempts[0].authorizationStatus, 'REJECTED');
    });

    it('should approve legitimate overrides by authorized roles with justification', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      const approved = runtime.requestOverride({
        actor: 'Director Martha',
        role: 'SovereignBoard',
        reason: 'Alocação de liquidez aprovada em assembleia extraordinária.',
        target: 'minAvailableCash',
        affectedDoctrineOrPolicy: 'Policy v1'
      });

      assert.equal(approved, true);
      const attempts = runtime.overrideEngine.getOverrideHistory();
      assert.equal(attempts[0].authorizationStatus, 'APPROVED');
    });
  });

  describe('DoctrineConsistencyEngine', () => {
    it('should flag conflict when policy cash minimum contradicts doctrine reserve threshold', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const tamperedPolicy = {
        ...runtime.policyEngine.getActivePolicy(),
        thresholds: {
          minAvailableCash: 30000 // Less than doctrine treasuryReserveThreshold (50000)
        }
      };

      const verification = runtime.consistencyEngine.verifyConsistency(currentDoc, tamperedPolicy);
      assert.equal(verification.isConsistent, false);
      assert.ok(verification.conflicts[0].includes('piso de caixa'));
    });

    it('should flag conflict when dividend rules contradict doctrine restrictions', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = {
        ...runtime.doctrineEngine.getActiveDoctrine(),
        ruleset: { ...runtime.doctrineEngine.getActiveDoctrine().ruleset, dividendDistributionAllowed: false }
      };
      const tamperedPolicy = {
        ...runtime.policyEngine.getActivePolicy(),
        treasuryRestrictions: [] // Missing block_dividend_distributions
      };

      const verification = runtime.consistencyEngine.verifyConsistency(currentDoc, tamperedPolicy);
      assert.equal(verification.isConsistent, false);
      assert.ok(verification.conflicts[0].includes('distribuição de dividendos'));
    });
  });

  describe('RuntimeCompatibilityEngine', () => {
    it('should validate cross-domain compatibility successfully by default', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const evaluation = runtime.compatibilityEngine.validateFrameworkCompatibility();
      assert.equal(evaluation.isFullyCompatible, true);
    });

    it('should flag incompatibility when custom status is toggled off', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      runtime.compatibilityEngine.setCompatibility('compliance', 'treasury_intelligence', false);

      const evaluation = runtime.compatibilityEngine.validateFrameworkCompatibility();
      assert.equal(evaluation.isFullyCompatible, false);
      assert.equal(evaluation.incompatiblePairs[0], 'compliance <-> treasury_intelligence');
    });
  });

  describe('ConstitutionalAuditEngine & Governance Erosion', () => {
    it('should flag governance erosion on unauthorized override attempts', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      // Trigger unauthorized attempt
      runtime.requestOverride({
        actor: 'Hacker',
        role: 'Guest',
        reason: 'Tentando burlar regras fiduciárias.',
        target: 'minAvailableCash',
        affectedDoctrineOrPolicy: 'Policy v1'
      });

      const erosion = runtime.auditEngine.detectGovernanceErosion();
      assert.equal(erosion.erosionDetected, true);
      assert.ok(erosion.warnings[0].includes('não autorizadas ou proibidas'));
    });

    it('should flag governance erosion on high override request count', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      // Trigger multiple overrides
      for (let i = 0; i < 3; i++) {
        runtime.requestOverride({
          actor: 'Dr. Silva',
          role: 'FiduciaryOfficer',
          reason: `Alteração justificável número ${i} de teste fiduciário.`,
          target: `minAvailableCash_${i}`,
          affectedDoctrineOrPolicy: 'Policy v1'
        });
      }

      const erosion = runtime.auditEngine.detectGovernanceErosion();
      assert.equal(erosion.erosionDetected, true);
      assert.ok(erosion.warnings.some(w => w.includes('Frequência elevada')));
    });
  });

  describe('ExecutiveConstitutionalRuntime E2E Orchestration', () => {
    it('should return stable state when all metrics are valid', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const metadata = runtime.evaluateRuntimeState({
        availableCash: 120000,
        leverageRatio: 2.5,
        projectedRunwayMonths: 6,
        hasBrokenLineage: false,
        hasTamperedSignature: false,
        lineageHash: 'valid-lineage-hash'
      });

      assert.equal(metadata.integrityState, 'CONSTITUTIONALLY_STABLE');
      assert.equal(metadata.axiomViolations.length, 0);
      assert.equal(metadata.detectedConflicts.length, 0);
      assert.ok(metadata.constitutionalLineageHash.startsWith('CONST-SHA256-'));
    });

    it('should return POLICY_DRIFT state under minor threshold violations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const metadata = runtime.evaluateRuntimeState({
        availableCash: 120000,
        leverageRatio: 4.1, // violated (>3.5)
        projectedRunwayMonths: 6,
        lineageHash: 'valid-lineage-hash'
      });

      assert.equal(metadata.integrityState, 'POLICY_DRIFT');
    });

    it('should return CONSTITUTIONAL_FAIL_CLOSED state under veto triggers or axiom violations', () => {
      const runtime = new ExecutiveConstitutionalRuntime();

      // Axiom violation (low confidence without failclosed)
      const metadata = runtime.evaluateRuntimeState({
        availableCash: 120000,
        leverageRatio: 2.1,
        projectedRunwayMonths: 6,
        compliance: { confidenceLevel: 'LOW_CONFIDENCE', runtimeMode: 'NORMAL' },
        lineageHash: 'valid-lineage-hash'
      });

      assert.equal(metadata.integrityState, 'CONSTITUTIONAL_FAIL_CLOSED');
    });

    it('should update active doctrine and policy upon successful migration execution', () => {
      const runtime = new ExecutiveConstitutionalRuntime();
      const currentDoc = runtime.doctrineEngine.getActiveDoctrine();
      const currentPolicy = runtime.policyEngine.getActivePolicy();

      const proposedDoc = {
        ...currentDoc,
        doctrineVersion: '1.2.0',
        ruleset: { ...currentDoc.ruleset, treasuryReserveThreshold: 120000 }
      };

      const proposedPolicy = {
        ...currentPolicy,
        policyVersion: '1.2.0',
        thresholds: { ...currentPolicy.thresholds, minAvailableCash: 125000 } // Maintain consistency minAvailableCash >= 120000
      };

      const result = runtime.executeMigration(proposedDoc, proposedPolicy, 'Dr. Silva', 'FiduciaryOfficer');

      assert.equal(result.isSuccess, true);
      assert.equal(runtime.doctrineEngine.getActiveDoctrine().doctrineVersion, '1.2.0');
      assert.equal(runtime.policyEngine.getActivePolicy().policyVersion, '1.2.0');

      // Verify log includes the transition
      const logs = runtime.auditEngine.getLogs();
      assert.ok(logs.some(l => l.type === 'MIGRATION_EXECUTE'));
    });
  });
});
