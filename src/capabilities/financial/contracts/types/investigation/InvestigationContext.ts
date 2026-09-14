import { InstitutionalObject } from '../../../../../types/intelligence/InstitutionalObject';

export interface InvestigationContext extends InstitutionalObject {
  userId: string;
  snapshotId?: string; // If investigating a historical snapshot
}
