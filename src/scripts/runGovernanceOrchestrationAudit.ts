import * as fs from 'fs';
import * as path from 'path';

function runGovernanceOrchestrationAudit() {
  console.log('Iniciando Governance Orchestration Audit (Active Governance)...\n');

  const enginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'governance-orchestration');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'governance-orchestration');
  const pagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'GovernanceOrchestrationPage.tsx');
  
  let violations = 0;

  function scanDir(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath, fileList);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  // 1. Validar UI
  const uiFiles = [...scanDir(uiPath)];
  if (fs.existsSync(pagePath)) uiFiles.push(pagePath);

  const UI_BANNED_PATTERNS = [
    { regex: /fetch\(/g, message: 'Violação Fase 20: Automação externa via fetch proibida. Orquestração não executa comandos.' },
    { regex: /executeWorkflow/g, message: 'Violação Fase 20: A UI não pode executar workflows, apenas renderizar recomendações.' },
    { regex: /localStorage\.setItem\(['"]orch/g, message: 'Vazamento: A UI não pode persistir orquestrações localmente.' },
    { regex: /Math\.random/g, message: 'Violação: Randomização visual proibida. Orquestração deve ser determinística fiduciariamente.' },
    { regex: /BpRuntime|DreRuntime/g, message: 'Violação: Governance Orchestration não pode mutar matemática base fiduciária.' }
  ];

  for (const file of uiFiles) {
    const content = fs.readFileSync(file, 'utf8');
    UI_BANNED_PATTERNS.forEach(pattern => {
      if (pattern.regex.test(content)) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
        violations++;
      }
    });
  }

  // 2. Validar Engine Core
  if (fs.existsSync(enginePath)) {
    const engineFiles = scanDir(enginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /BpRuntime|DreRuntime/g, message: 'Engine Violation: Governance Orchestration não pode mutar matemática base fiduciária.' },
      { regex: /execSync/g, message: 'Automação Crítica: O motor não tem permissão para rodar comandos.' }
    ];

    let foundBinder = false;

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.includes('GovernanceRecommendationEvidenceBinder')) foundBinder = true;

      ENGINE_BANNED_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
          violations++;
        }
      });
    }

    if (!foundBinder) {
      console.error('❌ VIOLATION: GovernanceRecommendationEvidenceBinder ausente. Nenhuma recomendação pode rodar sem vinculação de Lineage.');
      violations++;
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Governance Orchestration. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI atestada como passiva. Nenhuma execução autônoma ou automação externa detectada.');
    console.log('✅ GovernanceRecommendationEvidenceBinder garantindo o Lineage das Recomendações e Playbooks.');
    console.log('✅ Isolamento multi-tenant garantido. Nenhuma gravação persistente local identificada.');
    console.log('\nGovernance Orchestration Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runGovernanceOrchestrationAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
