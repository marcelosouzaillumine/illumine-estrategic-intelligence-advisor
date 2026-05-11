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
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { DATA } from '../../data';
import { formatValue, cn, formatCurrency } from '../../lib/utils';
import { SectionHeader, StatusBadge } from '../Common';
import { FULL_MONTH_LABELS } from '../../constants';

const GROUP_MAPPING: Record<string, string> = {
  'Performance': 'Faturamento',
  'Operacional': 'Faturamento',
  'Lucratividade': 'Rentabilidade',
  'Liquidez': 'Liquidez',
  'Atividade': 'Ciclo de Atividade',
  'Eficiência': 'Ciclo de Atividade',
  'Caixa': 'Fluxo de Caixa',
  'Financeiro': 'Estrutura de Capital',
  'Patrimonial': 'Estrutura de Capital',
  'Risco': 'Estrutura de Capital',
  'Estratégico': 'Valuation',
  'Crescimento': 'Valuation',
  'Venture': 'Valuation',
};

const CATEGORY_ICONS: Record<string, any> = {
  'Faturamento': BarChart3,
  'Rentabilidade': TrendingUp,
  'Liquidez': Waves,
  'Ciclo de Atividade': Activity,
  'Fluxo de Caixa': Wallet,
  'Estrutura de Capital': Building,
  'Valuation': Target,
};

function KPICard({ r }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-3 transition-all duration-300 h-full min-h-[140px]"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight flex-1 min-w-0 break-words">
          {r.ind}
        </h4>
        <div className="shrink-0">
          <StatusBadge status={r.sem} />
        </div>
      </div>
      
      <div className="flex flex-col mt-auto">
        <span className={cn(
          "font-black text-primary tracking-tighter break-all",
          r.val && String(r.val).length > 12 ? "text-lg" : "text-xl"
        )}>
          {formatValue(r.val, r.un)}
        </span>
        <div className="flex items-center gap-1.5 mt-2">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            r.sem === 'Verde' ? "bg-emerald-500" : r.sem === 'Amarelo' ? "bg-amber-500" : "bg-rose-500"
          )} />
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
            {r.comp}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ label, value, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 overflow-hidden relative group h-full">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", colorClass)}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
        <p className={cn(
            "font-black text-slate-900 tracking-tighter leading-none break-all",
            value && String(value).length > 15 ? "text-lg" : "text-xl lg:text-2xl"
        )}>
            {value}
        </p>
      </div>
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-slate-50/30 to-transparent pointer-events-none" />
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
    const listWithGroups = indicators.map(i => ({
        ...i,
        analysisGroup: GROUP_MAPPING[i.cat] || 'Outros'
    }));

    let filteredList = listWithGroups;
    if (filterGroup) filteredList = filteredList.filter(f => f.analysisGroup === filterGroup);
    
    const availableGroups = Array.from(new Set(listWithGroups.map(i => i.analysisGroup))).sort();
    
    const groupsMap: Record<string, any[]> = {};
    filteredList.forEach(i => {
      if (!groupsMap[i.analysisGroup]) groupsMap[i.analysisGroup] = [];
      groupsMap[i.analysisGroup].push(i);
    });

    // Summary stats
    const getVal = (label: string) => {
        const found = indicators.find(i => i.ind.toLowerCase().includes(label.toLowerCase()));
        return found ? formatValue(found.val, found.un) : '---';
    };

    const stats = [
        { label: 'Faturamento Bruto', value: getVal('Faturamento Bruto'), icon: BarChart3, colorClass: 'bg-blue-50 text-blue-600' },
        { label: 'EBITDA', value: getVal('EBITDA'), icon: Zap, colorClass: 'bg-amber-50 text-amber-600' },
        { label: 'Lucro Líquido', value: getVal('Lucro Líquido'), icon: TrendingUp, colorClass: 'bg-emerald-50 text-emerald-600' },
        { label: 'Ciclo Financeiro', value: getVal('Ciclo Financeiro'), icon: Activity, colorClass: 'bg-indigo-50 text-indigo-600' }
    ];

    return { grouped: groupsMap, summary: stats, groups: availableGroups };
  }, [indicators, filterGroup]);

  const currentClient = clients.find((c: any) => c.id === selectedClient);

  return (
    <div className="space-y-10 pb-20">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((stat, idx) => (
          <SummaryCard key={idx} {...stat} />
        ))}
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm items-center">
        <div className="flex flex-wrap gap-4 flex-1">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <Building size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-700">{currentClient?.fantasia || currentClient?.name || 'Selecione Cliente'}</span>
            </div>

            <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(Number(e.target.value))} 
                className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-4 focus:ring-secondary/5 transition-all"
            >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(Number(e.target.value))} 
                className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-4 focus:ring-secondary/5 transition-all"
            >
                {Object.entries(FULL_MONTH_LABELS).map(([num, name]) => (
                    <option key={num} value={num}>{name}</option>
                ))}
            </select>

            <select 
                value={filterGroup} 
                onChange={(e) => setFilterGroup(e.target.value)} 
                className="text-sm border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-600 focus:ring-4 focus:ring-secondary/5 transition-all sm:ml-auto"
            >
                <option value="">Todos os Grupos</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>
        
        <div className="h-10 w-px bg-slate-100 hidden md:block mx-2" />
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                    "p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                    viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
            >
                <LayoutGrid size={14} /> Grid
            </button>
            <button 
                onClick={() => setViewMode('table')}
                className={cn(
                    "p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                    viewMode === 'table' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
            >
                <List size={14} /> Tabela
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {(Object.entries(grouped) as [string, any[]][]).map(([group, items]) => (
                <div key={group} className="space-y-6">
                    <SectionHeader 
                        icon={CATEGORY_ICONS[group] || LayoutGrid} 
                        title={group} 
                        subtitle={`${items.length} indicadores monitorados`}
                        tone={group === 'Faturamento' ? 'blue' : group === 'Rentabilidade' ? 'emerald' : group === 'Estrutura de Capital' ? 'rose' : 'primary'}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {items.map((r, i) => (
                            <KPICard key={i} r={r} />
                        ))}
                    </div>
                </div>
            ))}

            {Object.keys(grouped).length === 0 && !loading && (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                        <Info size={40} />
                    </div>
                    <p className="text-slate-400 font-medium italic max-w-sm">
                        Nenhum indicador encontrado para os filtros selecionados.
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
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-elegant scrollbar-thin"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">Grupo / Indicador</th>
                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Comp.</th>
                    <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(Object.entries(grouped) as [string, any[]][]).map(([group, items]) => (
                    <React.Fragment key={group}>
                      <tr className="bg-slate-50/30">
                        <td colSpan={4} className="py-4 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-secondary rounded-full" />
                            <span className="text-[11px] font-black text-primary uppercase tracking-widest">{group}</span>
                            <span className="text-[9px] text-slate-400 font-bold ml-2">({items.length})</span>
                          </div>
                        </td>
                      </tr>
                      {items.map((r, i) => (
                        <tr key={`${group}-${i}`} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-5 px-8 pl-14 font-semibold text-slate-700">{r.ind}</td>
                          <td className="py-5 px-8 text-slate-500 font-medium">{r.comp}</td>
                          <td className="py-5 px-8 text-right font-black text-primary">{formatValue(r.val, r.un)}</td>
                          <td className="py-5 px-8 text-right"><StatusBadge status={r.sem} /></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {Object.keys(grouped).length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-400 font-medium italic">
                        Nenhum indicador encontrado para os filtros selecionados.
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
