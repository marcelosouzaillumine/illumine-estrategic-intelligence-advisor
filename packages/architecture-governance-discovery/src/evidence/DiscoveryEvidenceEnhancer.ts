import { KnowledgeGraphBuilder } from '../graph/KnowledgeGraphBuilder';
import { ArchitectureArtifactType } from '../contracts/GraphModels';

export interface DiscoveryEvidence {
  id: string;
  Artifact: string;
  Capability: string | null;
  Relationships: string[];
  Confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  Method: string;
  Snapshot: string;
}

export class DiscoveryEvidenceEnhancer {
  constructor(private graph: KnowledgeGraphBuilder, private snapshotId: string) {}

  public getEvidences(): DiscoveryEvidence[] {
    const artifacts = this.graph.getArtifacts();
    const relationships = this.graph.getRelationships();
    
    return artifacts.map((artifact, i) => {
      // Find what Capability it belongs to
      const belongsToRel = relationships.find(r => r.sourceId === artifact.id && r.type === 'BELONGS_TO');
      let capabilityName = null;
      if (belongsToRel) {
        const capability = artifacts.find(a => a.id === belongsToRel.targetId && (a.type === ArchitectureArtifactType.CAPABILITY || a.type === ArchitectureArtifactType.PACKAGE));
        if (capability) {
          capabilityName = capability.name;
        }
      }

      // Format simple string array of direct relationships for evidence
      const artifactRels = relationships
        .filter(r => r.sourceId === artifact.id || r.targetId === artifact.id)
        .map(r => {
           const otherId = r.sourceId === artifact.id ? r.targetId : r.sourceId;
           const otherName = artifacts.find(a => a.id === otherId)?.name || 'Unknown';
           if (r.sourceId === artifact.id) return `${r.type} -> ${otherName}`;
           return `${otherName} -> ${r.type}`;
        });

      return {
        id: `DISCOVERY-${(i+1).toString().padStart(3, '0')}`,
        Artifact: artifact.name,
        Capability: capabilityName,
        Relationships: artifactRels,
        Confidence: artifact.confidence || 'MEDIUM',
        Method: 'AST_ANALYSIS',
        Snapshot: this.snapshotId
      };
    });
  }
}
