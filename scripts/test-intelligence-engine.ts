import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { BalanceSheetIntelligenceEngine } from '../src/capabilities/financial/intelligence/BalanceSheetIntelligenceEngine';
import { NormalizedBalanceSheet } from '../src/capabilities/financial/domain/models/NormalizedBalanceSheet';

async function runIntelligenceTests() {
  console.log('Starting Phase 6F Governance Engine Test...\
');
  
  // Create mock facts for the new engine
  const facts: NormalizedBalanceSheet = {
    period: '2025-12-01',
    assets: {
      total: 150000,
      current: { total: 50000, cash: 10000, receivables: 20000, inventory: 20000, other: 0 },
      nonCurrent: { total: 100000, longTerm: 0, fixed: 100000, intangible: 0 }
    },
    liabilities: {
      total: 50000,
      current: { total: 20000, suppliers: 5000, taxes: 5000, labor: 5000, loans: 5000, other: 0 },
      nonCurrent: { total: 30000, loans: 30000, other: 0 }
    },
    equity: {
      total: 100000,
      capital: 100000,
      reserves: 0,
      retainedEarnings: 0
    }
  };
  
  // 1. Initialize Engine
  console.log(`✅ Engine Initialized: BalanceSheetGovernanceEngine.`);
  
  // 3. Execution 1
  const context1 = BalanceSheetIntelligenceEngine.execute(facts);
  
  // 4. Execution 2 (Determinism Check)
  const context2 = BalanceSheetIntelligenceEngine.execute(facts);
  
  // Test: Deterministic Rule Evaluation
  if (JSON.stringify(context1) !== JSON.stringify(context2)) {
      throw new Error(`Determinism Violated: Execution 1 does not match Execution 2`);
  }
  console.log(`✅ Determinism Check Passed: Engine yields exactly the same score and insights for the same facts.`);
  
  // Test: Output completeness
  if (!context1.evidence.balanceIntegrity.balanced) {
      throw new Error(`Integrity Violated: Balance is not balanced.`);
  }
  console.log(`✅ Integrity Check Passed: Balance is balanced.`);
  
  if (context1.indicators.length === 0) {
      throw new Error(`Indicator Analysis Violated: Engine did not produce indicators.`);
  }
  console.log(`✅ Indicator Analysis Passed: Produced ${context1.indicators.length} indicators.`);
  
  console.log('\
✅ ALL GOVERNANCE ENGINE GATES PASSED.');
}

runIntelligenceTests().catch(err => {
    console.error('\
❌ GOVERNANCE ENGINE VALIDATION FAILED:', err);
    process.exit(1);
});
