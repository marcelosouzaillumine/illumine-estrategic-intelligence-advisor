import { describe, it } from 'node:test';
import assert from 'node:assert';
import 'global-jsdom/register';
import React from 'react';
import { render } from '@testing-library/react';
import { BalanceSheetWorkingCapitalSection } from '../src/components/pages/balance-sheet/BalanceSheetWorkingCapitalSection';

describe('BalanceSheetWorkingCapitalSection (Formatting Tests)', () => {
  it('Saldo de Tesouraria renders with R$ formatted currency', () => {
    const diagnostics: any = {
      evidence: {
        fleuriet: { name: 'Saldo de Tesouraria', value: 'R$ 1.231.692', format: 'currency' }
      }
    };
    const bpSummary: any = {};
    
    const { queryByText } = render(
      <BalanceSheetWorkingCapitalSection bpSummary={bpSummary} diagnostics={diagnostics} />
    );
    
    const el = queryByText(/1\.231\.692/);
    assert.ok(el !== null);
    assert.match(el?.textContent || '', /R\$\s*1\.231\.692/);
  });

  it('Saldo de Tesouraria handles invalid values by returning "—"', () => {
    const diagnostics: any = {
      evidence: {
        fleuriet: { name: 'Saldo de Tesouraria', value: '—', format: 'currency' }
      }
    };
    const bpSummary: any = {};
    
    const { getByText } = render(
      <BalanceSheetWorkingCapitalSection bpSummary={bpSummary} diagnostics={diagnostics} />
    );
    
    assert.ok(getByText('—'));
  });
});
