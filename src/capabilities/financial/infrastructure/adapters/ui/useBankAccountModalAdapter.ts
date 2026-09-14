import { useState } from 'react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../../../lib/firebase';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export function useBankAccountModalAdapter(clientId: string, account?: any, onClose?: () => void) {
  const [loading, setLoading] = useState(false);

  const saveAccount = async (formData: any) => {
    setLoading(true);
    try {
      const parseValue = (val: any) => {
        if (typeof val === 'number') return val;
        if (!val || typeof val !== 'string') return 0;
        return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0;
      };

      const initialValue = parseValue(formData.saldoInicial);
      const currentValue = formData.saldoAtual ? parseValue(formData.saldoAtual) : initialValue;

      const dateNow = new Date();
      const monthStr = dateNow.toLocaleString('pt-BR', { month: 'short' });
      // Normalize month: capitalize first letter, remove dot, take 3 chars
      const formattedMonth = (monthStr.charAt(0).toUpperCase() + monthStr.slice(1)).replace(/\./g, '').substring(0, 3);

      const dataToSave: any = {
        banco: formData.banco,
        agencia: formData.agencia,
        conta: formData.conta,
        tipoConta: formData.tipoConta,
        moeda: formData.moeda,
        saldoInicial: initialValue,
        saldoAtual: currentValue,
        dataAtualizacao: dateNow.toLocaleDateString('pt-BR'),
        updatedAt: serverTimestamp()
      };

      if (account?.id) {
        // Update history as well
        let updatedHistorico = [...(account.historico || [])];
        const monthIdx = updatedHistorico.findIndex(h => {
          const m = (h.mes || '').replace(/\./g, '').trim();
          const normalizedH = m.charAt(0).toUpperCase() + m.slice(1, 3).toLowerCase();
          return normalizedH === formattedMonth;
        });

        if (monthIdx >= 0) {
          updatedHistorico[monthIdx].saldo = currentValue;
        } else {
          updatedHistorico.push({ mes: formattedMonth, saldo: currentValue });
        }
        dataToSave.historico = updatedHistorico;

        blockedFirestoreWrite(); // updateDoc(doc(db, 'financial_positions', account.id), dataToSave);
      } else {
        const newData = {
          ...dataToSave,
          clientId,
          createdBy: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
          historico: [
            { mes: formattedMonth, saldo: currentValue }
          ],
        };
        blockedFirestoreWrite(); // addDoc(collection(db, 'financial_positions'), newData);
      }
      
      if (onClose) onClose();
      return { success: true };
    } catch (error: any) {
      console.error('Error saving bank account:', error);
      return { success: false, error: 'Erro ao salvar conta: ' + (error.message || 'Verifique as permissões.') };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveAccount,
    loading
  };
}
