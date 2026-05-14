/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  PanelLeftClose,
  PanelLeftOpen,
  Menu as MenuIcon,
  ShieldCheck,
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot, limit, writeBatch } from 'firebase/firestore';
import { auth, login, logout, db, handleFirestoreError, OperationType } from './lib/firebase';
import { DATA, modelData } from './data';
import { cn, formatValue, formatCurrency, calculateVPL, calculateTIR, calculatePayback } from './lib/utils';
import { useFinancialData, useAllFinancialData } from './hooks/useFinancialData';
import { useRealIndicatorData } from './hooks/useRealIndicatorData';
import { SYSTEM_KPI_CATEGORIES, MONTH_LABELS, FULL_MONTH_LABELS } from './constants';
import { AccountModal } from './components/modals/AccountModal';
import { ImportPlanoModal } from './components/modals/ImportPlanoModal';
import { MappingWizard } from './components/modals/MappingWizard';
import { PageHeader, Semaphore, StatusBadge, SectionHeader } from './components/Common';

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

const MASTER_ADMINS = [
  'marcelo.illuminecoaching@gmail.com',
  'marcelosouza.illumine@gmail.com'
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(DEFAULT_PAGE);
  const [academyCourseId, setAcademyCourseId] = useState<string>('');
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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
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

    return () => {
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener('theme-changed', applyTheme);
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
        const isMaster = MASTER_ADMINS.some(email => email.toLowerCase().trim() === userEmail);
        
        console.log('[Auth] Master Check:', { userEmail, isMaster });

        let q;
        if (isMaster) {
          console.log('[Auth] Master Admin: Fetching ALL clients');
          q = query(collection(db, 'clients'));
          setUserPermissions(null);
        } else {
          const userAssocQuery = query(collection(db, 'client_users'), where('email', '==', user.email));
          const assocSnap = await getDocs(userAssocQuery);
          
          if (!assocSnap.empty) {
            const clientIds = assocSnap.docs.map(doc => doc.data().clientId);
            const permissions = assocSnap.docs.flatMap(doc => doc.data().permissoes || []);
            setUserPermissions(permissions);
            q = query(collection(db, 'clients'), where('__name__', 'in', clientIds));
          } else {
            setUserPermissions(null);
            q = query(collection(db, 'clients'), where('ownerId', '==', user.uid));
          }
        }

        return onSnapshot(q, (snapshot) => {
          const dbClients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('[Auth] Clients found:', dbClients.length);
          setClients(dbClients);
          if (dbClients.length > 0) {
            if (!selectedClient || !dbClients.some(c => c.id === selectedClient)) {
              setSelectedClient(dbClients[0].id);
            }
          } else {
            setSelectedClient('');
          }
        }, (error) => {
          console.error("[Auth] Snapshot Error:", error);
          setClients([]);
        });
      } catch (error) {
        console.error("[Auth] Fetch Error:", error);
        setClients([]);
      }
    };

    const unsubscribePromise = fetchClients();
    return () => {
      unsubscribePromise.then(unsub => unsub && (unsub as any)());
    };
  }, [user, authLoading]);

  const currentPageLabel = FLAT_NAV_ITEMS.find((item) => item.id === currentPage)?.label || '';

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

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden text-text-main transition-colors duration-500">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? 80 : 360,
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 768 ? -360 : 0)
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "bg-bg-card/90 backdrop-blur-3xl flex flex-col shrink-0 shadow-separator z-[70] fixed md:relative h-full transition-all duration-700 overflow-hidden",
          isSidebarCollapsed ? "items-center" : "items-start"
        )}
      >
        <div className="absolute -right-3 top-10 z-50 hidden md:block">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-secondary hover:border-secondary transition-all shadow-sm"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className={cn("overflow-y-auto flex-1 custom-scrollbar w-full", isSidebarCollapsed ? "p-0" : "p-4 md:p-6")}>
          <div className={cn("flex items-center mb-4", isSidebarCollapsed ? "justify-center pt-6" : "justify-between")}>
            <Logo collapsed={isSidebarCollapsed} />
            {isMobileMenuOpen && (
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 md:hidden"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="mb-8 md:hidden px-4">
              <ClientSelector 
                clients={clients} 
                selectedClient={selectedClient} 
                setSelectedClient={setSelectedClient} 
                onManageClients={() => {
                  setCurrentPage('clientes');
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          )}
          
          <nav className="space-y-3">
            {NAVIGATION_GROUPS.filter(group => {
              if (!userPermissions) return true;
              // Group is allowed if at least one of its sub-items is allowed
              return group.items.some(item => {
                const permissionKey = `${group.group}:${item.label}`;
                return userPermissions.includes(permissionKey);
              });
            }).map((group) => {
              const isOpen = openSubmenus[group.group] !== false; 
              
              // Filter items within the group
              const filteredItems = group.items.filter(item => {
                if (!userPermissions) return true;
                const permissionKey = `${group.group}:${item.label}`;
                return userPermissions.includes(permissionKey);
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.group}>
                  {!isSidebarCollapsed && (
                    <button 
                      onClick={() => toggleSubmenu(group.group)}
                      className="w-full flex items-center gap-3 px-6 py-2 text-[10px] font-medium text-text-dim uppercase tracking-[0.2em] mb-0 font-sans hover:text-text-main transition-colors group text-left justify-start"
                    >
                      <span className="flex-1 truncate text-left">{group.group}</span>
                      {isOpen ? <ChevronUp size={10} strokeWidth={1} /> : <ChevronDown size={10} strokeWidth={1} />}
                    </button>
                  )}
                  
                  <div className={cn("space-y-0", isSidebarCollapsed ? "px-0" : "px-4")}>
                    {(isSidebarCollapsed ? filteredItems : (isOpen ? filteredItems : [])).map((item) => {
                      const hasChildren = item.children && item.children.length > 0;
                      const isChildActive = hasChildren && item.children?.some(child => child.id === currentPage);
                      const isActive = currentPage === item.id || isChildActive;
                      
                      return (
                        <div key={item.id} className="space-y-1">
                          <button
                            onClick={() => {
                              if (isSidebarCollapsed && hasChildren) {
                                setIsSidebarCollapsed(false);
                                toggleSubmenu(group.group);
                              }
                              setCurrentPage(item.id);
                            }}
                            title={isSidebarCollapsed ? item.label : undefined}
                            className={cn(
                              "w-full flex items-center transition-all group relative",
                              isSidebarCollapsed ? "justify-center py-2 px-0" : "justify-start gap-4 px-4 py-1.5",
                              currentPage === item.id 
                                ? "text-text-main font-semibold" 
                                : isActive 
                                  ? "text-text-main"
                                  : "text-text-muted hover:text-text-main"
                            )}
                          >
                            {currentPage === item.id && (
                              <motion.div 
                                layoutId="active-pill"
                                className="absolute left-0 w-1 h-4 bg-primary rounded-full"
                              />
                            )}
                            <div className="w-5 flex items-center justify-center shrink-0">
                              <item.icon size={isSidebarCollapsed ? 20 : 18} strokeWidth={1} className={cn(
                                "transition-colors shrink-0",
                                currentPage === item.id ? "text-primary" : "text-text-dim group-hover:text-text-main"
                              )} />
                            </div>
                            {!isSidebarCollapsed && (
                              <div className="flex-1 min-w-0 flex items-center justify-between gap-2 overflow-hidden text-left">
                                <span className="tracking-wide text-left text-[11.5px] whitespace-nowrap">{item.label}</span>
                                {hasChildren && (
                                  <ChevronDown 
                                    size={10} 
                                    strokeWidth={1}
                                    className={cn(
                                      "transition-transform duration-300 shrink-0",
                                      isActive ? "rotate-180 text-primary" : "text-text-dim"
                                    )} 
                                  />
                                )}
                              </div>
                            )}
                          </button>

                          {hasChildren && isActive && !isSidebarCollapsed && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="pl-9 space-y-0.5"
                            >
                              {item.children?.map((child) => (
                                <button
                                  key={child.id}
                                  onClick={() => setCurrentPage(child.id)}
                                  className={cn(
                                    "w-full flex items-center justify-start text-left gap-2 px-4 py-1 rounded-lg font-bold text-[10px] transition-all group",
                                    currentPage === child.id 
                                      ? "bg-slate-100 dark:bg-slate-800 text-primary dark:text-white" 
                                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white"
                                  )}
                                >
                                  <div className="w-5 flex items-center justify-center shrink-0">
                                    <span className={cn(
                                      "w-1 h-1 rounded-full",
                                      currentPage === child.id ? "bg-secondary scale-125" : "bg-slate-300 group-hover:bg-slate-400"
                                    )} />
                                  </div>
                                  <span className="tracking-tight text-left whitespace-nowrap">{child.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className={cn(
          "mt-auto bg-bg-surface shadow-premium transition-all",
          isSidebarCollapsed ? "px-0 py-6" : "p-8"
        )}>
          {authLoading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="animate-spin text-secondary" size={20} />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-4">
              <div className={cn(
                "flex items-center mb-4 transition-all",
                isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-4"
              )}>
                {user.photoURL ? (
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full border border-secondary shrink-0" title={isSidebarCollapsed ? user.displayName || 'Usuário' : undefined} />
                  </div>
                ) : (
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[8px] shrink-0" title={isSidebarCollapsed ? user.displayName || 'Usuário' : undefined}>
                      {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                  </div>
                )}
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold truncate text-slate-900 text-left">{user.displayName || 'Usuário'}</p>
                    {!userPermissions && (
                      <span className="text-[8px] font-black uppercase text-secondary tracking-widest block">Master Admin</span>
                    )}
                  </div>
                )}
              </div>
              <button 
                onClick={logout}
                title={isSidebarCollapsed ? "Sair" : undefined}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100",
                  isSidebarCollapsed ? "px-0 w-10 h-10 mx-auto" : "w-full"
                )}
              >
                <LogOut size={14} /> {!isSidebarCollapsed && "Sair"}
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              title={isSidebarCollapsed ? "Entrar com Google" : undefined}
              className={cn(
                "flex items-center justify-center gap-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20",
                isSidebarCollapsed ? "w-10 h-10 mx-auto py-0" : "w-full py-3"
              )}
            >
              <LogIn size={isSidebarCollapsed ? 20 : 16} /> {!isSidebarCollapsed && "Entrar"}
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-28 bg-bg-main/60 backdrop-blur-3xl flex items-center justify-between px-12 sticky top-0 z-50 transition-all duration-700 shadow-separator">
          <div className="flex items-center gap-16">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 text-text-muted hover:text-text-main md:hidden transition-colors bg-bg-surface/50 rounded-full"
            >
              <MenuIcon size={24} strokeWidth={1} />
            </button>
            
            <div className="hidden md:block">
              <ClientSelector 
                clients={clients} 
                selectedClient={selectedClient} 
                setSelectedClient={setSelectedClient} 
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
                 className="p-3 text-text-muted hover:text-text-main hover:bg-bg-surface rounded-full transition-all hidden sm:flex"
                 title="Exportar Dados"
              >
                 <UploadCloud size={20} strokeWidth={1} />
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
                  setSelectedClient,
                  selectedMonth,
                  setSelectedMonth,
                  selectedYear,
                  setSelectedYear,
                  user,
                  setCurrentPage,
                  setClients,
                  academyCourseId,
                  setAcademyCourseId,
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
