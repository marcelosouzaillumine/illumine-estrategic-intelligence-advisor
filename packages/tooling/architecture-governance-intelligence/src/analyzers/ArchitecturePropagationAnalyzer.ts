import { ArchitecturePropagation, IntelligenceContext } from '../models/index';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';

export class ArchitecturePropagationAnalyzer {
  analyze(targetArtifactId: string, discovery: DiscoverySnapshot, context: IntelligenceContext): ArchitecturePropagation {
    // Implementação mock/simplificada para análise de propagação estrutural em grafo AST/dependências
    const edges = discovery.relationships || [];
    
    // Algoritmo simplificado: acha todos que dependem diretamente ou indiretamente (nível 1 para fins ilustrativos) do target.
    const affected = edges
      .filter(edge => edge.targetId === targetArtifactId)
      .map(edge => edge.sourceId);

    return {
      target: targetArtifactId,
      affectedArtifacts: affected,
      impactDepth: affected.length > 0 ? 1 : 0, // Mock: calcula profundidade
      evidence: [
        `snapshot:${context.discoverySnapshotId}:relations`,
        `target:${targetArtifactId}`
      ]
    };
  }
}
