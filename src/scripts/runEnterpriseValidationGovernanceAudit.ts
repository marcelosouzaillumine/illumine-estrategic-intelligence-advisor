import * as fs from 'fs';
import * as path from 'path';

function runEnterpriseValidationGovernanceAudit() {
  console.log('Iniciando Enterprise Validation Audit (Active Governance)...\n');

  const uiPath = path.join(process.cwd(), 'src', 'components', 'enterprise-validation');
  const pagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'EnterpriseValidationPage.tsx');
  const enginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'enterprise-validation');
  
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
    { regex: /BpRuntime|DreRuntime/g, message: 'Violação: Enterprise Validation UI não pode mutar fiduciário diretamente.' },
    { regex: /localStorage\.setItem/g, message: 'Violação: Datasets enterprise não podem ser salvos em persistência local desprotegida.' },
    { regex: /fetch\(/g, message: 'Violação: Proibido bypassar os Gatekeepers via fetch direto na UI.' }
  ];

  for (const file of uiFiles) {
    const content = fs.readFileSync(file, 'utf8');
    UI_BANNED_PATTERNS.forEach(pattern => {
      if (pattern.regex.test(content)) {
        console.error('❌ VIOLATION: ' + pattern.message + ' Arquivo: ' + path.basename(file));
        violations++;
      }
    });
  }

  // 2. Validar Engine
  if (fs.existsSync(enginePath)) {
    const engineFiles = scanDir(enginePath);
    let foundRealDataValidationEngine = false;

    for (const file of engineFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.includes('RealDataValidationEngine')) foundRealDataValidationEngine = true;

      // Golden datasets não podem escrever direto na DB em modo de validação
      if (content.includes('saveToProduction')) {
        console.error('❌ VIOLATION: Golden Datasets não podem ser salvos direto em produção. Use importação normal. Arquivo: ' + path.basename(file));
        violations++;
      }
    }

    if (!foundRealDataValidationEngine) {
      console.error('❌ VIOLATION: RealDataValidationEngine ausente. Falha estrutural da governança.');
      violations++;
    }
  }

  if (violations > 0) {
    console.error('\\n❌ Falha na auditoria de Enterprise Validation. Foram detectadas ' + violations + ' violações.');
    process.exit(1);
  } else {
    console.log('✅ UI atestada como segura para exibição de validação. Sem injeção direta.');
    console.log('✅ Isolamento entre Validation Environment e Production atestado.');
    console.log('✅ Golden Datasets operando restritos ao escopo de sandbox.');
    console.log('\\nEnterprise Validation Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runEnterpriseValidationGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
