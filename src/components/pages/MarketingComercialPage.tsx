import React, { useMemo, useState, useEffect } from 'react';
import { 
  Globe, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Target, 
  Percent, 
  Zap,
  BarChart3,
  MessageSquare,
  Activity,
  ShieldCheck,
  LayoutDashboard,
  Search,
  ChevronRight,
  TrendingDown,
  Info,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageHeader, StatusBadge, KpiCard, KpiValue, ControlBar } from '../Common';
import { formatValue, cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { SalesPipelineManager } from '../SalesPipelineManager';

interface MarketingComercialPageProps {
  type: 'marketing' | 'comercial';
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

export function MarketingComercialPage({ type, clientId }: MarketingComercialPageProps) {
  const isMarketing = type === 'marketing';
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [view, setView] = useState<'dashboard' | 'pipeline'>('dashboard');
  const [pipelineEntries, setPipelineEntries] = useState<any[]>([]);
  const [periodMode, setPeriodMode] = useState<'mensal' | 'anual'>('mensal');

  useEffect(() => {
    if (!clientId || isMarketing) return;
    const q = query(
      collection(db, 'sales_pipeline'),
      where('clientId', '==', clientId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPipelineEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [clientId, isMarketing]);

  useEffect(() => {
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

  const indicators = useMemo(() => {
    if (isMarketing) {
      const awareness = getIndicatorValue('Brand Awareness', 0);
      const cpl = getIndicatorValue('CPL', 0);
      const roi = getIndicatorValue('ROI de Marketing', 0);
      const ltv = getIndicatorValue('LTV CAC Marketing', 0);
      const sov = getIndicatorValue('Share of Voice', 0);
      const sentimento = getIndicatorValue('Sentimento', 0);

      return [
        { label: 'Brand Awareness', value: awareness, suffix: '%', status: awareness === 0 ? 'neutral' : awareness >= 60 ? 'positive' : 'negative', target: 60, icon: Globe },
        { label: 'Custo por Lead (CPL)', value: cpl, isCur: true, status: cpl === 0 ? 'neutral' : cpl <= 50 ? 'positive' : 'negative', target: 50, icon: Users },
        { label: 'ROI de Marketing', value: roi, suffix: 'x', status: roi === 0 ? 'neutral' : roi >= 4.0 ? 'positive' : 'negative', target: 4.0, icon: TrendingUp },
        { label: 'LTV / CAC Marketing', value: ltv, suffix: 'x', status: ltv === 0 ? 'neutral' : ltv >= 3.0 ? 'positive' : 'negative', target: 3.0, icon: BarChart3 },
        { label: 'Share of Voice', value: sov, suffix: '%', status: sov === 0 ? 'neutral' : sov >= 25 ? 'positive' : 'negative', target: 25, icon: Globe },
        { label: 'Sentimento', value: sentimento, suffix: '%', status: sentimento === 0 ? 'neutral' : sentimento >= 80 ? 'positive' : 'negative', target: 80, icon: MessageSquare },
      ];
    } else {
      const mrr = getIndicatorValue('MRR', 0);
      const conv = getIndicatorValue('Taxa de Conversão', 0);
      const ticket = getIndicatorValue('Ticket Médio', 0);
      const churn = getIndicatorValue('Churn Rate', 0);
      const win = getIndicatorValue('Win Rate', 0);
      const cac = getIndicatorValue('CAC', 0);

      return [
        { label: 'Receita Recorrente (MRR)', value: mrr, isCur: true, status: mrr === 0 ? 'neutral' : mrr >= 100000 ? 'positive' : 'negative', target: 100000, icon: Target },
        { label: 'Taxa de Conversão', value: conv, suffix: '%', status: conv === 0 ? 'neutral' : conv >= 20 ? 'positive' : 'negative', target: 20, icon: ArrowUpRight },
        { label: 'Ticket Médio', value: ticket, isCur: true, status: ticket === 0 ? 'neutral' : ticket >= 2500 ? 'positive' : 'negative', target: 2500, icon: ShoppingBag },
        { label: 'Churn Rate', value: churn, suffix: '%', status: churn === 0 ? 'neutral' : churn <= 3.0 ? 'positive' : 'negative', target: 3.0, icon: ShieldCheck },
        { label: 'Win Rate', value: win, suffix: '%', status: win === 0 ? 'neutral' : win >= 30 ? 'positive' : 'negative', target: 30, icon: Target },
        { label: 'CAC Comercial', value: cac, isCur: true, status: cac === 0 ? 'neutral' : cac <= 500 ? 'positive' : 'negative', target: 500, icon: Users },
      ];
    }
  }, [isMarketing, dbIndicators]);

  const recommendations = useMemo(() => {
    if (isMarketing) {
      return [
        "Aumentar o Share of Mind em 15% através de campanhas focadas no propósito da marca.",
        "Otimizar o custo por lead qualificado (MQL) nos canais de busca paga.",
        "Fortalecer o posicionamento institucional para reduzir a dependência de descontos táticos."
      ];
    } else {
      return [
        "Reduzir o ciclo de vendas em 10% através de automação de follow-up no CRM.",
        "Implementar estratégia de Upsell para elevar o LTV dos clientes Tier A.",
        "Treinar a equipe comercial em técnicas de fechamento por proposta de valor."
      ];
    }
  }, [isMarketing]);


  const funnelData = useMemo(() => {
    const reach = getIndicatorValue('Alcance', 0);
    const clicks = getIndicatorValue('Cliques', 0);
    const leads = getIndicatorValue('Leads', 0);
    const opportunities = getIndicatorValue('Oportunidades', 0);
    const sales = getIndicatorValue('Vendas', 0);

    if (isMarketing) {
      return [
        { stage: 'Alcance/Impressões', value: reach, conversion: '100%', color: 'bg-slate-800' },
        { stage: 'Visitantes/Cliques', value: clicks, conversion: reach ? `${((clicks / reach) * 100).toFixed(1)}%` : '0%', color: 'bg-slate-700' },
        { stage: 'Leads Captados', value: leads, conversion: clicks ? `${((leads / clicks) * 100).toFixed(1)}%` : '0%', color: 'bg-emerald-700' },
        { stage: 'MQLs Qualificados', value: opportunities, conversion: leads ? `${((opportunities / leads) * 100).toFixed(1)}%` : '0%', color: 'bg-emerald-600' },
        { stage: 'SQLs (Vendas)', value: sales, conversion: opportunities ? `${((sales / opportunities) * 100).toFixed(1)}%` : '0%', color: 'bg-secondary' }
      ];
    }

    // Commercial Funnel from Pipeline Entries if available
    if (pipelineEntries.length > 0) {
      const stages = ['Prospecção', 'Qualificação', 'Proposta', 'Negociação', 'Fechamento'];
      const cumulativeData = stages.map((stage, i) => {
        const stageEntries = pipelineEntries.filter(e => e.etapa === stage);
        const count = stageEntries.length;
        const value = stageEntries.reduce((acc, curr) => acc + curr.valor, 0);
        
        // For pipeline funnel, we often show current stage count or cumulative
        // Let's show the count and the value
        return { stage, count, value };
      });

      return cumulativeData.map((data, idx) => ({
        stage: data.stage,
        value: data.count,
        labelValue: formatValue(data.value, 'R$'),
        conversion: idx === 0 ? '100%' : cumulativeData[idx-1].count ? `${((data.count / cumulativeData[idx-1].count) * 100).toFixed(0)}%` : '0%',
        color: idx === 0 ? 'bg-slate-800' : idx === 1 ? 'bg-slate-700' : idx === 2 ? 'bg-emerald-700' : idx === 3 ? 'bg-emerald-600' : 'bg-secondary'
      }));
    }

    return [
      { stage: 'Prospecção', value: leads, conversion: '100%', color: 'bg-slate-800' },
      { stage: 'Qualificação', value: opportunities, conversion: leads ? `${((opportunities / leads) * 100).toFixed(1)}%` : '0%', color: 'bg-slate-700' },
      { stage: 'Proposta', value: Math.round(opportunities * 0.8), conversion: '80%', color: 'bg-emerald-700' },
      { stage: 'Negociação', value: Math.round(opportunities * 0.5), conversion: '50%', color: 'bg-emerald-600' },
      { stage: 'Fechamento', value: sales, conversion: opportunities ? `${((sales / opportunities) * 100).toFixed(1)}%` : '0%', color: 'bg-secondary' }
    ];
  }, [isMarketing, dbIndicators, pipelineEntries]);

  const performanceData = useMemo(() => {
    // If we have no real data, we return empty arrays for performance matrix to avoid mockup artifacts
    if (!hasData) {
      return { vendedores: [], regioes: [], produtos: [], unidades: [] };
    }

    // Attempt to map real data if available, otherwise empty
    // For now, we'll return empty to avoid showing mock data if not explicit
    return { vendedores: [], regioes: [], produtos: [], unidades: [] };
  }, [isMarketing, hasData]);

  const getAbcColor = (abc: string) => {
    switch(abc) {
      case 'A': return 'bg-success-soft0 text-white shadow-emerald-500/20';
      case 'B': return 'bg-warning-soft0 text-white shadow-amber-500/20';
      case 'C': return 'bg-slate-400 text-white shadow-slate-400/20';
      default: return 'bg-slate-200 text-muted-foreground';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title={isMarketing ? 'Marketing de Posicionamento' : 'Vendas & Mercado'} 
        subtitle={isMarketing 
          ? 'Gestão de comunicação, branding e geração de leads sob a ótica de monitoramento estratégico.' 
          : 'Monitoramento de performance comercial, inteligência de mercado e taxas de conversão.'}
        icon={isMarketing ? <Globe size={24} className="text-secondary" /> : <ShoppingBag size={24} className="text-secondary" />}
        color="executive"
      />

      {/* Control Bar */}
      <ControlBar 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        periodMode={periodMode}
        setPeriodMode={setPeriodMode}
        tabs={!isMarketing ? [
          { id: 'dashboard', label: 'DASHBOARD' },
          { id: 'pipeline', label: 'GESTÃO DE PIPELINE' }
        ] : undefined}
        activeTab={!isMarketing ? view : undefined}
        setActiveTab={!isMarketing ? (tab) => setView(tab as any) : undefined}
      />


      {view === 'pipeline' ? (
        <SalesPipelineManager clientId={clientId} />
      ) : (
        <>

      {/* Funnel & Performance Grid - Hidden if no data */}
      {hasData && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-5 card-premium p-10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] mb-2">Fluxo de Conversão</h3>
                <h2 className="text-xl font-medium text-foreground uppercase tracking-widest">Funil de Vendas</h2>
              </div>
              <div className="w-12 h-12 rounded-sm bg-surface-container border border-border flex items-center justify-center text-muted-foreground/30 shadow-inner">
                <Zap size={24} />
              </div>
            </div>

            <div className="space-y-2 relative">
              {funnelData.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group cursor-pointer"
                >
                  <div 
                    className={cn(
                      "h-16 flex items-center justify-between px-8 rounded-sm text-white transition-all duration-500 group-hover:scale-[1.02] shadow-premium",
                      item.color
                    )}
                    style={{ 
                      width: `${100 - (idx * 10)}%`, 
                      marginLeft: `${idx * 5}%` 
                    }}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-widest">{item.stage}</span>
                    <div className="text-right">
                      <p className="text-lg font-medium tabular-nums tracking-tighter">
                        {item.value} {item.labelValue && <span className="text-[10px] opacity-60 ml-2 italic">{item.labelValue}</span>}
                      </p>
                      <p className="text-[9px] font-medium text-white/50 uppercase tracking-widest tabular-nums italic">{item.conversion}</p>
                    </div>
                  </div>
                  {/* Connector line */}
                  {idx < funnelData.length - 1 && (
                    <div className="h-2 w-px bg-slate-100 mx-auto opacity-50" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Performance Matrix Grid - Simplified */}
            {[
              { title: isMarketing ? 'Canais de Aquisição' : 'Vendedores & Repr.', data: performanceData.vendedores, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/5' },
              { title: isMarketing ? 'Principais Campanhas' : 'Análise por Região', data: performanceData.regioes, icon: Globe, color: 'text-success', bg: 'bg-success/5' }
            ].filter(s => s.data.length > 0).map((section, idx) => (
              <div key={idx} className="card-premium p-8 group relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("w-10 h-10 rounded-sm flex items-center justify-center border border-border shadow-inner", section.bg, section.color)}>
                    {(() => {
                      const Icon = section.icon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <h3 className="text-[11px] font-medium text-foreground uppercase tracking-widest">{section.title}</h3>
                </div>
                <div className="space-y-6">
                  {section.data.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-medium shrink-0 shadow-sm",
                          getAbcColor(item.abc)
                        )}>
                          {item.abc}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground">{item.name}</p>
                          <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">{item.share} do Total</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-foreground tabular-nums tracking-tighter">
                          {formatValue(item.value, 'R$')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-8">
        {indicators.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            title={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.isCur ? 'R$' : kpi.suffix || ''}
            icon={kpi.icon}
            status={kpi.status === 'positive' ? 'Verde' : kpi.status === 'negative' ? 'Vermelho' : 'Amarelo'}
          />
        ))}
      </div>


      {/* Main Analysis Section - Hidden if no data */}
      {hasData && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           {/* Chart Placeholder */}
           <div className="xl:col-span-2 card-premium p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-muted-foreground">
                <BarChart3 size={240} />
              </div>
              <div className="flex justify-between items-center mb-12 relative z-10">
                 <div>
                    <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.25em] mb-2 italic">Performance Histórica vs Projetada</h3>
                    <h2 className="text-xl font-medium text-foreground uppercase tracking-widest flex items-center gap-3">
                      Tendência de Crescimento Setorial
                    </h2>
                 </div>
              </div>
              
              <div className="h-[400px] bg-surface-container/30 rounded-md flex flex-col items-center justify-center border border-dashed border-border group hover:border-secondary/30 transition-all cursor-pointer shadow-inner">
                <div className="w-20 h-20 rounded-sm bg-card border border-border flex items-center justify-center text-muted-foreground/20 group-hover:text-secondary group-hover:scale-110 transition-all shadow-premium mb-6">
                  <Activity size={40} />
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[11px] mb-2 italic">Motor de Análise em Processamento</p>
                <p className="text-muted-foreground/40 text-[10px] font-medium uppercase tracking-widest italic">Clique para sincronizar com dados de mercado</p>
              </div>
           </div>

           {/* Recommendations & Action Plan */}
           <div className="bg-executive p-12 rounded-md text-white shadow-premium relative overflow-hidden flex flex-col border border-white/5">
              <div className="absolute right-0 top-0 p-12 text-secondary/5">
                 <MessageSquare size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                 <div className="mb-12">
                    <p className="text-[10px] font-medium text-secondary uppercase tracking-[0.3em] mb-2">Deep Insights</p>
                    <h3 className="text-xl font-medium text-white uppercase tracking-widest flex items-center gap-3">
                      Recomendações Estratégicas
                    </h3>
                 </div>

                 <div className="space-y-10 flex-1">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-6 group cursor-default">
                         <div className="w-10 h-10 rounded-sm bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-medium text-sm shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all duration-500 shadow-lg">
                            {i + 1}
                         </div>
                         <div className="space-y-1">
                           <p className="text-sm font-medium text-white leading-relaxed group-hover:text-secondary transition-colors italic">
                              {rec}
                           </p>
                           <div className="h-0.5 w-0 group-hover:w-full bg-secondary/30 transition-all duration-700" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
