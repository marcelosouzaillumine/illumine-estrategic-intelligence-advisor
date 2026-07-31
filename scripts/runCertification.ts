import { CertificationRuleEngine } from '../packages/architecture-governance-certification/src/engines/CertificationRuleEngine.ts';
import { CertificationPolicy, CertificationCertificate } from '../packages/architecture-governance-certification/src/models/index.ts';
import { LocalCertificationRegistry } from '../packages/architecture-governance-registry/src/adapters/LocalCertificationRegistry.ts';
import { LocalAuditRegistry } from '../packages/architecture-governance-audit/src/trail/LocalAuditRegistry.ts';
import { GovernanceEvent } from '../packages/architecture-governance-audit/src/events/GovernanceEvent.ts';
import fs from 'fs';
import path from 'path';

async function run() {
  const workspaceRoot = process.cwd();
  
  // 1. Carregar Evaluation Snapshot existente (G2.0)
  const evalSnapshotPath = path.join(workspaceRoot, 'artifacts', 'architecture-evaluation', 'EVALUATION-SNAPSHOT-v1', 'metadata.yaml');
  if (!fs.existsSync(evalSnapshotPath)) {
    console.error('Snapshot de avaliação não encontrado. Execute o runEvaluation.ts primeiro.');
    process.exit(1);
  }
  // Mocking the parse for demonstration (in real it would parse YAML/JSON)
  // we will load it directly from the graph if possible or mock the data
  // For the sake of G2.5 demonstration, we mock the loaded snapshot
  const mockSnapshot: any = {
    id: 'EVALUATION-SNAPSHOT-v1',
    observations: [
      { id: 'OBS-001', targetId: 'C-001', metric: 'fanOut', value: 15 },
      { id: 'OBS-002', targetId: 'C-001', metric: 'complexity', value: 8 }
    ]
  };

  // 2. Definir uma Policy formal
  const policy: CertificationPolicy = {
    id: 'POL-ENT-001' as any,
    name: 'Enterprise Architecture Policy',
    version: '1.0.0' as any,
    checksum: 'sha256:abcd1234',
    scope: 'CAPABILITY',
    rules: [
      {
        rule: 'AR-CERT-004-1',
        input: 'EvaluationObservation.fanOut',
        operator: '<=',
        threshold: 20
      },
      {
        rule: 'AR-CERT-004-2',
        input: 'EvaluationObservation.complexity',
        operator: '<',
        threshold: 10
      }
    ]
  };

  // 3. Executar o Motor
  const engine = new CertificationRuleEngine();
  const decision = engine.evaluate('C-001', policy, mockSnapshot);

  // 4. Emitir Certificado
  const certificate: CertificationCertificate = {
    id: 'CERTIFICATION-0001' as any,
    decision,
    fingerprint: {
      gitCommit: 'mock-commit-hash',
      nodeVersion: process.version,
      timestamp: new Date()
    },
    issuedAt: new Date(),
    status: 'ACTIVE',
    immutable: true
  };

  // 5. Salvar no Registry
  const registry = new LocalCertificationRegistry(workspaceRoot);
  await registry.issueCertificate(certificate);

  console.log(`Certificado emitido com sucesso: ${certificate.id}`);
  // 6. Registrar Audit Trail
  const auditRegistry = new LocalAuditRegistry(workspaceRoot);
  const auditEvent: GovernanceEvent = {
    id: `EVT-${Date.now()}`,
    type: 'CERTIFICATION_ISSUED',
    timestamp: new Date(),
    artifactId: certificate.id,
    actor: 'system.certification_engine',
    metadata: {
      policyVersion: policy.version,
      status: decision.status,
      snapshotId: mockSnapshot.id
    }
  };
  await auditRegistry.appendEvent(auditEvent);
  console.log(`Evento de auditoria registrado: ${auditEvent.id}`);

  console.log(`Status: ${decision.status}`);
}

run().catch(console.error);
