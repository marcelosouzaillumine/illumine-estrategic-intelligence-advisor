export interface CertificationLevelContract {
  readonly advisorId: string;
  readonly currentBadgeLevel: 'ASSOCIATE' | 'PROFESSIONAL' | 'SENIOR' | 'PRINCIPAL' | 'EXECUTIVE_FELLOW';
  readonly examScorePercent: number;
  readonly completedCasesCount: number;
  readonly nextRecertificationDueDate: string;
  readonly isCertified: boolean;
}
