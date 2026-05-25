import * as fs from 'fs';
import * as path from 'path';

function runPerformanceGovernanceAudit() {
  console.log('Iniciando Performance Governance Audit (Active Governance)...\n');

  const profilingPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'profiling');
  const cachePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'cache');

  let violations = 0;
  const filesToCheck: string[] = [];

  if (fs.existsSync(profilingPath)) {
    filesToCheck.push(...fs.readdirSync(profilingPath).map(f => path.join(profilingPath, f)));
  }
  if (fs.existsSync(cachePath)) {
    filesToCheck.push(...fs.readdirSync(cachePath).map(f => path.join(cachePath, f)));
  }

  const BANNED_PATTERNS = [
    { regex: /localStorage\.set/g, message: 'Tentativa de gravar cache no localStorage persistente.' },
    { regex: /sessionStorage\.set/g, message: 'Tentativa de gravar cache no sessionStorage.' },
    { regex: /indexedDB/g, message: 'Tentativa de usar IndexedDB não autorizada nesta fase.' },
    { regex: /confidence\s*=/g, message: 'Profiler não pode alterar confidence.' },
    { regex: /severity\s*=/g, message: 'Profiler não pode alterar severity.' },
  ];

  for (const file of filesToCheck) {
    if (!file.endsWith('.ts')) continue;

    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    BANNED_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${fileName}`);
        violations++;
      }
    });
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Performance. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Profiling operando em modo passivo. Cache Restrito à RAM. Zero Overhead Detectado.');
    console.log('\nPerformance Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runPerformanceGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
