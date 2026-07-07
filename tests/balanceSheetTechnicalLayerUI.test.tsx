import 'global-jsdom/register';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetTechnicalLayerSection } from '../src/components/pages/balance-sheet/BalanceSheetTechnicalLayerSection';

describe('BalanceSheetTechnicalLayerSection UI Contracts', () => {
  

  it('Should render correctly without discarding data when families are present', () => {
    const mockViewModel = {
      families: [
        {
          familyName: 'Liquidez',
          indicators: [
            {
              familyName: 'Liquidez',
              label: 'Liquidez Corrente',
              formula: 'AC / PC',
              value: '1.5',
              classificationLabel: 'Saudável',
              purpose: 'Test',
              limitations: '',
              referenceRange: '',
              methodologicalNotes: '',
              origin: { sourceEngine: '', sourceRule: '', confidence: 100, lastValidatedAt: '' }
            }
          ]
        }
      ]
    };

    render(<BalanceSheetTechnicalLayerSection viewModel={mockViewModel} />);

    // Since it uses details/summary, we can check if the text exists in the document
    const title = screen.getByText('Camada Técnica');
    assert.ok(title);

    const indicator = screen.getByText('Liquidez Corrente');
    assert.ok(indicator);
  });
});
