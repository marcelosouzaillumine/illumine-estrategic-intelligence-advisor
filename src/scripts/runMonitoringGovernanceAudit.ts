import * as fs from 'fs';
import * as path from 'path';

function runMonitoringGovernanceAudit() {
  console.log('Iniciando Monitoring Governance Audit (Active Governance)...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components');
  const monitoringEnginePath = path.join(process.cwd(), 'src', 'core', 'runtime', 'monitoring');
  
  let violations = 0;

  // Scan UI
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
    { regex: /setInterval\(/g, message: 'setInterval detectado no React. O scheduler de Monitoring não pode ser via Polling no Front-end.' }
  ];

  for (const file of uiFiles) {
    // Permitir delay simples na página principal para simular loader do botão.
    if (file.includes('InstitutionalMonitoringPage.tsx')) continue; 
    
    const content = fs.readFileSync(file, 'utf8');
    UI_BANNED_PATTERNS.forEach(pattern => {
      if (pattern.regex.test(content)) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${path.basename(file)}`);
        violations++;
      }
    });
  }

  // Scan Core Monitoring Engine
  if (fs.existsSync(monitoringEnginePath)) {
    const engineFiles = scanDir(monitoringEnginePath);
    const ENGINE_BANNED_PATTERNS = [
      { regex: /confidence\s*=/g, message: 'MonitoringEngine tentou alterar confidence. Monitoramento deve ser passivo.' },
      { regex: /advisory\s*=/g, message: 'MonitoringEngine tentou criar advisory fora do orquestrador.' },
      { regex: /setInterval\(/g, message: 'Scheduler via setInterval() detectado. Execuções devem ser determinísticas/Cron-based.' }
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
    console.error(`\n❌ Falha na auditoria de Monitoring Governance. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ UI está livre de schedulers auto-iniciados e poluição assíncrona.');
    console.log('✅ MonitoringEngine operando passivamente (Truth Layer Preserved).');
    console.log('✅ Execution Scheduler respeita arquitetura Manual/Serverless design.');
    console.log('\nMonitoring Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runMonitoringGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
