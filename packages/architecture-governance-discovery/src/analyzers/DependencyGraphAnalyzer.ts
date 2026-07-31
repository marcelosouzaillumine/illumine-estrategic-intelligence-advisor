import { KnowledgeGraphBuilder } from '../graph/KnowledgeGraphBuilder';

export class DependencyGraphAnalyzer {
  constructor(private graph: KnowledgeGraphBuilder) {}

  public run() {
    // For now we just return the metrics, the actual metadata will be bundled in the snapshot
  }

  public getFanInFanOutMetrics() {
    const relationships = this.graph.getRelationships();
    const artifacts = this.graph.getArtifacts();
    
    const metrics: Record<string, { fanIn: number; fanOut: number; betweenness: number }> = {};
    
    artifacts.forEach(a => {
      metrics[a.id] = { fanIn: 0, fanOut: 0, betweenness: 0 };
    });

    relationships.forEach(rel => {
      if (metrics[rel.targetId]) metrics[rel.targetId].fanIn += 1;
      if (metrics[rel.sourceId]) metrics[rel.sourceId].fanOut += 1;
    });

    // Basic Betweenness Centrality Approximation (for undirected paths of length 2)
    // Real algorithm is O(V*E), we'll do a simple bridge score for demonstration.
    artifacts.forEach(node => {
      // Find paths A -> Node -> B
      const incoming = relationships.filter(r => r.targetId === node.id);
      const outgoing = relationships.filter(r => r.sourceId === node.id);
      
      let score = 0;
      incoming.forEach(inc => {
        outgoing.forEach(outg => {
          if (inc.sourceId !== outg.targetId) {
             score += 1; // It acts as a bridge between sourceId and targetId
          }
        });
      });
      // Normalize simple score
      if (metrics[node.id]) {
        metrics[node.id].betweenness = score;
      }
    });

    return metrics;
  }
}
