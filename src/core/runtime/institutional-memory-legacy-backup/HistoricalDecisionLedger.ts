import { HistoricalDecisionEntry } from './types';

export class HistoricalLedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HistoricalLedgerError';
  }
}

export class HistoricalDecisionLedger {
  private static ledger: HistoricalDecisionEntry[] = [];

  public static append(entry: HistoricalDecisionEntry): void {
    if (!entry || !entry.decisionId || !entry.lineageHash) {
      throw new Error('LEDGER_ERROR: Invalid entry metadata.');
    }
    // Deep freeze entry to ensure absolute immutability
    const frozen = Object.freeze(JSON.parse(JSON.stringify(entry)));
    this.ledger.push(frozen);
  }

  public static getAll(): readonly HistoricalDecisionEntry[] {
    return Object.freeze([...this.ledger]);
  }

  public static update(): void {
    throw new HistoricalLedgerError('MUTATION_PROHIBITED: Decision ledger is append-only and cannot be modified.');
  }

  public static delete(): void {
    throw new HistoricalLedgerError('MUTATION_PROHIBITED: Decision ledger is append-only and cannot be modified.');
  }

  public static clear(): void {
    this.ledger = [];
  }
}
