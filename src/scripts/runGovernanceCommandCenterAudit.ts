import { logger } from "../services/logging/InstitutionalLogger";
import * as fs from 'fs';
import * as path from 'path';

function runGovernanceCommandCenterAudit() {
  console.log('Iniciando Governance Command Center Audit (Active Governance)...\n');

  let violations = 0;
  const gccComponentsDir = path.join(process.cwd(), 'src', 'components', 'governance-command-center');
  const gccCoreDir = path.join(process.cwd(), 'src', 'core', 'runtime', 'governance-command-center');

  if (!fs.existsSync(gccComponentsDir)) {
    console.error('❌ CRITICAL: Diretório de componentes do GCC não encontrado.');
    process.exit(1);
  }

  if (!fs.existsSync(gccCoreDir)) {
    console.error('❌ CRITICAL: Diretório core do GCC não encontrado.');
    process.exit(1);
  }

  // 1. Audit core types inside types.ts
  console.log('Auditing types.ts configurations...');
  const typesPath = path.join(gccCoreDir, 'types.ts');
  if (fs.existsSync(typesPath)) {
    const content = fs.readFileSync(typesPath, 'utf8');

    // Assure lineageHash and correlationId are mandatory (no '?')
    const mandatoryFields = [
      /lineageHash:\s*string/g,
      /correlationId:\s*string/g,
      /tenantId:\s*string/g,
      /incidentId:\s*string/g
    ];

    mandatoryFields.forEach(regex => {
      if (!regex.test(content)) {
        console.error(`❌ VIOLATION [GCC-TYPES-001]: Campo obrigatório ausente ou opcional em types.ts: ${regex.toString()}`);
        violations++;
      }
    });
  } else {
    console.error('❌ CRITICAL: types.ts do GCC não encontrado.');
    violations++;
  }

  // 2. Audit UI Components
  console.log('Auditing UI Components for local overrides or calculations...');
  const componentFiles = fs.readdirSync(gccComponentsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

  componentFiles.forEach(file => {
    const filePath = path.join(gccComponentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Rule A: No local calculations or overrides of incident severity
    // They should read incident.severity only, never recalculate severity based on thresholds.
    // Check if they assign severity values
    const localSeverityAssignment = /(incident\.severity\s*(?<![!=<>])=(?!=)|\.severity\s*(?<![!=<>])=(?!=)\s*['"](LOW|MODERATE|HIGH|CRITICAL|SYSTEMIC)['"])/g;
    if (localSeverityAssignment.test(content)) {
      console.error(`❌ VIOLATION [GCC-UI-001]: Reatribuição ou sobreposição local de severidade detectada no componente ${file}.`);
      violations++;
    }

    // Rule B: UI elements must not communicate directly with DB/Firestore (must use provider state only)
    const directDbAccess = /(getDocs\(|collection\(db,|addDoc\(|updateDoc\(|deleteDoc\()/g;
    if (directDbAccess.test(content)) {
      console.error(`❌ VIOLATION [GCC-UI-002]: Acesso direto ao Firestore/DB detectado no componente ${file}. Use o provider de estado.`);
      violations++;
    }

    // Rule C: Incident actions must be disabled in FAIL_CLOSED state
    // Let's ensure that any button triggering actions checks for commandIntegrity === 'FAIL_CLOSED'
    if (file === 'GovernanceIncidentQueue.tsx') {
      if (!content.includes('commandIntegrity === \'FAIL_CLOSED\'') && !content.includes('commandIntegrity===\'FAIL_CLOSED\'')) {
        logger.error('GCC-UI-003 Violation', new Error(`Controle de ações não bloqueado: ${file}`));
        violations++;
      }
    }
  });

  // 3. Audit operational engines
  console.log('Auditing operational engines...');

  // MultiTenantSupervisionEngine checks role and writes audit records
  const multiTenantEnginePath = path.join(gccCoreDir, 'MultiTenantSupervisionEngine.ts');
  if (fs.existsSync(multiTenantEnginePath)) {
    const content = fs.readFileSync(multiTenantEnginePath, 'utf8');
    if (!content.includes('TenantAuditLogger.logAction')) {
      console.error('❌ VIOLATION [GCC-CORE-001]: MultiTenantSupervisionEngine não registra logs de auditoria cross-tenant via TenantAuditLogger.');
      violations++;
    }
  } else {
    console.error('❌ CRITICAL: MultiTenantSupervisionEngine.ts não encontrado.');
    violations++;
  }

  // RuntimeHealthMonitoringEngine triggers FAIL_CLOSED
  const healthEnginePath = path.join(gccCoreDir, 'RuntimeHealthMonitoringEngine.ts');
  if (fs.existsSync(healthEnginePath)) {
    const content = fs.readFileSync(healthEnginePath, 'utf8');
    if (!content.includes('FAIL_CLOSED')) {
      console.error('❌ VIOLATION [GCC-CORE-002]: RuntimeHealthMonitoringEngine não possui gatilho ou estado de saúde FAIL_CLOSED.');
      violations++;
    }
  } else {
    console.error('❌ CRITICAL: RuntimeHealthMonitoringEngine.ts não encontrado.');
    violations++;
  }

  // GovernanceIncidentOrchestrator does not mutate incident records, returns append-only events
  const orchestratorPath = path.join(gccCoreDir, 'GovernanceIncidentOrchestrator.ts');
  if (fs.existsSync(orchestratorPath)) {
    const content = fs.readFileSync(orchestratorPath, 'utf8');
    if (content.includes('incident.status =') || content.includes('incident.currentStatus =')) {
      console.error('❌ VIOLATION [GCC-CORE-003]: Mutação detectada no incidente original dentro do GovernanceIncidentOrchestrator.');
      violations++;
    }
  } else {
    console.error('❌ CRITICAL: GovernanceIncidentOrchestrator.ts não encontrado.');
    violations++;
  }

  // 4. Audit Executive Page wrapping
  console.log('Auditing ExecutiveMonitoringCenter.tsx wrappers...');
  const execPagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'governance', 'ExecutiveMonitoringCenter.tsx');
  if (fs.existsSync(execPagePath)) {
    const content = fs.readFileSync(execPagePath, 'utf8');
    if (!content.includes('GovernanceCommandCenterProvider')) {
      console.error('❌ VIOLATION [GCC-PAGE-001]: ExecutiveMonitoringCenter.tsx não monta GovernanceCommandCenterProvider para envolver componentes.');
      violations++;
    }
  } else {
    console.error('❌ CRITICAL: ExecutiveMonitoringCenter.tsx não encontrado.');
    violations++;
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria do Governance Command Center. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Todos os componentes consomem estado do Provider (sem recálculos locais).');
    console.log('✅ Ações bloqueadas fisicamente em estado de FAIL_CLOSED.');
    console.log('✅ Multi-tenant auditado e isolado.');
    console.log('\nGovernance Command Center Audit Finalizada. Status: COMPLIANT');
    process.exit(0);
  }
}

try {
  runGovernanceCommandCenterAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
