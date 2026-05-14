import React, { useMemo, useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Zap,
  Activity,
  Search,
  Filter,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';
import { calculateGovernanceAlignmentScore } from '../../lib/governanceIntelligence';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PageHeader } from '../Common';

interface ClientPortfolioData {
  id: string;
  name: string;
  industry: string;
  score: number;
  governanceScore: number;
  lastMonthScore: number;
  criticalAlerts: number;
  status: 'active' | 'onboarding' | 'critical';
  revenue: number;
  ebitdaMargin: number;
}

export function PortfolioPage({ clients, onSelectClient }: any) {
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'strategic'>('list');

  useEffect(() => {
    async function fetchAllData() {
      if (!clients || clients.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const promises = clients.map((c: any) => 
          getDocs(query(collection(db, 'financial_entries'), where('clientId', '==', c.id)))
        );
        
        const snaps = await Promise.all(promises);
        const allEntries: any[] = [];
        
        snaps.forEach(snap => {
          snap.docs.forEach(doc => {
            const docData = doc.data() as any;
            if (docData.type !== 'DRE' && docData.type !== 'BP') return;
            
            if (Array.isArray(docData.data)) {
              docData.data.forEach((entry: any) => {
                allEntries.push({
                  ...entry,
                  clientId: docData.clientId,
                  type: docData.type,
                  conta: entry.category,
                  valor: entry.value,
                  val: entry.value,
                  periodo: entry.period || docData.periodo || docData.period
                });
              });
            } else {
              allEntries.push({
                ...docData,
                conta: docData.category,
                valor: docData.value,
                val: docData.value
              });
            }
          });
        });
        setFinancialData(allEntries);
      } catch (e) {
        console.error("Error fetching portfolio data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [clients]);

  const portfolioData: ClientPortfolioData[] = useMemo(() => {
    if (!clients) return [];
    return clients.map((c: any) => {
      const clientData = financialData.filter(d => d.clientId === c.id);
      const clientDre = clientData.filter(d => d.type === 'DRE');
      const clientBp = clientData.filter(d => d.type === 'BP');
      
      let hasData = clientDre.length > 0;
      let score = 0;
      let revenue = 0;
      let ebitda = 0;
      let margin = 0;
      let liq = 1;
      
      if (hasData) {
        revenue = clientDre.filter(d => d.conta === 'Receita Líquida').reduce((sum, d) => sum + d.valor, 0);
        ebitda = clientDre.filter(d => d.conta === 'EBITDA').reduce((sum, d) => sum + d.valor, 0);
        margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
        
        const ac = clientBp.filter(b => b.conta === 'Ativo Circulante').reduce((sum, b) => sum + (b.val || b.valor), 0) || 0;
        const pc = clientBp.filter(b => b.conta === 'Passivo Circulante').reduce((sum, b) => sum + (b.val || b.valor), 0) || 1;
        liq = ac / pc;
        
        const calculated = 40 + (margin * 2) + (liq * 5);
        score = isNaN(calculated) ? 65 : Math.max(30, Math.min(98, Math.round(calculated)));
      } else {
        // Fallback for onboarding clients
        score = 0;
      }

      const governanceScore = calculateGovernanceAlignmentScore([
        { ind: 'Liquidez Corrente', val: liq },
        { ind: 'Margem EBITDA', val: margin },
        { ind: 'Turnover', val: margin > 10 ? 4 : 12 },
        { ind: 'Inadimplência', val: score < 60 ? 8 : 2 },
        { ind: 'Receita Líquida', val: revenue }
      ]);
      
      return {
        id: c.id,
        name: c.fantasia || c.name,
        industry: c.segmento || 'Serviços',
        score,
        governanceScore,
        lastMonthScore: score,
        criticalAlerts: hasData ? (score < 50 ? 3 : score < 70 ? 1 : 0) : 0,
        status: hasData ? (score < 50 ? 'critical' : 'active') : 'onboarding',
        revenue,
        ebitdaMargin: margin
      };
    });
  }, [clients, financialData]);

  const filteredPortfolio = useMemo(() => {
    let list = [...portfolioData].sort((a, b) => a.score - b.score);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    return list;
  }, [portfolioData, searchTerm]);

  const stats = useMemo(() => {
    const totalClients = portfolioData.length;
    const activeClients = portfolioData.filter(c => c.status !== 'onboarding');
    const avgScore = activeClients.length > 0 ? Math.round(activeClients.reduce((acc, c) => acc + c.score, 0) / activeClients.length) : 0;
    
    // Strategic Concentration
    const industryConcentration: Record<string, number> = {};
    portfolioData.forEach(c => {
      industryConcentration[c.industry] = (industryConcentration[c.industry] || 0) + c.revenue;
    });

    return {
      avgScore,
      totalRevenue: portfolioData.reduce((acc, c) => acc + c.revenue, 0),
      activeAlerts: portfolioData.reduce((acc, c) => acc + c.criticalAlerts, 0),
      totalClients,
      onboarding: portfolioData.filter(c => c.status === 'onboarding').length,
      industryConcentration
    };
  }, [portfolioData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">Consolidando Portfólio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 w-full min-w-0 max-w-full overflow-x-hidden">
      <PageHeader 
        title="Visão Consolidada"
        subtitle="Inteligência estratégica e monitoramento de saúde do portfólio de clientes."
        icon={Globe}
        actions={
          <div className="flex gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'list' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Listagem
              </button>
              <button 
                onClick={() => setViewMode('strategic')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'strategic' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Estratégico
              </button>
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
              <TrendingUp size={14} className="text-secondary" /> Exportar QBR Consolidado
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Health Score Médio', value: stats.avgScore, icon: Activity, color: 'blue', desc: 'Base Clientes Ativos' },
          { label: 'Fat. Mensal Consolidado', value: formatCurrency(stats.totalRevenue), icon: Coins, color: 'emerald', desc: 'Volume sob assessoria' },
          { label: 'Alertas Críticos', value: stats.activeAlerts, icon: AlertCircle, color: 'rose', desc: 'Urgência imediata' },
          { label: 'Total de Clientes', value: stats.totalClients, icon: Users, color: 'slate', desc: `${stats.onboarding} em onboarding` },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className={cn(
              "absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500",
              stat.color === 'blue' ? "text-blue-600" : stat.color === 'emerald' ? "text-emerald-600" : stat.color === 'rose' ? "text-rose-600" : "text-slate-600"
            )}>
              {(() => {
                const Icon = stat.icon;
                return <Icon size={120} strokeWidth={1} />;
              })()}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 truncate">{stat.value}</h3>
              {stat.label.includes('Score') && <span className="text-[10px] font-bold text-emerald-600 whitespace-nowrap">+2.4%</span>}
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-2">{stat.desc}</p>
          </div>
        ))}
      </div>

      {viewMode === 'strategic' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden min-h-[300px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><ShieldAlert size={160} /></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-full mb-6">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Alerta de Risco Sistêmico</span>
                </div>
                <h4 className="text-3xl font-display font-black mb-6 max-w-2xl leading-tight">Exposição do Portfólio à Transição da Reforma Tributária</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Empresas Impactadas</p>
                    <p className="text-3xl font-black text-rose-500">72%</p>
                    <p className="text-[10px] text-slate-400 mt-2">Principalmente setor de Serviços e Tech.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Déficit de Crédito IVA</p>
                    <p className="text-3xl font-black text-white">R$ 4.2M</p>
                    <p className="text-[10px] text-slate-400 mt-2">Estimativa de custo tributário líquido.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Prioridade de Saneamento</p>
                    <p className="text-3xl font-black text-amber-500">Urgente</p>
                    <p className="text-[10px] text-slate-400 mt-2">85% dos NCMs precisam de revisão.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target size={14} className="text-blue-600" /> Concentração por Segmento (Fat.)
                </h5>
                <div className="space-y-4">
                  {Object.entries(stats.industryConcentration)
                    .sort(([, a], [, b]) => b - a)
                    .map(([industry, revenue], i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                          <span>{industry}</span>
                          <span className="text-slate-400">{((revenue / stats.totalRevenue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(revenue / stats.totalRevenue) * 100}%` }}
                            className={cn(
                              "h-full rounded-full",
                              i === 0 ? "bg-slate-900" : i === 1 ? "bg-blue-600" : "bg-slate-400"
                            )}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={14} className="text-secondary" /> Oportunidades de Alavancagem Alpha
                  </h5>
                  <p className="text-sm font-bold text-slate-900 mb-4">Savings Identificados em Captação</p>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-4">
                    <p className="text-2xl font-black text-emerald-600">R$ 1.85M/ano</p>
                    <p className="text-[10px] font-bold text-emerald-800 uppercase mt-1">Potencial de redução de juros</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Ver Detalhes por Cliente
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[40px] border-2 border-slate-900 p-8 shadow-xl relative">
              <div className="absolute -top-3 left-8 px-4 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                Master Insight
              </div>
              <h5 className="text-lg font-display font-black text-slate-900 mb-6">Agenda Prioritária Master</h5>
              <div className="space-y-6">
                {portfolioData
                  .filter(c => c.status === 'critical' || c.criticalAlerts > 0)
                  .sort((a, b) => b.criticalAlerts - a.criticalAlerts)
                  .slice(0, 4)
                  .map((client, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => onSelectClient(client.id)}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        client.score < 50 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <AlertCircle size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {client.score < 50 ? 'Intervenção Estratégica Urgente' : 'Revisão de Performance'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{client.name}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Score: {client.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {portfolioData.filter(c => c.status === 'critical' || c.criticalAlerts > 0).length === 0 && (
                  <p className="text-[10px] font-bold text-slate-400 italic text-center py-4">Nenhum cliente crítico no radar.</p>
                )}
              </div>
              <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Abrir Central de Consultoria
              </button>
            </div>

            <div className="bg-indigo-600 rounded-[40px] p-8 text-white">
              <h5 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Maturidade do Portfólio</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">Resonância Estratégica</span>
                <span className="text-2xl font-black">84%</span>
              </div>
              <div className="h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-[84%]" />
              </div>
              <p className="text-[10px] text-indigo-100 mt-4 leading-relaxed font-medium">
                O portfólio apresenta alta aderência aos princípios de Governança Corporativa da Illumine, com 84% dos clientes ativos acima do score 60.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm min-w-0 w-full">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Buscar por cliente ou segmento..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 transition-all font-bold text-sm"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Filter size={16} /> Filtros Avançados
              </button>
            </div>
          </div>

          <div className="space-y-6 min-w-0 w-full">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente / Setor</th>
                      <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</th>
                      <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-x border-slate-200/60 bg-indigo-50/30 text-indigo-700">Índice Gov.</th>
                      <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Alertas</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Margem EBITDA</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Fat. Mensal</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações Estratégicas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPortfolio.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onSelectClient(client.id)}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shrink-0 transition-transform group-hover:scale-105",
                              client.status === 'onboarding' ? "bg-slate-200 text-slate-400 shadow-none" :
                              client.score > 80 ? "bg-emerald-500 shadow-emerald-500/20" : 
                              client.score > 60 ? "bg-blue-500 shadow-blue-500/20" : "bg-rose-500 shadow-rose-500/20"
                            )}>
                              {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{client.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{client.industry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-lg font-black",
                                client.status === 'onboarding' ? "text-slate-300" :
                                client.score > 80 ? "text-emerald-600" : client.score > 60 ? "text-blue-600" : "text-rose-600"
                              )}>{client.status === 'onboarding' ? '--' : client.score}</span>
                              {client.status !== 'onboarding' && <ArrowUpRight size={14} className="text-emerald-500" />}
                            </div>
                            {client.status === 'onboarding' && <span className="text-[8px] font-black uppercase text-slate-400">Pendente</span>}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center border-x border-slate-100/50 bg-indigo-50/10">
                          <div className="flex items-center justify-center gap-1.5">
                            <ShieldCheck size={14} className={client.status === 'onboarding' ? "text-slate-300" : "text-indigo-500"} />
                            <span className={cn("font-black text-lg", client.status === 'onboarding' ? "text-slate-300" : "text-slate-800")}>
                              {client.status === 'onboarding' ? '--' : client.governanceScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          {client.criticalAlerts > 0 ? (
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">
                              <AlertCircle size={12} /> {client.criticalAlerts} Críticos
                            </div>
                          ) : client.status === 'onboarding' ? (
                            <span className="text-[10px] font-bold text-slate-300 uppercase italic">Dados em carga</span>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">
                              <CheckCircle2 size={12} /> Saudável
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className={cn(
                             "text-sm font-black",
                             client.ebitdaMargin > 20 ? "text-emerald-600" : client.ebitdaMargin > 10 ? "text-blue-600" : "text-rose-600"
                           )}>
                             {client.status === 'onboarding' ? '--' : `${client.ebitdaMargin.toFixed(1)}%`}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-sm text-slate-700 whitespace-nowrap">
                          {client.revenue > 0 ? formatCurrency(client.revenue) : '--'}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectClient(client.id, 'advisory_insights'); }}
                              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center gap-2 text-[10px] font-black uppercase tracking-tight"
                            >
                              <Zap size={14} className="text-secondary" /> Advisory
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectClient(client.id, 'dashboard'); }}
                              className="p-2 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center justify-center text-slate-600"
                              title="Ver Dashboard"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
