import { StructuralChange, EvolutionEvent, ArchitectureTrajectory } from '../models/index';
import { EvolutionPattern } from '../patterns/EvolutionPatterns';

export class TrajectoryAnalyzer {
  classify(changes: StructuralChange[]): EvolutionEvent[] {
    // Evolution Classification Layer
    return changes.map((change, index) => {
      let pattern: EvolutionPattern = 'TOPOLOGY_CHANGE';
      
      if (change.changeType === 'CREATED') {
        pattern = 'CAPABILITY_GROWTH';
      } else if (change.changeType === 'MODIFIED') {
        pattern = 'DEPENDENCY_EXPANSION';
      }

      return {
        id: `EVO-EVENT-${index}`,
        sourceSnapshot: change.fromSnapshotId,
        targetSnapshot: change.toSnapshotId,
        artifact: change.artifactId,
        changeType: pattern,
        before: {},
        after: { state: change.changeType },
        evidence: [
          {
            id: `EVI-${index}`,
            sourceSnapshotId: change.fromSnapshotId,
            targetSnapshotId: change.toSnapshotId,
            artifactId: change.artifactId,
            detectedBy: 'AST_COMPARISON',
            references: [`diff:${change.fromSnapshotId}:${change.toSnapshotId}`]
          }
        ]
      };
    });
  }

  project(events: EvolutionEvent[]): ArchitectureTrajectory[] {
    // Trajectory Projection Layer
    const trajectory: ArchitectureTrajectory = {
      id: `TRAJ-${Date.now()}`,
      subjectId: 'Financial Governance',
      subjectType: 'CAPABILITY',
      events: events
    };
    
    return [trajectory];
  }
}
