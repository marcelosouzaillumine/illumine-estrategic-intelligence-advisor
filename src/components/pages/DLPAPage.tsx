import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, FileText, Database, TrendingUp, TrendingDown, Info, BarChart3, AlertTriangle, ShieldAlert, Zap, Target, Activity, ShieldCheck, PieChart as PieChartIcon, CheckCircle2 } from 'lucide-react';
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
  Pie,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { executiveRuntime, ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
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

// Helper: Custom Advanced KPI Card
function AdvancedKpiCard({ title, value, subtitle, status, icon: Icon, colorClass, borderClass }: any) {
  return (
    <div className={cn("p-6 rounded-[24px] border bg-white shadow-sm flex flex-col relative overflow-hidden group transition-all hover:shadow-md hover:border-slate-300", borderClass)}>
      <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none transition-transform duration-500 group-hover:scale-[2]", colorClass)} />
      <div className="flex items-start justify-between mb-5 relative z-10">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight w-2/3">{title}</h4>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
          <Icon size={18} />
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <div className="w-full [container-type:inline-size] py-1 mb-2">
           <p className="font-display font-medium text-slate-800 truncate text-[clamp(1.1rem,12cqw,1.75rem)] tracking-tight">
             {value}
           </p>
        </div>
        <div className="flex items-center gap-2">
           <span className={cn("text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border", status.bgColor, status.textColor, status.borderColor)}>
             {status.label}
           </span>
           <span className="text-[10px] text-slate-400 font-medium line-clamp-1">{subtitle}</span>
        </div>
      </div>
    </div>
  )
}

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca de Dados ────────────────────────────────────────────────────────
  const { dbData: dbDataDLPA, docIds: docIdsDLPA, loading: loadingDLPA, refetch: refetchDLPA } =
    useAnnualFinancialData(selectedClient, filterYear, 'DLPA');

  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDLPA;
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);

  useEffect(() => {
    if (!loadingHistory && allHistoryData.length > 0) {
      const input = {
        rawFinancialData: { segmentoEmpresa: clients?.find((c: any) => c.id === selectedClient)?.segmento || 'Default' },
        historicalCyclesCount: 1,
        isMockData: false
      };
      setExecutiveReport(executiveRuntime.generateExecutiveReport(input));
    }
  }, [allHistoryData, loadingHistory, selectedClient, clients]);



  // ── Histórico para Gráficos ───────────────────────────────────────────────
  const chartData = useMemo(() => {
    return [4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => d.year === y);
      
      const getValY = (docTypes: string[], nameFilters: string[]) => {
        const normalizedFilters = nameFilters.map(n => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
        const match = yearEntries.filter((d: any) => docTypes.includes(d.type?.toLowerCase())).find((d: any) => {
          const c = (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          return normalizedFilters.some(n => c.includes(n));
        });
        return match?.val || match?.valor || match?.value || 0;
      };

      const l = getValY(['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio']);
      const d = Math.abs(getValY(['dlpa', 'dre', 'dfc'], ['dividendos', 'distribuicao']));
      const f = getValY(['dfc'], ['caixa operacional', 'fco']);

      return {
        year: y.toString(),
        Lucro: l,
        Dividendos: d,
        FCO: f
      };
    });
  }, [allHistoryData, filterYear]);

  // ── Handlers & UI Auxiliar ────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const actionButtons = (
    <div className="flex items-center gap-3">
      <div className="flex bg-card p-1 rounded-md border border-border items-center mr-2 shadow-sm">
        <Calendar size={12} className="ml-2 text-secondary" />
        <select
          onChange={(e) => setFilterYear(Number(e.target.value))}
          value={filterYear}
          className="bg-transparent px-3 py-1 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
        >
          {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowManualModal(true)}
        className="px-4 py-2 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Plus size={14} /> Lançar
      </button>

      <button
        onClick={() => setShowImportModal(true)}
        className="px-4 py-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Upload size={14} /> Importar
      </button>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Módulo de Inteligência de Capital & Governança" 
        subtitle="Análise estratégica profunda de distribuição, preservação patrimonial e qualidade do lucro."
        icon={Target}
        color="executive"
      />
      
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/50 p-4 rounded-2xl border border-slate-200 backdrop-blur-md shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
              Cálculo Dinâmico Multi-DRE/BP/DFC
            </span>
          </div>
        </div>
        {actionButtons}
      </div>

      {/* Visão de Board e Parecer Automático */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-1 rounded-[32px] p-8 bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white group">
          <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:scale-110", "bg-blue-500/10")} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest">Health Score</h3>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">Visão de Board</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Maturidade do Capital</p>
            <p className="text-lg font-black text-white/90">{executiveReport?.scores?.governance >= 60 ? 'Distribuição Estratégica' : 'Retenção Recomendada'}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
               <Zap size={20} className="text-slate-700" />
             </div>
             <div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Parecer Executivo Automático</h3>
               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Análise Sistêmica</p>
             </div>
           </div>

           <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {executiveReport?.causality?.insights?.map((insight, idx) => (
               <div key={idx} className={cn(
                 "p-5 rounded-2xl border flex gap-4",
                 insight.bgClass
               )}>
                 <div className="shrink-0 mt-0.5">
                    {insight.bgClass.includes('rose') ? <ShieldAlert size={18} className="text-rose-500" /> :
                     insight.bgClass.includes('amber') ? <AlertTriangle size={18} className="text-amber-500" /> :
                     insight.bgClass.includes('emerald') ? <CheckCircle2 size={18} className="text-emerald-500" /> :
                     <Info size={18} className="text-blue-500" />}
                 </div>
                 <p className={cn(
                   "text-sm font-medium leading-relaxed text-slate-800"
                 )}>
                   {insight.text}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Grade de Indicadores */}
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-2 flex items-center gap-2">
        <Activity size={16} className="text-secondary" /> Indicadores Estratégicos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AdvancedKpiCard 
          title="Liquidez Geral" 
          value={formatValue(executiveReport?.metrics?.financialMetrics?.liqGeral || 0, '')} 
          subtitle="Ativos / Passivos"
          status={{ label: 'Mapeado', bgColor: 'bg-slate-100', textColor: 'text-slate-600', borderColor: 'border-slate-200' }}
          icon={TrendingUp}
          colorClass="bg-blue-50 text-blue-500"
          borderClass="border-blue-100"
        />
        <AdvancedKpiCard 
          title="Endividamento" 
          value={formatValue((executiveReport?.metrics?.financialMetrics?.qualidadeEndividamento || 0) * 100, '') + '%'} 
          subtitle="Qualidade Passivo"
          status={{ label: 'Mapeado', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600', borderColor: 'border-emerald-500/20' }}
          icon={Activity}
          colorClass="bg-emerald-50 text-emerald-500"
          borderClass="border-emerald-100"
        />
        <AdvancedKpiCard 
          title="Capital de Giro Líq." 
          value={formatCurrency(executiveReport?.metrics?.financialMetrics?.cgl || 0)} 
          subtitle="Recursos de Longo Prazo"
          status={{ label: 'Mapeado', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600', borderColor: 'border-blue-500/20' }}
          icon={ShieldCheck}
          colorClass="bg-indigo-50 text-indigo-500"
          borderClass="border-indigo-100"
        />
        <AdvancedKpiCard 
          title="Saldo Tesouraria" 
          value={formatCurrency(executiveReport?.metrics?.financialMetrics?.saldoTesouraria || 0)} 
          subtitle="Margem Segurança"
          status={{ label: 'Mapeado', bgColor: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200' }}
          icon={Database}
          colorClass="bg-purple-50 text-purple-500"
          borderClass="border-purple-100"
        />
      </div>

      {/* Gráficos Analíticos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Dinâmica de Geração e Distribuição</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Lucro Líquido vs FCO vs Dividendos</p>
              </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">{payload[0].payload.year}</p>
                            <div className="space-y-2">
                              {payload.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-8">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{p.name}</span>
                                  </div>
                                  <span className="text-xs font-black text-slate-900">{formatCurrency(p.value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Lucro" name="Lucro Líquido" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Dividendos" name="Dividendos" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line type="monotone" dataKey="FCO" name="Caixa Operac. (FCO)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <h3 className="text-lg font-black mb-1 relative z-10">Mapeamento de Valor</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8 relative z-10">Qualidade e Sustentabilidade</p>
            
            <div className="space-y-4 flex-1 relative z-10">
               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Qualidade do Lucro</p>
                    <p className="text-sm font-bold text-white">
                      {executiveReport?.scores?.financial >= 70 ? 'Alta' : 'Moderada'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <Database size={16} className="text-white/70" />
                  </div>
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacto Patrimonial</p>
                    <p className="text-sm font-bold text-white">
                      {executiveReport?.scores?.composite >= 60 ? 'Preservado' : 'Sob Pressão'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <ShieldCheck size={16} className="text-white/70" />
                  </div>
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Causalidade Temporal</p>
                    <p className="text-sm font-bold text-white">
                      Monitorado pelo Runtime
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <AlertTriangle size={16} className="text-white/70" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Detalhamento da DLPA (Tabela) */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden mb-10">
        <div className="px-6 md:px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
               <FileText size={16} className="text-blue-500" />
             </div>
             <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detalhamento da DLPA</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Demonstração Contábil</p>
             </div>
          </div>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            Composição de Lucros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="text-left py-4 px-6 md:px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                <th className="text-right py-4 px-6 md:px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { conta: 'DLPA Estrutural', val: 0, isTotal: true },
              ].map((row: any, i: number) => (
                <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', row.isTotal ? 'bg-slate-50/30' : '')}>
                  <td className="py-3.5 px-6 md:px-8">
                    <span className={cn('block', row.isTotal ? 'text-slate-900 font-black' : 'text-slate-500 font-medium pl-4')}>
                      {row.conta}
                    </span>
                  </td>
                  <td className={cn("py-3.5 px-6 md:px-8 text-right font-mono font-bold", (row.val || 0) < 0 ? "text-rose-500" : "text-slate-700", row.isTotal && "text-slate-900")}>
                    {formatCurrency(row.val || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
