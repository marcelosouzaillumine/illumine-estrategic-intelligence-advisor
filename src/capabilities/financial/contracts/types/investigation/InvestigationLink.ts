export type InvestigationOriginSurface = 
  | 'BOARD_PACK'
  | 'COGNITIVE_DRAWER'
  | 'ESGIM'
  | 'SCENARIO'
  | 'CONSTITUTIONAL'
  | 'GRAPH_VIEWER'
  | 'SYSTEM_UNKNOWN';

export interface InvestigationLink {
  nodeId: string;
  nodeType: string;
  title: string;
  correlationId: string;
  evidenceAvailable: boolean;
  explainabilityAvailable: boolean;
  investigationAvailable: boolean;
}
