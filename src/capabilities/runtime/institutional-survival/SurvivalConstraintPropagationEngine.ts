// src/core/runtime/institutional-survival/SurvivalConstraintPropagationEngine.ts

import { InstitutionalSurvivalOutput } from './SurvivalTypes';

export class SurvivalConstraintPropagationEngine {
  /**
   * Propagates survival blocks to check if a specific action type is blocked.
   */
  public static isActionBlocked(actionType: string, output: InstitutionalSurvivalOutput): boolean {
    if (!output.activeSurvivalMode || output.activeSurvivalMode === 'SURVIVAL_MODE') {
      const blocked = ['EXPANSION', 'AGGRESSIVE_HIRING', 'SHAREHOLDER_RETURN', 'DIVIDEND', 'OWNER_WITHDRAWAL', 'AGGRESSIVE_CAPEX'];
      return blocked.includes(actionType.toUpperCase());
    }
    
    return output.forbiddenInstitutionalPriorities.includes(actionType.toUpperCase());
  }

  /**
   * Evaluates if a simulation scenario shock conflicts with survival constraints.
   */
  public static validateScenarioShocks(
    shocks: { type: string; description?: string }[],
    output: InstitutionalSurvivalOutput
  ): { isValid: boolean; reason?: string } {
    if (output.activeSurvivalMode === 'SURVIVAL_MODE') {
      for (const shock of shocks) {
        const type = (shock.type || '').toUpperCase();
        const desc = (shock.description || '').toLowerCase();
        
        const isExpansion = type.includes('EXPANSION') || desc.includes('expansão') || desc.includes('hiring') || desc.includes('contratação');
        const isDividend = type.includes('DIVIDEND') || type.includes('DISTRIBUTION') || desc.includes('divid') || desc.includes('distrib');
        const isCapex = type.includes('CAPEX') || desc.includes('capex');

        if (isExpansion || isDividend || isCapex) {
          return {
            isValid: false,
            reason: `INVALID_SURVIVAL_CONFLICT: Choque de ${isExpansion ? 'expansão' : isDividend ? 'distribuição' : 'Capex'} é inválido sob SURVIVAL_MODE ativo.`
          };
        }
      }
    }
    return { isValid: true };
  }

  /**
   * Sanitizes narratives by overriding optimistic or growth-oriented phrases when survival is active.
   */
  public static sanitizeNarrative(text: string, isSurvivalMode: boolean): string {
    if (!text || !isSurvivalMode) return text;

    let sanitized = text;

    const replacements: { pattern: RegExp; replacement: string }[] = [
      // English replacements
      { pattern: /healthy growth/gi, replacement: 'operational survival preservation' },
      { pattern: /sustainable growth/gi, replacement: 'cash preservation mode' },
      { pattern: /healthy expansion/gi, replacement: 'restricted expansion / survival focus' },
      { pattern: /structurally healthy/gi, replacement: 'structurally stressed (survival mode)' },
      { pattern: /growth and expansion/gi, replacement: 'liquidity preservation' },
      { pattern: /expansion healthy/gi, replacement: 'survival enforcement' },

      // Portuguese replacements
      { pattern: /forte crescimento/gi, replacement: 'preservação operacional e de caixa' },
      { pattern: /crescimento sustentável/gi, replacement: 'modo de preservação de caixa' },
      { pattern: /expansão saudável/gi, replacement: 'foco restrito em sobrevivência' },
      { pattern: /estruturalmente saudável/gi, replacement: 'estruturalmente estressada (modo sobrevivência)' },
      { pattern: /crescimento saudável/gi, replacement: 'estabilização operacional básica' },
      { pattern: /expansão e crescimento/gi, replacement: 'preservação de caixa' },
      { pattern: /crescimento e expansão/gi, replacement: 'preservação de caixa' },
      { pattern: /saudável/gi, replacement: 'sob regime de sobrevivência' }
    ];

    replacements.forEach(({ pattern, replacement }) => {
      sanitized = sanitized.replace(pattern, replacement);
    });

    return sanitized;
  }
}

