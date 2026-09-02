import { z } from 'zod';

export type OKRStatus = 'ACTIVE' | 'AT_RISK' | 'ACHIEVED' | 'DROPPED';
export type KeyResultType = 'NUMERIC' | 'PERCENTAGE' | 'BINARY' | 'MILESTONE';

export interface KeyResult {
  id: string;
  description: string;
  type: KeyResultType;
  startValue: number;
  targetValue: number;
  currentValue: number;
  unit?: string;
  progress: number;
  status: OKRStatus;
  updates: Array<{
    value: number;
    note: string;
    updatedAt: string;
    updatedBy: string;
  }>;
}

export interface OKR {
  id: string;
  programId: string;
  menteeId: string;
  tenantId: string;
  objective: string;
  description?: string;
  quarter: string;
  status: OKRStatus;
  overallProgress: number;
  keyResults: KeyResult[];
  linkedSessionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const OKRSchema = z.object({
  objective: z.string().min(10).max(200),
  description: z.string().max(500).optional(),
  quarter: z.string().regex(/^\d{4}-Q[1-4]$/),
  keyResults: z.array(z.object({
    description: z.string().min(5).max(200),
    type: z.enum(['NUMERIC', 'PERCENTAGE', 'BINARY', 'MILESTONE']),
    startValue: z.number(),
    targetValue: z.number(),
    unit: z.string().max(20).optional(),
  })).min(1).max(5),
});

export const KeyResultUpdateSchema = z.object({
  currentValue: z.number(),
  note: z.string().min(1).max(500),
});
