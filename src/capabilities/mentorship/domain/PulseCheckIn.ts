import { z } from 'zod';

export type PulseCheckInType = 'WEEKLY' | 'PRE_SESSION' | 'POST_SESSION' | 'PROGRAM_MILESTONE';

export interface PulseMetrics {
  overallMomentum: number;
  confidenceLevel: number;
  challengeIntensity: number;
  mentorshipValue: number;
  goalProgress: number;
}

export interface PulseCheckIn {
  id: string;
  programId: string;
  menteeId: string;
  tenantId: string;
  sessionId?: string;
  type: PulseCheckInType;
  metrics: PulseMetrics;
  highlights: string;
  blockers?: string;
  supportNeeded?: string;
  aiInsight?: string;
  createdAt: string;
}

export const PulseCheckInSchema = z.object({
  type: z.enum(['WEEKLY', 'PRE_SESSION', 'POST_SESSION', 'PROGRAM_MILESTONE']),
  metrics: z.object({
    overallMomentum: z.number().min(1).max(10),
    confidenceLevel: z.number().min(1).max(10),
    challengeIntensity: z.number().min(1).max(10),
    mentorshipValue: z.number().min(1).max(10),
    goalProgress: z.number().min(1).max(10),
  }),
  highlights: z.string().min(10).max(1000),
  blockers: z.string().max(500).optional(),
  supportNeeded: z.string().max(500).optional(),
});
