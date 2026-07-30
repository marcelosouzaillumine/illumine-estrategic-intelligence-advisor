import { InstitutionalWisdomObject } from '@illumine/executive-contracts';

export class InstitutionalMemoryLedgerEngine {
  private static readonly ledger: InstitutionalWisdomObject[] = [];

  public static recordWisdom(wisdom: InstitutionalWisdomObject): void {
    this.ledger.push(wisdom);
  }

  public static getStoredWisdom(): readonly InstitutionalWisdomObject[] {
    return this.ledger;
  }
}
