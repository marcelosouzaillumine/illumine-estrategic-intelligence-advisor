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
  Coins,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { useCurrencyRates, convertCurrency } from '../../hooks/useCurrencyRates';
import { CurrencySelector } from '../Common/CurrencySelector';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../../lib/utils';
import { calculateGovernanceAlignmentScore } from '../../lib/governanceIntelligence';
import { onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PageHeader } from '../Common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  clientCurrency: string;  // moeda original do cliente
  isModel?: boolean;
  logo?: string;
  icon?: string;
}

export function PortfolioPage({ clients, onSelectClient, isPartner, userPartnerIds }: any) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'strategic' | 'partner' | 'model'>(isPartner ? 'strategic' : 'list');
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');

  // Câmbio do dia via AwesomeAPI
  const { rates, loading: ratesLoading, error: ratesError, lastUpdated } = useCurrencyRates();

  /** Converte o valor da moeda do cliente para a moeda selecionada no display */
  const convert = useMemo(() => {
    return (amount: number, clientCurrency: string) =>
      convertCurrency(amount, clientCurrency || 'BRL', selectedCurrency, rates);
  }, [rates, selectedCurrency]);

  /** Formata um valor convertido na moeda selecionada */
  const fmtCurrency = useMemo(() => {
    return (amount: number, clientCurrency = 'BRL') => {
      const converted = convert(amount, clientCurrency);
      return new Intl.NumberFormat(
        selectedCurrency === 'BRL' ? 'pt-BR' :
        selectedCurrency === 'USD' ? 'en-US' :
        selectedCurrency === 'EUR' ? 'de-DE' : 'en-GB',
        { style: 'currency', currency: selectedCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 }
      ).format(Math.floor(converted));
    };
  }, [convert, selectedCurrency]);

  const downloadPDF = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      // Scroll to top to ensure html2canvas captures correctly
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        backgroundColor: '#f8fafc',
        windowWidth: containerRef.current.scrollWidth,
        windowHeight: containerRef.current.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If the content is taller than one page, we might need multiple pages, 
      // but for a QBR one long page or a scaled single page is common.
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, 290));
      pdf.save(`qbr-consolidado-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    let q = query(collection(db, 'partners'));
    
    if (isPartner && userPartnerIds && userPartnerIds.length > 0) {
      q = query(collection(db, 'partners'), where('__name__', 'in', userPartnerIds));
    }
    
    const unsub = onSnapshot(q, (snap) => {
      setPartners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [isPartner, userPartnerIds]);

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
            if (docData.type !== 'DRE' && docData.type !== 'BP' && docData.type !== 'DRE Gerencial') return;
            
            const entries = Array.isArray(docData.data) ? docData.data : [docData];
            
            entries.forEach((entry: any) => {
              allEntries.push({
                ...entry,
                clientId: docData.clientId,
                type: docData.type,
                conta: entry.category || entry.conta || entry.ind || entry.accountName,
                valor: entry.value || entry.valor || entry.val || 0,
                val: entry.value || entry.valor || entry.val || 0,
                periodo: entry.period || entry.mes || docData.periodo || docData.period || `${docData.month}/${docData.year}`
              });
            });
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
        industry: c.segmentoAtuacao || c.segmento || 'Serviços',
        score,
        governanceScore,
        lastMonthScore: score,
        criticalAlerts: hasData ? (score < 50 ? 3 : score < 70 ? 1 : 0) : 0,
        status: c.approvalStatus === 'Pending' ? 'onboarding' : (hasData ? (score < 50 ? 'critical' : 'active') : 'onboarding'),
        revenue,
        ebitdaMargin: margin,
        clientCurrency: c.currency || 'BRL',
        isModel: c.isModel || false,
        logo: c.logo,
        icon: c.icon
      };
    });
  }, [clients, financialData]);

  const filteredPortfolio = useMemo(() => {
    let list = portfolioData.filter(c => !c.isModel && (clients.find(cc => cc.id === c.id)?.approvalStatus !== 'Pending')).sort((a, b) => a.score - b.score);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    return list;
  }, [portfolioData, searchTerm]);

  const modelPortfolio = useMemo(() => {
    let list = portfolioData.filter(c => c.isModel).sort((a, b) => b.name.localeCompare(a.name));
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    return list;
  }, [portfolioData, searchTerm]);

  const stats = useMemo(() => {
    const realPortfolioData = portfolioData.filter(c => !c.isModel);
    const totalClients = realPortfolioData.length;
    const activeClients = realPortfolioData.filter(c => c.status !== 'onboarding');
    const avgScore = activeClients.length > 0 ? Math.round(activeClients.reduce((acc, c) => acc + c.score, 0) / activeClients.length) : 0;
    
    // Strategic Concentration
    const industryConcentration: Record<string, number> = {};
    realPortfolioData.forEach(c => {
      industryConcentration[c.industry] = (industryConcentration[c.industry] || 0) + c.revenue;
    });

    // Maturity Score (Score > 60)
    const above60 = activeClients.filter(c => c.score > 60).length;
    const maturityScore = activeClients.length > 0 ? Math.round((above60 / activeClients.length) * 100) : 0;

    // Tax Reform Impact (Setores de Serviços e Tech)
    const impactedKeywords = ['serviço', 'tech', 'tecnologia', 'saas', 'consultoria', 'software', 'advocacia', 'marketing'];
    const impactedClients = realPortfolioData.filter(c => 
      impactedKeywords.some(key => c.industry.toLowerCase().includes(key))
    );
    const impactPercentage = totalClients > 0 ? Math.round((impactedClients.length / totalClients) * 100) : 0;

    return {
      avgScore,
      totalRevenue: realPortfolioData.reduce((acc, c) => acc + convert(c.revenue, c.clientCurrency), 0),
      activeAlerts: realPortfolioData.reduce((acc, c) => acc + c.criticalAlerts, 0),
      totalClients,
      onboarding: realPortfolioData.filter(c => c.status === 'onboarding').length,
      industryConcentration,
      partnerVolume: partners.map(p => {
        const pClients = realPortfolioData.filter(c => {
          const clientObj = clients.find((cc: any) => cc.id === c.id);
          return clientObj?.partnerId === p.id;
        });
        return {
          name: p.fantasia || p.razao,
          value: pClients.reduce((acc, c) => acc + convert(c.revenue, c.clientCurrency), 0)
        };
      }).sort((a, b) => b.value - a.value),
      maturityScore,
      impactPercentage,
      impactedRevenue: impactedClients.reduce((acc, c) => acc + convert(c.revenue, c.clientCurrency), 0)
    };
  }, [portfolioData, partners, clients, convert]);

  const partnerGroups = useMemo(() => {
    return partners.map(p => {
      const partnerClients = portfolioData.filter(c => !c.isModel && p.linkedClientIds?.includes(c.id));
      const totalRevenue = partnerClients.reduce((acc, c) => acc + c.revenue, 0);
      const avgScore = partnerClients.length > 0 ? partnerClients.reduce((acc, c) => acc + c.score, 0) / partnerClients.length : 0;
      
      return {
        ...p,
        clients: partnerClients,
        totalRevenue,
        avgScore,
        clientCount: partnerClients.length
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [partners, portfolioData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">Consolidando Portfólio...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 pb-20 w-full min-w-0 max-w-full overflow-x-hidden p-8">
      <PageHeader 
        title="Visão Consolidada"
        subtitle="Inteligência estratégica e monitoramento de saúde do portfólio de clientes."
        icon={Globe}
      />

      {/* ── Barra de Ferramentas (Fora do Título) ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 shrink-0">
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
          <button 
            onClick={() => setViewMode('partner')}
            className={cn(
              "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              viewMode === 'partner' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Por Parceiro
          </button>
          <button 
            onClick={() => setViewMode('model')}
            className={cn(
              "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              viewMode === 'model' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Modelos (Demo)
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* ── Seletor de Moeda ── */}
          <CurrencySelector
            selected={selectedCurrency}
            onChange={setSelectedCurrency}
            loading={ratesLoading}
            error={ratesError}
            lastUpdated={lastUpdated}
            rates={rates.toBRL}
          />

          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-50"
          >
            {isExporting ? <span className="animate-spin mr-2">◌</span> : <TrendingUp size={14} className="text-secondary" />} 
            {isExporting ? 'Gerando...' : 'Exportar QBR Consolidado'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Health Score Médio', value: stats.avgScore > 0 ? stats.avgScore : '---', icon: Activity, color: 'blue', desc: 'Base Clientes Ativos' },
          { label: `Fat. Mensal (${selectedCurrency})`, value: fmtCurrency(stats.totalRevenue, selectedCurrency), icon: Coins, color: 'emerald', desc: 'Volume consolidado — câmbio do dia' },
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
                    <p className="text-3xl font-black text-rose-500">{stats.impactPercentage}%</p>
                    <p className="text-[10px] text-slate-400 mt-2">Setores de Serviços e Tecnologia na base.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Volume sob Risco</p>
                    <p className="text-3xl font-black text-white">{fmtCurrency(stats.impactedRevenue, selectedCurrency)}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Receita total dos clientes expostos.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Prioridade de Saneamento</p>
                    <p className="text-3xl font-black text-amber-500">{stats.impactPercentage > 50 ? 'Alta' : 'Média'}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Necessidade de revisão de NCM/CST.</p>
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
                    <Users size={14} className="text-secondary" /> Volume por Parceiro Estratégico
                  </h5>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.partnerVolume.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} 
                          hide={false}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                        />
                        <Bar dataKey="value" fill="#ff8552" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <button 
                  onClick={() => setViewMode('partner')}
                  className="w-full mt-4 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Análise por Parceiro
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
                  .filter(c => !c.isModel && (c.status === 'critical' || c.criticalAlerts > 0))
                  .sort((a, b) => b.criticalAlerts - a.criticalAlerts)
                  .slice(0, 4)
                  .map((client, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => onSelectClient(client.id)}>
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-sm shrink-0 overflow-hidden",
                        (client.logo || client.icon) ? "bg-white border border-slate-100" :
                        client.score > 60 ? "bg-blue-500" : "bg-rose-500"
                      )}>
                        {client.icon || client.logo ? (
                          <img src={client.icon || client.logo} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                          client.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                        )}
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

            <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-200">
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Radar de Conformidade IVA</h5>
               <div className="space-y-4">
                  {portfolioData.some(c => !c.isModel && (c.industry.toLowerCase().includes('indúst') || c.industry.toLowerCase().includes('fabr'))) && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck size={16} /></div>
                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">Setor Industrial</span>
                      </div>
                      <span className="text-xs font-black text-emerald-600">Complexidade Alta</span>
                    </div>
                  )}
                  {stats.impactPercentage > 0 && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><AlertCircle size={16} /></div>
                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">Serviços / Tech</span>
                      </div>
                      <span className="text-xs font-black text-rose-600">Impacto Direto IVA-S</span>
                    </div>
                  )}
                  {stats.impactPercentage === 0 && !portfolioData.some(c => !c.isModel && c.industry.toLowerCase().includes('indúst')) && (
                    <p className="text-[10px] font-bold text-slate-400 italic text-center py-4">Nenhum risco setorial imediato detectado.</p>
                  )}
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[40px] p-8 text-white">
              <h5 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Maturidade do Portfólio</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">Resonância Estratégica</span>
                <span className="text-2xl font-black">{stats.maturityScore}%</span>
              </div>
              <div className="h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${stats.maturityScore}%` }} />
              </div>
              <p className="text-[10px] text-indigo-100 mt-4 leading-relaxed font-medium">
                {stats.maturityScore > 70 
                  ? `O portfólio apresenta alta aderência aos princípios da Illumine, com ${stats.maturityScore}% dos clientes ativos acima do score 60.`
                  : `Aderência em evolução: ${stats.maturityScore}% dos clientes ativos estão com score acima de 60.`}
              </p>
            </div>
          </div>
        </div>
      ) : viewMode === 'partner' ? (
        <div className="space-y-8 animate-executive-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerGroups.map((group, i) => (
              <div key={group.id} className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-secondary/5 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-secondary shadow-lg">
                      <LayoutDashboard size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-black text-slate-900 group-hover:text-secondary transition-colors">{group.fantasia || group.razao}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.clientCount} Clientes Vinculados</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fat. ({selectedCurrency})</p>
                      <p className="text-sm font-black text-slate-900">{fmtCurrency(group.totalRevenue, selectedCurrency)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Score Médio</p>
                      <p className="text-sm font-black text-slate-900">{group.avgScore.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Empresas do Portfólio</h5>
                    {group.clients.slice(0, 3).map((client: any) => (
                      <div 
                        key={client.id} 
                        onClick={() => onSelectClient(client.id)}
                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-secondary transition-all cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{client.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[10px] font-black",
                            client.score > 80 ? "text-emerald-600" : client.score > 60 ? "text-blue-600" : "text-rose-600"
                          )}>{client.score}</span>
                          <ChevronRight size={12} className="text-slate-300" />
                        </div>
                      </div>
                    ))}
                    {group.clientCount > 3 && (
                      <p className="text-[10px] text-slate-400 text-center pt-2 font-bold uppercase tracking-widest">
                        + {group.clientCount - 3} outras empresas
                      </p>
                    )}
                  </div>

                  <button 
                    className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                  >
                    <Zap size={14} className="text-secondary" /> Abrir Visão do Parceiro
                  </button>
                </div>
              </div>
            ))}
            {partnerGroups.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Users size={40} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Nenhum parceiro estratético identificado</h4>
                <p className="text-slate-500 max-w-md mx-auto">Cadastre parceiros e vincule clientes para habilitar esta visão consolidada.</p>
              </div>
            )}
          </div>
        </div>
      ) : viewMode === 'model' ? (
        <div className="space-y-8 animate-executive-fade">
          <div className="bg-amber-50 border border-amber-200 rounded-[32px] p-8 flex items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="text-xl font-display font-black text-amber-900">Empresas Modelo para Demonstração</h4>
              <p className="text-sm text-amber-700/80 mt-1 font-medium">
                Estas empresas servem apenas para fins didáticos e demonstração da plataforma. Os dados aqui contidos não impactam a visão consolidada de clientes reais.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modelPortfolio.map((client) => (
              <div 
                key={client.id} 
                onClick={() => onSelectClient(client.id)}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LayoutDashboard size={80} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shrink-0",
                    (client.logo || client.icon) ? "bg-white border border-slate-100" : "bg-slate-900"
                  )}>
                    {client.icon || client.logo ? (
                      <img src={client.icon || client.logo} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      client.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{client.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{client.industry}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                    <p className="text-xl font-black text-slate-900">{client.score}</p>
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
            {modelPortfolio.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-300">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nenhuma empresa modelo cadastrada.</p>
              </div>
            )}
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
                              "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shrink-0 transition-transform group-hover:scale-105 overflow-hidden",
                              (client.logo || client.icon) ? "bg-white border border-slate-100" :
                              client.status === 'onboarding' ? "bg-slate-200 text-slate-400 shadow-none" :
                              client.score > 80 ? "bg-emerald-500 shadow-emerald-500/20" : 
                              client.score > 60 ? "bg-blue-500 shadow-blue-500/20" : "bg-rose-500 shadow-rose-500/20"
                            )}>
                              {client.icon || client.logo ? (
                                <img src={client.icon || client.logo} alt={client.name} className="w-full h-full object-cover" />
                              ) : (
                                client.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                              )}
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
                        <td className="px-8 py-6 text-right whitespace-nowrap">
                          {client.revenue > 0 ? (
                            <div className="flex flex-col items-end">
                              <span className="font-black text-sm text-slate-700">
                                {fmtCurrency(client.revenue, client.clientCurrency)}
                              </span>
                              {client.clientCurrency !== selectedCurrency && client.clientCurrency !== 'BRL' && (
                                <span className="text-[9px] font-bold text-slate-400 tabular-nums">
                                  {client.clientCurrency} {client.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                              )}
                            </div>
                          ) : '--'}
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
