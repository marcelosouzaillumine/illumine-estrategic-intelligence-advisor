import { z } from 'zod';

export const FactSchema = z.object({
  metric: z.string(),
  value: z.union([z.string(), z.number()]),
  period: z.string().optional(),
  source: z.string()
});

export const ObservationSchema = z.object({
  focus: z.string(),
  description: z.string(),
  significance: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional()
});

export const PatternSchema = z.object({
  type: z.string(),
  description: z.string(),
  frequency: z.string().optional()
});

export const HypothesisSchema = z.object({
  id: z.string(),
  description: z.string(),
  probability: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  evidenceRequired: z.array(z.string())
});

export const InsightSchema = z.object({
  situation: z.string(),
  impact: z.string(),
  implication: z.string()
});

export const FindingSchema = z.object({
  type: z.enum(['STRENGTH', 'RISK', 'OPPORTUNITY', 'ATTENTION_POINT']),
  title: z.string(),
  finding: z.string(),
  relatedFacts: z.array(z.string()).optional() // Link to specific facts to avoid hallucination
});

export const ReasoningSchema = z.object({
  facts: z.array(FactSchema),
  observations: z.array(ObservationSchema),
  patterns: z.array(PatternSchema),
  hypotheses: z.array(HypothesisSchema),
  insights: z.array(InsightSchema),
  findings: z.array(FindingSchema)
});

export type ExecutiveReasoning = z.infer<typeof ReasoningSchema>;
export type Fact = z.infer<typeof FactSchema>;
export type Finding = z.infer<typeof FindingSchema>;
