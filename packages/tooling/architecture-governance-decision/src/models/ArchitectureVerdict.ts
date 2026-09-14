export type VerdictStatus = 'PENDING' | 'REVIEW_REQUIRED' | 'ACCEPTED' | 'REJECTED' | 'DEFERRED';

export interface ArchitectureVerdict {
  readonly decisionId: string;
  readonly status: VerdictStatus;
  readonly updatedAt: string;
}
