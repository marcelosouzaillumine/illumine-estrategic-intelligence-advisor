import { describe, it } from 'node:test';
import assert from 'node:assert';
import 'global-jsdom/register';
import React from 'react';
import { render } from '@testing-library/react';
import { BalanceSheetWorkingCapitalSection } from '../src/components/pages/balance-sheet/BalanceSheetWorkingCapitalSection';

describe('BalanceSheetWorkingCapitalSection (Formatting Tests)', () => {
  it('renders indicators properly', () => {
    const indicators: any = [
      { name: 'Saldo de Tesouraria', value: 'R$ 1.231.692', classification: 'SAUDÁVEL', financialMeaning: 'Ok' }
    ];
    
    const { queryByText } = render(
      <BalanceSheetWorkingCapitalSection indicators={indicators} />
    );
    
    const el = queryByText(/1\.231\.692/);
    assert.ok(el !== null);
    assert.match(el?.textContent || '', /1\.231\.692/);
  });
});
