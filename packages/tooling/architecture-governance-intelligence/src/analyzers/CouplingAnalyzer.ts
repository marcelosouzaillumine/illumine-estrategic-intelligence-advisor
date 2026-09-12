import { ArchitectureInsight, IntelligenceContext } from '../models/index';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';

export class CouplingAnalyzer {
  analyze(discovery: DiscoverySnapshot, context: IntelligenceContext): ArchitectureInsight[] {
    const insights: ArchitectureInsight[] = [];
    const relationships = discovery.relationships || [];

    // Mock: Cálculo de componentes com alto Fan-In
    const fanInCount: Record<string, number> = {};
    relationships.forEach(rel => {
      fanInCount[rel.targetId] = (fanInCount[rel.targetId] || 0) + 1;
    });

    for (const [nodeId, count] of Object.entries(fanInCount)) {
      if (count > 5) {
        insights.push({
          id: `INSIGHT-CPL-${Date.now()}-${nodeId}`,
          category: 'DEPENDENCY',
          subject: nodeId,
          observation: `Component presents fan-in of ${count}`,
          interpretation: 'DEPENDENCY_EXPANSION',
          evidence: [
            `snapshot:${context.discoverySnapshotId}:relations`,
            `target:${nodeId}`
          ],
          confidence: 'HIGH',
          generatedAt: context.generatedAt
        });
      }
    }

    return insights;
  }
}
