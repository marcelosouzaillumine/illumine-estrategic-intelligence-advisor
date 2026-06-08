import { describe, it, expect } from 'vitest';
import { DFCGovernanceOrchestrator } from '../runtime/governance/dfc/DFCGovernanceOrchestrator';

describe('Granatum 2023 DFC Golden Test', () => {
  it('deve identificar ilusão de caixa positivo sustentado por aportes enquanto a operação queima o lucro', () => {
    // Cenário Granatum 2023
    const filterYear = 2023;
    const lucroLiquido = 120000; // Lucro Positivo
    const fco = -150000;         // FCO Negativo (Lucro não converteu, caixa retido em estoques/clientes)
    const fci = -20000;          // FCI Negativo (Leve expansão/Capex)
    const fcf = 200000;          // FCF Positivo (Aporte forte dos sócios)
    const variacao = 30000;      // Variação Líquida
    const shareholderContributions = 200000; // Sócios cobriram o rombo
    const caixaFinalBP = 80000;  // Caixa final positivo
    const caixaFinalDFC = 80000; // Caixa final positivo
    const runway = 6;
    const isRecurrentNegativeFCO = true;

    const output = DFCGovernanceOrchestrator.orchestrate(
      filterYear,
      fco,
      fci,
      fcf,
      variacao,
      lucroLiquido,
      shareholderContributions,
      caixaFinalBP,
      caixaFinalDFC,
      runway,
      isRecurrentNegativeFCO
    );

    // 1. O Output deve ser válido matematicamente
    expect(output.validation.isValid).toBe(true);

    // 2. Classificação: Não pode ser Autossuficiente. Aportes excedem necessidade (ratio > 100%) -> Crítica
    expect(['DEPENDENCIA_CRITICA', 'DEPENDENCIA_RELEVANTE']).toContain(output.classifications.shareholderDependency);

    // 3. Status de Geração: Deve acusar Consumo
    expect(output.classifications.cashGenerationStatus).toBe('CONSUMO_OPERACIONAL');

    // 4. Divergência BP x DFC (Lucro vs FCO)
    expect(output.classifications.divergenceSeverity).toBe('EXPLAINABLE_WARNING');
    expect(output.narratives.divergenceExplanation).toContain('lucro contábil');
    expect(output.narratives.divergenceExplanation).toContain('consome caixa');

    // 5. Causalidade
    expect(output.narratives.causalNarrative).toBeDefined();
    expect(output.narratives.causalNarrative).toContain('sustentado por aporte dos sócios após consumo operacional');
  });
});
