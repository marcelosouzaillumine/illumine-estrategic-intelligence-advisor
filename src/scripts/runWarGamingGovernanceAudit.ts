import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Iniciando Auditoria de Governança do Institutional War Gaming (RC-1.8) ---');

const warGamingDir = path.resolve(__dirname, '../core/runtime/war-gaming');
const uiDir = path.resolve(__dirname, '../components/war-gaming');

let hasViolations = false;

// 1. Audit UI to ensure NO calculations or causality generation
if (fs.existsSync(uiDir)) {
  const uiFiles = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  uiFiles.forEach(file => {
    const content = fs.readFileSync(path.join(uiDir, file), 'utf-8');
    
    // UI cannot use speculative or generative terms
    const forbiddenPatterns = [
      /Math\.random/g,
      /calculate[A-Z]/g,
      /previsão de falência/gi,
      /vai quebrar/gi,
      /gerarPropagacao/gi
    ];

    forbiddenPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.error(`[VIOLAÇÃO] O componente UI ${file} contém padrão proibido (${pattern}). Lógica deve ser 100% runtime-driven.`);
        hasViolations = true;
      }
    });
  });
}

// 2. Audit War Gaming Core Engines
if (fs.existsSync(warGamingDir)) {
  const coreFiles = fs.readdirSync(warGamingDir).filter(f => f.endsWith('.ts'));
  coreFiles.forEach(file => {
    const content = fs.readFileSync(path.join(warGamingDir, file), 'utf-8');
    
    if (file === 'InstitutionalCollapseConstraintEngine.ts') {
      if (!content.includes('sanitizeNarrative')) {
        console.error(`[VIOLAÇÃO] ${file} deve expor o método sanitizeNarrative fiduciário.`);
        hasViolations = true;
      }
    }

    if (file === 'LongitudinalCrisisMemoryEngine.ts') {
      if (content.includes('update') || content.includes('replace') || content.includes('delete')) {
        console.error(`[VIOLAÇÃO] Memória institucional ${file} deve ser estritamente append-only. Padrões de mutação detectados.`);
        hasViolations = true;
      }
    }
  });
}

if (hasViolations) {
  console.error('\nAuditoria falhou. A arquitetura contém violações fiduciárias.');
  process.exit(1);
} else {
  console.log('\nAuditoria aprovada. Nenhuma violação fiduciária detectada.');
  process.exit(0);
}
