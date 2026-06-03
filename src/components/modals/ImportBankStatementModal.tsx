import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Loader2, CheckCircle2, UploadCloud, FileText, Trash2, 
  AlertTriangle, Landmark, Info, Plus, ShieldAlert 
} from 'lucide-react';
import { 
  collection, getDocs, query, where, updateDoc, doc, serverTimestamp, writeBatch 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { 
  parseBankStatementExcel, 
  parseBankStatementPdf, 
  parseBankStatementOfx, 
  parseBankStatementTxt,
  BankTransaction 
} from '../../services/importService';
import { cn, formatCurrency } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

type ImportStrategy = 'add_new' | 'replace_all';

const STRATEGY_CONFIG: Record<ImportStrategy, { label: string; desc: string; icon: React.ReactNode; danger?: boolean }> = {
  add_new: {
    label: 'Adicionar ao extrato existente',
    desc: 'Mantém o histórico atual e soma as novas transações.',
    icon: <Plus size={16} />,
  },
  replace_all: {
    label: 'Reiniciar extrato da conta',
    desc: 'Apaga o histórico anterior desta conta e define o saldo conforme o arquivo.',
    icon: <ShieldAlert size={16} />,
    danger: true,
  },
};

interface ImportBankStatementModalProps {
  selectedClient: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportBankStatementModal({ selectedClient, onClose, onSuccess }: ImportBankStatementModalProps) {
  const { translateLabel, t } = useLanguage();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [strategy, setStrategy] = useState<ImportStrategy>('add_new');
  const [accountPlan, setAccountPlan] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<{ updated: boolean; count: number; finalBalance: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, [selectedClient]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setError('');
    setProgress(20);
    
    try {
      let data: BankTransaction[] = [];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (ext === 'ofx') {
        data = await parseBankStatementOfx(selectedFile);
      } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        data = await parseBankStatementExcel(selectedFile);
      } else if (ext === 'pdf') {
        data = await parseBankStatementPdf(selectedFile);
      } else if (ext === 'txt') {
        data = await parseBankStatementTxt(selectedFile);
      } else {
        throw new Error('Formato não suportado. Use OFX, Excel, PDF ou TXT.');
      }
      
      if (data.length === 0) throw new Error('Nenhuma transação válida encontrada no arquivo.');
      
      setParsedData(data);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivo.');
      setFile(null);
      setParsedData([]);
    } finally {
      setTimeout(() => { setLoading(false); setProgress(0); }, 500);
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedAccountId) { setError('Selecione uma conta bancária.'); return; }
    const account = accounts.find(a => a.id === selectedAccountId);
    if (!account) return;

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
          createdBy: auth.currentUser?.uid
        });
      });
      await batch.commit();

      setImportResult({ updated: true, count: parsedData.length, finalBalance: newBalance });
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError('Erro ao atualizar saldo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900">Importar Extrato Bancário</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">OFX · Excel · PDF · TXT</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {importResult ? (
            <div className="py-10 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Saldo Atualizado!</h4>
                <p className="text-sm text-slate-500">O extrato foi processado e o saldo da conta atualizado.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full max-w-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Consolidado Atualizado</p>
                <p className="text-2xl font-black text-primary">{formatCurrency(importResult.finalBalance)}</p>
                <p className="text-[9px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">{importResult.count} transações processadas</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Selecione a Conta Destino</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {accounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all flex items-center gap-3",
                        selectedAccountId === acc.id ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-slate-100 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("p-2 rounded-xl", selectedAccountId === acc.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
                        <Landmark size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{acc.banco}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{formatCurrency(acc.saldoAtual)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!file ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-primary transition-all group relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".ofx,.xlsx,.xls,.csv,.pdf,.txt"
                    onChange={handleFileChange}
                  />
                  <UploadCloud size={36} className="text-slate-300 mx-auto mb-3 group-hover:text-primary" />
                  <p className="text-sm font-bold text-slate-600">Clique para selecionar o extrato</p>
                  <p className="text-xs text-slate-400 mt-1">Arraste arquivos OFX, Excel ou PDF bancário</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-primary shadow-sm"><FileText size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{file.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{parsedData.length} transações identificadas</p>
                      </div>
                    </div>
                    <button onClick={() => { setFile(null); setParsedData([]); }} className="p-1.5 hover:bg-slate-200 rounded text-slate-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-primary">
                       <Info size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Resumo do Movimento</span>
                     </div>
                     <span className={cn(
                       "text-sm font-black",
                       parsedData.reduce((a,b) => a + b.amount, 0) >= 0 ? "text-emerald-600" : "text-rose-600"
                     )}>
                       {formatCurrency(parsedData.reduce((a,b) => a + b.amount, 0))}
                     </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 font-black text-slate-400">DATA</th>
                          <th className="px-3 py-2 font-black text-slate-400">DESCRIÇÃO</th>
                          <th className="px-3 py-2 font-black text-slate-400">CATEGORIA (PLANO DE CONTAS)</th>
                          <th className="px-3 py-2 font-black text-slate-400 text-right">VALOR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {parsedData.map((t, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                            <td className="px-3 py-2 font-bold text-slate-700">{t.description}</td>
                            <td className="px-3 py-2">
                              <select 
                                value={t.category || ''}
                                onChange={(e) => {
                                  const newData = [...parsedData];
                                  newData[i].category = e.target.value;
                                  setParsedData(newData);
                                }}
                                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] outline-none focus:border-primary"
                              >
                                <option value="">Classificar...</option>
                                {accountPlan.map(acc => (
                                  <option key={acc.id} value={acc.name}>{acc.code} - {acc.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className={cn("px-3 py-2 text-right font-bold", t.amount >= 0 ? "text-emerald-600" : "text-rose-600")}>
                              {formatCurrency(t.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {file && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Estratégia de Importação</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.entries(STRATEGY_CONFIG) as [ImportStrategy, any][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setStrategy(key)}
                        className={cn(
                          "p-4 rounded-2xl border text-left transition-all flex items-start gap-3 relative overflow-hidden",
                          strategy === key 
                            ? (cfg.danger ? "border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/10" : "border-primary bg-primary/5 ring-2 ring-primary/10")
                            : "border-slate-100 bg-white hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl mt-0.5",
                          strategy === key 
                            ? (cfg.danger ? "bg-rose-500 text-white" : "bg-primary text-white")
                            : "bg-slate-100 text-slate-400"
                        )}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-xs font-black", strategy === key ? (cfg.danger ? "text-rose-700" : "text-primary") : "text-slate-800")}>{cfg.label}</p>
                          <p className="text-[9px] text-slate-400 font-bold leading-tight mt-1">{cfg.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-600 font-medium">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {!importResult && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all">{t("modals.cancel")}</button>
            <button 
              onClick={handleConfirmImport}
              disabled={loading || !file || !selectedAccountId}
              className="flex-1 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Confirmar Importação
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
