import { CashFlowGovernanceOutput } from './CashFlowGovernanceOutput';

export class DFCCashFlowIntegrityGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static validate(
    fco: number,
    fci: number,
    fcf: number,
    netVariation: number
  ): { isValid: boolean; blockReason: string | null } {
    // 1. Guard against NaNs
    if (isNaN(fco) || isNaN(fci) || isNaN(fcf) || isNaN(netVariation)) {
      return {
        isValid: false,
        blockReason: 'Valores corrompidos detectados na DFC (NaN). A interface foi bloqueada para evitar deliberações com dados inválidos.',
      };
    }

    // 2. Mathematical Integrity Guard
    // Allow a very small tolerance for floating point rounding issues (e.g. 0.01)
    const calculatedVariation = fco + fci + fcf;
    const difference = Math.abs(calculatedVariation - netVariation);
    
    // Tolerância de R$ 1,00 para problemas de arredondamento
    if (difference > 1) {
      return {
        isValid: false,
        blockReason: `Inconsistência matemática na DFC: FCO (${fco.toFixed(2)}) + FCI (${fci.toFixed(2)}) + FCF (${fcf.toFixed(2)}) = ${calculatedVariation.toFixed(2)}, mas a Variação Líquida declarada é ${netVariation.toFixed(2)}. Diferença não reconciliada de ${difference.toFixed(2)}.`,
      };
    }

    return { isValid: true, blockReason: null };
  }
}
