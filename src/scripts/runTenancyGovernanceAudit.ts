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

  // ── Board Experience Governance ──────────────────────────────────────────
  // Rule: BoardExperienceShell MUST import RuntimeDisclosureBanner.
  // If the shell is absent, any board page component importing it is a violation.
  console.log('\nBoard Experience Governance Check...');
  const boardShellPath = path.join(process.cwd(), 'src', 'components', 'executive', 'board', 'BoardExperienceShell.tsx');
  if (!fs.existsSync(boardShellPath)) {
    console.error('❌ CRITICAL: BoardExperienceShell.tsx não encontrado. Board Experience Layer ausente.');
    violations++;
  } else {
    const shellContent = fs.readFileSync(boardShellPath, 'utf8');
    if (!shellContent.includes('RuntimeDisclosureBanner')) {
      console.error('❌ VIOLATION [BOARD-GOV-001]: BoardExperienceShell.tsx não utiliza RuntimeDisclosureBanner. Banner obrigatório ausente — violação fiduciária de Board Mode.');
      violations++;
    } else {
      console.log('  ✅ BoardExperienceShell inclui RuntimeDisclosureBanner.');
    }

    if (!shellContent.includes('BoardModeGuard')) {
      console.error('❌ VIOLATION [BOARD-GOV-002]: BoardExperienceShell.tsx não invoca BoardModeGuard. Fail-Closed ausente.');
      violations++;
    } else {
      console.log('  ✅ BoardExperienceShell invoca BoardModeGuard (Fail-Closed ativo).');
    }
  }

  // Rule: BoardModeGuard must enforce disclosureState check
  const boardGuardPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'executive', 'board', 'BoardModeGuard.ts');
  if (!fs.existsSync(boardGuardPath)) {
    console.error('❌ CRITICAL [BOARD-GOV-003]: BoardModeGuard.ts não encontrado. Fail-Closed de Board Mode ausente.');
    violations++;
  } else {
    const guardContent = fs.readFileSync(boardGuardPath, 'utf8');
    if (!guardContent.includes('disclosureState')) {
      console.error('❌ VIOLATION [BOARD-GOV-003]: BoardModeGuard.ts não verifica disclosureState. Disclosure obrigatório não aplicado.');
      violations++;
    } else {
      console.log('  ✅ BoardModeGuard verifica disclosureState (Disclosure enforcement ativo).');
    }
  }

  // ── Executive Demonstrability Governance ──────────────────────────────────
  console.log('\nExecutive Demonstrability Governance Check...');
  const demoShellPath = path.join(process.cwd(), 'src', 'components', 'executive', 'demo', 'ExecutiveDemoShell.tsx');
  if (!fs.existsSync(demoShellPath)) {
    console.error('❌ CRITICAL [DEMO-GOV-001]: ExecutiveDemoShell.tsx não encontrado.');
    violations++;
  } else {
    const demoContent = fs.readFileSync(demoShellPath, 'utf8');
    if (!demoContent.includes('RuntimeDisclosureBanner') || !demoContent.includes('ExecutiveDisclosurePanel')) {
      console.error('❌ VIOLATION [DEMO-GOV-002]: ExecutiveDemoShell.tsx deve incluir tanto RuntimeDisclosureBanner quanto ExecutiveDisclosurePanel.');
      violations++;
    } else {
      console.log('  ✅ ExecutiveDemoShell inclui Banners e Painéis de Disclosure obrigatórios.');
    }
  }

  const demoGuardPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'executive', 'demo', 'InstitutionalDemoDatasetGuard.ts');
  if (!fs.existsSync(demoGuardPath)) {
    console.error('❌ CRITICAL [DEMO-GOV-003]: InstitutionalDemoDatasetGuard.ts não encontrado.');
    violations++;
  } else {
    const guardContent = fs.readFileSync(demoGuardPath, 'utf8');
    if (!guardContent.includes('disclosureState') || !guardContent.includes('lineageIntegrityHash') || !guardContent.includes('evidenceIntegrityHash')) {
      console.error('❌ VIOLATION [DEMO-GOV-004]: InstitutionalDemoDatasetGuard.ts deve verificar disclosureState, lineageIntegrityHash e evidenceIntegrityHash.');
      violations++;
    } else {
      console.log('  ✅ InstitutionalDemoDatasetGuard possui verificações completas de Lineage/Evidence/Disclosure.');
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Tenancy + Board Experience + Demonstrability. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Isolamento Multi-Tenant preservado. Orquestradores utilizam TenantExecutionContext. Zero Cross-Tenant Leakage detectado em código estático.');
    console.log('✅ Board Experience Layer em conformidade: Banner obrigatório e Fail-Closed ativos.');
    console.log('✅ Demonstrability Layer em conformidade: Guards e Banners obrigatórios em atividade.');
    console.log('\nTenancy Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runTenancyGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
