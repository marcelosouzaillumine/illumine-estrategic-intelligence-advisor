import { ConsolidatedFinancialOutput, ConsolidationEntity } from '../types';
import { HoldingRoleAnalysis, InstitutionalRole } from './advisoryTypes';

export class HoldingStructureInterpreter {
  static analyze(entities: ConsolidationEntity[], financialOutput: ConsolidatedFinancialOutput): HoldingRoleAnalysis[] {
    const roles: HoldingRoleAnalysis[] = [];

    for (const entity of entities) {
      // Coletar totais da entidade buscando nos proveniences (isso seria uma simplificação, 
      // idealmente os dados individuais estariam disponíveis ou buscaríamos da input original).
      // Como a engine precisa de dados isolados, vamos inferir a partir do lineage
      
      let hasRevenue = false;
      let hasSignificantCosts = false;
      let isParent = entity.role === 'PARENT';
      
      // Procura se a entidade gerou receita bruta no dre consolidado (via provenance)
      const receitaLines = financialOutput.consolidatedDRE.filter(d => 
        (d.category || '').toLowerCase().includes('receita') && !d.category.toLowerCase().includes('intercompany')
      );
      
      for (const rl of receitaLines) {
        const p = rl.provenance.find(prov => prov.entityId === entity.id);
        if (p && p.value > 0) hasRevenue = true;
      }

      // Custos
      const costLines = financialOutput.consolidatedDRE.filter(d => 
        (d.category || '').toLowerCase().includes('custo')
      );
      for (const cl of costLines) {
        const p = cl.provenance.find(prov => prov.entityId === entity.id);
        if (p && p.value < 0) hasSignificantCosts = true; // assumindo negativo
      }

      let inferredRole: InstitutionalRole = 'SUBSIDIARIA_OPERACIONAL';
      let isTreasuryAbsorber = false;
      let isOperational = hasRevenue || hasSignificantCosts;
      let justification = '';

      if (isParent) {
        if (hasRevenue) {
          inferredRole = 'HOLDING_OPERACIONAL';
          justification = 'Matriz exerce atividade operacional geradora de receita e custos, não sendo apenas um veículo patrimonial.';
        } else {
          inferredRole = 'HOLDING_PATRIMONIAL';
          isOperational = false;
          justification = 'Matriz atua primariamente como veículo patrimonial de consolidação, sem geração de receita operacional própria significativa.';
          // Treasury absorber logic will be refined by IntercompanyDependencyAnalyzer
        }
      } else {
        if (!hasRevenue && !hasSignificantCosts) {
          inferredRole = 'VEICULO_FINANCEIRO'; // ou SPE
          isOperational = false;
          justification = 'Subsidiária não apresenta indícios de ciclo operacional ativo (sem receita ou custos core detectados).';
        } else {
          inferredRole = 'SUBSIDIARIA_OPERACIONAL';
          justification = 'Subsidiária exerce atividade operacional base, geradora de fluxo (receita/custo).';
        }
      }

      roles.push({
        entityId: entity.id,
        inferredRole,
        isTreasuryAbsorber, // Default, to be enriched
        isOperational,
        justification
      });
    }

    return roles;
  }
}
