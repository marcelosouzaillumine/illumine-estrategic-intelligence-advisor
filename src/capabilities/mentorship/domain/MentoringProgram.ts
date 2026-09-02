import { z } from 'zod';

export type ProgramStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
export type ProgramPhase = 'ENROLLMENT' | 'MATCHING' | 'IN_PROGRESS' | 'CLOSING';
export type SessionFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface MentoringProgramConfig {
  durationWeeks: number;
  sessionFrequency: SessionFrequency;
  sessionsTotal: number;
  maxMenteesPerMentor: number;
  allowSelfMatching: boolean;
  requirePreBrief: boolean;
  requirePostSynthesis: boolean;
  okrTrackingEnabled: boolean;
  pulseCheckInEnabled: boolean;
}

export interface MentoringProgram {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  status: ProgramStatus;
  phase: ProgramPhase;
  config: MentoringProgramConfig;
  programAdminIds: string[];
  enrollmentOpenAt: string;
  enrollmentCloseAt: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export const MentoringProgramConfigSchema = z.object({
  durationWeeks: z.number().min(4).max(52),
  sessionFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY']),
  sessionsTotal: z.number().min(1).max(52),
  maxMenteesPerMentor: z.number().min(1).max(10),
  allowSelfMatching: z.boolean(),
  requirePreBrief: z.boolean(),
  requirePostSynthesis: z.boolean(),
  okrTrackingEnabled: z.boolean(),
  pulseCheckInEnabled: z.boolean(),
});
