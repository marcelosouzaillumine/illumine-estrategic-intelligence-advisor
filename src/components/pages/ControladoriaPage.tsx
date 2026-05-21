import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Scale, 
  WalletCards,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Zap,
  MessageSquare,
  Landmark,
  Calendar,
  Target,
  ArrowUpRight,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { cn, formatValue, formatCurrency, getThemeColors } from '../../lib/utils';
import { PageHeader, KpiCard, KpiValue, ControlBar } from '../Common';

interface ControladoriaPageProps {
  clientId: string;
}

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

export function ControladoriaPage({ clientId }: ControladoriaPageProps) {
  const [dbIndicators, setDbIndicators] = React.useState<any[]>([]);
  const [budgets, setBudgets] = React.useState<any[]>([]);
  const [actuals, setActuals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);

  const [, setThemeTrigger] = React.useState(0);
  React.useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();

  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    // 1. Indicators
    const qInd = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', selectedYear),
      where('mes', '==', selectedMonth)
    );
    const unsubInd = onSnapshot(qInd, (snapshot) => {
      setDbIndicators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Budgets
    const qBud = query(
      collection(db, 'budgets'),
      where('clientId', '==', clientId),
      where('year', '==', selectedYear),
      where('month', '==', selectedMonth)
    );
    const unsubBud = onSnapshot(qBud, (snapshot) => {
      setBudgets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. Actuals (DRE Gerencial)
    const qAct = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('year', '==', selectedYear),
      where('month', '==', selectedMonth),
      where('type', '==', 'DRE Gerencial')
    );
    const unsubAct = onSnapshot(qAct, (snapshot) => {
      const entries: any[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        if (data.status && data.status !== 'approved') return;
        
        if (Array.isArray(data.data)) {
          data.data.forEach((e: any) => entries.push(e));
        } else {
          entries.push(data);
        }
      });
      setActuals(entries);
      setLoading(false);
    });

    return () => {
      unsubInd();
      unsubBud();
      unsubAct();
    };
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const hasData = dbIndicators.length > 0 || budgets.length > 0;

  // Comparison Logic
  const deviationRows = useMemo(() => {
    const rows: any[] = [];
    budgets.forEach(b => {
      const actual = actuals.find(a => a.category === b.accountName || a.category === b.accountCode);
      const realVal = actual ? actual.value : 0;
      const budgetVal = b.valor || 0;
      const indice = budgetVal > 0 ? Math.round((realVal / budgetVal) * 100) : 0;
      
      rows.push({
        item: b.accountName,
        planejado: budgetVal,
        realizado: realVal,
        indice: indice
      });
    });
    return rows.sort((a, b) => b.indice - a.indice);
  }, [budgets, actuals]);

  const totalPlanned = budgets.reduce((acc, curr) => acc + curr.valor, 0);
  const totalRealized = actuals.reduce((acc, curr) => acc + curr.value, 0);
  const adherenceScore = totalPlanned > 0 ? Math.max(0, 100 - Math.abs(Math.round(((totalRealized - totalPlanned) / totalPlanned) * 100))) : 0;
  const complianceScore = 95; // Indicador de conformidade de processos corporativos

  const bvaData = useMemo(() => {
    // Current month comparison
    return [
      { name: 'Mês Ref.', planejado: totalPlanned, realizado: totalRealized }
    ];
  }, [totalPlanned, totalRealized]);

  const indicators = useMemo(() => [
    { label: 'Aderência Orçamentária', value: adherenceScore, suffix: '%', status: 'neutral', target: 98.0, icon: Scale, trend: 'Calculado' },
    { label: 'Margem EBITDA Realizada', value: getIndicatorValue('Margem EBITDA', 0), suffix: '%', status: 'positive', target: 20.0, icon: TrendingUp, trend: 'Real' },
    { label: 'Burn Rate Mensal', value: getIndicatorValue('Burn Rate', 0), isCur: true, status: 'positive', target: 150000, icon: WalletCards, trend: 'Mensal' },
    { label: 'Índice de Alavancagem', value: getIndicatorValue('Alavancagem', 0), suffix: 'x', status: 'positive', target: 2.5, icon: Landmark, trend: 'Estável' }
  ], [dbIndicators, adherenceScore]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32">
      <PageHeader 
        title="Controladoria Estratégica" 
        subtitle="Auditoria de processos e monitoramento de aderência orçamentária para máxima eficiência operacional."
        icon={Scale}
        color="executive"
      />

      {/* Control Bar */}
      <ControlBar 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        showStatusBadge={true}
        statusBadgeLabel="Auditoria & Compliance Ativo"
      />


      {/* Corporate Health Mini-Header - Hidden if no data */}
      {hasData && (
        <div className="card-premium p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 bg-secondary h-full shadow-sm" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 rounded-md bg-secondary/5 flex items-center justify-center text-secondary shadow-inner group-hover:scale-105 transition-transform">
              <Scale size={40} />
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2">Score de Aderência Orçamentária</h3>
              <div className="flex items-center gap-4 whitespace-nowrap overflow-visible">
                <span className="text-5xl font-medium text-foreground tracking-tighter tabular-nums">{adherenceScore}%</span>
                <span className={cn(
                  "text-[9px] font-medium uppercase tracking-widest px-4 py-1.5 rounded-sm border shadow-sm",
                  adherenceScore >= 90 ? "text-success bg-success/10 border-success/20" : "text-warning bg-warning/10 border-warning/20"
                )}>
                  {adherenceScore >= 90 ? 'Eficiente' : 'Atenção'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg w-full relative z-10">
            <div className="flex justify-between text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              <span>Conformidade de Processos</span>
              <span className="text-secondary">{complianceScore}%</span>
            </div>
            <div className="h-3 bg-surface-container rounded-sm overflow-hidden shadow-inner border border-border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${complianceScore}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-secondary shadow-premium"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            title={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.isCur ? 'R$' : kpi.suffix || ''}
            icon={kpi.icon}
            status={kpi.status === 'positive' ? 'Verde' : kpi.status === 'negative' ? 'Vermelho' : 'Amarelo'}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* BvA Chart */}
         <div className="lg:col-span-2 card-premium p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
               <div>
                 <h3 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                    <BarChart3 size={20} className="text-secondary" /> Budget vs Realizado
                 </h3>
                 <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mt-1 italic">Análise de desvios orçamentários (YTD)</p>
               </div>
               <div className="flex items-center gap-6 text-[9px] font-medium uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-muted-foreground/40">
                     <div className="w-2.5 h-2.5 bg-surface-container rounded-sm border border-border shadow-inner" /> Planejado
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                     <div className="w-2.5 h-2.5 bg-secondary rounded-sm shadow-premium" /> Realizado
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bvaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: colors.mutedForeground, fontWeight: 500, letterSpacing: '0.1em' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: colors.mutedForeground, fontWeight: 500 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: colors.cardBg, borderRadius: '4px', border: `1px solid ${colors.border}`, color: colors.cardFg, boxShadow: 'var(--shadow-premium)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      itemStyle={{ fontWeight: 600 }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }} />
                    <Bar name="Planejado" dataKey="planejado" fill={colors.primary} radius={[2, 2, 0, 0]} barSize={32} opacity={0.65} />
                    <Bar name="Realizado" dataKey="realizado" fill={colors.secondary} radius={[2, 2, 0, 0]} barSize={32} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Recommendations - Hidden if no data */}
         {hasData && (
            <div className="bg-executive p-10 rounded-md text-white shadow-premium relative overflow-hidden group border border-white/5">
               <div className="absolute right-0 top-0 p-8 text-secondary/5 group-hover:text-secondary/10 transition-colors opacity-10 shadow-inner">
                  <Zap size={160} strokeWidth={1} />
               </div>
               <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="space-y-8">
                     <h3 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] flex items-center gap-3 shadow-sm">
                        <MessageSquare size={20} /> Insights de Controladoria
                     </h3>
                     <div className="space-y-6">
                        {[
                          "Investigar desvios orçamentários significativos em relação ao budget planejado.",
                          "Antecipar revisão orçamentária do semestre considerando as novas premissas.",
                          "Auditar processos de compras críticos para garantir conformidade de processos."
                        ].map((rec, i) => (
                          <div key={i} className="flex gap-5 group cursor-default">
                             <div className="w-10 h-10 rounded-sm bg-white/10 border border-white/10 flex items-center justify-center text-secondary font-medium text-[10px] shrink-0 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                                {i + 1}
                             </div>
                             <p className="text-[11px] font-medium text-white/60 uppercase tracking-widest italic leading-relaxed group-hover:text-white transition-colors py-2">
                                {rec}
                             </p>
                          </div>
                        ))}
                     </div>
                  </div>
                  <button className="btn-executive w-full bg-white/5 hover:bg-white/10 border border-white/10 uppercase shadow-sm">
                     <Activity size={14} /> Gerar Relatório de Auditoria
                  </button>
               </div>
            </div>
         )}
      </div>

      {/* Budget Deviation Table - Hidden if no data */}
      {hasData && deviationRows.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center text-secondary shadow-inner border border-border">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-medium text-foreground tracking-tight uppercase">Monitoramento de Desvios Orçamentários</h2>
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic mt-1">Relação de itens com maior variação vs. budget</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-widest text-muted-foreground/60 shadow-sm">
                 <div className="w-2.5 h-2.5 rounded-sm bg-warning" /> Alerta ({'>'}90%)
              </div>
              <div className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-widest text-muted-foreground/60 shadow-sm">
                 <div className="w-2.5 h-2.5 rounded-sm bg-destructive" /> Crítico ({'>'}100%)
              </div>
            </div>
          </div>

          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container/50 border-b border-border">
                    <th className="text-left py-6 px-10 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Item de Custo</th>
                    <th className="text-right py-6 px-10 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Budget Planejado</th>
                    <th className="text-right py-6 px-10 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Valor Realizado</th>
                    <th className="text-right py-6 px-10 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Índice de Uso</th>
                    <th className="text-center py-6 px-10 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deviationRows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-surface-container/30 transition-colors group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-1 h-8 rounded-sm shadow-sm",
                            row.indice > 100 ? "bg-destructive" : row.indice > 90 ? "bg-warning" : "bg-success"
                          )} />
                          <span className="font-medium text-foreground group-hover:text-secondary transition-colors uppercase tracking-tighter">{row.item}</span>
                        </div>
                      </td>
                      <td className="py-6 px-10 text-right text-muted-foreground/60 font-medium tabular-nums">{formatCurrency(row.planejado)}</td>
                      <td className="py-6 px-10 text-right font-medium text-foreground tabular-nums tracking-tighter">{formatCurrency(row.realizado)}</td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <span className={cn(
                             "text-lg font-medium tabular-nums tracking-tighter",
                             row.indice > 100 ? "text-destructive" : row.indice > 90 ? "text-warning" : "text-success"
                           )}>{row.indice}%</span>
                        </div>
                      </td>
                      <td className="py-6 px-10">
                        <div className="flex justify-center">
                          {row.realizado === 0 ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-surface-container text-muted-foreground border border-border text-[8px] font-medium uppercase tracking-widest shadow-sm">
                              Pendente
                            </div>
                          ) : row.indice > 100 ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 text-[8px] font-medium uppercase tracking-widest animate-pulse shadow-sm">
                              <ShieldAlert size={12} /> Crítico
                            </div>
                          ) : row.indice > 90 ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-warning/10 text-warning border border-warning/20 text-[8px] font-medium uppercase tracking-widest shadow-sm">
                              <AlertCircle size={12} /> Alerta
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-success/10 text-success border border-success/20 text-[8px] font-medium uppercase tracking-widest shadow-sm">
                              <CheckCircle2 size={12} /> Saudável
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
