
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
import { cn, formatValue, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';

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

  const bvaData = useMemo(() => {
    if (!hasData) return [];
    return [
      { name: 'Jan', planejado: getIndicatorValue('Budget Jan', 0), realizado: getIndicatorValue('Real Jan', 0) },
      { name: 'Fev', planejado: getIndicatorValue('Budget Fev', 0), realizado: getIndicatorValue('Real Fev', 0) },
      { name: 'Mar', planejado: getIndicatorValue('Budget Mar', 0), realizado: getIndicatorValue('Real Mar', 0) },
      { name: 'Abr', planejado: getIndicatorValue('Budget Abr', 0), realizado: getIndicatorValue('Real Abr', 0) },
      { name: 'Mai', planejado: getIndicatorValue('Budget Mai', 0), realizado: getIndicatorValue('Real Mai', 0) },
      { name: 'Jun', planejado: getIndicatorValue('Budget Jun', 0), realizado: getIndicatorValue('Real Jun', 0) },
    ];
  }, [dbIndicators, hasData]);

  const adherenceScore = getIndicatorValue('Aderência Orçamentária', 0);
  const complianceScore = getIndicatorValue('Conformidade', 0);

  const deviationRows = useMemo(() => {
    if (!hasData) return [];
    return [];
  }, [hasData]);

  const indicators = useMemo(() => [
    { label: 'Aderência Orçamentária', value: adherenceScore, suffix: '%', status: 'neutral', target: 98.0, icon: Scale, trend: 'Calculado' },
    { label: 'Margem EBITDA Realizada', value: getIndicatorValue('Margem EBITDA', 0), suffix: '%', status: 'positive', target: 20.0, icon: TrendingUp, trend: 'Real' },
    { label: 'Burn Rate Mensal', value: getIndicatorValue('Burn Rate', 0), isCur: true, status: 'positive', target: 150000, icon: WalletCards, trend: 'Mensal' },
    { label: 'Índice de Alavancagem', value: getIndicatorValue('Alavancagem', 0), suffix: 'x', status: 'positive', target: 2.5, icon: Landmark, trend: 'Estável' }
  ], [dbIndicators, adherenceScore]);

  return (
    <div className="space-y-10 pb-32">
      {/* Strategic Header & Controls - Exactly matching DashboardPage */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Scale size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Controladoria Estratégica</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium whitespace-nowrap">Auditoria de processos e monitoramento de aderência orçamentária para máxima eficiência operacional.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1 shadow-inner">
            <div className="flex items-center px-4 py-2 border-r border-white/5">
              <Calendar size={14} className="text-secondary mr-2" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y} className="bg-primary">{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                  <option key={i} value={i + 1} className="bg-primary">{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Health Mini-Header - Hidden if no data */}
      {hasData && (
        <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 bg-secondary h-full" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center text-secondary shadow-inner group-hover:scale-105 transition-transform">
              <Scale size={40} />
            </div>
            <div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Score de Aderência Orçamentária</h3>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-display font-black text-slate-900 tracking-tighter">{adherenceScore}%</span>
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border",
                  adherenceScore >= 90 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
                )}>
                  {adherenceScore >= 90 ? 'Eficiente' : 'Atenção'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg w-full relative z-10">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
              <span>Conformidade de Processos</span>
              <span className="text-secondary">{complianceScore}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${complianceScore}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-secondary shadow-[0_0_10px_rgba(255,133,82,0.3)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const maxGroupLen = Math.max(...indicators.map(kpi => formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '').length));
          const groupSizeClass = getValueSizeClass(maxGroupLen);
          
          return indicators.map((kpi, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-secondary/10 transition-all group relative overflow-hidden"
            >
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-125 transition-transform" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg">
                  {(() => {
                    const Icon = kpi.icon;
                    return <Icon size={24} />;
                  })()}
                 </div>
                 {kpi.trend && (
                    <div className={cn(
                        "px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-full backdrop-blur-sm",
                        kpi.trend.startsWith('+') ? "text-emerald-600 border-emerald-100 bg-emerald-50/50" : kpi.trend.startsWith('-') ? "text-rose-600 border-rose-100 bg-rose-50/50" : "text-slate-400 border-slate-100 bg-slate-50/50"
                    )}>
                      {kpi.trend}
                    </div>
                 )}
              </div>
              
              <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 line-clamp-1">{kpi.label}</p>
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <p className={cn(
                    "font-display font-black text-slate-900 tabular-nums tracking-tighter group-hover:text-secondary transition-colors",
                    groupSizeClass
                  )}>
                    {formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '')}
                  </p>
                </div>
              </div>
            </motion.div>
          ));
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* BvA Chart */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm interactive-card">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
               <div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                    <BarChart3 size={20} className="text-secondary" /> Budget vs Realizado
                 </h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Análise de desvios orçamentários (YTD)</p>
               </div>
               <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-slate-400">
                     <div className="w-3 h-3 bg-slate-200 rounded-full" /> Planejado
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                     <div className="w-3 h-3 bg-secondary rounded-full" /> Realizado
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bvaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                    <Bar name="Planejado" dataKey="planejado" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar name="Realizado" dataKey="realizado" fill="#ff8552" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Recommendations - Hidden if no data */}
         {hasData && (
           <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-8 text-secondary/5 group-hover:text-secondary/10 transition-colors">
                 <Zap size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                 <div className="space-y-8">
                   <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                      <MessageSquare size={20} /> Insights de Controladoria
                   </h3>
                   <div className="space-y-6">
                      {[
                        "Investigar desvios orçamentários significativos em relação ao budget planejado.",
                        "Antecipar revisão orçamentária do semestre considerando as novas premissas.",
                        "Auditar processos de compras críticos para garantir conformidade de processos."
                      ].map((rec, i) => (
                        <div key={i} className="flex gap-5 group cursor-default">
                           <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black text-xs shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all shadow-inner">
                              {i + 1}
                           </div>
                           <p className="text-xs font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors py-2">
                              {rec}
                           </p>
                        </div>
                      ))}
                   </div>
                 </div>
                 <button className="w-full py-4 bg-white/10 hover:bg-secondary hover:text-primary border border-white/10 hover:border-secondary rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
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
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-secondary shadow-inner">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-display font-black text-slate-900">Monitoramento de Desvios Orçamentários</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relação de itens com maior variação vs. budget</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Alerta ({'>'}90%)
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Crítico ({'>'}100%)
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item de Custo</th>
                    <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Planejado</th>
                    <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Realizado</th>
                    <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Índice de Uso</th>
                    <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {deviationRows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-1 h-8 rounded-full",
                            row.indice > 100 ? "bg-rose-500" : row.indice > 90 ? "bg-amber-500" : "bg-emerald-500"
                          )} />
                          <span className="font-bold text-slate-800 group-hover:text-secondary transition-colors">{row.item}</span>
                        </div>
                      </td>
                      <td className="py-6 px-10 text-right text-slate-500 font-medium">{formatCurrency(row.planejado)}</td>
                      <td className="py-6 px-10 text-right font-display font-black text-slate-900">{formatCurrency(row.realizado)}</td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <span className={cn(
                             "text-lg font-display font-black",
                             row.indice > 100 ? "text-rose-600" : row.indice > 90 ? "text-amber-600" : "text-emerald-600"
                           )}>{row.indice}%</span>
                        </div>
                      </td>
                      <td className="py-6 px-10">
                        <div className="flex justify-center">
                          {row.indice > 100 ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest animate-pulse">
                              <ShieldAlert size={12} /> Crítico
                            </div>
                          ) : row.indice > 90 ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                              <AlertCircle size={12} /> Alerta
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
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

