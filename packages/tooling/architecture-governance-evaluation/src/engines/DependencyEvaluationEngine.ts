import { EvaluationEngineContract } from '../contracts/EvaluationEngineContract';
import { ArchitectureObservation } from '../models/ArchitectureObservation';
import { ArchitectureFinding } from '../models/ArchitectureFinding';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';

export class DependencyEvaluationEngine implements EvaluationEngineContract {
  public id = 'DependencyEvaluationEngine';
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
      // Calculate Fan-In
      const incoming = relationships.filter(r => r.targetId === artifact.id).length;
      observations.push({
        id: `OBS-DEP-IN-${i}`,
        artifactId: artifact.id,
        category: 'DEPENDENCY',
        metric: 'fan-in',
        value: incoming,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Calculate Fan-Out
      const outgoing = relationships.filter(r => r.sourceId === artifact.id).length;
      observations.push({
        id: `OBS-DEP-OUT-${i}`,
        artifactId: artifact.id,
        category: 'DEPENDENCY',
        metric: 'fan-out',
        value: outgoing,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Calculate Degree Centrality
      const degreeCentrality = incoming + outgoing;
      observations.push({
        id: `OBS-DEP-DEG-${i}`,
        artifactId: artifact.id,
        category: 'DEPENDENCY',
        metric: 'degree_centrality',
        value: degreeCentrality,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Calculate Betweenness Centrality (Approximate)
      const incomingEdges = relationships.filter(r => r.targetId === artifact.id);
      const outgoingEdges = relationships.filter(r => r.sourceId === artifact.id);
      let betweenness = 0;
      incomingEdges.forEach(inc => {
        outgoingEdges.forEach(outg => {
          if (inc.sourceId !== outg.targetId) {
            betweenness += 1;
          }
        });
      });
      observations.push({
        id: `OBS-DEP-BET-${i}`,
        artifactId: artifact.id,
        category: 'DEPENDENCY',
        metric: 'betweenness_centrality',
        value: betweenness,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Findings Logic (Just creating the findings without judging risk)
      if (outgoing > 10) {
        findings.push({
          id: `FND-DEP-OUT-${i}`,
          type: 'HIGH_FAN_OUT',
          observationIds: [`OBS-DEP-OUT-${i}`],
          threshold: 10,
          actualValue: outgoing
        });
      }
      
      if (betweenness > 15) { // Arbitrary heuristic just to map it for now
        findings.push({
          id: `FND-DEP-BET-${i}`,
          type: 'HIGH_BETWEENNESS_CENTRALITY',
          observationIds: [`OBS-DEP-BET-${i}`],
          threshold: 15,
          actualValue: betweenness
        });
      }
    });

    return { observations, findings };
  }
}
