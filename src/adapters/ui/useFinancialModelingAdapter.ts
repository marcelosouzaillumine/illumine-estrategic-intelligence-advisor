import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';

export function useFinancialModelingAdapter(selectedClient: string) {
  const [inputs, setInputs] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchModelingData = useCallback(async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      const qInputs = query(collection(db, 'modeling_inputs'), where('clientId', '==', selectedClient));
      const snapInputs = await getDocs(qInputs);
      setInputs(snapInputs.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));

      const qAccounts = query(collection(db, 'account_plans'), where('clientId', '==', selectedClient), orderBy('code', 'asc'));
      const snapAccounts = await getDocs(qAccounts);
      const allAccounts = snapAccounts.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      const managerial = allAccounts.filter(a => a.planType === 'managerial');
      setAccounts(managerial.length > 0 ? managerial : allAccounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  const handleSave = async (currentInputs: any[]) => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      for (const item of currentInputs) {
        const payload = {
          clientId: selectedClient,
          tipo: item.tipo,
          descricao: item.descricao,
          accountId: item.accountId,
          valorInicial: item.valorInicial,
          updatedAt: serverTimestamp()
        };
        if (item._isNew) {
          const docRef = await addDoc(collection(db, 'modeling_inputs'), payload);
          item.id = docRef.id;
          delete item._isNew;
        } else {
          await updateDoc(doc(db, 'modeling_inputs', item.id), payload);
        }
      }
      setInputs([...currentInputs]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'modeling_inputs');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'modeling_inputs', id));
  };

  return {
    inputs,
    setInputs,
    accounts,
    scenarios: inputs,
    loading,
    saving,
    fetchModelingData,
    handleSave,
    handleDelete
  };
}
