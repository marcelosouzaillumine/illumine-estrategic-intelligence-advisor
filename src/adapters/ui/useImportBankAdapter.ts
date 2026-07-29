import { useState } from 'react';
import { collection, query, where, getDocs, doc, writeBatch, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';

export function useImportBankAdapter() {
  const [loading, setLoading] = useState(false);

  const importData = async (
    parsedData: any[],
    account: any,
    selectedAccountId: string,
    strategy: 'add_new' | 'replace_all'
  ) => {
    setLoading(true);
    try {
      if (!auth.currentUser) throw new Error("Usuário não autenticado");

      const totalMovement = parsedData.reduce((acc, t) => acc + t.amount, 0);
      let newBalance = (account.saldoAtual || 0) + totalMovement;
      if (strategy === 'replace_all') {
        newBalance = (account.saldoInicial || 0) + totalMovement;
      }

      const dateNow = new Date();
      const monthStr = dateNow.toLocaleString('pt-BR', { month: 'short' });
      const formattedMonth = (monthStr.charAt(0).toUpperCase() + monthStr.slice(1)).replace(/\./g, '').substring(0, 3);

      let updatedHistorico = [...(account.historico || [])];
      const monthIdx = updatedHistorico.findIndex(h => {
        const m = (h.mes || '').replace(/\./g, '').trim();
        const normalizedH = m.charAt(0).toUpperCase() + m.slice(1, 3).toLowerCase();
        return normalizedH === formattedMonth;
      });

      if (monthIdx >= 0) {
        updatedHistorico[monthIdx].saldo = newBalance;
      } else {
        updatedHistorico.push({ mes: formattedMonth, saldo: newBalance });
      }

      await updateDoc(doc(db, 'financial_positions', selectedAccountId), {
        saldoAtual: newBalance,
        historico: updatedHistorico,
        dataAtualizacao: dateNow.toLocaleDateString('pt-BR'),
        updatedAt: serverTimestamp()
      });

      const batch = writeBatch(db);

      if (strategy === 'replace_all') {
        const q = query(collection(db, 'bank_transactions'), where('accountId', '==', selectedAccountId));
        const oldDocs = await getDocs(q);
        oldDocs.forEach(d => batch.delete(d.ref));
      }

      parsedData.forEach(t => {
        const transRef = doc(collection(db, 'bank_transactions'));
        batch.set(transRef, {
          ...t,
          accountId: selectedAccountId,
          clientId: account.clientId,
          ownerId: auth.currentUser!.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      await notificationService.createNotification({
        userId: auth.currentUser.uid,
        title: 'Extrato Importado',
        message: `Foram importadas ${parsedData.length} transações para a conta ${account.banco}.`,
        type: 'success',
        link: 'financial'
      });

      return { success: true, count: parsedData.length };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

    const fetchAccounts = async (targetClient: string) => {
    try {
      const q = query(collection(db, 'financial_positions'), where('clientId', '==', targetClient));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
    } catch (e) {
      console.error(e);
      return [];
    }
  };

    const fetchAccountPlan = async (targetClient: string) => {
    try {
      const q = query(
        collection(db, 'account_plans'), 
        where('clientId', '==', targetClient),
        where('planType', '==', 'accounting')
      );
      const snap = await getDocs(q);
      const planData = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      return planData.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return { loading, importData, fetchAccounts, fetchAccountPlan };
}
