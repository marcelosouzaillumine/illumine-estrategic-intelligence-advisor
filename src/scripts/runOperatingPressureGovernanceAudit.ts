// src/scripts/runOperatingPressureGovernanceAudit.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Iniciando Auditoria de Governança do Institutional Operating Pressure (RC-1.8A) ---');

const operatingPressureDir = path.resolve(__dirname, '../core/runtime/operating-pressure');
const uiDir = path.resolve(__dirname, '../../src/components/operating-pressure');

let hasViolations = false;

const checkViolations = (dir: string, isUI: boolean) => {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // UI cannot use speculative terms, and core must also follow fiduciary bounds
    const forbiddenPatterns = [
      /Math\.random/g,
      /previsão de falência/gi,
      /vai quebrar/gi,
      /quebra/gi,
      /falência/gi,
      /colapso inevitável/gi,
      /empresa inviável/gi,
      /gestão falhou/gi,
      /risco fatal/gi
    ];

    if (isUI) {
      forbiddenPatterns.push(/calculate[A-Z]/g);
      // forbiddenPatterns.push(/evaluate\(/g); // Be careful, sometimes it might be used correctly if imported, but we'll stick to strict isolation.
    }

    forbiddenPatterns.forEach(pattern => {
      // Ignore words inside this very script to avoid self-flagging if it were to read itself
      if (pattern.test(content) && file !== 'runOperatingPressureGovernanceAudit.ts') {
        console.error(`[VIOLAÇÃO] O arquivo ${file} contém padrão proibido (${pattern}). Linguagem não-alarmista exigida.`);
        hasViolations = true;
      }
    });
  });
};

checkViolations(operatingPressureDir, false);
checkViolations(uiDir, true);

if (hasViolations) {
  console.error('\nAuditoria falhou. A arquitetura contém violações linguísticas ou fiduciárias na RC-1.8A.');
  process.exit(1);
} else {
  console.log('\nAuditoria aprovada. RC-1.8A em conformidade fiduciária e linguística.');
  process.exit(0);
}
