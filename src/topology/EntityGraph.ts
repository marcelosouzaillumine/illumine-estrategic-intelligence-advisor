import { EntityGraphData, TopologyNode, TopologyEdge, EntityType } from './types';

export class EntityGraph {
  private data: EntityGraphData;

  constructor(data: EntityGraphData) {
    this.data = data;
  }

  getGroupId(): string {
    return this.data.groupId;
  }

  getNodes(): TopologyNode[] {
    return this.data.nodes;
  }

  getEdges(): TopologyEdge[] {
    return this.data.edges;
  }

  getNodeById(id: string): TopologyNode | undefined {
    return this.data.nodes.find(n => n.id === id);
  }

  getIntercompanyOperations() {
    return this.data.intercompanyOperations;
  }

  /**
   * Retorna os filhos diretos (ownership) de um nó.
   */
  getChildren(nodeId: string): TopologyNode[] {
    const childIds = this.data.edges
      .filter(e => e.sourceId === nodeId && e.type === 'OWNERSHIP')
      .map(e => e.targetId);
    
    return this.data.nodes.filter(n => childIds.includes(n.id));
  }

  /**
   * Retorna a topologia em ordem Bottom-Up (filhos primeiro, raiz por último)
   * Útil para consolidação recursiva.
   */
  getBottomUpProcessingOrder(): TopologyNode[] {
    const inDegree = new Map<string, number>();
    const outEdges = new Map<string, string[]>();
    
    this.data.nodes.forEach(n => {
      inDegree.set(n.id, 0);
      outEdges.set(n.id, []);
    });

    // Inverter as arestas de OWNERSHIP para ordenação Bottom-Up
    // Source (Holding) -> Target (Filial)
    // Para bottom up: dependência é Filial -> Holding
    this.data.edges.filter(e => e.type === 'OWNERSHIP').forEach(e => {
      const parent = e.sourceId;
      const child = e.targetId;
      
      outEdges.get(child)?.push(parent);
      inDegree.set(parent, (inDegree.get(parent) || 0) + 1);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id); // Nós folhas (sem filhos)
    });

    const order: TopologyNode[] = [];

    while (queue.length > 0) {
      const currId = queue.shift()!;
      const node = this.getNodeById(currId);
      if (node) order.push(node);

      outEdges.get(currId)?.forEach(parent => {
        inDegree.set(parent, (inDegree.get(parent) || 0) - 1);
        if (inDegree.get(parent) === 0) {
          queue.push(parent);
        }
      });
    }

    return order;
  }
}
