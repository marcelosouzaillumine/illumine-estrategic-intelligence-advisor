
import React, { useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileText, Users, TrendingDown, BarChart3, Layout, ShieldCheck, Clock, DollarSign, PieChart as PieIcon, Zap, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatValue, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';

interface AdministrativaPageProps {
  clientId: string;
}

export function AdministrativaPage({ clientId }: AdministrativaPageProps) {
  const [dbIndicators, setDbIndicators] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);

  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', selectedYear),
      where('mes', '==', selectedMonth)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbIndicators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const hasData = dbIndicators.length > 0;

  const indicators = useMemo(() => [
    { label: 'Overhead Administrativo', value: getIndicatorValue('Overhead', 0), suffix: '%', status: 'neutral', target: 10.0, icon: Layout },
    { label: 'Custo G&A por Colaborador', value: getIndicatorValue('Custo G&A', 0), isCur: true, status: 'positive', target: 1500, icon: Users },
    { label: 'Eficiência de Processos', value: getIndicatorValue('Eficiência Proc', 0), suffix: '%', status: 'positive', target: 80, icon: ShieldCheck },
    { label: 'Budget vs Realizado', value: getIndicatorValue('Budget Realizado', 0), suffix: '%', status: 'positive', target: 100, icon: PieIcon }
  ], [dbIndicators]);

  const departmentBreakdown = [
    { name: 'Financeiro', value: getIndicatorValue('Gasto Fin', 0), color: '#3b82f6' },
    { name: 'RH', value: getIndicatorValue('Gasto RH', 0), color: '#10b981' },
    { name: 'Jurídico', value: getIndicatorValue('Gasto Jur', 0), color: '#f59e0b' },
    { name: 'Facilities', value: getIndicatorValue('Gasto Fac', 0), color: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Indicadores Administrativos"
        subtitle="Monitoramento de eficiência de back-office, gestão de despesas fixas e otimização de processos de suporte."
        icon={FileText}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-success" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Back-office Target: <span className="text-success">Otimizado</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-card p-1 rounded-md border border-border shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-border">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-[10px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
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
                className="text-[10px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                  <option key={i} value={i + 1}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((kpi, idx) => (
          <ExecutiveMetricCard density="analytical" key={idx}
            label={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.isCur ? 'R$' : kpi.suffix || ''}
            icon={kpi.icon}
            tone={kpi.status === "positive" ? "success" : kpi.status === "negative" ? "critical" : "warning"}
          />
        ))}
      </div>

      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Department Breakdown */}
           <div className="lg:col-span-2 card-premium p-10 relative overflow-hidden">
              <h3 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                 <PieIcon size={20} className="text-secondary" /> Distribuição de Gastos Administrativos
              </h3>
              <div className="space-y-6">
                 {departmentBreakdown.map((dept, i) => {
                    const total = departmentBreakdown.reduce((acc, d) => acc + d.value, 0);
                    const percent = (dept.value / total) * 100;
                    return (
                      <div key={i} className="group">
                         <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-widest mb-2">
                            <span className="text-muted-foreground">{dept.name}</span>
                            <div className="flex gap-4">
                               <span className="text-muted-foreground/40 italic">{percent.toFixed(1)}%</span>
                               <span className="text-foreground tracking-tighter">{formatCurrency(dept.value)}</span>
                            </div>
                         </div>
                         <div className="h-2.5 bg-surface-container rounded-sm overflow-hidden shadow-inner border border-border">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              className="h-full rounded-sm shadow-premium"
                              style={{ backgroundColor: dept.color }}
                            />
                         </div>
                      </div>
                    );
                 })}
                 {departmentBreakdown.length === 0 && (
                   <p className="text-center text-muted-foreground/40 py-10 font-medium italic uppercase tracking-widest text-[10px]">Dados de distribuição não disponíveis</p>
                 )}
              </div>
           </div>

           {/* Admin Insights */}
           <div className="bg-executive p-10 rounded-md text-white shadow-premium relative overflow-hidden border border-white/5">
              <div className="absolute right-0 top-0 p-8 text-secondary/5 opacity-10 shadow-inner">
                 <Zap size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-8">
                 <h3 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] flex items-center gap-3 shadow-sm">
                    <MessageSquare size={20} /> Otimização Administrativa
                 </h3>
                 <div className="space-y-6">
                    {[
                      "Digitalizar processos de aprovação de despesas para reduzir lead time em 40%.",
                      "Consolidar fornecedores de facilities para ganho de escala e redução de 15% nos custos.",
                      "Revisar política de viagens e reembolsos para maior controle orçamentário."
                    ].map((rec, i) => (
                      <div key={i} className="flex gap-4 group cursor-default">
                         <div className="w-8 h-8 rounded-sm bg-white/10 border border-white/10 flex items-center justify-center text-secondary font-medium text-[10px] shrink-0 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                            {i + 1}
                         </div>
                         <p className="text-[11px] font-medium text-white/60 uppercase tracking-widest italic leading-relaxed group-hover:text-white transition-colors">
                            {rec}
                         </p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
