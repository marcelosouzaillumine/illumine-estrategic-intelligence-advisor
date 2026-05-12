import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Save, 
  UploadCloud, 
  Link2,
  CheckCircle2,
  Loader2,
  X,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp,
  Clock,
  AlertTriangle,
  Zap,
  ChevronRight,
  ArrowRightLeft,
  Sparkles,
  FileText,
  Trash2,
  Info,
  Coins,
  ShieldCheck,
  Activity,
  Target,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  Cell 
} from 'recharts';
import { DATA } from '../../data';
import { SYSTEM_KPI_CATEGORIES, MONTH_LABELS, FULL_MONTH_LABELS } from '../../constants';
import { formatCurrency, formatValue, cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';

// We'll need to define a few small shared components or pass them as props
// For now, I'll define them here to avoid creating too many small files
function Semaphore({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    'Verde': 'verde',
    'Amarelo': 'amarelo',
    'Vermelho': 'vermelho'
  };
  return <span className={cn("semaforo", colorMap[status] || 'verde')} />;
}

function StatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    'Verde': 'badge-verde',
    'Amarelo': 'badge-amarelo',
    'Vermelho': 'badge-vermelho',
    'Validado': 'badge-verde',
    'Ativo': 'badge-verde',
    'Implantação': 'badge-amarelo',
    'Viável': 'badge-verde',
    'Ativa': 'badge-verde',
    'Inativa': 'badge-vermelho'
  };
  return (
    <span className={cn("badge font-sans", classMap[status] || 'badge-verde')}>
      {status}
    </span>
  );
}

export function DashboardPage({ 
  clients, 
  selectedClient, 
  setSelectedClient, 
  selectedMonth, 
  setSelectedMonth, 
  selectedYear, 
  setSelectedYear,
  realData = {}
}: any) {
  const [dbIndicators, setDbIndicators] = React.useState<any[]>([]);
  const [allYearIndicators, setAllYearIndicators] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isYTD, setIsYTD] = React.useState(false);

  React.useEffect(() => {
    if (!selectedClient) return;

    setLoading(true);
    // Fetch ALL indicators for the client to support charts, history and projections
    const qAll = query(
      collection(db, 'indicators'),
      where('clientId', '==', selectedClient)
    );

    const unsubAll = onSnapshot(qAll, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllYearIndicators(allData);
      
      // Filter for current view
      const current = allData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
      setDbIndicators(current);
      
      setLoading(false);
    });

    return () => unsubAll();
  }, [selectedClient, selectedYear, selectedMonth]);

  const currentIndicators = useMemo(() => {
    if (!isYTD) {
      if (dbIndicators.length > 0) return dbIndicators;
      return DATA.indicadores.filter(r => r.id === selectedClient && r.mes === selectedMonth && r.ano === selectedYear);
    }

    // Annual/Forecast Aggregation Logic (Full Year Jan-Dec)
    const annualDocs = allYearIndicators.filter(d => d.ano === selectedYear);
    const indicatorNames = Array.from(new Set(annualDocs.map(d => d.ind)));
    
    // Check if this is a forecast (contains projected data)
    const isForecast = annualDocs.some((d: any) => d.cat === 'Projetado');

    return indicatorNames.map(name => {
      const docsForInd = annualDocs.filter(d => d.ind === name);
      const sample = docsForInd[0];
      const n = name as string;
      const isPercentage = sample?.un === '%' || n.toLowerCase().includes('margem') || n.toLowerCase().includes('taxa') || n.includes('/') || n.includes('x');
      
      const totalVal = docsForInd.reduce((sum, d) => sum + (d.val || 0), 0);
      const avgVal = totalVal / (docsForInd.length || 1);
      
      return {
        ...sample,
        val: isPercentage ? avgVal : totalVal,
        isAnnual: true,
        isForecast
      };
    });
  }, [dbIndicators, allYearIndicators, isYTD, selectedClient, selectedMonth, selectedYear]);
  
  const getIndicator = (name: string) => {
    const mock = currentIndicators.find(i => i.ind === name);
    
    const mappingId = SYSTEM_KPI_CATEGORIES.find(c => c.label === name)?.id;
    if (mappingId && realData[mappingId] !== undefined) {
      return { 
        ...mock, 
        val: realData[mappingId], 
        ind: name, 
        un: 'R$', 
        sem: 'Verde',
        isReal: true 
      };
    }
    return mock;
  };

  const metrics = [
    { label: 'Receita Líquida', key: 'Receita Líquida' },
    { label: 'EBITDA', key: 'EBITDA' },
    { label: 'Lucro Líquido', key: 'Lucro Líquido' },
    { label: 'Saldo em Caixa', key: 'Saldo em Caixa' },
    { label: 'Valor Estimado (Valuation)', key: 'Valor de Mercado' },
  ];

  const evolData = useMemo(() => {
    if (!isYTD) {
      // Monthly view: last 12 months (historical)
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(selectedYear, selectedMonth - 1 - (11 - i), 1);
        return { m: d.getMonth() + 1, y: d.getFullYear() };
      });
      
      return months.map(({ m, y }) => {
        const monthIndicators = allYearIndicators.filter((i: any) => i.mes === m && i.ano === y);
        let fat = monthIndicators.find((i: any) => i.ind === 'Faturamento Bruto')?.val;
        const rec = monthIndicators.find((i: any) => i.ind === 'Receita Líquida')?.val || 0;
        const ebitda = monthIndicators.find((i: any) => i.ind === 'EBITDA')?.val || 0;
        
        // Fallback for missing Faturamento Bruto in older AI seeds
        if (fat === undefined && rec > 0) fat = rec * 1.15;
        
        return {
          name: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}`,
          Faturamento: fat || 0,
          Receita: rec,
          EBITDA: ebitda,
          type: 'Real'
        };
      });
    } else {
      // Annual view: 6 years historical + 5 years projected
      const range = Array.from({ length: 11 }, (_, i) => selectedYear - 5 + i);
      
      return range.map(y => {
        const yearIndicators = allYearIndicators.filter((i: any) => i.ano === y);
        
        let fat = yearIndicators.filter((i: any) => i.ind === 'Faturamento Bruto').reduce((acc, curr) => acc + curr.val, 0);
        const rec = yearIndicators.filter((i: any) => i.ind === 'Receita Líquida').reduce((acc, curr) => acc + curr.val, 0);
        const ebitda = yearIndicators.filter((i: any) => i.ind === 'EBITDA').reduce((acc, curr) => acc + curr.val, 0);
        
        // Fallback for missing Faturamento Bruto in older AI seeds
        if (fat === 0 && rec > 0) fat = rec * 1.15;

        return {
          name: y.toString(),
          Faturamento: fat,
          Receita: rec,
          EBITDA: ebitda,
          type: y <= selectedYear ? 'Real' : 'Proj'
        };
      });
    }
  }, [allYearIndicators, selectedMonth, selectedYear, isYTD]);

  const trendData = useMemo(() => {
    if (!isYTD) {
      // Monthly view: 6 months historical + 6 months projected
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(selectedYear, selectedMonth - 1 - (6 - i), 1); // 6 back, 6 forward including current
        return { m: d.getMonth() + 1, y: d.getFullYear() };
      });

      return months.map(({ m, y }) => {
        const monthIndicators = allYearIndicators.filter((i: any) => i.mes === m && i.ano === y);
        const rec = monthIndicators.find((i: any) => i.ind === 'Receita Líquida');
        const lucro = monthIndicators.find((i: any) => i.ind === 'Lucro Líquido');
        
        const isFuture = y > selectedYear || (y === selectedYear && m > selectedMonth);

        return {
          name: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}`,
          Receita: rec?.val || 0,
          Lucro: lucro?.val || 0,
          type: isFuture ? 'Proj' : 'Real'
        };
      });
    } else {
      // Annual view: 6 years historical + 5 years projected
      const range = Array.from({ length: 11 }, (_, i) => selectedYear - 5 + i);
      
      return range.map(y => {
        const yearIndicators = allYearIndicators.filter((i: any) => i.ano === y);
        const rec = yearIndicators.filter((i: any) => i.ind === 'Receita Líquida').reduce((acc, curr) => acc + curr.val, 0);
        const lucro = yearIndicators.filter((i: any) => i.ind === 'Lucro Líquido').reduce((acc, curr) => acc + curr.val, 0);
        
        return {
          name: y.toString(),
          Receita: rec,
          Lucro: lucro,
          type: y <= selectedYear ? 'Real' : 'Proj'
        };
      });
    }
  }, [allYearIndicators, selectedMonth, selectedYear, isYTD]);

  const tableKpis = [
    'Liquidez Corrente',
    'Liquidez Seca',
    'Endividamento Geral',
    'Dívida Líquida / EBITDA',
    'ROE',
    'Fluxo de Caixa Operacional',
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-3xl p-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="text-secondary animate-spin" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Sincronizando Dados</h3>
        <p className="text-slate-500 max-w-md">Buscando indicadores reais e consolidando visão estratégica...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Strategic Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Monitoramento Estratégico Consolidado</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Visão global de performance, saúde e direcionamento da empresa.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <div className="flex items-center px-4 py-2 border-r border-white/10">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              !isYTD ? "text-secondary" : "text-slate-500"
            )}>Mensal</span>
            <button 
              onClick={() => setIsYTD(!isYTD)}
              className={cn(
                "w-12 h-6 rounded-full p-1 transition-all duration-500 relative",
                isYTD ? "bg-secondary" : "bg-slate-700"
              )}
            >
              <motion.div 
                animate={{ x: isYTD ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-lg"
              />
            </button>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              isYTD ? "text-secondary" : "text-slate-500"
            )}>
              {isYTD ? 'Longo Prazo' : 'Ano Corrente'}
            </span>
          </div>
        </div>
      </div>

      {/* CFO Executive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0">
             <div className="w-20 h-20 rounded-[32px] bg-secondary/10 flex items-center justify-center text-secondary relative">
                <Sparkles size={40} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                </div>
             </div>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3">AI Executive Insight</h3>
            <p className="executive-note">
              "A margem EBITDA apresenta uma tendência de expansão saudável, superando o benchmark do setor em 4.2%. A projeção de valuation indica uma oportunidade de destravamento de valor significativa se mantivermos a trajetória de redução do CAC prevista para o próximo trimestre."
            </p>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cash Position Alpha</h3>
            <p className="text-3xl font-display font-black mb-2">{formatCurrency(getIndicator('Saldo em Caixa')?.val || 0)}</p>
            <div className="flex items-center gap-2 text-emerald-400">
               <TrendingUp size={16} />
               <span className="text-xs font-bold">+12.5% vs m-1</span>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Ver Fluxo de Caixa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {metrics.map(m => {
          const r = getIndicator(m.key);
          const isValuation = m.key === 'Valor de Mercado';
          return (
            <div key={m.key} className={cn(
              "p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-elegant group relative overflow-hidden",
              isValuation ? "bg-slate-900 text-white border-none" : "bg-white"
            )}>
              {isValuation && <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Target size={60} /></div>}
              <div className="relative z-10">
                <p className={cn(
                  "text-[11px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-between",
                  isValuation ? "text-slate-400" : "text-slate-400"
                )}>
                  {m.label}
                  <Semaphore status={r?.sem || 'Verde'} />
                </p>
                <p className={cn(
                  "text-2xl font-display font-black tracking-tight group-hover:text-secondary transition-colors",
                  isValuation ? "text-white" : "text-primary"
                )}>
                  {r ? formatValue(r.val, r.un) : '—'}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                    (r as any)?.isReal ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {(r as any)?.isReal ? 'Realizado' : 'Projetado'}
                  </div>
                  {r?.val > 0 && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <TrendingUp size={10} /> 4.2%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Evolução de Resultados</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm interactive-card">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChartIcon size={14} className="text-secondary" /> {isYTD ? 'Trajetória 10 Anos (Histórico + Projeção)' : 'Visão Consolidada (Mensal)'}
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Bar name="Fat. Bruto" dataKey="Faturamento" radius={[4, 4, 0, 0]} barSize={24}>
                    {evolData.map((entry, index) => (
                      <Cell key={`cell-fat-${index}`} fill={entry.type === 'Real' ? "#ff8552" : "#ff855240"} />
                    ))}
                  </Bar>
                  <Bar name="Rec. Líquida" dataKey="Receita" radius={[4, 4, 0, 0]} barSize={24}>
                    {evolData.map((entry, index) => (
                      <Cell key={`cell-rec-${index}`} fill={entry.type === 'Real' ? "#0e1c2c" : "#0e1c2c40"} />
                    ))}
                  </Bar>
                  <Bar name="EBITDA" dataKey="EBITDA" radius={[4, 4, 0, 0]} barSize={24}>
                    {evolData.map((entry, index) => (
                      <Cell key={`cell-ebitda-${index}`} fill={entry.type === 'Real' ? "#bab86c" : "#bab86c40"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Margens & Tendência</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm interactive-card">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> {isYTD ? 'Tendência Estratégica (Longo Prazo)' : 'Lucratividade Mensal'}
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Line 
                    name="Receita Líquida"
                    type="monotone" 
                    dataKey="Receita" 
                    stroke="#0e1c2c" 
                    strokeWidth={4} 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.type === 'Proj') return <circle cx={cx} cy={cy} r={4} fill="#fff" stroke="#0e1c2c" strokeWidth={2} />;
                      return <circle cx={cx} cy={cy} r={5} fill="#0e1c2c" stroke="#fff" strokeWidth={2} />;
                    }}
                    strokeDasharray={isYTD ? "5 5" : "0"}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    name="Lucro Líquido"
                    type="monotone" 
                    dataKey="Lucro" 
                    stroke="#ff8552" 
                    strokeWidth={4} 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.type === 'Proj') return <circle cx={cx} cy={cy} r={4} fill="#fff" stroke="#ff8552" strokeWidth={2} />;
                      return <circle cx={cx} cy={cy} r={5} fill="#ff8552" stroke="#fff" strokeWidth={2} />;
                    }}
                    strokeDasharray={isYTD ? "5 5" : "0"}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Seção 4: Valuation e Atratividade Estratégica */}
      <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-10 shadow-inner mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-secondary" size={28} />
              Crescimento & Valuation
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Simulação de valor baseada em trajetória histórica e targets de eficiência.</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 text-slate-400">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
               <span>Histórico</span>
             </div>
             <div className="flex items-center gap-2 text-secondary">
               <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
               <span>Strategic Target</span>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card: EV Realizado */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Enterprise Value (Hist.)</span>
            <div className="flex flex-col mt-4">
              <span className="text-3xl font-display font-black text-slate-900">
                {(() => {
                  const hist = allYearIndicators.filter((i: any) => i.cat === 'Histórico' && i.ind === 'Valor de Mercado');
                  const avg = hist.length > 0 ? hist.reduce((acc: number, curr: any) => acc + curr.val, 0) / hist.length : 0;
                  return formatValue(avg, 'R$');
                })()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Média dos últimos 5 anos</span>
            </div>
            <div className="mt-8 h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-300 w-full"></div>
            </div>
          </div>

          {/* Card: EV Projetado */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform"><Sparkles size={80} className="text-secondary" /></div>
            <span className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] relative z-10">Strategic Valuation</span>
            <div className="flex flex-col mt-4 relative z-10">
              <span className="text-3xl font-display font-black text-white">
                {(() => {
                  const proj = allYearIndicators.filter((i: any) => i.cat === 'Projetado' && i.ind === 'Valor de Mercado');
                  const avg = proj.length > 0 ? proj.reduce((acc: number, curr: any) => acc + curr.val, 0) / proj.length : 0;
                  return formatValue(avg, 'R$');
                })()}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> +28% Potencial de Destravamento
              </span>
            </div>
            <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-secondary w-full"></div>
            </div>
          </div>

          {/* Card: Prêmios e Eficiência */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between hover:shadow-md transition-all group">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ROIC Alvo</span>
                <p className="text-xl font-display font-black text-slate-900 group-hover:text-secondary transition-colors">22.4%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                <Target size={24} />
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between hover:shadow-md transition-all group">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Multiplier</span>
                <p className="text-xl font-display font-black text-slate-900 group-hover:text-secondary transition-colors">1.8x</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="text-secondary" />
            Saúde Organizacional
          </h2>
          <div className="space-y-6">
            {[
              { label: 'IVE (Índice de Valor)', key: 'IVE', un: '%' },
              { label: 'Churn Rate', key: 'Churn Rate', un: '%' },
              { label: 'LTV / CAC', key: 'LTV/CAC', un: 'x' },
            ].map(k => {
              const r = getIndicator(k.key);
              return (
                <div key={k.key} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-secondary/20 transition-all">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{k.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{r ? formatValue(r.val, k.un) : '—'}</p>
                    {r && <Semaphore status={r.sem} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LayoutDashboard className="text-secondary" />
            Principais OKRs Estratégicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">EXPANSÃO COMERCIAL</span>
                <span className="text-xs font-bold text-slate-400">75%</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">Aumentar market share em 15% nos novos canais digitais</p>
              <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-3/4 rounded-full"></div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">EFICIÊNCIA</span>
                <span className="text-xs font-bold text-slate-400">50%</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">Reduzir CAC em 20% através de automação de pré-vendas</p>
              <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/2 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-12">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">Business Performance Registry</h2>
          <div className="h-px flex-1 bg-slate-100 mx-8"></div>
          <button className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">Ver Todos</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tableKpis.map(key => {
            const r = getIndicator(key);
            if (!r) return null;
            return (
              <div key={key} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-secondary/20 transition-all group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-1 h-10 rounded-full",
                    r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500"
                  )} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{r.cat}</p>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{r.ind}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-display font-black text-primary">{formatValue(r.val, r.un)}</p>
                  <div className="mt-1 flex justify-end gap-2 items-center">
                    <span className="text-[9px] font-bold text-slate-400">STATUS</span>
                    <StatusBadge status={r.sem} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
