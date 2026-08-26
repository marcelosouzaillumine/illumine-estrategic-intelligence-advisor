import React, { useState, useEffect, useMemo } from 'react';
import { useFinancialMath } from '../../hooks/useFinancialMath';
import { useExecutiveAnalytics } from '../../hooks/useExecutiveAnalytics';
import { ExecutiveNarrativeRenderer } from '../ui/ExecutiveNarrativeRenderer';

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
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useFinancialPositionPageViewModel } from '../../viewmodels/useFinancialPositionPageViewModel';
import { DATA } from '../../data';
import { cn, formatCurrency, formatValue, getThemeColors } from '../../lib/utils';
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
import { StatusBadge } from '../Common';
import { useFinancialPositionViewModel } from '../../viewmodels/useFinancialPositionViewModel';
import { useExecutiveFormatter } from '@/core/localization';

export function FinancialPositionPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const formatter = useExecutiveFormatter();
  // Adapter: useFinancialPositionPageAdapter
  // ViewModel: useFinancialPositionPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useFinancialPositionPageViewModel({ clientId: selectedClient });
  // Adapter: useFinancialPositionAdapter
  // ViewModel: useFinancialPositionViewModel
  const { state, computed, actions } = useFinancialPositionViewModel({ clientId: selectedClient });
  const portal = createPortal;
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

  // Fetch Governed Analytics from Engine
  const { result: analyticsResult } = useExecutiveAnalytics(selectedClient, 'BalanceSheetCapability', positions);

  // Translate to Narrative
  const narrative = useMemo(() => {
    if (!analyticsResult) return null;

    return {
      title: 'Síntese Executiva',
      blocks: analyticsResult.diagnostics.map(diag => {
        let content = '';
        if (diag.status === 'HEALTHY' || diag.status === 'EXCELLENT') {
          content = diag.technicalConclusion + ' A empresa apresenta uma liquidez robusta, demonstrando capacidade plena de honrar seus compromissos.';
        } else if (diag.status === 'CRITICAL') {
          content = 'Alerta: ' + diag.technicalConclusion + ' A empresa está com liquidez comprometida, indicando risco iminente de ruptura de caixa.';
        } else {
          content = diag.technicalConclusion;
        }

        return {
          type: 'DIAGNOSTIC',
          content,
          sourceDiagnosticId: diag.evidence?.evidenceId
        };
      })
    };
  }, [analyticsResult]);

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
    <ExecutivePageTemplate header={{
      title: "Posição Financeira",
      description: "Monitoramento de disponibilidades, saldos bancários e evolução patrimonial.",
    }}>

      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label={`${positions.length} conta(s)`} />
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
            className="px-4 md:px-6 py-2 md:py-2.5 bg-secondary text-white rounded-md text-[10px] font-medium uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-premium flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> ADICIONAR CONTA
          </button>
        </div>
      </div>

       {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE POSIÇÃO FINANCEIRA) --- */}
       {narrative && (
         <div className="mb-8 relative group">
           <ExecutiveNarrativeRenderer narrative={narrative} />

           {/* GATE 5 - Evidence Button */}
           <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold uppercase tracking-wider border border-slate-300 shadow-sm"
                     onClick={() => alert(`Evidence Viewer\nEngine Version: ${analyticsResult?.evidence?.engineVersion}\nSource: ${analyticsResult?.evidence?.dataSource}`)}>
               <Eye size={14} /> Ver Evidência
             </button>
           </div>
         </div>
       )}

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
         title="Saldos e Evolução Patrimonial"
         subtitle="Disponibilidades, KPIs consolidados e histórico de saldo bancário."
         variant="analytics"
         defaultExpanded
       >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExecutiveMetricCard density="analytical" label="Saldo Total Atual" value={`R$ ${formatValue(0, '')}`} icon={Landmark} />
        <ExecutiveMetricCard density="analytical" label="Saldos no Início do Mês" value={`R$ ${formatValue(0, '')}`} icon={Clock} />
        <ExecutiveMetricCard density="analytical" label="Evolução no Mês" value={`0%`} icon={TrendingUp} tone={"success"} />
      </div>
      </ExecutiveAccordion>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
       <ExecutiveHeading as="h3" className="text-executive-secondary">Evolução do Saldo Consolidado</ExecutiveHeading>
              <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-1">Histórico dos últimos 5 meses</ExecutiveText>
             </div>
             <div className="p-2 bg-primary/5 rounded-xl">
               <TrendingUp size={18} className="text-primary" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[]}>
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

        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
       <ExecutiveHeading as="h3" className="text-executive-secondary">Composição por Banco</ExecutiveHeading>
              <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-1">Distribuição de Disponibilidades</ExecutiveText>
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
                    const rate = 1;
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

      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border">
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Instituição / Banco</th>
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Ag / Conta</th>
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Tipo / Moeda</th>
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Saldo Atual (BRL)</th>
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Variação</th>
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Atualização</th>
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={7} className="px-8 py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
          <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">Carregando posições...</ExecutiveText>
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-muted-foreground italic">Nenhuma conta encontrada.</td>
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
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-border">
                            <Landmark size={18} className="text-muted-foreground" />
                          </div>
                          <div>
              <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">{p.banco}</ExecutiveText>
                            <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">ID: {(id || '').padStart(3, '0')}</ExecutiveText>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-muted-foreground">{p.agencia || '--'}</span>
                          <span className="text-xs font-medium text-muted-foreground">{p.conta || '--'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="px-3 py-1 bg-slate-100 text-muted-foreground text-[10px] font-black uppercase tracking-tighter rounded-full border border-border">
                            {p.tipoConta}
                          </span>
                          <span className={cn(
                            "text-[10px] font-black",
                            p.moeda === 'BRL' ? "text-muted-foreground" : "text-blue-600"
                          )}>
                            {p.moeda || 'BRL'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-primary">
                            {formatCurrency(p.saldoAtual)}
                          </span>
                          {p.moeda !== 'BRL' && (
                            <span className="text-[10px] font-bold text-muted-foreground italic">
                              {p.moeda} {formatter.number(p.saldoAtual, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase",
                          varAbs >= 0 ? "bg-success-soft text-emerald-600" : "bg-critical-soft text-rose-600"
                        )}>
                          {varAbs >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {Math.abs(varPerc).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-bold text-muted-foreground">{p.dataAtualizacao}</span>
                          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Sincronizado</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAccountForTransactions(p)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Ver Extrato"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditingAccount(p)}
                            className="p-2 text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                            title="Editar Conta"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(id)}
                            disabled={isDeletingId === id}
                            className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-critical-soft rounded-lg transition-all disabled:opacity-50"
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
       {/* Executive Summary Bottom Section Removed. Narrative Renderer handles it at the top. */}
    </ExecutivePageTemplate>
  );
}
