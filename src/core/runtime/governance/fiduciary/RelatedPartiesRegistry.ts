import { RelatedParty, RelatedPartyTransaction } from './types';

export class RelatedPartiesRegistry {
  private parties: Map<string, RelatedParty> = new Map();
  private transactions: Map<string, RelatedPartyTransaction> = new Map();

  /**
   * Registra uma Parte Relacionada (Isolamento de Tenant obrigatório).
   */
  public registerParty(party: RelatedParty): void {
    if (!party.tenantId) throw new Error('TenantId obrigatório.');
    this.parties.set(party.partyId, party);
  }

  /**
   * Obtém as partes relacionadas ativas para um Tenant.
   */
  public getPartiesForTenant(tenantId: string): RelatedParty[] {
    return Array.from(this.parties.values()).filter(p => p.tenantId === tenantId);
  }

  /**
   * Registra uma transação envolvendo uma parte relacionada.
   */
  public logTransaction(transaction: RelatedPartyTransaction): void {
    if (!transaction.tenantId) throw new Error('TenantId obrigatório para transações.');
    
    // Verifica se a parte existe no tenant
    const party = this.parties.get(transaction.partyId);
    if (!party || party.tenantId !== transaction.tenantId) {
      throw new Error('Parte relacionada não encontrada ou não pertence a este tenant.');
    }

    this.transactions.set(transaction.transactionId, transaction);
  }

  /**
   * Busca todas as transações de partes relacionadas em um tenant.
   */
  public getTransactionsForTenant(tenantId: string): RelatedPartyTransaction[] {
    return Array.from(this.transactions.values()).filter(t => t.tenantId === tenantId);
  }

  /**
   * Analisa se um conselheiro/aprovador está ligado a partes envolvidas
   * numa decisão em andamento (Cross-Check de Impedimentos Societários).
   */
  public checkApproverConflicts(tenantId: string, approverId: string, partyIdsInvolved: string[]): boolean {
    const tenantParties = this.getPartiesForTenant(tenantId);
    
    for (const partyId of partyIdsInvolved) {
      const party = tenantParties.find(p => p.partyId === partyId);
      if (party && party.linkedUserId === approverId) {
        return true; // Conflito direto identificado na malha de partes relacionadas
      }
    }
    return false;
  }
}

export const relatedPartiesRegistry = new RelatedPartiesRegistry();
