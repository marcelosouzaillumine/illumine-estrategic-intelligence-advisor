import { DreIntelligenceValidator } from './packages/intelligence/executive-intelligence-layer/src/integrity/rules/DreIntelligenceValidator';
import { CashIntelligenceValidator } from './packages/intelligence/executive-intelligence-layer/src/integrity/rules/CashIntelligenceValidator';
import { BalanceSheetValidator } from './packages/intelligence/executive-intelligence-layer/src/integrity/rules/BalanceSheetValidator';
import { ExecutiveNarrativeGate } from './packages/intelligence/executive-intelligence-layer/src/narrative/ExecutiveNarrativeGate';
import { FinancialIntelligenceAssessment } from './packages/intelligence/executive-intelligence-layer/src/contracts/FinancialIntelligenceAssessment';

function runTest(company: string, financialData: any, pastData: any) {
  console.log(`\n=============================================`);
  console.log(`TESTING: ${company}`);
  console.log(`=============================================`);
  
  const bs = BalanceSheetValidator.validate(financialData);
  const dre = DreIntelligenceValidator.validate(financialData, pastData ? [pastData] : undefined);
  const cash = CashIntelligenceValidator.validate(financialData);
  
  const assessment: Omit<FinancialIntelligenceAssessment, 'narrativePermission'> = {
    integrityStatus: bs.blockers.length > 0 ? 'WARNING' : 'PASSED',
    earningsQuality: dre.earningsQuality,
    cashConversion: cash,
    solvency: bs.solvency!,
    executiveRiskLevel: 'MEDIUM'
  };

  const permission = ExecutiveNarrativeGate.evaluatePermission(assessment);
  const narrative = ExecutiveNarrativeGate.interceptNarrative(
    "A empresa apresenta excelentes oportunidades de expansão operacional.",
    permission,
    assessment as FinancialIntelligenceAssessment
  );
  
  console.log(`Cash Conversion Status: ${cash.status} (Rate: ${(cash.conversionRate * 100).toFixed(1)}%)`);
  if (cash.alert) console.log(` - Cash Alert: ${cash.alert}`);
  
  console.log(`Earnings Quality Score: ${dre.earningsQuality.score} (${dre.earningsQuality.classification})`);
  console.log(` - Drivers: ${dre.earningsQuality.drivers.join(' | ')}`);
  
  console.log(`Solvency Status: ${bs.solvency!.status}`);
  if (bs.solvency!.alerts.length > 0) console.log(` - Solvency Alerts: ${bs.solvency!.alerts.join(' | ')}`);
  
  console.log(`\nNARRATIVE PERMISSION: ${permission}`);
  console.log(`FINAL NARRATIVE: ${narrative}`);
}

// Empório: EBITDA cresce, mas Caixa cai (Crescimento com retenção no capital de giro)
const emporioPast = { revenue: 10000000, ebitda: 1000000, operatingCashFlow: 800000, equity: 2000000 };
const emporio2025 = {
  assets: 5000000, liabilities: 2800000, equity: 2200000, // Balance
  currentAssets: 1500000, currentLiabilities: 1200000, // Working Capital = 300k
  revenue: 13000000, ebitda: 4200000, operatingCashFlow: 800000 // Conversion = ~19%
};

// Granatum: EBITDA cresce e Caixa acompanha perfeitamente (Expansão Sustentável)
const granatumPast = { revenue: 10000000, ebitda: 1000000, operatingCashFlow: 800000, equity: 2000000 };
const granatum2025 = {
  assets: 5000000, liabilities: 2000000, equity: 3000000, // Balance
  currentAssets: 2000000, currentLiabilities: 800000, // Working Capital = 1.2M
  revenue: 13000000, ebitda: 4200000, operatingCashFlow: 3500000 // Conversion = ~83%
};

runTest("EMPÓRIO DO MÁRMORE (2025)", emporio2025, emporioPast);
runTest("GRANATUM (2025)", granatum2025, granatumPast);
