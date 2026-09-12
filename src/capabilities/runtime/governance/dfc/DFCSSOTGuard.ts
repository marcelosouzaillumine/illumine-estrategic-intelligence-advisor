import { CashFlowGovernanceOutput } from './CashFlowGovernanceOutput';

export class DFCSSOTGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Garante que nenhum fallback legado ou payload não-auditado seja renderizado na DFCPage.
   * Se os dados do output não contiverem o signature/source esperado, ele bloqueia a renderização.
   */
  static enforce(output: any): CashFlowGovernanceOutput {
    if (!output || output.sourceStatement !== 'CASH_FLOW_STATEMENT' || !output.validation) {
      // Retorna um fallback vazio mas seguro que irá renderizar uma tela vazia em vez de legados corrompidos.
      // Em runtime real, isso poderia jogar um throw Error('LEGACY_NARRATIVE_RENDER_DETECTED');
      console.error('[DFCSSOTGuard] Bloqueando consumo de payload legado na DFCPage.');
      return {
        exerciseYear: new Date().getFullYear(),
        sourceStatement: 'CASH_FLOW_STATEMENT',
        metrics: { fco: 0, fci: 0, fcf: 0, netVariation: 0, accountingProfit: 0, shareholderContributions: 0 },
        classifications: { shareholderDependency: 'AUTOSSUFICIENTE', cashGenerationStatus: 'CONSUMO_OPERACIONAL', divergenceSeverity: 'NONE' },
        narratives: {
          divergenceExplanation: null,
          executiveSummary: 'Os dados da demonstração não passaram pela validação da camada de governança fiduciária.',
          primaryRecommendation: 'Solicitar reprocessamento do módulo DFC.',
          causalNarrative: ''
        },
        explainability: {
          generators: [],
          consumers: [],
          externalDependencies: [],
          recommendationDrivers: []
        },
        validation: { isValid: false, blockReason: 'LEGACY_NARRATIVE_RENDER_DETECTED' }
      };
    }
    
    // Se não for válido por causa matemática, o render será bloqueado no componente, mas retornamos o output real
    return output as CashFlowGovernanceOutput;
  }
}
