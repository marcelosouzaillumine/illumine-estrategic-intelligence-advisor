import * as fs from 'fs';
import * as path from 'path';

function runAIGovernanceAudit() {
  console.log('Iniciando AI Governance Audit (Active Governance)...\n');

  const componentsPath = path.join(process.cwd(), 'src', 'components');
  const uiFiles: string[] = [];

  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        uiFiles.push(fullPath);
      }
    }
  }

  scanDir(componentsPath);

  let violations = 0;

  const UI_BANNED_PATTERNS = [
    { regex: /fetch\(['"]https:\/\/api\.openai\.com/g, message: 'Chamada direta ao OpenAI detectada na UI.' },
    { regex: /axios\.(post|get)\(['"]https:\/\/api\.openai\.com/g, message: 'Chamada axios direta ao OpenAI detectada.' },
    { regex: /OPENAI_API_KEY/g, message: 'Chave OPENAI_API_KEY referenciada em componente client-side.' },
    { regex: /localStorage\.set.*ai_session/g, message: 'Sessão do Copiloto gravada no localStorage (risco cross-tenant).' },
    { regex: /indexedDB/g, message: 'IndexedDB não autorizado para sessão de IA.' }
  ];

  for (const file of uiFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    UI_BANNED_PATTERNS.forEach(pattern => {
      if (pattern.regex.test(content)) {
        console.error(`❌ VIOLATION: ${pattern.message} Arquivo: ${fileName}`);
        violations++;
      }
    });
  }

  // Scan Core AI Governance rules
  const coreAiPath = path.join(process.cwd(), 'src', 'core', 'runtime', 'ai-governance');
  if (fs.existsSync(coreAiPath)) {
    const coreFiles = fs.readdirSync(coreAiPath).filter(f => f.endsWith('.ts'));
    for (const file of coreFiles) {
      const content = fs.readFileSync(path.join(coreAiPath, file), 'utf8');
      
      if (file === 'OpenAIProvider.ts' && content.includes('openai.chat.completions.create')) {
        console.error(`❌ VIOLATION: OpenAI SDK invocado nativamente em ambiente isolado não-backend. Requer proxy.`);
        violations++;
      }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de AI Governance. Foram detectadas ${violations} violações fiduciárias de IA.`);
    process.exit(1);
  } else {
    console.log('✅ UI está livre de chamadas LLM e chaves inseguras.');
    console.log('✅ Sessão de IA operando em estado efêmero seguro.');
    console.log('\nAI Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runAIGovernanceAudit();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
