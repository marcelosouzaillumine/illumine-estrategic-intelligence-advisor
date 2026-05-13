import React, { useMemo, useState } from 'react';
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
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(5);

  const [isYTD, setIsYTD] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i).sort((a, b) => b - a);
  }, []);

  const indicators = useMemo(() => {
    if (isMarketing) {
      return [
        { label: 'Brand Awareness', value: 68, suffix: '%', status: 'positive', target: 60, icon: Globe },
        { label: 'Índice de Sentimento', value: 84, suffix: '%', status: 'positive', target: 80, icon: MessageSquare },
        { label: 'CAC (Custo de Aquisição)', value: isYTD ? 425 : 450, isCur: true, status: 'positive', target: 500, icon: Users },
        { label: 'ROAS Médio', value: isYTD ? 5.2 : 4.8, suffix: 'x', status: 'positive', target: 4.0, icon: TrendingUp },
      ];
    } else {
      return [
        { label: 'Taxa de Conversão', value: isYTD ? 22 : 24, suffix: '%', status: 'positive', target: 20, icon: ArrowUpRight },
        { label: 'Ciclo de Vendas', value: 14, suffix: ' dias', status: 'positive', target: 20, icon: Activity },
        { label: 'Ticket Médio', value: isYTD ? 2950 : 2850, isCur: true, status: 'positive', target: 2500, icon: Target },
        { label: 'LTV/CAC Ratio', value: 3.5, suffix: 'x', status: 'positive', target: 3.0, icon: Percent },
      ];
    }
  }, [isMarketing, isYTD]);

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
    if (isMarketing) {
      return [
        { stage: 'Alcance/Impressões', value: 125000, conversion: '100%', color: 'bg-slate-800' },
        { stage: 'Visitantes/Cliques', value: 8400, conversion: '6.7%', color: 'bg-slate-700' },
        { stage: 'Leads Captados', value: 1250, conversion: '14.9%', color: 'bg-emerald-700' },
        { stage: 'MQLs Qualificados', value: 840, conversion: '67.2%', color: 'bg-emerald-600' },
        { stage: 'SQLs (Vendas)', value: 320, conversion: '38.1%', color: 'bg-secondary' }
      ];
    }
    return [
      { stage: 'Prospecção', value: 1250, conversion: '100%', color: 'bg-slate-800' },
      { stage: 'Qualificação', value: 840, conversion: '67.2%', color: 'bg-slate-700' },
      { stage: 'Proposta', value: 320, conversion: '38.1%', color: 'bg-emerald-700' },
      { stage: 'Negociação', value: 145, conversion: '45.3%', color: 'bg-emerald-600' },
      { stage: 'Fechamento', value: 82, conversion: '56.5%', color: 'bg-secondary' }
    ];
  }, [isMarketing]);

  const performanceData = useMemo(() => {
    if (isMarketing) {
      return {
        vendedores: [ // Relabeled as Canais
          { name: 'Google Search Ads', value: 85000, share: '38%', abc: 'A', trend: 'up' },
          { name: 'Meta Ads (Instagram)', value: 42000, share: '19%', abc: 'A', trend: 'up' },
          { name: 'LinkedIn Marketing', value: 28000, share: '12%', abc: 'B', trend: 'neutral' },
          { name: 'Tráfego Orgânico (SEO)', value: 15000, share: '7%', abc: 'C', trend: 'down' }
        ],
        regioes: [ // Relabeled as Campanhas
          { name: 'Black Friday 2026', value: 125000, share: '42%', abc: 'A', trend: 'up' },
          { name: 'Lançamento Linha X', value: 85000, share: '28%', abc: 'A', trend: 'up' },
          { name: 'Branding Institucional', value: 42000, share: '14%', abc: 'B', trend: 'up' },
          { name: 'Retargeting Global', value: 22000, share: '7%', abc: 'C', trend: 'down' }
        ],
        produtos: [ // Relabeled as Origem de Leads
          { name: 'Webinars & Eventos', value: 450, share: '35%', abc: 'A', trend: 'up' },
          { name: 'Landing Pages B2B', value: 320, share: '25%', abc: 'A', trend: 'neutral' },
          { name: 'E-books & Materiais', value: 280, share: '22%', abc: 'B', trend: 'up' },
          { name: 'Formulários Site', value: 120, share: '9%', abc: 'C', trend: 'down' }
        ],
        unidades: [ // Relabeled as Budget
          { name: 'Mídia Paga (Ads)', value: 180000, share: '65%', abc: 'A', trend: 'up' },
          { name: 'Produção Conteúdo', value: 45000, share: '16%', abc: 'A', trend: 'up' },
          { name: 'Ferramentas & SAAS', value: 32000, share: '12%', abc: 'B', trend: 'neutral' },
          { name: 'Eventos & PR', value: 12000, share: '4%', abc: 'C', trend: 'down' }
        ]
      };
    }
    return {
      vendedores: [
        { name: 'Ricardo Almeida', value: 450000, share: '24%', abc: 'A', trend: 'up' },
        { name: 'Carla Silveira', value: 380000, share: '21%', abc: 'A', trend: 'up' },
        { name: 'Marcos Santos', value: 120000, share: '8%', abc: 'B', trend: 'down' },
        { name: 'Ana Beatriz', value: 45000, share: '3%', abc: 'C', trend: 'neutral' }
      ],
      regioes: [
        { name: 'Sudeste', value: 1200000, share: '45%', abc: 'A', trend: 'up' },
        { name: 'Sul', value: 850000, share: '32%', abc: 'A', trend: 'up' },
        { name: 'Nordeste', value: 420000, share: '15%', abc: 'B', trend: 'up' },
        { name: 'Centro-Oeste', value: 180000, share: '8%', abc: 'C', trend: 'down' }
      ],
      produtos: [
        { name: 'Licença Enterprise', value: 950000, share: '40%', abc: 'A', trend: 'up' },
        { name: 'Consultoria Premium', value: 650000, share: '28%', abc: 'A', trend: 'neutral' },
        { name: 'Suporte Advanced', value: 320000, share: '18%', abc: 'B', trend: 'up' },
        { name: 'Treinamento Equipe', value: 120000, share: '14%', abc: 'C', trend: 'down' }
      ],
      unidades: [
        { name: 'Matriz (SP)', value: 1800000, share: '55%', abc: 'A', trend: 'up' },
        { name: 'Filial (RJ)', value: 950000, share: '30%', abc: 'A', trend: 'up' },
        { name: 'Filial (PR)', value: 420000, share: '12%', abc: 'B', trend: 'neutral' },
        { name: 'Unidade (MG)', value: 110000, share: '3%', abc: 'C', trend: 'down' }
      ]
    };
  }, [isMarketing]);

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

      {/* Sales Funnel Section */}
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

          <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isMarketing ? 'SQL Conversion' : 'Conversão Final'}</p>
              <p className="text-xl font-display font-black text-emerald-600">{isMarketing ? '25.6%' : '6.5%'}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Média do Setor</p>
              <p className="text-xl font-display font-black text-slate-400">{isMarketing ? '18.2%' : '4.2%'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Performance Matrix Grid */}
          {[
            { title: isMarketing ? 'Canais de Aquisição' : 'Vendedores & Repr.', data: performanceData.vendedores, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: isMarketing ? 'Principais Campanhas' : 'Análise por Região', data: performanceData.regioes, icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: isMarketing ? 'Origem de Leads' : 'Mix de Produtos', data: performanceData.produtos, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: isMarketing ? 'Investimento/Budget' : 'Unidades & Filiais', data: performanceData.unidades, icon: Building, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((section, idx) => (
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
                {section.data.map((item, i) => (
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
                        {section.title === 'Origem de Leads' ? item.value : formatValue(item.value, 'R$')}
                      </p>
                      <div className="flex items-center justify-end gap-1">
                        {item.trend === 'up' ? <ArrowUpRight size={10} className="text-emerald-500" /> : item.trend === 'down' ? <TrendingDown size={10} className="text-rose-500" /> : <Activity size={10} className="text-slate-300" />}
                        <span className={cn(
                          "text-[9px] font-black",
                          item.trend === 'up' ? "text-emerald-500" : item.trend === 'down' ? "text-rose-500" : "text-slate-400"
                        )}>
                          {item.trend === 'up' ? '+12%' : item.trend === 'down' ? '-4%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-slate-900 group-hover:text-white transition-all">
                Ver Ranking Completo
              </button>
            </div>
          ))}
        </div>
      </div>

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
                  {kpi.status === 'positive' ? 'Otimizado' : kpi.status === 'negative' ? 'Alerta' : 'Estável'}
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
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Performance vs Meta</span>
                    <span className="text-slate-900">{Math.round((kpi.value / kpi.target) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={cn("h-full shadow-sm", kpi.status === 'positive' ? "bg-emerald-500" : "bg-amber-500")}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ));
        })()}
      </div>


      {/* Main Analysis Section */}
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
               <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">Mensal</button>
                  <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ml-2">Trimestral</button>
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

               <div className="mt-12 space-y-4">
                 <button className="w-full py-5 bg-secondary text-primary rounded-[20px] font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 hover:shadow-2xl hover:shadow-secondary/30 transition-all">
                    Gerar Plano de Ação
                 </button>
                 <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[20px] font-black uppercase tracking-[0.25em] text-[11px] hover:bg-white/10 transition-all">
                    Visualizar Benchmarks
                 </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
