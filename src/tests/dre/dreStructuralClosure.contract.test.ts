import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('dreStructuralClosure: DREPage deve atuar como canhão passivo e não reconstruir viewModel localmente', () => {
  const pagePath = path.join(process.cwd(), 'src/components/pages/DREPage.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  // DREPage não deve possuir nenhum mappers locais para a DRE
  assert.ok(!content.includes('mapRevenueEconomicStructure'), 'Vazamento: mapRevenueEconomicStructure não deve existir em DREPage');
  assert.ok(!content.includes('mapEconomicBurnRate'), 'Vazamento: mapEconomicBurnRate não deve existir em DREPage');
  assert.ok(!content.includes('mapBreakEvenAnalysis'), 'Vazamento: mapBreakEvenAnalysis não deve existir em DREPage');
  
  // As passagens de propriedades para os Sections não devem mais usar as variáveis legadas
  assert.ok(!content.includes('structureVM={structureVM}'), 'Vazamento: prop structureVM não deve ser passada no formato antigo');
  assert.ok(!content.includes('burnRateVM={burnRateVM}'), 'Vazamento: prop burnRateVM não deve ser passada no formato antigo');
  assert.ok(!content.includes('breakEvenVM={breakEvenVM}'), 'Vazamento: prop breakEvenVM não deve ser passada no formato antigo');
  
  // Deve passar o dreViewModel ou sua fatia direta sem remapear
  assert.ok(content.includes('dreViewModel={dreViewModel}') || content.includes('viewModel={dreViewModel.economicBreakdown}') || content.includes('viewModel={dreViewModel}'), 'DREPage deve repassar o dreViewModel diretamente');
});
