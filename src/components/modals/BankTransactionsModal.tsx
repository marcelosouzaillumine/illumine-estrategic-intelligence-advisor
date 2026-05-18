import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, FileText, TrendingUp, TrendingDown, Landmark, Search, ShieldCheck } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatCurrency, formatDate, cn } from '../../lib/utils';

interface BankTransactionsModalProps {
  account: any;
  onClose: () => void;
}

type BankTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category?: string;
};

export function BankTransactionsModal({ account, onClose }: BankTransactionsModalProps) {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [accountPlan, setAccountPlan] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Account Plan for categorization
        const qPlan = query(
          collection(db, 'account_plans'),
          where('clientId', '==', account.clientId || ''),
          where('planType', '==', 'accounting')
        );
        const snapPlan = await getDocs(qPlan);
        setAccountPlan(snapPlan.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (a as any).code.localeCompare((b as any).code)));

        // Fetch Transactions
        const q = query(
          collection(db, 'bank_transactions'),
          where('accountId', '==', account.id)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BankTransaction));
        
        if (data.length > 0) {
          setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [account.id, account.clientId]);

  const handleUpdateCategory = async (transactionId: string, category: string) => {
    if (transactionId.startsWith('m')) return; // Ignore mock
    setUpdatingId(transactionId);
    try {
      await updateDoc(doc(db, 'bank_transactions', transactionId), { category });
      setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, category } : t));
    } catch (err) {
      console.error("Error updating category:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStart = !dateRange.start || t.date >= dateRange.start;
    const matchesEnd = !dateRange.end || t.date <= dateRange.end;
    return matchesSearch && matchesStart && matchesEnd;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
              <Landmark size={24} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Extrato: {account.banco}</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">
                {account.agencia} / {account.conta} · Saldo Atual: {formatCurrency(account.saldoAtual)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-hidden flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar descrição..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
                <input 
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                  className="bg-transparent text-[10px] font-bold outline-none text-slate-600 px-2"
                />
                <span className="text-slate-300 text-xs">|</span>
                <input 
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                  className="bg-transparent text-[10px] font-bold outline-none text-slate-600 px-2"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  Créditos: {formatCurrency(filtered.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0))}
                </span>
              </div>
              <div className="px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-2">
                <TrendingDown size={14} className="text-rose-500" />
                <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                  Débitos: {formatCurrency(Math.abs(filtered.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classificação (Plano)</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Carregando lançamentos...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">Nenhum lançamento encontrado.</td>
                  </tr>
                ) : (
                  filtered.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-xs font-bold text-slate-500">{formatDate(t.date)}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{t.description}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Ref: {t.id.slice(-8)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="relative">
                          {updatingId === t.id ? (
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                              <Loader2 size={12} className="animate-spin" /> Atualizando...
                            </div>
                          ) : (
                            <select 
                              value={t.category || ''}
                              onChange={(e) => handleUpdateCategory(t.id, e.target.value)}
                              className={cn(
                                "bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all w-full max-w-[200px]",
                                !t.category && "text-rose-500 border-rose-100 bg-rose-50/50"
                              )}
                            >
                              <option value="">NÃO CLASSIFICADO</option>
                              {accountPlan.map(acc => (
                                <option key={acc.id} value={acc.name}>{acc.code} - {acc.name}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className={cn(
                        "px-8 py-5 text-right text-sm font-black",
                        t.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 md:px-8 py-2 md:py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Fechar Visualização
          </button>
        </div>
      </motion.div>
    </div>
  );
}
