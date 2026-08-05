import { Contract } from '../models/Contract';
import { ContractStatus } from '../value-objects/ContractValueObjects';

export class ContractLifecycleService {
  /**
   * Valida e executa a transição de estado do contrato.
   * Aplica regras rígidas da máquina de estados do domínio.
   */
  public transitionState(contract: Contract, targetStatus: ContractStatus): Contract {
    if (!this.canTransition(contract.status, targetStatus)) {
      throw new Error(`Invalid contract state transition from ${contract.status} to ${targetStatus}`);
    }

    const updatedContract = { ...contract, status: targetStatus };

    // Apply lifecycle timestamps based on the target status
    const now = new Date().toISOString();
    
    if (targetStatus === ContractStatus.SIGNED) {
      updatedContract.lifecycle = { ...updatedContract.lifecycle, signedAt: now };
    }
    
    if (targetStatus === ContractStatus.ACTIVE) {
      updatedContract.lifecycle = { ...updatedContract.lifecycle, activatedAt: now };
    }

    if (targetStatus === ContractStatus.TERMINATED) {
      updatedContract.lifecycle = { ...updatedContract.lifecycle, terminatedAt: now };
    }

    return updatedContract;
  }

  private canTransition(current: ContractStatus, target: ContractStatus): boolean {
    const transitions: Record<ContractStatus, ContractStatus[]> = {
      [ContractStatus.DRAFT]: [ContractStatus.PENDING_SIGNATURE, ContractStatus.TERMINATED],
      [ContractStatus.PENDING_SIGNATURE]: [ContractStatus.SIGNED, ContractStatus.TERMINATED],
      [ContractStatus.SIGNED]: [ContractStatus.ACTIVE, ContractStatus.TERMINATED],
      [ContractStatus.ACTIVE]: [ContractStatus.SUSPENDED, ContractStatus.TERMINATED],
      [ContractStatus.SUSPENDED]: [ContractStatus.ACTIVE, ContractStatus.TERMINATED],
      [ContractStatus.TERMINATED]: [], // Terminal state
    };

    return transitions[current]?.includes(target) ?? false;
  }
}
