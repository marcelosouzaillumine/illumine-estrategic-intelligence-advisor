import { SupabaseFinancialEntriesAdapter } from '../../adapters/persistence/SupabaseFinancialEntriesAdapter';
import { SupabaseCashFlowAdapter } from '../../adapters/persistence/SupabaseCashFlowAdapter';
import { SupabaseAccountPlansAdapter } from '../../adapters/persistence/SupabaseAccountPlansAdapter';
import { FirestoreFinancialEntriesAdapter } from '../../adapters/persistence/FirestoreFinancialEntriesAdapter';
import { FinancialRepository } from '../../repositories/FinancialRepository';
import { CashFlowRepository } from '../../repositories/CashFlowRepository';
import { AccountPlansRepository } from '../../repositories/AccountPlansRepository';
import { getSupabaseClient } from '../supabase/SupabaseClient';
import { getSupabaseConfig } from '../supabase/SupabaseConfig';

// Instanciação preguiçosa: usa Supabase quando VITE_USE_SUPABASE_STAGING=true,
// caso contrário cai para Firestore (a fonte de dados principal em produção).
export const persistenceContainer = {
  get financial() {
    if (getSupabaseConfig().useStaging) {
      return new FinancialRepository(new SupabaseFinancialEntriesAdapter(getSupabaseClient()));
    }
    return new FinancialRepository(new FirestoreFinancialEntriesAdapter());
  },
  get cashFlow() {
    return new CashFlowRepository(new SupabaseCashFlowAdapter(getSupabaseClient()));
  },
  get accountPlans() {
    return new AccountPlansRepository(new SupabaseAccountPlansAdapter(getSupabaseClient()));
  },
};
