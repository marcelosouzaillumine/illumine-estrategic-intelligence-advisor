
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  Landmark,
  ChevronUp,
  ChevronDown,
  Loader2,
  Plus,
  Upload,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  query, 
  collection, 
  where, 
  doc, 
  deleteDoc,
  writeBatch,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DATA } from '../../data';
import { cn, formatCurrency, formatValue, getThemeColors } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BankAccountModal } from '../modals/BankAccountModal';
import { ImportBankStatementModal } from '../modals/ImportBankStatementModal';
import { BankTransactionsModal } from '../modals/BankTransactionsModal';


export function FinancialPositionPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [, setThemeTrigger] = useState(0);
  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedAccountForTransactions, setSelectedAccountForTransactions] = useState<any | null>(null);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClient) {
      setPositions([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'financial_positions'),
      where('clientId', '==', selectedClient)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPositions(dbDocs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching positions:", error);
      setPositions([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  const exchangeRates = useMemo(() => {
    const exchangeSecao = (DATA as any).premissas?.economicas?.find((s: any) => s.categoria.includes('Câmbio'));
    const usd = parseFloat(exchangeSecao?.indicadores?.find((i: any) => i.nome.includes('Dólar'))?.valor.replace('R$ ', '').replace(',', '.') || '4.90');
    const eur = parseFloat(exchangeSecao?.indicadores?.find((i: any) => i.nome.includes('Euro'))?.valor.replace('R$ ', '').replace(',', '.') || '5.77');
    return { USD: usd, EUR: eur, BRL: 1 };
  }, []);

  const kpis = useMemo(() => {
    const totalCurrent = positions.reduce((acc, p) => {
      const rate = exchangeRates[p.moeda as keyof typeof exchangeRates] || 1;
      return acc + (p.saldoAtual * rate);
    }, 0);
    
    const totalInitial = positions.reduce((acc, p) => {
      const rate = exchangeRates[p.moeda as keyof typeof exchangeRates] || 1;
      return acc + (p.saldoInicial * rate);
    }, 0);

    const variation = totalInitial !== 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;
    
    return { totalCurrent, totalInitial, variation };
  }, [positions, exchangeRates]);

  const aggHistory = useMemo(() => {
    if (positions.length === 0) return [];
    
    const monthOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const normalizeMonth = (m: string) => {
      if (!m) return '';
      // Remove dots and take first 3 chars, capitalized
      const clean = m.replace(/\./g, '').trim();
      return clean.charAt(0).toUpperCase() + clean.slice(1, 3).toLowerCase();
    };

    // Get all unique months from all positions history
    let allMonths = Array.from(new Set(positions.flatMap(p => p.historico?.map((h: any) => normalizeMonth(h.mes)) || []))) as string[];
    allMonths = allMonths.filter(m => m && monthOrder.includes(m));

    // If no history exists but we have positions, use current month as fallback
    if (allMonths.length === 0 && positions.length > 0) {
      const currentMonth = normalizeMonth(new Date().toLocaleString('pt-BR', { month: 'short' }));
      allMonths = [currentMonth];
    }

    const sortedMonths = allMonths.sort((a: string, b: string) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    return sortedMonths.map(m => {
      const total = positions.reduce((acc, p) => {
        const hist = p.historico?.find((h: any) => normalizeMonth(h.mes) === m);
        const rate = exchangeRates[p.moeda as keyof typeof exchangeRates] || 1;
        
        // If no history for this month, use the current balance if it's the current month, 
        // or 0 if it's a past month (not ideal but consistent with previous logic)
        const currentMonth = normalizeMonth(new Date().toLocaleString('pt-BR', { month: 'short' }));
        const balance = hist ? hist.saldo : (m === currentMonth ? p.saldoAtual : 0);
        
        return acc + (balance * rate);
      }, 0);
      return { mes: m, saldo: total };
    });
  }, [positions, exchangeRates]);

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta bancária? Todos os saldos vinculados serão removidos.')) return;
    
    setIsDeletingId(id);
    try {
      await deleteDoc(doc(db, 'financial_positions', id));
      // Also delete transactions
      const q = query(collection(db, 'bank_transactions'), where('accountId', '==', id));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Erro ao excluir conta.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const clientName = clients.find(c => c.id === selectedClient)?.fantasia || 'Cliente';

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Posição Financeira" 
        subtitle="Monitoramento de disponibilidades, saldos bancários e evolução patrimonial"
        icon={Landmark}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-card text-muted-foreground border border-border rounded-md flex items-center gap-2 shadow-sm">
            <Clock size={12} />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              Sinc: {positions[0]?.dataAtualizacao || '--'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            disabled={!selectedClient}
            className="px-5 py-2.5 bg-card hover:bg-surface-container text-foreground border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <Upload size={12} /> IMPORTAR EXTRATO
          </button>
          <button 
            onClick={() => setShowAccountModal(true)}
            disabled={!selectedClient}
            className="px-6 py-2.5 bg-secondary text-white rounded-md text-[10px] font-medium uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-premium flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> ADICIONAR CONTA
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard 
          title="Saldo Total Atual" 
          value={formatValue(kpis.totalCurrent, '')}
          suffix="R$"
          icon={Landmark}
        />
        <KpiCard 
          title="Saldos no Início do Mês" 
          value={formatValue(kpis.totalInitial, '')}
          suffix="R$"
          icon={Clock}
        />
        <KpiCard 
          title="Evolução no Mês" 
          value={kpis.variation.toFixed(2)}
          suffix="%"
          icon={TrendingUp}
          status={kpis.variation >= 0 ? 'Verde' : 'Vermelho'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-sm font-bold text-slate-800">Evolução do Saldo Consolidado</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Histórico dos últimos 5 meses</p>
             </div>
             <div className="p-2 bg-primary/5 rounded-xl">
               <TrendingUp size={18} className="text-primary" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggHistory}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 600 }} tickFormatter={v => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.cardFg, boxShadow: 'var(--shadow-md)' }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="saldo" stroke={colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-sm font-bold text-slate-800">Composição por Banco</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Distribuição de Disponibilidades</p>
             </div>
             <div className="p-2 bg-slate-50 rounded-xl">
               <PieChartIcon size={18} className="text-secondary" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={positions.map(p => {
                    const rate = exchangeRates[p.moeda as keyof typeof exchangeRates] || 1;
                    return { name: p.banco, value: p.saldoAtual * rate };
                  })}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {positions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[colors.primary, colors.secondary, colors.success, colors.mutedForeground][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.cardFg, boxShadow: 'var(--shadow-md)' }}
                   formatter={(v: number) => formatCurrency(v)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição / Banco</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ag / Conta</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo / Moeda</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Saldo Atual (BRL)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Variação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Atualização</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={7} className="px-8 py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Carregando posições...</p>
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic">Nenhuma conta encontrada.</td>
                </tr>
              ) : (
                positions.map((p, idx) => {
                  const id = p.id || `mock-${idx}`;
                  const varAbs = p.saldoAtual - p.saldoInicial;
                  const varPerc = p.saldoInicial !== 0 ? (varAbs / p.saldoInicial) * 100 : 0;
                  
                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/50">
                            <Landmark size={18} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{p.banco}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {(id || '').padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{p.agencia || '--'}</span>
                          <span className="text-xs font-medium text-slate-500">{p.conta || '--'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tighter rounded-full border border-slate-200/50">
                            {p.tipoConta}
                          </span>
                          <span className={cn(
                            "text-[10px] font-black",
                            p.moeda === 'BRL' ? "text-slate-400" : "text-blue-600"
                          )}>
                            {p.moeda || 'BRL'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-primary">
                            {formatCurrency(p.saldoAtual * (exchangeRates[p.moeda as keyof typeof exchangeRates] || 1))}
                          </span>
                          {p.moeda !== 'BRL' && (
                            <span className="text-[10px] font-bold text-slate-400 italic">
                              {p.moeda} {p.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase",
                          varAbs >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {varAbs >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {Math.abs(varPerc).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-bold text-slate-700">{p.dataAtualizacao}</span>
                          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Sincronizado</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedAccountForTransactions(p)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Ver Extrato"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingAccount(p)}
                            className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                            title="Editar Conta"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(id)}
                            disabled={isDeletingId === id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                            title="Excluir Conta"
                          >
                            {isDeletingId === id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAccountModal && selectedClient && (
        <BankAccountModal 
          clientId={selectedClient} 
          onClose={() => setShowAccountModal(false)} 
        />
      )}

      {editingAccount && selectedClient && (
        <BankAccountModal 
          clientId={selectedClient} 
          account={editingAccount}
          onClose={() => setEditingAccount(null)} 
        />
      )}

      {selectedAccountForTransactions && (
        <BankTransactionsModal 
          account={selectedAccountForTransactions}
          onClose={() => setSelectedAccountForTransactions(null)}
        />
      )}

      {showImportModal && selectedClient && (
        <ImportBankStatementModal 
          selectedClient={selectedClient}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            // Saldo atualizado via Firestore listener
          }}
        />
      )}
    </div>
  );
}
