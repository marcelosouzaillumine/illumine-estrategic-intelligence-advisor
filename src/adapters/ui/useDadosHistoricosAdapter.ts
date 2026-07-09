import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, limit, updateDoc, writeBatch, onSnapshot } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage, login as firebaseLogin, auth, handleFirestoreError, OperationType } from '../../lib/firebase';

export function useDadosHistoricosAdapter(options: {
  user: any;
  role: string;
  selectedClient: string;
  isApprovalMode: boolean;
  clients: any[];
}) {
  const { user, role, selectedClient, isApprovalMode, clients } = options;
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | 'idle', message?: string }>({ type: 'idle' });
  const [progress, setProgress] = useState(0);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (role !== 'master' || !user) return;
    const collectionsToMonitor = ['financial_entries', 'payables', 'receivables', 'budgets', 'account_plans', 'document_uploads'];
    const unsubscribes = collectionsToMonitor.map(colName => {
      const q = query(collection(db, colName), where('status', '==', 'pending'));
      return onSnapshot(q, (snapshot) => {
        setPendingCounts(prev => ({ ...prev, [colName]: snapshot.size }));
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [role, user]);

  const fetchHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const collectionsToFetch = ['financial_staging', 'financial_entries', 'payables', 'receivables', 'budgets', 'account_plans', 'document_uploads'];
      let allItems: any[] = [];

      const promises = collectionsToFetch.map(async (colName) => {
        try {
          let q;
          if (isApprovalMode) {
            let conditions: any[] = [];
            
            if (colName === 'document_uploads') {
              if (role === 'master') {
                conditions.push(where('status', 'in', ['pending', 'approved']));
              } else {
                conditions.push(where('status', '==', 'pending'));
              }
            } else {
              conditions.push(where('status', '==', 'pending'));
            }

            if (selectedClient) {
              conditions.push(where('clientId', '==', selectedClient));
            }
            
            q = query(collection(db, colName), ...conditions, limit(100));
          } else {
            if (!selectedClient) return [];
            q = query(collection(db, colName), where('clientId', '==', selectedClient), limit(50));
          }
          const snap = await getDocs(q);
          return snap.docs.map(d => ({ 
            id: d.id, 
            sourceCollection: colName, 
            ...(d.data() as any) 
          }));
        } catch (err) {
          console.error(`Error fetching from ${colName}:`, err);
          return [];
        }
      });
      const results = await Promise.all(promises);
      const flatResults = results.flat();
      const processedItems: any[] = [];
      const batchMap = new Map<string, any>();

      flatResults.forEach(item => {
        if (isApprovalMode && item.batchId) {
          if (!batchMap.has(item.batchId)) {
            const batchEntry = { 
              ...item, 
              isBatch: true, 
              itemCount: 0,
              itemIds: [],
              sortDate: item.createdAt 
            };
            batchMap.set(item.batchId, batchEntry);
            processedItems.push(batchEntry);
          }
          const batchEntry = batchMap.get(item.batchId);
          batchEntry.itemCount++;
          batchEntry.itemIds.push(item.id);
        } else {
          processedItems.push({ ...item, sortDate: item.createdAt });
        }
      });

      allItems = processedItems.sort((a, b) => {
        const getVal = (obj: any) => {
          if (!obj?.sortDate) return 0;
          if (typeof obj.sortDate.toMillis === 'function') return obj.sortDate.toMillis();
          if (obj.sortDate.seconds) return obj.sortDate.seconds * 1000;
          return 0;
        };
        return getVal(b) - getVal(a);
      });

      setHistory(allItems);
    } catch (e) {
      console.error("Critical error fetching history:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const cleanNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const processUpload = async (file: File, docType: string, periodType: 'mensal' | 'anual', month: number, year: number) => {
    if (!user || !selectedClient) return;

    setLoading(true);
    setUploadStatus({ type: 'idle' });
    setProgress(0);

    try {
      let fileUrl = '';
      setProgress(15);
      const storagePath = `imports/${selectedClient}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const bytesPer = snapshot.totalBytes > 0 ? (snapshot.bytesTransferred / snapshot.totalBytes) : 0;
          const p = Math.round(bytesPer * 30);
          setProgress(15 + p);
        }
      );

      const snapshot = await uploadTask;
      setProgress(40);
      fileUrl = await getDownloadURL(snapshot.ref);
      setProgress(50);

      const fileName = file.name.toLowerCase();
      const clientData = (clients || []).find(c => c.id === selectedClient);

      if (fileName.endsWith('.pdf')) {
        const payload = {
          clientId: selectedClient,
          clientName: clientData?.fantasia || clientData?.razaoSocial || 'N/A',
          fileName: file.name,
          fileUrl,
          fileType: 'pdf',
          status: role === 'master' ? 'approved' : 'pending',
          requiresApproval: role === 'master' ? false : true,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          creatorEmail: user.email,
          sourceCollection: 'document_uploads',
          ...(role === 'master' ? { approvedAt: serverTimestamp() } : {})
        };
        await addDoc(collection(db, 'document_uploads'), payload);
        setProgress(90);
        setUploadStatus({ type: 'success', message: 'PDF enviado para curadoria estratégica!' });
      } else {
        const reader = new FileReader();
        const dataEntries: any[] = await new Promise((resolve, reject) => {
          reader.onload = (evt) => {
            try {
              const bstr = evt.target?.result;
              const wb = XLSX.read(bstr, { type: 'binary' });
              const ws = wb.Sheets[wb.SheetNames[0]];
              const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
              const entries: any[] = [];
              rawData.forEach(row => {
                const cat = row[0]?.toString();
                const val = cleanNumber(row[1]);
                if (cat && !isNaN(val)) entries.push({ category: cat, value: val });
              });
              resolve(entries);
            } catch (err) { reject(err); }
          };
          reader.readAsBinaryString(file);
        });

        if (dataEntries.length === 0) throw new Error('Nenhum dado válido encontrado.');

        const payload = {
          clientId: selectedClient,
          clientName: clientData?.fantasia || clientData?.razaoSocial || 'N/A',
          type: docType,
          periodType,
          month: periodType === 'mensal' ? month : null,
          year,
          data: dataEntries,
          fileName: file.name,
          fileUrl, 
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          creatorEmail: user.email,
          status: role === 'master' ? 'approved' : 'pending',
          requiresApproval: role === 'master' ? false : true,
          sourceCollection: 'financial_entries',
          ...(role === 'master' ? { approvedAt: serverTimestamp() } : {})
        };
        await addDoc(collection(db, 'financial_entries'), payload);
        setProgress(90);
        setUploadStatus({ type: 'success', message: 'Dados importados e aguardando aprovação.' });
      }

      await fetchHistory();
      setProgress(100);
      return true;
    } catch (err: any) {
      console.error("Process upload error:", err);
      setUploadStatus({ type: 'error', message: err.message || 'Erro ao processar arquivo.' });
      return false;
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleApprove = async (id: string, collectionName: string, isBatch: boolean = false, ids: string[] = []) => {
    try {
      if (isBatch && ids.length > 0) {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 450) {
          chunks.push(ids.slice(i, i + 450));
        }

        for (const chunk of chunks) {
          const batch = writeBatch(db);
          for (const itemId of chunk) {
            const item = history.find((h: any) => h.id === itemId) || (isBatch ? { sourceCollection: collectionName, id: itemId } : null);
            if (item && item.sourceCollection === 'financial_staging') {
              const targetDoc = doc(collection(db, item.targetCollection));
              batch.set(targetDoc, {
                 ...(item.payload || {}),
                 status: 'approved',
                 approvedAt: serverTimestamp(),
                 requiresApproval: false
              });
              batch.update(doc(db, 'financial_staging', itemId), { status: 'migrated' });
            } else if (item) {
              batch.update(doc(db, item.sourceCollection, itemId), {
                status: 'approved',
                approvedAt: serverTimestamp(),
                requiresApproval: false
              });
            }
          }
          await batch.commit();
        }
      } else {
        const item = history.find((h: any) => h.id === id);
        if (item && item.sourceCollection === 'financial_staging') {
           const batch = writeBatch(db);
           const targetDoc = doc(collection(db, item.targetCollection));
           batch.set(targetDoc, {
              ...item.payload,
              status: 'approved',
              approvedAt: serverTimestamp(),
              requiresApproval: false
           });
           batch.update(doc(db, 'financial_staging', id), { status: 'migrated' });
           await batch.commit();
        } else {
           await updateDoc(doc(db, collectionName, id), { 
             status: 'approved', 
             approvedAt: serverTimestamp(),
             requiresApproval: false
           });
        }
      }
      fetchHistory();
    } catch (e) {
      console.error("Error approving:", e);
    }
  };

  const handleReject = async (id: string, collectionName: string, isBatch: boolean = false, ids: string[] = []) => {
    try {
      if (isBatch && ids.length > 0) {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 450) {
          chunks.push(ids.slice(i, i + 450));
        }

        for (const chunk of chunks) {
          const batch = writeBatch(db);
          chunk.forEach(itemId => {
            batch.update(doc(db, collectionName, itemId), {
              status: 'rejected',
              rejectedAt: serverTimestamp(),
              requiresApproval: false
            });
          });
          await batch.commit();
        }
      } else {
        await updateDoc(doc(db, collectionName, id), { 
          status: 'rejected', 
          rejectedAt: serverTimestamp(),
          requiresApproval: false
        });
      }
      fetchHistory();
    } catch (e) {
      console.error("Error rejecting:", e);
    }
  };

  const handleDelete = async (id: string, colName: string) => {
    try {
      await deleteDoc(doc(db, colName, id));
      fetchHistory();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${colName}/${id}`);
    }
  };

  const handleBulkDeleteHistory = async (selectedHistoryItems: string[]) => {
    if (selectedHistoryItems.length === 0) return;
    setLoading(true);
    try {
      const chunks = [];
      for (let i = 0; i < selectedHistoryItems.length; i += 450) {
        chunks.push(selectedHistoryItems.slice(i, i + 450));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          const item = history.find(h => h.id === id);
          if (item) {
            batch.delete(doc(db, item.sourceCollection, id));
          }
        });
        await batch.commit();
      }

      fetchHistory();
      setUploadStatus({ type: 'success', message: 'Lançamentos excluídos com sucesso!' });
      return true;
    } catch (e) {
      console.error("Error bulk deleting:", e);
      setUploadStatus({ type: 'error', message: 'Erro ao excluir lançamentos selecionados.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleBulkApprove = async (selectedApprovals: string[]) => {
    if (selectedApprovals.length === 0) return;
    setLoading(true);
    try {
      const chunks = [];
      for (let i = 0; i < selectedApprovals.length; i += 450) {
        chunks.push(selectedApprovals.slice(i, i + 450));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          const item = history.find(h => h.id === id);
          if (item) {
            if (item.sourceCollection === 'document_uploads') {
              batch.update(doc(db, item.sourceCollection, id), {
                status: 'approved',
                approvedAt: serverTimestamp(),
                requiresApproval: false
              });
            } else if (item.sourceCollection === 'financial_staging') {
              const targetDoc = doc(collection(db, item.targetCollection));
              batch.set(targetDoc, {
                 ...item.payload,
                 status: 'approved',
                 approvedAt: serverTimestamp(),
                 requiresApproval: false
              });
              batch.update(doc(db, 'financial_staging', id), { status: 'migrated' });
            } else if (item.isBatch && item.itemIds) {
              item.itemIds.forEach((itemId: string) => {
                const subItem = history.find((h: any) => h.id === itemId);
                if (subItem && subItem.sourceCollection === 'financial_staging') {
                   const targetDoc = doc(collection(db, subItem.targetCollection));
                   batch.set(targetDoc, {
                      ...subItem.payload,
                      status: 'approved',
                      approvedAt: serverTimestamp(),
                      requiresApproval: false
                   });
                   batch.update(doc(db, 'financial_staging', itemId), { status: 'migrated' });
                } else {
                   batch.update(doc(db, item.sourceCollection, itemId), {
                     status: 'approved',
                     approvedAt: serverTimestamp(),
                     requiresApproval: false
                   });
                }
              });
            } else {
              batch.update(doc(db, item.sourceCollection, id), {
                status: 'approved',
                approvedAt: serverTimestamp(),
                requiresApproval: false
              });
            }
          }
        });
        await batch.commit();
      }

      fetchHistory();
      setUploadStatus({ type: 'success', message: 'Lançamentos aprovados com sucesso!' });
      return true;
    } catch (e) {
      console.error("Error bulk approving:", e);
      setUploadStatus({ type: 'error', message: 'Erro ao aprovar lançamentos selecionados.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleBulkRejectApprovals = async (selectedApprovals: string[]) => {
    if (selectedApprovals.length === 0) return;
    setLoading(true);
    try {
      const chunks = [];
      for (let i = 0; i < selectedApprovals.length; i += 450) {
        chunks.push(selectedApprovals.slice(i, i + 450));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          const item = history.find(h => h.id === id);
          if (item) {
            if (item.isBatch && item.itemIds) {
              item.itemIds.forEach((itemId: string) => {
                batch.update(doc(db, item.sourceCollection, itemId), {
                  status: 'rejected',
                  rejectedAt: serverTimestamp(),
                  requiresApproval: false
                });
              });
            } else {
              batch.update(doc(db, item.sourceCollection, id), {
                status: 'rejected',
                rejectedAt: serverTimestamp(),
                requiresApproval: false
              });
            }
          }
        });
        await batch.commit();
      }

      fetchHistory();
      setUploadStatus({ type: 'success', message: 'Lançamentos rejeitados com sucesso!' });
      return true;
    } catch (e) {
      console.error("Error bulk rejecting:", e);
      setUploadStatus({ type: 'error', message: 'Erro ao rejeitar lançamentos selecionados.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    firebaseLogin();
  };

  return {
    history,
    historyLoading,
    loading,
    uploadStatus,
    setUploadStatus,
    progress,
    pendingCounts,
    fetchHistory,
    processUpload,
    handleApprove,
    handleReject,
    handleDelete,
    handleBulkDeleteHistory,
    handleBulkApprove,
    handleBulkRejectApprovals,
    login
  };
}
