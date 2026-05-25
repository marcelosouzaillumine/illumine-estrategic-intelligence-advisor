import { ConsolidatedFinancialOutput } from '../types';
import { CrossEntityCausality, DependencyAnalysis, HoldingRoleAnalysis } from './advisoryTypes';

export class CrossEntityCausalityEngine {
  static analyze(
    financialOutput: ConsolidatedFinancialOutput, 
    dependencies: DependencyAnalysis[],
    roles: HoldingRoleAnalysis[]
  ): CrossEntityCausality[] {
    const causalities: CrossEntityCausality[] = [];

    // 1. Identificar Crescimento Artificial (Artificial Revenue Inflation)
    const revenueDeps = dependencies.filter(d => d.dependencyType === 'REVENUE');
    for (const dep of revenueDeps) {
      if (dep.materialityPercentage > 30) {
        causalities.push({
          causalityType: 'ARTIFICIAL_GROWTH',
          primaryEntityId: dep.sourceEntityId,
          secondaryEntityId: dep.targetEntityId,
          impactScale: 'CRITICAL',
          description: `O crescimento/volume da entidade ${dep.sourceEntityId} possui distorção estrutural, sendo artificialmente sustentado pela matriz/filial ${dep.targetEntityId}.`,
          financialEvidence: {
            metric: 'Intercompany Revenue Concentration',
            value: dep.materialityPercentage,
            context: 'Porcentagem da receita gerada intragrupo'
          }
        });
      }
    }

    // 2. Identificar Parasitismo Operacional ou Funding Recorrente
    const fundingDeps = dependencies.filter(d => d.dependencyType === 'FUNDING');
    for (const dep of fundingDeps) {
      const sourceRole = roles.find(r => r.entityId === dep.sourceEntityId);
      const targetRole = roles.find(r => r.entityId === dep.targetEntityId);

      if (sourceRole?.inferredRole === 'SUBSIDIARIA_OPERACIONAL' && targetRole?.inferredRole.includes('HOLDING')) {
        // Holding drenando subsidiária
        causalities.push({
          causalityType: 'OPERATIONAL_PARASITISM',
          primaryEntityId: dep.targetEntityId,
          secondaryEntityId: dep.sourceEntityId,
          impactScale: 'HIGH',
          description: `A entidade Holding (${dep.targetEntityId}) atua como absorvedora do caixa gerado pela unidade operacional ${dep.sourceEntityId}, criando pressão sobre o ciclo de liquidez da subsidiária.`,
          financialEvidence: {
            metric: 'Upstream Funding',
            value: 1,
            context: 'Mútuo provido pela filial à matriz'
          }
        });
      } else if (sourceRole?.inferredRole.includes('HOLDING') && targetRole?.inferredRole === 'SUBSIDIARIA_OPERACIONAL') {
        // Holding injetando na subsidiária (Subsidiação artificial)
        causalities.push({
          causalityType: 'ARTIFICIAL_SUBSIDIZATION',
          primaryEntityId: dep.targetEntityId,
          secondaryEntityId: dep.sourceEntityId,
          impactScale: 'HIGH',
          description: `A subsidiária ${dep.targetEntityId} apresenta dependência estrutural de capital intragrupo para sustentar sua operação (subsidiação fornecida por ${dep.sourceEntityId}).`,
          financialEvidence: {
            metric: 'Downstream Funding',
            value: 1,
            context: 'Sustentação financeira por mútuo da matriz'
          }
        });
      }
    }

    return causalities;
  }
}
