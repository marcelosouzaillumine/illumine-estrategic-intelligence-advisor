import { SupabaseFinancialEntriesAdapter } from '../../adapters/persistence/SupabaseFinancialEntriesAdapter';
import { SupabaseCashFlowAdapter } from '../../adapters/persistence/SupabaseCashFlowAdapter';
import { SupabaseAccountPlansAdapter } from '../../adapters/persistence/SupabaseAccountPlansAdapter';
import { FinancialRepository } from '../../repositories/FinancialRepository';
import { CashFlowRepository } from '../../repositories/CashFlowRepository';
import { AccountPlansRepository } from '../../repositories/AccountPlansRepository';
import { getSupabaseClient } from '../supabase/SupabaseClient';

export const persistenceContainer = {
  financial: new FinancialRepository(new SupabaseFinancialEntriesAdapter(getSupabaseClient())),
  cashFlow: new CashFlowRepository(new SupabaseCashFlowAdapter(getSupabaseClient())),
  accountPlans: new AccountPlansRepository(new SupabaseAccountPlansAdapter(getSupabaseClient())),
};
