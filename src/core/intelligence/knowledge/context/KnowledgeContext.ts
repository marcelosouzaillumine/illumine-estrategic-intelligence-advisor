import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

export interface KnowledgeContext {
  ontologyConcepts: string[]; // List of related ontology concepts
  references: ExecutiveKnowledge[]; // General knowledge retrieved
  patterns: ExecutiveKnowledge[];
  benchmarks: ExecutiveKnowledge[];
  rules: ExecutiveKnowledge[];
  confidence: number;
}
