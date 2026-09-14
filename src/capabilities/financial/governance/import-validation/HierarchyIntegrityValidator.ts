import { GovernedFinancialEntry, ImportViolation } from '../../../../import-governance/types';

export class HierarchyIntegrityValidator {
  static validate(entries: GovernedFinancialEntry[]): GovernedFinancialEntry[] {
    const rootSynthetic = entries.find(e => e.originalCategory.toLowerCase() === 'ativo total' || e.originalCategory.toLowerCase() === 'ativo');
    if (rootSynthetic && entries.length < 5) {
       // Se tem raiz mas tem muito poucos analíticos, a hierarquia pode estar quebrada
       const violation: ImportViolation = {
          code: 'HIERARCHY_BROKEN',
          severity: 'HIGH',
          message: 'Mistura sintética e analítica desbalanceada detectada. Poucos dados analíticos para a estrutura sintética lida.'
       };
       rootSynthetic.violations.push(violation);
       rootSynthetic.status = 'NEEDS_REVIEW';
    }
    return entries;
  }
}
