import { ArchitectureInsight, ArchitecturePropagation, IntelligenceContext, ArchitectureIntelligenceSnapshot } from '../models/index';
import { CouplingAnalyzer, BoundaryChangeAnalyzer, ArchitecturePropagationAnalyzer } from '../analyzers/index';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';
import { EvaluationSnapshot } from '@illumine/architecture-governance-evaluation';

export class ArchitectureIntelligenceEngine {
  private couplingAnalyzer = new CouplingAnalyzer();
  private boundaryAnalyzer = new BoundaryChangeAnalyzer();
  private propagationAnalyzer = new ArchitecturePropagationAnalyzer();

  constructor(private readonly engineVersion: string = 'G3.0') {}

  generateIntelligence(
    discovery: DiscoverySnapshot,
    evaluation: EvaluationSnapshot,
    certificationId?: string
  ): ArchitectureIntelligenceSnapshot {
    const context: IntelligenceContext = {
      discoverySnapshotId: discovery.id,
      evaluationSnapshotId: evaluation.id,
      certificationHistoryId: certificationId,
      analyzerVersion: this.engineVersion,
      generatedAt: new Date().toISOString()
    };

    const insights: ArchitectureInsight[] = [
      ...this.couplingAnalyzer.analyze(discovery, context),
      ...this.boundaryAnalyzer.analyze(evaluation, context)
    ];

    // Analisa propagação para cada componente descoberto
    const impacts: ArchitecturePropagation[] = [];
    if (discovery.artifacts) {
      discovery.artifacts.forEach(artifact => {
        const propagation = this.propagationAnalyzer.analyze(artifact.id, discovery, context);
        if (propagation.affectedArtifacts.length > 0) {
          impacts.push(propagation);
        }
      });
    }

    return {
      version: this.engineVersion,
      source: {
        discoverySnapshotId: discovery.id,
        evaluationSnapshotId: evaluation.id,
        certificationSnapshotId: certificationId || 'N/A'
      },
      insights,
      impacts,
      generatedBy: {
        engineVersion: this.engineVersion
      }
    };
  }
}
