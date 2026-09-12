import { ISnapshotReader } from '../adapters/SnapshotReader';
import { ArchitectureArtifact, ArchitectureRelationship } from '@illumine/architecture-governance-discovery';
import { ArchitectureObservation, ArchitectureFinding } from '@illumine/architecture-governance-evaluation';

export interface EnrichedArtifact extends ArchitectureArtifact {
  observations: ArchitectureObservation[];
  findings: ArchitectureFinding[];
  inboundRelationships: ArchitectureRelationship[];
  outboundRelationships: ArchitectureRelationship[];
}

export class ArchitectureExplorerModel {
  private artifacts: ArchitectureArtifact[] = [];
  private relationships: ArchitectureRelationship[] = [];
  private observations: ArchitectureObservation[] = [];
  private findings: ArchitectureFinding[] = [];

  constructor(private reader: ISnapshotReader) {}

  async load() {
    const discovery = await this.reader.readDiscovery();
    if (discovery) {
      this.artifacts = discovery.artifacts;
      this.relationships = discovery.relationships;
    }
    
    this.observations = await this.reader.readEvaluationObservations();
    this.findings = await this.reader.readEvaluationFindings();
  }

  getCapabilities(): EnrichedArtifact[] {
    return this.artifacts
      .filter(a => a.type === 'CAPABILITY')
      .map(a => this.enrichArtifact(a));
  }

  getArtifactDetails(id: string): EnrichedArtifact | null {
    const artifact = this.artifacts.find(a => a.id === id);
    if (!artifact) return null;
    return this.enrichArtifact(artifact);
  }

  private enrichArtifact(artifact: ArchitectureArtifact): EnrichedArtifact {
    return {
      ...artifact,
      observations: this.observations.filter(o => o.artifactId === artifact.id),
      // Finding acoplado pela observation:
      findings: this.findings.filter(f => 
        f.observationIds.some(obsId => this.observations.find(o => o.id === obsId && o.artifactId === artifact.id))
      ),
      inboundRelationships: this.relationships.filter(r => r.targetId === artifact.id),
      outboundRelationships: this.relationships.filter(r => r.sourceId === artifact.id)
    };
  }

  getGlobalMetrics() {
    return {
      totalArtifacts: this.artifacts.length,
      totalRelationships: this.relationships.length,
      totalObservations: this.observations.length,
      totalCapabilities: this.artifacts.filter(a => a.type === 'CAPABILITY').length
    };
  }
}
