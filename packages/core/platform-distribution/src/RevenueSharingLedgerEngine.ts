import { RevenueSharingContract } from '@illumine/executive-contracts';

export class RevenueSharingLedgerEngine {
  public static calculateSplit(grossAmount: number): RevenueSharingContract {
    const platformRoyaltyAmount = Number((grossAmount * 0.15).toFixed(2));
    const partnerCommissionAmount = Number((grossAmount * 0.50).toFixed(2));
    const advisorShareAmount = Number((grossAmount * 0.25).toFixed(2));
    const holdingOverrideAmount = Number((grossAmount * 0.10).toFixed(2));

    return {
      transactionId: `tx-${Date.now()}`,
      grossAmount,
      platformRoyaltyAmount,
      partnerCommissionAmount,
      advisorShareAmount,
      holdingOverrideAmount,
      transactionTimestamp: new Date().toISOString(),
      ledgerHash: `hash-${Date.now()}-sha256`
    };
  }
}
