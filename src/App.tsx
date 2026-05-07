/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus,
  LayoutGrid, 
  TrendingUp, 
  TrendingDown,
  FileText, 
  BookOpen, 
  CircleDollarSign, 
  Activity, 
  Users,
  Target,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Settings2,
  Scale,
  Globe,
  PieChart as PieChartIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  WalletCards,
  Calculator,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle2,
  CheckSquare,
  Clock,
  ArrowRight,
  Coins,
  Database,
  LogIn,
  LogOut,
  Info,
  Save,
  Trash2,
  Edit2,
  AlertTriangle,
  AlertCircle,
  UploadCloud,
  Zap,
  Sun,
  Sparkles,
  Link2,
  ArrowRightLeft,
  ArrowUpRight,
  BarChart3 as ChartBarIcon,
  Loader2,
  Landmark,
  List,
  CreditCard,
  ShoppingBag,
  Building2,
  Lightbulb,
  MessageSquare,
  Rocket,
  Percent,
  DollarSign
} from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot, limit, writeBatch } from 'firebase/firestore';
import { auth, login, logout, db, handleFirestoreError, OperationType } from './lib/firebase';
import { DATA, modelData } from './data';
import { cn, formatValue, formatCurrency, calculateVPL, calculateTIR, calculatePayback } from './lib/utils';
import { parseExcel, parseTxt, parsePdf, ImportedAccount } from './services/importService';
import { useFinancialData, useAllFinancialData } from './hooks/useFinancialData';
import { useRealIndicatorData } from './hooks/useRealIndicatorData';
import { SYSTEM_KPI_CATEGORIES, MONTH_LABELS, FULL_MONTH_LABELS } from './constants';
import { AccountModal } from './components/modals/AccountModal';
import { ImportPlanoModal } from './components/modals/ImportPlanoModal';
import { MappingWizard } from './components/modals/MappingWizard';

import { PageHeader, Semaphore, StatusBadge, SectionHeader } from './components/Common';
import { DashboardPage } from './components/pages/DashboardPage';
import { IndicatorsPage } from './components/pages/IndicatorsPage';
import { DREPage } from './components/pages/DREPage';
import { BalanceSheetPage } from './components/pages/BalanceSheetPage';
import { CashFlowPage } from './components/pages/CashFlowPage';
import { DadosHistoricosPage } from './components/pages/DadosHistoricosPage';
import { PremissasClientePage } from './components/pages/PremissasClientePage';
import { PremissasTributariasPage } from './components/pages/PremissasTributariasPage';
import { PremissasEconomicasPage } from './components/pages/PremissasEconomicasPage';
import { ExecutiveCommentary } from './components/ExecutiveCommentary';
import { TaxReformImpactPage } from './components/pages/TaxReformImpactPage';
import { PlanoDeContasPage } from './components/pages/PlanoDeContasPage';
import { ViabilityPage } from './components/pages/ViabilityPage';
import { LoansPage } from './components/pages/LoansPage';
import { ClientsPage } from './components/pages/ClientsPage';
import { ValuationPage } from './components/pages/ValuationPage';
import { AdvisoryInsightsPage } from './components/pages/AdvisoryInsightsPage';
import { PlanoAcaoPage } from './components/pages/PlanoAcaoPage';
import { AnaliseFinanceiraPage } from './components/pages/AnaliseFinanceiraPage';
import { DLPAPage } from './components/pages/DLPAPage';
import { DFCPage } from './components/pages/DFCPage';
import { DreGerencialPage } from './components/pages/DreGerencialPage';
import { FinancialModelingPage } from './components/pages/FinancialModelingPage';
import { PayablesPage } from './components/pages/PayablesPage';
import { FinancialPositionPage } from './components/pages/FinancialPositionPage';
import { PurchasingPage } from './components/pages/PurchasingPage';
import { ReceivablesPage } from './components/pages/ReceivablesPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { LoanInvestmentSimPage } from './components/pages/LoanInvestmentSimPage';
import { DiretrizesPage } from './components/pages/DiretrizesPage';
import { DiagnosticoPage } from './components/pages/DiagnosticoPage';
import { OKRsPage } from './components/pages/OKRsPage';
import { PrecificacaoPage } from './components/pages/PrecificacaoPage';
import { RelatorioExecutivoPage } from './components/pages/RelatorioExecutivoPage';

import { useDataTable } from './hooks/useDataTable';
import { SortableHeader } from './components/SortableHeader';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

import PayrollDashboard from './components/PayrollDashboard';

type Page = 'portfolio' | 'dashboard' | 'indicadores' | 'dre' | 'bp' | 'caixa' | 'viabilidade' | 'clientes' | 'premissas_cliente' | 'premissas_tributarias' | 'premissas_economicas' | 'emprestimos' | 'dados_historicos' | 'analise_financeira' | 'valuation' | 'modelagem' | 'dre_gerencial' | 'dlpa' | 'dfc' | 'pessoal' | 'contas_pagar' | 'contas_receber' | 'plano_contas' | 'compras' | 'posicao_financeira' | 'advisory_insights' | 'plano_acao' | 'tax_reform_impact' | 'simulador_capital' | 'diretrizes' | 'diagnostico' | 'okrs' | 'precificacao' | 'relatorio_executivo';

function Logo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-12 select-none w-full px-4">
      <div className="flex flex-col items-center text-center">
        {/* Illumine stylized Icon */}
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2"
        >
          {/* Rays */}
          <line x1="30" y1="30" x2="22" y2="22" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
          <line x1="18" y1="50" x2="8" y2="50" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
          <line x1="30" y1="70" x2="22" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
          <line x1="50" y1="82" x2="50" y2="92" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
          <line x1="70" y1="70" x2="78" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
          
          {/* Main Circle and Arrow */}
          <path 
            d="M50 22 C 34.5 22, 22 34.5, 22 50 C 22 65.5, 34.5 78, 50 78 C 65.5 78, 78 65.5, 78 50 M50 50 L75 25 M75 25 L65 25 M75 25 L75 35" 
            stroke="#ff8552" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>

        {/* Text */}
        <div className="flex flex-col items-center">
          <h1 className="text-[#0e1c2c] font-display text-4xl tracking-tighter leading-none font-black uppercase">
            illumine
          </h1>
          <span className="text-[#ff8552] text-[10px] font-black uppercase tracking-[0.4em] mt-2 mb-1">
            Strategic Advisory
          </span>
          <div className="h-0.5 w-8 bg-[#ff8552]/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('portfolio');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [clients, setClients] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({ 
    'Gestão Financeira': true, 
    'Banco de Dados': true,
    'Conselho & Estratégia CFO': true 
  });

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch clients from Firestore if user is authenticated
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setClients(DATA.clientes);
      return;
    }

    const q = query(
      collection(db, 'clients'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbClients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (dbClients.length > 0) {
        setClients(dbClients);
        // If current selected client is not in the list, select the first one
        if (!selectedClient || !dbClients.some(c => c.id === selectedClient)) {
          setSelectedClient(dbClients[0].id);
        }
      } else {
        setClients([]);
      }
    }, (error) => {
      console.error("Error fetching clients:", error);
      setClients(DATA.clientes); // Fallback to sample data on error
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const navigation = useMemo(() => [
    {
      group: "Visão Consolidada",
      items: [
        { id: 'portfolio', label: 'Gestão de Portfólio', icon: Activity, isNew: true },
      ]
    },
    {
      group: "Dashboard",
      items: [
        { id: 'dashboard', label: 'Monitoramento Geral', icon: LayoutGrid },
        { id: 'indicadores', label: 'KPIs e Métricas', icon: TrendingUp },
      ]
    },
    {
      group: "Banco de Dados",
      items: [
        { id: 'clientes', label: 'Gestão de Clientes', icon: Users },
        { id: 'dados_historicos', label: 'Dados Históricos', icon: Database },
        { id: 'plano_contas', label: 'Plano de Contas', icon: List },
        { id: 'premissas_cliente', label: 'Premissas do Cliente', icon: Settings2 },
        { id: 'premissas_economicas', label: 'Premissas Econômicas', icon: Globe },
        { id: 'premissas_tributarias', label: 'Premissas Tributárias', icon: Landmark },
      ]
    },
    {
      group: "Demonstrações Contábeis",
      items: [
        { id: 'dre', label: 'DRE', icon: FileText },
        { id: 'bp', label: 'Balanço Patrimonial', icon: BookOpen },
        { id: 'dlpa', label: 'DLPA', icon: Scale },
        { id: 'dfc', label: 'DFC (Contábil)', icon: WalletCards },
      ]
    },
    {
      group: "Estratégia & Direção",
      items: [
        { id: 'diretrizes', label: 'Diretrizes (MVV)', icon: Target, isNew: true },
        { id: 'diagnostico', label: 'Diagnóstico (FIV)', icon: ShieldCheck, isNew: true },
        { id: 'okrs', label: 'OKRs & Metas', icon: TrendingUp, isNew: true },
      ]
    },
    {
      group: "Gestão Financeira",
      items: [
        { id: 'precificacao', label: 'Precificação & Margem', icon: DollarSign, isNew: true },
        { id: 'dre_gerencial', label: 'DRE Gerencial', icon: Activity },
        { id: 'caixa', label: 'Fluxo de Caixa', icon: CircleDollarSign },
        { id: 'posicao_financeira', label: 'Posição Financeira', icon: Landmark },
        { id: 'contas_pagar', label: 'Contas a Pagar', icon: CreditCard },
        { id: 'contas_receber', label: 'Contas a Receber', icon: ArrowUpRight },
        { id: 'compras', label: 'Gestão de Compras', icon: ShoppingBag },
        { id: 'pessoal', label: 'Custos com Pessoal', icon: Users },
        { id: 'emprestimos', label: 'Empréstimos', icon: WalletCards },
      ]
    },
    {
      group: "Conselho & Estratégia CFO",
      items: [
        { id: 'advisory_insights', label: 'Dashboard de Advisory', icon: Lightbulb, isNew: true },
        { id: 'relatorio_executivo', label: 'Relatório Executivo', icon: FileText, isNew: true },
        { id: 'plano_acao', label: 'Roadmap Estratégico', icon: CheckSquare, isNew: true },
        { id: 'simulador_capital', label: 'Simulador Captação/Alocação', icon: ArrowRightLeft, isNew: true },
        { id: 'tax_reform_impact', label: 'Simualdor Reforma Tributária', icon: Percent, isNew: true },
        { id: 'modelagem', label: 'Modelagem Financeira', icon: LayoutGrid, isNew: true },
        { id: 'analise_financeira', label: 'Análise Estratégica CFO', icon: ShieldCheck },
        { id: 'valuation', label: 'Valuation & M&A', icon: Zap },
        { id: 'viabilidade', label: 'Viabilidade de Projetos', icon: BarChart3 },
      ]
    }
  ], []);

  const flatNavItems = useMemo(() => navigation.flatMap(g => g.items), [navigation]);
  const currentPageLabel = useMemo(() => flatNavItems.find(i => i.id === currentPage)?.label || '', [flatNavItems, currentPage]);

  const payrollClients = useMemo(() => clients.map(c => ({
    id: c.id,
    name: c.fantasia || c.name || 'Cliente',
    period: selectedYear.toString(),
    employees: c.id === 'C001' ? [
      {
        nome: "Colaborador Exemplo 1",
        funcao: "Técnico(a) de Enfermagem",
        area: "Posto de Enfermagem",
        tipoContrato: "CLT",
        status: "Ativo",
        admissao: "2025-02-18",
        custoAnual: 50962.48,
        custoMensal: 4246.87,
        salarioBase: 2500,
        encargos: 900,
        decimoTerceiroFerias: 410,
        verbasIndenizatorias: 436,
        custoRescisaoEstimado: 12000
      },
      {
        nome: "Colaborador Exemplo 2",
        funcao: "Encarregado(a) de Farmácia",
        area: "Farmácia",
        tipoContrato: "CLT",
        status: "Ativo",
        admissao: "1996-06-01",
        custoAnual: 64839.95,
        custoMensal: 5403.33,
        salarioBase: 3500,
        encargos: 1260,
        decimoTerceiroFerias: 580,
        verbasIndenizatorias: 63,
        custoRescisaoEstimado: 65000
      }
    ] : []
  })), [clients, selectedYear]);

  return (
    <div className="flex h-screen bg-light overflow-hidden text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-xl z-50">
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="mb-8">
            <Logo />
          </div>
          
          <nav className="space-y-6">
            {navigation.map((group) => {
              const isOpen = openSubmenus[group.group] !== false; // Default to open if not specified
              const isFinanceGroup = group.group === "Gestão Financeira";
              const belongsToGroup = group.items.some(i => i.id === currentPage);

              return (
                <div key={group.group}>
                  <button 
                    onClick={() => toggleSubmenu(group.group)}
                    className="w-full flex items-center justify-between px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 font-display hover:text-primary transition-colors group"
                  >
                    <span>{group.group}</span>
                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-0.5 overflow-hidden"
                      >
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id as Page)}
                            className={cn(
                              "w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-xl font-bold text-xs transition-all group",
                              currentPage === item.id 
                                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                          >
                            <item.icon size={16} className={cn(
                              "transition-colors",
                              currentPage === item.id ? "text-secondary" : "text-slate-400 group-hover:text-secondary"
                            )} />
                            <span className="tracking-tight">{item.label}</span>
                            {(item as any).isNew && (
                              <span className="ml-auto bg-blue-100 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                Novo
                              </span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
          {authLoading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="animate-spin text-secondary" size={20} />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full border-2 border-secondary" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user.displayName || 'Usuário'}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <LogIn size={16} /> Entrar com Google
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <h1 className="text-2xl font-display">{currentPageLabel}</h1>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="pl-10 pr-4 py-2.5 bg-light/50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-secondary/20 transition-all outline-none w-72" 
              />
              <Search size={16} className="text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-secondary transition-colors" />
            </div>
            <button 
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-secondary/20 transition-all"
            >
              Gerar Relatório
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentPage === 'portfolio' && (
                  <PortfolioPage 
                    clients={clients} 
                    onSelectClient={(id: string, targetPage: Page = 'dashboard') => {
                      setSelectedClient(id);
                      setCurrentPage(targetPage);
                    }} 
                  />
                )}
                {currentPage === 'dashboard' && <DashboardPage clients={clients} selectedClient={selectedClient} setSelectedClient={setSelectedClient} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />}
                {currentPage === 'indicadores' && <IndicatorsPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
                {currentPage === 'dre' && <DREPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
                {currentPage === 'dre_gerencial' && <DreGerencialPage selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />}
                {currentPage === 'bp' && <BalanceSheetPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
                {currentPage === 'dlpa' && <DLPAPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />}
                {currentPage === 'caixa' && <CashFlowPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
                {currentPage === 'posicao_financeira' && <FinancialPositionPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'contas_pagar' && <PayablesPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'contas_receber' && <ReceivablesPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'compras' && <PurchasingPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'dfc' && <DFCPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />}
                {currentPage === 'advisory_insights' && <AdvisoryInsightsPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />}
                {currentPage === 'diretrizes' && <DiretrizesPage clientId={selectedClient} />}
                {currentPage === 'diagnostico' && <DiagnosticoPage clientId={selectedClient} />}
                {currentPage === 'okrs' && <OKRsPage clientId={selectedClient} />}
                {currentPage === 'precificacao' && <PrecificacaoPage clientId={selectedClient} />}
                {currentPage === 'relatorio_executivo' && <RelatorioExecutivoPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />}
                {currentPage === 'plano_acao' && <PlanoAcaoPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'tax_reform_impact' && <TaxReformImpactPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'simulador_capital' && <LoanInvestmentSimPage />}
                {currentPage === 'viabilidade' && <ViabilityPage selectedClient={selectedClient} clients={clients} />}
                {currentPage === 'emprestimos' && <LoansPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'analise_financeira' && <AnaliseFinanceiraPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />}
                {currentPage === 'valuation' && <ValuationPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />}
                {currentPage === 'modelagem' && <FinancialModelingPage clients={clients} selectedClient={selectedClient} setSelectedClient={setSelectedClient} />}
                {currentPage === 'dados_historicos' && <DadosHistoricosPage clients={clients} user={user} />}
                {currentPage === 'clientes' && <ClientsPage clients={clients} setClients={setClients} />}
                {currentPage === 'plano_contas' && <PlanoDeContasPage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'premissas_cliente' && <PremissasClientePage clients={clients} selectedClient={selectedClient} />}
                {currentPage === 'premissas_tributarias' && <PremissasTributariasPage clients={clients} />}
                {currentPage === 'premissas_economicas' && <PremissasEconomicasPage />}
                {currentPage === 'pessoal' && (
                  <PayrollDashboard 
                    clientId={selectedClient} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
