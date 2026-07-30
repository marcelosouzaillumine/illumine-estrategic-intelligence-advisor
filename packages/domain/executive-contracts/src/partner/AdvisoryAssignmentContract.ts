import { AdvisorRoleType } from './AdvisorProfileContract';

export interface AdvisoryAssignmentContract {
  readonly assignmentId: string;
  readonly companyId: string;
  readonly advisorId: string;
  readonly roleType: AdvisorRoleType;
  readonly assignedAt: string;
  readonly permissionScope: 'HOLDING' | 'COMPANY' | 'UNIT';
}
