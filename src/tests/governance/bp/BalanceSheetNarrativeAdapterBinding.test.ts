import { BalanceSheetExecutiveNarrativeEngine } from '../../../capabilities/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine';

describe('Balance Sheet Narrative Adapter Binding Test', () => {
  it('Should generate narrative correctly when sufficient data is present', () => {
    // Phase 5: Adapter Preservation Test
    
    const mockSummary = {
      patrimonioLiquido: 207999.77,
      ativoTotal: 280000,
      caixaEquivalentes: 50000,
      passivoCirculante: 30000,
    };
    
    const mockIndicators = [
      { metricName: 'Liquidez Real', value: 9.05, classification: 'HEALTHY' },
      { metricName: 'Liquidez Instantânea Real', value: 6.29, classification: 'HEALTHY' },
      { metricName: 'Endividamento Geral', value: 0.261, classification: 'HEALTHY' },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.35, classification: 'HEALTHY' },
      { metricName: 'Capital Consumido', value: 0.225, classification: 'ATTENTION', evidence: { capitalConsumedAmount: 60536.59 } },
      { metricName: 'Capital de Giro Líquido', classification: 'ATTENTION', rationale: 'ociosidade' }
    ];

    const narrativeObj = BalanceSheetExecutiveNarrativeEngine.generate(mockIndicators, mockSummary, 2023 as any, [] as any) as any;
    const narrative = narrativeObj.text || narrativeObj;

    // Validate expected narrative components
    expect(narrative).toContain('207.999,77');
    expect(narrative).toContain('74,3%'); // 207999.77 / 280000 = 74.28% -> 74,3%
    expect(narrative).toContain('solvência patrimonial preservada');
    expect(narrative).toContain('Liquidez Real de 9,05');
    expect(narrative).toContain('Liquidez Instantânea Real de 6,29');
    expect(narrative).toContain('endividamento geral é reduzido');
    expect(narrative).toContain('26,1%');
    expect(narrative).toContain('0,35x');
    expect(narrative).toContain('22,5%');
    expect(narrative).toContain('reserva financeira elevada');

    // Forbidden components
    expect(narrative).not.toContain('MISSING_EXECUTIVE_NARRATIVE');
    expect(narrative).not.toContain('Nenhuma narrativa disponível');
    expect(narrative).not.toContain('NaN');
    expect(narrative).not.toContain('INSUFFICIENT_DATA');
  });
});
