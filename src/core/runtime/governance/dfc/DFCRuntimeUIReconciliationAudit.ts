import { CashFlowGovernanceOutput } from './CashFlowGovernanceOutput';

export class DFCRuntimeUIReconciliationAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    runtimeOutput: CashFlowGovernanceOutput,
    uiRenderedValues: {
      dependencyStatusRendered: string;
      cashGenerationStatusRendered: string;
      recommendationRendered: string;
    }
  ): { isReconciled: boolean; divergenceReason: string | null } {
    
    // Validate Shareholder Dependency
    // Runtime says Critical, but UI renders "Autossuficiente" or "Saudável"
    if (
      runtimeOutput.classifications.shareholderDependency === 'DEPENDENCIA_CRITICA' &&
      (uiRenderedValues.dependencyStatusRendered.includes('Autossuficiente') || 
       uiRenderedValues.dependencyStatusRendered.includes('Saudável'))
    ) {
      return {
        isReconciled: false,
        divergenceReason: 'DFC_RUNTIME_UI_DIVERGENCE: Tentativa de renderizar dependência crítica como operação autossuficiente na UI.'
      };
    }

    // Validate Cash Generation
    // Runtime says Consumo, but UI renders "Gera Caixa"
    if (
      runtimeOutput.classifications.cashGenerationStatus === 'CONSUMO_OPERACIONAL' &&
      uiRenderedValues.cashGenerationStatusRendered.includes('Gera Caixa')
    ) {
      return {
        isReconciled: false,
        divergenceReason: 'DFC_RUNTIME_UI_DIVERGENCE: Tentativa de renderizar consumo operacional como geração de caixa na UI.'
      };
    }

    // Recommendation divergence validation can be expanded here based on specific static UI overrides

    return { isReconciled: true, divergenceReason: null };
  }
}
