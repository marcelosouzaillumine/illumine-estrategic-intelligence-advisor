import * as fs from 'fs';
import * as path from 'path';

function runScenarioGovernanceAudit() {
  console.log('Iniciando Scenario Governance Audit (Active Governance)...\n');

  const scenarioPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'scenario');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'pages', 'ScenarioLabPage.tsx');

  let violations = 0;
  const filesToCheck: string[] = [];

  if (fs.existsSync(uiPath)) {
    filesToCheck.push(uiPath);
  } else {
    console.warn('⚠️ ScenarioLabPage.tsx não encontrado.');
  }

  if (fs.existsSync(scenarioPath)) {
    const scenarioFiles = fs.readdirSync(scenarioPath)
      .filter(f => f.endsWith('.ts') && f !== 'ScenarioTypes.ts')
      .map(f => path.join(scenarioPath, f));
    filesToCheck.push(...scenarioFiles);
  } else {
    console.error('❌ CRITICAL: Pasta Scenario não encontrada.');
    process.exit(1);
  }

  // Regras de Active Governance para Cenários
  const BANNED_PATTERNS = [
    { regex: /import\s+.*(?:openai|claude|gemini|@ai-sdk)/i, message: 'LLMs ou AI Generativa detectada em Runtimes de Cenário. Proibido (Violates Determinism).' },
    { regex: /historicalConfidence\s*=[^=]/g, message: 'Tentativa de mutação de Confidence Histórica. Isolamento violado.' },
    { regex: /ConsolidatedFinancialOrchestrator\.run\(/g, message: 'Chamando orquestrador financeiro real dentro da predição sem mock. Proibido.' },
    { regex: /setDoc\(doc\(db,\s*'clients'/g, message: 'Tentativa de sobrescrever dados reais da base (clients).' },
    { regex: /updateDoc\(doc\(db,\s*'clients'/g, message: 'Tentativa de atualizar dados reais da base (clients).' }
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
    if (fileName === 'ScenarioSnapshotBuilder.ts') {
        if (!content.includes('structuredClone') && !content.includes('JSON.parse(JSON.stringify')) {
           console.error(`❌ VIOLATION: ScenarioSnapshotBuilder não está fazendo deep clone. Risco de vazamento de referência de memória. Arquivo: ${fileName}`);
           violations++;
        }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Cenários. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Laboratório de Cenários opera em modo isolado (Sandbox). Nenhuma IA não determinística detectada. Snapshots protegidos contra referência de memória vazada.');
    console.log('\nScenario Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runScenarioGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
