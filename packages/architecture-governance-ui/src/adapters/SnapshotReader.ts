import { DiscoverySnapshot, ArchitectureArtifact, ArchitectureRelationship } from '@illumine/architecture-governance-discovery';
import { ArchitectureObservation, ArchitectureFinding } from '@illumine/architecture-governance-evaluation';

export interface ISnapshotReader {
  readDiscovery(): Promise<DiscoverySnapshot | null>;
  readEvaluationObservations(): Promise<ArchitectureObservation[]>;
  readEvaluationFindings(): Promise<ArchitectureFinding[]>;
}

// Em um cenário real de browser-side lendo arquivos da build, faríamos chamadas fetch() para a pasta pública
// ou um arquivo gerado no build. Para nosso ambiente atual em React, assumiremos um proxy ou fetch de estáticos.
export class SnapshotHttpAdapter implements ISnapshotReader {
  constructor(private basePath: string = '/artifacts') {}

  async readDiscovery(): Promise<DiscoverySnapshot | null> {
    try {
      const response = await fetch(`${this.basePath}/governance-discovery/DISCOVERY-SNAPSHOT-v1/graph.json`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.warn("Could not fetch discovery snapshot", e);
      return null;
    }
  }

  async readEvaluationObservations(): Promise<ArchitectureObservation[]> {
    try {
      const response = await fetch(`${this.basePath}/architecture-evaluation/EVALUATION-SNAPSHOT-v1/observations.json`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.warn("Could not fetch evaluation observations", e);
      return [];
    }
  }

  async readEvaluationFindings(): Promise<ArchitectureFinding[]> {
    try {
      const response = await fetch(`${this.basePath}/architecture-evaluation/EVALUATION-SNAPSHOT-v1/findings.json`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.warn("Could not fetch evaluation findings", e);
      return [];
    }
  }
}
