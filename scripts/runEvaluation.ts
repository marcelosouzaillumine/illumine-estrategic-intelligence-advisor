import { DependencyEvaluationEngine, BoundaryEvaluationEngine, ComplexityEvaluationEngine, EvaluationSnapshotGenerator } from '../packages/architecture-governance-evaluation/src';
import fs from 'fs';
import path from 'path';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';

console.log('Starting Architecture Evaluation Engine (Wave G2.0)...');

const basePath = process.cwd();
const discoverySnapshotPath = path.join(basePath, 'artifacts/governance-discovery/DISCOVERY-SNAPSHOT-v1/graph.json');

if (!fs.existsSync(discoverySnapshotPath)) {
  console.error('Discovery Snapshot not found! Run discovery first.');
  process.exit(1);
}

const discoverySnapshot: DiscoverySnapshot = JSON.parse(fs.readFileSync(discoverySnapshotPath, 'utf8'));

const engines = [
  new DependencyEvaluationEngine(),
  new BoundaryEvaluationEngine(),
  new ComplexityEvaluationEngine()
];

const allObservations = [];
const allFindings = [];

for (const engine of engines) {
  console.log(`Running ${engine.id} v${engine.version}...`);
  const result = engine.evaluate(discoverySnapshot);
  allObservations.push(...result.observations);
  allFindings.push(...result.findings);
}

const snapshotGen = new EvaluationSnapshotGenerator();
snapshotGen.generate(allObservations, allFindings, basePath);

console.log('Architecture Evaluation Complete.');
