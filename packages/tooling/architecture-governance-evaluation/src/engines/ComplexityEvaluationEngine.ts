import { EvaluationEngineContract } from '../contracts/EvaluationEngineContract';
import { ArchitectureObservation } from '../models/ArchitectureObservation';
import { ArchitectureFinding } from '../models/ArchitectureFinding';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';

export class ComplexityEvaluationEngine implements EvaluationEngineContract {
  public id = 'ComplexityEvaluationEngine';
  public version = '1.0.0';

  public evaluate(snapshot: DiscoverySnapshot): { observations: ArchitectureObservation[]; findings: ArchitectureFinding[] } {
    const observations: ArchitectureObservation[] = [];
    const findings: ArchitectureFinding[] = [];

    const artifacts = snapshot.artifacts;
    const relationships = snapshot.relationships;

    const sourceSnapshot = {
      id: snapshot.snapshotId,
      generatedAt: snapshot.timestamp,
      gitCommit: snapshot.metadata.gitCommit
    };

    artifacts.forEach((artifact, i) => {
      // Mocking Lines of Code / Methods for now since AST parsing in G1.5 didn't persist AST size.
      // We will proxy complexity based on the amount of specific types of outbound relationships and artifact typings.
      
      const outbound = relationships.filter(r => r.sourceId === artifact.id).length;
      
      let complexityScore = 0;
      if (artifact.type === 'ENGINE') complexityScore += 50;
      if (artifact.type === 'CONTRACT') complexityScore += 10;
      complexityScore += (outbound * 2);

      observations.push({
        id: `OBS-CMP-SCORE-${i}`,
        artifactId: artifact.id,
        category: 'COMPLEXITY',
        metric: 'abstract_complexity_score',
        value: complexityScore,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Depth of dependencies (mocking simple 1-level for now)
      observations.push({
        id: `OBS-CMP-DEP-${i}`,
        artifactId: artifact.id,
        category: 'COMPLEXITY',
        metric: 'dependency_depth',
        value: outbound > 0 ? 1 : 0,
        sourceSnapshot,
        generatedBy: this.id
      });

      if (complexityScore > 100) {
        findings.push({
          id: `FND-CMP-SCORE-${i}`,
          type: 'HIGH_COMPLEXITY_ARTIFACT',
          observationIds: [`OBS-CMP-SCORE-${i}`],
          threshold: 100,
          actualValue: complexityScore
        });
      }
    });

    return { observations, findings };
  }
}
