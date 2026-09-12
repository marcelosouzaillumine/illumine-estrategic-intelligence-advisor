import { AdvisoryAssignmentContract, AdvisorRoleType } from '@illumine/executive-contracts';

export class MultiAdvisorAssignmentEngine {
  public static assignAdvisor(companyId: string, advisorId: string, roleType: AdvisorRoleType): AdvisoryAssignmentContract {
    return {
      assignmentId: `asgn-${companyId}-${advisorId}`,
      companyId,
      advisorId,
      roleType,
      assignedAt: new Date().toISOString(),
      permissionScope: 'COMPANY'
    };
  }
}
