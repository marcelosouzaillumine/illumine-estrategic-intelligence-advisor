import * as fs from 'fs';
import * as path from 'path';

function runReportingGovernanceAudit() {
  console.log('Iniciando Reporting Governance Audit (Active Governance)...\n');

  const reportingPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'reporting');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'pages', 'InstitutionalReportsPage.tsx');

  let violations = 0;
  const filesToCheck: string[] = [];

  if (fs.existsSync(uiPath)) {
    filesToCheck.push(uiPath);
  } else {
    console.warn('⚠️ InstitutionalReportsPage.tsx não encontrado.');
  }

  if (fs.existsSync(reportingPath)) {
    const reportFiles = fs.readdirSync(reportingPath)
      .filter(f => f.endsWith('.ts') && f !== 'ReportingTypes.ts')
      .map(f => path.join(reportingPath, f));
    filesToCheck.push(...reportFiles);
  } else {
    console.error('❌ CRITICAL: Pasta Reporting não encontrada.');
    process.exit(1);
  }

  // Regras de Active Governance para Reporting
  const BANNED_PATTERNS = [
    { regex: /ConsolidatedFinancialOrchestrator/g, message: 'Tentativa de importar Motor Financeiro na camada de Relatórios. Relatório não calcula, apenas consome.' },
    { regex: /ScenarioSimulationEngine/g, message: 'Tentativa de importar Motor de Cenários na camada de Relatórios. Relatório não simula, apenas consome.' },
    { regex: /advisory\.executiveSummary\s*=/g, message: 'Tentativa de mutação de Advisory em tempo de formatação. Isolamento violado.' },
    { regex: /Math\./g, message: 'Encontrada biblioteca Math em Reporting. Reporting não pode fazer operações numéricas.' },
    { regex: /calculate/i, message: 'Função de cálculo detectada em Reporting. Reporting deve apenas organizar.' }
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

    // Validar Snapshot Builder
    if (fileName === 'FiduciarySnapshotBuilder.ts') {
        if (content.includes('bpByEntity') || content.includes('dreByEntity')) {
           console.error(`❌ VIOLATION: FiduciarySnapshotBuilder não deve salvar BP/DRE completos. Salve apenas outputs e referencie o LineageHash. Arquivo: ${fileName}`);
           violations++;
        }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Reporting. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Camada de Reporting opera em modo Fiduciário. Apenas outputs estão sendo formatados, preservando o Lineage.');
    console.log('\nReporting Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runReportingGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
