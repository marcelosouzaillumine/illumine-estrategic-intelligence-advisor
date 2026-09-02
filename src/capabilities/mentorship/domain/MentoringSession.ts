import { z } from 'zod';

export type SessionStatus =
  | 'SCHEDULED'
  | 'PRE_BRIEF_PENDING'
  | 'PRE_BRIEF_DONE'
  | 'IN_PROGRESS'
  | 'NOTES_PENDING'
  | 'SYNTHESIS_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type SessionFormat = 'VIDEO' | 'IN_PERSON' | 'PHONE' | 'ASYNC';

export interface SessionPreBrief {
  generatedAt: string;
  menteeContext: string;
  suggestedTopics: string[];
  openOKRs: string[];
  lastSessionSummary?: string;
  preparationTips: string[];
}

export interface SessionNotes {
  submittedBy: 'MENTOR' | 'MENTEE' | 'BOTH';
  mentorNotes?: string;
  menteeNotes?: string;
  submittedAt: string;
}

export interface SessionSynthesis {
  generatedAt: string;
  executiveSummary: string;
  keyInsights: string[];
  actionItems: Array<{
    description: string;
    owner: 'MENTOR' | 'MENTEE';
    dueDate?: string;
  }>;
  okrProgress: string[];
  nextSessionSuggestions: string[];
  sentimentScore: number;
}

export interface MentoringSession {
  id: string;
  programId: string;
  tenantId: string;
  mentorId: string;
  menteeId: string;
  sessionNumber: number;
  status: SessionStatus;
  format: SessionFormat;
  scheduledAt: string;
  durationMinutes: number;
  agenda?: string;
  preBrief?: SessionPreBrief;
  notes?: SessionNotes;
  synthesis?: SessionSynthesis;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const ScheduleSessionSchema = z.object({
  mentorId: z.string().min(1),
  menteeId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().min(30).max(120),
  format: z.enum(['VIDEO', 'IN_PERSON', 'PHONE', 'ASYNC']),
  agenda: z.string().max(1000).optional(),
});

export const SessionNotesSchema = z.object({
  notes: z.string().min(20).max(5000),
});
