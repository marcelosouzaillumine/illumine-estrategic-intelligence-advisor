import { ArchitectureEvolutionEngine } from '../packages/architecture-governance-intelligence/src/evolution/engines/ArchitectureEvolutionEngine.ts';
import { EvolutionSnapshotGenerator } from '../packages/architecture-governance-intelligence/src/evolution/snapshots/EvolutionSnapshotGenerator.ts';

async function main() {
  const workspaceRoot = process.cwd();
  console.log('Running Architecture Evolution Engine (G3.5)...');

  // Load Mock Snapshots from Registry
  const intelV1: any = {
    version: 'INTELLIGENCE-SNAPSHOT-v1',
    insights: [],
    impacts: []
  };

  const intelV2: any = {
    version: 'INTELLIGENCE-SNAPSHOT-v2',
    insights: [],
    impacts: []
  };

  const engine = new ArchitectureEvolutionEngine();
  const snapshot = engine.generateEvolution(intelV1, intelV2);

  const generator = new EvolutionSnapshotGenerator(workspaceRoot);
  await generator.generate(snapshot);

  console.log(`Evolution Snapshot generated with ${snapshot.events.length} events spanning ${snapshot.patterns.length} patterns.`);
}

main().catch(console.error);
