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
  Calendar,
  LayoutDashboard,
  Search,
  ChevronRight,
  TrendingDown,
  Info,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { StatusBadge } from '../Common';
import { formatValue, cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

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

  const [isYTD, setIsYTD] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i).sort((a, b) => b - a);
  }, []);

  const indicators = useMemo(() => {
    if (isMarketing) {
      return [
        { label: 'Brand Awareness', value: getIndicatorValue('Brand Awareness', 0), suffix: '%', status: 'positive', target: 60, icon: Globe },
        { label: 'Custo por Lead (CPL)', value: getIndicatorValue('CPL', 0), isCur: true, status: 'positive', target: 50, icon: Users },
        { label: 'ROI de Marketing', value: getIndicatorValue('ROI de Marketing', 0), suffix: 'x', status: 'positive', target: 4.0, icon: TrendingUp },
        { label: 'LTV / CAC Marketing', value: getIndicatorValue('LTV CAC Marketing', 0), suffix: 'x', status: 'positive', target: 3.0, icon: BarChart3 },
        { label: 'Share of Voice', value: getIndicatorValue('Share of Voice', 0), suffix: '%', status: 'positive', target: 25, icon: Globe },
        { label: 'Sentimento', value: getIndicatorValue('Sentimento', 0), suffix: '%', status: 'positive', target: 80, icon: MessageSquare },
      ];
    } else {
      return [
        { label: 'Receita Recorrente (MRR)', value: getIndicatorValue('MRR', 0), isCur: true, status: 'positive', target: 100000, icon: Target },
        { label: 'Taxa de Conversão', value: getIndicatorValue('Taxa de Conversão', 0), suffix: '%', status: 'positive', target: 20, icon: ArrowUpRight },
        { label: 'Ticket Médio', value: getIndicatorValue('Ticket Médio', 0), isCur: true, status: 'positive', target: 2500, icon: ShoppingBag },
        { label: 'Churn Rate', value: getIndicatorValue('Churn Rate', 0), suffix: '%', status: 'negative', target: 3.0, icon: ShieldCheck },
        { label: 'Win Rate', value: getIndicatorValue('Win Rate', 0), suffix: '%', status: 'positive', target: 30, icon: Target },
        { label: 'CAC Comercial', value: getIndicatorValue('CAC', 0), isCur: true, status: 'positive', target: 500, icon: Users },
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
    return [
      { stage: 'Prospecção', value: leads, conversion: '100%', color: 'bg-slate-800' },
      { stage: 'Qualificação', value: opportunities, conversion: leads ? `${((opportunities / leads) * 100).toFixed(1)}%` : '0%', color: 'bg-slate-700' },
      { stage: 'Proposta', value: Math.round(opportunities * 0.8), conversion: '80%', color: 'bg-emerald-700' },
      { stage: 'Negociação', value: Math.round(opportunities * 0.5), conversion: '50%', color: 'bg-emerald-600' },
      { stage: 'Fechamento', value: sales, conversion: opportunities ? `${((sales / opportunities) * 100).toFixed(1)}%` : '0%', color: 'bg-secondary' }
    ];
  }, [isMarketing, dbIndicators]);

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
      case 'A': return 'bg-emerald-500 text-white shadow-emerald-500/20';
      case 'B': return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'C': return 'bg-slate-400 text-white shadow-slate-400/20';
      default: return 'bg-slate-200 text-slate-500';
    }
  };

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      {/* Premium Header Standardized to Monitoring Pattern */}
      <div className={cn(
        "flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden transition-all duration-700 bg-slate-900"
      )}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
              {isMarketing ? <Globe className="text-secondary" size={28} /> : <ShoppingBag className="text-secondary" size={28} />}
            </div>
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight leading-none mb-2">
                {isMarketing ? 'Marketing de Posicionamento' : 'Vendas & Mercado'}
              </h1>
              <p className="text-slate-400 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {isMarketing 
                  ? 'Gestão de comunicação, branding e geração de leads sob a ótica de monitoramento estratégico.' 
                  : 'Monitoramento de performance comercial, inteligência de mercado e taxas de conversão.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1 shadow-inner">
            <div className="flex items-center px-4 py-2 border-r border-white/5">
              <Calendar size={14} className="text-secondary mr-2" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors appearance-none pr-1"
              >
                {years.map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors appearance-none pr-1"
              >
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                  <option key={i} value={i + 1} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Group 2: View Toggle */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-2.5 border border-white/10 shadow-inner h-[46px]">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", !isYTD ? "text-secondary" : "text-slate-500")}>Mensal</span>
            <button 
              onClick={() => setIsYTD(!isYTD)}
              className={cn(
                "w-10 h-5 rounded-full p-1 transition-colors relative group",
                isYTD ? "bg-secondary" : "bg-slate-700 hover:bg-slate-600"
              )}
            >
              <motion.div 
                animate={{ x: isYTD ? 20 : 0 }}
                className="w-3 h-3 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform" 
              />
            </button>
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isYTD ? "text-secondary" : "text-slate-500")}>Anual</span>
          </div>
 
        </div>
      </div>

      {/* Funnel & Performance Grid - Hidden if no data */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Fluxo de Conversão</h3>
                <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Funil de Vendas</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
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
                      "h-16 flex items-center justify-between px-8 rounded-2xl text-white transition-all duration-500 group-hover:scale-[1.02] shadow-sm",
                      item.color
                    )}
                    style={{ 
                      width: `${100 - (idx * 10)}%`, 
                      marginLeft: `${idx * 5}%` 
                    }}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.stage}</span>
                    <div className="text-right">
                      <p className="text-lg font-display font-black">{item.value}</p>
                      <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{item.conversion}</p>
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

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Performance Matrix Grid - Simplified */}
            {[
              { title: isMarketing ? 'Canais de Aquisição' : 'Vendedores & Repr.', data: performanceData.vendedores, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: isMarketing ? 'Principais Campanhas' : 'Análise por Região', data: performanceData.regioes, icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' }
            ].filter(s => s.data.length > 0).map((section, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", section.bg, section.color)}>
                    {(() => {
                      const Icon = section.icon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{section.title}</h3>
                </div>
                <div className="space-y-6">
                  {section.data.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm",
                          getAbcColor(item.abc)
                        )}>
                          {item.abc}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.share} do Total</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-display font-black text-slate-900">
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

      {/* KPI Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {(() => {
          const maxGroupLen = Math.max(...indicators.map(kpi => formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '').length));
          const groupSizeClass = getValueSizeClass(maxGroupLen);
          
          return indicators.map((kpi, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none group-hover:bg-slate-100/50 transition-colors" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="w-16 h-16 rounded-[22px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg">
                  {(() => {
                    const Icon = kpi.icon;
                    return <Icon size={28} />;
                  })()}
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm",
                  kpi.status === 'positive' ? "text-emerald-600 border-emerald-100 bg-emerald-50/50" : kpi.status === 'negative' ? "text-rose-600 border-rose-100 bg-rose-50/50" : "text-amber-600 border-amber-100 bg-amber-50/50"
                )}>
                  {hasData ? (kpi.status === 'positive' ? 'Otimizado' : kpi.status === 'negative' ? 'Alerta' : 'Estável') : 'Aguardando'}
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">{isMarketing ? 'Marketing' : 'Comercial'}</p>
                <h4 className="text-lg font-display font-black text-slate-900 leading-tight group-hover:text-secondary transition-colors mb-6 line-clamp-1">
                  {kpi.label}
                </h4>
                
                <div className="bg-slate-50/50 rounded-3xl p-6 mb-8 group-hover:bg-white group-hover:shadow-inner transition-all border border-slate-100/50">
                  <p className={cn("font-display font-black text-slate-900 tabular-nums tracking-tighter", groupSizeClass)}>
                    {formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '')}
                  </p>
                </div>
              </div>
            </motion.div>
          ));
        })()}
      </div>


      {/* Main Analysis Section - Hidden if no data */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart Placeholder */}
           <div className="lg:col-span-2 bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <BarChart3 size={240} />
              </div>
              <div className="flex justify-between items-center mb-12 relative z-10">
                 <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Performance Histórica vs Projetada</h3>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-3">
                      Tendência de Crescimento Setorial
                    </h2>
                 </div>
              </div>
              
              <div className="h-[400px] bg-slate-50 rounded-[40px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group hover:border-secondary/30 transition-all cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-secondary group-hover:scale-110 transition-all shadow-sm mb-6">
                  <Activity size={40} />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px] mb-2">Motor de Análise em Processamento</p>
                <p className="text-slate-300 text-xs font-medium">Clique para sincronizar com dados de mercado em tempo real</p>
              </div>
           </div>

           {/* Recommendations & Action Plan */}
           <div className="bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute right-0 top-0 p-12 text-secondary/5">
                 <MessageSquare size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                 <div className="mb-12">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">Deep Insights</p>
                    <h3 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-3">
                      Recomendações Estratégicas
                    </h3>
                 </div>

                 <div className="space-y-10 flex-1">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-6 group cursor-default">
                         <div className="w-10 h-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black text-sm shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all duration-500 shadow-lg">
                            {i + 1}
                         </div>
                         <div className="space-y-1">
                           <p className="text-sm font-bold text-white leading-relaxed group-hover:text-secondary transition-colors">
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
    </div>
  );
}
