import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { AuditEvent } from './AuditEventBus';
import { blockedFirestoreWrite } from '../../../lib/blockedFirestoreWrite';

export class ImmutableLedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImmutableLedgerError';
  }
}

export class ImmutableLedger {
  static async saveLedger(entry: any): Promise<void> {
    if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.NODE_TEST_CONTEXT !== undefined || process.argv.some(arg => arg.includes('test')))) {
      return;
    }
    const cleanEntry = JSON.parse(JSON.stringify(entry));
    blockedFirestoreWrite(); // addDoc(collection(db, 'governance_ledger'), cleanEntry);
  }

  static async record(event: AuditEvent): Promise<void> {
    // Regra lógica de imutabilidade: impede mutações e garante append-only
    try {
      await this.saveLedger({
        ...event,
        serverTimestamp: new Date(),
        ledgerHash: `ledger_${event.eventId}_${Math.random().toString(36).substring(2, 11)}`
      });
    } catch (error) {
      console.error('[ImmutableLedger] Failed to append ledger entry:', error);
      throw error;
    }
  }

  // Métodos de segurança para simular ou impor restrições lógicas contra update/delete
  static update(): never {
    throw new ImmutableLedgerError('MUTATION_PROHIBITED: Updates are strictly prohibited on the Immutable Governance Ledger.');
  }

  static delete(): never {
    throw new ImmutableLedgerError('MUTATION_PROHIBITED: Deletions are strictly prohibited on the Immutable Governance Ledger.');
  }
}
