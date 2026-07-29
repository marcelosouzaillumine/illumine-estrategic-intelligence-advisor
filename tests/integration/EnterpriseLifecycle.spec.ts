import { metadataRegistry } from '../../packages/metadata/src/registry/metadata-registry';
import { EUCCompilerEngine } from '../../packages/compiler/src/compiler-engine';
import { RuntimeEngine } from '../../packages/runtime/src/engine/runtime-engine';
import { SemanticExecutionEngine } from '../../packages/see/src/engine/semantic-execution-engine';
import { CertificateEngine } from '../../packages/certification/src/certification/certificate-engine';

export interface EnterpriseLifecycleResult {
  status: 'CERTIFIED' | 'FAILED';
  architectureLevel: 'L4';
  confidenceScore: number;
  evidenceHash: string;
  certifiedAt: string;
}

export function runEnterpriseLifecycleTest(): EnterpriseLifecycleResult {
  // 1. Business Intent & Metadata Generation
  metadataRegistry.registerEntity({
    id: 'treasury_pool',
    version: '1.0.0',
    name: 'Treasury Pool',
    domain: 'FinancialGovernance',
    architecture: 'EAA',
    fields: [{ id: 'liquidity_index', labelKey: 'Índice de Liquidez', type: 'number', required: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'EnterpriseLifecycleSpec',
    status: 'STABLE'
  });

  // 2. Manifest Creation & Compiler AST
  const rawManifest = {
    id: 'financial.governance.treasury',
    type: 'EAA',
    layout: { template: 'ExecutiveDashboard' },
    widgets: ['KPI_CARD', 'EXECUTIVE_CHART', 'DATA_TABLE']
  };
  const ast = EUCCompilerEngine.compile(rawManifest);

  // 3. Runtime Execution
  const rootNode = RuntimeEngine.execute({
    id: ast.name,
    type: 'EAA',
    layout: { template: 'ExecutiveDashboard' },
    widgets: ['KPI_CARD', 'EXECUTIVE_CHART', 'DATA_TABLE']
  });

  if (!rootNode || rootNode.type !== 'ExecutivePageTemplate') {
    throw new Error('Falha no teste E2E: Nó raiz da ERE Runtime não é ExecutivePageTemplate');
  }

  // 4. Semantic Execution Engine (SEE)
  const seeResult = SemanticExecutionEngine.execute({
    intent: 'FinancialDashboardAccess',
    actor: { userId: 'usr-cfo', roles: ['CFO', 'BOARD_MEMBER'] },
    context: { domain: 'FinancialGovernance' }
  });

  if (seeResult.decision !== 'ALLOW') {
    throw new Error('Falha no teste E2E: Decisão semântica SEE negada');
  }

  // 5. Certification Engine L4 & Evidence Bundle
  const cert = CertificateEngine.certifyL4(rawManifest.id);

  return {
    status: 'CERTIFIED',
    architectureLevel: 'L4',
    confidenceScore: seeResult.confidenceScore,
    evidenceHash: cert.evidenceHash,
    certifiedAt: cert.certifiedAt
  };
}
