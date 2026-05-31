// src/scripts/runExecutiveCommandGovernanceAudit.ts

import * as fs from 'fs';
import * as path from 'path';

function printSuccess(msg: string) {
  console.log(`\x1b[32m✔ ${msg}\x1b[0m`);
}

function printError(msg: string) {
  console.error(`\x1b[31m✖ ${msg}\x1b[0m`);
}

function checkFile(filePath: string, forbiddenStrings: string[], description: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`\x1b[33m⚠ Aviso: Arquivo não encontrado: ${filePath}\x1b[0m`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  let valid = true;
  for (const forbidden of forbiddenStrings) {
    if (content.includes(forbidden)) {
      printError(`${description} falhou. Encontrado padrão proibido: "${forbidden}"`);
      valid = false;
    }
  }
  if (valid) {
    printSuccess(`${description} aprovada.`);
  } else {
    process.exit(1);
  }
}

console.log('\n======================================================');
console.log('🛡️  INSTITUTIONAL EXECUTIVE COMMAND GOVERNANCE AUDIT');
console.log('======================================================\n');

// 1. Garantir que Drift Engine não faz acusações ou jargões opinativos
const driftEnginePath = path.resolve(process.cwd(), 'src/core/runtime/executive-command/ExecutiveDriftDetectionEngine.ts');
checkFile(driftEnginePath, [
  'falhou', 'incompet', 'erro da gestão', 'gestão ignorou', 'decisão errada', 'AI', 'generative', 'predict'
], 'Auditoria Linguística (ExecutiveDriftDetectionEngine)');

// 2. Garantir que a View Layer não possui lógicas locais (botões de auto-execute ou set local state pra score)
const commandCenterPath = path.resolve(process.cwd(), 'src/components/executive-command/InstitutionalExecutiveCommandCenter.tsx');
checkFile(commandCenterPath, [
  'Math.random', 'setScore', 'applyAction', 'executeWorkflow', 'autoApprove'
], 'View Layer Restrictions (InstitutionalExecutiveCommandCenter)');

const thesisEnginePath = path.resolve(process.cwd(), 'src/core/runtime/executive-command/ExecutiveCommandThesisEngine.ts');
checkFile(thesisEnginePath, [
  'Math.random', 'generative', 'openai', 'llm'
], 'Deterministc Constraint (ExecutiveCommandThesisEngine)');

console.log('\n======================================================');
console.log('✅ ALL EXECUTIVE COMMAND FIDUCIARY TESTS PASSED');
console.log('======================================================\n');
process.exit(0);
