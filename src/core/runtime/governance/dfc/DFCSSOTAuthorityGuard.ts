import { logger } from "../../../../services/logging/InstitutionalLogger";
import { CashFlowGovernanceOutput } from './CashFlowGovernanceOutput';

export class DFCSSOTAuthorityGuard {
  /**
   * Garante que nenhum fallback legado (defaultNote, fallbackNarrative, etc.)
   * seja consumido pela UI. Exige a presença de uma fonte de verdade validada.
   */
  static enforce(
    output: any,
    legacyPayloadsDetected: boolean = false
  ): CashFlowGovernanceOutput {
    
    if (legacyPayloadsDetected) {
      return this.buildUnauthorizedFallback('UNAUTHORIZED_DFC_OUTPUT_SOURCE: Tentativa de renderizar legacy fallbacks (defaultNote, fallbackNarrative, staticRecommendation) detectada na UI.');
    }

    if (!output || output.sourceStatement !== 'CASH_FLOW_STATEMENT' || !output.validation) {
      return this.buildUnauthorizedFallback('UNAUTHORIZED_DFC_OUTPUT_SOURCE: Payload não validado pela governança fiduciária da DFC.');
    }

    // Passou em todas as validações SSOT
    return output as CashFlowGovernanceOutput;
  }

  private static buildUnauthorizedFallback(reason: string): CashFlowGovernanceOutput {
    logger.error('DFCSSOTAuthorityGuard Violation', { reason });
    return {
      exerciseYear: new Date().getFullYear(),
      sourceStatement: 'CASH_FLOW_STATEMENT',
      metrics: { fco: 0, fci: 0, fcf: 0, netVariation: 0, accountingProfit: 0, shareholderContributions: 0 },
      classifications: { shareholderDependency: 'AUTOSSUFICIENTE', cashGenerationStatus: 'CONSUMO_OPERACIONAL', divergenceSeverity: 'MATHEMATICAL_BLOCKING' },
      narratives: {
        divergenceExplanation: null,
        executiveSummary: 'Os dados da demonstração foram bloqueados pela Autoridade de Governança (SSOT).',
        primaryRecommendation: 'Corrigir as origens de dados e remover hardcoded fallbacks da interface.',
        causalNarrative: ''
      },
      explainability: {
        generators: [],
        consumers: [],
        externalDependencies: [],
        recommendationDrivers: []
      },
      validation: { isValid: false, blockReason: reason }
    };
  }
}
