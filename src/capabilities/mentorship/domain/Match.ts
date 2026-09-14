export type MatchStatus = 'PROPOSED' | 'PENDING_MENTOR' | 'PENDING_MENTEE' | 'ACCEPTED' | 'DECLINED' | 'ACTIVE' | 'COMPLETED' | 'DISSOLVED';
export type MatchMethod = 'ALGORITHM' | 'ADMIN_ASSIGNED' | 'SELF_SELECTED';

export interface MatchScore {
  total: number;
  expertiseAlignment: number;
  industryAlignment: number;
  styleCompatibility: number;
  availabilityFit: number;
  goalRelevance: number;
}

export interface Match {
  id: string;
  programId: string;
  tenantId: string;
  mentorId: string;
  menteeId: string;
  status: MatchStatus;
  method: MatchMethod;
  score?: MatchScore;
  matchRationale?: string;
  mentorAcceptedAt?: string;
  menteeAcceptedAt?: string;
  dissolvedAt?: string;
  dissolveReason?: string;
  createdAt: string;
  updatedAt: string;
}
