import React, { useMemo } from 'react';
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
  Info
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
  const currentIndicators = useMemo(() => {
    return DATA.indicadores.filter(r => r.id === selectedClient && r.mes === selectedMonth && r.ano === selectedYear);
  }, [selectedClient, selectedMonth, selectedYear]);
  
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
    { label: 'Caixa e Equivalentes', key: 'Caixa e Equivalentes' },
    { label: 'Margem EBITDA', key: 'Margem EBITDA' },
    { label: 'Margem Líquida', key: 'Margem Líquida' },
  ];

  const evolData = useMemo(() => {
    const previousMonths = [
      selectedMonth - 2 <= 0 ? selectedMonth + 10 : selectedMonth - 2,
      selectedMonth - 1 <= 0 ? selectedMonth + 11 : selectedMonth - 1,
      selectedMonth
    ];
    
    return previousMonths.map(m => {
      const year = m > selectedMonth ? selectedYear - 1 : selectedYear;
      const monthIndicators = DATA.indicadores.filter(i => i.id === selectedClient && i.mes === m && i.ano === year);
      
      const fat = monthIndicators.find(i => i.ind === 'Faturamento Bruto');
      const rec = monthIndicators.find(i => i.ind === 'Receita Líquida');
      const ebitda = monthIndicators.find(i => i.ind === 'EBITDA');
      
      const monthLabel = MONTH_LABELS[m] || 'n/a';
      
      return {
        name: `${monthLabel}/${year.toString().slice(-2)}`,
        Faturamento: fat?.val || 0,
        Receita: rec?.val || 0,
        EBITDA: ebitda?.val || 0
      };
    });
  }, [selectedClient, selectedMonth, selectedYear]);

  const trendData = useMemo(() => {
    const previousMonths = [
      selectedMonth - 2 <= 0 ? selectedMonth + 10 : selectedMonth - 2,
      selectedMonth - 1 <= 0 ? selectedMonth + 11 : selectedMonth - 1,
      selectedMonth
    ];

    return previousMonths.map(m => {
      const year = m > selectedMonth ? selectedYear - 1 : selectedYear;
      const monthDre = DATA.dre.filter(i => i.id === selectedClient && i.ano === year && i.mes === m);
      
      const rec = monthDre.find(i => i.conta === 'Receita Líquida');
      const lucro = monthDre.find(i => i.conta === 'Lucro Líquido');
      
      const monthLabel = MONTH_LABELS[m] || 'n/a';

      return {
        name: `${monthLabel}/${year.toString().slice(-2)}`,
        Receita: rec?.valor || 0,
        Lucro: lucro?.valor || 0
      };
    });
  }, [selectedClient, selectedMonth, selectedYear]);

  const tableKpis = [
    'Liquidez Corrente',
    'Liquidez Seca',
    'Endividamento Geral',
    'Dívida Líquida / EBITDA',
    'ROE',
    'Fluxo de Caixa Operacional',
  ];

  if (currentIndicators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-200 rounded-3xl p-20 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
          <PieChartIcon size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Sem dados para este período</h3>
        <p className="text-slate-500 max-w-md mb-8">Não encontramos indicadores financeiros para o cliente {clients.find((c: any) => c.id === selectedClient)?.fantasia} no período selecionado.</p>
        
        <div className="flex gap-4">
          <select 
            value={selectedClient} 
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none"
          >
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.fantasia}</option>)}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs inline-flex items-center">
        <div className="flex items-center px-4 py-2 border-r border-slate-200">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-3">Cliente</label>
          <select 
            value={selectedClient} 
            onChange={(e) => setSelectedClient(e.target.value)}
            className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
          >
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.fantasia}</option>)}
          </select>
        </div>
        <div className="flex items-center px-4 py-2 border-r border-slate-200">
          <Calendar size={14} className="text-slate-400 mr-2" />
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
          >
            {[2024, 2025, 2026, 2027].map(y => (
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
                  <Semaphore status={r?.sem || 'Verde'} />
                </div>
              </p>
              <p className="text-2xl font-display text-primary tracking-tight group-hover:text-secondary transition-colors">{r ? formatValue(r.val, r.un) : '—'}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Monitoramento de Faturamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Faturamento Bruto', key: 'Faturamento Bruto', icon: BarChartIcon },
            { label: 'Ticket Médio', key: 'Ticket Médio', icon: Zap },
            { label: 'Prazo Médio (PMR)', key: 'PMR', icon: Clock },
            { label: 'Inadimplência', key: 'Inadimplência', icon: AlertTriangle }
          ].map(m => {
            const r = getIndicator(m.key);
            const Icon = m.icon;
            return (
              <div key={m.key} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 interactive-card group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                  <p className="text-lg font-display text-primary">{r ? formatValue(r.val, r.un) : '—'}</p>
                  {r && <div className="mt-1"><Semaphore status={r.sem} /></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Evolução de Resultados</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm interactive-card">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChartIcon size={14} className="text-secondary" /> Visão Consolidada (Mensal)
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
                  <Bar name="Fat. Bruto" dataKey="Faturamento" fill="#ff8552" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar name="Rec. Líquida" dataKey="Receita" fill="#0e1c2c" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar name="EBITDA" dataKey="EBITDA" fill="#bab86c" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Margens & Tendência</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm interactive-card">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> Lucratividade Mensal
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
                    dot={{ r: 5, fill: '#0e1c2c', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    name="Lucro Líquido"
                    type="monotone" 
                    dataKey="Lucro" 
                    stroke="#ff8552" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: '#ff8552', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
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
