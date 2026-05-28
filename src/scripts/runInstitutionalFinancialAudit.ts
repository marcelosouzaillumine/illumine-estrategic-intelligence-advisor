// src/scripts/runInstitutionalFinancialAudit.ts
import fs from 'fs';
import path from 'path';

function runAudit() {
  console.log('Iniciando Institutional Financial Audit (RC-1.5)...');
  let hasErrors = false;

  const componentsDir = path.join(process.cwd(), 'src/components/pages');
  const overviewFile = path.join(componentsDir, 'InstitutionalFinancialOverviewPage.tsx');

  // Check 1: InstitutionalFinancialOverviewPage must not import mathematical engines directly
  if (fs.existsSync(overviewFile)) {
    const content = fs.readFileSync(overviewFile, 'utf8');
    if (content.includes('import { calculateDreCascade }') || content.includes('import { buildBPHierarchy }')) {
      console.error('❌ ERRO: InstitutionalFinancialOverviewPage importando motores matemáticos diretos.');
      hasErrors = true;
    }
    
    // Check 2: Must import the InstitutionalFinancialThesisEngine
    if (!content.includes('InstitutionalFinancialThesis')) {
      console.warn('⚠️ AVISO: InstitutionalFinancialOverviewPage não está utilizando a Institutional Thesis.');
      // Setting hasErrors to true since RC-1.5 enforces this
      hasErrors = true;
    }
  }

  // Check 3: Causality Engine must use directionality
  const causalityEngine = path.join(process.cwd(), 'src/core/runtime/CrossStatementCausalityEngine.ts');
  if (fs.existsSync(causalityEngine)) {
    const content = fs.readFileSync(causalityEngine, 'utf8');
    if (!content.includes('source:') || !content.includes('target:')) {
      console.error('❌ ERRO: CrossStatementCausalityEngine sem directionality explícita.');
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

  if (hasErrors) {
    console.error('🔴 Institutional Financial Audit FALHOU. Build bloqueado.');
    process.exit(1);
  } else {
    console.log('✅ Institutional Financial Audit FINALIZADA COM SUCESSO. Plataforma RC-1.5 Compliant.');
  }
}

runAudit();
