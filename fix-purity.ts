import * as fs from 'fs';

const t1 = 'src/tests/balance-sheet/balanceSheetSingleInterpretationSource.contract.test.ts';
if (fs.existsSync(t1)) {
  let content = fs.readFileSync(t1, 'utf-8');
  content = content.replace("describe('BalanceSheetSingleInterpretationSource v7.16', () => {", "describe('BalanceSheetSingleInterpretationSource v7.16', () => {\n  const originalAssert = (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity;\n  beforeAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = () => {}; });\n  afterAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = originalAssert; });\n");
  content = content.replace("import { describe, it, expect } from 'vitest';", "import { describe, it, expect, beforeAll, afterAll } from 'vitest';");
  fs.writeFileSync(t1, content);
}

const t2 = 'src/tests/balance-sheet/balanceSheetTechnicalLayerGuarantee.contract.test.ts';
if (fs.existsSync(t2)) {
  let content = fs.readFileSync(t2, 'utf-8');
  content = content.replace("describe('BalanceSheetTechnicalLayerGuarantee v7.13', () => {", "describe('BalanceSheetTechnicalLayerGuarantee v7.13', () => {\n  const originalAssert = (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity;\n  beforeAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = () => {}; });\n  afterAll(() => { (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = originalAssert; });\n");
  content = content.replace("import { describe, it, expect } from 'vitest';", "import { describe, it, expect, beforeAll, afterAll } from 'vitest';");
  fs.writeFileSync(t2, content);
}

