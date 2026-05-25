import { WorkflowType } from './WorkflowGovernanceTypes';

export class WorkflowPolicyEngine {
  /**
   * Define os SLAs (Service Level Agreements) institucionais.
   */
  static getSlaHours(type: WorkflowType, severity: string): number {
    if (severity === 'CRITICAL') return 24; // 24h para resolver
    if (severity === 'HIGH') return 72; // 3 dias
    return 168; // 7 dias
  }

  static canBeCancelledBy(role: string): boolean {
    // Somente admin ou conselheiro pode cancelar workflow fiduciário
    return ['MASTER_ADMIN', 'BOARD_MEMBER'].includes(role);
  }
}
