import { Identifier } from '@illumine/core-primitives';

export type AdvisoryCaseStatus =
  | 'OPEN'
  | 'ANALYZING'
  | 'RECOMMENDATION_READY'
  | 'EXECUTIVE_REVIEW'
  | 'APPROVED'
  | 'IMPLEMENTING'
  | 'MEASURED'
  | 'LEARNED';

export class AdvisoryCase {
  private currentStatus: AdvisoryCaseStatus = 'OPEN';

  constructor(
    readonly caseId: Identifier,
    readonly title: string,
    readonly clientEnterpriseId: string
  ) {}

  public getStatus(): AdvisoryCaseStatus {
    return this.currentStatus;
  }

  public transitionTo(newStatus: AdvisoryCaseStatus): void {
    const validTransitions: Record<AdvisoryCaseStatus, AdvisoryCaseStatus[]> = {
      OPEN: ['ANALYZING'],
      ANALYZING: ['RECOMMENDATION_READY'],
      RECOMMENDATION_READY: ['EXECUTIVE_REVIEW'],
      EXECUTIVE_REVIEW: ['APPROVED'],
      APPROVED: ['IMPLEMENTING'],
      IMPLEMENTING: ['MEASURED'],
      MEASURED: ['LEARNED'],
      LEARNED: ['OPEN']
    };

    const allowed = validTransitions[this.currentStatus];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Transição inválida em AdvisoryCase: de ${this.currentStatus} para ${newStatus}`);
    }

    this.currentStatus = newStatus;
  }
}
