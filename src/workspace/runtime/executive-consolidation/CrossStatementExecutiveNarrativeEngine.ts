import { CrossStatementPropagationResult } from './CrossStatementPropagationEngine';

export interface ExecutiveNarrativeResult {
  hasTension: boolean;
  narrative: string;
}

export class CrossStatementExecutiveNarrativeEngine {
  /**
   * Transforma tensões numéricas detectadas em linguagem de Conselho.
   */
  public static generateNarrative(result: CrossStatementPropagationResult): ExecutiveNarrativeResult {
    const hasChain = (chainStr: string) => result.tensions.some(t => t.chain === chainStr);

    if (hasChain('DRE_DFC_DLPA')) {
      return {
        hasTension: true,
        narrative: "O prejuízo econômico do exercício pressionou a geração operacional de caixa e reduziu a preservação do capital aportado pelos sócios."
      };
    }

    const sentences: string[] = [];

    if (hasChain('DRE_DFC')) {
      sentences.push("O prejuízo operacional registrado no exercício consumiu caixa operacional.");
    }
    if (hasChain('DRE_DLPA')) {
      sentences.push("Houve redução na capacidade de preservação do capital próprio, ampliando o risco patrimonial.");
    }
    if (hasChain('DFC_CONTINUITY_PRESSURE')) {
      sentences.push("A contínua queima de caixa combinada com baixo runway eleva o risco de continuidade da operação no ciclo imediato.");
    }

    if (sentences.length > 0) {
      sentences.push("A continuidade desse padrão poderá ampliar a dependência de capitalizações futuras dos sócios.");
    }

    if (sentences.length === 0) {
      return {
        hasTension: false,
        narrative: "Ausência de tensões estruturais relevantes entre os fluxos econômicos, financeiros e patrimoniais."
      };
    }

    return {
      hasTension: true,
      narrative: sentences.join(' ')
    };
  }
}

