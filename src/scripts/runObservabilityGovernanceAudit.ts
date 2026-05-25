import * as fs from 'fs';
import * as path from 'path';

function runObservabilityAudit() {
  console.log('Iniciando Observability Governance Audit (Active Governance)...\n');

  const observabilityPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'observability');
  const uiPath = path.join(process.cwd(), 'src', 'components', 'pages', 'RuntimeObservabilityPage.tsx');

  let violations = 0;
  const filesToCheck: string[] = [];

  if (fs.existsSync(uiPath)) {
    filesToCheck.push(uiPath);
  } else {
    console.warn('⚠️ RuntimeObservabilityPage.tsx não encontrado.');
  }

  if (fs.existsSync(observabilityPath)) {
    const obsFiles = fs.readdirSync(observabilityPath)
      .filter(f => f.endsWith('.ts') && f !== 'observability-types.ts')
      .map(f => path.join(observabilityPath, f));
    filesToCheck.push(...obsFiles);
  } else {
    console.error('❌ CRITICAL: Pasta Observability não encontrada.');
    process.exit(1);
  }

  // Regras de Active Governance para Observabilidade
  const BANNED_PATTERNS = [
    { regex: /\.reduce\s*\(/g, message: 'Uso de .reduce() detectado em Observabilidade. Lógica agregadora/financeira é proibida neste módulo.' },
    { regex: /calculate[A-Z]/g, message: 'Uso de função calculate*() detectado. Observabilidade não calcula.' },
    { regex: /evaluateMasterCausality/g, message: 'Importou evaluateMasterCausality para o módulo forense. Replay não pode recalcular.' },
    { regex: /report\.finalConfidence\s*=[^=]/g, message: 'Tentativa de mutação de confidence na UI ou Replay.' },
    { regex: /report\.advisorySeverity\s*=[^=]/g, message: 'Tentativa de mutação de severity na UI ou Replay.' }
  ];

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    BANNED_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${fileName}`);
        violations++;
      }
    });

    // Validar se Orquestradores sofreram mutação manual
    if (fileName === 'ConsolidatedFinancialOrchestrator.ts' || fileName === 'ConsolidatedAdvisoryOrchestrator.ts') {
        if (content.includes('RuntimeExecutionLogger.logEvent')) {
           console.error(`❌ VIOLATION: Orquestrador puro foi poluído com Logger. Use o Service Wrapper. Arquivo: ${fileName}`);
           violations++;
        }
    }
  }

  // Verifica explicitamente os orquestradores (puros) se eles sofreram injeção de logs
  const finOrch = path.join(process.cwd(), 'src', 'core', 'runtime', 'consolidated', 'ConsolidatedFinancialOrchestrator.ts');
  const advOrch = path.join(process.cwd(), 'src', 'core', 'runtime', 'consolidated', 'advisory', 'ConsolidatedAdvisoryOrchestrator.ts');
  
  [finOrch, advOrch].forEach(orchestratorFile => {
      if(fs.existsSync(orchestratorFile)) {
          const content = fs.readFileSync(orchestratorFile, 'utf8');
          if (content.includes('RuntimeExecutionLogger')) {
              console.error(`❌ VIOLATION: Orquestrador Puro foi contaminado por side-effects (Logger). Arquivo: ${path.basename(orchestratorFile)}`);
              violations++;
          }
      }
  });

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Observabilidade. Foram detectadas ${violations} violações fiduciárias.`);
    process.exit(1);
  } else {
    console.log('✅ Observabilidade passiva e puramente forense. Orquestradores permanecem puros (Input -> Output). Nenhuma mutação de advisory detectada.');
    console.log('\nObservability Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runObservabilityAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
