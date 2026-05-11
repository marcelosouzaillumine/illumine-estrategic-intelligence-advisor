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
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs inline-flex items-center">
        <div className="flex items-center px-4 py-2 border-r border-slate-200">
          <Calendar size={14} className="text-slate-400 mr-2" />
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
          >
            {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center px-4 py-2">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
          >
            {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
              <option key={m} value={Number(m)}>{label}</option>
            ))}
          </select>
        </div>

        {/* YTD Toggle */}
        <div className="flex items-center gap-3 px-4 py-2 border-l border-slate-200">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest transition-colors",
            !isYTD ? "text-secondary" : "text-slate-400"
          )}>Mensal</span>
          <button 
            onClick={() => setIsYTD(!isYTD)}
            className={cn(
              "w-10 h-5 rounded-full p-1 transition-all duration-300 relative",
              isYTD ? "bg-secondary" : "bg-slate-200"
            )}
          >
            <motion.div 
              animate={{ x: isYTD ? 20 : 0 }}
              className="w-3 h-3 bg-white rounded-full shadow-sm"
            />
          </button>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest transition-colors",
            isYTD ? "text-secondary" : "text-slate-400"
          )}>
            {allYearIndicators.some((d: any) => d.ano === selectedYear && d.cat === 'Projetado') 
              ? `Projeção Anual (${selectedYear})` 
              : `Consolidado Anual (${selectedYear})`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map(m => {
          const r = getIndicator(m.key);
          return (
            <div key={m.key} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-b-4 border-b-secondary/20 transition-all hover:shadow-elegant group">
              <p className="text-[10px] font-black text-slate-400 font-sans uppercase tracking-[0.15em] mb-1 flex items-center justify-between">
                {m.label}
                <div className="flex items-center gap-2">
                  {(r as any)?.isReal && <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-sm">REAL</span>}
                  {(r as any)?.isAnnual && (
                    <span className={cn(
                      "text-[8px] text-white px-1.5 py-0.5 rounded-sm font-bold",
                      (r as any).isForecast ? "bg-amber-500" : "bg-indigo-500"
                    )}>
                      {(r as any).isForecast ? 'FORECAST' : 'ANUAL'}
                    </span>
                  )}
                  <Semaphore status={r?.sem || 'Verde'} />
                </div>
              </p>
              <p className="text-2xl font-display text-primary tracking-tight group-hover:text-secondary transition-colors">{r ? formatValue(r.val, r.un) : '—'}</p>
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
                  <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Bar name="Fat. Bruto" dataKey="Faturamento" radius={[6, 6, 0, 0]} barSize={20}>
                    {evolData.map((entry, index) => (
                      <Cell key={`cell-fat-${index}`} fill={entry.type === 'Real' ? "#ff8552" : "#ff855280"} />
                    ))}
                  </Bar>
                  <Bar name="Rec. Líquida" dataKey="Receita" radius={[6, 6, 0, 0]} barSize={20}>
                    {evolData.map((entry, index) => (
                      <Cell key={`cell-rec-${index}`} fill={entry.type === 'Real' ? "#0e1c2c" : "#0e1c2c80"} />
                    ))}
                  </Bar>
                  <Bar name="EBITDA" dataKey="EBITDA" radius={[6, 6, 0, 0]} barSize={20}>
                    {evolData.map((entry, index) => (
                      <Cell key={`cell-ebitda-${index}`} fill={entry.type === 'Real' ? "#bab86c" : "#bab86c80"} />
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
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-secondary" />
              Valuation & Atratividade (Visão 10 Anos)
            </h2>
            <p className="text-sm text-slate-500 mt-1">Comparativo entre valor histórico realizado e projeção estratégica de 5 anos</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-slate-300"></span>
               <span>Realizado (Últ. 5 anos)</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-secondary"></span>
               <span>Projetado (Próx. 5 anos)</span>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card: EV Realizado */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EV Médio (Realizado)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-700">
                {(() => {
                  const hist = allYearIndicators.filter((i: any) => i.cat === 'Histórico' && i.ind === 'Valor de Mercado');
                  const avg = hist.length > 0 ? hist.reduce((acc: number, curr: any) => acc + curr.val, 0) / hist.length : 0;
                  return formatValue(avg, 'R$');
                })()}
              </span>
            </div>
            <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-slate-400 w-full"></div>
            </div>
          </div>

          {/* Card: EV Projetado */}
          <div className="bg-secondary/5 rounded-2xl p-6 border border-secondary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={48} className="text-secondary" />
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">EV Estratégico (Projetado)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-secondary">
                {(() => {
                  const proj = allYearIndicators.filter((i: any) => i.cat === 'Projetado' && i.ind === 'Valor de Mercado');
                  const avg = proj.length > 0 ? proj.reduce((acc: number, curr: any) => acc + curr.val, 0) / proj.length : 0;
                  return formatValue(avg, 'R$');
                })()}
              </span>
            </div>
            <div className="mt-4 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
               <div className="h-full bg-secondary w-full animate-pulse-slow"></div>
            </div>
          </div>

          {/* Card: Prêmios e Eficiência */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ROIC Médio (Alvo)</span>
                <p className="text-lg font-bold text-slate-700">{(18.5 + Math.random() * 5).toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Target size={20} />
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dívida Líquida / EBITDA</span>
                <p className="text-lg font-bold text-slate-700">{(0.8 + Math.random()).toFixed(2)}x</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <ShieldCheck size={20} />
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

      <div className="space-y-4 pt-8">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Indicadores Chave de Gestão</h2>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-elegant overflow-hidden">
          <div className="divide-y divide-slate-100">
            {tableKpis.map(key => {
              const r = getIndicator(key);
              if (!r) return null;
              return (
                <div key={key} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-secondary transition-colors">{r.ind}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.cat}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display text-primary">{formatValue(r.val, r.un)}</p>
                    <div className="mt-1 flex justify-end">
                      <StatusBadge status={r.sem} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
