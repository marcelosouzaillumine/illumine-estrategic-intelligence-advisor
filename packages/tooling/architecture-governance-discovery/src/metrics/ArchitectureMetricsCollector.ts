import { KnowledgeGraphBuilder } from '../graph/KnowledgeGraphBuilder';
import { ArchitectureArtifactType, ArchitectureRelationshipType } from '../contracts/GraphModels';

export class ArchitectureMetricsCollector {
  constructor(private graph: KnowledgeGraphBuilder) {}

  public getRawMetrics() {
    const artifacts = this.graph.getArtifacts();
    const relationships = this.graph.getRelationships();

    return {
      files: artifacts.length, // approximation
      contracts: artifacts.filter(a => a.type === ArchitectureArtifactType.CONTRACT).length,
      engines: artifacts.filter(a => a.type === ArchitectureArtifactType.ENGINE).length,
      tests: artifacts.filter(a => a.type === ArchitectureArtifactType.TEST).length,
      dependencies: relationships.filter(r => r.type === ArchitectureRelationshipType.DEPENDS_ON).length
    };
  }

  public getDerivedMetrics() {
    const raw = this.getRawMetrics();
    
    // dependencyDensity: rels / (nodes * (nodes - 1))
    const possibleRels = raw.files > 1 ? raw.files * (raw.files - 1) : 1;
    const dependencyDensity = raw.dependencies / possibleRels;
    
    // testCoverageRatio: tests / (engines + contracts)
    const criticalArtifacts = raw.engines + raw.contracts;
    const testCoverageRatio = criticalArtifacts > 0 ? raw.tests / criticalArtifacts : 0;
    
    // artifactConcentration: (engines + contracts) / total
    const artifactConcentration = raw.files > 0 ? criticalArtifacts / raw.files : 0;

    return {
      dependencyDensity: parseFloat(dependencyDensity.toFixed(4)),
      testCoverageRatio: parseFloat(testCoverageRatio.toFixed(4)),
      artifactConcentration: parseFloat(artifactConcentration.toFixed(4))
    };
  }
}
