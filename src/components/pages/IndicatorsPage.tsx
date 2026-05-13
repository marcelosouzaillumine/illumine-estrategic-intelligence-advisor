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
  'Performance': 'Gestão',
  'Operacional': 'Operação',
  'Lucratividade': 'Gestão',
  'Liquidez': 'Gestão',
  'Atividade': 'Operação',
  'Eficiência': 'Operação',
  'Caixa': 'Gestão',
  'Financeiro': 'Gestão',
  'Patrimonial': 'Gestão',
  'Risco': 'Governança',
  'Estratégico': 'Governança',
  'Crescimento': 'Comercial',
  'Venture': 'Inovação',
  'Compliance': 'Governança',
  'Governança': 'Governança',
  'Pessoas': 'Cultura',
  'RH': 'Cultura',
  'Marketing': 'Marketing',
  'Vendas': 'Comercial',
  
  // Governança
  'Indice de Alinhamento': 'Governança',
  'Índice de Alinhamento': 'Governança',
  'Heath Score': 'Governança',
  'Health Score': 'Governança',
  'IVE': 'Governança',
  'OKRs': 'Governança',
  'OKR': 'Governança',
  'Valor de Mercado': 'Governança',
  'Valor de mercado': 'Governança',
  'Múltiplo': 'Governança',
  'Multiplo': 'Governança',
  'Múltiplo de EBITDA': 'Governança',
  'Múltiplo EBITDA': 'Governança',
  'Indice de Alavancagem': 'Governança',
  'Índice de Alavancagem': 'Governança',
  'Aderencia Orçamentaria': 'Governança',
  'Aderência Orçamentária': 'Governança',
  
  // Cultura
  'ENPS': 'Cultura',
  'eNPS': 'Cultura',
  'Turnover': 'Cultura',
  'Taxa de Retencão': 'Cultura',
  'Taxa de Retenção': 'Cultura',
  'Indice de Clima Organizacional': 'Cultura',
  'Índice de Clima Organizacional': 'Cultura',
  'Clima Organizacional': 'Cultura',
  
  // Gestão
  'EBITDA': 'Gestão',
  'Margem EBITDA': 'Gestão',
  'Saldo Em Caixa': 'Gestão',
  'Saldo em Caixa': 'Gestão',
  'Fluxo de Caixa Operacional': 'Gestão',
  'Lucro Líquido': 'Gestão',
  'Liquidez Corrente': 'Gestão',
  'Inadimplencia': 'Gestão',
  'Inadimplência': 'Gestão',
  'Faturamento Bruto': 'Gestão',
  'Receita Líquida': 'Gestão',
  'Receita liquida': 'Gestão',
  'PMR': 'Gestão',
  'Margem Líquida': 'Gestão',
  'WACC': 'Gestão',
  
  // Inovação
  'Projetos Ativos': 'Inovação',
  'Investimento em PAD': 'Inovação',
  'Investimento em P&D': 'Inovação',
  
  // Marketing
  'Roi de Marketing': 'Marketing',
  'ROI de Marketing': 'Marketing',
  'LTV/CAC': 'Marketing',
  
  // Comercial
  'Churn Rate': 'Comercial',
  'Churn': 'Comercial',
  'Ticket Médio': 'Comercial',
  'Ticket Medio': 'Comercial',
  'Taxa de Conversão': 'Comercial',
  'Taxa de Conversao': 'Comercial',
  'NPS': 'Comercial',
  
  // Operação
  'OEE': 'Operação',
  'Lead Time': 'Operação',
  'Indice de Qualidade': 'Operação',
  'Índice de Qualidade': 'Operação',
  'Atrasos': 'Operação'
};

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string; text: string }> = {
  'Governança': { icon: ShieldCheck, color: 'slate', bg: 'bg-slate-50 dark:bg-slate-900', border: 'border-slate-100 dark:border-slate-800', text: 'text-slate-600 dark:text-slate-400' },
  'Cultura': { icon: Users, color: 'purple', bg: 'bg-purple-50 dark:bg-purple-900', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' },
  'Inovação': { icon: Lightbulb, color: 'cyan', bg: 'bg-cyan-50 dark:bg-cyan-900', border: 'border-cyan-100 dark:border-cyan-800', text: 'text-cyan-600 dark:text-cyan-400' },
  'Comercial': { icon: ShoppingBag, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-900', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400' },
  'Operação': { icon: Activity, color: 'amber', bg: 'bg-amber-50 dark:bg-amber-900', border: 'border-amber-100 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400' },
  'Gestão': { icon: BarChart3, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-900', border: 'border-indigo-100 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400' },
  'Marketing': { icon: Globe, color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
};

function KPICard({ r, group }: any) {
  const config = CATEGORY_CONFIG[group] || CATEGORY_CONFIG['Gestão'];
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-8 h-full flex flex-col gap-8 group bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500")} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{group}</p>
          </div>
          <h4 className="text-xl font-display font-black text-slate-800 leading-tight group-hover:text-secondary transition-colors">
            {r.ind}
          </h4>
        </div>
        <div className="shrink-0 scale-90">
          <StatusBadge status={r.sem} />
        </div>
      </div>
      
      <div className="flex flex-col mt-auto relative z-10">
        <div className="flex items-baseline gap-3 mb-8">
          <span className="font-display text-slate-900 text-5xl font-black tabular-nums tracking-tighter">
            {formatValue(r.val, r.un)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.un || 'Units'}</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Desempenho</span>
              <span className={cn(
                r.sem === 'Verde' ? "text-emerald-600" : r.sem === 'Amarelo' ? "text-amber-600" : "text-rose-600"
              )}>
                {r.sem === 'Verde' ? 'Meta Atingida' : r.sem === 'Amarelo' ? 'Em Atenção' : 'Crítico'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-50 overflow-hidden rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: r.sem === 'Verde' ? '100%' : r.sem === 'Amarelo' ? '65%' : '35%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut" }}
                className={cn(
                  "h-full transition-all",
                  r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500"
                )}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={12} className="text-secondary" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                {r.comp}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ label, value, icon: Icon, colorClass, trend }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
          <Icon size={24} />
        </div>
        {trend && (
            <div className={cn(
                "px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full",
                trend.startsWith('-') ? "text-rose-600 border-rose-100 bg-rose-50" : "text-emerald-600 border-emerald-100 bg-emerald-50"
            )}>
              {trend}
            </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-display font-black text-slate-900 tabular-nums tracking-tighter">
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

  const { grouped, summary, groups } = useMemo(() => {
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

    return { grouped: groupsMap, summary: stats, groups: availableGroups };
  }, [indicators, filterGroup]);

  const currentClient = clients.find((c: any) => c.id === selectedClient);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-3xl p-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="text-secondary animate-spin" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Sincronizando Analytics</h3>
        <p className="text-slate-500 max-w-md">Consolidando indicadores vitais e eixos estratégicos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      {/* Strategic Header - Standardized with Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Analytics & KPIs Vitais</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Monitoramento avançado de performance por eixos de gestão.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <div className="flex items-center px-4 py-2 border-r border-white/10">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {years.map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 px-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-secondary text-white" : "text-slate-400 hover:text-white")}
            >
              <LayoutGrid size={14} strokeWidth={2} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn("p-2 px-3 rounded-xl transition-all", viewMode === 'table' ? "bg-secondary text-white" : "text-slate-400 hover:text-white")}
            >
              <List size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Health Mini-Header */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Health Score Consolidado</h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display font-black text-slate-900">94.2</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Otimizado</span>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-md w-full">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            <span>Eficiência Estratégica</span>
            <span>94.2%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '94.2%' }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((stat, idx) => (
          <SummaryCard key={idx} {...stat} />
        ))}
      </div>

      {/* Axis Filters */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilterGroup('')}
          className={cn(
            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
            filterGroup === '' 
              ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
              : "bg-white text-slate-400 border-slate-100 hover:border-secondary/30"
          )}
        >
          Todos os Eixos
        </button>
        {groups.map((g: string) => (
          <button
            key={g}
            onClick={() => setFilterGroup(g)}
            className={cn(
              "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              filterGroup === g 
                ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                : "bg-white text-slate-400 border-slate-100 hover:border-secondary/30"
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
                const config = CATEGORY_CONFIG[group] || CATEGORY_CONFIG['Gestão'];
                return (
                  <div key={group} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl border", config.bg, config.border)}>
                        <config.icon size={20} className={config.text} />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-black text-slate-900">{group}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{items.length} indicadores monitorados</p>
                      </div>
                      <div className="h-px flex-1 bg-slate-100 ml-4" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((r, i) => (
                        <KPICard key={i} r={r} group={group} />
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
            className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm"
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
