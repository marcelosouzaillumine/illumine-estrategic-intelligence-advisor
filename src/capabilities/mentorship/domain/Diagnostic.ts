import { z } from 'zod';

export type DiagnosticStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED';

export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'READING' | 'KINESTHETIC';

export type CompetencyArea =
  | 'LEADERSHIP'
  | 'STRATEGIC_THINKING'
  | 'COMMUNICATION'
  | 'EXECUTION'
  | 'EMOTIONAL_INTELLIGENCE'
  | 'INNOVATION'
  | 'TEAM_MANAGEMENT'
  | 'FINANCIAL_ACUMEN'
  | 'INFLUENCE'
  | 'SELF_MANAGEMENT';

export const COMPETENCY_LABEL: Record<CompetencyArea, string> = {
  LEADERSHIP: 'Liderança',
  STRATEGIC_THINKING: 'Pensamento Estratégico',
  COMMUNICATION: 'Comunicação',
  EXECUTION: 'Execução',
  EMOTIONAL_INTELLIGENCE: 'Inteligência Emocional',
  INNOVATION: 'Inovação',
  TEAM_MANAGEMENT: 'Gestão de Pessoas',
  FINANCIAL_ACUMEN: 'Visão Financeira',
  INFLUENCE: 'Influência e Persuasão',
  SELF_MANAGEMENT: 'Autogestão',
};

export const ALL_COMPETENCIES: CompetencyArea[] = [
  'LEADERSHIP', 'STRATEGIC_THINKING', 'COMMUNICATION', 'EXECUTION',
  'EMOTIONAL_INTELLIGENCE', 'INNOVATION', 'TEAM_MANAGEMENT',
  'FINANCIAL_ACUMEN', 'INFLUENCE', 'SELF_MANAGEMENT',
];

export interface CompetencyRating {
  area: CompetencyArea;
  currentLevel: number;
  targetLevel: number;
}

export interface DiagnosticAnswers {
  currentRole: string;
  company?: string;
  yearsInRole: number;
  biggestChallenge: string;
  recentWin: string;
  competencies: CompetencyRating[];
  mentoringExpectations: string;
  specificGoals: string[];
  learningStyle: LearningStyle;
  availableHoursPerWeek: number;
  preferredMeetingCadence: string;
}

export interface MentorAnnotation {
  observations: string;
  suggestedFocusAreas: CompetencyArea[];
  initialPlanNotes: string;
  annotatedAt: string;
  annotatedBy: string;
}

export interface Diagnostic {
  id: string;
  menteeId: string;
  programId: string;
  tenantId: string;
  status: DiagnosticStatus;
  answers?: DiagnosticAnswers;
  mentorAnnotation?: MentorAnnotation;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const DiagnosticAnswersSchema = z.object({
  currentRole: z.string().min(2).max(100),
  company: z.string().max(100).optional(),
  yearsInRole: z.number().min(0).max(50),
  biggestChallenge: z.string().min(20).max(1000),
  recentWin: z.string().min(20).max(1000),
  mentoringExpectations: z.string().min(30).max(2000),
  specificGoals: z.array(z.string().min(5)).min(1).max(5),
  learningStyle: z.enum(['VISUAL', 'AUDITORY', 'READING', 'KINESTHETIC']),
  availableHoursPerWeek: z.number().min(1).max(20),
  preferredMeetingCadence: z.string().min(2),
});
