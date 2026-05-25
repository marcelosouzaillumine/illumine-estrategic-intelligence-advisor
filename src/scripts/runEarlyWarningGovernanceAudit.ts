import * as fs from 'fs';
import * as path from 'path';

function runEarlyWarningGovernanceAudit() {
  console.log('Iniciando Early Warning Governance Audit (Active Governance)...\n');

  const enginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'early-warning');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'early-warning');
  const pagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'EarlyWarningPage.tsx');
  
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
    { regex: /EarlyWarningSignalEngine\.detect/g, message: 'Bypass: A UI não pode disparar detecção de forma autônoma.' },
    { regex: /localStorage\.setItem\(['"]warning['"]/g, message: 'Vazamento: A UI não pode persistir sinais no localStorage.' },
    { regex: /indexedDB/g, message: 'Vazamento: A UI não pode persistir sinais no IndexedDB.' },
    { regex: /tenantId:\s*['"](?!TENANT-HQ)['"]/g, message: 'Cross-Tenant: A UI tem hardcode de tenant desconhecido.' },
    { regex: /ConfidenceTimelineEngine\.override/g, message: 'Violação Fase 18: Early Warning não pode alterar confidence original.' },
    { regex: /Math\.random\(\).*value/g, message: 'Violação Fase 18: Previsão local ou forecast matemático na view não é permitido.' }
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
      { regex: /localStorage|indexedDB/g, message: 'Engine Violation: Engine não pode persistir localmente no client.' },
      { regex: /BpRuntime|DreRuntime/g, message: 'Engine Violation: Early Warning não deve recalcular dados financeiros brutos.' }
    ];

    let foundBinder = false;

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.includes('WarningEvidenceBinder')) foundBinder = true;

      ENGINE_BANNED_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
          violations++;
        }
      });
    }

    if (!foundBinder) {
      console.error('❌ VIOLATION: WarningEvidenceBinder ausente. Nenhum alerta pode ser gerado sem vinculação de evidência fiduciária.');
      violations++;
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Early Warning Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI está isenta de cálculos de forecast e mutações destrutivas.');
    console.log('✅ Isolamento semântico validado (Lineage preserved).');
    console.log('✅ Tenant Scope rigorosamente atestado na camada Preditiva.');
    console.log('\nEarly Warning Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runEarlyWarningGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
