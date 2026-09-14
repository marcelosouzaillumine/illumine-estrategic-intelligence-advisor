// src/scripts/runStrategicIntelligenceAudit.ts

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

console.log('Iniciando auditoria fiduciária: Strategic Governance Layer (RC-1.12)...');

const blockedTerms = [
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

// 1. Audit Engines
const runtimeDir = path.resolve(process.cwd(), 'src/core/runtime/strategic-governance');
if (fs.existsSync(runtimeDir)) {
  const files = fs.readdirSync(runtimeDir);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      checkFile(path.join(runtimeDir, file), blockedTerms, `Auditoria Linguística (Engine: ${file})`);
      checkFile(path.join(runtimeDir, file), ['mock', 'fixture'], `Vazamento de Mock detectado no ambiente produtivo: ${file}`);
    }
  }
}

// 2. Audit UI Components
const uiDir = path.resolve(process.cwd(), 'src/components/strategic-governance');
if (fs.existsSync(uiDir)) {
  const files = fs.readdirSync(uiDir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      checkFile(path.join(uiDir, file), ['math.random', 'setstate', 'calculate', 'setposture'], `Cálculo local detectado na View Layer: ${file}`);
    }
  }
}

console.log('Auditoria concluída com sucesso. Nenhuma violação estrutural ou linguística detectada.');
process.exit(0);
