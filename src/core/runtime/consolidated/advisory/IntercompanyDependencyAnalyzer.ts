import { ConsolidatedFinancialOutput } from '../types';
import { DependencyAnalysis } from './advisoryTypes';
import { formatEntityName } from '../../../../components/consolidated/ConsolidatedLanguageFormatter';

export class IntercompanyDependencyAnalyzer {
  static analyze(financialOutput: ConsolidatedFinancialOutput): DependencyAnalysis[] {
    const dependencies: DependencyAnalysis[] = [];
    const eliminations = financialOutput.eliminations;

    // Calcular totais de receita e ativo do consolidado para base de materialidade
    let totalRevenue = 0;
    financialOutput.consolidatedDRE.forEach(l => {
      if ((l.category || '').toLowerCase().includes('receita') && l.consolidatedValue > 0) {
        totalRevenue += l.consolidatedValue;
      }
    });

    for (const elim of eliminations) {
      if (elim.type === 'RECEITA_DESPESA') {
        const materiality = totalRevenue > 0 ? (elim.amount / totalRevenue) * 100 : 0;
        if (materiality > 5) {
          dependencies.push({
            sourceEntityId: elim.sourceEntityId,
            targetEntityId: elim.targetEntityId,
            dependencyType: 'REVENUE',
            materialityPercentage: materiality,
            description: `A entidade ${formatEntityName(elim.sourceEntityId)} concentra ${materiality.toFixed(1)}% do faturamento consolidado vendendo para ${formatEntityName(elim.targetEntityId)}.`
          });
        }
      }

      if (elim.type === 'MUTUO') {
        dependencies.push({
          sourceEntityId: elim.sourceEntityId,
          targetEntityId: elim.targetEntityId,
          dependencyType: 'FUNDING',
          materialityPercentage: 100,
          description: `A entidade ${formatEntityName(elim.targetEntityId)} é sustentada por operações estruturais de mútuo providas por ${formatEntityName(elim.sourceEntityId)}.`
        });
      }
    }

    return dependencies;
  }
}
