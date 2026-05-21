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
  Loader2,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { formatValue, cn, formatCurrency } from '../../lib/utils';
import { SectionHeader, StatusBadge, PageHeader, KpiValue, ControlBar } from '../Common';
import { FULL_MONTH_LABELS, EIXOS_ORDEM } from '../../constants';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { DashboardSkeleton } from '../ui/skeletons';

const GROUP_MAPPING: Record<string, string> = {
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
  'ENPS': 'Cultura Organizacional',
  'eNPS': 'Cultura Organizacional',
  'Turnover': 'Cultura Organizacional',
  'Taxa de Retencão': 'Cultura Organizacional',
  'Taxa de Retenção': 'Cultura Organizacional',
  'Indice de Clima Organizacional': 'Cultura Organizacional',
  'Índice de Clima Organizacional': 'Cultura Organizacional',
  'Clima Organizacional': 'Cultura Organizacional',
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
  'Projetos Ativos': 'Gestão de Inovação',
  'Investimento em PAD': 'Gestão de Inovação',
  'Investimento em P&D': 'Gestão de Inovação',
  'Roi de Marketing': 'Gestão de Marketing',
  'ROI de Marketing': 'Gestão de Marketing',
  'LTV/CAC': 'Gestão de Marketing',
  'Churn Rate': 'Gestão Comercial',
  'Churn': 'Gestão Comercial',
  'Ticket Médio': 'Gestão Comercial',
  'Ticket Medio': 'Gestão Comercial',
  'Taxa de Conversão': 'Gestão Comercial',
  'Taxa de Conversao': 'Gestão Comercial',
  'NPS': 'Gestão Comercial',
  'OEE': 'Gestão Operacional',
  'Lead Time': 'Gestão Operacional',
  'Indice de Qualidade': 'Gestão Operacional',
  'Índice de Qualidade': 'Gestão Operacional',
  'Atrasos': 'Gestão Operacional',
  'Produtividade Colaborador': 'Gestão Operacional',
  'Manutenção Preditiva': 'Gestão Operacional',
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

const CATEGORY_CONFIG: Record<string, {
  icon: any;
  accentFrom: string;
  accentTo: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  glowColor: string;
  pillActive: string;
}> = {
  'Governança Corporativa':  { icon: ShieldCheck,  accentFrom: 'from-slate-500',   accentTo: 'to-slate-700',   badgeBg: 'bg-slate-500/10 border-slate-500/20',   badgeText: 'text-slate-600 dark:text-slate-300',   borderAccent: 'border-l-slate-400',   glowColor: 'rgba(100,116,139,0.18)',   pillActive: 'bg-slate-800 text-white border-slate-800' },
  'Cultura Organizacional':  { icon: Users,         accentFrom: 'from-purple-500',  accentTo: 'to-violet-700',  badgeBg: 'bg-purple-500/10 border-purple-500/20',  badgeText: 'text-purple-600 dark:text-purple-300',  borderAccent: 'border-l-purple-400',  glowColor: 'rgba(168,85,247,0.18)',   pillActive: 'bg-purple-800 text-white border-purple-800' },
  'Gestão de Inovação':      { icon: Lightbulb,     accentFrom: 'from-cyan-500',    accentTo: 'to-blue-600',    badgeBg: 'bg-cyan-500/10 border-cyan-500/20',      badgeText: 'text-cyan-600 dark:text-cyan-300',      borderAccent: 'border-l-cyan-400',    glowColor: 'rgba(6,182,212,0.18)',    pillActive: 'bg-cyan-800 text-white border-cyan-800' },
  'Gestão Comercial':        { icon: ShoppingBag,   accentFrom: 'from-emerald-500', accentTo: 'to-teal-600',    badgeBg: 'bg-emerald-500/10 border-emerald-500/20', badgeText: 'text-emerald-600 dark:text-emerald-300', borderAccent: 'border-l-emerald-400', glowColor: 'rgba(16,185,129,0.18)',   pillActive: 'bg-emerald-800 text-white border-emerald-800' },
  'Gestão Operacional':      { icon: Activity,      accentFrom: 'from-amber-500',   accentTo: 'to-orange-600',  badgeBg: 'bg-amber-500/10 border-amber-500/20',    badgeText: 'text-amber-600 dark:text-amber-300',    borderAccent: 'border-l-amber-400',   glowColor: 'rgba(245,158,11,0.18)',   pillActive: 'bg-amber-800 text-white border-amber-800' },
  'Administração e Finanças':{ icon: BarChart3,      accentFrom: 'from-indigo-500',  accentTo: 'to-blue-700',    badgeBg: 'bg-indigo-500/10 border-indigo-500/20',  badgeText: 'text-indigo-600 dark:text-indigo-300',  borderAccent: 'border-l-indigo-400',  glowColor: 'rgba(99,102,241,0.18)',   pillActive: 'bg-indigo-800 text-white border-indigo-800' },
  'Gestão de Marketing':     { icon: Globe,         accentFrom: 'from-blue-500',    accentTo: 'to-indigo-600',  badgeBg: 'bg-blue-500/10 border-blue-500/20',      badgeText: 'text-blue-600 dark:text-blue-300',      borderAccent: 'border-l-blue-400',    glowColor: 'rgba(59,130,246,0.18)',   pillActive: 'bg-blue-800 text-white border-blue-800' },
};

const DEFAULT_CONFIG = CATEGORY_CONFIG['Administração e Finanças'];

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

// Status bar progress helper
const semProgress = (sem: string) => {
  if (sem === 'Verde')  return { w: '100%', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-500', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.55)]', label: 'Meta Superada', labelCls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/40' };
  if (sem === 'Amarelo') return { w: '62%',  bar: 'bg-gradient-to-r from-amber-400 to-amber-500',   glow: 'shadow-[0_0_8px_rgba(245,158,11,0.55)]',   label: 'Em Atenção',   labelCls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-800/40' };
  return { w: '30%', bar: 'bg-gradient-to-r from-rose-400 to-rose-500', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.55)]', label: 'Alerta Crítico', labelCls: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/25 border-rose-200 dark:border-rose-800/40' };
};

function KPICard({ r, group, valueClassName, onAction }: any) {
  const config = CATEGORY_CONFIG[group] || DEFAULT_CONFIG;
  const Icon = config.icon || Activity;
  const sp = semProgress(r.sem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: `0 24px 40px -8px ${config.glowColor}, 0 8px 16px -4px rgba(0,0,0,0.06)` }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn(
        "relative flex flex-col gap-0 group min-w-0 overflow-hidden",
        "bg-card border border-border rounded-2xl",
        "hover:border-white/20 dark:hover:border-white/10 transition-colors duration-300",
        "border-l-4", config.borderAccent
      )}
    >
      {/* Subtle gradient top wash */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        `bg-gradient-to-br ${config.accentFrom}/5 ${config.accentTo}/0`
      )} />

      {/* Card body */}
      <div className="flex flex-col gap-5 p-6 relative z-10 flex-1">
        {/* Header row: axis pill + action button */}
        <div className="flex items-start justify-between gap-3">
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8.5px] font-black uppercase tracking-wider border shrink-0",
            config.badgeBg, config.badgeText
          )}>
            <Icon size={9} className="shrink-0" />
            <span className="truncate max-w-[120px]">{group}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onAction && onAction(r); }}
            title="Transformar em Plano de Ação"
            className="w-8 h-8 rounded-xl bg-foreground/5 dark:bg-white/5 text-foreground/40 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-200 shadow-sm shrink-0 group/btn"
          >
            <Zap size={13} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Indicator name */}
        <h4 className="text-[clamp(0.92rem,1.1vw,1.15rem)] font-display font-bold text-foreground leading-snug tracking-tight group-hover:text-secondary transition-colors duration-300 break-words">
          {r.ind}
        </h4>

        {/* Value block */}
        <div className="bg-surface-container/50 dark:bg-slate-900/30 rounded-xl px-4 py-3 border border-border/40 overflow-visible relative">
          <KpiValue
            value={formatValue(r.val, '')}
            suffix={r.un}
            className={cn("font-semibold tracking-tight text-foreground", valueClassName)}
          />
        </div>
      </div>

      {/* Status + footer strip */}
      <div className="px-6 pb-6 relative z-10 space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[8.5px] font-black uppercase tracking-widest text-muted-foreground">
              Status Meta
            </span>
            <span className={cn(
              "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border",
              sp.labelCls
            )}>
              {sp.label}
            </span>
          </div>
          <div className="h-1.5 w-full bg-border/40 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: sp.w }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'circOut' }}
              className={cn("h-full rounded-full", sp.bar, sp.glow)}
            />
          </div>
        </div>

        {/* Competência */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/30">
          <Calendar size={11} className="text-secondary shrink-0" />
          <span className="text-[8.5px] font-black uppercase tracking-wider text-muted-foreground truncate">
            {r.comp}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ label, value, icon: Icon, colorClass, trend, valueClassName }: any) {
  const isNeg = trend && trend.startsWith('-');
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        "bg-card border border-border rounded-2xl p-5 sm:p-6",
        "hover:border-secondary/20 dark:hover:border-white/10 transition-all duration-300 group relative overflow-hidden min-w-0"
      )}
    >
      {/* Decorative circle */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-secondary/3 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-xs shrink-0">
          <Icon size={18} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[8.5px] font-black uppercase tracking-wider border",
            isNeg
              ? "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-950/20"
              : "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20"
          )}>
            {isNeg ? <ArrowDown size={9} /> : <ArrowUp size={9} />}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10 overflow-visible min-w-0">
        <p className="text-[8.5px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1.5 truncate">{label}</p>
        <KpiValue
          value={value}
          className={cn("font-semibold tracking-tight text-foreground", valueClassName)}
        />
      </div>
    </motion.div>
  );
}

export function IndicatorsPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('mensal');
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filters = useMemo(() => {
    const list = [
      { field: 'clientId', operator: '==', value: selectedClient },
      { field: 'ano', operator: '==', value: filterYear }
    ];
    if (periodType === 'mensal') {
      list.push({ field: 'mes', operator: '==', value: filterMonth });
    }
    return list;
  }, [selectedClient, filterYear, filterMonth, periodType]);

  const { data: indicators, loading, hasMore, fetchNextPage, reset } = usePaginatedData({
    collectionName: 'indicators',
    filters,
    pageSize: 12
  });

  const { kpis: calculatedKPIs } = useRealIndicatorData(selectedClient, periodType === 'anual' ? 0 : filterMonth, filterYear);

  useEffect(() => { reset(); }, [selectedClient, filterYear, filterMonth, periodType]);
  useEffect(() => { setFilterYear(selectedYear); setFilterMonth(selectedMonth); }, [selectedYear, selectedMonth]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
  }, []);

  const { grouped, summary, groups, globalSizeClass, healthScore } = useMemo(() => {
    let finalIndicators = [...indicators];

    if (periodType === 'anual') {
      const groupsMapByName: Record<string, any[]> = {};
      finalIndicators.forEach(ind => {
        const name = ind.ind || '';
        if (!groupsMapByName[name]) groupsMapByName[name] = [];
        groupsMapByName[name].push(ind);
      });

      finalIndicators = Object.entries(groupsMapByName).map(([name, docs]) => {
        const lowerName = name.toLowerCase();
        const shouldSum = lowerName.includes('faturamento') ||
          (lowerName.includes('ebitda') && !lowerName.includes('margem')) ||
          (lowerName.includes('lucro') && !lowerName.includes('margem')) ||
          (lowerName.includes('receita') && !lowerName.includes('margem')) ||
          lowerName.includes('fluxo de caixa');

        let val = 0;
        if (shouldSum) {
          val = docs.reduce((sum, doc) => sum + (Number(doc.val) || 0), 0);
        } else {
          val = docs.reduce((sum, doc) => sum + (Number(doc.val) || 0), 0) / docs.length;
        }

        const semScore = docs.reduce((sum, doc) => {
          const s = doc.sem;
          if (s === 'Verde') return sum + 3;
          if (s === 'Amarelo') return sum + 2;
          return sum + 1;
        }, 0) / docs.length;

        const sem = semScore >= 2.5 ? 'Verde' : semScore >= 1.5 ? 'Amarelo' : 'Vermelho';

        return { ...docs[0], val, sem, comp: `Anual / ${filterYear}` };
      });
    }

    const sortedIndicators = finalIndicators.sort((a, b) => (a.ind || '').localeCompare(b.ind || ''));
    const listWithGroups = sortedIndicators.map(i => {
      const indName = (i.ind === 'Múltiplo' || i.ind === 'Multiplo') ? 'Múltiplo de EBITDA' : i.ind;
      return {
        ...i,
        ind: indName,
        analysisGroup: GROUP_MAPPING[indName] || GROUP_MAPPING[i.cat] || 'Outros'
      };
    });

    const missingKPIs: any[] = [];
    const checkAndAdd = (name: string, value: number, unit: string) => {
      const isMandatory = name === 'Gestão de Ativos' || name === 'Gestão de Passivos' || name === 'Saldo em Caixa';
      if (!listWithGroups.some(i => i.ind === name) && (value !== 0 || isMandatory)) {
        missingKPIs.push({
          ind: name,
          val: value,
          un: unit,
          comp: periodType === 'anual'
            ? `Anual / ${filterYear}`
            : `${FULL_MONTH_LABELS[filterMonth as keyof typeof FULL_MONTH_LABELS]} / ${filterYear}`,
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
      if (label === 'Faturamento' && calculatedKPIs.revenue > 0) return formatCurrency(calculatedKPIs.revenue);
      if (label === 'EBITDA' && calculatedKPIs.ebitda > 0) return formatCurrency(calculatedKPIs.ebitda);
      if (label === 'Ativos' && calculatedKPIs.totalAssets > 0) return formatCurrency(calculatedKPIs.totalAssets);
      if (label === 'Passivos' && calculatedKPIs.totalLiabilities > 0) return formatCurrency(calculatedKPIs.totalLiabilities);
      if (label === 'Saldo em Caixa' && calculatedKPIs.saldoCaixa > 0) return formatCurrency(calculatedKPIs.saldoCaixa);
      const found = finalFullList.find(i => i.ind.toLowerCase().includes(label.toLowerCase()));
      return found ? formatValue(found.val, found.un) : '---';
    };

    const stats = [
      { label: 'Faturamento',    value: getVal('Faturamento'), icon: BarChart3,  colorClass: 'text-secondary',    trend: '' },
      { label: 'EBITDA',         value: getVal('EBITDA'),       icon: Zap,        colorClass: 'text-secondary',    trend: '' },
      { label: 'Ativos Totais',  value: getVal('Ativos'),       icon: TrendingUp, colorClass: 'text-emerald-500',  trend: '' },
      { label: 'Passivos Totais',value: getVal('Passivos'),     icon: ShieldAlert,colorClass: 'text-rose-500',     trend: '' }
    ];

    const healthScore = finalIndicators.length > 0 ? Math.round(
      finalIndicators.reduce((acc, curr) => {
        const val = curr.sem === 'Verde' ? 100 : curr.sem === 'Amarelo' ? 60 : 30;
        return acc + val;
      }, 0) / finalIndicators.length
    ) : 0;

    const globalMaxLen = Math.max(
      ...finalFullList.map(i => formatValue(i.val, i.un).length),
      ...stats.map(s => String(s.value).length)
    );
    const globalSizeClass = getValueSizeClass(globalMaxLen);

    return { grouped: groupsMap, summary: stats, groups: availableGroups, globalSizeClass, healthScore };
  }, [indicators, filterGroup, filterMonth, filterYear, calculatedKPIs, periodType]);

  // Health score derived values
  const hsColor = healthScore > 80 ? 'emerald' : healthScore > 60 ? 'amber' : 'rose';
  const hsLabel = healthScore > 80 ? 'Otimizado' : healthScore > 60 ? 'Em Observação' : 'Crítico';
  const hsBar = healthScore > 80
    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
    : healthScore > 60
    ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
    : 'bg-gradient-to-r from-rose-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]';

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

      {/* ── Header row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Page title */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <PageHeader
            title="Análise de KPIs"
            subtitle="Monitoramento avançado de performance e eixos estratégicos em tempo real."
            icon={TrendingUp}
            className="mb-0"
          />
        </div>

        {/* Health Score panel */}
        <div className="lg:col-span-4">
          <div className="h-full bg-card border border-border rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between gap-4">
            {/* Accent left bar */}
            <div className={cn(
              "absolute top-0 left-0 w-1 h-full rounded-l-2xl transition-all duration-500",
              indicators.length > 0
                ? hsColor === 'emerald' ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[2px_0_14px_rgba(16,185,129,0.35)]'
                : hsColor === 'amber'   ? 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-[2px_0_14px_rgba(245,158,11,0.35)]'
                :                        'bg-gradient-to-b from-rose-400 to-rose-600 shadow-[2px_0_14px_rgba(244,63,94,0.35)]'
                : 'bg-border'
            )} />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs shrink-0",
                  indicators.length > 0
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-surface-container text-muted-foreground border-border"
                )}>
                  <ShieldCheck size={16} />
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-snug">
                  Score de Saúde<br />Consolidado
                </p>
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm shrink-0 whitespace-nowrap",
                indicators.length > 0
                  ? hsColor === 'emerald' ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
                  : hsColor === 'amber'   ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"
                  :                        "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40"
                  : "text-muted-foreground bg-surface-container border-border"
              )}>
                {indicators.length > 0 ? hsLabel : 'Pendente'}
              </span>
            </div>

            <div className="relative z-10 flex items-baseline gap-1.5 pl-1">
              <span className="text-4xl font-display font-semibold text-foreground tracking-tight leading-none tabular-nums">
                {indicators.length > 0 ? healthScore.toFixed(1) : '---'}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">/ 100</span>
            </div>

            <div className="relative z-10 space-y-1.5">
              <div className="flex justify-between items-center text-[8.5px] font-black uppercase tracking-widest text-muted-foreground gap-2">
                <span>Eficiência Estratégica</span>
                <span className={cn(
                  "font-bold shrink-0",
                  indicators.length > 0
                    ? hsColor === 'emerald' ? "text-emerald-500" : hsColor === 'amber' ? "text-amber-500" : "text-rose-500"
                    : "text-muted-foreground"
                )}>
                  {indicators.length > 0 ? `${healthScore}%` : '---'}
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container dark:bg-slate-900 rounded-full overflow-hidden border border-border/50 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1.5, ease: 'circOut' }}
                  className={cn("h-full rounded-full", hsBar)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Matrix ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map((stat, idx) => (
          <SummaryCard key={idx} {...stat} valueClassName={globalSizeClass} />
        ))}
      </div>

      {/* ── Control / Filter Bar ────────────────────────────────────── */}
      <div className={cn(
        "flex flex-wrap items-center justify-between gap-3 p-3 md:p-4",
        "bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm"
      )}>
        {/* Left: View toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-surface-container p-1 rounded-xl flex gap-1 border border-border shadow-xs shrink-0">
            {[
              { mode: 'grid' as const, icon: LayoutGrid, label: 'Grade' },
              { mode: 'table' as const, icon: List,       label: 'Lista' },
            ].map(({ mode, icon: MIcon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9.5px] font-black uppercase tracking-widest transition-all duration-200",
                  viewMode === mode
                    ? "bg-card text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MIcon size={13} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Period selectors */}
        <div className="flex items-center bg-card border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="flex items-center px-3 py-2 border-r border-border">
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as 'mensal' | 'anual')}
              className="text-[9.5px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
            >
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div className={cn("flex items-center px-3 py-2", periodType === 'mensal' && "border-r border-border")}>
            <Calendar size={13} className="text-secondary mr-2 shrink-0" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="text-[9.5px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {periodType === 'mensal' && (
            <div className="flex items-center px-3 py-2">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
                className="text-[9.5px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Axis Filter Pills ───────────────────────────────────────── */}
      {/* px-3 ensures no clipping of borders/shadows during the scale-[1.03] animation */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-2 px-3 -mx-3 no-scrollbar [scroll-padding-inline-start:12px]">
        <button
          onClick={() => setFilterGroup('')}
          className={cn(
            "px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap border shrink-0 shadow-sm",
            filterGroup === ''
              ? "bg-foreground text-background border-foreground shadow-md scale-[1.03]"
              : "bg-card text-muted-foreground border-border hover:border-secondary/30 hover:text-foreground"
          )}
        >
          Todos os Eixos
        </button>
        {groups.map((g: string) => {
          const cfg = CATEGORY_CONFIG[g] || DEFAULT_CONFIG;
          return (
            <button
              key={g}
              onClick={() => setFilterGroup(g)}
              className={cn(
                "px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap border shrink-0 shadow-sm",
                filterGroup === g
                  ? cn(cfg.pillActive, "shadow-md scale-[1.03]")
                  : "bg-card text-muted-foreground border-border hover:border-secondary/30 hover:text-foreground"
              )}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="space-y-14"
          >
            {(Object.entries(grouped) as [string, any[]][]).map(([group, items]) => {
              if (!items.length) return null;
              const config = CATEGORY_CONFIG[group] || DEFAULT_CONFIG;
              const Icon = config.icon;
              const verde = items.filter(i => i.sem === 'Verde').length;
              const amarelo = items.filter(i => i.sem === 'Amarelo').length;
              const vermelho = items.filter(i => i.sem === 'Vermelho').length;

              return (
                <div key={group} className="space-y-6">
                  {/* Section header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0",
                        config.badgeBg, config.badgeText
                      )}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-display font-bold text-foreground leading-none tracking-tight truncate">{group}</h3>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">{items.length} indicadores</p>
                      </div>
                    </div>

                    {/* Mini status summary */}
                    <div className="flex items-center gap-2 ml-0 sm:ml-4 shrink-0">
                      {verde > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{verde} ok
                        </span>
                      )}
                      {amarelo > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/25 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{amarelo} atenção
                        </span>
                      )}
                      {vermelho > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/25 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{vermelho} alerta
                        </span>
                      )}
                    </div>

                    <div className="hidden sm:block h-px flex-1 bg-border ml-2" />
                  </div>

                  {/* Cards grid — fluid breakpoints respect sidebar state */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
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
                          window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'plano_acao' }));
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {Object.keys(grouped).length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-card border border-border rounded-2xl">
                <div className="w-20 h-20 bg-surface-container border border-border rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                  <Info size={36} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Sem resultados</h3>
                <p className="text-muted-foreground max-w-sm font-medium">
                  Nenhum indicador encontrado para os filtros selecionados neste eixo.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container/60 border-b border-border">
                    <th className="text-left py-5 px-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Indicador</th>
                    <th className="text-left py-5 px-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Eixo</th>
                    <th className="text-left py-5 px-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Competência</th>
                    <th className="text-right py-5 px-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Valor</th>
                    <th className="text-right py-5 px-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(Object.entries(grouped) as [string, any[]][]).map(([group, items]) => (
                    <React.Fragment key={group}>
                      {items.map((r, i) => (
                        <tr key={`${group}-${i}`} className="hover:bg-surface-container/30 transition-colors group">
                          <td className="py-5 px-6 font-semibold text-foreground">{r.ind}</td>
                          <td className="py-5 px-6 text-xs font-medium text-muted-foreground">{group}</td>
                          <td className="py-5 px-6 text-xs font-medium text-muted-foreground">{r.comp}</td>
                          <td className="py-5 px-6 text-right font-display font-medium text-foreground text-base tabular-nums">{formatValue(r.val, r.un)}</td>
                          <td className="py-5 px-6 text-right"><StatusBadge status={r.sem} /></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {Object.keys(grouped).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-24 text-center text-muted-foreground font-medium italic">
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
          <div className="flex justify-center pt-8">
            <button
              onClick={() => fetchNextPage()}
              className="px-8 py-3 bg-card border border-border rounded-2xl text-[9.5px] font-black uppercase tracking-widest text-muted-foreground hover:text-secondary hover:border-secondary/30 transition-all shadow-sm active:scale-95"
            >
              Carregar Mais Indicadores
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
