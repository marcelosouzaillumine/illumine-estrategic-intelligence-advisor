import { SupabaseFinancialEntriesAdapter } from '../../adapters/persistence/SupabaseFinancialEntriesAdapter';
import { SupabaseCashFlowAdapter } from '../../adapters/persistence/SupabaseCashFlowAdapter';
import { SupabaseAccountPlansAdapter } from '../../adapters/persistence/SupabaseAccountPlansAdapter';
import { FinancialRepository } from '../../repositories/FinancialRepository';
import { CashFlowRepository } from '../../repositories/CashFlowRepository';
import { AccountPlansRepository } from '../../repositories/AccountPlansRepository';
import { getSupabaseClient } from '../supabase/SupabaseClient';

// Instanciação preguiçosa: getSupabaseClient() lança exceção quando
// VITE_USE_SUPABASE_STAGING não está ativo (proposital — guarda contra uso
// acidental do Supabase). O app inteiro roda hoje sobre Firestore; nada
// deveria travar no carregamento do módulo só por este container existir
// no grafo de imports. O erro real (se algo de fato chamar um destes
// repositórios sem a flag ativa) continua acontecendo, só que na hora do
// uso, não na hora do import.
export const persistenceContainer = {
  get financial() {
    return new FinancialRepository(new SupabaseFinancialEntriesAdapter(getSupabaseClient()));
  },
  get cashFlow() {
    return new CashFlowRepository(new SupabaseCashFlowAdapter(getSupabaseClient()));
  },
  get accountPlans() {
    return new AccountPlansRepository(new SupabaseAccountPlansAdapter(getSupabaseClient()));
  },
};
