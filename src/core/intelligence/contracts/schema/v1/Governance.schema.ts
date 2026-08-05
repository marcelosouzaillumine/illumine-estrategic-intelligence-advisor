import { z } from 'zod';

export const ConfidenceSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  factors: z.array(z.string())
});

export const DecisionProvenanceTraceSchema = z.object({
  source: z.string(),
  evidence: z.string(),
  knowledgeUsed: z.string(),
  ruleApplied: z.string(),
  inference: z.string(),
  finding: z.string(),
  decision: z.string(),
  outcome: z.string(),
  confidence: z.number(),
  timestamp: z.string(),
  engine: z.string(),
  knowledgeVersion: z.string(),
  ontologyVersion: z.string(),
  runtimeVersion: z.string()
});

export const GovernanceSchema = z.object({
  confidence: ConfidenceSchema,
  validation: z.any().optional(),
  evidence: z.any().optional(),
  decisionProvenance: z.array(DecisionProvenanceTraceSchema)
});

export type ExecutiveGovernance = z.infer<typeof GovernanceSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type DecisionProvenanceTrace = z.infer<typeof DecisionProvenanceTraceSchema>;
