/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useInstitutionalAuth } from './core/security/auth/InstitutionalAuthProvider';
import { 
  Plus,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  BarChart3,
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
  BarChart3 as ChartBarIcon,
  Loader2,
  Building2,
  MessageSquare,
  Rocket,
  Menu as MenuIcon,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Languages,
} from 'lucide-react';
import { LocaleProvider } from './core/internationalization/providers/LocaleProvider';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSelector } from './components/shared/LanguageSelector';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';
import { AppSidebar } from './components/AppSidebar';
import { GenerateBoardReportModal } from './components/modals/GenerateBoardReportModal';
import { onAuthStateChanged, User, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot, limit, writeBatch, or, setDoc, documentId } from 'firebase/firestore';
import { auth, login, loginWithEmail, registerWithEmail, logout, db, handleFirestoreError, OperationType, MASTER_ADMINS } from './lib/firebase';
import { DATA, modelData } from './data';
import { cn, formatValue, formatCurrency, calculateVPL, calculateTIR, calculatePayback, setActiveCurrency } from './lib/utils';
import { useFinancialData, useAllFinancialData } from './hooks/useFinancialData';
import { useRealIndicatorData } from './hooks/useRealIndicatorData';
import { SYSTEM_KPI_CATEGORIES, MONTH_LABELS, FULL_MONTH_LABELS } from './constants';
import { useNotifications } from './hooks/useNotifications';
import { AccountModal } from './components/modals/AccountModal';
import { ImportPlanoModal } from './components/modals/ImportPlanoModal';
import { MappingWizard } from './components/modals/MappingWizard';
import { PageHeader, Semaphore, StatusBadge, SectionHeader, WelcomeMessage, getRandomWelcomeMessage } from './components/Common';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BoardInvestigationWorkspace } from './components/investigation/BoardInvestigationWorkspace';
import { GovernanceTimeMachinePage } from './components/pages/GovernanceTimeMachinePage';
import { InstitutionalDigitalTwinPage } from './components/pages/InstitutionalDigitalTwinPage';
import { InstitutionalIntelligenceWorkspace } from './components/intelligence/InstitutionalIntelligenceWorkspace';
import { ClientsPage } from './components/pages/ClientsPage';
import { FiscalTributarioPage } from './components/pages/FiscalTributarioPage';
import { OpportunityDealRoomPage } from './features/revenue/deal-room/pages/OpportunityDealRoomPage';
import { HomePage } from './components/pages/public/HomePage';
import { PartnerSalesPage } from './components/pages/PartnerSalesPage';
import { ReferralProgramPage } from './components/pages/public/ReferralProgramPage';
import { InstitutionalAdvisorNetworkPage } from './components/pages/public/v2/InstitutionalAdvisorNetworkPage';
import { InstitutionalAdvisorPartnerPage } from './components/pages/public/v2/InstitutionalAdvisorPartnerPage';
import { DiagnosticoPage } from './components/pages/public/DiagnosticoPage';
import { ExecutivePlatformLandingPage } from './components/pages/public/ExecutivePlatformLandingPage';
import { LoginPage } from './components/pages/public/LoginPage';
import { InstitutionalLayout } from './components/pages/public/v2/InstitutionalLayout';
import { InstitutionalHomePage } from './components/pages/public/v2/InstitutionalHomePage';
import { InstitutionalPlatformPage } from './components/pages/public/v2/InstitutionalPlatformPage';
import { InstitutionalManifestoPage } from './components/pages/public/v2/InstitutionalManifestoPage';
import { PitchPresentationPage } from './components/pages/public/v2/PitchPresentationPage';
import { InstitutionalWhyPage } from './components/pages/public/v2/InstitutionalWhyPage';
import { DebugI18nPage } from './components/pages/public/v2/DebugI18nPage';
import { ExecutiveDiagnosticJourneyPage } from './components/pages/public/v2/ExecutiveDiagnosticJourneyPage';
import { InstitutionalDomainsPage } from './components/pages/public/v2/InstitutionalDomainsPage';
import { InstitutionalGovernancePage } from './components/pages/public/v2/InstitutionalGovernancePage';
import { InstitutionalIntelligenceCenterPage } from './components/pages/public/v2/InstitutionalIntelligenceCenterPage';
import { ExecutiveIntelligenceCenterPage } from './components/pages/public/v2/ExecutiveIntelligenceCenterPage';
import { InstitutionalNonprofitPage } from './components/pages/public/v2/InstitutionalNonprofitPage';
import { EnterpriseIntelligencePage } from './components/pages/public/v2/EnterpriseIntelligencePage';
import PrivacyPage from './components/pages/public/v2/PrivacyPage';
import SecurityPage from './components/pages/public/v2/SecurityPage';
import { CommercialLandingLayout } from './components/pages/public/v2/layouts/CommercialLandingLayout';
import { ExecutivePlansPage } from './components/pages/public/v2/ExecutivePlansPage';
import { NonprofitPlansPage } from './components/pages/public/v2/NonprofitPlansPage';
import { ForcePasswordChangeModal } from './components/modals/ForcePasswordChangeModal';
import { ConsolidatedExecutiveProvider } from './context/ConsolidatedExecutiveContext';
import { ConsolidatedExecutivePage } from './components/pages/ConsolidatedExecutivePage';
import { AnalyticsHealthCenterPage } from './components/pages/governance/AnalyticsHealthCenterPage';
import { ExecutiveCognitivePage } from './components/pages/ExecutiveCognitivePage';
import { ExecutiveInteractionProvider } from './context/executive-interaction/ExecutiveInteractionProvider';
import { ExecutiveCognitiveProvider } from './context/executive-cognitive/ExecutiveCognitiveProvider';
import { 
  ExecutiveModalOrchestrator, 
  InstitutionalBlockingDialog, 
  ExecutiveLoadingSurface, 
  GovernanceEscalationBanner 
} from './components/executive-interaction';
import { ExecutiveHomeWorkspace } from './components/executive/ExecutiveHomeWorkspace';
import { ExecutiveWorkspaceLab } from './components/executive-workspace/ExecutiveWorkspaceLab';
import { ExecutiveAppShell } from './components/executive-workspace/shell/ExecutiveAppShell';
import { ExperienceRouter } from './navigation/ExperienceRouter';
import { InstitutionalMemoryProvider, useInstitutionalMemory } from './context/institutional-memory/InstitutionalMemoryProvider';
import { ExecutiveCopilotPanel } from './components/executive-copilot/ExecutiveCopilotPanel';
import { useExecutiveUIStore } from '../packages/intelligence/executive-copilot/src/store/ExecutiveUIStore';
import { useExecutiveConversationStore } from '../packages/intelligence/executive-copilot/src/store/ExecutiveConversationStore';
import { RevenueRoutes } from './features/revenue/routes/revenue.routes';
import { ClientWorkspaceRoutes } from './features/revenue/routes/clientWorkspace.routes';

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
import { DEFAULT_OPEN_SUBMENUS, DEFAULT_PAGE, FLAT_NAV_ITEMS, NAVIGATION_GROUPS, LEGACY_ROUTE_MAP, type Page } from './app/navigation';
import { renderCurrentPage } from './app/routes';
import { internationalRoutes, routePrefixes, SupportedLocale, legacyAliases, RouteKey, getLocalizedRoute } from './core/routing/internationalRoutes';
import { useLocale } from './core/internationalization/providers/LocaleProvider';
import { resolveLandingRoute } from './core/navigation/landing.resolver';
import { ClientSelector } from './components/ClientSelector';
import { ScrollToTop } from './components/ScrollToTop';
import { GovernanceProvider, useGovernance } from './lib/governanceContext';
import { TenancyProvider } from './context/TenancyProvider';
import { SeoProvider } from './core/seo/SeoProvider';
import { LGPDModal } from './components/modals/GovernanceModals';
import { NavigationModeProvider } from './navigation/NavigationModeProvider';
import { AdvisorCommandCenter } from './components/advisor/AdvisorCommandCenter';
import { AdministrationWorkspacePage } from './components/pages/AdministrationWorkspacePage';
import { AdministrationAppShell } from './components/executive-workspace/shell/AdministrationAppShell';
import { MentorWorkspacePage } from './capabilities/mentorship/pages/MentorWorkspacePage';
import { MenteeWorkspacePage } from './capabilities/mentorship/pages/MenteeWorkspacePage';
import { ProgramAdminPage } from './capabilities/mentorship/pages/ProgramAdminPage';
import { ScenarioCommandCenter } from './components/war-room/ScenarioCommandCenter';
import { governanceService } from './services/governanceService';
import { DataAccessContext } from './core/security/data-access-context';
import { DadosHistoricosPage } from './components/pages/DadosHistoricosPage';
import { ExplorerContainer as ArchitectureExplorer } from '@illumine/architecture-governance-ui';
import { registerAllDiagnostics } from './intelligence/diagnostics';
import { DiagnosticJourneyPage } from './components/diagnostics/DiagnosticJourneyPage';
import { ExecutiveAdvisoryWorkspacePage } from './components/pages/ExecutiveAdvisoryWorkspacePage';
import { PlatformRevenueCenterPage } from './components/platform/PlatformRevenueCenterPage';
import { PlatformPipelinePage } from './components/platform/PlatformPipelinePage';
import { PlatformPartnerCenterPage } from './components/platform/PlatformPartnerCenterPage';
// Initialize all diagnostic registries
registerAllDiagnostics();

function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-0 transition-all duration-1000 justify-center w-full", collapsed ? "" : "")}>
      <div className={cn(
        "flex items-center justify-center transition-all duration-700 relative group",
        collapsed ? "w-[58px] h-[58px]" : "w-[84px] h-[84px] -translate-y-[8px]"
      )}>
        <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
      </div>
      {!collapsed && (
        <div className="flex flex-col items-start w-fit">
          <span 
            className="text-[72px] tracking-[-0.06em] text-foreground leading-[0.8] block" 
            style={{ fontFamily: '"Tilt Warp", sans-serif' }}
          >
            illumine
          </span>
          <div 
            className="flex justify-between w-full text-[10.5px] text-foreground uppercase mt-[2px] whitespace-nowrap" 
            style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '4px', paddingRight: '1px' }}
          >
            {"Governance".split('').map((char, i) => (
              <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("GLOBAL ERROR BOUNDARY CAUGHT:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-100 border border-red-500 rounded-xl m-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4 text-primary">CRITICAL RENDER ERROR</h1>
          <pre className="whitespace-pre-wrap text-sm text-red-900 bg-white/50 p-4 rounded">
            {String(this.state.error)}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-red-800 text-white rounded"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function IllumineMark({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="30" y1="30" x2="22" y2="22" stroke="var(--chart-secondary)" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="8" y2="50" stroke="var(--chart-secondary)" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="70" x2="22" y2="78" stroke="var(--chart-secondary)" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="82" x2="50" y2="92" stroke="var(--chart-secondary)" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="70" x2="78" y2="78" stroke="var(--chart-secondary)" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M50 22 C 34.5 22, 22 34.5, 22 50 C 22 65.5, 34.5 78, 50 78 C 65.5 78, 78 65.5, 78 50 M50 50 L75 25 M75 25 L65 25 M75 25 L75 35"
        stroke="var(--chart-secondary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// LoginScreen and LoginBrand have been replaced by LandingAuthPage

function AuthLoadingScreen() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-button bg-background border border-border shadow-sm flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-secondary" />
        </div>
        <p className="text-body-sm font-medium uppercase tracking-widest text-muted-foreground">
          Validando acesso
        </p>
      </div>
    </main>
  );
}

function AccessDeniedScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center text-foreground">
      <div className="flex flex-col items-center gap-6 max-w-md text-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2 text-primary">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Sua conta do Google foi autenticada, mas você não possui nenhum vínculo com empresas na plataforma ou privilégios administrativos.
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          Sair e tentar com outra conta
        </button>
      </div>
    </main>
  );
}

// Helper components for routing logic
function RootRedirect() {
  const { preference } = useLocale();
  const lang = preference.language as SupportedLocale;
  const prefix = routePrefixes[lang] || '/pt';
  return <Navigate to={prefix} replace />;
}

function LoginLanguageRedirect() {
  const { preference } = useLocale();
  const lang = preference.language as SupportedLocale;
  const prefix = routePrefixes[lang] || '/pt';
  return <Navigate to={`${prefix}/login`} replace />;
}

function LoginRedirect({ user, session }: { user: any; session: any }) {
  if (!user) {
    return <LoginPage />;
  }

  // Convert role to array for the resolver (since role in session is a string)
  const roles = session?.role ? [session.role] : [];
  
  // Evolve: SUPER_ADMIN maps to Admin, TENANT_ADMIN maps to Advisor or Client
  if (roles.includes('SUPER_ADMIN')) {
    roles.unshift('Admin');
  } else if (roles.includes('TENANT_ADMIN')) {
    roles.unshift('Advisor');
  } else if (roles.length === 0) {
    roles.push('Client Executive');
  }

  const landing = resolveLandingRoute(roles);
  
  // Fallback for missing new routes (client/advisor)
  if (landing.route === '/client/workspace' || landing.route.startsWith('/advisor')) {
    return <Navigate to="/dashboard/efos" replace />;
  }

  // Mentorship routes are handled by React Router directly
  if (landing.route.startsWith('/mentor/') || landing.route.startsWith('/mentee/') || landing.route.startsWith('/admin/programa')) {
    return <Navigate to={landing.route} replace />;
  }

  return <Navigate to={landing.route} replace />;
}

function LegacyRedirect({ routeKey }: { routeKey: RouteKey }) {
  const { preference } = useLocale();
  const lang = preference.language as SupportedLocale;
  const newPath = getLocalizedRoute(routeKey, lang);
  console.log(`[LegacyRedirect] routeKey: ${routeKey}, lang: ${lang}, redirecting to: ${newPath}`);
  return <Navigate to={newPath} replace />;
}

function getPageComponent(key: RouteKey) {
  switch (key) {
    case 'HOME': return <InstitutionalHomePage />;
    case 'PITCH': return <PitchPresentationPage />;
    case 'MANIFESTO': return <InstitutionalManifestoPage />;
    case 'WHY': return <InstitutionalWhyPage />;
    case 'PLATFORM': return <InstitutionalPlatformPage />;
    case 'DOMAINS': return <InstitutionalDomainsPage />;
    case 'GOVERNANCE': return <InstitutionalGovernancePage />;
    case 'GOVERNANCE_CENTER': return <InstitutionalIntelligenceCenterPage />;
    case 'DIAGNOSTIC': return <ExecutiveDiagnosticJourneyPage />;
    case 'CONTACT': return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-4">Contato Institucional</h3>
          <p className="text-slate-400 mb-8">A primeira etapa para conhecer a Illumine é realizar um Executive Assessment™.</p>
          <a href="/assessment" className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Iniciar Assessment
          </a>
        </div>
      </div>
    );
    case 'ADVISOR_NETWORK': return <InstitutionalAdvisorNetworkPage />;
    case 'ADVISOR_PARTNER': return <InstitutionalAdvisorPartnerPage />;
    case 'NONPROFIT': return <InstitutionalNonprofitPage />;
    case 'ENTERPRISE': return <EnterpriseIntelligencePage />;
    case 'PRIVACY': return <PrivacyPage />;
    case 'SECURITY': return <SecurityPage />;
    case 'PLANS': return <ExecutivePlansPage />;
    default: return <InstitutionalHomePage />;
  }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const { session, loading: authLoading, activateTenant, logout: institutionalLogout, user } = useInstitutionalAuth();

  const [currentPage, setCurrentPage] = useState<Page>(DEFAULT_PAGE);
  const [academyCourseId, setAcademyCourseId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [clients, setClients] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dados de Cadastro', 'Análise de Performance', 'Planejamento Estratégico']);
  
  // --- WAVE 3A: SEPARATION OF PERSONA, PERMISSION, AND TENANT ---
  // 1. Persona Layer (defines the overall experience and default workspace)
  const userPersona = session?.role || 'VIEWER';
  const isMaster = userPersona === 'SUPER_ADMIN';
  const isPartner = userPersona === 'TENANT_ADMIN' || session?.availableTenants?.some(t => t.role === 'TENANT_ADMIN');
  
  // 2. Permission Layer (defines visibility of tools within the workspace)
  // Permissions are fully managed by InstitutionalAuth; null = full access for SUPER_ADMIN
  const userPermissions: string[] | null = isMaster ? null : (session?.permissions || []);
  const clientPermissionsMap: Record<string, string[]> = {};
  
  // 3. Tenant Layer (defines data context)
  const userPartnerIds = session?.availableTenants?.filter(t => t.role === 'TENANT_ADMIN').map(t => t.tenantId) || [];
  const rolesLoaded = !authLoading && session !== null;
  const initialRedirectDone = useRef(false);
  
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(DEFAULT_OPEN_SUBMENUS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : window.innerWidth < 1280;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);

  const toggleSidebar = () => {
    const newCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // Sync session tenants to legacy "clients" state
  useEffect(() => {
    if (session?.availableTenants) {
      setClients(session.availableTenants.map(t => ({
        id: t.tenantId,
        fantasia: t.name,
        razao: t.name,
        razaoSocial: t.name,
        name: t.name,
        segmentoAtuacao: t.segmentoAtuacao,
        segmento: t.segmento,
        logo: t.logo,
        icon: t.icon
      })));
      if (session.selectedTenantId) {
        setSelectedClient(session.selectedTenantId);
      }
    } else {
      setClients([]);
      setSelectedClient('');
    }
  }, [session]);

  const handleSelectClient = (clientId: string) => {
    activateTenant(clientId);
    setSelectedClient(clientId);
  };

  // Initialize canonical light theme
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('app-theme', 'light');
    };

    applyTheme();

    // Listen for storage events (changes from other tabs/pages)
    window.addEventListener('storage', (e) => {
      if (e.key === 'app-theme') applyTheme();
    });

    // Custom event for immediate update in the same tab
    window.addEventListener('theme-changed', applyTheme);

    const handleNavigate = (e: any) => {
      navigate(`/dashboard/${e.detail}`);
    };
    window.addEventListener('navigate-to', handleNavigate);

    return () => {
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener('theme-changed', applyTheme);
      window.removeEventListener('navigate-to', handleNavigate);
    };
  }, [navigate]);

  // Sync currentPage state from URL
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard/')) {
      const parts = location.pathname.split('/');
      let page = parts[2];
      
      // Route Compatibility Layer: Legacy Route -> Route Resolver -> Canonical Route
      if (page && LEGACY_ROUTE_MAP[page]) {
        console.log(`[RouteResolver] Remapping legacy route ${page} to ${LEGACY_ROUTE_MAP[page]}`);
        page = LEGACY_ROUTE_MAP[page];
        navigate(`/dashboard/${page}`, { replace: true });
      }

      if (page && page !== currentPage) {
        setCurrentPage(page as Page);
      }
    } else if (location.pathname === '/dashboard') {
      if (currentPage !== 'efos') {
        setCurrentPage('efos' as Page);
      }
    }
  }, [location.pathname, currentPage, navigate]);

  // Client state is now managed by InstitutionalAuth session sync above (useEffect at line 267).

  // Initial redirection and welcome message logic
  useEffect(() => {
    if (!authLoading && user && rolesLoaded && !initialRedirectDone.current) {
      console.log('[Redirect] Checking initial redirection', { isMaster, isPartner });
      
      // Only redirect if at root or login
      if (location.pathname === '/' || location.pathname === '/login') {
        // Role-based redirection: Master/Partner -> portfolio, Company User -> dashboard
        if (isMaster || isPartner) {
          navigate('/dashboard/portfolio', { replace: true });
        } else {
          navigate('/dashboard/efos', { replace: true });
        }
      }

      // First access of the day check
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const lastAccessKey = `last_access_${user.uid}`;
      const sessionShownKey = `session_welcome_shown_${user.uid}`;
      
      const lastAccess = localStorage.getItem(lastAccessKey);
      const sessionShown = sessionStorage.getItem(sessionShownKey);
      
      const isFirstAccessOfDay = lastAccess !== today && sessionShown !== today;
      
      if (isFirstAccessOfDay) {
        // Prevent StrictMode from firing this logic twice and dropping the modal
        sessionStorage.setItem(sessionShownKey, today);
        localStorage.setItem(lastAccessKey, today);
        // TEMPORARILY DISABLED: setWelcomeText(getRandomWelcomeMessage());
        // TEMPORARILY DISABLED: setShowWelcome(true);
      }

      // Client Selection Logic: 
      // If Admin/Partner and first access of the day -> Empty
      // If Admin/Partner and subsequent access -> Last viewed
      // If Regular User -> First available client
      if (isMaster || isPartner) {
        if (isFirstAccessOfDay) {
          setSelectedClient('');
        } else {
          const lastClient = localStorage.getItem(`last_client_${user.uid}`);
          if (lastClient && clients.some((c: any) => c.id === lastClient)) {
            setSelectedClient(lastClient);
          } else {
            setSelectedClient('');
          }
        }
      } else if (clients.length > 0) {
        const nonModelClient = clients.find(c => !c.isModel);
        setSelectedClient(nonModelClient ? nonModelClient.id : clients[0].id);
      }

      initialRedirectDone.current = true;
    }
  }, [authLoading, user, rolesLoaded, isMaster, isPartner, clients]);

  const currentPageLabel = FLAT_NAV_ITEMS.find((item) => item.id === currentPage)?.label || '';

  const payrollClients = useMemo(() => clients.map(c => ({
    id: c.id,
    name: c.fantasia || c.name || 'Cliente',
    period: selectedYear.toString(),
    employees: []
  })), [clients, selectedYear]);

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (user && session?.sessionState === 'DENIED') {
    return <AccessDeniedScreen onLogout={institutionalLogout} />;
  }

  return (
    <LocaleProvider>
      <LanguageProvider>
        <GovernanceProvider user={user}>
          <TenancyProvider>
            <ExecutiveCognitiveProvider>
              <ExecutiveInteractionProvider>
                <InstitutionalMemoryProvider initialTenantId={selectedClient}>
                  <ScrollToTop />
                  <SeoProvider>
                  <NavigationModeProvider>
                  <Routes>
                    {/* ROOT REDIRECT */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* EXTERNAL CLIENT WORKSPACE ROUTES (NO INSTITUTIONAL AUTH REQUIRED) */}
                    {ClientWorkspaceRoutes()}

                    {/* REVENUE DOMAIN ROUTES */}                    {/* {RevenueRoutes()} */}
                    {/* CANONICAL ROUTES BY LOCALE */}
                    {(Object.keys(routePrefixes) as SupportedLocale[]).map((locale) => {
                      const prefix = routePrefixes[locale];
                      return (
                        <React.Fragment key={locale}>
                          <Route element={<InstitutionalLayout />}>
                            {Object.entries(internationalRoutes).map(([routeKey, canonicalSlug]) => {
                              if (routeKey === 'LOGIN' || routeKey === 'PLANS' || routeKey === 'PITCH') return null;
                              const path = canonicalSlug === '/' ? prefix : `${prefix}${canonicalSlug}`;
                              return (
                                <Route 
                                  key={routeKey}
                                  path={path} 
                                  element={getPageComponent(routeKey as RouteKey)}
                                />
                              );
                            })}
                          </Route>
                        </React.Fragment>
                      );
                    })}

                    {/* FULLSCREEN STANDALONE ROUTES (No Header/Footer Layouts) */}
                    {(Object.keys(routePrefixes) as SupportedLocale[]).map((locale) => {
                      const prefix = routePrefixes[locale];
                      const pitchPath = internationalRoutes['PITCH'];
                      return (
                        <React.Fragment key={`pitch-${locale}`}>
                          <Route 
                            path={`${prefix}${pitchPath}`} 
                            element={getPageComponent('PITCH')}
                          />
                        </React.Fragment>
                      );
                    })}

                    {/* STANDALONE ROUTES (e.g. Plans, Commercial Landing) */}
                    <Route element={<CommercialLandingLayout />}>
                      {(Object.keys(routePrefixes) as SupportedLocale[]).map((locale) => {
                        const prefix = routePrefixes[locale];
                        const plansPath = internationalRoutes['PLANS'];
                        const nonprofitPlansPath = internationalRoutes['NONPROFIT_PLANS'];
                        return (
                          <React.Fragment key={`plans-${locale}`}>
                            <Route 
                              path={`${prefix}${plansPath}`} 
                              element={<ExecutivePlansPage />}
                            />
                            <Route 
                              path={`${prefix}${nonprofitPlansPath}`} 
                              element={<NonprofitPlansPage />}
                            />
                          </React.Fragment>
                        );
                      })}
                    </Route>

                    {/* EXPLICIT LOGIN ROUTES TO AVOID REACT ROUTER V6 MAP ISSUES */}
                    <Route path="/login" element={<LoginLanguageRedirect />} />
                    <Route path="/pt/login" element={<LoginRedirect user={user} session={session} />} />
                    <Route path="/en/login" element={<LoginRedirect user={user} session={session} />} />
                    <Route path="/es/login" element={<LoginRedirect user={user} session={session} />} />

                    {/* LEGACY REDIRECTS */}
                    {Object.entries(legacyAliases).map(([legacySlug, routeKey]) => (
                      <Route 
                        key={`legacy-${legacySlug}`} 
                        path={legacySlug} 
                        element={<LegacyRedirect routeKey={routeKey} />} 
                      />
                    ))}

                    {/* NAKED CANONICAL SLUGS REDIRECTS (e.g. /platform -> /en/platform) */}
                    {Object.entries(internationalRoutes).map(([routeKey, canonicalSlug]) => {
                      if (canonicalSlug === '/') return null;
                      return (
                        <Route 
                          key={`naked-${canonicalSlug}`} 
                          path={canonicalSlug} 
                          element={<LegacyRedirect routeKey={routeKey as RouteKey} />} 
                        />
                      );
                    })}

                    {/* Fallbacks temporários para as páginas de apoio antigas dentro do novo layout */}
                    <Route path="/insights" element={<ExecutivePlatformLandingPage />} />
                    
                    {/* Dev routes */}
                    {import.meta.env.DEV && (
                      <Route element={<InstitutionalLayout />}>
                        <Route path="/debug/i18n" element={<DebugI18nPage />} />
                      </Route>
                    )}
                    
                    {/* Root Redirect to language prefix */}
                    <Route path="/" element={<Navigate to="/pt" replace />} />
                    <Route path="/tese" element={<Navigate to="/pt/manifesto" replace />} />


                    {/* Diagnostic Journeys & Advisory */}
                    <Route path="/journeys/:journeyId" element={<DiagnosticJourneyPage />} />
                    <Route path="/executive-advisory" element={<ExecutiveAdvisoryWorkspacePage />} />

                    {/* Legacy Routes */}
                    <Route path="/parceiros" element={<PartnerSalesPage />} />
                    <Route path="/diagnostico" element={<DiagnosticoPage />} />
                    <Route path="/executive-home" element={<ExecutiveHomeWorkspace />} />
                    <Route path="/consolidated-executive" element={<Navigate to="/dashboard/consolidated_executive" replace />} />
                    <Route path="/executive-cognitive" element={<ExecutiveCognitivePage />} />
                    <Route path="/investigation/:nodeId" element={<BoardInvestigationWorkspace />} />
                    <Route path="/governance-time-machine" element={<GovernanceTimeMachinePage />} />
                    <Route path="/governance-time-machine/:nodeId" element={<GovernanceTimeMachinePage />} />
                    <Route path="/digital-twin" element={<InstitutionalDigitalTwinPage />} />
                    <Route path="/digital-twin/:domainId" element={<InstitutionalDigitalTwinPage />} />
                    
                    {/* Executive Workspace Lab (Wave 16C) */}
                    <Route path="/workspace/:office" element={<ExecutiveWorkspaceLab />} />
                    
                    {/* Executive AppShell Lab (Wave 17C & 17C.1) */}
                    <Route path="/executive/workspace/:office" element={
                      <ExecutiveAppShell>
                        <ExecutiveWorkspaceLab />
                      </ExecutiveAppShell>
                    } />
                    <Route path="/executive/workspace/:office/:surface" element={
                      <ExecutiveAppShell>
                        <ExecutiveWorkspaceLab />
                      </ExecutiveAppShell>
                    } />

                    {/* Platform Workspace PoC (Wave 17J.1.10) */}
                    <Route path="/platform/workspace/revenue-center" element={
                      <ExecutiveAppShell semanticMatch={{ isLegacyUrl: true, officeId: 'platform-workspace', surfaceId: 'platform.revenue-center' }}>
                        <PlatformRevenueCenterPage />
                      </ExecutiveAppShell>
                    } />
                    <Route path="/platform/workspace/pipeline-governance" element={
                      <ExecutiveAppShell semanticMatch={{ isLegacyUrl: true, officeId: 'platform-workspace', surfaceId: 'platform.pipeline-governance' }}>
                        <PlatformPipelinePage />
                      </ExecutiveAppShell>
                    } />
                    <Route path="/platform/workspace/partner-center" element={
                      <ExecutiveAppShell semanticMatch={{ isLegacyUrl: true, officeId: 'platform-workspace', surfaceId: 'platform.partner-center' }}>
                        <PlatformPartnerCenterPage />
                      </ExecutiveAppShell>
                    } />

                    {/* Standalone Executive Workspaces (Canonical UI) */}
                    <Route path="/executive/revenue/deal-room/:opportunityId" element={
                      <AdministrationAppShell noPadding noScroll>
                        <OpportunityDealRoomPage />
                      </AdministrationAppShell>
                    } />

                    <Route path="/executive/revenue/*" element={
                      <AdministrationAppShell>
                        <RevenueRoutes />
                      </AdministrationAppShell>
                    } />
                    
                    <Route path="/advisor" element={<AdvisorCommandCenter />} />
                    <Route path="/advisor/:organizationId" element={<AdvisorCommandCenter />} />

                    {/* Mentorship Workspace Routes */}
                    <Route path="/mentor/workspace/*" element={
                      user ? (
                        <MentorWorkspacePage
                          mentorId={user.uid}
                          programId={selectedClient}
                          tenantId={selectedClient}
                          mentorName={user.displayName ?? undefined}
                        />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    } />
                    <Route path="/mentee/workspace/*" element={
                      user ? (
                        <MenteeWorkspacePage
                          menteeId={user.uid}
                          programId={selectedClient}
                          tenantId={selectedClient}
                          menteeName={user.displayName ?? undefined}
                        />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    } />
                    <Route path="/admin/programa/*" element={
                      user ? (
                        <ProgramAdminPage
                          programId={selectedClient}
                          tenantId={selectedClient}
                          adminName={user.displayName ?? undefined}
                        />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    } />

                    <Route path="/administration/workspace" element={
                      <AdministrationAppShell>
                        <AdministrationWorkspacePage />
                      </AdministrationAppShell>
                    } />
                    <Route path="/war-room" element={<ScenarioCommandCenter />} />
                    <Route path="/war-room/:scenarioId" element={<ScenarioCommandCenter />} />
                    <Route path="/governance" element={<InstitutionalIntelligenceWorkspace />} />
                    <Route path="/governance/:objectId" element={<InstitutionalIntelligenceWorkspace />} />
                    <Route path="/architecture-governance/explorer" element={<ArchitectureExplorer />} />
                    <Route path="/governance/analytics-health" element={
                      isMaster || isPartner ? (
                        <AnalyticsHealthCenterPage />
                      ) : (
                        <Navigate to="/" replace />
                      )
                    } />
                    
                    <Route 
                      path="/dashboard/*" 
                      element={
                        user ? (
                          <GovernanceProvider user={user}>
                            <TooltipProvider>
                              {requirePasswordChange && <ForcePasswordChangeModal onSuccess={() => setRequirePasswordChange(false)} />}
                              <AppContent 
                                user={user}
                                authLoading={authLoading}
                                clients={clients}
                                selectedClient={selectedClient}
                                setSelectedClient={setSelectedClient}
                                selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                                setCurrentPage={(page: Page) => navigate(`/dashboard/${page}`)}
                                setClients={setClients}
                                currentPage={currentPage}
                                academyCourseId={academyCourseId}
                                setAcademyCourseId={setAcademyCourseId}
                                isSidebarCollapsed={isSidebarCollapsed}
                                setIsSidebarCollapsed={setIsSidebarCollapsed}
                                isMobileMenuOpen={isMobileMenuOpen}
                                setIsMobileMenuOpen={setIsMobileMenuOpen}
                                openSubmenus={openSubmenus}
                                toggleSubmenu={toggleSubmenu}
                                userPermissions={userPermissions}
                                isPartner={isPartner}
                                isMaster={isMaster}
                                userPartnerIds={userPartnerIds}
                                showWelcome={showWelcome}
                                setShowWelcome={setShowWelcome}
                                welcomeText={welcomeText}
                              />
                            </TooltipProvider>
                          </GovernanceProvider>
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  </NavigationModeProvider>
                  </SeoProvider>
                </InstitutionalMemoryProvider>
              </ExecutiveInteractionProvider>
            </ExecutiveCognitiveProvider>
          </TenancyProvider>
        </GovernanceProvider>
      </LanguageProvider>
    </LocaleProvider>
  );
}


function AppContent({ 
  user, 
  authLoading, 
  clients, 
  selectedClient, 
  setSelectedClient,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  setCurrentPage,
  setClients,
  currentPage,
  academyCourseId,
  setAcademyCourseId,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  openSubmenus,
  toggleSubmenu,
  userPermissions,
  isPartner,
  isMaster,
  userPartnerIds,
  showWelcome,
  setShowWelcome,
  welcomeText
}: any) {
  const { t } = useLanguage();
  const { isAccepted, setAccepted, role, loading: governanceLoading } = useGovernance();
  const { loadMemoryForTenant } = useInstitutionalMemory();
  const { isOpen } = useExecutiveUIStore();
  const { clearConversation } = useExecutiveConversationStore();
  const [showUniversalImport, setShowUniversalImport] = useState(false);
  const [isGlobalReportModalOpen, setIsGlobalReportModalOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (selectedClient) {
      loadMemoryForTenant(selectedClient);
    }
  }, [selectedClient, loadMemoryForTenant]);
  const totalPending = Object.values(pendingCounts).reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    if (!isMaster) {
      setPendingCounts({});
      return;
    }

    const collectionsToMonitor = ['financial_entries', 'payables', 'receivables', 'budgets', 'account_plans', 'document_uploads'];
    const unsubscribes = collectionsToMonitor.map(colName => {
      const q = query(
        collection(db, colName),
        where('status', '==', 'pending')
      );
      return onSnapshot(q, (snapshot) => {
        setPendingCounts(prev => ({ ...prev, [colName]: snapshot.size }));
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [isMaster]);
  // We'll use totalPending instead of pendingApprovalsCount in the UI

  useEffect(() => {
    if (selectedClient && clients.length > 0) {
      const client = clients.find(c => c.id === selectedClient);
      if (client?.currency) {
        setActiveCurrency(client.currency);
      } else {
        setActiveCurrency('BRL');
      }
    }
  }, [selectedClient, clients]);

  const handleSelectClient = async (id: string) => {
    setSelectedClient(id);
    clearConversation();
    if (user) {
      localStorage.setItem(`last_client_${user.uid}`, id);
    }
    const client = clients.find((c: any) => c.id === id);
    if (client) {
      if (client.currency) {
        setActiveCurrency(client.currency);
      } else {
        setActiveCurrency('BRL');
      }
      const systemContext: DataAccessContext = {
        actorId: user?.uid || 'guest',
        tenantId: 'SYSTEM',
        role: 'SUPER_ADMIN',
        permissions: ['VIEW_AUDIT_LOGS'],
        entityScope: { tenantId: 'SYSTEM', requestedEntityScope: 'ENTITY', entityId: 'SYSTEM', allowedEntityIds: ['SYSTEM'], allowedGroupIds: [], consolidatedScope: true },
        requestedAction: 'VIEW_AUDIT_LOGS',
        resourceType: 'Config',
        resourceTenantId: 'SYSTEM',
        visibilityPolicy: 'INTERNAL',
        auditRequirement: false
      };
      await governanceService.logAction(systemContext, {
        user_id: user?.uid || '',
        role: role as any,
        empresa_id: isPartner ? userPartnerIds[0] : '', // Use first partner ID if partner
        cliente_ativo_id: id,
        acao: 'seleção de cliente ativo',
        detalhes: {
        fantasia: client.fantasia,
          cnpj: client.cnpj
        }
      });
    }
  };

  return (
    <>
      {/* TEMPORARILY DISABLED
      <WelcomeMessage 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
        message={welcomeText}
        userName={user?.displayName || ''}
      />
      */}
      <ExperienceRouter
        legacyLayout={(content) => (
          <SidebarProvider
            defaultOpen={!isSidebarCollapsed}
            className="bg-background text-foreground transition-colors duration-500 overflow-hidden h-screen"
          >
            {/* Shadcn AppSidebar */}
          <AppSidebar
            user={user}
            authLoading={authLoading}
            clients={clients}
            selectedClient={selectedClient}
            handleSelectClient={handleSelectClient}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            openSubmenus={openSubmenus}
            toggleSubmenu={toggleSubmenu}
            userPermissions={userPermissions}
            isPartner={isPartner}
            isMaster={isMaster}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            totalPending={totalPending}
          />

          <main className="flex-1 flex flex-row min-w-0 relative h-full overflow-hidden">
            
            {/* Main Content Column */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
        <header className="h-14 sm:h-16 bg-background flex items-center justify-between px-2 sm:px-4 md:px-8 sticky top-0 z-50 transition-all duration-700">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-8 min-w-0">
            <SidebarTrigger className="text-foreground/70 hover:text-foreground hover:bg-surface-elevated transition-all duration-300 rounded-full p-2 shrink-0" />
            
            <div className="block shrink min-w-0">
              <ClientSelector 
                clients={clients} 
                selectedClient={selectedClient} 
                setSelectedClient={handleSelectClient} 
                onManageClients={() => setCurrentPage('clientes')}
              />
            </div>
 
            <div className="relative group hidden xl:block shrink-0">
              <input 
                type="text" 
                placeholder={t('buttons.search_placeholder')} 
                className="pl-11 pr-5 py-3 bg-surface-elevated border border-border rounded-full focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all duration-300 outline-none w-48 xl:w-64 text-xs font-sans text-foreground placeholder:text-muted-foreground hover:border-border/80" 
              />
              <Search size={15} strokeWidth={1.5} className="text-foreground/70 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors duration-300" />
            </div>
          </div>
            
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 shrink-0">
            <LanguageSelector />
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-3">
              <button 
                 onClick={() => window.print()}
                 className="p-2.5 text-foreground/70 hover:text-foreground hover:bg-surface-elevated rounded-full transition-all duration-300"
                 title={t('buttons.print_page')}
              >
                 <FileSpreadsheet size={20} strokeWidth={1} />
              </button>
              <button 
                 onClick={() => setShowUniversalImport(true)}
                 className="p-2.5 text-foreground/70 hover:text-primary hover:bg-surface-elevated rounded-full transition-all duration-300 hidden sm:flex group relative"
                 title={t('buttons.import_documents')}
              >
               <UploadCloud size={20} strokeWidth={1} />
                 {totalPending > 0 && isMaster && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-critical-soft0 rounded-full animate-pulse" />
                 )}
              </button>
            </div>



            <button 
              onClick={() => setIsGlobalReportModalOpen(true)}
              className="relative px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full overflow-hidden group bg-primary text-primary-foreground shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500 active:scale-95 flex items-center gap-1.5 sm:gap-2 md:gap-3 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Zap strokeWidth={2.5} className="relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[clamp(8px,2vw,11px)] font-bold uppercase tracking-widest relative z-10">
                {t('buttons.generate_analysis')}
              </span>
            </button>
          </div>
        </header>

        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
          {content}
        </div>


        {showUniversalImport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl bg-card flex flex-col">
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container/50 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-foreground">Importação Universal de Inteligência</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">
                    Central de Governança e Auditabilidade
                  </p>
                </div>
                <button 
                  onClick={() => setShowUniversalImport(false)}
                  className="p-2 hover:bg-surface-elevated rounded-full transition-colors text-neutral"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <DadosHistoricosPage 
                  clients={clients}
                  user={user}
                  selectedClient={selectedClient}
                  setSelectedClient={handleSelectClient}
                  hideHeader={true}
                />
              </div>
            </div>
          </div>
        )}

        <GenerateBoardReportModal
          isOpen={isGlobalReportModalOpen}
          onClose={() => setIsGlobalReportModalOpen(false)}
          clientId={selectedClient}
          companyName={clients.find((c: any) => c.id === selectedClient)?.fantasia || clients.find((c: any) => c.id === selectedClient)?.razao || clients.find((c: any) => c.id === selectedClient)?.razaoSocial || clients.find((c: any) => c.id === selectedClient)?.name || 'Cliente Selecionado'}
          financialData={[]}
          selectedYear={selectedYear}
        />
        </div>

        {/* Right-side AI Panel (Inline flex item) */}
        <ExecutiveCopilotPanel />
      </main>
      </SidebarProvider>
        )}
      >
        {/* CHILDREN PASSED TO ROUTER */}
        <div id="main-content-wrapper" className="max-w-[1600px] mx-auto w-full space-y-6">
          <GovernanceEscalationBanner />
          <GlobalErrorBoundary>
            {(renderCurrentPage({
              currentPage,
              clients,
              selectedClient,
              setSelectedClient: handleSelectClient,
              selectedMonth,
              setSelectedMonth,
              selectedYear,
              setSelectedYear,
              user,
              setCurrentPage,
              setClients,
              academyCourseId,
              setAcademyCourseId,
              isPartner,
              isMaster,
              userPartnerIds
            }) as React.ReactNode)}
          </GlobalErrorBoundary>
        </div>
      </ExperienceRouter>
      {/* Global Governance Interaction Overlays */}
      <ExecutiveModalOrchestrator />
      <InstitutionalBlockingDialog />
      <ExecutiveLoadingSurface />
    </>
  );
}
