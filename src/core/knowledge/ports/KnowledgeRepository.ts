import { KnowledgeArtifact } from '../models/KnowledgeArtifact';
import { KnowledgeRelationship } from '../models/KnowledgeRelationship';

export interface KnowledgeRepository {
  saveArtifact(artifact: KnowledgeArtifact): Promise<void>;
  getArtifactById(id: string): Promise<KnowledgeArtifact | null>;
  saveRelationship(relationship: KnowledgeRelationship): Promise<void>;
  
  // Future graph traversal methods
  getRelationshipsForArtifact(artifactId: string): Promise<KnowledgeRelationship[]>;
}
