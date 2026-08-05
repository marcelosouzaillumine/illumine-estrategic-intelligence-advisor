export type KnowledgeType = 
  | 'CONCEPT'
  | 'RULE'
  | 'PATTERN'
  | 'BENCHMARK'
  | 'PRINCIPLE'
  | 'RECOMMENDATION';

export type KnowledgeMaturity = 
  | 'EXPERIMENTAL'
  | 'VERIFIED'
  | 'CERTIFIED';

export interface KnowledgeMetadata {
  version: string;
  author: string;
  source: string;
  createdAt: string;
}

export interface ExecutiveKnowledge {
  id: string; // e.g., 'financial.liquidity.rule.1'
  type: KnowledgeType;
  domain: string; // e.g., 'FINANCIAL'
  ontologyReferences: string[]; // Links to Ontology Concepts, e.g., ['financial.liquidity.current_ratio']
  title: string;
  description: string;
  content: any; // The actual declarative rule, pattern criteria, or benchmark threshold
  confidence: number; // e.g., 0.95
  maturity: KnowledgeMaturity;
  metadata: KnowledgeMetadata;
}
