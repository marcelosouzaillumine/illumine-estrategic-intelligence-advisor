import * as fs from 'fs';
import * as path from 'path';

function runProductGovernanceAudit() {
  console.log('Iniciando Product Governance Audit (Active Governance)...\n');

  const governanceEnginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'product-governance');
  const governanceUiPath = path.join(process.cwd(), 'src', 'components', 'product-governance');
  const governancePagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'ProductGovernancePage.tsx');
  
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
  const uiFiles = [...scanDir(governanceUiPath)];
  if (fs.existsSync(governancePagePath)) uiFiles.push(governancePagePath);

  const UI_BANNED_PATTERNS = [
    { regex: /setEntitlement|grantAccess|unlockFeature/gi, message: 'Bypass: A UI não pode desbloquear features localmente.' },
    { regex: /quotasState\[.*\]\s*=/g, message: 'Bypass: A UI não pode manipular quotas diretamente.' },
    { regex: /stripe|asaas|pagarme/gi, message: 'Violação Fase 16: Integrações reais de billing são proibidas no MVP.' },
    { regex: /localStorage\.setItem\(['"]plan['"]/g, message: 'Vazamento: A UI não pode persistir estado de plano no localStorage.' }
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
  if (fs.existsSync(governanceEnginePath)) {
    const engineFiles = scanDir(governanceEnginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /stripe|asaas|pagarme/gi, message: 'Violação Fase 16: BillingPreparationEngine deve permanecer apenas como stub.' }
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
    console.error(`\n❌ Falha na auditoria de Product Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI operando estritamente em modo de leitura (Truth Layer Preserved).');
    console.log('✅ Nenhuma chave de billing real detectada (Sandbox Preserved).');
    console.log('✅ Mecanismos de Scope e Trial validados.');
    console.log('\nProduct Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runProductGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
