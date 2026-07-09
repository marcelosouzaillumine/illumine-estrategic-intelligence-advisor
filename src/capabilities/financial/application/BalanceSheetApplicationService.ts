import { FirestoreFinancialAdapter } from '../../../adapters/persistence/FirestoreFinancialAdapter';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';

export class BalanceSheetApplicationService {
  public static async deleteFinancialData(clientId: string, year: number): Promise<void> {
    await FirestoreFinancialAdapter.deleteEntriesByClientAndYear(clientId, year, undefined, ['Balanço Patrimonial', 'BP']);
  }
}
