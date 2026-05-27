import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  LayoutDashboard,
  Network,
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  X,
  Menu as MenuIcon,
  ChevronRight,
  Handshake,
  Database,
  BarChart3,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Briefcase,
  Leaf,
  Activity,
  Scale,
  Layers,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { sendPasswordResetEmail } from '../../lib/firebase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// ─── Brand Helpers ────────────────────────────────────────────────────────────

function IllumineMark({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="30" y1="30" x2="22" y2="22" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="8"  y2="50" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
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

// ─── Login Modal ──────────────────────────────────────────────────────────────

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onEmailLogin: (e: React.FormEvent, email: string, password: string) => Promise<void>;
  isSigningIn: boolean;
  isSubmitting: boolean;
  loginError: string;
}

function LoginModal({
  isOpen,
  onClose,
  onGoogleLogin,
  onEmailLogin,
  isSigningIn,
  isSubmitting,
  loginError,
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      setResetError('Digite seu e-mail acima para recuperar a senha.');
      setResetMessage('');
      return;
    }
    setIsResetting(true);
    setResetError('');
    setResetMessage('');
    try {
      await sendPasswordResetEmail(email.trim());
      setResetMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error?.code === 'auth/user-not-found') {
        setResetError('E-mail não cadastrado.');
      } else if (error?.code === 'auth/invalid-email') {
        setResetError('E-mail inválido.');
      } else {
        setResetError('Erro ao enviar e-mail de recuperação.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    setResetError('');
    setResetMessage('');
    onEmailLogin(e, email, password);
  };

  // Close on backdrop click
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[460px] max-h-full rounded-card bg-card/95 backdrop-blur-2xl border border-border/60 shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
              style={{
                boxShadow: '0 32px 80px rgba(14,28,44,0.22), 0 0 0 1px rgba(255,133,82,0.08)'
              }}
            >
              {/* Top accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

              {/* Header */}
              <div className="relative bg-gradient-to-b from-primary/8 to-transparent p-[clamp(1rem,4vh,2rem)] pb-[clamp(0.75rem,2vh,1rem)] border-b border-border/40 shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 rounded-button flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-container transition-all"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-[clamp(0.5rem,2vh,0.75rem)] mb-[clamp(0.5rem,2vh,1rem)]">
                  <div className="w-[clamp(2rem,6vh,2.5rem)] h-[clamp(2rem,6vh,2.5rem)] rounded-button bg-primary border border-primary/20 flex items-center justify-center">
                    <IllumineMark className="w-[clamp(1.25rem,4vh,1.5rem)] h-[clamp(1.25rem,4vh,1.5rem)]" />
                  </div>
                  <div className="flex items-center gap-[clamp(0.25rem,1vh,0.5rem)] rounded-full bg-success/10 border border-success/20 px-[clamp(0.5rem,1.5vh,0.75rem)] py-[clamp(0.25rem,1vh,0.375rem)] text-[clamp(0.5rem,1.5vh,0.5625rem)] font-bold uppercase tracking-widest text-success">
                    <CheckCircle2 size={10} className="animate-pulse" />
                    Acesso protegido
                  </div>
                </div>

                <h2 className="text-[clamp(1.25rem,4vh,1.5rem)] font-medium tracking-tight text-foreground leading-tight">
                  Entrar no painel
                </h2>
                <p className="mt-[clamp(0.25rem,1vh,0.375rem)] text-[clamp(0.75rem,2vh,0.875rem)] leading-snug text-muted-foreground font-medium font-sans">
                  Continue com seu e-mail e senha ou conta Google para acessar seu ambiente Illumine.
                </p>
              </div>

              {/* Body — scrollável mas autoajustável */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-[clamp(1rem,4vh,2rem)] space-y-[clamp(0.5rem,2.5vh,1rem)]">
                <form onSubmit={handleSubmit} className="space-y-[clamp(0.5rem,2.5vh,1rem)]">
                  {/* Email */}
                  <div className="space-y-[clamp(0.25rem,1vh,0.5rem)]">
                    <Label className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-muted-foreground block px-1">
                      E-mail
                    </Label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} />
                      </span>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.nome@empresa.com.br"
                        className="pl-10 h-[clamp(2.25rem,7vh,3rem)] text-[clamp(0.75rem,2vh,0.875rem)] bg-surface-container/40"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-[clamp(0.25rem,1vh,0.5rem)]">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-muted-foreground block">
                        Senha
                      </Label>
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={isResetting}
                        className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-primary hover:text-primary/80 disabled:opacity-70 transition-colors cursor-pointer"
                      >
                        {isResetting ? 'Enviando...' : 'Esqueceu a senha?'}
                      </button>
                    </div>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Lock className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} />
                      </span>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        className="pl-10 pr-10 h-[clamp(2.25rem,7vh,3rem)] text-[clamp(0.75rem,2vh,0.875rem)] bg-surface-container/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} /> : <Eye className="w-[clamp(0.875rem,2.5vh,0.9375rem)] h-[clamp(0.875rem,2.5vh,0.9375rem)]" strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSigningIn}
                    className="w-full h-[clamp(2.25rem,7vh,3rem)] font-bold text-[clamp(0.75rem,2vh,0.875rem)] text-primary-foreground uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-[clamp(0.875rem,2.5vh,1rem)] h-[clamp(0.875rem,2.5vh,1rem)] animate-spin" /> : <LogIn className="w-[clamp(0.875rem,2.5vh,1rem)] h-[clamp(0.875rem,2.5vh,1rem)]" />}
                    Entrar
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center pt-[clamp(0.25rem,1vh,0.5rem)] pb-[clamp(0.25rem,1vh,0.5rem)]">
                  <div className="absolute inset-x-0 h-px bg-border" />
                  <span className="relative px-3 bg-card text-[clamp(0.5rem,1.5vh,0.625rem)] font-semibold uppercase tracking-widest text-muted-foreground">
                    ou continue com
                  </span>
                </div>

                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onGoogleLogin}
                  disabled={isSigningIn || isSubmitting}
                  className="w-full h-[clamp(2.25rem,7vh,3rem)] flex items-center justify-center gap-3 text-[clamp(0.75rem,2vh,0.875rem)] font-medium"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-[clamp(1rem,3vh,1.125rem)] h-[clamp(1rem,3vh,1.125rem)] animate-spin text-secondary" />
                  ) : (
                    <svg className="w-[clamp(0.875rem,2.5vh,1rem)] h-[clamp(0.875rem,2.5vh,1rem)]" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                  )}
                  {isSigningIn ? 'Conectando...' : 'Entrar com Google'}
                </Button>

                {/* Error */}
                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-button bg-destructive/10 border border-destructive/20 px-[clamp(0.75rem,2.5vh,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,2vh,0.875rem)] font-medium text-destructive leading-5"
                    >
                      {loginError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset Error */}
                <AnimatePresence>
                  {resetError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-button bg-destructive/10 border border-destructive/20 px-[clamp(0.75rem,2.5vh,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,2vh,0.875rem)] font-medium text-destructive leading-5"
                    >
                      {resetError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset Success Message */}
                <AnimatePresence>
                  {resetMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-button bg-success/10 border border-success/20 px-[clamp(0.75rem,2.5vh,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,2vh,0.875rem)] font-medium text-success leading-5"
                    >
                      {resetMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Security note */}
                <div className="hidden sm:block rounded-button bg-surface-container/40 border border-border/60 p-[clamp(0.5rem,2vh,0.75rem)] mt-[clamp(0.5rem,2vh,1rem)]">
                  <p className="text-[clamp(0.5rem,1.5vh,0.625rem)] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-[clamp(0.625rem,2vh,0.6875rem)] h-[clamp(0.625rem,2vh,0.6875rem)] text-secondary shrink-0" />
                    Ambiente privado e seguro
                  </p>
                  <p className="mt-[clamp(0.25rem,1vh,0.375rem)] text-[clamp(0.625rem,1.8vh,0.6875rem)] leading-snug text-muted-foreground/75 font-medium font-sans">
                    Suas informações ficam associadas à sua conta corporativa e são acessíveis somente mediante autenticação autorizada.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Company Content (SalesPage internals) ─────────────────────────────────

function CompanyContent({ onConsultant }: { onConsultant: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-0 text-foreground relative font-sans selection:bg-primary/20 selection:text-primary">

      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md text-primary text-[11px] font-semibold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={13} className="text-secondary animate-pulse" />
            <span>Illumine Governance</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.08]"
            style={{ fontFamily: "'Tilt Warp', sans-serif" }}
          >
            Empresas não quebram apenas por falta de faturamento.<br/>
            <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">Quebram por ausência de leitura estrutural.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-4xl mx-auto space-y-4 leading-relaxed"
          >
            <p className="text-xl text-foreground font-semibold">
              A Illumine é uma arquitetura de inteligência estrutural empresarial desenvolvida para transformar dados, operação, governança e estratégia em clareza decisional para empresas que precisam crescer com sustentabilidade.
            </p>
            <div className="pt-4 space-y-3 text-base text-muted-foreground/80">
              <p>A maioria das empresas possui informações.<br/>Poucas possuem interpretação estrutural.</p>
              <p>Quando indicadores deixam de conversar entre si, o crescimento perde sustentação, o caixa perde previsibilidade, a operação se torna reativa e decisões passam a ser tomadas sem contexto real.</p>
              <p>A Illumine foi concebida para identificar relações invisíveis entre operação, margem, capital de giro, endividamento, governança e sustentabilidade organizacional antes que essas pressões silenciosas se transformem em crise.</p>
              <p className="text-foreground font-medium pt-2">Não entregamos apenas indicadores.<br/>Entregamos inteligência estrutural para decisões críticas.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button
              onClick={onConsultant}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Solicitar Diagnóstico Estrutural</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('tese')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target size={16} />
              <span>Conhecer a Arquitetura Illumine</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. A TESE ILLUMINE */}
      <section id="tese" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              A TESE ILLUMINE
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O problema não é falta de dados.<br/>É falta de clareza estrutural.
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>Empresas raramente entram em colapso por um único fator.</p>
              <p>Na maioria das vezes, a deterioração começa silenciosamente:</p>
              <ul className="list-none space-y-2 text-base text-muted-foreground/80 font-normal py-2">
                {[
                  'crescimento sem sustentação financeira;',
                  'expansão pressionando o caixa;',
                  'dependência bancária crescente;',
                  'margem operacional deteriorando;',
                  'governança insuficiente;',
                  'decisões tomadas sem profundidade analítica;',
                  'excesso de indicadores sem interpretação integrada;',
                  'baixa previsibilidade estrutural.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>O excesso de informação não necessariamente produz inteligência.</p>
              <p>Sem interpretação causal, dados se tornam apenas ruído operacional.</p>
              <p className="text-primary font-bold text-xl pt-2">A Illumine foi desenvolvida para transformar complexidade empresarial em direção executiva clara.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-surface-container to-background border border-primary/10 shadow-2xl overflow-hidden group hover:shadow-primary/5 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -ml-10 -mb-10 group-hover:bg-secondary/10 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col justify-center h-full space-y-6">
                <BrainCircuit size={40} className="text-secondary" />
                <p className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground tracking-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                  A inteligência está na conexão.
                </p>
                <div className="w-12 h-px bg-border group-hover:w-24 transition-all duration-500" />
                <p className="text-lg leading-relaxed font-medium text-muted-foreground">
                  Mais do que organizar dados, a Illumine cria um modelo causal que explica como cada decisão impacta a sustentabilidade do negócio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. O COLAPSO SILENCIOSO */}
      <section className="py-24 px-6 bg-foreground text-background relative">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E96F3D]/20 to-secondary/20 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 sm:p-10 rounded-[32px] bg-background/5 border border-background/10 shadow-2xl overflow-hidden backdrop-blur-sm">
               <ul className="space-y-4">
                {[
                  'aumento silencioso da pressão no capital de giro;',
                  'crescimento consumindo caixa;',
                  'deterioração progressiva da margem;',
                  'aumento de dependência financeira;',
                  'baixa capacidade de absorção operacional;',
                  'perda de previsibilidade;',
                  'expansão sem maturidade de gestão;',
                  'desalinhamento entre operação e estrutura financeira.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-background/5 p-4 rounded-xl border border-background/10 hover:bg-background/10 transition-colors">
                    <TrendingUp size={20} className="text-secondary shrink-0" />
                    <span className="text-background/90 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              O COLAPSO SILENCIOSO DAS EMPRESAS
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Os maiores riscos empresariais normalmente não são visíveis no início.
            </h3>
            <div className="space-y-4 text-lg text-background/70 leading-relaxed font-medium">
              <p>Empresas frequentemente aparentam crescimento enquanto perdem sustentabilidade estrutural.</p>
              <p>Os sinais normalmente surgem antes da crise.</p>
              <p className="pt-4">Quando esses fatores deixam de ser interpretados, a empresa passa a operar de forma reativa.</p>
              <p className="text-background font-bold text-xl pt-2">A Illumine existe para antecipar essas relações antes que se tornem irreversíveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O QUE É A ILLUMINE */}
      <section id="o-que-e" className="py-24 px-6 bg-surface-container relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Compass size={16} className="text-secondary" />
              <span>O QUE É A ILLUMINE</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Mais do que software. Mais do que consultoria.<br/>Uma arquitetura de inteligência estrutural empresarial.
            </h3>
            <div className="text-lg text-muted-foreground leading-relaxed font-medium space-y-2">
              <p>A Illumine integra:</p>
              <ul className="flex flex-wrap justify-center gap-2 pt-2 pb-2">
                {[
                  'inteligência financeira', 'causalidade empresarial', 'governança', 'advisory estratégico',
                  'interpretação patrimonial', 'análise estrutural', 'maturidade organizacional', 'stress analysis',
                  'inteligência operacional', 'leitura integrada dos pilares empresariais'
                ].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-background rounded-full text-xs font-bold text-foreground border border-border shadow-sm">{item}</span>
                ))}
              </ul>
              <p className="pt-4">Tudo conectado em uma arquitetura desenvolvida para apoiar empresas em crescimento, profissionalização e sustentabilidade.</p>
              <p>A plataforma é apenas a camada operacional dessa inteligência.</p>
              <p className="text-foreground font-bold text-xl pt-2">O verdadeiro núcleo da Illumine é a interpretação estrutural da realidade empresarial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMO A ILLUMINE PENSA */}
      <section className="py-24 px-6 bg-transparent relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              COMO A ILLUMINE PENSA
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Não analisamos apenas números. Interpretamos relações estruturais.
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>A Illumine opera sobre uma lógica de causalidade empresarial.</p>
              <p>Isso significa compreender que:</p>
              <ul className="list-none space-y-2 text-base text-muted-foreground/80 font-normal py-2">
                {[
                  'crescimento impacta caixa;',
                  'margem impacta sustentabilidade;',
                  'governança impacta previsibilidade;',
                  'estrutura de capital impacta expansão;',
                  'eficiência operacional impacta capacidade de sustentação;',
                  'maturidade decisional impacta continuidade empresarial.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>Nosso objetivo não é apenas mostrar indicadores.</p>
              <p className="text-primary font-bold text-xl pt-2">É produzir clareza para decisões críticas.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 text-center pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cada análise considera simultaneamente:</span>
            </div>
            {[
              { icon: LineChart, title: 'liquidez' },
              { icon: Database, title: 'capital de giro' },
              { icon: Building2, title: 'estrutura patrimonial' },
              { icon: Target, title: 'eficiência operacional' },
              { icon: Activity, title: 'pressão financeira' },
              { icon: Scale, title: 'endividamento' },
              { icon: LayoutDashboard, title: 'capacidade operacional' },
              { icon: ShieldCheck, title: 'governança' },
              { icon: Leaf, title: 'sustentabilidade estrutural' },
              { icon: Users, title: 'maturidade organizacional' }
            ].map((item, idx) => (
              <div key={idx} className="bg-surface-container/50 border border-border/60 p-4 rounded-xl flex items-center gap-3 hover:border-secondary/40 transition-colors">
                <item.icon size={18} className="text-secondary shrink-0" />
                <span className="text-sm font-semibold text-foreground">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTELLIGENCE LAYERS */}
      <section className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Layers size={16} className="text-secondary" />
              <span>INTELLIGENCE LAYERS</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Uma arquitetura integrada de inteligência empresarial.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Financial Intelligence Engine', desc: 'Transforma demonstrações financeiras em leitura estrutural, diagnósticos executivos e interpretação causal da sustentabilidade empresarial.' },
              { icon: ShieldCheck, title: 'Governance Intelligence', desc: 'Estrutura previsibilidade decisional, maturidade operacional e governança corporativa.' },
              { icon: Network, title: 'Causal Engine', desc: 'Identifica relações invisíveis entre crescimento, caixa, margem, endividamento, eficiência operacional e sustentabilidade organizacional.' },
              { icon: Users, title: 'Advisory Intelligence', desc: 'Converte indicadores em direção executiva para decisões estratégicas de alto impacto.' },
              { icon: Activity, title: 'Stress & Risk Analysis', desc: 'Simula pressão estrutural, riscos financeiros, sensibilidade operacional e capacidade de sustentação da empresa.' },
              { icon: Target, title: 'Executive Scoring', desc: 'Avalia maturidade organizacional, saúde estrutural e capacidade de crescimento sustentável.' },
              { icon: BrainCircuit, title: 'Structural Intelligence Model', desc: 'Integra operação, estrutura financeira, governança e sustentabilidade em uma leitura empresarial unificada.' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-card bg-card border border-border/80 shadow-xs hover:shadow-lg hover:border-secondary/35 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-button bg-surface-container flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors duration-300">
                  <item.icon size={22} className="text-secondary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. A PLATAFORMA */}
      <section className="py-24 px-6 bg-transparent relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="relative p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-surface-container to-background border border-primary/10 shadow-2xl overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -ml-10 -mb-10" />
               
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">A plataforma Illumine centraliza:</p>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'indicadores executivos',
                  'diagnósticos estruturais',
                  'relatórios estratégicos',
                  'governance layers',
                  'scoring empresarial',
                  'análises causais',
                  'monitoramento estrutural',
                  'stress tests',
                  'inteligência financeira',
                  'leitura integrada dos pilares empresariais'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span className="text-sm font-semibold text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              A PLATAFORMA
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              A infraestrutura operacional da inteligência Illumine.
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>A tecnologia existe para organizar, visualizar e sustentar a interpretação estratégica da empresa.</p>
              <p>Mas tecnologia, sozinha, não produz clareza.</p>
              <p className="text-primary font-bold text-xl pt-2">É a interpretação integrada que transforma dados em direção.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GOVERNANÇA E MATURIDADE EMPRESARIAL */}
      <section className="py-24 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              GOVERNANÇA E MATURIDADE EMPRESARIAL
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Empresas sustentáveis dependem de maturidade decisional.
            </h3>
            <div className="space-y-4 text-lg text-background/70 leading-relaxed font-medium">
              <p>Crescimento sem governança normalmente produz:</p>
              <ul className="list-disc pl-6 space-y-1 text-base text-background/60 font-normal pb-2">
                <li>perda de previsibilidade;</li>
                <li>aumento de risco estrutural;</li>
                <li>baixa capacidade de controle;</li>
                <li>decisões reativas;</li>
                <li>desalinhamento operacional;</li>
                <li>deterioração silenciosa da sustentabilidade empresarial.</li>
              </ul>
              <p className="text-background font-bold text-xl pt-2">Empresas maduras não operam apenas com informação.<br/>Operam com inteligência integrada.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 sm:p-10 rounded-[32px] bg-background/5 border border-background/10 shadow-2xl overflow-hidden backdrop-blur-sm">
               <p className="text-sm font-bold uppercase tracking-widest text-background mb-6">A Illumine ajuda empresas a desenvolver:</p>
               <ul className="space-y-4">
                {[
                  'disciplina decisional;',
                  'clareza executiva;',
                  'governança integrada;',
                  'leitura estratégica;',
                  'previsibilidade estrutural;',
                  'maturidade organizacional.'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-background/5 p-4 rounded-xl border border-background/10 hover:bg-background/10 transition-colors">
                    <ShieldCheck size={20} className="text-secondary shrink-0" />
                    <span className="text-background/90 font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PARA QUEM A ILLUMINE EXISTE */}
      <section className="py-24 px-6 bg-surface-container/50 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Target size={16} className="text-secondary" />
              <span>PARA QUEM A ILLUMINE EXISTE</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Para empresas que precisam crescer com estrutura.
            </h3>
          </div>

          <div className="max-w-4xl mx-auto bg-card border border-border/80 rounded-[32px] p-8 md:p-12 shadow-xl shadow-primary/5">
            <p className="text-lg font-bold text-foreground mb-6">A Illumine foi desenvolvida para:</p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                'empresas em expansão;',
                'organizações em profissionalização;',
                'negócios familiares;',
                'operações pressionadas por crescimento;',
                'empresas com baixa previsibilidade financeira;',
                'organizações que desejam implantar governança;',
                'lideranças que precisam de clareza estrutural;',
                'empresas que operam com múltiplos indicadores desconectados;',
                'organizações que precisam transformar dados em direção executiva.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container/50 transition-colors">
                  <CheckCircle2 size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground font-medium text-sm md:text-base leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 10. POSICIONAMENTO FILOSÓFICO */}
      <section className="py-24 px-6 bg-transparent relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">POSICIONAMENTO FILOSÓFICO</h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            Tecnologia sem interpretação gera dependência.<br/>
            <span className="text-primary">Inteligência gera direção.</span>
          </h3>
          <div className="text-lg md:text-xl text-muted-foreground space-y-4 font-medium leading-relaxed">
            <p>Acreditamos que sustentabilidade empresarial não é construída apenas com crescimento.</p>
            <p>É construída com:</p>
            <div className="flex flex-wrap justify-center gap-3 py-4">
              {['clareza', 'governança', 'causalidade', 'previsibilidade', 'maturidade operacional', 'responsabilidade decisional', 'inteligência estrutural'].map((item, i) => (
                <span key={i} className="px-4 py-2 bg-surface-container rounded-full text-sm font-bold text-foreground border border-border shadow-sm">{item}</span>
              ))}
            </div>
            <p className="pt-4">A tecnologia da Illumine foi concebida como infraestrutura para apoiar essa leitura organizacional.</p>
            <p className="font-bold text-foreground">
              Porque empresas saudáveis não dependem apenas de informação.<br/>Dependem da capacidade de interpretar a própria estrutura antes que os riscos se tornem visíveis demais.
            </p>
          </div>
        </div>
      </section>

      {/* 11. CTA FINAL */}
      <section className="py-24 px-6 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-30 -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            O futuro da empresa depende da qualidade das decisões tomadas hoje.
          </h3>
          <p className="text-xl text-primary-foreground/90 font-medium max-w-2xl mx-auto">
            A Illumine existe para ajudar empresas a operar com mais clareza estrutural, governança, previsibilidade e inteligência decisional.
          </p>
          <div className="pt-8">
            <button
              onClick={onConsultant}
              className="w-full sm:w-auto h-16 px-10 rounded-button bg-background text-foreground font-bold text-base uppercase tracking-widest hover:bg-surface-container hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer mx-auto group"
            >
              <span>Solicitar Análise Executiva Estrutural</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-secondary" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

function PartnerContent({ onConsultant }: { onConsultant: () => void }) {

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'A parceria funciona apenas como acesso à plataforma?',
      a: 'Não. A Illumine atua como uma estrutura executiva de inteligência empresarial, curadoria e acompanhamento consultivo para ampliação da capacidade estratégica dos parceiros.'
    },
    {
      q: 'Os parceiros podem utilizar a estrutura Illumine em seus próprios clientes?',
      a: 'Sim. A estrutura foi desenvolvida exatamente para apoiar escritórios, consultorias e operações recorrentes de acompanhamento empresarial.'
    },
    {
      q: 'A Illumine executa projetos em conjunto com os parceiros?',
      a: 'Sim. Dependendo da necessidade, os projetos podem ser conduzidos pelo parceiro, em conjunto com a Illumine ou com suporte executivo especializado da equipe Illumine.'
    },
    {
      q: 'Para quais perfis de parceiros a estrutura é recomendada?',
      a: 'Consultorias empresariais, escritórios de contabilidade, assessorias financeiras, operações de BPO, advisors independentes, holdings e estruturas consultivas.'
    },
    {
      q: 'Como funciona a segurança das informações?',
      a: 'Toda a estrutura opera em ambiente privado com controle de acesso, confidencialidade operacional e acompanhamento seguro das informações estratégicas.'
    },
    {
      q: 'Existe limite de crescimento dentro da estrutura?',
      a: 'A estrutura foi desenvolvida para permitir escalabilidade, acompanhamento recorrente e expansão consultiva conforme o crescimento da operação parceira.'
    }
  ];

  
  return (
    <div className="space-y-0 text-foreground relative font-sans selection:bg-primary/20 selection:text-primary bg-transparent">
<section id="hero" className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md text-primary text-[11px] font-semibold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={13} className="text-secondary animate-pulse" />
            <span>Illumine Governance</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.08]"
            style={{ fontFamily: "'Tilt Warp', sans-serif" }}
          >
            Estrutura executiva de inteligência empresarial para parceiros que desejam ampliar <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">valor, recorrência e capacidade consultiva</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-4xl mx-auto space-y-4 leading-relaxed"
          >
            <p>
              A Illumine oferece uma estrutura integrada de Governance para escritórios, consultorias, assessorias financeiras, operações de BPO, advisors independentes e parceiros que desejam evoluir além da execução operacional.
            </p>
            <p className="text-base text-muted-foreground/80">
              Mais do que uma plataforma, entregamos um ecossistema contínuo de direção empresarial, governança aplicada e acompanhamento executivo para ampliação da capacidade consultiva e geração recorrente de valor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button
              onClick={() => scrollToSection('porque')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Conhecer a Estrutura de Parceria</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onConsultant}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase size={16} />
              <span>Aplicar para Parceria Estratégica</span>
            </button>
          </motion.div>
        </div>
      </section>
<section id="porque" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Evolução Consultiva
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O mercado exige mais do que execução operacional.
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>Empresas buscam:</p>
              <ul className="list-disc pl-6 space-y-1 text-base text-muted-foreground/80 font-normal">
                <li>clareza gerencial;</li>
                <li>direção estratégica;</li>
                <li>inteligência financeira;</li>
                <li>governança;</li>
                <li>acompanhamento recorrente;</li>
                <li>apoio à tomada de decisão.</li>
              </ul>
              <p className="pt-2">Ao mesmo tempo, muitos escritórios e consultorias possuem excelente capacidade técnica, mas enfrentam desafios para:</p>
              <ul className="list-disc pl-6 space-y-1 text-base text-muted-foreground/80 font-normal">
                <li>ampliar valor percebido;</li>
                <li>estruturar recorrência consultiva;</li>
                <li>escalar acompanhamento executivo;</li>
                <li>integrar indicadores;</li>
                <li>transformar informações em direção empresarial.</li>
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-surface-container to-background border border-primary/10 shadow-2xl overflow-hidden group hover:shadow-primary/5 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -ml-10 -mb-10 group-hover:bg-secondary/10 transition-colors duration-500" />
              
              <div className="relative z-10 flex flex-col justify-center h-full space-y-6">
                <p className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground tracking-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                  A tecnologia organiza a informação.
                </p>
                <div className="w-12 h-px bg-border group-hover:w-24 transition-all duration-500" />
                <p className="text-2xl sm:text-3xl leading-tight font-medium text-primary tracking-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                  A inteligência estratégica transforma informações em <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#E96F3D]">direção, clareza e decisões consistentes.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
<section id="ecossistema" className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Network size={16} className="text-secondary" />
              <span>O Ecossistema Illumine</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Uma estrutura integrada de governança, acompanhamento executivo e direção empresarial para parceiros estratégicos
            </h3>
            <div className="text-lg text-muted-foreground leading-relaxed font-medium space-y-2">
              <p>A Illumine foi desenvolvida para apoiar parceiros que desejam estruturar uma atuação mais estratégica, recorrente e orientada por visão executiva.</p>
              <p>Nosso ecossistema combina:</p>
              <ul className="flex flex-wrap justify-center gap-2 pt-2 pb-2">
                {['governança corporativa', 'advisory executivo', 'inteligência financeira', 'acompanhamento recorrente', 'indicadores gerenciais', 'curadoria especializada', 'visão integrada da operação', 'suporte consultivo contínuo'].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-foreground border border-border">{item}</span>
                ))}
              </ul>
              <p>Tudo isso em um ambiente privado, seguro e continuamente acompanhado por especialistas.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutDashboard, title: 'Estrutura Executiva de Indicadores', desc: 'Indicadores financeiros, operacionais e gerenciais organizados em uma central executiva para acompanhamento empresarial.' },
              { icon: BarChart3, title: 'Diagnósticos Executivos', desc: 'Análises aprofundadas que revelam riscos, gargalos, oportunidades e maturidade organizacional dos clientes.' },
              { icon: Users, title: 'Advisory Executivo Contínuo', desc: 'Estrutura recorrente de acompanhamento consultivo, interpretação gerencial e direcionamento empresarial.' },
              { icon: BrainCircuit, title: 'Curadoria Especializada', desc: 'Os dados passam por validação, organização e acompanhamento contínuo antes da integração executiva.' },
              { icon: Building2, title: 'Governança Corporativa', desc: 'Estrutura voltada à profissionalização da gestão, fortalecimento organizacional e sustentabilidade empresarial.' },
              { icon: Database, title: 'Gestão Orientada por Dados', desc: 'Integração entre métricas, monitoramento gerencial e acompanhamento aplicado à realidade operacional.' },
              { icon: ShieldCheck, title: 'Governança e Segurança', desc: 'Ambiente privado com controle de acesso, confidencialidade operacional e estrutura segura para acompanhamento recorrente.' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-card bg-white border border-border/80 shadow-xs hover:shadow-lg hover:border-secondary/35 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-button bg-surface-container flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors duration-300">
                  <item.icon size={22} className="text-secondary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como a Illumine Atua */}
      <section className="py-24 px-6 bg-surface-container/50 border-t border-border/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Como a Illumine Atua</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Uma estrutura contínua de acompanhamento executivo e ampliação consultiva
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              A parceria Illumine foi estruturada para apoiar escritórios e consultorias em diferentes níveis de maturidade e complexidade operacional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-card bg-card border border-border hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-primary mb-3">Estruturação Consultiva</h4>
              <p className="text-muted-foreground text-sm font-medium">Organização da operação parceira dentro da estrutura integrada Illumine.</p>
            </div>
            <div className="p-8 rounded-card bg-card border border-border hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-primary mb-3">Acompanhamento Executivo</h4>
              <p className="text-muted-foreground text-sm font-medium">Estrutura recorrente de governança aplicada, direção empresarial e suporte consultivo especializado.</p>
            </div>
            <div className="p-8 rounded-card bg-card border border-border hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-primary mb-3">Curadoria Gerencial</h4>
              <p className="text-muted-foreground text-sm font-medium">Os indicadores e informações passam por acompanhamento contínuo para gerar maior clareza executiva e consistência analítica.</p>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-[32px] grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h4 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Projetos Especializados</h4>
              <div className="space-y-4 text-primary-foreground/80 font-medium">
                <p>Além do acompanhamento recorrente, a Illumine também desenvolve projetos de reorganização empresarial, governança e estruturação executiva.</p>
                <p>As iniciativas são desenvolvidas conforme a necessidade, momento e complexidade de cada operação.</p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-xl md:text-2xl font-bold pt-4" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Expansão Estratégica de Serviços</h4>
                <div className="space-y-4 text-primary-foreground/80 font-medium mt-4">
                  <p>A estrutura Illumine também permite que parceiros ampliem sua atuação através de projetos especializados, fortalecendo posicionamento consultivo, geração de valor e recorrência.</p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <h5 className="font-bold uppercase tracking-widest text-secondary text-xs">Os projetos podem ser conduzidos:</h5>
                <ul className="space-y-2 text-sm text-primary-foreground/90">
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary" /> pelo parceiro;</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary" /> em conjunto com a Illumine;</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary" /> ou com suporte especializado da equipe Illumine.</li>
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h5 className="font-bold uppercase tracking-widest text-secondary text-xs mb-4">Iniciativas de Expansão Estratégica</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs md:text-sm text-primary-foreground/90 font-medium">
                  {['reorganização financeira', 'planejamento estratégico', 'governança corporativa', 'estruturação gerencial', 'inteligência financeira', 'modelagem de indicadores', 'cultura organizacional', 'advisory executivo', 'estruturação operacional', 'profissionalização da gestão'].map((frente, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                      <span>{frente}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary-dark/30 p-6 rounded-card border border-white/10">
                <h4 className="text-lg font-bold text-white mb-2">Governance & Advisory</h4>
                <p className="text-sm text-primary-foreground/80 font-medium leading-relaxed">
                  Apoio executivo para parceiros que desejam ampliar profundidade consultiva, retenção e capacidade estratégica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
<section id="modalidades" className="py-24 px-6 bg-surface-container/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Estruturas de Governance</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Estruturas desenvolvidas para parceiros em diferentes níveis de operação, maturidade e complexidade consultiva.
            </h3>
            <div className="text-lg text-muted-foreground leading-relaxed font-medium">
              <p>Todos os modelos incluem:</p>
              <ul className="flex flex-wrap justify-center gap-2 pt-2">
                {['acesso completo à estrutura estratégica Illumine', 'visão gerencial integrada', 'curadoria contínua', 'acompanhamento recorrente', 'advisory executivo especializado', 'monitoramento orientado por dados'].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-foreground border border-border">{item}</span>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* STRATEGIC PARTNER */}
            <div className="p-8 rounded-[32px] bg-white border border-border/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-primary uppercase tracking-wider" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>STRATEGIC PARTNER</h4>
                  <p className="text-foreground font-medium">Consultores e Estruturas em Consolidação</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Perfil recomendado</h5>
                  <ul className="text-sm text-muted-foreground font-medium space-y-1">
                    <li>• até 5 clientes ativos.</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Investimento</h5>
                  <p className="text-xl font-bold text-foreground">Sob consulta</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-secondary">Inclui</h5>
                  <ul className="space-y-3 text-sm text-foreground/80 font-medium">
                    {['central estratégica Illumine', 'indicadores executivos integrados', 'estrutura inicial de advisory', 'curadoria especializada', 'suporte consultivo recorrente', 'acompanhamento executivo contínuo'].map((item, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onConsultant}
                  className="w-full h-12 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors mt-8"
                >
                  Aplicar para Parceria Estratégica
                </button>
              </div>
            </div>

            {/* ADVISORY PARTNER */}
            <div className="p-8 rounded-[32px] bg-primary text-primary-foreground shadow-2xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden scale-105 z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/30 transition-colors" />
              <div className="absolute top-4 right-4 bg-secondary text-primary font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">Recomendado</div>
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>ADVISORY PARTNER</h4>
                  <p className="text-primary-foreground/90 font-medium">Escritórios e Operações em Expansão</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Perfil recomendado</h5>
                  <ul className="text-sm text-primary-foreground/90 font-medium space-y-1">
                    <li>• entre 6 e 20 clientes ativos.</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Investimento</h5>
                  <p className="text-xl font-bold text-white">Sob consulta</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-primary-foreground/20">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-secondary">Inclui</h5>
                  <ul className="space-y-3 text-sm text-primary-foreground/90 font-medium">
                    {['visão gerencial personalizada', 'curadoria executiva contínuo', 'suporte consultivo recorrente', 'acompanhamento estratégico', 'central executiva Illumine'].map((item, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onConsultant}
                  className="w-full h-12 rounded-button bg-secondary text-primary font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors mt-8 shadow-xl shadow-secondary/20"
                >
                  Solicitar Estrutura de Parceria
                </button>
              </div>
            </div>

            {/* EXECUTIVE ADVISORY PARTNER */}
            <div className="p-8 rounded-[32px] bg-white border border-border/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-primary uppercase tracking-wider" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>EXECUTIVE ADVISORY PARTNER</h4>
                  <p className="text-foreground font-medium">Holdings, Estruturas Consultivas e Operações de Alta Complexidade</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Perfil recomendado</h5>
                  <ul className="text-sm text-muted-foreground font-medium space-y-1">
                    <li>• acima de 20 clientes ativos.</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Investimento</h5>
                  <p className="text-xl font-bold text-foreground">Sob consulta</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-secondary">Inclui</h5>
                  <ul className="space-y-3 text-sm text-foreground/80 font-medium">
                    {['ambiente executivo avançado', 'curadoria estratégica contínua', 'indicadores executivos avançados', 'suporte dedicado', 'acompanhamento multidisciplinar', 'estrutura integrada de governança'].map((item, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onConsultant}
                  className="w-full h-12 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors mt-8"
                >
                  Agendar Reunião Estratégica
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
<section id="framework" className="py-24 px-6 bg-foreground text-background relative">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">Framework Proprietário</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              7 Pilares de Inteligência Empresarial
            </h3>
            <p className="text-lg text-background/80 leading-relaxed font-medium">
              Toda a estrutura de acompanhamento da Illumine é organizada através de um framework proprietário desenvolvido para gerar visão integrada, fortalecer a gestão e ampliar capacidade executiva.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: 'Governança Corporativa', desc: 'Estruturas de liderança, responsabilidade institucional e direção estratégica.' },
              { icon: Users, title: 'Cultura Organizacional', desc: 'Valores, alinhamento interno e fortalecimento da identidade empresarial.' },
              { icon: LineChart, title: 'Gestão Financeira', desc: 'Gestão financeira aplicada à sustentabilidade e crescimento estruturado.' },
              { icon: BrainCircuit, title: 'Gestão de Inovação', desc: 'Capacidade de adaptação, melhoria contínua e desenvolvimento estratégico.' },
              { icon: Eye, title: 'Gestão de Marketing', desc: 'Posicionamento, percepção de valor e fortalecimento da autoridade.' },
              { icon: Handshake, title: 'Gestão Comercial', desc: 'Estrutura comercial orientada à performance e previsibilidade.' },
              { icon: LayoutDashboard, title: 'Gestão Operacional', desc: 'Eficiência operacional, integração de processos e fortalecimento da execução.' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-card bg-background/5 border border-white/10 hover:bg-background/10 hover:border-secondary/30 transition-colors group"
              >
                <item.icon size={28} className="text-secondary mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-background/70 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mt-16 pt-16 border-t border-white/10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <div className="w-8 h-px bg-secondary" />
                  As 5 Inteligências
                </h4>
                <h3 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                  Nossa Visão: Inteligência em Unidade
                </h3>
                <p className="text-background/80 font-medium leading-relaxed">
                  Acreditamos que estruturas empresariais saudáveis são construídas quando governança, tecnologia, análise de dados, identidade organizacional e desenvolvimento humano operam em unidade.
                </p>
                <p className="text-background/80 font-medium leading-relaxed">
                  Operações sustentáveis nascem da integração entre:
                </p>
                <ul className="flex flex-wrap gap-2 pt-2 pb-2">
                {['estratégia', 'cultura', 'propósito', 'execução', 'clareza de direção'].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white border border-white/20">{item}</span>
                ))}
              </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Governança', desc: 'Estruturas de liderança, responsabilidade institucional e direção estratégica.' },
                  { title: 'Econômica', desc: 'Gestão financeira e análise econômica aplicadas à sustentabilidade do negócio.' },
                  { title: 'Identidade', desc: 'Cultura, valores e princípios que sustentam a essência organizacional.' },
                  { title: 'Sistêmica', desc: 'Integração entre dados, processos, tecnologia e operação.' },
                  { title: 'Antropológica', desc: 'Compreensão da natureza humana como fundamento da liderança, das relações e da cultura empresarial.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-card bg-background/5 border border-white/5 hover:border-secondary/20 transition-colors">
                    <h5 className="font-bold text-white text-sm mb-1">{item.title}</h5>
                    <p className="text-xs text-background/60 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 lg:border-l lg:border-white/10 lg:pl-12">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <div className="w-8 h-px bg-secondary" />
                  Experiência em Operações Empresariais
                </h4>
                <p className="text-background/80 font-medium leading-relaxed">
                  A estrutura Illumine foi desenvolvida a partir de experiências práticas em:
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-background/90 font-medium">
                  {['saúde', 'indústria', 'varejo', 'serviços', 'operações familiares', 'reorganização financeira', 'governança corporativa', 'estruturas consultivas'].map((frente, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                      <span>{frente}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <h4 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <div className="w-8 h-px bg-secondary" />
                  Para quem a estrutura Illumine foi desenvolvida
                </h4>
                <p className="text-background/80 font-medium leading-relaxed">
                  A Illumine foi estruturada para apoiar:
                </p>
                <ul className="space-y-4 text-background/90 font-medium text-sm sm:text-base">
                  {[
                    'consultorias empresariais;',
                    'escritórios contábeis;',
                    'operações de BPO financeiro;',
                    'assessorias financeiras;',
                    'advisors independentes;',
                    'estruturas consultivas;',
                    'holdings;',
                    'parceiros que desejam ampliar capacidade estratégica e recorrência consultiva.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <CheckCircle2 size={18} className="text-secondary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
<section id="faq" className="py-24 px-6 bg-surface-container border-y border-border/40">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <HelpCircle size={16} className="text-secondary" />
              <span>Alinhamento Estratégico</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={cn(
                  "border border-border/80 rounded-card overflow-hidden transition-all duration-300",
                  openFaq === index ? "bg-white shadow-md border-primary/20" : "bg-card hover:bg-white/60 hover:border-border"
                )}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={cn(
                    "font-bold pr-4 transition-colors",
                    openFaq === index ? "text-primary" : "text-foreground"
                  )}>
                    {faq.q}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                    openFaq === index ? "bg-primary/10 text-primary" : "bg-surface-container text-muted-foreground"
                  )}>
                    {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-6 pt-0 text-muted-foreground font-medium leading-relaxed border-t border-border/40 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
<section id="conclusao" className="py-32 px-6 bg-gradient-to-br from-primary to-primary-dark text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/10" />
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-secondary" />
              Crescimento consultivo exige mais do que operação
            </h2>
            <h3 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O futuro das estruturas consultivas está na capacidade de:
            </h3>
            <div className="text-lg md:text-xl text-primary-foreground/90 font-medium leading-relaxed max-w-3xl mx-auto space-y-6">
              <ul className="flex flex-wrap justify-center gap-3">
                {['interpretar cenários', 'estruturar governança', 'acompanhar empresas estrategicamente', 'transformar informações em direção', 'gerar valor recorrente'].map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20 backdrop-blur-md">
                    {item}
                  </span>
                ))}
              </ul>
              <p className="pt-4">A Illumine existe para apoiar parceiros que desejam construir operações mais estratégicas, organizadas e sustentáveis.</p>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-md inline-block text-left w-full max-w-4xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Illumine Governance</h4>
                </div>
                <p className="text-primary-foreground/80 font-medium leading-relaxed">
                  Inteligência estratégica, governança e performance para parceiros que desejam ampliar valor, recorrência e capacidade consultiva.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => scrollToSection('porque')}
                    className="h-14 px-8 rounded-button bg-secondary text-primary font-bold text-sm uppercase tracking-widest hover:bg-white hover:shadow-xl hover:shadow-secondary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span>Conhecer a Estrutura de Parceria</span>
                  </button>
                  <button 
                    onClick={onConsultant}
                    className="h-14 px-8 rounded-button bg-white/10 border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-md"
                  >
                    <MessageSquare size={16} />
                    <span>Aplicar para Parceria Estratégica</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Main LandingAuthPage ──────────────────────────────────────────────────

export type TabType = 'empresa' | 'parceiro';

interface LandingAuthPageProps {
  onGoogleLogin: () => Promise<void>;
  onEmailLogin: (email: string, password: string) => Promise<void>;
  isSigningIn: boolean;
  isSubmitting: boolean;
  loginError: string;
}

export function LandingAuthPage({
  onGoogleLogin,
  onEmailLogin,
  isSigningIn,
  isSubmitting,
  loginError,
}: LandingAuthPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('empresa');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleConsultant = () => {
    window.open(
      'https://wa.me/554131514537?text=Gostaria%20de%20falar%20com%20um%20consultor%20Illumine',
      '_blank'
    );
  };

  const handleEmailAuth = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();
    await onEmailLogin(email, password);
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const navLinks = activeTab === 'empresa'
    ? [
        { label: 'Por que Illumine', id: 'porque' },
        { label: 'Ecossistema', id: 'ecossistema' },
        { label: 'Framework', id: 'framework' },
        { label: 'Modalidades', id: 'modalidades' },
      ]
    : [
        { label: 'Objetivo', id: 'objetivo' },
        { label: 'Ecossistema', id: 'ecossistema-parceiro' },
        { label: 'Framework', id: 'framework-parceiro' },
        { label: 'Modalidades', id: 'modalidades' },
      ];

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Background orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-secondary/3 blur-[100px] pointer-events-none opacity-40" />

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/40 backdrop-blur-xl bg-background/85 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between gap-6">

          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 shrink-0 select-none cursor-pointer"
          >
            <IllumineMark className="w-9 h-9" />
            <span
              className="text-xl font-normal lowercase leading-none text-primary hidden sm:block"
              style={{ fontFamily: "'Tilt Warp', sans-serif" }}
            >
              illumine
            </span>
          </button>

          {/* Tab toggle — center */}
          <div className="hidden md:flex items-center">
            <div className="relative flex items-center bg-surface-container border border-border rounded-button p-1 gap-0.5">
              {/* Sliding background */}
              <motion.div
                className="absolute top-1 bottom-1 bg-primary rounded-[10px] shadow-sm"
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  left: activeTab === 'empresa' ? 4 : '50%',
                  width: 'calc(50% - 4px)',
                }}
              />
              <button
                id="tab-empresa"
                onClick={() => setActiveTab('empresa')}
                className={cn(
                  'relative z-10 flex items-center gap-2 px-5 py-2 rounded-[10px] text-xs font-bold uppercase tracking-widest transition-colors duration-200',
                  activeTab === 'empresa' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Building2 size={13} />
                Empresa
              </button>
              <button
                id="tab-parceiro"
                onClick={() => setActiveTab('parceiro')}
                className={cn(
                  'relative z-10 flex items-center gap-2 px-5 py-2 rounded-[10px] text-xs font-bold uppercase tracking-widest transition-colors duration-200',
                  activeTab === 'parceiro' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Handshake size={13} />
                Parceiro
              </button>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-entrar"
              onClick={() => setLoginModalOpen(true)}
              className="h-9 px-5 rounded-button border border-border bg-background hover:bg-surface-container hover:border-muted-foreground/30 text-[11px] font-bold uppercase tracking-widest text-foreground transition-all hidden sm:flex items-center gap-2"
            >
              <LogIn size={13} />
              Entrar
            </button>
            <button
              onClick={handleConsultant}
              className="h-9 px-4 rounded-button bg-secondary text-secondary-foreground font-bold text-[11px] uppercase tracking-widest hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <MessageSquare size={13} />
              <span className="hidden sm:inline">{activeTab === 'parceiro' ? 'Seja Parceiro' : 'Consultor'}</span>
              <span className="sm:hidden">Falar</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-button flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-surface-container transition-all"
            >
              {mobileMenuOpen ? <X size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-5 py-4 space-y-1">
                {/* Mobile tab toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => { setActiveTab('empresa'); setMobileMenuOpen(false); }}
                    className={cn(
                      'flex-1 h-10 rounded-button text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                      activeTab === 'empresa' ? 'bg-primary text-primary-foreground' : 'bg-surface-container text-muted-foreground border border-border'
                    )}
                  >
                    <Building2 size={13} /> Empresa
                  </button>
                  <button
                    onClick={() => { setActiveTab('parceiro'); setMobileMenuOpen(false); }}
                    className={cn(
                      'flex-1 h-10 rounded-button text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                      activeTab === 'parceiro' ? 'bg-primary text-primary-foreground' : 'bg-surface-container text-muted-foreground border border-border'
                    )}
                  >
                    <Handshake size={13} /> Parceiro
                  </button>
                </div>

                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-button text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-container transition-all text-left"
                  >
                    {link.label}
                    <ChevronRight size={14} />
                  </button>
                ))}

                <button
                  onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full h-11 mt-2 rounded-button border border-border text-sm font-bold uppercase tracking-widest text-foreground hover:bg-surface-container transition-all flex items-center justify-center gap-2"
                >
                  <LogIn size={14} /> Entrar na plataforma
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'empresa' ? (
            <CompanyContent onConsultant={handleConsultant} />
          ) : (
            <PartnerContent onConsultant={handleConsultant} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-foreground border-t border-background/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-4">
            <IllumineMark className="w-16 h-16 shrink-0" />
            <div className="flex flex-col items-start w-fit">
              <span className="text-[56px] font-normal lowercase leading-[0.85] text-white tracking-[-0.04em] block" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                illumine
              </span>
              <div className="flex justify-between w-full text-[8px] text-white uppercase mt-[6px] font-bold whitespace-nowrap" style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '3px', paddingRight: '0.8px' }}>
                {"Governance".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 w-full">
            <p className="text-white/80 font-medium text-sm md:text-base font-normal text-left md:text-right leading-relaxed">
              Inteligência estratégica, governança e performance para líderes e organizações que buscam clareza de direção, solidez gerencial e crescimento sustentável.
            </p>
            <p className="text-white/40 text-[10px] tracking-widest uppercase font-semibold text-left md:text-right">
              © {new Date().getFullYear()} Illumine • Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>


      {/* ── Login Modal ─────────────────────────────────────────────────── */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onGoogleLogin={onGoogleLogin}
        onEmailLogin={handleEmailAuth}
        isSigningIn={isSigningIn}
        isSubmitting={isSubmitting}
        loginError={loginError}
      />
    </main>
  );
}
