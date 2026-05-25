import * as fs from 'fs';
import * as path from 'path';

function runTenancyGovernanceAudit() {
  console.log('Iniciando Tenancy Governance Audit (Active Governance)...\n');

  const tenancyPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'tenancy');
  const uiPaths = [
    path.join(process.cwd(), 'src', 'components', 'pages', 'AdvisorCockpitPage.tsx'),
    path.join(process.cwd(), 'src', 'components', 'pages', 'TenantGovernancePage.tsx'),
    path.join(process.cwd(), 'src', 'context', 'TenancyProvider.tsx'),
    path.join(process.cwd(), 'src', 'components', 'tenancy', 'WorkspaceSwitcher.tsx')
  ];

  let violations = 0;
  const filesToCheck: string[] = [];

  uiPaths.forEach(p => {
    if (fs.existsSync(p)) filesToCheck.push(p);
  });

  if (fs.existsSync(tenancyPath)) {
    const tenancyFiles = fs.readdirSync(tenancyPath)
      .filter(f => f.endsWith('.ts') && f !== 'TenancyTypes.ts')
      .map(f => path.join(tenancyPath, f));
    filesToCheck.push(...tenancyFiles);
    
    // Add Orchestrators for checking
    filesToCheck.push(path.join(process.cwd(), 'src', 'core', 'runtime', 'consolidated', 'ConsolidatedRuntimeOrchestrator.ts'));
    filesToCheck.push(path.join(process.cwd(), 'src', 'core', 'orchestration', 'executiveOrchestrationEngine.ts'));

  } else {
    console.error('❌ CRITICAL: Pasta Tenancy não encontrada.');
    process.exit(1);
  }

  // Regras de Active Governance para Tenancy
  const BANNED_PATTERNS = [
    { regex: /ConsolidatedFinancialOrchestrator\.run\(/g, message: 'Tentativa de invocar Orchestrator diretamente da camada de Tenancy sem passar pelo Wrapper.' },
    { regex: /ScenarioSimulationEngine\.run\(/g, message: 'Tentativa de invocar Scenario Engine diretamente sem isolamento.' },
    { regex: /getDocs\(collection\(db,\s*'clients'\)\)/g, message: 'Query global (getDocs) sem filtro de tenant detectada. Leakage risk.' },
    { regex: /localStorage\.setItem\('tenant'/i, message: 'Cache local persistente de tenant detectado. Use o Provider de memória para evitar leakage pós-logout.' }
  ];

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    BANNED_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${fileName}`);
        violations++;
      }
    });

    // Validar se orquestradores importam o TenantGovernanceEnforcer
    if (fileName.includes('Orchestrator.ts')) {
      if (!content.includes('TenantGovernanceEnforcer.enforceConsolidationBoundaries')) {
        console.error(`❌ VIOLATION: Orquestrador institucional (${fileName}) operando sem TenantExecutionContext válido. Isolamento ausente.`);
        violations++;
      }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Tenancy. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Isolamento Multi-Tenant preservado. Orquestradores utilizam TenantExecutionContext. Zero Cross-Tenant Leakage detectado em código estático.');
    console.log('\nTenancy Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runTenancyGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
