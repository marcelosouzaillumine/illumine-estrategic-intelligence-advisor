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
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('all');

  useEffect(() => {
    if (isPartner && userPartnerIds && userPartnerIds.length > 0) {
      setSelectedPartnerId(userPartnerIds[0]);
    }
  }, [isPartner, userPartnerIds]);

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
    let list = portfolioData.filter(c => !c.isModel && (clients.find((cc: any) => cc.id === c.id)?.approvalStatus !== 'Pending'));
    
    // Filter by selected partner
    if (selectedPartnerId !== 'all') {
      list = list.filter(c => {
        const clientObj = clients.find((cc: any) => cc.id === c.id);
        const matchesPartnerId = clientObj && clientObj.partnerId === selectedPartnerId;
        
        const selectedPartnerDoc = partners.find(p => p.id === selectedPartnerId);
        const matchesLinkedClient = selectedPartnerDoc?.linkedClientIds?.includes(c.id);
        
        return matchesPartnerId || matchesLinkedClient;
      });
    }

    list = list.sort((a, b) => a.score - b.score);

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    return list;
  }, [portfolioData, searchTerm, selectedPartnerId, clients, partners]);

  const activeRealPortfolioData = useMemo(() => {
    let list = portfolioData.filter(c => !c.isModel);
    if (selectedPartnerId !== 'all') {
      list = list.filter(c => {
        const clientObj = clients.find((cc: any) => cc.id === c.id);
        const matchesPartnerId = clientObj && clientObj.partnerId === selectedPartnerId;
        
        const selectedPartnerDoc = partners.find(p => p.id === selectedPartnerId);
        const matchesLinkedClient = selectedPartnerDoc?.linkedClientIds?.includes(c.id);
        
        return matchesPartnerId || matchesLinkedClient;
      });
    }
    return list;
  }, [portfolioData, selectedPartnerId, clients, partners]);

  const modelPortfolio = useMemo(() => {
    let list = portfolioData.filter(c => c.isModel).sort((a, b) => b.name.localeCompare(a.name));
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    return list;
  }, [portfolioData, searchTerm]);

  const stats = useMemo(() => {
    const activePortfolioData = portfolioData.filter(c => {
      const isModelMatch = viewMode === 'model' ? c.isModel : !c.isModel;
      if (!isModelMatch) return false;
      
      if (viewMode === 'model') return true;

      // Filter by selected partner
      if (selectedPartnerId !== 'all') {
        const clientObj = clients.find((cc: any) => cc.id === c.id);
        const matchesPartnerId = clientObj && clientObj.partnerId === selectedPartnerId;
        
        const selectedPartnerDoc = partners.find(p => p.id === selectedPartnerId);
        const matchesLinkedClient = selectedPartnerDoc?.linkedClientIds?.includes(c.id);
        
        return matchesPartnerId || matchesLinkedClient;
      }
      
      return true;
    });

    const totalClients = activePortfolioData.length;
    const activeClients = activePortfolioData.filter(c => c.status !== 'onboarding');
    const avgScore = activeClients.length > 0 ? Math.round(activeClients.reduce((acc, c) => acc + c.score, 0) / activeClients.length) : 0;
    
    // Strategic Concentration
    const industryConcentration: Record<string, number> = {};
    activePortfolioData.forEach(c => {
      industryConcentration[c.industry] = (industryConcentration[c.industry] || 0) + c.revenue;
    });

    // Maturity Score (Score > 60)
    const above60 = activeClients.filter(c => c.score > 60).length;
    const maturityScore = activeClients.length > 0 ? Math.round((above60 / activeClients.length) * 100) : 0;

    // Tax Reform Impact (Setores de Serviços e Tech)
    const impactedKeywords = ['serviço', 'tech', 'tecnologia', 'saas', 'consultoria', 'software', 'advocacia', 'marketing'];
    const impactedClients = activePortfolioData.filter(c => 
      impactedKeywords.some(key => c.industry.toLowerCase().includes(key))
    );
    const impactPercentage = totalClients > 0 ? Math.round((impactedClients.length / totalClients) * 100) : 0;

    return {
      avgScore,
      totalRevenue: activePortfolioData.reduce((acc, c) => acc + convert(c.revenue, c.clientCurrency), 0),
      activeAlerts: activePortfolioData.reduce((acc, c) => acc + c.criticalAlerts, 0),
      totalClients,
      onboarding: activePortfolioData.filter(c => c.status === 'onboarding').length,
      industryConcentration,
      partnerVolume: partners.map(p => {
        const pClients = activePortfolioData.filter(c => {
          const clientObj = clients.find((cc: any) => cc.id === c.id);
          return clientObj?.partnerId === p.id || p.linkedClientIds?.includes(c.id);
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
  }, [portfolioData, partners, clients, convert, viewMode, selectedPartnerId]);

  const partnerGroups = useMemo(() => {
    return partners.map(p => {
      const partnerClients = portfolioData.filter(c => {
        if (c.isModel) return false;
        const clientObj = clients.find((cc: any) => cc.id === c.id);
        return p.linkedClientIds?.includes(c.id) || clientObj?.partnerId === p.id;
      });
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
  }, [partners, portfolioData, clients]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest animate-pulse">Consolidando Portfólio...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 pb-20 w-full min-w-0 max-w-full overflow-x-hidden p-4 md:p-8">
      <PageHeader 
        title="Visão Consolidada"
        subtitle="Inteligência estratégica e monitoramento de saúde do portfólio de clientes."
        icon={Globe}
      />

      {/* ── Barra de Ferramentas (Fora do Título) ── */}
      <div className="flex flex-row items-center justify-between gap-1.5 md:gap-4 flex-wrap bg-surface-container/60 p-2 md:p-3.5 rounded-card border border-border backdrop-blur-sm shadow-sm w-full">
        <div className="bg-surface-container-high p-0.5 md:p-1 rounded-button flex flex-row items-center gap-0.5 md:gap-1 border border-border min-w-0">
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "px-1.5 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 md:px-3 md:py-1.5 rounded-button text-[7px] min-[400px]:text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.18em] transition-all whitespace-nowrap",
              viewMode === 'list' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Listagem
          </button>
          <button 
            onClick={() => setViewMode('strategic')}
            className={cn(
              "px-1.5 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 md:px-3 md:py-1.5 rounded-button text-[7px] min-[400px]:text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.18em] transition-all whitespace-nowrap",
              viewMode === 'strategic' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Estratégico
          </button>
          <button 
            onClick={() => setViewMode('partner')}
            className={cn(
              "px-1.5 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 md:px-3 md:py-1.5 rounded-button text-[7px] min-[400px]:text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.18em] transition-all whitespace-nowrap",
              viewMode === 'partner' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="hidden sm:inline">Por Parceiro</span>
            <span className="inline sm:hidden">Parceiro</span>
          </button>
          <button 
            onClick={() => setViewMode('model')}
            className={cn(
              "px-1.5 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 md:px-3 md:py-1.5 rounded-button text-[7px] min-[400px]:text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.18em] transition-all whitespace-nowrap",
              viewMode === 'model' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="hidden sm:inline">Modelos (Demo)</span>
            <span className="inline sm:hidden">Modelos</span>
          </button>
        </div>

        <div className="flex flex-row items-center gap-1.5 md:gap-3 shrink-0 flex-wrap">
          {/* ── Seletor de Parceiro (Apenas para Admin Master) ── */}
          {!isPartner && viewMode !== 'model' && (
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:inline">Parceiro:</span>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="bg-surface-container-high border border-border rounded-button text-[7px] min-[400px]:text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 min-[400px]:py-1.5 md:py-1.5 outline-none focus:border-secondary transition-all text-foreground cursor-pointer"
              >
                <option value="all">Todos os Parceiros</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fantasia || p.razao}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ── Seletor de Moeda ── */}
          <div className="shrink-0">
            <CurrencySelector
              selected={selectedCurrency}
              onChange={setSelectedCurrency}
              loading={ratesLoading}
              error={ratesError}
              lastUpdated={lastUpdated}
              rates={rates.toBRL}
            />
          </div>

          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-button font-display font-bold uppercase tracking-[0.1em] shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl active:scale-[0.98] transition-all gap-1 md:gap-3 px-2 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 md:px-5 md:py-2.5 text-[7px] min-[400px]:text-[8px] sm:text-[9px] md:text-[10px] w-auto justify-center disabled:opacity-50"
          >
            {isExporting ? <span className="animate-spin mr-1">◌</span> : <TrendingUp size={12} className="text-secondary shrink-0" />} 
            <span className="hidden md:inline">{isExporting ? 'Gerando...' : 'Exportar QBR Consolidado'}</span>
            <span className="inline md:hidden">{isExporting ? 'Gerando...' : 'Exportar'}</span>
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
          <div key={i} className="card-premium p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className={cn(
              "absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500",
              stat.color === 'blue' ? "text-primary" : stat.color === 'emerald' ? "text-secondary" : stat.color === 'rose' ? "text-destructive" : "text-neutral"
            )}>
              {(() => {
                const Icon = stat.icon;
                return <Icon size={120} strokeWidth={1} />;
              })()}
            </div>
            <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
              <h3 className="text-h2 font-medium text-foreground">{stat.value}</h3>
            </div>
            <p className="text-body-sm font-medium text-muted-foreground mt-2">{stat.desc}</p>
          </div>
        ))}
      </div>

      {viewMode === 'strategic' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-primary rounded-card p-6 md:p-10 text-primary-foreground relative overflow-hidden min-h-[300px] flex flex-col justify-center border border-border/10">
              <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><ShieldAlert size={160} /></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive/30 rounded-full mb-6">
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                  <span className="text-body-sm font-medium uppercase tracking-widest text-destructive">Alerta de Risco Sistêmico</span>
                </div>
                <h4 className="text-xl md:text-2xl lg:text-3xl font-medium mb-6 max-w-2xl leading-tight">Exposição do Portfólio à Transição da Reforma Tributária</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="p-4 bg-white/10 border border-white/10 rounded-button">
                    <p className="text-body-sm font-medium text-muted-foreground uppercase mb-2">Empresas Impactadas</p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium text-secondary">{stats.impactPercentage}%</p>
                    <p className="text-body-sm text-muted-foreground mt-2">Setores de Serviços e Tecnologia na base.</p>
                  </div>
                  <div className="p-4 bg-white/10 border border-white/10 rounded-button">
                    <p className="text-body-sm font-medium text-muted-foreground uppercase mb-2">Volume sob Risco</p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium text-primary-foreground">{fmtCurrency(stats.impactedRevenue, selectedCurrency)}</p>
                    <p className="text-body-sm text-muted-foreground mt-2">Receita total dos clientes expostos.</p>
                  </div>
                  <div className="p-4 bg-white/10 border border-white/10 rounded-button">
                    <p className="text-body-sm font-medium text-muted-foreground uppercase mb-2">Prioridade de Saneamento</p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium text-secondary">{stats.impactPercentage > 50 ? 'Alta' : 'Média'}</p>
                    <p className="text-body-sm text-muted-foreground mt-2">Necessidade de revisão de NCM/CST.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-premium p-6 md:p-8">
                <h5 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target size={14} className="text-secondary" /> Concentração por Segmento (Fat.)
                </h5>
                <div className="space-y-4">
                  {Object.entries(stats.industryConcentration)
                    .sort(([, a], [, b]) => b - a)
                    .map(([industry, revenue], i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-body-sm font-medium uppercase tracking-tighter">
                          <span>{industry}</span>
                          <span className="text-muted-foreground">{((revenue / stats.totalRevenue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(revenue / stats.totalRevenue) * 100}%` }}
                            className={cn(
                              "h-full rounded-full",
                              i === 0 ? "bg-primary" : i === 1 ? "bg-secondary" : "bg-tertiary"
                            )}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="card-premium p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h5 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
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
                          tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)', fontWeight: 600 }} 
                          hide={false}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)', fontWeight: 600 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                        />
                        <Bar dataKey="value" fill="#ff8552" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <button 
                  onClick={() => setViewMode('partner')}
                  className="btn-executive w-full mt-4 bg-surface-container text-foreground hover:bg-surface-container-high border border-border shadow-none"
                >
                  Análise por Parceiro
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-card border-2 border-primary p-6 md:p-8 shadow-lg relative">
              <div className="absolute -top-3 left-8 px-4 py-1 bg-primary text-primary-foreground rounded-full text-[8px] font-medium uppercase tracking-widest">
                Master Insight
              </div>
              <h5 className="text-h3 font-medium text-foreground mb-6">Agenda Prioritária Master</h5>
              <div className="space-y-6">
                {activeRealPortfolioData
                  .filter(c => c.status === 'critical' || c.criticalAlerts > 0)
                  .sort((a, b) => b.criticalAlerts - a.criticalAlerts)
                  .slice(0, 4)
                  .map((client, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => onSelectClient(client.id)}>
                      <div className={cn(
                        "w-12 h-12 rounded-button flex items-center justify-center font-medium text-white text-body-md shrink-0 overflow-hidden",
                        (client.logo || client.icon) ? "bg-background border border-border" :
                        client.score > 60 ? "bg-primary" : "bg-destructive"
                      )}>
                        {client.icon || client.logo ? (
                          <img src={client.icon || client.logo} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                          client.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                        )}
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {client.score < 50 ? 'Intervenção Estratégica Urgente' : 'Revisão de Performance'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-medium text-muted-foreground uppercase">{client.name}</span>
                          <span className="w-1 h-1 bg-border rounded-full"></span>
                          <span className="text-[9px] font-medium text-muted-foreground uppercase">Score: {client.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {activeRealPortfolioData.filter(c => c.status === 'critical' || c.criticalAlerts > 0).length === 0 && (
                  <p className="text-body-sm font-medium text-muted-foreground italic text-center py-4">Nenhum cliente crítico no radar.</p>
                )}
              </div>
              <button className="btn-executive w-full mt-8">
                Abrir Central de Consultoria
              </button>
            </div>

            <div className="bg-surface-container rounded-card p-6 md:p-8 border border-border">
               <h5 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">Radar de Conformidade IVA</h5>
               <div className="space-y-4">
                  {activeRealPortfolioData.some(c => c.industry.toLowerCase().includes('indúst') || c.industry.toLowerCase().includes('fabr')) && (
                    <div className="flex items-center justify-between p-4 bg-background rounded-button border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-button bg-success/10 text-success flex items-center justify-center"><ShieldCheck size={16} /></div>
                        <span className="text-body-sm font-medium uppercase text-muted-foreground tracking-tight">Setor Industrial</span>
                      </div>
                      <span className="text-body-sm font-medium text-success">Complexidade Alta</span>
                    </div>
                  )}
                  {stats.impactPercentage > 0 && (
                    <div className="flex items-center justify-between p-4 bg-background rounded-button border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-button bg-destructive/10 text-destructive flex items-center justify-center"><AlertCircle size={16} /></div>
                        <span className="text-body-sm font-medium uppercase text-muted-foreground tracking-tight">Serviços / Tech</span>
                      </div>
                      <span className="text-body-sm font-medium text-destructive">Impacto Direto IVA-S</span>
                    </div>
                  )}
                  {stats.impactPercentage === 0 && !activeRealPortfolioData.some(c => c.industry.toLowerCase().includes('indúst')) && (
                    <p className="text-body-sm font-medium text-muted-foreground italic text-center py-4">Nenhum risco setorial imediato detectado.</p>
                  )}
               </div>
            </div>

            <div className="bg-secondary rounded-card p-6 md:p-8 text-secondary-foreground">
              <h5 className="text-body-sm font-medium text-secondary-foreground/60 uppercase tracking-widest mb-4">Maturidade do Portfólio</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-md font-medium">Resonância Estratégica</span>
                <span className="text-h2 font-medium">{stats.maturityScore}%</span>
              </div>
              <div className="h-2 bg-secondary-foreground/20 rounded-full overflow-hidden">
                <div className="h-full bg-background rounded-full transition-all duration-1000" style={{ width: `${stats.maturityScore}%` }} />
              </div>
              <p className="text-body-sm text-secondary-foreground/80 mt-4 leading-relaxed font-medium">
                {stats.maturityScore > 70 
                  ? `O portfólio apresenta alta aderência aos princípios da Illumine, com ${stats.maturityScore}% dos clientes ativos acima do score 60.`
                  : `Aderência em evolução: ${stats.maturityScore}% dos clientes ativos estão com score acima de 60.`}
              </p>
            </div>
          </div>
        </div>
      ) : viewMode === 'partner' ? (
        <div className="space-y-8 animate-executive-fade">
          {partnerGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerGroups.map((group, i) => (
                <div key={group.id} className="card-premium p-6 md:p-8 hover:shadow-lg transition-all group overflow-hidden relative">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-surface-container rounded-full group-hover:bg-secondary/5 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-md bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                        <LayoutDashboard size={24} />
                      </div>
                      <div>
                        <h4 className="text-h3 font-medium text-foreground group-hover:text-secondary transition-colors">{group.fantasia || group.razao}</h4>
                        <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest">{group.clientCount} Clientes Vinculados</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-surface-container rounded-button border border-border">
                        <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Fat. ({selectedCurrency})</p>
                        <p className="text-body-md font-medium text-foreground">{fmtCurrency(group.totalRevenue, selectedCurrency)}</p>
                      </div>
                      <div className="p-4 bg-surface-container rounded-button border border-border">
                        <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Health Score Médio</p>
                      <p className="text-body-md font-medium text-foreground">{group.avgScore.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Empresas do Portfólio</h5>
                      {group.clients.slice(0, 3).map((client) => (
                        <div 
                          key={client.id} 
                          onClick={() => onSelectClient(client.id)}
                          className="flex items-center justify-between p-3 bg-background border border-border rounded-button hover:border-secondary transition-all cursor-pointer"
                        >
                          <span className="text-body-sm font-medium text-foreground">{client.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-body-sm font-medium",
                              client.score > 80 ? "text-success" : client.score > 60 ? "text-primary" : "text-destructive"
                            )}>{client.score}</span>
                            <ChevronRight size={12} className="text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                      {group.clientCount > 3 && (
                        <p className="text-body-sm text-muted-foreground text-center pt-2 font-medium uppercase tracking-widest">
                          + {group.clientCount - 3} outras empresas
                        </p>
                      )}
                    </div>

                    <button 
                      className="btn-executive w-full mt-8 shadow-none"
                    >
                      <Zap size={14} className="text-secondary" /> Abrir Visão do Parceiro
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-20 text-center">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                <Users size={40} />
              </div>
              <h4 className="text-h2 font-medium text-foreground mb-2">Nenhum parceiro estratégico identificado</h4>
              <p className="text-muted-foreground block text-center mx-auto" style={{ whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word', display: 'block', width: '100%', maxWidth: 'none' }}>
                Cadastre parceiros e vincule clientes para habilitar esta visão consolidada.
              </p>
            </div>
          )}
        </div>
      ) : viewMode === 'model' ? (
        <div className="space-y-8 animate-executive-fade">
          <div className="bg-warning/10 border border-warning/20 rounded-card p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 md:gap-6">
            <div className="w-12 h-12 rounded-button bg-warning text-white flex items-center justify-center shadow-lg shadow-warning/20 shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="text-h2 font-medium text-foreground">Empresas Modelo para Demonstração</h4>
              <p className="text-body-md text-muted-foreground mt-1 font-medium">
                Estas empresas servem apenas para fins didáticos e demonstração da plataforma. Os dados aqui contidos não impactam a visão consolidada de clientes reais.
              </p>
            </div>
          </div>

          {modelPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {modelPortfolio.map((client) => (
                <div 
                  key={client.id} 
                  onClick={() => onSelectClient(client.id)}
                  className="card-premium p-6 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <LayoutDashboard size={80} />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-button flex items-center justify-center font-medium text-white text-h3 shadow-lg shrink-0",
                      (client.logo || client.icon) ? "bg-background border border-border" : "bg-primary"
                    )}>
                      {client.icon || client.logo ? (
                        <img src={client.icon || client.logo} alt={client.name} className="w-full h-full object-cover" />
                      ) : (
                        client.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-md font-medium text-foreground group-hover:text-primary transition-colors">{client.name}</p>
                      <p className="text-[9px] font-normal text-muted-foreground/60 uppercase tracking-widest mt-0.5">{client.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Health Score</p>
                      <p className="text-h3 font-medium text-foreground">{client.score}</p>
                    </div>
                    <button className="p-2 bg-surface-container text-muted-foreground rounded-button group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-20 text-center bg-surface-container rounded-card border border-dashed border-border">
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-body-sm">Nenhuma empresa modelo cadastrada.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 bg-background p-4 rounded-card border border-border shadow-sm min-w-0 w-full">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Buscar por cliente ou segmento..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container border border-border rounded-input outline-none focus:ring-2 focus:ring-primary/5 transition-all font-medium text-body-sm" 
              />
              <Search size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1 md:flex-none border border-border hover:bg-surface-container transition-all text-foreground text-xs md:text-sm font-medium shadow-none">
                <Filter size={16} /> Filtros Avançados
              </button>
            </div>
          </div>

          <div className="space-y-6 min-w-0 w-full">
            <div className="bg-background rounded-card border border-border shadow-lg overflow-hidden">
              <div className="overflow-x-auto scrollbar-premium">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-container/50 border-b border-border">
                      <th className="px-5 md:px-8 py-3 md:py-5 text-left text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Cliente / Setor</th>
                      <th className="px-5 md:px-8 py-3 md:py-5 text-center text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Health Score</th>
                      <th className="px-5 md:px-8 py-3 md:py-5 text-center text-body-sm font-medium text-muted-foreground uppercase tracking-widest border-x border-border bg-secondary/10 text-secondary">Índice Gov.</th>
                      <th className="px-5 md:px-8 py-3 md:py-5 text-center text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Alertas</th>
                      <th className="px-5 md:px-8 py-3 md:py-5 text-right text-body-sm font-medium text-muted-foreground uppercase tracking-widest">Ações Estratégicas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPortfolio.map((client) => (
                      <tr key={client.id} className="hover:bg-surface-container/50 transition-colors group cursor-pointer" onClick={() => onSelectClient(client.id)}>
                        <td className="px-4 md:px-8 py-4 md:py-6">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-button flex items-center justify-center font-medium text-white text-h3 shadow-lg shrink-0 transition-transform group-hover:scale-105 overflow-hidden",
                              (client.logo || client.icon) ? "bg-background border border-border" :
                              client.status === 'onboarding' ? "bg-surface-container text-muted-foreground shadow-none" :
                              client.score > 80 ? "bg-success" : 
                              client.score > 60 ? "bg-primary" : "bg-destructive"
                            )}>
                              {client.icon || client.logo ? (
                                  <img src={client.icon || client.logo} alt={client.name} className="w-full h-full object-cover" />
                              ) : (
                                client.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-body-md font-medium text-foreground group-hover:text-primary transition-colors">{client.name}</p>
                              <p className="text-[9px] font-normal text-muted-foreground/60 uppercase tracking-widest mt-0.5">{client.industry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-4 md:py-6">
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
                        <td className="px-4 md:px-8 py-4 md:py-6 text-center border-x border-border/50 bg-surface-container/50">
                          <div className="flex items-center justify-center gap-1.5">
                            <ShieldCheck size={14} className={client.status === 'onboarding' ? "text-muted-foreground/40" : "text-secondary"} />
                            <span className={cn("font-black text-lg", client.status === 'onboarding' ? "text-muted-foreground/40" : "text-foreground")}>
                              {client.status === 'onboarding' ? '--' : client.governanceScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-4 md:py-6 text-center">
                          {client.criticalAlerts > 0 ? (
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-button text-[10px] font-black uppercase whitespace-nowrap">
                              <AlertCircle size={12} /> {client.criticalAlerts} Críticos
                            </div>
                          ) : client.status === 'onboarding' ? (
                            <span className="text-[10px] font-bold text-slate-300 uppercase italic">Dados em carga</span>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success rounded-button text-[10px] font-black uppercase whitespace-nowrap">
                              <CheckCircle2 size={12} /> Saudável
                            </div>
                          )}
                        </td>
                        <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                          <div className="flex justify-end gap-2 shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectClient(client.id, 'advisory_insights'); }}
                              className="btn-executive text-[9px] px-3 py-1.5 md:px-4 md:py-2 shadow-none hover:shadow-sm"
                            >
                              <Zap size={14} className="text-secondary" /> Advisory
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectClient(client.id, 'dashboard'); }}
                              className="btn-ghost p-2 hover:bg-surface-container border border-border rounded-button transition-all flex items-center justify-center text-muted-foreground"
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
