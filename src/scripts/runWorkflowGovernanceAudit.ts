import * as fs from 'fs';
import * as path from 'path';

function runWorkflowGovernanceAudit() {
  console.log('Iniciando Workflow Governance Audit (Active Governance)...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components');
  const workflowEnginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'workflow-governance');
  
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

  const uiFiles = scanDir(componentsPath);
  const UI_BANNED_PATTERNS = [
    { regex: /localStorage\.set.*workflow/gi, message: 'Estado do Workflow persistido localmente em localStorage.' },
    { regex: /indexedDB/gi, message: 'IndexedDB detectado para estado volátil de workflow.' }
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

  if (fs.existsSync(workflowEnginePath)) {
    const engineFiles = scanDir(workflowEnginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /confidence\s*=/gi, message: 'Workflow Engine tentando alterar confidence.' },
      { regex: /advisory\s*=/gi, message: 'Workflow Engine tentando alterar advisory original.' },
      { regex: /setInterval\(/g, message: 'Scheduler ilegal detectado na Workflow Engine.' }
    ];

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      ENGINE_BANNED_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
          violations++;
        }
      });
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Workflow Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI está livre de persistência insegura e recálculos indevidos.');
    console.log('✅ WorkflowEngine operando passivamente (Truth Layer Preserved).');
    console.log('\nWorkflow Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runWorkflowGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
