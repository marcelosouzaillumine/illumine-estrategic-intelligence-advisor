import { getSupabaseClient } from '../../../../../infrastructure/supabase/SupabaseClient';

export interface FinancialWriteEntry {
  accountId: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  nature?: string;
  category?: string;
}

export class FinancialWriteGateway {
  /**
   * Atomic commit of a journal entry with its legs (financial entries).
   */
  static async commitJournalEntry(
    companyId: string,
    periodId: string,
    type: string,
    referenceId: string | null,
    entries: FinancialWriteEntry[]
  ): Promise<string> {
    const supabase = getSupabaseClient();
    
    // Validate balance before even sending to DB
    const debits = entries.filter(e => e.type === 'DEBIT').reduce((acc, e) => acc + e.amount, 0);
    const credits = entries.filter(e => e.type === 'CREDIT').reduce((acc, e) => acc + e.amount, 0);

    // Using a small epsilon to avoid floating point issues
    if (Math.abs(debits - credits) > 0.001) {
      throw new Error(`Unbalanced journal entry: Debits = ${debits}, Credits = ${credits}`);
    }

    // Prepare JSONB for the RPC
    const p_entries = entries.map(e => ({
      account_id: e.accountId,
      amount: e.amount,
      type: e.type,
      nature: e.nature || 'OPERATIONAL',
      category: e.category || 'GENERAL'
    }));

    const { data, error } = await supabase.rpc('create_journal_entry', {
      p_company_id: companyId,
      p_period_id: periodId,
      p_type: type,
      p_reference_id: referenceId,
      p_entries: p_entries
    });

    if (error) {
      throw new Error(`Failed to commit journal entry: ${error.message}`);
    }

    return data; // returns the journal_entry_id
  }
}
