import { logger } from "../services/logging/InstitutionalLogger";
// src/scripts/runDecisionGovernanceAudit.ts
import fs from 'fs';
import path from 'path';

function runAudit() {
  console.log('Iniciando Decision Governance Audit (RC-1.7)...');
  let hasErrors = false;

  const coreDir = path.join(process.cwd(), 'src/core/runtime/board-decision');
  const boardResolutionEngineFile = path.join(coreDir, 'BoardResolutionEngine.ts');
  const lineageTrackerFile = path.join(coreDir, 'DecisionLineageTracker.ts');

  if (!fs.existsSync(boardResolutionEngineFile)) {
    logger.error('BoardResolutionEngine not found', new Error('File missing'));
    hasErrors = true;
  } else {
    const content = fs.readFileSync(boardResolutionEngineFile, 'utf8');
    if (!content.includes('FIDUCIARY_VIOLATION: Resolução do Board rejeitada')) {
      logger.error('BoardResolutionEngine violates blocks', new Error('Missing Fiduciary Blocks'));
      hasErrors = true;
    }
  }

  if (!fs.existsSync(lineageTrackerFile)) {
    console.error('❌ ERRO: DecisionLineageTracker.ts não encontrado.');
    hasErrors = true;
  } else {
    const content = fs.readFileSync(lineageTrackerFile, 'utf8');
    if (!content.includes('resolution.scenarioLineageHash')) {
      console.error('❌ ERRO: DecisionLineageTracker não valida hash do cenário originário.');
      hasErrors = true;
    }
  }

  // Verify ScenarioTradeoffEngine
  const tradeoffFile = path.join(process.cwd(), 'src/core/runtime/scenario-intelligence/ScenarioTradeoffEngine.ts');
  if (fs.existsSync(tradeoffFile)) {
    const content = fs.readFileSync(tradeoffFile, 'utf8');
    if (content.includes('fetch(') || content.includes('import { genai }')) {
       console.error('❌ ERRO: ScenarioTradeoffEngine vazando para inferência IA opaca em vez de cálculo determinístico.');
       hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('🔴 Decision Governance Audit FALHOU. Build bloqueado.');
    process.exit(1);
  } else {
    console.log('✅ Decision Governance Audit FINALIZADA COM SUCESSO. Plataforma RC-1.7 Compliant.');
  }
}

runAudit();
