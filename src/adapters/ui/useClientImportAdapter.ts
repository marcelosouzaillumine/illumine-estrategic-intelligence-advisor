import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { blockedFirestoreWrite } from '../../lib/blockedFirestoreWrite';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { parseFinancialPdf } from '../../services/importService';
import * as XLSX from 'xlsx';

export function useClientImportAdapter(clientId: string, clientName: string) {
  const fetchHistory = async () => {
    if (!clientId) return [];
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const cleanNumber = (val: string | any) => {
    if (!val) return 0;
    const str = val.toString().trim();
    let cleaned = str.replace(/[R$\s]/g, '');
    
    if (cleaned.includes(',') && cleaned.includes('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (cleaned.includes(',')) {
      cleaned = cleaned.replace(',', '.');
    }
    
    return parseFloat(cleaned) || 0;
  };

  const uploadFileAndData = async (
    file: File, 
    docType: string, 
    periodType: 'mensal' | 'anual', 
    month: number, 
    year: number
  ) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let dataEntries: { category: string, value: number }[] = [];

    if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
      const reader = new FileReader();
      const promise = new Promise<void>((resolve, reject) => {
        reader.onload = (evt) => {
          try {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
            
            rawData.forEach(row => {
              const cat = row[0]?.toString();
              const valNum = cleanNumber(row[1]);
              if (cat && !isNaN(valNum)) {
                dataEntries.push({ category: cat, value: valNum });
              }
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsBinaryString(file!);
      });
      await promise;
    } else if (extension === 'pdf') {
      dataEntries = await parseFinancialPdf(file);
    } else {
      throw new Error('Formato de arquivo não suportado. Use XLSX, XLS, CSV ou PDF.');
    }

    if (dataEntries.length === 0) {
      throw new Error('Nenhum dado válido encontrado no arquivo.');
    }

    let fileUrl = '';
    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `imports/${clientId}/${Date.now()}_${safeFileName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(uploadResult.ref);
    } catch (storageErr: any) {
      console.warn("Failed to upload original file to storage, proceeding with data only.", storageErr);
      throw new Error(`Falha de conexão com a Nuvem: ${storageErr.message || 'Verifique as regras do Firebase Storage.'}`);
    }

    const payload = {
      clientId,
      clientName: clientName || 'N/A',
      type: docType,
      periodType,
      month: periodType === 'mensal' ? month : null,
      year,
      mes: periodType === 'mensal' ? month : null,
      ano: year,
      data: dataEntries,
      fileName: file.name,
      fileUrl,
      status: 'pending',
      requiresApproval: true,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser?.uid,
      creatorEmail: auth.currentUser?.email,
    };

    const docRef: any = blockedFirestoreWrite(); // addDoc(collection(db, 'financial_entries'), payload);

    await notificationService.createNotification({
      userId: 'admin_group',
      title: 'Nova Importação para Aprovação',
      message: `${auth.currentUser?.email} enviou "${file.name}" (${docType}) para ${clientName || 'Cliente'}.`,
      type: 'approval_request',
      link: 'maintenance',
      metadata: { docId: docRef.id, type: docType, clientId }
    });
  };

  const deleteEntry = async (id: string) => {
    try {
      blockedFirestoreWrite(); // deleteDoc(doc(db, 'financial_entries', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `financial_entries/${id}`);
      throw e;
    }
  };

  return {
    fetchHistory,
    uploadFileAndData,
    deleteEntry
  };
}
