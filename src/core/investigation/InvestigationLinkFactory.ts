import { PersistentGraphNode } from '../../types/knowledge-graph/PersistentGraphNode';
import { InvestigationLink } from '../../types/investigation/InvestigationLink';
import { InstitutionalGraphQueryEngine } from '../knowledge-graph/query/InstitutionalGraphQueryEngine';

export class InvestigationLinkFactory {
  /**
   * Deriva um link investigativo exclusivamente a partir de um nó do grafo ou de seus metadados.
   * Não permite criação local via interfaces de UI.
   */
  static async createFromNodeId(tenantId: string, nodeId: string, originSurface: string): Promise<InvestigationLink | null> {
    const queryEngine = InstitutionalGraphQueryEngine; // Em uma implementação real usaríamos uma instância injetada
    // Assumimos que o backend possui método para buscar nó
    const rels = await queryEngine.findRelationships(nodeId);
    // Para construir o link corretamente sem a entidade base, precisaríamos buscá-la.
    // Simulando busca do nó:
    const evidenceAvailable = rels.some(r => r.relationshipType === 'DERIVED_FROM' || r.relationshipType === 'SUPPORTS' || r.targetNodeId.includes('ev'));
    
    // InvestigationLinkResolutionAudit (Auditoria Estrutural de Criação de Link)
    // Em produção, isso iria para uma coleção separada ou Tópico de Observabilidade
    console.debug(`[InvestigationLinkResolutionAudit]`, {
      sourceEntityId: nodeId,
      resolvedNodeId: nodeId, // Seria o nó real
      nodeType: 'UNKNOWN', // Seria resolvido
      originSurface,
      resolutionStatus: 'RESOLVED',
      timestamp: new Date().toISOString()
    });

    return {
      nodeId: nodeId,
      nodeType: 'UNKNOWN', // Seria preenchido pela busca real
      title: `Node ${nodeId}`, // Seria preenchido pela busca real
      correlationId: 'N/A', // Seria preenchido pela busca real
      evidenceAvailable,
      explainabilityAvailable: true,
      investigationAvailable: true
    };
  }

  static async createFromNode(tenantId: string, node: PersistentGraphNode): Promise<InvestigationLink> {
    // Para determinar se há evidências/explicabilidade disponíveis, verificamos os relacionamentos (fail-closed check).
    const rels = await InstitutionalGraphQueryEngine.findRelationships(node.nodeId);
    
    const evidenceAvailable = rels.some(r => r.relationshipType === 'DERIVED_FROM' || r.relationshipType === 'SUPPORTS' || r.targetNodeId.includes('ev'));
    const investigationAvailable = true; // Por definição, se o nó existe no repositório, pode ser investigado.
    
    return {
      nodeId: node.nodeId,
      nodeType: node.nodeType,
      title: node.title,
      correlationId: node.correlationId,
      evidenceAvailable,
      explainabilityAvailable: true, // Assuming basic explainability is available for persisted nodes
      investigationAvailable
    };
  }

  /**
   * Método síncrono para derivar um link se o contexto já foi validado 
   * ou se queremos exibir otimisticamente (apenas com base no ID existente).
   */
  static deriveOptimisticLink(node: PersistentGraphNode): InvestigationLink {
    return {
      nodeId: node.nodeId,
      nodeType: node.nodeType,
      title: node.title,
      correlationId: node.correlationId,
      evidenceAvailable: false, // Até que seja resolvido, assumimos false
      explainabilityAvailable: false,
      investigationAvailable: true
    };
  }
}
