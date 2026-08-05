export interface CapabilityKnowledge {
  id: string;
  version: string;
  author: string;
  owner: string;
  capability: string;
  maturity: 'EXPERIMENTAL' | 'STABLE' | 'DEPRECATED';
  confidence: number;
  language: string;
  createdAt: string;
  updatedAt: string;
  
  // Specific domain rules, patterns, narratives, etc. go here in derived interfaces
  rules: any[];
}
