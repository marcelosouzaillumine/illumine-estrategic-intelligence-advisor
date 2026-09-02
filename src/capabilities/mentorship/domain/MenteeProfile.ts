import { z } from 'zod';

export type CareerStage =
  | 'EARLY_CAREER'
  | 'MID_CAREER'
  | 'SENIOR'
  | 'EXECUTIVE'
  | 'TRANSITION'
  | 'ENTREPRENEUR';

export type MenteePriorityArea =
  | 'CAREER_GROWTH'
  | 'LEADERSHIP_SKILLS'
  | 'TECHNICAL_SKILLS'
  | 'STRATEGIC_THINKING'
  | 'NETWORK_EXPANSION'
  | 'ENTREPRENEURSHIP'
  | 'EXECUTIVE_PRESENCE'
  | 'WORK_LIFE_BALANCE';

export interface MenteeDevelopmentContext {
  currentRole: string;
  company?: string;
  industry: string;
  careerStage: CareerStage;
  yearsExperience: number;
  priorityAreas: MenteePriorityArea[];
  developmentGoals: string[];
  biggestChallenge: string;
}

export interface MenteeProfile {
  id: string;
  userId: string;
  tenantId: string;
  programId: string;
  displayName: string;
  bio: string;
  photoUrl?: string;
  developmentContext: MenteeDevelopmentContext;
  mentorPreferences: {
    preferredExpertise: string[];
    preferredStyle?: string;
    notes?: string;
  };
  matchedMentorId?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MenteeProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  bio: z.string().min(20).max(1000),
  developmentContext: z.object({
    currentRole: z.string().min(2).max(100),
    company: z.string().optional(),
    industry: z.string().min(2).max(100),
    careerStage: z.enum(['EARLY_CAREER', 'MID_CAREER', 'SENIOR', 'EXECUTIVE', 'TRANSITION', 'ENTREPRENEUR']),
    yearsExperience: z.number().min(0).max(50),
    priorityAreas: z.array(z.enum([
      'CAREER_GROWTH', 'LEADERSHIP_SKILLS', 'TECHNICAL_SKILLS', 'STRATEGIC_THINKING',
      'NETWORK_EXPANSION', 'ENTREPRENEURSHIP', 'EXECUTIVE_PRESENCE', 'WORK_LIFE_BALANCE',
    ])).min(1).max(3),
    developmentGoals: z.array(z.string()).min(1).max(5),
    biggestChallenge: z.string().min(20).max(500),
  }),
});
