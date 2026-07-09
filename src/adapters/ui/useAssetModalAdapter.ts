import { useState } from 'react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export function useAssetModalAdapter(clientId: string, asset?: any, onClose?: () => void) {
  const [loading, setLoading] = useState(false);

  const saveAsset = async (formData: any) => {
    setLoading(true);
    try {
      const parseValue = (val: any) => {
        if (typeof val === 'number') return val;
        if (!val || typeof val !== 'string') return 0;
        let cleaned = val.replace(/\s/g, '');
        if (cleaned.includes(',') && cleaned.includes('.')) {
          cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else if (cleaned.includes(',')) {
          cleaned = cleaned.replace(',', '.');
        }
        return parseFloat(cleaned) || 0;
      };

      const dataToSave: any = {
        name: formData.name,
        category: formData.category,
        value: parseValue(formData.value),
        profit: parseValue(formData.profit),
        change: parseValue(formData.change),
        status: formData.status,
        applicationDate: formData.applicationDate,
        initialValue: parseValue(formData.initialValue),
        yieldType: formData.yieldType,
        composesCashFlow: formData.composesCashFlow,
        updatedAt: serverTimestamp()
      };

      if (asset?.id) {
        await updateDoc(doc(db, 'assets', asset.id), dataToSave);
      } else {
        const newData = {
          ...dataToSave,
          clientId,
          ownerId: auth.currentUser?.uid,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'assets'), newData);
      }
      
      if (onClose) onClose();
      return { success: true };
    } catch (error: any) {
      console.error('Error saving asset:', error);
      return { success: false, error: 'Erro ao salvar o ativo: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveAsset,
    loading
  };
}
