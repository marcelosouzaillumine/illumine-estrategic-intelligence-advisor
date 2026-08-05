import { FinancialDataQueryOptions, FinancialRepository } from '../../contracts/financial.repository';

export class FirestoreFinancialRepository implements FinancialRepository {
  async getFinancialData(options: FinancialDataQueryOptions): Promise<any> {
    // Firestore implementation placeholder
    console.log(`[FirestoreFinancialRepository] getFinancialData`, options);
    return null;
  }

  async saveFinancialData(data: any): Promise<void> {
    // Firestore implementation placeholder
    console.log(`[FirestoreFinancialRepository] saveFinancialData`);
  }
}
