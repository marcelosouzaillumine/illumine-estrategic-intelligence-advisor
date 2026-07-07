import { collection, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';

export class BalanceSheetApplicationService {
  public static async deleteFinancialData(clientId: string, year: number): Promise<void> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('type', 'in', ['Balanço Patrimonial', 'BP']),
      where('year', '==', year)
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'financial_entries', d.id)));
    await Promise.all(deletePromises);
  }
}
