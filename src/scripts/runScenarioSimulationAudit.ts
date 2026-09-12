// src/scripts/runScenarioGovernanceAudit.ts
import fs from 'fs';
import path from 'path';

function runAudit() {
  console.log('Iniciando Scenario Governance Audit (RC-1.6)...');
  let hasErrors = false;

  const coreDir = path.join(process.cwd(), 'src/capabilities/runtime/scenario-intelligence');
  const constraintFile = path.join(coreDir, 'ScenarioConstraintEngine.ts');

  // Check 1: Constraint Engine must exist and enforce fail-closed
  if (!fs.existsSync(constraintFile)) {
    console.error('❌ ERRO: ScenarioConstraintEngine.ts não encontrado. O EFOS não pode simular sem limites fiduciários.');
    hasErrors = true;
  } else {
    const content = fs.readFileSync(constraintFile, 'utf8');
    if (!content.includes('BLOCKED_BY_EXTRAPOLATION') || !content.includes('BLOCKED_BY_ECONOMIC_LAW')) {
      console.error('❌ ERRO: ScenarioConstraintEngine não implementa fail-closed estrutural (BLOCKED_BY_EXTRAPOLATION/ECONOMIC_LAW).');
      hasErrors = true;
    }
  }

  // Check 2: Explainability Engine must use Hashes for Lineage
  const explainabilityFile = path.join(coreDir, 'ScenarioExplainabilityEngine.ts');
  if (!fs.existsSync(explainabilityFile)) {
    console.error('❌ ERRO: ScenarioExplainabilityEngine.ts não encontrado.');
    hasErrors = true;
  } else {
    const content = fs.readFileSync(explainabilityFile, 'utf8');
    if (!content.includes('lineageHash') || !content.includes('baselineHash')) {
      console.error('❌ ERRO: Simulação estrutural não preserva o Lineage Hash.');
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('🔴 Scenario Governance Audit FALHOU. Build bloqueado.');
    process.exit(1);
  } else {
    console.log('✅ Scenario Governance Audit FINALIZADA COM SUCESSO. Plataforma RC-1.6 Compliant.');
  }
}

runAudit();
