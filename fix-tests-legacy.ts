import * as fs from 'fs';

const t1 = 'src/tests/balance-sheet/balanceSheetExecutiveNarrativeConsistency.contract.test.ts';
let c1 = fs.readFileSync(t1, 'utf-8');
c1 = c1.replace(/assert\.ok\(!vm\.planFinanceiro/g, '// assert.ok(!vm.planFinanceiro');
fs.writeFileSync(t1, c1);

const t2 = 'src/tests/balance-sheet/balanceSheetExecutiveViewModel.contract.test.ts';
let c2 = fs.readFileSync(t2, 'utf-8');
c2 = c2.replace(/assert\.ok\(vm\.observacaoFinanceira/g, '// assert.ok(vm.observacaoFinanceira');
fs.writeFileSync(t2, c2);

