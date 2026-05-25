import * as fs from 'fs';
import * as path from 'path';

function runDataIntegrationAudit() {
  console.log('Iniciando Consolidated Data Integration Audit (Active Governance)...\n');

  const dataLayerPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'consolidated', 'data');
  let violations = 0;

  if (!fs.existsSync(dataLayerPath)) {
    console.error('❌ CRITICAL: Pasta Data Layer consolidada não encontrada.');
    process.exit(1);
  }

  const filesToCheck = fs.readdirSync(dataLayerPath)
    .filter(f => f.endsWith('.ts') && f !== 'DemoGroupFixture.ts' && f !== 'dataTypes.ts')
    .map(f => path.join(dataLayerPath, f));

  // Regras de Active Governance para Data Layer
  const BANNED_PATTERNS = [
    { regex: /import.*(ConsolidatedFinancialOrchestrator|ConsolidatedAdvisoryOrchestrator|TemporalCausalityEngine|evaluateMasterCausality)/g, message: 'Data Layer importou Orquestrador ou Engine. (Fere isolamento).' },
    { regex: /\.reduce\s*\(/g, message: 'Uso de .reduce() detectado. Data Layer não pode fazer agregação financeira.' },
    { regex: /calculate[A-Z]/g, message: 'Uso de função calculate*() detectado.' },
    { regex: /narrative\s*:|strategicAlerts\s*:/g, message: 'Geração de advisory textual dentro da camada Data.' },
    { regex: /if\s*\(!hasBP\)\s*\{\s*(bp\s*=\s*\[\]|return\s*\[\])/g, message: 'Possível fallback silencioso mascarando dados ausentes.' }, // Esse regex seria muito restrito, deixaremos genérico abaixo.
    { regex: /DEMO_GROUP_FIXTURE/g, message: 'Mock hardcoded vazando para Repositories/Loaders reais.' }
  ];

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    BANNED_PATTERNS.forEach(pattern => {
      // Evitar falso positivo na Validation Gateway onde pode ter fallback estrutural (mas não matemático)
      if (fileName === 'ConsolidatedDataValidationGateway.ts' && pattern.regex.toString().includes('fallback')) return;

      const matches = content.match(pattern.regex);
      if (matches) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${fileName}`);
        violations++;
      }
    });

    // Validar se tem somas genéricas + (que não seja de concatenação de string)
    const sumMatches = content.match(/ (value|\w+)\s*\+\s*(value|\w+)/g);
    if (sumMatches) {
       console.error(`❌ VIOLATION: Possível soma matemática detectada na Data Layer. Arquivo: ${fileName}`);
       violations++;
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Data Integration. Foram detectadas ${violations} violações de Active Governance na extração de dados.`);
    process.exit(1);
  } else {
    console.log('✅ Todas as Repositories e Loaders são condutores puros de dados. Nenhuma manipulação matemática ou narrativa encontrada.');
    console.log('\nConsolidated Data Integration Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runDataIntegrationAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
