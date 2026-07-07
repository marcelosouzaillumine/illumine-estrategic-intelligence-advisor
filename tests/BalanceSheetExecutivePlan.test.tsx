import 'global-jsdom/register';
import { describe, it } from 'node:test';
import assert from 'node:assert';

import React from 'react';
import { render } from '@testing-library/react';
import { BalanceSheetExecutivePlan } from '../src/components/pages/balance-sheet/BalanceSheetExecutivePlan';

describe('BalanceSheetExecutivePlan (Rendering Tests)', () => {
  

  it('Renders the three plan axis: Financeiro, Operacional, Governança', () => {
    const origin = { sourceEngine: 'test', sourceRule: 'test', confidence: 100, lastValidatedAt: '' };
    
    const { getByText } = render(
      <BalanceSheetExecutivePlan 
        planFinanceiro={{ prazo: 'Curto Prazo', acao: 'Ação 1', origin }}
        planOperacional={{ prazo: 'Médio Prazo', acao: 'Ação 2', origin }}
        planGovernanca={{ prazo: 'Longo Prazo', acao: 'Ação 3', origin }}
        strategicSeverity="MONITORING"
        dominantRiskFamily="Test"
        strategicSeverityReason="Test"
      />
    );
    
    assert.ok(getByText('Curto Prazo'));
    assert.ok(getByText('Médio Prazo'));
    assert.ok(getByText('Longo Prazo'));
  });
});
