import { EvaluationEngineContract } from '../contracts/EvaluationEngineContract';
import { ArchitectureObservation } from '../models/ArchitectureObservation';
import { ArchitectureFinding } from '../models/ArchitectureFinding';
import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';

export class BoundaryEvaluationEngine implements EvaluationEngineContract {
  public id = 'BoundaryEvaluationEngine';
  public version = '1.0.0';

  public evaluate(snapshot: DiscoverySnapshot): { observations: ArchitectureObservation[]; findings: ArchitectureFinding[] } {
    const observations: ArchitectureObservation[] = [];
    const findings: ArchitectureFinding[] = [];

    const artifacts = snapshot.artifacts;
    const relationships = snapshot.relationships;
    
    const sourceSnapshot = {
      id: snapshot.snapshotId,
      generatedAt: snapshot.timestamp,
      gitCommit: snapshot.metadata.gitCommit
    };

    const boundaries = artifacts.filter(a => a.type === 'CAPABILITY' || a.type === 'PACKAGE');

    boundaries.forEach((boundary, i) => {
      // Find internal artifacts via BELONGS_TO
      const internalArtifactIds = relationships
        .filter(r => r.targetId === boundary.id && r.type === 'BELONGS_TO')
        .map(r => r.sourceId);

      observations.push({
        id: `OBS-BND-INT-${i}`,
        artifactId: boundary.id,
        category: 'BOUNDARY',
        metric: 'internal_artifacts',
        value: internalArtifactIds.length,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Find external connections originating from internals but targeting externals
      const externalConnections = relationships.filter(r => {
        const isSourceInternal = internalArtifactIds.includes(r.sourceId);
        const isTargetExternal = !internalArtifactIds.includes(r.targetId) && r.targetId !== boundary.id;
        // Also ensure target is not another BELONGS_TO (meaning we don't count the boundary link itself)
        return isSourceInternal && isTargetExternal && r.type !== 'BELONGS_TO';
      });

      observations.push({
        id: `OBS-BND-EXT-${i}`,
        artifactId: boundary.id,
        category: 'BOUNDARY',
        metric: 'external_connections',
        value: externalConnections.length,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Find cross-capability links (target is inside another boundary explicitly)
      let crossCapabilityLinks = 0;
      externalConnections.forEach(extConn => {
        const targetBelongsTo = relationships.find(r => r.sourceId === extConn.targetId && r.type === 'BELONGS_TO');
        if (targetBelongsTo && targetBelongsTo.targetId !== boundary.id) {
          crossCapabilityLinks++;
        }
      });

      observations.push({
        id: `OBS-BND-CRS-${i}`,
        artifactId: boundary.id,
        category: 'BOUNDARY',
        metric: 'cross_capability_links',
        value: crossCapabilityLinks,
        sourceSnapshot,
        generatedBy: this.id
      });

      // Findings Logic
      if (crossCapabilityLinks > 5) {
        findings.push({
          id: `FND-BND-CRS-${i}`,
          type: 'HIGH_CROSS_BOUNDARY_COUPLING',
          observationIds: [`OBS-BND-CRS-${i}`],
          threshold: 5,
          actualValue: crossCapabilityLinks
        });
      }
    });

    return { observations, findings };
  }
}
