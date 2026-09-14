import { ArchitectureInsight, IntelligenceContext } from '../models/index';
import { EvaluationSnapshot } from '@illumine/architecture-governance-evaluation';

export class BoundaryChangeAnalyzer {
  analyze(evaluation: EvaluationSnapshot, context: IntelligenceContext): ArchitectureInsight[] {
    const insights: ArchitectureInsight[] = [];
    
    // Mock: Analisa observações buscando violações de boundary para criar insight neutro
    evaluation.observations.forEach((obs, index) => {
      if (obs.metricId.includes('BOUNDARY')) {
        insights.push({
          id: `INSIGHT-BND-${context.generatedAt}-${index}`,
          category: 'BOUNDARY',
          subject: obs.targetId,
          observation: `Metric ${obs.metricId} recorded value ${obs.value}`,
          interpretation: 'BOUNDARY_CHANGE',
          evidence: [
            `snapshot:${context.evaluationSnapshotId}:obs:${obs.id}`
          ],
          confidence: 'HIGH',
          generatedAt: context.generatedAt
        });
      }
    });

    return insights;
  }
}
