import { ExecutiveTrustLedgerContract } from '@illumine/executive-contracts';

export interface ExecutionResult {
  readonly executionId: string;
  readonly ledgerEntryId: string;
  readonly isSuccess: boolean;
  readonly executionAdapterUsed: string;
  readonly completedAt: string;
}

export class ExecutionEngine {
  public static executeAction(ledgerEntry: ExecutiveTrustLedgerContract): ExecutionResult {
    if (ledgerEntry.approvalStatus === 'REJECTED') {
      throw new Error('Impossível executar ação rejeitada no fluxo de aprovação fiduciária.');
    }

    return {
      executionId: `exec-${ledgerEntry.ledgerEntryId}`,
      ledgerEntryId: ledgerEntry.ledgerEntryId,
      isSuccess: true,
      executionAdapterUsed: 'GovernedExecutionAdapter',
      completedAt: new Date().toISOString()
    };
  }
}
