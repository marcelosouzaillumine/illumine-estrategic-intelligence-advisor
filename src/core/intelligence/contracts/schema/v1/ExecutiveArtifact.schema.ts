import { z } from 'zod';
import { ReasoningSchema } from './Reasoning.schema';
import { DecisionSchema } from './Decision.schema';
import { GovernanceSchema } from './Governance.schema';

export const MetaSchema = z.object({
  runtimeVersion: z.string(),
  knowledgeVersion: z.string(),
  ontologyVersion: z.string(),
  processingTimeMs: z.number(),
  pipelineId: z.string(),
  sessionId: z.string(),
  executionId: z.string()
});

export const KnowledgeProvenanceSchema = z.object({
  knowledgeId: z.string(),
  packId: z.string(),
  version: z.string(),
  source: z.string(),
  confidence: z.number(),
  usedFor: z.string()
});

export const KnowledgeContextSchema = z.object({
  ontologyVersion: z.string(),
  conceptsUsed: z.array(z.string()),
  knowledgePacksUsed: z.array(z.string()),
  knowledgeProvenance: z.array(KnowledgeProvenanceSchema)
});

export const FinancialInsightsSchema = z.object({
  observations: z.array(z.string()),
  patterns: z.array(z.string()),
  strengths: z.array(z.string()),
  attentionPoints: z.array(z.string()),
  opportunities: z.array(z.string())
});

export const ExecutiveArtifactSchema = z.object({
  meta: MetaSchema,
  knowledgeContext: KnowledgeContextSchema,
  financialInsights: FinancialInsightsSchema,
  reasoning: ReasoningSchema,
  decision: DecisionSchema,
  governance: GovernanceSchema
});

export type ExecutiveArtifact = z.infer<typeof ExecutiveArtifactSchema>;
export type ExecutiveIntelligenceMeta = z.infer<typeof MetaSchema>;
export type ExecutiveKnowledgeContext = z.infer<typeof KnowledgeContextSchema>;
export type FinancialInsights = z.infer<typeof FinancialInsightsSchema>;
