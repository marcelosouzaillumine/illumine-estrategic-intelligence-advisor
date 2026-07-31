import { ArchitectureArtifact, ArchitectureRelationship, ArchitectureArtifactType, ArchitectureRelationshipType } from '../contracts/GraphModels';
import crypto from 'crypto';

export class KnowledgeGraphBuilder {
  private nodes: Map<string, ArchitectureArtifact> = new Map();
  private edges: ArchitectureRelationship[] = [];

  private generateId(type: string, name: string, location?: string): string {
    return crypto.createHash('md5').update(`${type}:${name}:${location || ''}`).digest('hex').substring(0, 12);
  }

  public addArtifact(
    type: ArchitectureArtifactType,
    name: string,
    path?: string,
    confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM',
    version?: string,
    owner?: string
  ): ArchitectureArtifact {
    const id = this.generateId(type, name, path);
    if (this.nodes.has(id)) {
      return this.nodes.get(id)!;
    }
    const node: ArchitectureArtifact = {
      id,
      type,
      name,
      path,
      confidence,
      discoveredAt: new Date().toISOString(),
      version,
      owner
    };
    this.nodes.set(id, node);
    return node;
  }

  public addRelationship(
    sourceId: string,
    targetId: string,
    type: ArchitectureRelationshipType,
    confidence: 'HIGH' | 'MEDIUM' | 'LOW',
    discoveryMethod: string
  ): ArchitectureRelationship {
    const exists = this.edges.find(e => e.sourceId === sourceId && e.targetId === targetId && e.type === type);
    if (exists) return exists;

    const rel: ArchitectureRelationship = {
      sourceId,
      targetId,
      type,
      confidence,
      discoveryMethod
    };
    this.edges.push(rel);
    return rel;
  }

  public getArtifacts(): ArchitectureArtifact[] {
    return Array.from(this.nodes.values());
  }

  public getRelationships(): ArchitectureRelationship[] {
    return this.edges;
  }
}
