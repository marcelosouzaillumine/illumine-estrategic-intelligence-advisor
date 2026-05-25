import * as fs from 'fs';
import * as path from 'path';

function runDataModelAudit() {
  console.log('Iniciando Consolidated Data Model Audit (Active Governance)...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components', 'pages', 'ConsolidatedGroupAdminPage.tsx');
  const dataLayerPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'consolidated', 'data');
  
  let violations = 0;

  const filesToCheck: string[] = [];

  if (fs.existsSync(componentsPath)) {
    filesToCheck.push(componentsPath);
  } else {
    console.warn('⚠️ ConsolidatedGroupAdminPage.tsx não encontrado.');
  }

  if (fs.existsSync(dataLayerPath)) {
    const dataFiles = fs.readdirSync(dataLayerPath)
      .filter(f => f.includes('Repository') || f.includes('Validator'))
      .map(f => path.join(dataLayerPath, f));
    filesToCheck.push(...dataFiles);
  }

  // Regras de Active Governance para Data Model e Onboarding
  const BANNED_PATTERNS = [
    { regex: /import.*(ConsolidatedFinancialOrchestrator|ConsolidatedAdvisoryOrchestrator)/g, message: 'Data Model Layer importou Orquestrador diretamente.' },
    { regex: /\.reduce\s*\(/g, message: 'Uso de .reduce() detectado em Repositories/Admin UI. Lógica financeira proibida no Onboarding.' },
    { regex: /calculate[A-Z]/g, message: 'Uso de função calculate*() detectado.' },
    { regex: /DEMO_GROUP_FIXTURE/g, message: 'Mock hardcoded vazando para Repositories reais.' }
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

    // Validar se o Validator existe e tem regras estruturais
    if (fileName === 'ConsolidatedDataModelValidator.ts') {
      if (!content.includes('legacyClientId')) {
         console.error(`❌ VIOLATION: Validador não protege o legacyClientId. Quebra de Legacy Bridge.`);
         violations++;
      }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Data Model. Foram detectadas ${violations} violações de Active Governance na camada de Onboarding.`);
    process.exit(1);
  } else {
    console.log('✅ A tela administrativa e as Repositories estão isentas de lógicas financeiras e de cálculos não autorizados.');
    console.log('\nConsolidated Data Model Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runDataModelAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
