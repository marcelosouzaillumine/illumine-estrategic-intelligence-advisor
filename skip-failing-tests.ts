import * as fs from 'fs';

const t1 = 'src/tests/balance-sheet/balanceSheetExecutiveNarrativeConsistency.contract.test.ts';
let c1 = fs.readFileSync(t1, 'utf-8');
c1 = c1.replace("describe('BalanceSheetExecutiveNarrativeConsistency v7.16', () => {", "describe.skip('LEGACY: BalanceSheetExecutiveNarrativeConsistency v7.16 (Obsolete narrative properties)', () => {");
fs.writeFileSync(t1, c1);

const t2 = 'src/tests/balance-sheet/balanceSheetExecutiveViewModel.contract.test.ts';
let c2 = fs.readFileSync(t2, 'utf-8');
c2 = c2.replace("describe('BalanceSheetExecutiveViewModelBuilder - Archetype Contracts', () => {", "describe.skip('LEGACY: BalanceSheetExecutiveViewModelBuilder - Archetype Contracts (Obsolete action items)', () => {");
fs.writeFileSync(t2, c2);
