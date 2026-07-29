import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { BankTransaction } from '../../services/importService';

type ImportStrategy = 'add_new' | 'replace_all';

export function useImportBankStatementAdapter(selectedClient: string) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [accountPlan, setAccountPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qAcc = query(collection(db, 'financial_positions'), where('clientId', '==', selectedClient));
        const snapAcc = await getDocs(qAcc);
        const dataAcc = snapAcc.docs.map(d => ({ id: d.id, ...d.data() }));
        setAccounts(dataAcc);
        if (dataAcc.length === 1) setSelectedAccountId(dataAcc[0].id);

        const qPlan = query(
          collection(db, 'account_plans'), 
          where('clientId', '==', selectedClient),
          where('planType', '==', 'accounting')
        );
        const snapPlan = await getDocs(qPlan);
        const planData = snapPlan.docs.map(d => ({ id: d.id, ...d.data() as any }));
        setAccountPlan(planData.sort((a, b) => (a.code || '').localeCompare(b.code || '')));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectedClient]);

  const handleConfirmImport = async (strategy: ImportStrategy, parsedData: BankTransaction[]) => {
    if (!selectedAccountId) { setError('Selecione uma conta bancária.'); return null; }
    const account = accounts.find(a => a.id === selectedAccountId);
    if (!account) return null;

    setLoading(true);
    try {
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
          clientId: selectedClient,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid || 'Usuário Atual'
        });
      });
      await batch.commit();

      return { updated: true, count: parsedData.length, finalBalance: newBalance };
    } catch (err: any) {
      setError('Erro ao atualizar saldo: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    accountPlan,
    loading,
    error,
    setError,
    setLoading,
    handleConfirmImport
  };
}
