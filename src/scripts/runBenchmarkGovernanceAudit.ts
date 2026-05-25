import * as fs from 'fs';
import * as path from 'path';

function runBenchmarkGovernanceAudit() {
  console.log('Iniciando Benchmark Governance Audit (Active Governance)...\n');

  const benchmarkingEnginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'benchmarking');
  const benchmarkingUiPath = path.join(process.cwd(), 'src', 'components', 'benchmarking');
  const benchmarkingPagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'InstitutionalBenchmarkingPage.tsx');
  
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
  const uiFiles = [...scanDir(benchmarkingUiPath)];
  if (fs.existsSync(benchmarkingPagePath)) uiFiles.push(benchmarkingPagePath);

  const UI_BANNED_PATTERNS = [
    { regex: /tenantId/gi, message: 'Vazamento: A UI de Benchmarking não pode referenciar tenantId.' },
    { regex: /workspaceId/gi, message: 'Vazamento: A UI de Benchmarking não pode referenciar workspaceId.' },
    { regex: /DRE|Balanco|BalanceSheet/gi, message: 'Vazamento: A UI de Benchmarking não pode trafegar estruturas financeiras cruas.' },
    { regex: /reduce\(|Math\./gi, message: 'Bypass: A UI não deve fazer matemática estatística. Use a Engine.' }
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

  // 2. Validar Engine
  if (fs.existsSync(benchmarkingEnginePath)) {
    const engineFiles = scanDir(benchmarkingEnginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /MIN_COHORT_SIZE\s*=\s*[01234]\b/g, message: 'Privacidade Quebrada: MIN_COHORT_SIZE não pode ser menor que 5 (k-anonymity).' },
      { regex: /confidence\s*=/gi, message: 'Mutação Ilegal: Benchmark não pode alterar confidence original do Tenant.' }
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
    console.error(`\n❌ Falha na auditoria de Benchmark Governance. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ UI de Benchmarking isenta de TenantId e Lógicas de Agregação (Strict Consumption).');
    console.log('✅ Engine de Benchmarking preservando k-anonymity e proibindo reidentificação (Truth Layer Preserved).');
    console.log('\nBenchmark Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runBenchmarkGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
