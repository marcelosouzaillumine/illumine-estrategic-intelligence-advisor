import { InvestigationLink } from '../../types/investigation/InvestigationLink';
import { PersistentGraphNode } from '../../types/knowledge-graph/PersistentGraphNode';
import { InvestigationLinkFactory } from './InvestigationLinkFactory';

/**
 * INVESTIGATION BOUNDARY AUDIT
 * 
 * Este arquivo funciona como um guardião arquitetural (Type-level test).
 * Se as tipagens e acessos das interfaces de investigação mudarem e quebrarem 
 * as restrições fiduciárias, este arquivo apresentará erro de compilação.
 * 
 * Regra Ouro: 
 * NENHUM link de investigação pode ser instanciado manualmente.
 * TODO link deve ser originado do Graph Node via Factory.
 */
export class InvestigationBoundaryAudit {
  
  // Teste 1: O link gerado possui os atributos obrigatórios?
  static async verifyLinkStructure(tenantId: string, nodeId: string, originSurface: string): Promise<void> {
    const link: InvestigationLink | null = await InvestigationLinkFactory.createFromNodeId(tenantId, nodeId, originSurface);
    if (link) {
      // Must have structural ID mapping
      const id: string = link.nodeId;
      const type: string = link.nodeType;
      const available: boolean = link.investigationAvailable;
      
      // Prevent TS unused vars
      console.debug("Boundary Audit Passed:", { id, type, available });
    }
  }

  // Teste 2: O Factory garante a ingestão a partir de PersistentGraphNode?
  static async verifyFactoryAcceptsGraphNode(tenantId: string, node: PersistentGraphNode): Promise<void> {
    const link: InvestigationLink = await InvestigationLinkFactory.createFromNode(tenantId, node);
    console.debug("Boundary Audit Passed:", link.title);
  }

  // Teste 3: NENHUMA tentativa de injetar "engineResults" diretamente no InvestigationLink deve ser possível
  static preventDirectEngineInjection(link: InvestigationLink) {
    // Se InvestigationLink for modificado no futuro para aceitar calculos inline,
    // esta auditoria falhará propositalmente (ex: link.computedScore = 99).
    // O Objeto InvestigationLink deve ser puramente de navegação.
    // @ts-expect-error
    link.computedScore = 99;
  }
}
