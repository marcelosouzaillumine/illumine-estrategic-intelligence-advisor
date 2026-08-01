import { InstitutionalDecisionOS } from './packages/intelligence/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS';
import { BalanceSheetValidator } from './packages/intelligence/executive-intelligence-layer/src/integrity/rules/BalanceSheetValidator';

function runTest(testName: string, financialData: any, proposedIntent: string) {
  console.log(`\n=============================================`);
  console.log(`TESTE: ${testName} | INTENTO: ${proposedIntent}`);
  console.log(`=============================================`);
  
  // O OS processa a inteligência ponta a ponta
  const evidencePackage = InstitutionalDecisionOS.run(financialData, undefined, proposedIntent, []);

  console.log(`[Status Institucional] ${evidencePackage.businessState}`);
  console.log(`[Decisão do Guard] ${evidencePackage.decisionAssessment?.status}`);
  if (evidencePackage.decisionAssessment?.status === 'BLOCKED') {
    console.log(`[Restrições Aplicadas] ${evidencePackage.decisionAssessment?.requiredActions.join(' | ')}`);
  }
  
  console.log(`\n[Briefing Executivo]`);
  evidencePackage.narrativeBlocks.forEach(b => {
    console.log(`- ${b.title} (${b.priority}): ${b.body}`);
    console.log(`  > ${b.recommendation}`);
  });
}

// Teste 1 — Empório do Mármore (Balanço Inconsistente)
const emporio = {
  assets: 5000000, liabilities: 4000000, equity: -1000000, // Inconsistente (Ativo ≠ Passivo + PL)
  currentAssets: 1500000, currentLiabilities: 2000000, // Liquidez = 0.75
  revenue: 13000000, ebitda: 4200000, operatingCashFlow: 800000
};

// Teste 2 — Empresa Saudável
const healthy = {
  assets: 5000000, liabilities: 2000000, equity: 3000000, // Consistente
  currentAssets: 3000000, currentLiabilities: 1000000, // Liquidez = 3.0
  revenue: 13000000, ebitda: 4200000, operatingCashFlow: 3500000
};

runTest("1. Empório do Mármore (Balanço Inconsistente)", emporio, "Aprovar Expansão e Distribuição de Dividendos");
runTest("2. Empresa Saudável", healthy, "Aprovar Expansão e Distribuição de Dividendos");
