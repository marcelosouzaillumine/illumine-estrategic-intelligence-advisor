export enum ExplorerPerspective {
  TOPOLOGY_VIEW = 'TOPOLOGY_VIEW',
  CAPABILITY_VIEW = 'CAPABILITY_VIEW',
  DEPENDENCY_VIEW = 'DEPENDENCY_VIEW',
  EVOLUTION_VIEW = 'EVOLUTION_VIEW',
  EVIDENCE_VIEW = 'EVIDENCE_VIEW',
  CERTIFICATION_VIEW = 'CERTIFICATION_VIEW',
  AUDIT_VIEW = 'AUDIT_VIEW',
  INTELLIGENCE_VIEW = 'GOVERNANCE_VIEW'
}

export interface SnapshotReference {
  snapshotId: string;
  type: 'DISCOVERY' | 'EVALUATION' | 'CERTIFICATION';
  version: string;
}

export interface ArchitectureExplorerView {
  id: string;
  title: string;
  perspective: ExplorerPerspective;
  dataSource: SnapshotReference;
}
