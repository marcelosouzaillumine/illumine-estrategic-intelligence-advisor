import { RuntimeConfidence } from '../runtime/types';

export type EntityType = 
  | 'LEGAL_ENTITY' 
  | 'HOLDING' 
  | 'OPERATIONAL_ENTITY' 
  | 'REPORTING_UNIT' 
  | 'BUSINESS_UNIT' 
  | 'SCP' 
  | 'BRANCH' 
  | 'DEPARTMENT';

export type EdgeType = 
  | 'OWNERSHIP' 
  | 'DEPENDENCY' 
  | 'INTERCOMPANY' 
  | 'OPERATIONAL_LINKAGE' 
  | 'CASH_DEPENDENCY' 
  | 'SHARED_LIABILITY' 
  | 'CROSS_GUARANTEE';

export interface TopologyNode {
  id: string;
  name: string;
  type: EntityType;
  metadata?: Record<string, any>;
  confidence?: RuntimeConfidence; // Herdado dos dados processados localmente
}

export interface TopologyEdge {
  sourceId: string;
  targetId: string;
  type: EdgeType;
  metadata?: {
    percentage?: number; // Para Ownership
    description?: string;
  };
}

export interface IntercompanyOperation {
  operationId: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: 'MUTUO' | 'RECEITA_DESPESA' | 'DIVIDENDO';
  amount: number;
  sourceAccountCategory: string; // Ex: 'Receitas Intragrupo'
  targetAccountCategory: string; // Ex: 'Custos Intragrupo'
  reconciled: boolean;
}

export interface EntityGraphData {
  groupId: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  intercompanyOperations: IntercompanyOperation[];
}

export interface ConsolidatedDataResult {
  groupId: string;
  targetEntityId: string;
  confidence: RuntimeConfidence;
  eliminatedAmount: number;
  unreconciledOperations: IntercompanyOperation[];
  consolidatedFinancials: any; // Dados agregados pós-eliminação
  lineage: {
    originEntityId: string;
    computationPath: string[];
  }[];
}
