import { GovernedFinancialEntry, DeParaMetadata, ImportViolation } from '../../../../import-governance/types';

export class AccountMappingValidator {
  /**
   * Avalia a ambiguidade do De-Para.
   */
  static validate(entry: GovernedFinancialEntry): GovernedFinancialEntry {
    const rawCategory = entry.originalCategory.toLowerCase();
    
    // Regra: Adiantamento a fornecedores vs Fornecedores
    if (rawCategory.includes('fornecedor')) {
      if (rawCategory.includes('adiantamento')) {
        entry.deParaMetadata = {
          mappedAccount: 'Ativo Circulante',
          confidence: 90,
          reason: 'Identificado como adiantamento, portanto pertence ao Ativo.',
          alternatives: ['Passivo Circulante'],
          requiresHumanValidation: false
        };
      } else {
        entry.deParaMetadata = {
          mappedAccount: 'Passivo Circulante',
          confidence: 80,
          reason: 'Identificado como obrigação com fornecedores.',
          alternatives: [],
          requiresHumanValidation: false
        };
      }
    }

    // Regra Genérica para mapeamentos incertos
    if (!entry.deParaMetadata) {
      entry.deParaMetadata = {
        mappedAccount: entry.category || 'Desconhecido',
        confidence: 40,
        reason: 'Mapeamento inferido por heurística genérica ou ausente.',
        alternatives: [],
        requiresHumanValidation: true
      };
      
      const violation: ImportViolation = {
        code: 'AMBIGUOUS_MAPPING',
        severity: 'MEDIUM',
        message: `A conta "${entry.originalCategory}" foi mapeada com baixa segurança e requer validação humana.`
      };
      entry.violations.push(violation);
    } else if (entry.deParaMetadata.requiresHumanValidation) {
      const violation: ImportViolation = {
        code: 'HUMAN_VALIDATION_REQUIRED',
        severity: 'MEDIUM',
        message: `Mapeamento da conta "${entry.originalCategory}" exige confirmação.`
      };
      entry.violations.push(violation);
    }

    return entry;
  }
}
