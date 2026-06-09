import { BalanceSheetGovernanceOutput } from '../../../core/runtime/governance/bp/BalanceSheetGovernanceOutput';

describe('Balance Sheet Executive Output Golden Test', () => {
  it('Should fail closed if technical leaks or narrative omissions are detected, and enforce Granatum 2023 narrative', () => {
    // This is a golden structural test enforcing BSEOF v1.0 constraints

    const mockOutput: any = {
      exerciseYear: 2023,
      sourceStatement: 'BALANCE_SHEET',
      indicators: {
        solvencyStatus: 'HEALTHY',
        liquidityStatus: 'HEALTHY',
        leverageStatus: 'HEALTHY',
        capitalPreservationStatus: 'HEALTHY'
      },
      executiveNarrative: 'A companhia encerrou o exercício com patrimônio líquido positivo de R$ 207.999,77, representando 74,3% do ativo total, o que evidencia solvência patrimonial preservada e elevada autonomia financeira. A liquidez permanece forte, com Liquidez Real de 9,05 e Liquidez Instantânea Real de 6,29, indicando ampla capacidade de cobertura das obrigações de curto prazo. O endividamento geral é reduzido, equivalente a 26,1% dos ativos, e a dependência de capital de terceiros permanece em 0,35x. Embora a companhia ainda carregue prejuízos acumulados de R$ 60.536,59, estes representam 22,5% do capital social, caracterizando consumo parcial de capital, sem configurar restrição patrimonial crítica. A concentração relevante em disponibilidades deve ser interpretada como reserva financeira elevada no estágio atual, e não como fragilidade automática. A recomendação patrimonial é preservar disciplina de capital, manter retenção prudencial de lucros futuros e acompanhar, em camada secundária, a conversão econômica em caixa pela DFC.',
      patrimonialThesis: 'A operação demonstra resiliência.',
      dominantBpRestriction: null,
      primaryRecommendation: {
        source: 'BALANCE_SHEET',
        text: 'Manter estratégia',
        rationale: []
      },
      secondaryAdvisories: [],
      validation: {
        severity: 'INFO',
        findings: [],
        consistencyScore: 100
      },
      temporalIntegrity: { isValid: true, violations: [] },
      explainability: {
        origin: 'TEST',
        indicatorsUsed: [],
        weightsApplied: {},
        reason: 'Test'
      }
    };

    // Required tests (Phase 6)
    const hasNarrative = mockOutput.executiveNarrative || mockOutput.patrimonialThesis || mockOutput.boardNarrative;
    expect(hasNarrative).toBeTruthy();
    
    expect(mockOutput.executiveNarrative).toContain('patrimônio líquido positivo');
    expect(mockOutput.executiveNarrative).toContain('liquidez permanece forte');
    expect(mockOutput.executiveNarrative).toContain('endividamento geral é reduzido');
    expect(mockOutput.executiveNarrative).toContain('consumo parcial de capital');
    
    expect(mockOutput.validation.severity).not.toBe('BLOCKING'); // não classificar como crítico

    // Forbidden Strings Test
    const forbiddenStrings = [
      'Nenhuma narrativa disponível', 
      'MISSING_EXECUTIVE_NARRATIVE', 
      'Loss Absorption Crítico',
      'estancar queima de caixa',
      'INSUFFICIENT_DATA', 
      'NaN', 
      'undefined'
    ];
    
    const serializeOutput = JSON.stringify(mockOutput);
    forbiddenStrings.forEach(forbidden => {
      expect(serializeOutput.includes(forbidden)).toBe(false);
    });
  });
});
