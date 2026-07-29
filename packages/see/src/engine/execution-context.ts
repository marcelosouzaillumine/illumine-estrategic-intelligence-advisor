export interface SEEActor {
  userId: string;
  roles: string[];
}

export interface SEEContextInput {
  intent: string;
  actor: SEEActor;
  context: Record<string, any>;
}

export interface SEEResultOutput {
  decision: 'ALLOW' | 'DENY' | 'REQUIRES_APPROVAL';
  confidenceScore: number;
  explanations: string[];
  affectedAssets: string[];
  recommendations: string[];
  timestamp: string;
}
