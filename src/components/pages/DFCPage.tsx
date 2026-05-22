import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, WalletCards, Database, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

type ToastType = { type: 'success' | 'error'; message: string } | null;

export function DFCPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais ──────────────────────────────────────────────────────
  const { dbData: dbDataDFC, docIds: docIdsDFC, loading: loadingDFC, refetch: refetchDFC } =
    useAnnualFinancialData(selectedClient, filterYear, 'DFC');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDFC;
  const dbData = dbDataDFC;
  const docIds = docIdsDFC;

  const [isGenerated, setIsGenerated] = useState(false);

  const rows = useMemo(() => {
    if (dbData && dbData.length > 0) {
      setIsGenerated(false);
      return dbData;
    }

    setIsGenerated(true);

    const normalizeString = (s: string) => 
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/^[0-9.]+\s*[-]\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim();

    const getHistoricalValue = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistoryData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => normalizeString(d.type || '') === normalizeString(t))
      );
      
      const normalizedFilters = nameFilters.map(normalizeString);
      const match = yearEntries.find((d: any) => {
        const c = normalizeString(d.conta || d.category || '');
        return normalizedFilters.some(n => c === n || c.includes(n));
      });
      return match?.val || match?.valor || match?.value || 0;
    };
    
    const getHistoricalSum = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistoryData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => normalizeString(d.type || '') === normalizeString(t))
      );
      
      let sum = 0;
      const normalizedFilters = nameFilters.map(normalizeString);
      yearEntries.forEach((d: any) => {
        const c = normalizeString(d.conta || d.category || '');
        if (normalizedFilters.some(n => c === n || c.includes(n))) {
           sum += (d.val || d.valor || d.value || 0);
        }
      });
      return sum;
    };

    const lucroLiquido = getHistoricalValue(filterYear, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
    const depreciacaoDre = Math.abs(getHistoricalSum(filterYear, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));

    const clientesAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
    const clientesAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
    const varClientes = clientesAnt - clientesAtual;

    const estoqueAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
    const estoqueAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
    const varEstoque = estoqueAnt - estoqueAtual;

    const fornecedoresAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
    const fornecedoresAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
    const varFornecedores = fornecedoresAtual - fornecedoresAnt;

    const fco = lucroLiquido + depreciacaoDre + varClientes + varEstoque + varFornecedores;

    const imobAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['imobilizado', 'intangivel', 'investimentos']);
    const imobAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['imobilizado', 'intangivel', 'investimentos']);
    const varImob = imobAnt - imobAtual;
    const fci = varImob - depreciacaoDre;

    const dividasAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos']);
    const dividasAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos']);
    const varDividas = dividasAtual - dividasAnt;

    const capAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
    const capAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
    const varCapital = capAtual - capAnt;

    const saldoInicialLucro = getHistoricalValue(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['lucros acumulados', 'lucro acumulado', 'prejuizos acumulados', 'lucros ou prejuizos']);
    const saldoFinalLucro = getHistoricalValue(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['lucros acumulados', 'lucro acumulado', 'prejuizos acumulados', 'lucros ou prejuizos']);
    const dividendos = saldoInicialLucro + lucroLiquido - saldoFinalLucro;

    const fcf = varDividas + varCapital - dividendos;

    const variacaoCaixa = fco + fci + fcf;

    // --- DEBUG INFO ---
    setDebugInfo({
      totalHistoryLength: allHistoryData.length,
      dreRowsCurrentYear: allHistoryData.filter((d: any) => Number(d.year) === filterYear && ['dre', 'resultado'].some(t => normalizeString(d.type || '') === normalizeString(t))).length,
      bpRowsCurrentYear: allHistoryData.filter((d: any) => Number(d.year) === filterYear && ['balanço patrimonial', 'bp'].some(t => normalizeString(d.type || '') === normalizeString(t))).length,
      bpRowsLastYear: allHistoryData.filter((d: any) => Number(d.year) === filterYear - 1 && ['balanço patrimonial', 'bp'].some(t => normalizeString(d.type || '') === normalizeString(t))).length,
      lucroLiquidoFound: lucroLiquido,
      fcoCalculated: fco
    });
    // ------------------

    return [
      { item: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: fco, isTotal: true },
      { item: '  Lucro Líquido', val: lucroLiquido, isSubTotal: false },
      { item: '  Depreciação e Amortização', val: depreciacaoDre, isSubTotal: false },
      { item: '  Variação de Clientes', val: varClientes, isSubTotal: false },
      { item: '  Variação de Estoques', val: varEstoque, isSubTotal: false },
      { item: '  Variação de Fornecedores', val: varFornecedores, isSubTotal: false },
      { item: 'Fluxo de Caixa das Atividades de Investimento (FCI)', val: fci, isTotal: true },
      { item: '  Aquisição/Alienação de Imob. e Intangível', val: fci, isSubTotal: false },
      { item: 'Fluxo de Caixa das Atividades de Financiamento (FCF)', val: fcf, isTotal: true },
      { item: '  Captação/Amortização de Empréstimos', val: varDividas, isSubTotal: false },
      { item: '  Aumento de Capital', val: varCapital, isSubTotal: false },
      { item: '  Distribuição de Dividendos e Lucros', val: -dividendos, isSubTotal: false },
      { item: 'Aumento / Redução de Caixa (Variação Líquida)', val: variacaoCaixa, isTotal: true },
    ];
  }, [dbData, allHistoryData, filterYear]);

  const getValue = (source: any[], name: string) => {
    const search = name.toLowerCase();
    return source.find(s => (s.conta || s.category || '').toLowerCase().includes(search))?.val || 0;
  };

  const fco = getValue(rows, 'Atividades Operacionais');
  const fci = getValue(rows, 'Atividades de Investimento');
  const fcf = getValue(rows, 'Atividades de Financiamento');
  const variacao = getValue(rows, 'Aumento / Redução de Caixa');

  const cashIndices = [
    { name: 'Fluxo Operacional', val: fco, unit: 'R$', desc: 'Geração de caixa pelas atividades principais', color: 'text-emerald-600' },
    { name: 'Fluxo Investimento', val: fci, unit: 'R$', desc: 'Consumo de caixa em ativos e Capex', color: 'text-blue-600' },
    { name: 'Fluxo Financiamento', val: fcf, unit: 'R$', desc: 'Entradas e saídas de capital e dívidas', color: 'text-purple-600' },
    { name: 'Variação Líquida', val: variacao, unit: 'R$', desc: 'Resultado final das movimentações de caixa', color: 'text-slate-900' },
  ];

  // ── Histórico para Gráfico ────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return [5, 4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => d.year === y && d.type === 'DFC');
      
      let o = 0; let i = 0; let f = 0;

      if (yearEntries.length > 0) {
        o = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('operacionais')).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
        i = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('investimento')).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
        f = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('financiamento')).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
      } else {
        o = 0; i = 0; f = 0;
      }

      return {
        year: y.toString(),
        operacional: o,
        investimento: i,
        financiamento: f
      };
    }).filter(d => d.operacional !== 0 || d.investimento !== 0 || d.financiamento !== 0);
  }, [allHistoryData, selectedClient, filterYear]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async () => {
    if (!auth.currentUser) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }
    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', selectedClient),
        where('type',     '==', 'DFC'),
        where('year',     '==', filterYear)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
      showToast('success', `${snap.docs.length} registro(s) excluído(s) com sucesso.`);
      refetchDFC();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };



  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Fluxo de Caixa (DFC)" 
        subtitle="Análise detalhada de geração e consumo de caixa pelo método indireto."
        icon={WalletCards}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        
        {debugInfo && (
          <div className="w-full mb-4 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-md text-xs font-mono">
            <p className="font-bold mb-2">🔍 DFC Debug Info</p>
            <ul className="space-y-1">
              <li>totalHistoryLength: {debugInfo.totalHistoryLength}</li>
              <li>dreRowsCurrentYear: {debugInfo.dreRowsCurrentYear}</li>
              <li>bpRowsCurrentYear: {debugInfo.bpRowsCurrentYear}</li>
              <li>bpRowsLastYear: {debugInfo.bpRowsLastYear}</li>
              <li>lucroLiquidoFound: {debugInfo.lucroLiquidoFound}</li>
              <li>fcoCalculated: {debugInfo.fcoCalculated}</li>
            </ul>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={(dbData.length > 0 || isGenerated) ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', (dbData.length > 0 || isGenerated) ? 'text-success' : 'text-muted-foreground/40')}>
              {dbData.length > 0 ? 'Dados Reais' : isGenerated ? 'Cálculo Dinâmico (BP/DRE)' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
            <Calendar size={12} className="ml-2 text-secondary" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
            >
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-3 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cashIndices.map((idx, i) => (
          <KpiCard 
            key={i}
            title={idx.name}
            value={formatValue(idx.val, '')}
            suffix="R$"
            icon={WalletCards}
            status={idx.val >= 0 ? 'Verde' : 'Vermelho'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Origens e Aplicações</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Comparativo Histórico de Fluxos</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">F.O.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">F.I.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">F.F.</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50">{payload[0].payload.year}</p>
                          <div className="space-y-1.5">
                            {payload.map((p: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-8">
                                <span className="text-[10px] font-bold text-white/70 uppercase">{p.name}</span>
                                <span className="text-xs font-black">{formatCurrency(p.value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="operacional" name="Operacional" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investimento" name="Investimento" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="financiamento" name="Financiamento" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-lg font-black mb-1">Destaques</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Análise de Liquidez</p>
          
          <div className="space-y-6 flex-1">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Saldo Final Estimado</p>
                <p className="text-sm font-bold">{formatCurrency(variacao)}</p>
                <p className="text-[9px] text-white/30 font-medium mt-1 italic">Fluxo líquido do período</p>
             </div>
             
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Capacidade de Reinvestimento</p>
                <p className="text-sm font-bold">{fco > 0 ? ((Math.abs(fci) / fco) * 100).toFixed(1) : 0}%</p>
                <p className="text-[9px] text-white/30 font-medium mt-1 italic">% do FCO aplicado em Investimentos</p>
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Database size={18} className="text-white" />
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inteligência de Dados</p>
               <p className="text-[10px] font-medium text-white/70 italic">Análise baseada em ciclos históricos</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-10">
        <div className="px-5 md:px-8 py-3 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detalhamento da DFC</h4>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            Fluxo de Caixa Indireto
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row: any, i: number) => (
                <tr key={i} className={cn('hover:bg-surface-container/50 transition-colors group', (row.isTotal || row.isSubTotal) ? 'bg-surface-container/30 font-bold' : '')}>
                  <td className="py-2.5 md:py-4 px-5 md:px-8">
                    <span className={cn('block overflow-visible break-words', (row.isTotal || row.isSubTotal) ? 'text-secondary' : 'pl-4 text-muted-foreground font-medium')}>
                      {row.conta || row.category || row.item}
                    </span>
                  </td>
                  <td className={cn("py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", (row.val || 0) < 0 ? "text-rose-500" : "text-slate-700")}>
                    {formatCurrency(row.val || row.valor || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExecutiveCommentary
        reportType="DFC"
        clientId={selectedClient}
        year={filterYear}
        month={1}
      />

      {showImportModal && (
        <ImportFinancialModal
          type="DFC"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchDFC();
            showToast('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DFC"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchDFC();
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros da DFC para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}
    </div>
  );
}

