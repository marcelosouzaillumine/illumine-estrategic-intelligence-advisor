import { ArchitectureIntelligenceEngine } from '../packages/architecture-governance-intelligence/src/engines/ArchitectureIntelligenceEngine.ts';
import { IntelligenceSnapshotGenerator } from '../packages/architecture-governance-intelligence/src/snapshots/IntelligenceSnapshotGenerator.ts';
import fs from 'fs';
import path from 'path';

async function main() {
  const workspaceRoot = process.cwd();
  console.log('Running Architecture Governance Engine (G3.0)...');

  // Load Mock Snapshots from Registry
  const discoveryMock = {
    id: 'DISCOVERY-SNAPSHOT-v1',
    timestamp: new Date(),
    artifacts: [
      { id: 'engine-payment-001', type: 'COMPONENT', name: 'PaymentEngine' }
    ],
    relationships: [
      { sourceId: 'engine-payment-001', targetId: 'gateway-001', type: 'DEPENDS_ON' },
      { sourceId: 'engine-billing-001', targetId: 'engine-payment-001', type: 'DEPENDS_ON' }
    ]
  };

  const evaluationMock = {
    id: 'EVALUATION-SNAPSHOT-v1',
    timestamp: new Date(),
    observations: [
      {
        id: 'OBS-1',
        targetId: 'engine-payment-001',
        metricId: 'BOUNDARY-COHESION',
        value: 0.9,
        timestamp: new Date()
      }
    ]
  };

  const engine = new ArchitectureIntelligenceEngine();
  const snapshot = engine.generateIntelligence(discoveryMock, evaluationMock, 'CERTIFICATION-0001');

  const generator = new IntelligenceSnapshotGenerator(workspaceRoot);
  await generator.generate(snapshot);

  console.log(`Governance Snapshot generated with ${snapshot.insights.length} insights and ${snapshot.impacts.length} impact propagations.`);
}

main().catch(console.error);
