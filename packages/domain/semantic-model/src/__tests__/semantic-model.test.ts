import { describe, it, expect } from 'vitest';
import { KPICatalogItem, CausalChain, CorporateDimension } from '../index';

describe('@illumine/semantic-model 6-Layer Architecture', () => {
  it('should instantiate KPICatalogItem correctly', () => {
    const kpi: KPICatalogItem = {
      id: 'kpi-ebitda',
      type: 'METRIC',
      version: '1.0.0',
      label: 'EBITDA Operacional',
      description: 'Lucro antes de juros, impostos, depreciação e amortização',
      createdAt: '2026-07-28T00:00:00Z',
      metricCode: 'EBITDA',
      unit: 'CURRENCY',
      targetDirection: 'HIGHER_IS_BETTER',
      formulaDescription: 'Receita Líquida - Custos Operacionais + Depreciação'
    };

    expect(kpi.metricCode).toBe('EBITDA');
    expect(kpi.targetDirection).toBe('HIGHER_IS_BETTER');
  });

  it('should construct CausalChain correctly', () => {
    const chain: CausalChain = {
      chainId: 'chain-1',
      rootEntityId: 'kpi-ebitda',
      nodes: [
        { entityId: 'kpi-ebitda', entityName: 'EBITDA', impactType: 'POSITIVE' },
        { entityId: 'kpi-cash-flow', entityName: 'Fluxo de Caixa', impactType: 'POSITIVE' },
        { entityId: 'kpi-liquidity', entityName: 'Liquidez', impactType: 'POSITIVE' }
      ],
      description: 'Cadeia de impacto financeiro do EBITDA'
    };

    expect(chain.nodes.length).toBe(3);
    expect(chain.nodes[0].entityName).toBe('EBITDA');
  });

  it('should define CorporateDimension correctly', () => {
    const dim: CorporateDimension = {
      id: 'dim-finance',
      type: 'DIMENSION',
      version: '1.0.0',
      label: 'Finanças Executivas',
      description: 'Dimensão financeira',
      createdAt: '2026-07-28T00:00:00Z',
      dimensionType: 'FINANCE',
      keyMetrics: ['EBITDA', 'ROIC', 'FreeCashFlow']
    };

    expect(dim.dimensionType).toBe('FINANCE');
    expect(dim.keyMetrics).toContain('EBITDA');
  });
});
