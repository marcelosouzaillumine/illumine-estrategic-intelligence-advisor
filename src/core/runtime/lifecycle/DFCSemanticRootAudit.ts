export interface SemanticRootEvidence {
  hasSemanticContext: boolean;
  hasLifecycleProfile: boolean;
  hasCqsElsaEvidence: boolean;
  hasEqsElsaEvidence: boolean;
  hasNarrativeElsaEvidence: boolean;
}

export interface SemanticRootAudit {
  root: string;
  originalRoot?: string;
  canonicalRoot: string;
  resolvedRoot: string;
  canonicalized: boolean;
  lifecycleStage?: string;
  lifecycleLabel?: string;
  evidence: SemanticRootEvidence;
}
