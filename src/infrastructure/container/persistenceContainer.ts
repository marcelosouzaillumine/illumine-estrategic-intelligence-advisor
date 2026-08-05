import { FirestoreFinancialEntriesAdapter } from '../../adapters/persistence/FirestoreFinancialEntriesAdapter';
import { FirestoreCashFlowAdapter } from '../../adapters/persistence/FirestoreCashFlowAdapter';
import { FirestoreAccountPlansAdapter } from '../../adapters/persistence/FirestoreAccountPlansAdapter';
import { FinancialRepository } from '../../repositories/FinancialRepository';
import { CashFlowRepository } from '../../repositories/CashFlowRepository';
import { AccountPlansRepository } from '../../repositories/AccountPlansRepository';

export const persistenceContainer = {
  financial: new FinancialRepository(new FirestoreFinancialEntriesAdapter()),
  cashFlow: new CashFlowRepository(new FirestoreCashFlowAdapter()),
  accountPlans: new AccountPlansRepository(new FirestoreAccountPlansAdapter()),
};
