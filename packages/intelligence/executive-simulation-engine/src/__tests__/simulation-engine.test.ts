import { describe, it, expect } from 'vitest';
import { SimulationScenario } from '../index';

describe('@illumine/executive-simulation-engine (Wave 15C Phase 1)', () => {
  it('should instantiate a valid corporate simulation scenario with initial state and signals', () => {
    const scenario: SimulationScenario = {
      id: 'sc-liquidity-01',
      name: 'Crise de Liquidez Operacional',
      businessContext: 'Empresa do setor industrial enfrentando queda no caixa de curto prazo',
      initialState: { cashReserve: 5000000, opex: 12000000 },
      availableSignals: ['SIGNAL_CASH_DROP_35PCT'],
      expectedOutcomes: ['REDUCE_OPEX', 'EXTEND_DEBT_MATURITY'],
      evaluationCriteria: ['CashConversionCycle', 'EBITDAProtection']
    };

    expect(scenario.id).toBe('sc-liquidity-01');
    expect(scenario.availableSignals.length).toBe(1);
    expect(scenario.expectedOutcomes).toContain('REDUCE_OPEX');
  });
});
