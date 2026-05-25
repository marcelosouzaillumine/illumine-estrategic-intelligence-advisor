import { InstitutionalOntology } from './KnowledgeGraphTypes';
import { GraphAuditLogger } from './GraphAuditLogger';

export class InstitutionalOntologyRegistry {
  private static registry: InstitutionalOntology[] = [
    {
      ontologyId: 'ONT-GOV-001',
      category: 'GOVERNANCE',
      label: 'Board Decision Pipeline',
      description: 'Estrutura semântica que liga Alertas Fiduciários a Workflows de Decisão do Board.'
    },
    {
      ontologyId: 'ONT-RISK-001',
      category: 'RISK',
      label: 'Liquidity Suffocation Causal Chain',
      description: 'Rede de causa e efeito partindo de Parasitismo Operacional para Asfixia de Liquidez.'
    }
  ];

  static getOntologies(): InstitutionalOntology[] {
    return [...this.registry];
  }

  static getOntologiesByCategory(category: string): InstitutionalOntology[] {
    return this.registry.filter(o => o.category === category);
  }

  // Na Fase 17, a UI não pode modificar isso.
}
