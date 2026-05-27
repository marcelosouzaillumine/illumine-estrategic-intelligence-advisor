import * as fs from 'fs';
import * as path from 'path';

function runExecutiveCognitiveAudit() {
  console.log('Iniciando Executive Cognitive Orchestration Audit...\n');

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
      regex: /attentionPriority\s*:\s*['"][^'"]+['"]/gi,
      message: 'Uso de attentionPriority estático ou hardcoded em página/componente. Utilize o ExecutiveCognitiveProvider.'
    },
    {
      regex: /cognitiveLoad\s*=\s*[^;]+[><=]\s*\d+/gi,
      message: 'Cálculo local de carga cognitiva ou lógica de mitigação manual em página/componente.'
    },
    {
      regex: /priority\s*=\s*[^;]+(score|confidence|risk|exposure|liquidez|limite)[^;]*[><=]\s*\d+/gi,
      message: 'Detecção de ordenação ou ranqueamento local executivo de prioridade/urgência (UI-driven ranking bypass).'
    },
    {
      regex: /focusWeight\s*=\s*\d+(\.\d+)?/gi,
      message: 'Uso de pesos de foco (focusWeight) manuais definidos localmente em componentes.'
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
        console.error(`❌ COGNITIVE VIOLATION in ${relativePath}:`);
        console.error(`  Reason: ${pattern.message}`);
        console.error(`  Matched pattern: "${matches[0].trim()}"\n`);
        violations++;
      }
    });
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Executive Cognitive Orchestration. Foram detectadas ${violations} violações.`);
    process.exit(1);
  } else {
    console.log('✅ Camada cognitiva livre de ranqueamento manual e bypasses de prioridade.');
    console.log('\nExecutive Cognitive Orchestration Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runExecutiveCognitiveAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
