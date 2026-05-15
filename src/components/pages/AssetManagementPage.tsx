
import React, { useState, useEffect, useMemo } from 'react';
import { 
  WalletCards, 
  TrendingUp, 
  Sparkles, 
  PieChart as PieChartIcon, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Activity,
  Briefcase,
  ShieldCheck,
  Target,
  Download,
  Trash2,
  Coins,
  Percent,
  TrendingDown,
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
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
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';
import { FULL_MONTH_LABELS } from '../../constants';

// --- Data Arrays ---
const PERFORMANCE_HISTORY: any[] = [];
const ALLOCATION_DATA: any[] = [];
const ASSETS: any[] = [];

// --- Components ---

function Semaphore({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    'Bullish': 'bg-emerald-500',
    'Stable': 'bg-blue-500',
    'Correction': 'bg-amber-500',
    'Bearish': 'bg-rose-500',
    'Volatile': 'bg-purple-500'
  };
  return <div className={cn("w-2 h-2 rounded-full", colorMap[status] || 'bg-slate-500')} />;
}

export function AssetManagementPage({ clientId, selectedYear, selectedMonth }: any) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(selectedYear || 2026);
  const [month, setMonth] = useState(selectedMonth || 5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'assets'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssets(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  useEffect(() => {
    if (selectedYear) setYear(selectedYear);
    if (selectedMonth) setMonth(selectedMonth);
  }, [selectedYear, selectedMonth]);

  const totalValue = assets.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const totalProfit = assets.reduce((acc, curr) => acc + (curr.profit || 0), 0);
  const avgChange = totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0;

  const filteredAssets = assets.filter(asset => 
    (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (asset.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulated Performance History based on current assets
  const performanceHistory = useMemo(() => {
    const history = [];
    const baseValue = totalValue * 0.8;
    for (let i = 0; i < 6; i++) {
      history.push({
        month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][i],
        value: baseValue + (totalValue - baseValue) * (i / 5) * (0.9 + Math.random() * 0.2)
      });
    }
    return history;
  }, [totalValue]);

  // Allocation Data
  const allocationData = useMemo(() => {
    const categories: Record<string, number> = {};
    const colors: Record<string, string> = {
      'Renda Fixa': '#3b82f6',
      'Ações': '#f59e0b',
      'Tesouro': '#10b981',
      'Internacional': '#8b5cf6',
      'Outros': '#94a3b8'
    };

    assets.forEach(a => {
      categories[a.category] = (categories[a.category] || 0) + a.value;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || colors['Outros']
    }));
  }, [assets]);

  const metrics = [
    { label: 'Patrimônio Total', value: formatCurrency(totalValue), icon: WalletCards, sub: 'Valor de Mercado' },
    { label: 'Rentabilidade (Mtd)', value: `${avgChange.toFixed(2)}%`, icon: TrendingUp, sub: formatCurrency(totalProfit), trend: avgChange >= 0 ? 'up' : 'down' },
    { label: 'Yield Real (Est.)', value: `${(avgChange > 0 ? avgChange * 0.9 : 0).toFixed(2)}%`, icon: Coins, sub: 'Descontada Inflação (Est.)', trend: avgChange >= 0 ? 'up' : 'down' },
    { label: 'Ativos Monitorados', value: assets.length, icon: Activity, sub: 'Diversificação de Carteira' },
  ];

  const taxSimulation = {
    grossProfit: totalProfit,
    iof: totalProfit * 0.05, // Simulated IOF for early withdrawal
    irf: (totalProfit * 0.95) * 0.15, // 15% IRF on net of IOF
    netProfit: totalProfit * 0.95 * 0.85
  };

  const benchmarks = [
    { name: 'CDI', value: 0.88, color: 'text-blue-500' },
    { name: 'IPCA', value: 0.45, color: 'text-rose-500' },
    { name: 'Poupança', value: 0.50, color: 'text-amber-500' },
    { name: 'Ibovespa', value: 1.20, color: 'text-emerald-500' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-secondary mb-4" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando carteira de ativos...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-executive-fade">
         <div className="w-32 h-32 rounded-[48px] bg-slate-900 flex items-center justify-center text-secondary shadow-2xl relative">
            <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 animate-pulse" />
            <Briefcase size={64} className="relative z-10" />
         </div>
         <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Gestão de Ativos Indisponível</h2>
            <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
              Não foram encontrados ativos financeiros registrados para este cliente no período selecionado. Importe seus ativos ou adicione-os manualmente para iniciar o monitoramento.
            </p>
         </div>
         <div className="flex gap-4">
            <button className="px-8 py-4 bg-secondary text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:scale-105 transition-all">
              <Plus size={16} className="inline mr-2" /> Adicionar Primeiro Ativo
            </button>
            <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">
              <Download size={16} className="inline mr-2" /> Importar Dados
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      {/* Strategic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Briefcase size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Gestão de Ativos Financeiros</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Monitoramento de portfólio, alocação estratégica e análise de performance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <div className="flex items-center px-4 py-2 border-r border-white/10">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                <option value={2026} className="bg-slate-900">2026</option>
                <option value={2025} className="bg-slate-900">2025</option>
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-secondary hover:border-secondary/20 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
            <Download size={16} />
            Importar Ativos
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
            <Trash2 size={16} />
            Excluir Seleção
          </button>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-slate-900 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-secondary/20">
          <Plus size={16} />
          Adicionar Ativo Manualmente
        </button>
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
            <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3">Insight da Carteira</h3>
            <p className="executive-note">
              "Sua carteira apresentou uma performance de {(avgChange).toFixed(2)}% no mês atual. {avgChange > 0 ? 'O desempenho positivo reflete a alocação estratégica nos ativos selecionados.' : 'A performance reflete as variações de mercado no período.'} Recomendamos revisar periodicamente o rebalanceamento tático para manter o perfil de risco alinhado aos objetivos de longo prazo."
            </p>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Benchmark de Referência</h3>
              <p className="text-3xl font-display font-black mb-2">CDI + Alpha</p>
              <div className="flex items-center gap-2 text-emerald-400">
                 <Target size={16} />
                 <span className="text-xs font-bold">{avgChange > 0.8 ? 'Performance Superior' : 'Acompanhando Mercado'}</span>
              </div>
            </div>
          <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Relatório de Performance
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-elegant group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{m.label}</p>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                  <m.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-display font-black tracking-tight text-primary group-hover:text-secondary transition-colors">
                {m.value}
              </p>
              <div className="mt-4 flex items-center gap-2">
                {m.trend && (
                   m.trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />
                )}
                <span className="text-[10px] font-bold text-slate-400 italic">
                  {m.sub}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Evolution */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Evolução do Patrimônio</h2>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(val) => `R$ ${(val/1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }} 
                    formatter={(val: number) => [formatCurrency(val), 'Valor Total']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Alocação por Classe</h2>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ALLOCATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '16px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full">
               {allocationData.map((item) => (
                 <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate">{item.name}</span>
                    <span className="text-[9px] font-black text-slate-900 ml-auto">{(item.value / totalValue * 100).toFixed(0)}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analysis & Simulation */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Análise Comparativa & Benchmarks</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
              <Info size={12} className="text-secondary" />
              Dados mensais atualizados
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <BarChart3 size={120} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {benchmarks.map((b) => (
                <div key={b.name} className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.name}</p>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-2xl font-display font-black ${b.color}`}>{b.value.toFixed(2)}%</p>
                    <span className="text-[10px] font-bold text-slate-400">/mês</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${b.value * 50}%` }}
                      className={cn("h-full", b.color.replace('text-', 'bg-'))}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">
                    {avgChange > b.value ? 'Alpha Positivo' : 'Abaixo do Benchmark'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mb-32 -mr-32"></div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Plus size={14} className="text-secondary" /> Simulação de Outras Aplicações
            </h3>
            <div className="space-y-6">
              {[
                { name: 'CDB 110% CDI', yield: 0.96, risk: 'Baixo', tax: 'IR Regressivo' },
                { name: 'LCI/LCA (Isento)', yield: 0.85, risk: 'Baixo', tax: 'Isento' },
                { name: 'Fundo Ações (Long Bias)', yield: 1.45, risk: 'Alto', tax: '15% fixo' }
              ].map((sim, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-secondary transition-colors">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">{sim.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Risco: {sim.risk} • Tributação: {sim.tax}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display font-black text-secondary">{sim.yield}% <span className="text-[10px] text-slate-400 uppercase">Est.</span></p>
                    <p className="text-[9px] text-emerald-400 font-bold">+{ (sim.yield - avgChange).toFixed(2) }% vs Atual</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tax Simulation Block */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Simulador Tributário (IRF/IOF)</h2>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 h-full">
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lucro Bruto</span>
                <span className="text-sm font-black text-primary">{formatCurrency(taxSimulation.grossProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-rose-500">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingDown size={12} /> IOF (30 dias)
                </span>
                <span className="text-sm font-black">-{formatCurrency(taxSimulation.iof)}</span>
              </div>
              <div className="flex justify-between items-center text-rose-500">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Percent size={12} /> IRF (15%)
                </span>
                <span className="text-sm font-black">-{formatCurrency(taxSimulation.irf)}</span>
              </div>
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex justify-between items-center text-emerald-500">
                <span className="text-[11px] font-black uppercase tracking-widest">Lucro Líquido</span>
                <span className="text-lg font-display font-black">{formatCurrency(taxSimulation.netProfit)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regras de Tributação</h4>
              <div className="space-y-3">
                {[
                  { label: 'IOF Regressivo', desc: '96% no dia 1 até 0% no dia 30' },
                  { label: 'IRF Renda Fixa', desc: '22,5% (<180d) até 15% (>720d)' },
                  { label: 'IRF Ações', desc: '15% sobre o lucro na venda' }
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{rule.label}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <Activity size={14} className="text-secondary" />
              Simular Resgate Antecipado
            </button>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Detalhamento da Carteira</h2>
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Buscar ativos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-secondary/30 transition-all w-64"
                />
             </div>
             <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-secondary hover:border-secondary/20 transition-all">
                <Filter size={16} />
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Classe</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Atual</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rent. (Mês)</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Lucro/Prejuízo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-primary group-hover:text-secondary transition-colors">{asset.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">Custódia Principal</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-xs font-black text-primary">{formatCurrency(asset.value)}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {asset.change >= 0 ? <ArrowUpRight size={12} className="text-emerald-500" /> : <ArrowDownRight size={12} className="text-rose-500" />}
                        <span className={cn("text-xs font-black", asset.change >= 0 ? "text-emerald-500" : "text-rose-500")}>
                          {Math.abs(asset.change)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <span className={cn("text-xs font-bold", asset.profit >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {asset.profit >= 0 ? '+' : ''}{formatCurrency(asset.profit)}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Semaphore status={asset.status} />
                        <span className="text-[10px] font-bold text-slate-500">{asset.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-secondary transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
