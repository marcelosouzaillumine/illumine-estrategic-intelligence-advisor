/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
} from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot, limit, writeBatch, or } from 'firebase/firestore';
import { auth, login, logout, db, handleFirestoreError, OperationType, MASTER_ADMINS } from './lib/firebase';
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
import { DEFAULT_OPEN_SUBMENUS, DEFAULT_PAGE, FLAT_NAV_ITEMS, NAVIGATION_GROUPS, type Page } from './app/navigation';
import { renderCurrentPage } from './app/routes';
import { ClientSelector } from './components/ClientSelector';
import { GovernanceProvider, useGovernance } from './lib/governanceContext';
import { LGPDModal } from './components/modals/GovernanceModals';
import { governanceService } from './services/governanceService';
import { DadosHistoricosPage } from './components/pages/DadosHistoricosPage';


function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-1 transition-all duration-1000 justify-center w-full", collapsed ? "" : "")}>
      <div className={cn(
        "flex items-center justify-center transition-all duration-700 relative group",
        collapsed ? "w-[58px] h-[58px]" : "w-[72px] h-[72px] -translate-y-[6px]"
      )}>
        <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
      </div>
      {!collapsed && (
        <div className="flex flex-col w-fit">
          <span 
            className="text-[51px] tracking-[-0.06em] text-text-main leading-[0.8]" 
            style={{ fontFamily: '"Tilt Warp", sans-serif' }}
          >
            illumine
          </span>
          <div 
            className="flex justify-between w-full text-[13px] text-secondary uppercase mt-0" 
            style={{ fontFamily: '"Work Sans", sans-serif' }}
          >
            {"Business Intelligence".split('').map((char, i) => (
              <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
      <line x1="30" y1="30" x2="22" y2="22" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="8" y2="50" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="70" x2="22" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="82" x2="50" y2="92" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="70" x2="78" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M50 22 C 34.5 22, 22 34.5, 22 50 C 22 65.5, 34.5 78, 50 78 C 65.5 78, 78 65.5, 78 50 M50 50 L75 25 M75 25 L65 25 M75 25 L75 35"
        stroke="#ff8552"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoginBrand() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-[22px] bg-primary shadow-2xl shadow-primary/20 flex items-center justify-center">
        <IllumineMark className="w-11 h-11" />
      </div>
      <div>
        <p className="text-3xl font-black uppercase leading-none tracking-tight text-primary">Illumine</p>
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.42em] text-secondary">
          Assessoria Estratégica
        </p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const handleGlobalError = (e: any) => {
      setLoginError(e.detail);
      setIsSigningIn(false);
    };
    window.addEventListener('login-error', handleGlobalError);
    return () => window.removeEventListener('login-error', handleGlobalError);
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setLoginError('');
    try {
      await login();
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      setLoginError(
        error?.code === 'auth/popup-closed-by-user'
          ? 'Login cancelado antes da confirmação.'
          : 'Não foi possível entrar com Google. Verifique se este domínio está autorizado para acesso.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe7] text-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,133,82,0.18)_0%,rgba(255,255,255,0.58)_42%,rgba(186,184,108,0.16)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="relative min-h-screen grid lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16 xl:px-20">
          <LoginBrand />

          <div className="max-w-3xl py-14 lg:py-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 border border-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 shadow-sm mb-8">
              <Sparkles size={14} className="text-secondary" />
              Inteligência financeira para decisões de alto impacto
            </div>
            <h2 className="font-display text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[0.94] text-primary max-w-3xl">
              Sua central de advisory começa aqui.
            </h2>
            <p className="mt-7 text-base sm:text-lg text-slate-600 leading-8 max-w-2xl">
              Acesse clientes, indicadores e relatórios executivos em um ambiente privado, organizado para análise estratégica e gestão financeira recorrente.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              ['Visão', 'Portfólio consultivo'],
              ['Ritmo', 'Indicadores mensais'],
              ['Entrega', 'Relatórios executivos'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] bg-white/72 border border-white px-5 py-4 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-black text-primary">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 pb-10 lg:p-10 xl:p-16">
          <div className="w-full max-w-[480px] rounded-[30px] bg-white border border-white shadow-2xl shadow-slate-900/12 overflow-hidden">
            <div className="bg-primary text-white p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center">
                  <IllumineMark className="w-11 h-11" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                  <CheckCircle2 size={13} />
                  Acesso protegido
                </div>
              </div>
              <h3 className="mt-9 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Entrar no painel
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Continue com sua conta Google para acessar seu ambiente de trabalho Illumine.
              </p>
            </div>

            <div className="p-8 sm:p-10 space-y-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="w-full h-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-sm font-black text-slate-900 shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                {isSigningIn ? (
                  <Loader2 size={18} className="animate-spin text-secondary" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[11px] font-black text-secondary">
                    G
                  </span>
                )}
                {isSigningIn ? 'Conectando...' : 'Entrar com Google'}
              </button>

              {loginError && (
                <div className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-bold text-rose-700 leading-5">
                  {loginError}
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Ambiente privado
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Suas informações ficam associadas à sua conta e são apresentadas somente após a autenticação.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthLoadingScreen() {
  return (
    <main className="min-h-screen bg-light flex items-center justify-center text-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-secondary" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
          Validando acesso
        </p>
      </div>
    </main>
  );
}


export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(DEFAULT_PAGE);
  const [academyCourseId, setAcademyCourseId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [clients, setClients] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dados de Cadastro', 'Análise de Performance', 'Planejamento Estratégico']);
  const [user, setUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[] | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(DEFAULT_OPEN_SUBMENUS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : window.innerWidth < 1280;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [userPartnerIds, setUserPartnerIds] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const initialRedirectDone = useRef(false);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setAuthLoading(true);
        try {
          const userEmail = (u.email || '').toLowerCase().trim();
          const masterCheck = MASTER_ADMINS.some(email => email.toLowerCase().trim() === userEmail);
          
          let hasAccess = masterCheck;
          
          if (!hasAccess) {
            const userAssocQuery = query(collection(db, 'client_users'), where('email', '==', u.email));
            const assocSnap = await getDocs(userAssocQuery);
            if (!assocSnap.empty) {
              const activeUsers = assocSnap.docs.filter(doc => doc.data().status !== 'Inativo');
              if (activeUsers.length > 0) {
                hasAccess = true;
              }
            }
            
            if (!hasAccess) {
              const ownerQuery = query(collection(db, 'clients'), where('ownerId', '==', u.uid));
              const ownerSnap = await getDocs(ownerQuery);
              if (!ownerSnap.empty) {
                hasAccess = true;
              }
            }

            if (!hasAccess) {
              const partnerQuery = query(collection(db, 'partners'), where('ownerId', '==', u.uid));
              const partnerSnap = await getDocs(partnerQuery);
              if (!partnerSnap.empty) {
                hasAccess = true;
              }
            }
          }
          
          if (hasAccess) {
            setUser(u);
          } else {
            await logout();
            setUser(null);
            window.dispatchEvent(new CustomEvent('login-error', { detail: 'Acesso negado. Usuário não cadastrado na plataforma.' }));
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          await logout();
          setUser(null);
          window.dispatchEvent(new CustomEvent('login-error', { detail: 'Erro ao verificar credenciais de acesso.' }));
        } finally {
          setAuthLoading(false);
        }
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize and listen for theme changes
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = (localStorage.getItem('app-theme') as 'light' | 'dark' | 'system') || 'light';
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (savedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(savedTheme);
      }
    };

    applyTheme();

    // Listen for storage events (changes from other tabs/pages)
    window.addEventListener('storage', (e) => {
      if (e.key === 'app-theme') applyTheme();
    });

    // Custom event for immediate update in the same tab
    window.addEventListener('theme-changed', applyTheme);

    const handleNavigate = (e: any) => {
      setCurrentPage(e.detail);
    };
    window.addEventListener('navigate-to', handleNavigate);

    return () => {
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener('theme-changed', applyTheme);
      window.removeEventListener('navigate-to', handleNavigate);
    };
  }, []);

  // Fetch clients from Firestore if user is authenticated
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setClients([]);
      setSelectedClient('');
      return;
    }

    const fetchClients = async () => {
      try {
        const userEmail = (user.email || '').toLowerCase().trim();
        const masterCheck = MASTER_ADMINS.some(email => email.toLowerCase().trim() === userEmail);
        setIsMaster(masterCheck);
        
        console.log('[Auth] Master Check:', { userEmail, isMaster: masterCheck });

        let q;
        if (masterCheck) {
          console.log('[Auth] Master Admin: Fetching ALL clients');
          q = query(collection(db, 'clients'));
          setUserPermissions(null);
        } else {
          const userAssocQuery = query(collection(db, 'client_users'), where('email', '==', user.email));
          const assocSnap = await getDocs(userAssocQuery);
          
          if (!assocSnap.empty) {
            const assocData = assocSnap.docs.map(doc => doc.data());
            const assocIds = assocData.map(d => d.clientId);
            const permissions = assocData.flatMap(d => d.permissoes || []);
            setUserPermissions(permissions);

            // Check if any assocId is a partnerId
            const partnersSnap = await getDocs(query(collection(db, 'partners'), where('__name__', 'in', assocIds)));
            const partnerIds = partnersSnap.docs.map(d => d.id);

            if (partnerIds.length > 0) {
              console.log('[Auth] Partner detected:', partnerIds);
              setIsPartner(true);
              setUserPartnerIds(partnerIds);
              // For partners, fetch clients where partnerId matches OR isModel is true
              q = query(collection(db, 'clients'), 
                or(
                  where('partnerId', 'in', partnerIds),
                  where('isModel', '==', true)
                )
              );
            } else {
              setIsPartner(false);
              setUserPartnerIds([]);
              // For regular users, fetch linked clients OR model companies
              q = query(collection(db, 'clients'), 
                or(
                  where('__name__', 'in', assocIds),
                  where('isModel', '==', true)
                )
              );
            }
          } else {
            setUserPermissions(null);
            setIsPartner(false);
            setUserPartnerIds([]);
            q = query(collection(db, 'clients'), where('ownerId', '==', user.uid));
          }
        }

        return onSnapshot(q, (snapshot) => {
          const dbClients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('[Auth] Clients found:', dbClients.length);
          setClients(dbClients);
          setRolesLoaded(true);
          // Removed automatic selection here to handle it in the initial logic useEffect
        }, (error) => {
          console.error("[Auth] Snapshot Error:", error);
          setClients([]);
          setRolesLoaded(true);
        });
      } catch (error) {
        console.error("[Auth] Fetch Error:", error);
        setClients([]);
        setRolesLoaded(true);
      }
    };

    const unsubscribePromise = fetchClients();
    return () => {
      unsubscribePromise.then(unsub => unsub && (unsub as any)());
    };
  }, [user, authLoading]);

  // Initial redirection and welcome message logic
  useEffect(() => {
    if (!authLoading && user && rolesLoaded && !initialRedirectDone.current) {
      console.log('[Redirect] Checking initial redirection', { isMaster, isPartner });
      
      // Role-based redirection: Master/Partner -> portfolio, Company User -> dashboard
      if (isMaster || isPartner) {
        setCurrentPage('portfolio');
      } else {
        setCurrentPage('dashboard');
      }

      // First access of the day check
      const today = new Date().toISOString().split('T')[0];
      const lastAccessKey = `last_access_${user.uid}`;
      const lastAccess = localStorage.getItem(lastAccessKey);
      const isFirstAccessOfDay = lastAccess !== today;
      
      if (isFirstAccessOfDay) {
        setWelcomeText(getRandomWelcomeMessage());
        setShowWelcome(true);
        localStorage.setItem(lastAccessKey, today);
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
        setSelectedClient(clients[0].id);
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

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <GovernanceProvider user={user}>
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
        setCurrentPage={setCurrentPage}
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
    </GovernanceProvider>
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
  const { isAccepted, setAccepted, role, loading: governanceLoading } = useGovernance();
  const [showUniversalImport, setShowUniversalImport] = useState(false);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
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
      await governanceService.logAction({
        user_id: user?.uid || '',
        role: role,
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
    <SidebarProvider defaultOpen={!isSidebarCollapsed}>
    <div className="flex h-screen bg-bg-main overflow-hidden text-text-main transition-colors duration-500 w-full">
      <WelcomeMessage 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
        message={welcomeText}
        userName={user?.displayName || ''}
      />

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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
        <header className="h-28 bg-bg-main/60 backdrop-blur-3xl flex items-center justify-between px-8 md:px-12 sticky top-0 z-50 transition-all duration-700 shadow-separator">
          <div className="flex items-center gap-4 md:gap-16">
            <SidebarTrigger className="text-text-muted hover:text-text-main hover:bg-bg-surface transition-colors rounded-lg p-2" />
            
            <div className="hidden md:block">
              <ClientSelector 
                clients={clients} 
                selectedClient={selectedClient} 
                setSelectedClient={handleSelectClient} 
                onManageClients={() => setCurrentPage('clientes')}
              />
            </div>

            <div className="relative group hidden lg:block">
              <input 
                type="text" 
                placeholder="Busca Global de Inteligência..." 
                className="pl-12 pr-6 py-3.5 bg-bg-surface/40 border-b border-border-main focus:border-accent transition-all outline-none w-48 xl:w-80 text-sm font-sans text-text-main placeholder:text-text-dim focus:bg-bg-card" 
              />
              <Search size={18} strokeWidth={1} className="text-text-dim absolute left-0 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
            </div>
          </div>
            
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <button 
                 onClick={() => window.print()}
                 className="p-3 text-text-muted hover:text-text-main hover:bg-bg-surface rounded-full transition-all"
                 title="Imprimir Página"
              >
                 <FileSpreadsheet size={20} strokeWidth={1} />
              </button>
              <button 
                 onClick={() => setShowUniversalImport(true)}
                 className="p-3 text-text-muted hover:text-accent hover:bg-bg-surface rounded-full transition-all hidden sm:flex group relative"
                 title="Importar Documentos"
              >
                 <UploadCloud size={20} strokeWidth={1} />
                 {totalPending > 0 && isMaster && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                 )}
              </button>
            </div>

            <button 
              className="px-12 py-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-floating hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-secondary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Zap size={18} strokeWidth={1} fill="currentColor" className="text-accent relative z-10" />
              <span className="hidden sm:inline relative z-10">Gerar Análise</span>
            </button>
          </div>
        </header>

        <div className="flex-1 min-w-0 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderCurrentPage({
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
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {showUniversalImport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl bg-white flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Importação Universal de Inteligência</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">
                    Central de Governança e Auditabilidade
                  </p>
                </div>
                <button 
                  onClick={() => setShowUniversalImport(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
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

        <LGPDModal 
          isOpen={!governanceLoading && !isAccepted} 
          onAccept={() => setAccepted(true)} 
        />
      </main>
    </div>
    </SidebarProvider>
  );
}
