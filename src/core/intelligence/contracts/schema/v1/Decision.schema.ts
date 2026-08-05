import { z } from 'zod';

export const DecisionOptionSchema = z.object({
  id: z.string(),
  action: z.string(),
  description: z.string(),
  impact: z.string(),
  tradeOffs: z.array(z.string())
});

export const RecommendationSchema = z.object({
  action: z.string(),
  reason: z.string(),
  priority: z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW']),
  timeframe: z.string(),
  expectedImpact: z.string(),
  risk: z.string(),
  owner: z.string().optional(),
  confidenceLevel: z.enum(['HIGH', 'MEDIUM', 'LOW']) // Governance rule: must have confidence
});

export const NextBestActionSchema = z.object({
  step: z.string(),
  description: z.string(),
  deadline: z.string().optional()
});

export const DecisionSchema = z.object({
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  decisionOptions: z.array(DecisionOptionSchema),
  recommendations: z.array(RecommendationSchema),
  nextBestActions: z.array(NextBestActionSchema)
});

export type ExecutiveDecision = z.infer<typeof DecisionSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
