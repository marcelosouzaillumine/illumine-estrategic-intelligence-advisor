import { AdvisoryContextEngine } from '../packages/architecture-governance-advisory/src/engines/AdvisoryContextEngine.ts';
import { AdvisorySnapshotGenerator } from '../packages/architecture-governance-advisory/src/snapshots/AdvisorySnapshotGenerator.ts';

async function main() {
  const workspaceRoot = process.cwd();
  console.log('Running Architecture Advisory Engine (G4.0)...');

  // Load Mock Context
  const context: any = {
    id: `CTX-${Date.now()}`,
    targetSubject: 'Financial Intelligence',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-01',
    observations: [
      { id: 'OBS-1', metric: 'fan-out', before: 8, after: 17, timestamp: '2026-02-15T00:00:00Z' },
      { id: 'OBS-2', metric: 'change-count', before: 2, after: 12, timestamp: '2026-02-20T00:00:00Z' },
      { id: 'OBS-3', metric: 'boundary-contracts', before: 3, after: 7, timestamp: '2026-02-25T00:00:00Z' }
    ]
  };

  const engine = new AdvisoryContextEngine();
  const snapshot = engine.generateAdvisory(context);

  const generator = new AdvisorySnapshotGenerator(workspaceRoot);
  await generator.generate(snapshot);

  console.log(`Advisory Snapshot generated with ${snapshot.signals.length} signals and ${snapshot.narratives.length} narratives.`);
}

main().catch(console.error);
