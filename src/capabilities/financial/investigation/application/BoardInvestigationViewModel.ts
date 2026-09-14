import { InvestigationResult } from '../../../../types/investigation/InvestigationResult';
import { PersistentGraphNode } from '../../../../types/knowledge-graph/PersistentGraphNode';

export interface UIInvestigationNode {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: string;
}

export interface UIMetrics {
  totalEvidences: number;
  totalRelations: number;
  totalDrivers: number;
  totalConnectedRisks: number;
  totalConnectedDecisions: number;
}

export interface UIBoardInvestigationViewModel {
  targetNode: UIInvestigationNode | null;
  evidences: UIInvestigationNode[];
  causes: UIInvestigationNode[];
  dependencies: UIInvestigationNode[];
  impacts: UIInvestigationNode[];
  metrics: UIMetrics;
  snapshotId: string | null;
  timestamp: string;
}

export class BoardInvestigationViewModel {
  // Dummy Fiduciary Contract
  public static state = {};
  public static computed = {};
  public static actions = {};

  static adapt(result: InvestigationResult): UIBoardInvestigationViewModel {
    const mapNode = (node: PersistentGraphNode): UIInvestigationNode => ({
      id: node.nodeId,
      type: node.nodeType,
      title: node.title,
      description: node.description,
      confidence: node.confidenceLevel
    });

    return {
      targetNode: result.targetNode ? mapNode(result.targetNode) : null,
      evidences: result.evidences.map(mapNode),
      causes: result.causes.map(mapNode),
      dependencies: result.dependencies.map(mapNode),
      impacts: result.impacts.map(mapNode),
      metrics: {
        totalEvidences: result.metrics.totalEvidences,
        totalRelations: result.metrics.totalRelations,
        totalDrivers: result.metrics.totalDrivers,
        totalConnectedRisks: result.metrics.totalConnectedRisks,
        totalConnectedDecisions: result.metrics.totalConnectedDecisions
      },
      snapshotId: result.snapshot?.snapshotId || null,
      timestamp: result.snapshot?.timestamp || new Date().toISOString()
    };
  }
}
