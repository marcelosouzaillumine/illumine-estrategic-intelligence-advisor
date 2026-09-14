import { z } from 'zod';

export type ExpertiseDomain =
  | 'LEADERSHIP'
  | 'STRATEGY'
  | 'FINANCE'
  | 'TECHNOLOGY'
  | 'MARKETING'
  | 'OPERATIONS'
  | 'PEOPLE'
  | 'INNOVATION'
  | 'GOVERNANCE'
  | 'ENTREPRENEURSHIP'
  | 'SALES'
  | 'PRODUCT';

export type AvailabilityStatus = 'AVAILABLE' | 'AT_CAPACITY' | 'PAUSED' | 'INACTIVE';

export interface MentorExperience {
  role: string;
  company: string;
  years: number;
  highlights: string[];
}

export interface MentorAvailability {
  status: AvailabilityStatus;
  maxMentees: number;
  currentMentees: number;
  preferredSessionDay?: string;
  preferredSessionTime?: string;
  timezone: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  tenantId: string;
  programId: string;
  displayName: string;
  bio: string;
  photoUrl?: string;
  expertiseDomains: ExpertiseDomain[];
  industries: string[];
  experience: MentorExperience[];
  availability: MentorAvailability;
  mentoringStyle: string;
  expectedOutcomes: string[];
  linkedinUrl?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MentorProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  bio: z.string().min(50).max(2000),
  expertiseDomains: z.array(z.enum([
    'LEADERSHIP', 'STRATEGY', 'FINANCE', 'TECHNOLOGY', 'MARKETING',
    'OPERATIONS', 'PEOPLE', 'INNOVATION', 'GOVERNANCE', 'ENTREPRENEURSHIP',
    'SALES', 'PRODUCT',
  ])).min(1).max(5),
  industries: z.array(z.string()).min(1).max(5),
  mentoringStyle: z.string().min(20).max(500),
  expectedOutcomes: z.array(z.string()).min(1).max(5),
});
