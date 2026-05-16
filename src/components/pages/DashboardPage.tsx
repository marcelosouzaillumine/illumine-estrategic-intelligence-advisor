import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Target, 
  LayoutDashboard,
  Users,
  Globe,
  ShoppingBag,
  Lightbulb,
  Loader2,
  Sparkles,
  ArrowRight,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  XAxis,
  YAxis,
  AreaChart,
  Area
} from 'recharts';
import { PageHeader, Semaphore } from '../Common';
import { formatCurrency, formatValue, cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { FULL_MONTH_LABELS, MONTH_LABELS } from '../../constants';

const AXIS_DATA = [
  { 
    id: 'governanca_estrategica', 
    name: 'Governança Corporativa', 
    icon: ShieldCheck, 
    color: 'bg-slate-900', 
    mainKpi: 'Maturidade de Governança',
    suffix: '%' 
  },
  { 
    id: 'dashboard_cultura', 
    name: 'Cultura Organizacional', 
    icon: Users, 
    color: 'bg-purple-900', 
    mainKpi: 'eNPS',
    suffix: '' 
  },
  { 
    id: 'dashboard_gestao', 
    name: 'Administração e Finanças', 
    icon: BarChartIcon, 
    color: 'bg-slate-800', 
    mainKpi: 'Margem EBITDA',
    suffix: '%' 
  },
  { 
    id: 'dashboard_inovacao', 
    name: 'Gestão de Inovação', 
    icon: Lightbulb, 
    color: 'bg-cyan-900', 
    mainKpi: 'Índice de Inovação',
    suffix: '%' 
  },
  { 
    id: 'dashboard_marketing', 
    name: 'Gestão de Marketing', 
    icon: Globe, 
    color: 'bg-blue-900', 
    mainKpi: 'ROI de Marketing',
    suffix: 'x' 
  },
  { 
    id: 'dashboard_comercial', 
    name: 'Gestão Comercial', 
    icon: ShoppingBag, 
    color: 'bg-emerald-900', 
    mainKpi: 'Taxa de Conversão',
    suffix: '%' 
  },
  { 
    id: 'dashboard_operacional', 
    name: 'Gestão Operacional', 
    icon: Activity, 
    color: 'bg-slate-700', 
    mainKpi: 'OEE (Eficiência)',
    suffix: '%' 
  },
];

const AxisCard = ({ axis, value, status, onClick }: any) => {
  const Icon = axis.icon;
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-elegant transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity rounded-full -mr-12 -mt-12", axis.color)} />
      
      <div className="flex items-center justify-between mb-6">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", axis.color)}>
          <Icon size={22} strokeWidth={2} />
        </div>
        <Semaphore status={status || 'Verde'} />
      </div>

      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{axis.name}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-display font-black text-slate-900 group-hover:text-secondary transition-colors">
            {formatValue(value, axis.suffix)}
          </p>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{axis.mainKpi}</p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
        <span className="text-[9px] font-black text-secondary uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Ver Dashboard <ChevronRight size={10} />
        </span>
      </div>
    </motion.div>
  );
};

export function DashboardPage({ 
  selectedClient, 
  selectedMonth, 
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onNavigate
}: any) {
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [allYearIndicators, setAllYearIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { kpis: calculatedKPIs } = useRealIndicatorData(selectedClient, selectedMonth, selectedYear);

  useEffect(() => {
    if (!selectedClient) return;

    setLoading(true);
    const qAll = query(
      collection(db, 'indicators'),
      where('clientId', '==', selectedClient)
    );

    const unsubAll = onSnapshot(qAll, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllYearIndicators(allData);
      
      const current = allData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
      setDbIndicators(current);
      setLoading(false);
    });

    return () => unsubAll();
  }, [selectedClient, selectedYear, selectedMonth]);

  const getIndicatorValue = useCallback((name: string) => {
    const ind = dbIndicators.find((i: any) => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    if (ind) return ind.val;

    return 0;
  }, [dbIndicators, calculatedKPIs]);

  const getIndicatorStatus = useCallback((name: string) => {
    const ind = dbIndicators.find((i: any) => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind?.sem || null;
  }, [dbIndicators]);

  const evolData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(selectedYear, selectedMonth - 1 - (11 - i), 1);
      return { m: d.getMonth() + 1, y: d.getFullYear() };
    });
    
    return months.map(({ m, y }) => {
      const monthIndicators = allYearIndicators.filter((i: any) => i.mes === m && i.ano === y);
      const rec = monthIndicators.find((i: any) => i.ind === 'Receita Líquida')?.val || 0;
      const ebitda = monthIndicators.find((i: any) => i.ind === 'EBITDA')?.val || 0;
      
      return {
        name: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}`,
        Receita: rec,
        EBITDA: ebitda,
      };
    });
  }, [allYearIndicators, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-3xl p-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="text-secondary animate-spin" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Sincronizando Inteligência</h3>
        <p className="text-slate-500 max-w-md">Consolidando visão estratégica dos 7 eixos de gestão...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Monitoramento Estratégico de Performance"
        subtitle="Visão centralizada dos 7 eixos fundamentais para a perenidade e valor de mercado."
        icon={LayoutDashboard}
        color="bg-slate-900"
      />

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-slate-100">
              <Calendar size={14} className="text-secondary mr-2.5" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Monitoramento Ativo</span>
           </div>
        </div>
      </div>

      {/* Strategic Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Receita Líquida', value: getIndicatorValue('Receita Líquida'), isCur: true, icon: TrendingUp },
          { label: 'EBITDA', value: getIndicatorValue('EBITDA'), isCur: true, icon: Zap },
          { label: 'Lucro Líquido', value: getIndicatorValue('Lucro Líquido'), isCur: true, icon: PieChartIcon },
          { label: 'Valor Estimado', value: (getIndicatorValue('EBITDA') * 12 * 6.5), isCur: true, icon: Target, highlight: true },
        ].map((item, idx) => (
          <div key={idx} className={cn(
            "p-8 rounded-[32px] border transition-all relative overflow-hidden group shadow-sm",
            item.highlight ? "bg-slate-900 text-white border-none" : "bg-white border-slate-100"
          )}>
            <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform", item.highlight ? "text-secondary" : "text-slate-200")}>
              <item.icon size={60} />
            </div>
            <div className="relative z-10">
              <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-4", item.highlight ? "text-slate-400" : "text-slate-400")}>{item.label}</p>
              <p className="text-2xl font-display font-black tracking-tight">{formatValue(item.value, item.isCur ? 'R$' : '')}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase", item.highlight ? "bg-secondary/20 text-secondary" : "bg-emerald-500/10 text-emerald-500")}>Realizado</div>
                <span className="text-[9px] font-bold text-slate-400">STATUS: VERDE</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The 7 Axes Hub */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="text-secondary" size={28} />
            Hub de Monitoramento dos 7 Eixos
          </h2>
          <div className="h-px flex-1 bg-slate-100 mx-8 hidden lg:block"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visão Sistêmica de Gestão</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {AXIS_DATA.map((axis) => (
            <AxisCard 
              key={axis.id} 
              axis={axis} 
              value={getIndicatorValue(axis.mainKpi)} 
              status={getIndicatorStatus(axis.mainKpi)}
              onClick={() => onNavigate(axis.id)}
            />
          ))}
        </div>
      </div>

      {/* Mid Section: Charts and AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Evolução de Performance Consolidada</h3>
                <p className="text-xs text-slate-500 font-medium">Histórico de Receita e EBITDA dos últimos 12 meses.</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                  <span>Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                  <span>EBITDA</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolData}>
                  <defs>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0e1c2c" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0e1c2c" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8552" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ff8552" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="Receita" stroke="#0e1c2c" strokeWidth={4} fillOpacity={1} fill="url(#colorRec)" />
                  <Area type="monotone" dataKey="EBITDA" stroke="#ff8552" strokeWidth={4} fillOpacity={1} fill="url(#colorEbitda)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden h-full flex flex-col group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
              <Sparkles size={100} className="text-secondary" />
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Zap size={20} fill="currentColor" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-secondary">Executive AI Parecer</h3>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-2xl font-display font-black leading-tight">
                  {dbIndicators.length > 0 ? "Análise de Inteligência Estratégica ativada." : "Aguardando consolidação de dados para análise."}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  {dbIndicators.length > 0 
                    ? "Os indicadores reais processados indicam a necessidade de alinhamento entre os eixos de performance e cultura."
                    : "Importe os dados históricos ou financeiros para que a IA possa gerar o parecer executivo sobre a perenidade do negócio."}
                </p>
                
                {dbIndicators.length > 0 && (
                  <div className="pt-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Monitoramento Real em Tempo Real</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => onNavigate('advisory_insights')}
              className="mt-10 w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              Consultar Advisory Hub <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Insights Section */}
      <div className="bg-white border border-slate-100 rounded-[40px] p-12 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Direcionamento Estratégico</h3>
            <p className="text-sm text-slate-500 mt-1">Status atual das diretrizes institucionais nos eixos de governança.</p>
          </div>
          <button 
            onClick={() => onNavigate('relatorio_executivo')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
          >
            Gerar Relatório Executivo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {dbIndicators.length > 0 ? (
            AXIS_DATA.slice(0, 3).map((axis, idx) => {
              const val = getIndicatorValue(axis.mainKpi);
              const status = getIndicatorStatus(axis.mainKpi);
              return (
                <div key={idx} className="flex gap-5 group">
                  <div className="shrink-0 pt-1">
                    <Semaphore status={status} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{axis.name}</h4>
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      {val > 0 ? `Indicador ${axis.mainKpi} operando em ${formatValue(val, axis.suffix)}.` : `Aguardando registro de ${axis.mainKpi}.`}
                    </p>
                    <button onClick={() => onNavigate(axis.id)} className="text-[9px] font-black text-secondary uppercase tracking-widest pt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalhes</button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 py-10 text-center">
              <p className="text-sm text-slate-400 font-medium italic">Nenhum direcionamento estratégico disponível para o período selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
