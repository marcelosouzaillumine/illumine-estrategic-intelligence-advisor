import { KnowledgeGraphBuilder } from '../graph/KnowledgeGraphBuilder';
import { DiscoverySnapshot } from '../contracts/GraphModels';
import { DependencyGraphAnalyzer } from '../analyzers/DependencyGraphAnalyzer';
import { ArchitectureMetricsCollector } from '../metrics/ArchitectureMetricsCollector';
import { DiscoveryEvidenceEnhancer } from '../evidence/DiscoveryEvidenceEnhancer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export class SnapshotGenerator {
  constructor(private graph: KnowledgeGraphBuilder) {}

  public generateSnapshot(baseDir: string = process.cwd()): void {
    const timestamp = new Date().toISOString();
    // Static ID for versioned snapshot 1 as requested in G1.5
    const snapshotId = `DISCOVERY-SNAPSHOT-v1`;
    const outDir = path.join(baseDir, `artifacts/governance-discovery/${snapshotId}`);

    fs.mkdirSync(outDir, { recursive: true });

    const artifacts = this.graph.getArtifacts();
    const relationships = this.graph.getRelationships();
    
    let gitCommit = 'unknown';
    try {
      gitCommit = execSync('git rev-parse HEAD').toString().trim();
    } catch(e) {}

    const snapshot: DiscoverySnapshot = {
      snapshotId,
      timestamp,
      artifacts,
      relationships,
      metadata: {
        version: "1.5",
        gitCommit,
        generatedAt: timestamp,
        scannerVersion: "1.5.0",
        schemaVersion: "1.0"
      }
    };

    // graph.json
    fs.writeFileSync(path.join(outDir, 'graph.json'), JSON.stringify(snapshot, null, 2));
    
    // evidence.json 
    const evidenceEnhancer = new DiscoveryEvidenceEnhancer(this.graph, snapshotId);
    const evidences = evidenceEnhancer.getEvidences();
    fs.writeFileSync(path.join(outDir, 'evidence.json'), JSON.stringify(evidences, null, 2));

    // metrics.json
    const metricsCollector = new ArchitectureMetricsCollector(this.graph);
    const depAnalyzer = new DependencyGraphAnalyzer(this.graph);
    
    const topologyMetrics = depAnalyzer.getFanInFanOutMetrics();
    const rawMetrics = metricsCollector.getRawMetrics();
    const derivedMetrics = metricsCollector.getDerivedMetrics();

    fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify({
      rawMetrics,
      derivedMetrics,
      topologyMetrics
    }, null, 2));

    // fingerprint.yaml
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const fingerprint = `DiscoveryFingerprint:
  snapshotId: ${snapshotId}
  timestamp: ${timestamp}
  gitCommit: ${gitCommit}
  branch: ${branch}
  nodeVersion: ${process.version}
`;
    fs.writeFileSync(path.join(outDir, 'fingerprint.yaml'), fingerprint);

    console.log(`Discovery Snapshot created at: ${outDir}`);
  }
}
