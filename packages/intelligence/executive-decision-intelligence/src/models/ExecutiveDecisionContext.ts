export interface EvidenceReference {
  readonly sourceId: string;
  readonly sourceType: 'MEMORY' | 'KNOWLEDGE' | 'CERTIFICATION' | 'EVOLUTION' | 'EXTERNAL_DOCUMENT';
  readonly description: string;
}

export interface ExecutiveDecisionContext {
  readonly decisionId: string;
  readonly executive: {
    readonly name: string;
    readonly role: string;
    readonly authorityLevel: string;
  };
  readonly context: {
    readonly businessArea: string;
    readonly problemStatement: string;
    readonly strategicObjective: string;
  };
  readonly evidence: {
    readonly sources: readonly EvidenceReference[];
    readonly confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  readonly urgency: {
    readonly level: 'low' | 'medium' | 'high' | 'critical';
    readonly deadline?: string;
  };
  readonly stakeholders: readonly {
    readonly name: string;
    readonly role: string;
    readonly influence: string;
  }[];
  readonly constraints: {
    readonly financial?: readonly string[];
    readonly operational?: readonly string[];
    readonly regulatory?: readonly string[];
  };
}
