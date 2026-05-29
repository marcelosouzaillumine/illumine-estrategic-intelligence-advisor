// src/core/runtime/war-gaming/InstitutionalCollapseConstraintEngine.ts

import { CrisisInput, InstitutionalWarGameScenario } from './war-gaming-types';

export class InstitutionalCollapseConstraintEngine {
  /**
   * Block if crisis inputs exceed fiduciary rational bounds (e.g. 100% immediate revenue drop without history context).
   */
  public static validateCrisisInputs(inputs: CrisisInput[]): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!inputs || inputs.length === 0) {
      violations.push('Cenário vazio sem vetores de crise definidos.');
      return { valid: false, violations };
    }

    inputs.forEach((input) => {
      if (input.magnitude < 0 || input.magnitude > 1) {
        if (input.type === 'REVENUE_COMPRESSION' && input.magnitude > 0.8) {
           // allow > 1 if it's not a percentage drop? No, magnitude for drops is usually 0 to 1.
           // Let's assume magnitude is percentage absolute for drops
           if (input.magnitude > 1) {
             violations.push(`Magnitude inválida para a crise ${input.type}: ${input.magnitude}. Excede 100% de deterioração.`);
           }
        }
      }

      if (input.durationMonths <= 0) {
        violations.push(`Duração inválida para a crise ${input.type}. Deve ser maior que 0 meses.`);
      }

      if (input.type === 'HYBRID_SHOCK' && inputs.length === 1) {
        violations.push(`Crises híbridas precisam especificar vetores componentes, não apenas o tipo genérico.`);
      }
    });

    return {
      valid: violations.length === 0,
      violations
    };
  }

  /**
   * Fail-closed if there is no structural DFC / baseline data to perform the war game.
   */
  public static enforceBaselineDataIntegrity(
    hasDFC: boolean, 
    hasValidCash: boolean, 
    hasValidFunding: boolean
  ): { allowed: boolean; reason: string } {
    if (!hasDFC) {
      return { allowed: false, reason: 'Simulação de tesouraria indisponível por insuficiência estrutural de dados (DFC ausente).' };
    }
    if (!hasValidCash) {
      return { allowed: false, reason: 'Simulação bloqueada: Posição de caixa corrompida ou ausente no baseline.' };
    }
    if (!hasValidFunding) {
      return { allowed: false, reason: 'Simulação bloqueada: Posição de passivos de financiamento (Funding) inconsistente.' };
    }

    return { allowed: true, reason: 'Baseline fiduciariamente íntegro.' };
  }

  /**
   * Audit output to ensure no predictive bankruptcy language is used.
   */
  public static sanitizeNarrative(text: string): string {
    let sanitized = text;
    const forbiddenTerms = [
      'falência certa', 'previsão de falência', 'inevitável',
      'certeza de colapso', 'fim da empresa', 'fechar as portas',
      'provavelmente vai quebrar', 'previsão', 'vai acontecer'
    ];

    forbiddenTerms.forEach(term => {
      const regex = new RegExp(term, 'gi');
      sanitized = sanitized.replace(regex, '[RESTRIÇÃO FIDUCIÁRIA: Inferência Especulativa Removida]');
    });

    return sanitized;
  }
}
