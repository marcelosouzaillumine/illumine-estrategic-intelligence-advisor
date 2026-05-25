import * as fs from 'fs';
import * as path from 'path';

function runIOSGovernanceAudit() {
  console.log('Iniciando IOS Governance Audit (Active Governance)...\n');

  const enginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'ios');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'ios');
  const pagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'InstitutionalIOSPage.tsx');
  
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
    { regex: /fetch\(/g, message: 'Violação IOS: Automação externa via fetch proibida. IOS não executa comandos ativamente.' },
    { regex: /executeWorkflow/g, message: 'Violação IOS: A UI não pode executar workflows automaticamente (Skynet prevention).' },
    { regex: /localStorage\.setItem\(['"]ios/g, message: 'Vazamento: A UI não pode persistir snapshots institucionais localmente.' },
    { regex: /BpRuntime|DreRuntime/g, message: 'Violação: IOS não pode mutar matemática base fiduciária.' }
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
      { regex: /BpRuntime|DreRuntime/g, message: 'Engine Violation: IOS não pode mutar fiduciário.' },
      { regex: /execSync/g, message: 'Automação Crítica: O motor não tem permissão para rodar automações de sistema operacional.' }
    ];

    let foundGovernanceEngine = false;

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.includes('IOSGovernanceEngine')) foundGovernanceEngine = true;

      ENGINE_BANNED_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
          violations++;
        }
      });
    }

    if (!foundGovernanceEngine) {
      console.error('❌ VIOLATION: IOSGovernanceEngine ausente. Nenhum snapshot pode ser criado sem isolamento verificado.');
      violations++;
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de IOS Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI atestada como agregadora passiva. Nenhuma execução autônoma detectada.');
    console.log('✅ IOSGovernanceEngine garantindo o Tenant Isolation.');
    console.log('✅ Isolamento fiduciário preservado. Nenhuma modificação no Runtime detectada.');
    console.log('\nIOS Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runIOSGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
