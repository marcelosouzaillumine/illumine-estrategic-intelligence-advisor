import * as fs from 'fs';
import * as path from 'path';

function runInstitutionalMemoryAudit() {
  console.log('Iniciando Institutional Memory & Adaptive Governance Layer Audit...\n');

  const pagesPath = path.join(process.cwd(), 'src', 'components', 'pages');

  let violations = 0;
  const filesToCheck: string[] = [];

  const getFilesRecursive = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        getFilesRecursive(fullPath);
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          filesToCheck.push(fullPath);
        }
      }
    });
  };

  getFilesRecursive(pagesPath);

  const BANNED_PATTERNS = [
    {
      regex: /recurrence\s*:\s*['"](ISOLATED|OCCASIONAL|RECURRING|CHRONIC|SYSTEMIC)['"]/gi,
      message: 'Uso de recurrence estático ou hardcoded em página/componente. Utilize o InstitutionalMemoryProvider.'
    },
    {
      regex: /patternType\s*:\s*['"][A-Z_]+['"]/gi,
      message: 'Definição local ou hardcoded de padrão de risco (patternType) em página/componente. Deve ser inferido apenas por motores passivos.'
    },
    {
      regex: /timesIssued\s*:\s*\d+/gi,
      message: 'Uso de frequências de recomendações (timesIssued) estáticas/hardcoded em páginas/componentes.'
    },
    {
      regex: /lineageIntegrity\s*:\s*['"](VERIFIED|PARTIAL|DEGRADED|FAIL_CLOSED)['"]/gi,
      message: 'Bypass local do status de integridade de lineage histórico.'
    }
  ];

  const EXCLUDED_FILES = [
    'src/components/pages/CalibrationPlayground.tsx',
    'src/components/pages/ClientsPage.tsx',
    'src/components/pages/EstruturaGovernancaPage.tsx'
  ];

  for (const file of filesToCheck) {
    const relativePath = path.relative(process.cwd(), file);
    if (EXCLUDED_FILES.includes(relativePath.replace(/\\/g, '/'))) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');

    BANNED_PATTERNS.forEach(pattern => {
      // Clear comments before analyzing to prevent commenting triggers
      const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      const matches = cleanContent.match(pattern.regex);
      if (matches) {
        console.error(`❌ MEMORY VIOLATION in ${relativePath}:`);
        console.error(`  Reason: ${pattern.message}`);
        console.error(`  Matched pattern: "${matches[0].trim()}"\n`);
        violations++;
      }
    });
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Institutional Memory Layer. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ Camada de memória fiduciária longitudinal livre de ranqueamento manual e desvios de integridade.');
    console.log('\nInstitutional Memory & Adaptive Governance Layer Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runInstitutionalMemoryAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
