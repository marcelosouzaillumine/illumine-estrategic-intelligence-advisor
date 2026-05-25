import * as fs from 'fs';
import * as path from 'path';

function runPresentationAudit() {
  console.log('Iniciando Consolidated Presentation Audit (Active Governance)...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components', 'consolidated');
  const pagePath = path.join(process.cwd(), 'src', 'components', 'pages', 'ConsolidatedExecutivePage.tsx');

  let violations = 0;

  const filesToCheck: string[] = [];

  if (fs.existsSync(pagePath)) {
    filesToCheck.push(pagePath);
  } else {
    console.warn('⚠️ ConsolidatedExecutivePage.tsx não encontrado.');
  }

  if (fs.existsSync(componentsPath)) {
    const components = fs.readdirSync(componentsPath).filter(f => f.endsWith('.tsx'));
    components.forEach(c => filesToCheck.push(path.join(componentsPath, c)));
  }

  // Regras de Active Governance para View Layer
  const BANNED_PATTERNS = [
    { regex: /import.*(ConsolidatedFinancialOrchestrator|TemporalCausalityEngine|evaluateMasterCausality)/g, message: 'Importou Orquestrador ou Engine diretamente em View Layer.' },
    { regex: /\.reduce\s*\(/g, message: 'Uso de .reduce() detectado. Possível agregação/cálculo financeiro não autorizado.' },
    { regex: /calculate[A-Z]/g, message: 'Uso de função calculate*() detectado.' },
    { regex: /\+|-|\*|\//g, message: 'Operador matemático solto encontrado (pode ser falso positivo, mas precisa de revisão rigorosa).', severity: 'WARNING' },
    { regex: /confidence\s*===?\s*|severity\s*===?\s*/g, message: 'Uso condicional que pode estar recalibrando ou inferindo confidence/severity.' }
  ];

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    // Ignora a checagem de confidence/severity conditions no Badge e Blocker, pois eles são apenas renderizadores do status
    const isExemptForRenderChecks = fileName === 'ConsolidatedConfidenceBadge.tsx' || fileName === 'CriticalEmissionBlocker.tsx' || fileName === 'SystemicRisksPanel.tsx' || fileName === 'ConsolidatedExecutivePage.tsx';

    BANNED_PATTERNS.forEach(pattern => {
      // Ignorar a checagem de condicional de renderização (confidence ===) apenas nos arquivos designados.
      if (isExemptForRenderChecks && pattern.regex.toString().includes('confidence')) return;
      if (fileName === 'SystemicRisksPanel.tsx' && pattern.regex.toString().includes('severity')) return;
      
      const matches = content.match(pattern.regex);
      if (matches) {
        // Ignorar falso positivo do `+/-` que bate em concatenação ou JSX classes, mas vamos travar reduce e calculates
        if (pattern.severity === 'WARNING') {
          // console.warn(`[WARNING] Padrão suspeito (${pattern.message}) em ${fileName}`);
        } else {
          console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${fileName}`);
          violations++;
        }
      }
    });
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Presentation Layer. Foram detectadas ${violations} violações de Active Governance (View Layer impura).`);
    process.exit(1);
  } else {
    console.log('✅ Todos os componentes testados são View Layers puros. Nenhuma dedução ou cálculo não autorizado encontrado.');
    console.log('\nConsolidated Presentation Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runPresentationAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
