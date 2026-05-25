import { GovernedFinancialEntry, ImportViolation } from './types';

export class SyntheticAnalyticGuard {
  /**
   * Protege saldos sintéticos (grupos) para que não sejam sobrescritos por cálculos cegos.
   */
  static validate(entries: GovernedFinancialEntry[]): GovernedFinancialEntry[] {
    const categories = entries.map(e => e.originalCategory.toLowerCase());
    
    // Simula detecção de agrupadores sintéticos que carregam valor cru no documento.
    entries.forEach(entry => {
      const rawCat = entry.originalCategory.toLowerCase();
      const isSynthetic = rawCat.includes('total') || rawCat.includes('subtotal') || rawCat === 'ativo' || rawCat === 'passivo';
      
      if (isSynthetic && entry.value !== null && entry.value !== 0) {
        // O dado é sintético e tem valor real. Ele deve ser protegido.
        // Adicionamos um metadado simulado ou violation de proteção.
        entry.deParaMetadata = entry.deParaMetadata || {
          mappedAccount: entry.category,
          confidence: 100,
          reason: 'Proteção sintética.',
          alternatives: [],
          requiresHumanValidation: false
        };
      }
      
      // Se houver conflito aparente onde um sintético pode ter sido calculado sem seus analíticos
      if (isSynthetic && entry.value === 0) {
         const violation: ImportViolation = {
            code: 'SYNTHETIC_CONFLICT',
            severity: 'HIGH',
            message: `A conta sintética "${entry.originalCategory}" foi lida sem valor, podendo causar falha no recálculo bottom-up.`
         };
         entry.violations.push(violation);
      }
    });

    return entries;
  }
}
