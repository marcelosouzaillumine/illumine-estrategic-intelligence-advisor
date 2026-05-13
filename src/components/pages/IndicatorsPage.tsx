import React, { useState, useEffect, useMemo } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  DollarSign, 
  Waves, 
  Activity, 
  Wallet, 
  Building, 
  Target, 
  ShieldAlert, 
  Zap, 
  ArrowUpRight, 
  Rocket,
  LayoutGrid,
  List,
  ShieldCheck,
  Users,
  ChevronRight,
  Info,
  Calendar,
  Lightbulb,
  Globe,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { DATA } from '../../data';
import { formatValue, cn, formatCurrency } from '../../lib/utils';
import { SectionHeader, StatusBadge, PageHeader } from '../Common';
import { FULL_MONTH_LABELS, EIXOS_ORDEM } from '../../constants';

const GROUP_MAPPING: Record<string, string> = {
  // Por Categoria (Fallback)
  'Performance': 'Administração e Finanças',
  'Operacional': 'Gestão Operacional',
  'Lucratividade': 'Administração e Finanças',
  'Liquidez': 'Administração e Finanças',
  'Atividade': 'Gestão Operacional',
  'Eficiência': 'Gestão Operacional',
  'Caixa': 'Administração e Finanças',
  'Financeiro': 'Administração e Finanças',
  'Patrimonial': 'Administração e Finanças',
  'Risco': 'Governança Corporativa',
  'Estratégico': 'Governança Corporativa',
  'Crescimento': 'Gestão Comercial',
  'Venture': 'Gestão de Inovação',
  'Compliance': 'Governança Corporativa',
  'Governança': 'Governança Corporativa',
  'Pessoas': 'Cultura Organizacional',
  'RH': 'Cultura Organizacional',
  'Marketing': 'Gestão de Marketing',
  'Vendas': 'Gestão Comercial',
  
  // Governança Corporativa
  'Indice de Alinhamento': 'Governança Corporativa',
  'Índice de Alinhamento': 'Governança Corporativa',
  'Heath Score': 'Governança Corporativa',
  'Health Score': 'Governança Corporativa',
  'IVE': 'Governança Corporativa',
  'OKRs': 'Governança Corporativa',
  'OKR': 'Governança Corporativa',
  'Valor de Mercado': 'Governança Corporativa',
  'Valor de mercado': 'Governança Corporativa',
  'Múltiplo': 'Governança Corporativa',
  'Multiplo': 'Governança Corporativa',
  'Múltiplo de EBITDA': 'Governança Corporativa',
  'Múltiplo EBITDA': 'Governança Corporativa',
  'Indice de Alavancagem': 'Governança Corporativa',
  'Índice de Alavancagem': 'Governança Corporativa',
  'Aderencia Orçamentaria': 'Governança Corporativa',
  'Aderência Orçamentária': 'Governança Corporativa',
  
  // Cultura Organizacional
  'ENPS': 'Cultura Organizacional',
  'eNPS': 'Cultura Organizacional',
  'Turnover': 'Cultura Organizacional',
  'Taxa de Retencão': 'Cultura Organizacional',
  'Taxa de Retenção': 'Cultura Organizacional',
  'Indice de Clima Organizacional': 'Cultura Organizacional',
  'Índice de Clima Organizacional': 'Cultura Organizacional',
  'Clima Organizacional': 'Cultura Organizacional',
  
  // Administração e Finanças
  'EBITDA': 'Administração e Finanças',
  'Margem EBITDA': 'Administração e Finanças',
  'Saldo Em Caixa': 'Administração e Finanças',
  'Saldo em Caixa': 'Administração e Finanças',
  'Fluxo de Caixa Operacional': 'Administração e Finanças',
  'Lucro Líquido': 'Administração e Finanças',
  'Liquidez Corrente': 'Administração e Finanças',
  'Inadimplencia': 'Administração e Finanças',
  'Inadimplência': 'Administração e Finanças',
  'Faturamento Bruto': 'Administração e Finanças',
  'Receita Líquida': 'Administração e Finanças',
  'Receita liquida': 'Administração e Finanças',
  'PMR': 'Administração e Finanças',
  'Margem Líquida': 'Administração e Finanças',
  'WACC': 'Administração e Finanças',
  
  // Gestão de Inovação
  'Projetos Ativos': 'Gestão de Inovação',
  'Investimento em PAD': 'Gestão de Inovação',
  'Investimento em P&D': 'Gestão de Inovação',
  
  // Gestão de Marketing
  'Roi de Marketing': 'Gestão de Marketing',
  'ROI de Marketing': 'Gestão de Marketing',
  'LTV/CAC': 'Gestão de Marketing',
  
  // Gestão Comercial
  'Churn Rate': 'Gestão Comercial',
  'Churn': 'Gestão Comercial',
  'Ticket Médio': 'Gestão Comercial',
  'Ticket Medio': 'Gestão Comercial',
  'Taxa de Conversão': 'Gestão Comercial',
  'Taxa de Conversao': 'Gestão Comercial',
  'NPS': 'Gestão Comercial',
  
  // Gestão Operacional
  'OEE': 'Gestão Operacional',
  'Lead Time': 'Gestão Operacional',
  'Indice de Qualidade': 'Gestão Operacional',
  'Índice de Qualidade': 'Gestão Operacional',
  'Atrasos': 'Gestão Operacional'
};

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string; text: string }> = {
  'Governança Corporativa': { icon: ShieldCheck, color: 'slate', bg: 'bg-slate-50 dark:bg-slate-900', border: 'border-slate-100 dark:border-slate-800', text: 'text-slate-600 dark:text-slate-400' },
  'Cultura Organizacional': { icon: Users, color: 'purple', bg: 'bg-purple-50 dark:bg-purple-900', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' },
  'Gestão de Inovação': { icon: Lightbulb, color: 'cyan', bg: 'bg-cyan-50 dark:bg-cyan-900', border: 'border-cyan-100 dark:border-cyan-800', text: 'text-cyan-600 dark:text-cyan-400' },
  'Gestão Comercial': { icon: ShoppingBag, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-900', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400' },
  'Gestão Operacional': { icon: Activity, color: 'amber', bg: 'bg-amber-50 dark:bg-amber-900', border: 'border-amber-100 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400' },
  'Administração e Finanças': { icon: BarChart3, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-900', border: 'border-indigo-100 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400' },
  'Gestão de Marketing': { icon: Globe, color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
};

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

function KPICard({ r, group, valueClassName }: any) {
  const config = CATEGORY_CONFIG[group] || CATEGORY_CONFIG['Administração e Finanças'];
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-6 md:p-10 h-full flex flex-col gap-8 md:gap-10 group bg-white border border-slate-100 rounded-[32px] md:rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
    >
      {/* Decorative framing element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none group-hover:bg-slate-100/50 transition-colors" />

      <div className="flex items-start justify-between gap-4 md:gap-6 relative z-10">
        <div className="space-y-1.5 min-w-0 flex-1">
          <h4 className="text-[clamp(1rem,1.3vw,1.5rem)] font-display font-black text-slate-900 leading-tight group-hover:text-secondary transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
            {r.ind}
          </h4>
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm shrink-0", r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500")} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis">{group}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col mt-auto relative z-10">
        {/* Value framing */}
        <div className="bg-slate-50/50 rounded-2xl md:rounded-[32px] p-4 md:p-6 mb-6 md:mb-8 group-hover:bg-white group-hover:shadow-inner transition-all border border-slate-100/50 overflow-hidden">
          <div className="flex items-baseline gap-2 md:gap-3 whitespace-nowrap">
            <span className={cn(
              "font-display text-slate-900 font-black tabular-nums tracking-tighter",
              valueClassName || "text-[clamp(1.5rem,2.5vw,2.25rem)]"
            )}>
              {formatValue(r.val, r.un)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest gap-4">
              <span className="text-slate-400">Eficiência</span>
              <span className={cn(
                "shrink-0",
                r.sem === 'Verde' ? "text-emerald-600" : r.sem === 'Amarelo' ? "text-amber-600" : "text-rose-600"
              )}>
                {r.sem === 'Verde' ? 'Meta Superada' : r.sem === 'Amarelo' ? 'Atenção' : 'Alerta'}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 overflow-hidden rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: r.sem === 'Verde' ? '100%' : r.sem === 'Amarelo' ? '65%' : '35%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className={cn(
                  "h-full transition-all shadow-sm",
                  r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500"
                )}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Calendar size={14} className="text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Competência: {r.comp}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ label, value, icon: Icon, colorClass, trend, valueClassName }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
      {/* Subtle Background pattern */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:scale-125 transition-transform" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="w-16 h-16 rounded-[22px] bg-slate-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg">
          <Icon size={28} />
        </div>
        {trend && (
            <div className={cn(
                "px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] border rounded-full backdrop-blur-sm",
                trend.startsWith('-') ? "text-rose-600 border-rose-100 bg-rose-50/50" : "text-emerald-600 border-emerald-100 bg-emerald-50/50"
            )}>
              {trend}
            </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 line-clamp-1">{label}</p>
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          <p className={cn(
            "font-display font-black text-slate-900 tabular-nums tracking-tighter",
            valueClassName || "text-[clamp(1.5rem,2.5vw,2.25rem)]"
          )}>
              {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function useIndicators(clientId: string, year: number, month: number) {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId) {
      setIndicators(DATA.indicadores.filter(i => i.ano === year && i.mes === month));
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', year),
      where('mes', '==', month)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      
      if (dbDocs.length > 0) {
        setIndicators(dbDocs.map(doc => ({
          ...doc,
          cl: doc.clientId,
          comp: `${String(doc.mes).padStart(2, '0')}/${doc.ano}`,
          cat: doc.cat || 'Operacional',
          sem: doc.sem || 'Ativo',
          un: doc.un || ''
        })));
      } else {
        setIndicators(DATA.indicadores.filter(i => i.id === clientId && i.ano === year && i.mes === month));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching indicators:", error);
      setIndicators(DATA.indicadores.filter(i => i.id === clientId && i.ano === year && i.mes === month));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId, year, month]);

  return { indicators, loading };
}

export function IndicatorsPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
  }, [selectedYear, selectedMonth]);

  const { indicators, loading } = useIndicators(selectedClient, filterYear, filterMonth);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
  }, []);

  const { grouped, summary, groups, globalSizeClass } = useMemo(() => {
    const listWithGroups = indicators.map(i => {
        const indName = (i.ind === 'Múltiplo' || i.ind === 'Multiplo') ? 'Múltiplo de EBITDA' : i.ind;
        return {
            ...i,
            ind: indName,
            analysisGroup: GROUP_MAPPING[indName] || GROUP_MAPPING[i.cat] || 'Outros'
        };
    });

    let filteredList = listWithGroups;
    if (filterGroup) filteredList = filteredList.filter(f => f.analysisGroup === filterGroup);
    
    const availableGroups = Array.from(new Set(listWithGroups.map(i => i.analysisGroup)))
      .sort((a: string, b: string) => {
        const indexA = EIXOS_ORDEM.indexOf(a);
        const indexB = EIXOS_ORDEM.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
      });
    
    const groupsMap: Record<string, any[]> = {};
    availableGroups.forEach((g: string) => {
      groupsMap[g] = filteredList.filter(i => i.analysisGroup === g);
    });

    const getVal = (label: string) => {
        const found = indicators.find(i => i.ind.toLowerCase().includes(label.toLowerCase()));
        return found ? formatValue(found.val, found.un) : '---';
    };

    const stats = [
        { label: 'Faturamento', value: getVal('Faturamento Bruto'), icon: BarChart3, colorClass: 'text-secondary', trend: '12.4%' },
        { label: 'EBITDA', value: getVal('EBITDA'), icon: Zap, colorClass: 'text-secondary', trend: '8.2%' },
        { label: 'Lucro Líquido', value: getVal('Lucro Líquido'), icon: TrendingUp, colorClass: 'text-secondary', trend: '15.1%' },
        { label: 'Ciclo Financeiro', value: getVal('Ciclo Financeiro'), icon: Activity, colorClass: 'text-secondary', trend: '-2 dias' }
    ];

    const globalMaxLen = Math.max(
      ...indicators.map(i => formatValue(i.val, i.un).length),
      ...stats.map(s => String(s.value).length)
    );
    const globalSizeClass = getValueSizeClass(globalMaxLen);

    return { grouped: groupsMap, summary: stats, groups: availableGroups, globalSizeClass };
  }, [indicators, filterGroup]);

  const currentClient = clients.find((c: any) => c.id === selectedClient);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-3xl p-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="text-secondary animate-spin" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Sincronizando Análise</h3>
        <p className="text-slate-500 max-w-md">Consolidando indicadores vitais e eixos estratégicos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Análise de KPIs"
        subtitle="Monitoramento avançado de performance e eixos estratégicos em tempo real."
        icon={TrendingUp}
        actions={
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2.5 px-4 rounded-xl transition-all flex items-center gap-2", viewMode === 'grid' ? "bg-secondary text-white shadow-lg" : "text-slate-400 hover:text-white")}
            >
              <LayoutGrid size={16} strokeWidth={2} />
              {viewMode === 'grid' && <span className="text-[10px] font-black uppercase tracking-widest">Grade</span>}
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn("p-2.5 px-4 rounded-xl transition-all flex items-center gap-2", viewMode === 'table' ? "bg-secondary text-white shadow-lg" : "text-slate-400 hover:text-white")}
            >
              <List size={16} strokeWidth={2} />
              {viewMode === 'table' && <span className="text-[10px] font-black uppercase tracking-widest">Lista</span>}
            </button>
          </div>
        }
      />

      {/* Corporate Health Mini-Header */}
      <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Score de Saúde Consolidado</h3>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-display font-black text-slate-900 tracking-tighter">94.2</span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">Otimizado</span>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-lg w-full relative z-10">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
            <span>Eficiência Estratégica</span>
            <span className="text-emerald-600">94.2%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '94.2%' }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            />
          </div>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {summary.map((stat, idx) => (
          <SummaryCard key={idx} {...stat} valueClassName={globalSizeClass} />
        ))}
      </div>

      {/* Axis & Date Filters */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-4">
        <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm w-full md:w-auto">
          <div className="flex items-center px-4 py-2 border-r border-slate-100">
            <Calendar size={14} className="text-secondary mr-2.5" />
            <select 
              value={filterYear} 
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center px-4 py-2">
            <select 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
            >
              {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                <option key={m} value={Number(m)}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar flex-1">
          <button
            onClick={() => setFilterGroup('')}
            className={cn(
              "px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border shadow-sm",
              filterGroup === '' 
                ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105" 
                : "bg-white text-slate-400 border-slate-100 hover:border-secondary/30 hover:text-slate-600"
            )}
          >
            Todos os Eixos
          </button>
          {groups.map((g: string) => (
            <button
              key={g}
              onClick={() => setFilterGroup(g)}
              className={cn(
                "px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border shadow-sm",
                filterGroup === g 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105" 
                  : "bg-white text-slate-400 border-slate-100 hover:border-secondary/30 hover:text-slate-600"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {(Object.entries(grouped) as [string, any[]][]).map(([group, items], groupIdx) => {
                const config = CATEGORY_CONFIG[group] || CATEGORY_CONFIG['Administração e Finanças'];
                
                return (
                  <div key={group} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl border", config.bg, config.border)}>
                        {(() => {
                          const Icon = config.icon;
                          return <Icon size={20} className={config.text} />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-black text-slate-900">{group}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{items.length} indicadores monitorados</p>
                      </div>
                      <div className="h-px flex-1 bg-slate-100 ml-4" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                      {items.map((r, i) => (
                        <KPICard key={i} r={r} group={group} valueClassName={globalSizeClass} />
                      ))}
                    </div>
                  </div>
                );
            })}

            {Object.keys(grouped).length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-[32px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <Info size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Sem resultados</h3>
                    <p className="text-slate-500 max-w-sm">
                        Nenhum indicador encontrado para os filtros selecionados neste eixo.
                    </p>
                </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicador</th>
                    <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Eixo</th>
                    <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Competência</th>
                    <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Realizado</th>
                    <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(Object.entries(grouped) as [string, any[]][]).map(([group, items]) => (
                    <React.Fragment key={group}>
                      {items.map((r, i) => (
                        <tr key={`${group}-${i}`} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-6 px-8 font-bold text-slate-800">{r.ind}</td>
                          <td className="py-6 px-8 text-xs font-medium text-slate-500">{group}</td>
                          <td className="py-6 px-8 text-slate-400 font-medium text-xs">{r.comp}</td>
                          <td className="py-6 px-8 text-right font-display font-black text-slate-900 text-lg">{formatValue(r.val, r.un)}</td>
                          <td className="py-6 px-8 text-right"><StatusBadge status={r.sem} /></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {Object.keys(grouped).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-32 text-center text-slate-400 font-medium italic">
                        Nenhum registro localizado para esta consulta.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
