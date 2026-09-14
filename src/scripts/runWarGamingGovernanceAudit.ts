import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolving root dir since we might run from scripts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

console.log("Iniciando War Gaming Governance Audit (Scenario Governance)...");
console.log("Esta camada opera estritamente em modo observacional. Proibida simulação client-side e matemática fiduciária não rastreada.\n");

// Arquivos requeridos estruturalmente
const requiredFiles = [
  'src/components/war-room/WarRoomWorkspace.tsx', // War Room Workspace
  'src/capabilities/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts', // War Room Runtime
  'src/core/war-room/ScenarioNavigationEngine.ts', // ScenarioNavigationEngine
  'docs/architecture/Scenario_Governance_War_Room_Audit.md' // Scenario_Intelligence_War_Room_Audit
];

let failed = false;

console.log("- Verificando integridade estrutural:");
requiredFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  [OK] ${file} existe.`);
  } else {
    console.error(`  [FAIL] ${file} NÃO ENCONTRADO.`);
    failed = true;
  }
});

// Arquivos para auditar conteúdo
const filesToAudit = [
  ...requiredFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
];

const forbiddenTokens = [
  'simulateNow',
  'recalculate',
  'runEngine'
];

console.log("\n- Verificando vocabulário generativo e simulação local proibida:");
filesToAudit.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    forbiddenTokens.forEach(token => {
      if (content.includes(token)) {
        console.error(`  [FAIL] Token proibido detectado: ${token} no arquivo ${file}`);
        failed = true;
      }
    });
  }
});

if (failed) {
  console.error("\nWar Gaming Governance Audit: FAIL");
  process.exit(1);
} else {
  console.log("\nWar Gaming Governance Audit: PASS");
  process.exit(0);
}
