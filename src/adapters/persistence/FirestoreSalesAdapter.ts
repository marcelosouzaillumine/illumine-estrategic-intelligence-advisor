import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SalesPipelineEntry } from '../ui/useSalesPipelineAdapter';

export class FirestoreSalesAdapter {
  static listenToPipelineByClient(clientId: string, onUpdate: (entries: SalesPipelineEntry[]) => void): () => void {
    const q = query(collection(db, 'sales_pipeline'), where('clientId', '==', clientId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as SalesPipelineEntry));
      onUpdate(data);
    });
  }

  static async addPipelineEntry(clientId: string, formData: any): Promise<void> {
    const valorNum = typeof formData.valor === 'string' 
      ? parseFloat(formData.valor.replace(/\\./g, '').replace(',', '.')) || 0 
      : formData.valor;
      
    await addDoc(collection(db, 'sales_pipeline'), {
      ...formData,
      valor: valorNum,
      clientId,
      data: serverTimestamp()
    });
  }

  static async deletePipelineEntry(id: string): Promise<void> {
    await deleteDoc(doc(db, 'sales_pipeline', id));
  }

  static async importPipelineEntries(clientId: string, parsedData: any[]): Promise<void> {
    const batch = writeBatch(db);
    parsedData.forEach(row => {
      const ref = doc(collection(db, 'sales_pipeline'));
      batch.set(ref, {
        clientId,
        vendedor: row['Vendedor'] || 'Não Informado',
        unidade: row['Unidade'] || 'Geral',
        filial: row['Filial'] || 'Matriz',
        etapa: row['Etapa'] || 'Prospecção',
        valor: parseFloat(String(row['Valor (R$)']).replace(/\\./g, '').replace(',', '.')) || 0,
        customerName: row['Cliente/Prospect'] || 'Novo Prospect',
        data: serverTimestamp()
      });
    });
    await batch.commit();
  }
}
