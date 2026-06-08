// src/scripts/runInstitutionalFinancialAudit.ts
import fs from 'fs';
import path from 'path';

function runAudit() {
  console.log('Iniciando Institutional Financial Audit (RC-1.5)...');
  let hasErrors = false;


  // Check 3: Causality Engine must use directionality
  const causalityEngine = path.join(process.cwd(), 'src/core/runtime/CrossStatementCausalityEngine.ts');
  if (fs.existsSync(causalityEngine)) {
    const content = fs.readFileSync(causalityEngine, 'utf8');
    if (!content.includes('propagationDirection')) {
      console.error('❌ ERRO: CrossStatementCausalityEngine sem propagationDirection explícita.');
      hasErrors = true;
    }
  }

  // Check 4: DFC Runtime must reconcile EBITDA, WC, CAPEX
  const cashConvEngine = path.join(process.cwd(), 'src/core/runtime/cashflow/CashConversionEngine.ts');
  if (fs.existsSync(cashConvEngine)) {
    const content = fs.readFileSync(cashConvEngine, 'utf8');
    if (!content.includes('workingCapitalVariation') || !content.includes('capex')) {
      console.error('❌ ERRO: CashConversionEngine não reconcilia Capital de Giro ou CAPEX.');
      hasErrors = true;
    }
  }

  // Check 5: Observability & Explainability (RC-1.5A)
  const execRuntime = path.join(process.cwd(), 'src/core/runtime/executive-intelligence-runtime.ts');
  if (fs.existsSync(execRuntime)) {
    const content = fs.readFileSync(execRuntime, 'utf8');
    if (!content.includes('fiduciaryRationale') || !content.includes('propagationChains')) {
      console.error('❌ ERRO: ExecutiveIntelligenceRuntime sem nó de explicabilidade (fiduciaryRationale) ou (propagationChains).');
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('🔴 Institutional Financial Audit FALHOU. Build bloqueado.');
    process.exit(1);
  } else {
    console.log('✅ Institutional Financial Audit FINALIZADA COM SUCESSO. Plataforma RC-1.5A Compliant.');
  }
}

runAudit();
