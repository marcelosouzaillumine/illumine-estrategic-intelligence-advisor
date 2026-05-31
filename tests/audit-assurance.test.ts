// tests/audit-assurance.test.ts
//
// Sovereign Institutional Audit, Evidence & Regulatory Assurance Test Suite

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveAssuranceRuntime } from '../src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime';
import { FiduciaryEvidenceEngine } from '../src/core/runtime/audit-assurance/FiduciaryEvidenceEngine';
import { RuntimeExplainabilityEngine } from '../src/core/runtime/audit-assurance/RuntimeExplainabilityEngine';
import { AuditTrailEngine } from '../src/core/runtime/audit-assurance/AuditTrailEngine';
import { CausalChainEngine } from '../src/core/runtime/audit-assurance/CausalChainEngine';
import { RegulatoryAssuranceEngine } from '../src/core/runtime/audit-assurance/RegulatoryAssuranceEngine';
import { EvidenceIntegrityEngine } from '../src/core/runtime/audit-assurance/EvidenceIntegrityEngine';
import { InstitutionalForensicsEngine } from '../src/core/runtime/audit-assurance/InstitutionalForensicsEngine';
import { AuditReconstructionEngine } from '../src/core/runtime/audit-assurance/AuditReconstructionEngine';
import { AssuranceCertificationEngine } from '../src/core/runtime/audit-assurance/AssuranceCertificationEngine';
import { InstitutionalAuditEngine } from '../src/core/runtime/audit-assurance/InstitutionalAuditEngine';
import { AuditTrailEntry } from '../src/core/runtime/audit-assurance/audit-types';

describe('Sovereign Institutional Audit, Evidence & Regulatory Assurance Suite', () => {

  describe('1. FiduciaryEvidenceEngine', () => {
    it('should compile an EvidencePackage across 10 dimensions with signature', () => {
      const engine = new FiduciaryEvidenceEngine();
      const pkg = engine.compileEvidence({
        sourceReferences: ['ERP-001', 'API-SEC'],
        causalDependencies: ['LIQ-DECAY', 'COV-BREACH'],
        calculationLineage: ['ebitda-calc-v1', 'leverage-ratio-v2'],
        runtimeAssumptions: ['inflation-10-percent'],
        confidenceDerivation: ['confidence-kpi-0.95'],
        severityPropagation: ['sev-stable-to-alert'],
        decisionDependencies: ['capex-block-holding'],
        simulationAssumptions: ['stress-case-dryrun'],
        treasuryDependencies: ['treasury-limit-coligadas'],
        survivabilityDependencies: ['survivability-risk-low']
      });

      assert.equal(pkg.sourceReferences.length, 2);
      assert.equal(pkg.causalDependencies.length, 2);
      assert.equal(pkg.survivabilityDependencies[0], 'survivability-risk-low');
      assert.ok(pkg.timestamp);
      assert.ok(pkg.signature);
      assert.ok(pkg.signature.startsWith('SIG-SHA256-'));
    });
  });

  describe('2. RuntimeExplainabilityEngine', () => {
    it('should translate runtime constraints into correct Portuguese explanations', () => {
      const engine = new RuntimeExplainabilityEngine();
      const explanation = engine.explainState({
        isDecisionBlocked: true,
        decisionBlockTrigger: 'Caixa mínimo violado',
        isSeverityEscalated: true,
        severityEscalationTrigger: 'Risco de insolvência iminente',
        isPublicationRestricted: true,
        publicationRestrictionTrigger: 'Lineage quebrado'
      });

      assert.ok(explanation.decisionBlockReason?.includes('Caixa mínimo violado'));
      assert.ok(explanation.severityEscalationReason?.includes('Risco de insolvência iminente'));
      assert.ok(explanation.publicationRestrictionReason?.includes('Lineage quebrado'));
    });
  });

  describe('3. AuditTrailEngine', () => {
    it('should log execution entries and verify chronology', () => {
      const engine = new AuditTrailEngine();
      
      const now = new Date();
      const t1 = new Date(now.getTime() - 2000).toISOString();
      const t2 = new Date(now.getTime() - 1000).toISOString();
      const t3 = now.toISOString();

      engine.logEntry({
        runtimeSource: 'ERP-Import',
        severityState: 'SAFE',
        lineageHashes: ['hash1'],
        confidenceState: 'HIGH',
        failClosedPropagation: false,
        certificationState: 'A',
        timestamp: t1
      });

      engine.logEntry({
        runtimeSource: 'CausalEngine',
        severityState: 'MEDIUM',
        lineageHashes: ['hash2'],
        confidenceState: 'MEDIUM',
        failClosedPropagation: false,
        certificationState: 'B',
        timestamp: t2
      });

      engine.logEntry({
        runtimeSource: 'ComplianceRuntime',
        severityState: 'CRITICAL',
        lineageHashes: ['hash3'],
        confidenceState: 'LOW',
        failClosedPropagation: true,
        certificationState: 'F',
        timestamp: t3
      });

      const trail = engine.getTrail();
      assert.equal(trail.length, 3);
      assert.ok(engine.verifyChronology());

      // Insert out of chronological order
      const outOfOrder: any[] = [
        ...trail,
        {
          timestamp: new Date(now.getTime() - 5000).toISOString(),
          runtimeSource: 'LateCheck',
          severityState: 'SAFE',
          lineageHashes: ['hash0'],
          confidenceState: 'HIGH',
          failClosedPropagation: false,
          certificationState: 'A'
        }
      ];
      assert.equal(engine.verifyChronology(outOfOrder), false);
    });
  });

  describe('4. CausalChainEngine', () => {
    it('should generate causal chain trace strings', () => {
      const engine = new CausalChainEngine();
      const traces = engine.traceCausalChain([
        {
          sourceDomain: 'ERP-A',
          targetDomain: 'Holding',
          mechanism: 'EBITDA Covenants',
          triggerMetric: 'ebitda',
          triggerValue: 'R$ 1.2M',
          impactSeverity: 'CRITICAL'
        }
      ]);

      assert.equal(traces.length, 1);
      assert.ok(traces[0].includes('ERP-A'));
      assert.ok(traces[0].includes('Holding'));
      assert.ok(traces[0].includes('EBITDA Covenants'));
    });

    it('should detect cyclic dependencies in causal chains', () => {
      const engine = new CausalChainEngine();
      
      const cyclicVectors = [
        {
          sourceDomain: 'ERP-A',
          targetDomain: 'ERP-B',
          mechanism: 'covenant-check',
          triggerMetric: 'liq',
          triggerValue: 10,
          impactSeverity: 'MEDIUM' as const
        },
        {
          sourceDomain: 'ERP-B',
          targetDomain: 'ERP-C',
          mechanism: 'covenant-check',
          triggerMetric: 'liq',
          triggerValue: 10,
          impactSeverity: 'MEDIUM' as const
        },
        {
          sourceDomain: 'ERP-C',
          targetDomain: 'ERP-A',
          mechanism: 'covenant-check',
          triggerMetric: 'liq',
          triggerValue: 10,
          impactSeverity: 'MEDIUM' as const
        }
      ];

      assert.ok(engine.hasCyclicDependency(cyclicVectors));

      const acyclicVectors = [
        {
          sourceDomain: 'ERP-A',
          targetDomain: 'ERP-B',
          mechanism: 'covenant-check',
          triggerMetric: 'liq',
          triggerValue: 10,
          impactSeverity: 'MEDIUM' as const
        },
        {
          sourceDomain: 'ERP-B',
          targetDomain: 'ERP-C',
          mechanism: 'covenant-check',
          triggerMetric: 'liq',
          triggerValue: 10,
          impactSeverity: 'MEDIUM' as const
        }
      ];

      assert.equal(engine.hasCyclicDependency(acyclicVectors), false);
    });
  });

  describe('5. RegulatoryAssuranceEngine', () => {
    it('should check evidence package completeness and calculate coverage', () => {
      const regEngine = new RegulatoryAssuranceEngine();
      const evidenceEngine = new FiduciaryEvidenceEngine();

      const completePkg = evidenceEngine.compileEvidence({
        sourceReferences: ['A'],
        causalDependencies: ['B'],
        calculationLineage: ['C'],
        runtimeAssumptions: ['D'],
        confidenceDerivation: ['E'],
        severityPropagation: ['F'],
        decisionDependencies: ['G'],
        simulationAssumptions: ['H'],
        treasuryDependencies: ['I'],
        survivabilityDependencies: ['J']
      });

      const incompletePkg = evidenceEngine.compileEvidence({
        sourceReferences: ['A'],
        causalDependencies: ['B']
      });

      assert.ok(regEngine.validateCompleteness(completePkg).complete);
      assert.equal(regEngine.validateCompleteness(incompletePkg).complete, false);
      assert.equal(regEngine.validateCompleteness(incompletePkg).missingFields.length, 8);

      const disclosuresAdequacy = regEngine.validateDisclosureAdequacy(
        ['Este relatório contém Projeções de Cenários Estressados e Covenants de Liquidez.'],
        ['Projeções de Cenários', 'Covenants']
      );
      assert.ok(disclosuresAdequacy.adequate);

      const inadequateDisclosures = regEngine.validateDisclosureAdequacy(
        ['Este relatório contém Projeções de Cenários.'],
        ['Projeções de Cenários', 'Covenants']
      );
      assert.equal(inadequateDisclosures.adequate, false);
      assert.equal(inadequateDisclosures.missing[0], 'Covenants');

      const coverage = regEngine.checkTraceabilityCoverage([
        {
          timestamp: '2026-05-30T10:00:00Z',
          runtimeSource: 'A',
          severityState: 'SAFE',
          lineageHashes: ['h1'],
          confidenceState: 'HIGH',
          failClosedPropagation: false,
          certificationState: 'A'
        },
        {
          timestamp: '2026-05-30T10:01:00Z',
          runtimeSource: 'B',
          severityState: 'SAFE',
          lineageHashes: [], // no hashes
          confidenceState: 'HIGH',
          failClosedPropagation: false,
          certificationState: 'A'
        }
      ]);
      assert.equal(coverage, 50);
    });
  });

  describe('6. EvidenceIntegrityEngine', () => {
    it('should validate evidence package signature and detect orphans', () => {
      const integrity = new EvidenceIntegrityEngine();
      const evidence = new FiduciaryEvidenceEngine();

      const pkg = evidence.compileEvidence({
        sourceReferences: ['ERP-01', 'ERP-02'],
        causalDependencies: ['ERP-01', 'UNTRACKED-COVENANT']
      });

      assert.ok(integrity.validateSignature(pkg));

      // Tamper with package
      pkg.sourceReferences.push('ERP-03');
      assert.equal(integrity.validateSignature(pkg), false);

      // Orphan check
      const orphans = integrity.detectOrphanedDependencies(
        pkg.causalDependencies,
        pkg.sourceReferences
      );
      assert.ok(orphans.hasOrphans);
      assert.deepEqual(orphans.orphans, ['UNTRACKED-COVENANT']);
    });
  });

  describe('7. InstitutionalForensicsEngine', () => {
    it('should identify fiduciary breaches, destructive patterns, and loops', () => {
      const forensics = new InstitutionalForensicsEngine();
      
      const healthyTrail: AuditTrailEntry[] = [
        { timestamp: '1', runtimeSource: 'A', severityState: 'SAFE', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: false, certificationState: 'A' }
      ];
      assert.equal(forensics.analyzeTrails(healthyTrail).length, 0);

      const unhealthyTrail: AuditTrailEntry[] = [
        { timestamp: '1', runtimeSource: 'A', severityState: 'SAFE', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: true, certificationState: 'A' }, // Breach!
        { timestamp: '2', runtimeSource: 'B', severityState: 'CRITICAL', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: false, certificationState: 'A' },
        { timestamp: '3', runtimeSource: 'C', severityState: 'CRITICAL', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: false, certificationState: 'A' },
        { timestamp: '4', runtimeSource: 'D', severityState: 'CRITICAL', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: false, certificationState: 'A' }, // Destructive!
        { timestamp: '5', runtimeSource: 'E', severityState: 'FAIL_CLOSED', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: false, certificationState: 'A' },
        { timestamp: '6', runtimeSource: 'F', severityState: 'FAIL_CLOSED', lineageHashes: ['h'], confidenceState: 'H', failClosedPropagation: false, certificationState: 'A' } // Loop!
      ];

      const findings = forensics.analyzeTrails(unhealthyTrail);
      assert.ok(findings.some(f => f.type === 'FIDUCIARY_BREACH'));
      assert.ok(findings.some(f => f.type === 'DESTRUCTIVE_PATTERN'));
      assert.ok(findings.some(f => f.type === 'FAILURE_LOOP'));
    });
  });

  describe('8. AuditReconstructionEngine', () => {
    it('should normalize volatile fields recursively', () => {
      const recon = new AuditReconstructionEngine();
      const obj1 = {
        id: '123-uuid',
        timestamp: '2026-05-30T10:15:30Z',
        durationMs: 154,
        environmentMetadata: { host: 'prod-node-1', region: 'us-east' },
        values: ['x', 'y', 'z']
      };

      const normalized = recon.normalize(obj1);
      assert.equal(normalized.id, 'NORMALIZED_ID');
      assert.equal(normalized.timestamp, 'NORMALIZED_TIMESTAMP');
      assert.equal(normalized.durationMs, 0);
      assert.equal(normalized.environmentMetadata, 'NORMALIZED_ENV');
    });

    it('should validate original vs reconstructed with dual standard', () => {
      const recon = new AuditReconstructionEngine();
      
      const original = {
        sourceInputs: { data: 'normalized-raw-input' },
        lineageHash: 'SHA256-abcdef',
        signature: 'SIG-12345',
        metrics: { ebitda: '1000.00', leverage: 2.5 },
        severityClassification: 'ESTÁVEL',
        timestamp: '2026-05-30T10:00:00Z'
      };

      // Exact copy with volatile changes (e.g. timestamp) and minor formatting (ebitda: 1000)
      const reconstructedSuccess = {
        sourceInputs: { data: 'normalized-raw-input' },
        lineageHash: 'SHA256-abcdef',
        signature: 'SIG-12345',
        metrics: { ebitda: 1000, leverage: '2.5' },
        severityClassification: 'Estável',
        timestamp: '2026-05-30T10:05:00Z' // different timestamp
      };

      const successResult = recon.verifyReconstruction(original, reconstructedSuccess);
      assert.ok(successResult.verified);
      assert.equal(successResult.discrepancies.length, 0);

      // Broken strict identity field
      const reconstructedBrokenStrict = {
        ...reconstructedSuccess,
        lineageHash: 'SHA256-different'
      };
      const brokenStrictResult = recon.verifyReconstruction(original, reconstructedBrokenStrict);
      assert.equal(brokenStrictResult.verified, false);
      assert.ok(brokenStrictResult.discrepancies.some(d => d.includes('Identidade Estrita')));

      // Broken semantic equivalence field
      const reconstructedBrokenSemantic = {
        ...reconstructedSuccess,
        severityClassification: 'CRÍTICO'
      };
      const brokenSemanticResult = recon.verifyReconstruction(original, reconstructedBrokenSemantic);
      assert.equal(brokenSemanticResult.verified, false);
      assert.ok(brokenSemanticResult.discrepancies.some(d => d.includes('Equivalência Semântica')));
    });
  });

  describe('9. AssuranceCertificationEngine', () => {
    it('should compute scores and grade correctly', () => {
      const cert = new AssuranceCertificationEngine();
      const scores = {
        auditabilityScore: 90,
        explainabilityScore: 90,
        evidenceIntegrityScore: 90,
        lineageReproducibilityScore: 90,
        regulatoryReadinessScore: 90
      };

      const result = cert.certify(
        scores,
        {
          brokenLineage: false,
          orphanedDependency: false,
          nonReproducibleOutput: false,
          tamperedEvidenceSignature: false,
          missingEvidencePackage: false,
          failedReconstruction: false,
          activeFailClosedState: false
        },
        {
          allEvidenceDimensionsPresent: true,
          causalChainReconstructable: true,
          hasDisclosureIssues: false
        }
      );

      assert.equal(result.classification, 'AUDIT_READY');
      assert.equal(result.grade, 'A');
      assert.equal(result.overallScore, 90);
      assert.equal(result.vetoTriggered, false);
    });

    it('should enforce veto overrides to FAIL_CLOSED and Grade F', () => {
      const cert = new AssuranceCertificationEngine();
      const scores = {
        auditabilityScore: 95,
        explainabilityScore: 95,
        evidenceIntegrityScore: 95,
        lineageReproducibilityScore: 95,
        regulatoryReadinessScore: 95
      };

      // Veto: broken lineage
      const result = cert.certify(
        scores,
        {
          brokenLineage: true,
          orphanedDependency: false,
          nonReproducibleOutput: false,
          tamperedEvidenceSignature: false,
          missingEvidencePackage: false,
          failedReconstruction: false,
          activeFailClosedState: false
        },
        {
          allEvidenceDimensionsPresent: true,
          causalChainReconstructable: true,
          hasDisclosureIssues: false
        }
      );

      assert.equal(result.classification, 'FAIL_CLOSED');
      assert.equal(result.grade, 'F');
      assert.equal(result.vetoTriggered, true);
      assert.ok(result.triggeredVetoes.includes('broken lineage'));
    });
  });

  describe('10. InstitutionalAuditEngine', () => {
    it('should register audits and compile compliance report', () => {
      const auditEngine = new InstitutionalAuditEngine();
      
      const mockMeta = (id: string, grade: 'A'|'F', classification: any, score: number): any => ({
        auditId: id,
        classification,
        grade,
        scores: { overallScore: score },
        causalChainTrace: ['chain-link-1'],
        evidencePackage: { signature: 'sig-test' },
        reconstructionVerified: true,
        correlationId: 'c1',
        timestamp: new Date().toISOString()
      });

      auditEngine.registerAudit(mockMeta('aud-1', 'A', 'AUDIT_READY', 95));
      auditEngine.registerAudit(mockMeta('aud-2', 'F', 'FAIL_CLOSED', 40));

      const report = auditEngine.inspectAuditHistory();
      assert.equal(report.totalAudits, 2);
      assert.equal(report.failClosedCount, 1);
      assert.equal(report.auditReadyCount, 1);
      assert.equal(report.gradeDistribution.A, 1);
      assert.equal(report.gradeDistribution.F, 1);

      const asciiLog = auditEngine.generateCertifiedLog();
      assert.ok(asciiLog.includes('SOVEREIGN AUDIT & REGULATORY ASSURANCE TRAIL LOG'));
      assert.ok(asciiLog.includes('aud-1'));
      assert.ok(asciiLog.includes('FAIL_CLOSED'));
    });
  });

  describe('11. ExecutiveAssuranceRuntime (End-to-End Orchestrator)', () => {
    it('should evaluate a fully compliant execution as AUDIT_READY', () => {
      const runtime = new ExecutiveAssuranceRuntime();

      const originalPayload = {
        sourceInputs: 'raw-data-erp',
        lineageHash: 'LINEAGE-001',
        signature: 'SIG-ORIGINAL',
        metrics: { debt: 5000 }
      };

      const metadata = runtime.evaluateExecution({
        correlationId: 'corr-e2e-ok',
        evidenceInputs: {
          sourceReferences: ['ERP-01'],
          causalDependencies: ['ERP-01'],
          calculationLineage: ['CALC-01'],
          runtimeAssumptions: ['INF-01'],
          confidenceDerivation: ['CONF-01'],
          severityPropagation: ['SEV-01'],
          decisionDependencies: ['DEC-01'],
          simulationAssumptions: ['SIM-01'],
          treasuryDependencies: ['TRES-01'],
          survivabilityDependencies: ['SURV-01']
        },
        explainabilityInputs: {
          isDecisionBlocked: false,
          isSeverityEscalated: false
        },
        causalVectors: [
          {
            sourceDomain: 'ERP-01',
            targetDomain: 'Holding',
            mechanism: 'covenant',
            triggerMetric: 'debt',
            triggerValue: 5000,
            impactSeverity: 'MEDIUM'
          }
        ],
        trailEntries: [
          {
            runtimeSource: 'ERP-01',
            severityState: 'SAFE',
            lineageHashes: ['LINEAGE-001'],
            confidenceState: 'HIGH',
            failClosedPropagation: false,
            certificationState: 'A'
          }
        ],
        reconstructionPayload: {
          original: originalPayload,
          reconstructed: originalPayload
        },
        mandatoryDisclosures: ['covenant'],
        availableDisclosures: ['Covenant de Dívida ativo']
      });

      assert.equal(metadata.classification, 'AUDIT_READY');
      assert.equal(metadata.grade, 'A');
      assert.ok(metadata.lineageHash);
      assert.ok(metadata.reconstructionVerified);
    });

    it('should block and force FAIL_CLOSED / Grade F when a veto rule triggers', () => {
      const runtime = new ExecutiveAssuranceRuntime();

      const metadata = runtime.evaluateExecution({
        correlationId: 'corr-e2e-veto',
        evidenceInputs: {
          sourceReferences: ['ERP-01'],
          causalDependencies: ['ERP-01'],
          calculationLineage: ['CALC-01'],
          runtimeAssumptions: ['INF-01'],
          confidenceDerivation: ['CONF-01'],
          severityPropagation: ['SEV-01'],
          decisionDependencies: ['DEC-01'],
          simulationAssumptions: ['SIM-01'],
          treasuryDependencies: ['TRES-01'],
          survivabilityDependencies: ['SURV-01']
        },
        explainabilityInputs: {
          isDecisionBlocked: true, // triggers veto: active fail-closed/blocked state
          decisionBlockTrigger: 'Caixa de contingência exaurido'
        },
        causalVectors: [
          {
            sourceDomain: 'ERP-01',
            targetDomain: 'Holding',
            mechanism: 'covenant',
            triggerMetric: 'debt',
            triggerValue: 5000,
            impactSeverity: 'MEDIUM'
          }
        ],
        trailEntries: [
          {
            runtimeSource: 'ERP-01',
            severityState: 'SAFE',
            lineageHashes: ['LINEAGE-001'],
            confidenceState: 'HIGH',
            failClosedPropagation: false,
            certificationState: 'A'
          }
        ],
        reconstructionPayload: {
          original: { sourceInputs: 'A' },
          reconstructed: { sourceInputs: 'A' }
        }
      });

      assert.equal(metadata.classification, 'FAIL_CLOSED');
      assert.equal(metadata.grade, 'F');
    });
  });
});
