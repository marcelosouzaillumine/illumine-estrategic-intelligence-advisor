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
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { onAuthStateChanged, User, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot, limit, writeBatch, or } from 'firebase/firestore';
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
            className="text-[51px] tracking-[-0.06em] text-foreground leading-[0.8]" 
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
      <div className="w-16 h-16 rounded-button bg-primary shadow-lg flex items-center justify-center border border-white/10">
        <IllumineMark className="w-11 h-11" />
      </div>
      <div className="flex flex-col select-none">
        <h1 
          className="text-4xl font-normal lowercase leading-none text-primary"
          style={{ fontFamily: "'Tilt Warp', sans-serif" }}
        >
          illumine
        </h1>
        <div 
          className="w-full flex justify-between uppercase font-bold text-secondary text-[8px] leading-none mt-1.5"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {"Business Intelligence".split("").map((char, idx) => (
            <span key={idx}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Email/password form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const authMode = 'login';
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleGlobalError = (e: any) => {
      setLoginError(e.detail);
      setIsSigningIn(false);
      setIsSubmitting(false);
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSigningIn) return;

    setLoginError('');

    if (!email || !password) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithEmail(email.trim(), password);
    } catch (error: any) {
      console.error('Email authentication error:', error);
      let errorMsg = 'Ocorreu um erro ao autenticar. Verifique seus dados.';
      
      switch (error?.code) {
        case 'auth/invalid-email':
          errorMsg = 'Endereço de e-mail inválido.';
          break;
        case 'auth/user-disabled':
          errorMsg = 'Este usuário foi desabilitado.';
          break;
        case 'auth/user-not-found':
          errorMsg = 'E-mail não cadastrado. Verifique se digitou corretamente ou utilize o login com Google.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Senha incorreta.';
          break;
        case 'auth/invalid-credential':
          errorMsg = 'Credenciais inválidas. Verifique seu e-mail e senha.';
          break;
      }
      setLoginError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="relative min-h-screen grid lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16 xl:px-20 overflow-y-auto max-h-screen no-scrollbar gap-8">
          <LoginBrand />

          <div className="max-w-3xl py-8 space-y-8">
            <h2 className="font-display text-h1 font-medium tracking-tight leading-[0.96] text-primary max-w-3xl">
              Inteligência estratégica para empresas que desejam crescer com direção, clareza e propósito
            </h2>
            
            <div className="space-y-6 text-body-md text-muted-foreground leading-relaxed font-sans font-medium">
              <p>
                A Illumine Business Intelligence foi desenvolvida para transformar dados em discernimento strategic, fortalecendo decisões empresariais com profundidade analítica, governança e visão de longo prazo.
              </p>
              <p>
                Mais do que uma plataforma de indicadores, este ambiente integra inteligência financeira, gestão estratégica, acompanhamento de performance e princípios estruturantes de liderança e organização empresarial.
              </p>
              <div className="border-l-2 border-secondary/40 pl-4 py-1 my-6 italic text-foreground/90 bg-secondary/5 rounded-r-md">
                Aqui, números não são apenas registros operacionais. Eles revelam cultura, sustentabilidade, eficiência, riscos, oportunidades e a maturidade da gestão.
              </div>
              <p>
                Em um ambiente privado, seguro e organizado, você poderá acompanhar indicadores, acessar relatórios executivos, visualizar diagnósticos estratégicos e conduzir análises recorrentes com maior clareza, precisão e consistência.
              </p>
              <p>
                A plataforma foi arquitetada para apoiar empresas, consultores e líderes na construção de negócios mais saudáveis, sustentáveis e alinhados com princípios sólidos de governança, responsabilidade e geração de valor.
              </p>
            </div>

            <div className="h-px bg-border my-8" />

            <div className="space-y-6">
              <h3 className="text-body-sm font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
                O que você encontra neste ambiente
              </h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: '📊', text: 'Indicadores financeiros e operacionais integrados' },
                  { icon: '🧠', text: 'Diagnósticos estratégicos e análises executivas' },
                  { icon: '📈', text: 'Monitoramento contínuo de performance empresarial' },
                  { icon: '🏛️', text: 'Estrutura orientada à governança corporativa' },
                  { icon: '🔐', text: 'Ambiente privado e seguro para gestão recorrente' },
                  { icon: '🤝', text: 'Ferramentas de acompanhamento consultivo e advisory' },
                  { icon: '📚', text: 'Biblioteca estratégica de princípios e recomendações práticas' },
                  { icon: '⚙️', text: 'Estrutura pensada para evolução contínua da gestão' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-md bg-surface-container/50 border border-border shadow-sm">
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-body-sm font-medium text-muted-foreground leading-normal">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-border my-8" />

            <div className="rounded-card bg-surface-container border border-border p-6 space-y-3">
              <h3 className="text-body-sm font-semibold uppercase tracking-widest text-primary">
                Nossa visão
              </h3>
              <p className="text-body-md text-muted-foreground leading-relaxed font-sans font-medium">
                Acreditamos que empresas saudáveis são construídas quando tecnologia, inteligência, valores e gestão caminham em unidade.
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed font-sans font-medium">
                Por isso, a Illumine Business Intelligence não foi criada apenas para organizar informações, mas para ajudar líderes a enxergar com maior profundidade, decidir com maior consciência e conduzir organizações com direção estratégica, estabilidade e propósito.
              </p>
            </div>
          </div>

          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest py-4 border-t border-border/40">
            Illumine Business Intelligence © {new Date().getFullYear()}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 pb-10 lg:p-10 xl:p-16">
          <div className="w-full max-w-[480px] rounded-card backdrop-blur-xl bg-card/65 border border-border/80 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-primary/5">
            <div className="bg-gradient-to-b from-primary/10 to-transparent p-8 sm:p-10 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-button bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                  <IllumineMark className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-success">
                  <CheckCircle2 size={11} className="animate-pulse" />
                  Acesso protegido
                </div>
              </div>
              <h3 className="mt-7 text-h2 font-medium tracking-tight text-foreground">
                Entrar no painel
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground font-medium font-sans">
                Continue com seu e-mail e senha ou conta Google para acessar seu ambiente de trabalho Illumine.
              </p>
            </div>

            <div className="p-8 sm:p-10 space-y-6">
              <form onSubmit={handleEmailAuth} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">
                    E-mail
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Mail size={16} strokeWidth={1.5} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.nome@empresa.com.br"
                      className="w-full pl-10 pr-4 py-3 bg-surface-container/30 border border-border rounded-button focus:border-primary focus:bg-background/80 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-body-sm font-sans text-foreground"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">
                    Senha
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock size={16} strokeWidth={1.5} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full pl-10 pr-10 py-3 bg-surface-container/30 border border-border rounded-button focus:border-primary focus:bg-background/80 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-body-sm font-sans text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSigningIn}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] transition-all rounded-button font-bold text-body-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {(isSubmitting || isSigningIn) ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogIn size={16} />
                  )}
                  Entrar
                </button>
              </form>

              {/* Separator */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-x-0 h-px bg-border" />
                <span className="relative px-3 bg-background text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  ou continue com
                </span>
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn || isSubmitting}
                className="w-full h-12 rounded-button border border-border bg-background/50 hover:bg-surface-container disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-body-sm font-medium text-foreground shadow-sm hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.98]"
              >
                {isSigningIn ? (
                  <Loader2 size={18} className="animate-spin text-secondary" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                {isSigningIn ? 'Conectando...' : 'Entrar com Google'}
              </button>

              {loginError && (
                <div className="rounded-button bg-destructive/10 border border-destructive/20 px-4 py-3 text-body-sm font-medium text-destructive leading-5">
                  {loginError}
                </div>
              )}

              <div className="rounded-button bg-surface-container/30 border border-border/60 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-secondary" />
                  Ambiente privado e seguro
                </p>
                <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground/75 font-medium font-sans">
                  Suas informações ficam associadas à sua conta corporativa e são acessíveis somente mediante autenticação devidamente autorizada.
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
            const userAssocQuery = query(
              collection(db, 'client_users'),
              or(
                where('email', '==', userEmail),
                where('email', '==', u.email || '')
              )
            );
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
            console.warn(`Access denied for non-registered user ${userEmail}. Deleting from Firebase Auth.`);
            try {
              await deleteUser(u);
            } catch (err) {
              console.error("Error deleting unauthorized user account:", err);
            }
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
    <div className="flex h-screen bg-background overflow-hidden text-foreground transition-colors duration-500 w-full">
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
        <header className="h-16 bg-background/60 backdrop-blur-3xl flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-50 transition-all duration-700 border-b border-border shadow-sm">
          <div className="flex items-center gap-4 md:gap-8">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors rounded-button p-2" />
            
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
                className="pl-8 pr-4 py-2 bg-surface-container/40 border-b border-border focus:border-secondary transition-all outline-none w-44 xl:w-72 text-xs font-sans text-foreground placeholder:text-neutral focus:bg-background" 
              />
              <Search size={14} strokeWidth={1.25} className="text-neutral absolute left-2 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
            </div>
          </div>
            
          <div className="flex items-center gap-2 sm:gap-6 md:gap-12">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button 
                 onClick={() => window.print()}
                 className="p-3 text-muted-foreground hover:text-foreground hover:bg-surface-container rounded-full transition-all"
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
              className="px-4 sm:px-8 md:px-12 py-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-floating hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 sm:gap-4 group overflow-hidden relative whitespace-nowrap shrink-0"
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
