import { ArchitectureIntelligenceSnapshot } from '../../models/index';
import { EvolutionSnapshot, ArchitectureTrajectory } from '../models/index';
import { EvolutionPattern } from '../patterns/EvolutionPatterns';
import { SnapshotComparator } from './SnapshotComparator';
import { TrajectoryAnalyzer } from './TrajectoryAnalyzer';

export class ArchitectureEvolutionEngine {
  private comparator = new SnapshotComparator();
  private analyzer = new TrajectoryAnalyzer();

  constructor(private readonly engineVersion: string = 'G3.5') {}

  generateEvolution(fromSnapshot: ArchitectureIntelligenceSnapshot, toSnapshot: ArchitectureIntelligenceSnapshot): EvolutionSnapshot {
    
    // 1. Change Detection Layer
    const changes = this.comparator.compare(fromSnapshot, toSnapshot);
    
    // 2. Evolution Classification Layer
    const events = this.analyzer.classify(changes);
    
    // 3. Trajectory Projection Layer
    const trajectories = this.analyzer.project(events);

    const patterns = Array.from(new Set(events.map(e => e.changeType))) as EvolutionPattern[];
    const evidence = events.flatMap(e => e.evidence);

    return {
      version: this.engineVersion,
      period: {
        fromSnapshotId: fromSnapshot.version,
        toSnapshotId: toSnapshot.version
      },
      events,
      patterns,
      evidence,
      generatedBy: {
        engineVersion: this.engineVersion
      }
    };
  }
}
