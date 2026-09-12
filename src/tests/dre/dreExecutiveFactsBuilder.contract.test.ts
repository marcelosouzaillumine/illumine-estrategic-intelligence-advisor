import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { DreExecutiveFactsBuilder } from '../../capabilities/financial/runtime/dre/DreExecutiveFactsBuilder';

describe('DreExecutiveFactsBuilder Contract', () => {
  it('must extract correctly from cascadeResult when financialMetrics is zero/empty', () => {
    const rawPayload = {
      recLiquida: 0,
      ebitda: 0,
      lucroLiq: 0,
      cascadeResult: [
        { id: 'ROL', value: 4438117.20 },
        { id: 'CUSTOS', value: 1400000.00 },
        { id: 'EBITDA', value: 1392105.60 },
        { id: 'LUCRO_LIQ', value: 1387072.12 },
        { id: 'DESP_OPER', value: 1600000.00 } // despesas operacionais fixas (aprox)
      ]
    };

    const builder = new DreExecutiveFactsBuilder(rawPayload, []);
    const facts = builder.build();

    assert.strictEqual(facts.netRevenue, 4438117.20);
    assert.strictEqual(facts.ebitda, 1392105.60);
    
    // EBITDA Margin should be ~31.37%
    assert.ok(facts.ebitdaMargin > 0.31);
    assert.ok(facts.ebitdaMargin < 0.32);

    assert.strictEqual(facts.netIncome, 1387072.12);
  });
});
