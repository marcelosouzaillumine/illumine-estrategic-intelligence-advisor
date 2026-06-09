// src/scripts/runInstitutionalBoardPackAudit.ts

import * as fs from 'fs';
import * as path from 'path';

function checkFile(filePath: string, blockedTerms: string[], contextMessage: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] Arquivo não encontrado para auditoria: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();
  
  for (const term of blockedTerms) {
    if (content.includes(term.toLowerCase())) {
      console.error(`\n[FALHA DE AUDITORIA] ${contextMessage}`);
      console.error(`Termo proibido encontrado: "${term}" no arquivo ${filePath}\n`);
      process.exit(1);
    }
  }
}

console.log('Iniciando auditoria fiduciária: Institutional Board Pack Layer (RC-1.13)...');

const subjectiveTerms = [
  'estratégia errada', 
  'decisão ruim', 
  'gestão agressiva', 
  'liderança conservadora', 
  'visão equivocada', 
  'expansão imprudente', 
  'erro estratégico',
  'forecasting',
  'predição',
  'previsão',
  'openai',
  'llm',
  'generative'
];

const dataManipulationTerms = [
  'math.random',
  'setstate',
  'setdata',
  'calculate',
  'useeffect', // Prevents logic executing inside the UX rendering cycle for board pack
  'fetch', // Prevent components fetching external data independently
  'axios'
];

// 1. Audit Engines
const runtimeDir = path.resolve(process.cwd(), 'src/core/runtime/institutional-reporting');
if (fs.existsSync(runtimeDir)) {
  const checkDirRecursive = (dir: string) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        checkDirRecursive(fullPath);
      } else if (file.endsWith('.ts') && !file.includes('types')) {
        checkFile(fullPath, subjectiveTerms, `Auditoria Linguística e Modelagem Opaca (Engine: ${file})`);
      }
    }
  };
  checkDirRecursive(runtimeDir);
}

// 2. Audit UI Components
const uiDir = path.resolve(process.cwd(), 'src/components/institutional-reporting');
if (fs.existsSync(uiDir)) {
  const files = fs.readdirSync(uiDir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      checkFile(path.join(uiDir, file), dataManipulationTerms, `Cálculo local detectado na View Layer (Board Pack Components não devem manipular dados): ${file}`);
    }
  }
}

console.log('Auditoria do Board Pack concluída com sucesso. Sem manipulação local de dados e sem linguagem opinativa.');
process.exit(0);
