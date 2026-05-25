export type KnowledgeNodeType = 
  | 'TENANT' | 'WORKSPACE' | 'ECONOMIC_GROUP' | 'ENTITY'
  | 'WORKFLOW' | 'ALERT' | 'SNAPSHOT' | 'SCENARIO'
  | 'BENCHMARK' | 'GOVERNANCE_VIOLATION' | 'ADVISORY'
  | 'DECISION' | 'USER' | 'REPORT' | 'SYSTEMIC_RISK';

export type KnowledgeEdgeType = 
  | 'GENERATED' | 'CAUSED' | 'RELATED_TO' | 'DEPENDS_ON'
  | 'ESCALATED_TO' | 'APPROVED_BY' | 'BELONGS_TO'
  | 'TRIGGERED' | 'OBSERVED_IN' | 'LINKED_TO';

export interface SemanticLineageReference {
  originExecutionId: string;
  originWorkflowId?: string;
  originScenarioId?: string;
  originReportId?: string;
  lineageHash: string;
}

export interface KnowledgeNode {
  nodeId: string;
  tenantId: string;
  type: KnowledgeNodeType;
  label: string;
  attributes: Record<string, any>;
  createdAt: string;
}

export interface KnowledgeEdge {
  edgeId: string;
  tenantId: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: KnowledgeEdgeType;
  semanticLineage: SemanticLineageReference;
  weight?: number;
  createdAt: string;
}

export interface InstitutionalRelationship {
  source: KnowledgeNode;
  target: KnowledgeNode;
  edge: KnowledgeEdge;
}

export interface GovernanceRelationship {
  relationshipId: string;
  approverId: string;
  decisionId: string;
  workflowId: string;
  timestamp: string;
}

export interface RiskCorrelation {
  correlationId: string;
  tenantId: string;
  sourceAlertId: string;
  correlatedViolationId: string;
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

export interface WorkflowPattern {
  patternId: string;
  tenantId: string;
  workflowType: string;
  frequency: number;
  averageApprovalTimeMs: number;
  criticality: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export type InstitutionalOntologyCategory = 
  | 'GOVERNANCE' | 'RISK' | 'WORKFLOW' | 'ALERT' | 'REPORTING'
  | 'TENANCY' | 'MONITORING' | 'BENCHMARKING' | 'PRODUCT_GOVERNANCE' | 'AI_GOVERNANCE';

export interface InstitutionalOntology {
  ontologyId: string;
  category: InstitutionalOntologyCategory;
  label: string;
  description: string;
}

export interface GraphQuery {
  queryId: string;
  tenantId: string;
  requestorId: string;
  intent: string;
  nodeTypes?: KnowledgeNodeType[];
  edgeTypes?: KnowledgeEdgeType[];
  maxDepth?: number;
}

export interface GraphExecutionRecord {
  executionId: string;
  query: GraphQuery;
  resultNodeCount: number;
  resultEdgeCount: number;
  executionTimeMs: number;
  timestamp: string;
}

export interface GraphAuditRecord {
  auditId: string;
  tenantId: string;
  eventType: 
    | 'GRAPH_NODE_CREATED' 
    | 'GRAPH_EDGE_CREATED' 
    | 'GRAPH_QUERY_EXECUTED' 
    | 'GRAPH_QUERY_BLOCKED' 
    | 'CORRELATION_ANALYZED' 
    | 'ONTOLOGY_UPDATED';
  details: string;
  timestamp: string;
}

export interface GraphQueryResult {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}
