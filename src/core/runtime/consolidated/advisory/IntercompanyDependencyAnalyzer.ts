import { ConsolidatedFinancialOutput } from '../types';
import { DependencyAnalysis } from './advisoryTypes';

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
        // Source vendeu para Target. Target depende da Source para fornecimento, ou Source depende do Target para receita.
        // Vamos focar na dependência de receita
        const materiality = totalRevenue > 0 ? (elim.amount / totalRevenue) * 100 : 0;
        if (materiality > 5) {
          dependencies.push({
            sourceEntityId: elim.sourceEntityId,
            targetEntityId: elim.targetEntityId,
            dependencyType: 'REVENUE',
            materialityPercentage: materiality,
            description: `A entidade ${elim.sourceEntityId} concentra ${materiality.toFixed(1)}% do faturamento consolidado vendendo para ${elim.targetEntityId}.`
          });
        }
      }

      if (elim.type === 'MUTUO') {
        // Source emprestou para Target. Target tem dependência de Funding.
        dependencies.push({
          sourceEntityId: elim.sourceEntityId,
          targetEntityId: elim.targetEntityId,
          dependencyType: 'FUNDING',
          materialityPercentage: 100, // Não temos base de passivo aqui fácil, mas é material.
          description: `A entidade ${elim.targetEntityId} é sustentada por operações estruturais de mútuo providas por ${elim.sourceEntityId}.`
        });
      }
    }

    return dependencies;
  }
}
