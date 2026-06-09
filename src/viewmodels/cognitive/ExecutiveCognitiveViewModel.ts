import { CognitiveQueryResult } from '../../types/knowledge-graph/CognitiveQuery';
import { InstitutionalNode } from '../../types/knowledge-graph/InstitutionalNode';
import { InstitutionalRelationship } from '../../types/knowledge-graph/InstitutionalRelationship';

export interface CognitiveEvidenceItem {
  id: string;
  title: string;
  type: string;
  source: string;
  confidence: string;
}

export interface CognitiveDriverItem {
  id: string;
  title: string;
  type: string;
  impactScore?: string;
  relationType: string;
}

export interface CognitiveCausalStep {
  stepId: string;
  sourceNodeId: string;
  sourceNodeLabel: string;
  targetNodeId: string;
  targetNodeLabel: string;
  relationshipType: string;
}

export interface CognitiveDecisionImpact {
  decisionId: string;
  decisionLabel: string;
  impactType: string;
}

export class ExecutiveCognitiveViewModel {
  public title: string = 'Cognitive Insights';
  public summary: string = 'No insights available.';
  public confidenceLevel: string = 'UNKNOWN';
  public evidenceCount: number = 0;
  public primaryDrivers: CognitiveDriverItem[] = [];
  public connectedRisks: CognitiveDriverItem[] = [];
  public connectedDecisions: CognitiveDecisionImpact[] = [];
  public causalPath: CognitiveCausalStep[] = [];
  public recommendations: string[] = [];
  public traceIds: string[] = [];

  public evidences: CognitiveEvidenceItem[] = [];

  constructor(
    private readonly evidenceResult: CognitiveQueryResult | null,
    private readonly impactResult: CognitiveQueryResult | null,
    private readonly decisionResult: CognitiveQueryResult | null,
    private readonly rootCauseResult: CognitiveQueryResult | null,
    targetNode?: InstitutionalNode
  ) {
    if (targetNode) {
      this.title = `Cognitive Insight: ${targetNode.title}`;
      this.summary = `Explicabilidade determinística e rastreabilidade para: ${targetNode.title}`;
    }

    this.processEvidence(evidenceResult);
    this.processImpacts(impactResult);
    this.processDecisions(decisionResult);
    this.processRootCauses(rootCauseResult);

    this.confidenceLevel = this.calculateConfidence();
  }

  private processEvidence(result: CognitiveQueryResult | null) {
    if (!result) return;
    this.traceIds.push(result.queryId);
    
    // Nodes that are of type EVIDENCE or INDICATOR
    const evidenceNodes = result.nodes.filter(n => n.nodeType === 'EVIDENCE' || n.nodeType === 'INDICATOR');
    this.evidenceCount = evidenceNodes.length;
    
    this.evidences = evidenceNodes.map(n => ({
      id: n.nodeId,
      title: n.title,
      type: n.nodeType,
      source: 'Internal Registry',
      confidence: n.confidenceLevel
    }));
  }

  private processImpacts(result: CognitiveQueryResult | null) {
    if (!result) return;
    this.traceIds.push(result.queryId);

    const riskNodes = result.nodes.filter(n => n.nodeType === 'RISK' || n.nodeType === 'EVENT');
    
    // Find relationships targeting these risks
    this.connectedRisks = riskNodes.map(n => {
      const rel = result.relationships.find(r => r.targetNodeId === n.nodeId);
      return {
        id: n.nodeId,
        title: n.title,
        type: n.nodeType,
        impactScore: n.confidenceLevel,
        relationType: rel?.relationshipType || 'UNKNOWN'
      };
    });
  }

  private processDecisions(result: CognitiveQueryResult | null) {
    if (!result) return;
    this.traceIds.push(result.queryId);

    const decisionNodes = result.nodes.filter(n => n.nodeType === 'DECISION' || n.nodeType === 'RECOMMENDATION');
    
    this.connectedDecisions = decisionNodes.map(n => {
      const rel = result.relationships.find(r => r.targetNodeId === n.nodeId || r.sourceNodeId === n.nodeId);
      return {
        decisionId: n.nodeId,
        decisionLabel: n.title,
        impactType: rel?.relationshipType || 'AFFECTS'
      };
    });
  }

  private processRootCauses(result: CognitiveQueryResult | null) {
    if (!result) return;
    this.traceIds.push(result.queryId);

    const driverNodes = result.nodes.filter(n => n.nodeType === 'DRIVER' || n.nodeType === 'INDICATOR');
    
    this.primaryDrivers = driverNodes.map(n => {
      const rel = result.relationships.find(r => r.sourceNodeId === n.nodeId);
      return {
        id: n.nodeId,
        title: n.title,
        type: n.nodeType,
        impactScore: n.confidenceLevel,
        relationType: rel?.relationshipType || 'CAUSES'
      };
    });

    // Extract a linear causal path if possible from the relationships
    const orderedRels = [...result.relationships].reverse(); // A simple heuristic for reverse BFS tracing
    this.causalPath = orderedRels.slice(0, 5).map(r => {
      const source = result.nodes.find(n => n.nodeId === r.sourceNodeId);
      const target = result.nodes.find(n => n.nodeId === r.targetNodeId);
      return {
        stepId: r.relationshipId,
        sourceNodeId: r.sourceNodeId,
        sourceNodeLabel: source?.title || r.sourceNodeId,
        targetNodeId: r.targetNodeId,
        targetNodeLabel: target?.title || r.targetNodeId,
        relationshipType: r.relationshipType
      };
    });
  }

  private calculateConfidence(): string {
    if (this.evidences.length === 0 && this.primaryDrivers.length === 0) return 'UNKNOWN';
    if (this.evidences.length > 3) return 'DETERMINISTIC';
    if (this.evidences.length > 0) return 'HIGH';
    return 'MODERATE';
  }
}
