import React, { useState, useEffect, useMemo } from 'react';
import { query, collection, where, onSnapshot, getDocs, limit, startAfter, orderBy } from 'firebase/firestore';
import { usePaginatedData } from '../../hooks/usePaginatedData';
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
import { formatValue, cn, formatCurrency } from '../../lib/utils';
import { SectionHeader, StatusBadge, PageHeader, KpiValue } from '../Common';
import { FULL_MONTH_LABELS, EIXOS_ORDEM } from '../../constants';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';

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
  'Gestão de Ativos': 'Administração e Finanças',
  'Gestão de Passivos': 'Administração e Finanças',
  'Posição de Caixa Alpha': 'Administração e Finanças',
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
  'Atrasos': 'Gestão Operacional',
  'Produtividade Colaborador': 'Gestão Operacional',
  'Manutenção Preditiva': 'Gestão Operacional',
  
  // New Strategic indicators mapping
  'Índice de Transparência': 'Governança Corporativa',
  'Eficácia Decisória': 'Governança Corporativa',
  'Absenteísmo': 'Cultura Organizacional',
  'Taxa de Promoção Interna': 'Cultura Organizacional',
  'Receita Novos Produtos': 'Gestão de Inovação',
  'Time-to-Market': 'Gestão de Inovação',
  'LTV CAC Marketing': 'Gestão de Marketing',
  'Share of Voice': 'Gestão de Marketing',
  'Win Rate': 'Gestão Comercial',
  'Cash Runaway': 'Administração e Finanças'
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

function KPICard({ r, group, valueClassName, onAction }: any) {
  const config = CATEGORY_CONFIG[group] || CATEGORY_CONFIG['Administração e Finanças'];
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-6 md:p-10 h-full flex flex-col gap-8 md:gap-10 group bg-white border border-slate-100 rounded-[32px] md:rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
    >
      {/* Decorative framing element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none group-hover:bg-slate-100/50 transition-colors" />

      <div className="flex items-start justify-between gap-4 md:gap-6 relative z-10">
        <div className="space-y-1.5 min-w-0 flex-1 overflow-visible">
          <h4 className="text-[clamp(1rem,1.3vw,1.5rem)] font-display font-black text-slate-900 leading-tight group-hover:text-secondary transition-colors break-words">
            {r.ind}
          </h4>
          <div className="flex items-center gap-2 min-w-0 overflow-visible">
            <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm shrink-0", r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500")} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] break-words leading-normal">{group}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col mt-auto relative z-10">
        {/* Value framing */}
        <div className="bg-slate-50/50 rounded-2xl md:rounded-[32px] p-4 md:p-6 mb-6 md:mb-8 group-hover:bg-white group-hover:shadow-inner transition-all border border-slate-100/50 overflow-visible">
          <KpiValue 
            value={formatValue(r.val, '')} 
            suffix={r.un}
            className={cn("font-black tracking-tighter", valueClassName)}
          />
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
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAction && onAction(r);
              }}
              title="Transformar em Plano de Ação"
              className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-secondary transition-all shadow-lg shadow-slate-900/10 group/btn"
            >
               <Zap size={16} className="group-hover/btn:scale-125 transition-transform" />
            </button>
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
      
      <div className="relative z-10 overflow-visible">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 break-words leading-normal">{label}</p>
        <KpiValue 
          value={value} 
          className={cn("font-black tracking-tighter", valueClassName)}
        />
      </div>
    </div>
  );
}


export function IndicatorsPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filters = useMemo(() => [
    { field: 'clientId', operator: '==', value: selectedClient },
    { field: 'ano', operator: '==', value: filterYear },
    { field: 'mes', operator: '==', value: filterMonth }
  ], [selectedClient, filterYear, filterMonth]);

  const { 
    data: indicators, 
    loading, 
    hasMore, 
    fetchNextPage, 
    reset 
  } = usePaginatedData({
    collectionName: 'indicators',
    filters,
    pageSize: 12
  });

  const { kpis: calculatedKPIs } = useRealIndicatorData(selectedClient, filterMonth, filterYear);

  useEffect(() => {
    reset();
  }, [selectedClient, filterYear, filterMonth]);

  useEffect(() => {
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
  }, [selectedYear, selectedMonth]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
  }, []);

  const { grouped, summary, groups, globalSizeClass, healthScore } = useMemo(() => {
    // 1. Start with database indicators (sorted in-memory by name)
    const sortedIndicators = [...indicators].sort((a, b) => (a.ind || '').localeCompare(b.ind || ''));
    const listWithGroups = sortedIndicators.map(i => {
        const indName = (i.ind === 'Múltiplo' || i.ind === 'Multiplo') ? 'Múltiplo de EBITDA' : i.ind;
        return {
            ...i,
            ind: indName,
            analysisGroup: GROUP_MAPPING[indName] || GROUP_MAPPING[i.cat] || 'Outros'
        };
    });

    // 2. Add fallbacks if specific indicators are missing from DB
    const missingKPIs = [];
    
    const checkAndAdd = (name: string, value: number, unit: string) => {
      const isMandatory = name === 'Gestão de Ativos' || name === 'Gestão de Passivos' || name === 'Saldo em Caixa';
      if (!listWithGroups.some(i => i.ind === name) && (value !== 0 || isMandatory)) {
        missingKPIs.push({
          ind: name,
          val: value,
          un: unit,
          comp: `${FULL_MONTH_LABELS[filterMonth as keyof typeof FULL_MONTH_LABELS]} / ${filterYear}`,
          sem: value > 0 ? 'Verde' : 'Amarelo',
          analysisGroup: GROUP_MAPPING[name] || 'Administração e Finanças'
        });
      }
    };

    checkAndAdd('Margem EBITDA', calculatedKPIs.ebitdaMargin, '%');
    checkAndAdd('Liquidez Corrente', calculatedKPIs.liquidezCorrente, '');
    checkAndAdd('Margem Líquida', calculatedKPIs.margemLiquida, '%');
    checkAndAdd('EBITDA', calculatedKPIs.ebitda, 'R$');
    checkAndAdd('Faturamento', calculatedKPIs.revenue, 'R$');
    checkAndAdd('Saldo em Caixa', calculatedKPIs.saldoCaixa, 'R$');
    checkAndAdd('Gestão de Ativos', calculatedKPIs.totalAssets, 'R$');
    checkAndAdd('Gestão de Passivos', calculatedKPIs.totalLiabilities, 'R$');

    const finalFullList = [...listWithGroups, ...missingKPIs];

    let filteredList = finalFullList;
    if (filterGroup) filteredList = filteredList.filter(f => f.analysisGroup === filterGroup);
    
    const availableGroups = Array.from(new Set(finalFullList.map(i => i.analysisGroup)))
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
        // First try to find in real-time calculated KPIs
        if (label === 'Faturamento' && calculatedKPIs.revenue > 0) return formatCurrency(calculatedKPIs.revenue);
        if (label === 'EBITDA' && calculatedKPIs.ebitda > 0) return formatCurrency(calculatedKPIs.ebitda);
        if (label === 'Ativos' && calculatedKPIs.totalAssets > 0) return formatCurrency(calculatedKPIs.totalAssets);
        if (label === 'Passivos' && calculatedKPIs.totalLiabilities > 0) return formatCurrency(calculatedKPIs.totalLiabilities);
        if (label === 'Saldo em Caixa' && calculatedKPIs.saldoCaixa > 0) return formatCurrency(calculatedKPIs.saldoCaixa);
        
        const found = finalFullList.find(i => i.ind.toLowerCase().includes(label.toLowerCase()));
        return found ? formatValue(found.val, found.un) : '---';
    };

    const stats = [
        { label: 'Faturamento', value: getVal('Faturamento'), icon: BarChart3, colorClass: 'text-secondary', trend: '' },
        { label: 'EBITDA', value: getVal('EBITDA'), icon: Zap, colorClass: 'text-secondary', trend: '' },
        { label: 'Ativos Totais', value: getVal('Ativos'), icon: TrendingUp, colorClass: 'text-emerald-500', trend: '' },
        { label: 'Passivos Totais', value: getVal('Passivos'), icon: ShieldAlert, colorClass: 'text-rose-500', trend: '' }
    ];

    const healthScore = indicators.length > 0 ? Math.round(
      indicators.reduce((acc, curr) => {
        // Simple heuristic for score based on semaforo if no real formula is available for generic indicators
        const val = curr.sem === 'Verde' ? 100 : curr.sem === 'Amarelo' ? 60 : 30;
        return acc + val;
      }, 0) / indicators.length
    ) : 0;

    const globalMaxLen = Math.max(
      ...finalFullList.map(i => formatValue(i.val, i.un).length),
      ...stats.map(s => String(s.value).length)
    );
    const globalSizeClass = getValueSizeClass(globalMaxLen);

    return { grouped: groupsMap, summary: stats, groups: availableGroups, globalSizeClass, healthScore };
  }, [indicators, filterGroup, filterMonth, filterYear, calculatedKPIs]);

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
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'grid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={14} className="inline mr-2" />
              Grade
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'table' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={14} className="inline mr-2" />
              Lista
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
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
        </div>
      </div>



      {/* Corporate Health Mini-Header */}
      <div className="bg-card border border-border rounded-md p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full",
          indicators.length > 0 ? "bg-success" : "bg-muted"
        )} />
        <div className="flex items-center gap-8 relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-md flex items-center justify-center border border-border shadow-sm group-hover:scale-105 transition-transform",
            indicators.length > 0 ? "bg-success/10 text-success" : "bg-surface-container text-muted-foreground"
          )}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.25em] mb-1">Score de Saúde Consolidado</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-display font-medium text-foreground tracking-tighter">
                {indicators.length > 0 ? healthScore.toFixed(1) : '---'}
              </span>
              <span className={cn(
                "text-[9px] font-medium uppercase tracking-widest px-3 py-1 rounded-sm border",
                indicators.length > 0 
                  ? (healthScore > 80 
                    ? "text-success bg-success/10 border-success/20" 
                    : healthScore > 60
                    ? "text-warning bg-warning/10 border-warning/20"
                    : "text-destructive bg-destructive/10 border-destructive/20")
                  : "text-muted-foreground bg-surface-container border-border"
              )}>
                {indicators.length > 0 ? (healthScore > 80 ? 'Otimizado' : healthScore > 60 ? 'Em Observação' : 'Crítico') : 'Pendente'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-lg w-full relative z-10">
          <div className="flex justify-between text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2">
            <span>Eficiência Estratégica</span>
            <span className={indicators.length > 0 ? "text-success" : "text-muted-foreground"}>
              {indicators.length > 0 ? `${healthScore}%` : '---'}
            </span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={cn(
                "h-full shadow-sm",
                healthScore > 80 ? "bg-success" : healthScore > 60 ? "bg-warning" : "bg-destructive"
              )}
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

      {/* Axis Filters only */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
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
                        <KPICard 
                          key={i} 
                          r={r} 
                          group={group} 
                          valueClassName={globalSizeClass} 
                          onAction={(ind: any) => {
                            sessionStorage.setItem('pending_action', JSON.stringify({
                              title: `Ação para: ${ind.ind}`,
                              origin: 'Indicadores',
                              description: `Melhorar o indicador ${ind.ind} (Valor atual: ${ind.val})`
                            }));
                            // Assuming setCurrentPage is available via props, but it's not here.
                            // I'll use a custom event or check how to navigate.
                            window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'plano_acao' }));
                          }}
                        />
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
        {hasMore && !loading && (
          <div className="flex justify-center pt-10">
            <button
              onClick={() => fetchNextPage()}
              className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-secondary hover:border-secondary/30 transition-all shadow-sm"
            >
              Carregar Mais Indicadores
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
