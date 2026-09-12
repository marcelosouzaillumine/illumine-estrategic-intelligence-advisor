import { CertificationLevelContract } from '@illumine/executive-contracts';

export class AdvisorCertificationEngine {
  public static evaluateCertification(advisorId: string, examScore: number, casesCount: number): CertificationLevelContract {
    const isFellow = examScore >= 95 && casesCount >= 20;
    const badge = isFellow ? 'EXECUTIVE_FELLOW' : 'SENIOR';
    const dueDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    return {
      advisorId,
      currentBadgeLevel: badge,
      examScorePercent: examScore,
      completedCasesCount: casesCount,
      nextRecertificationDueDate: dueDate,
      isCertified: true
    };
  }
}
