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
} from 'lucide-react';
import { cn } from '../../lib/utils';

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

  const handleSubmit = (e: React.FormEvent) => {
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[460px] rounded-card bg-card/95 backdrop-blur-2xl border border-border/60 shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
              style={{
                maxHeight: 'min(90dvh, 780px)',
                boxShadow: '0 32px 80px rgba(14,28,44,0.22), 0 0 0 1px rgba(255,133,82,0.08)'
              }}
            >
              {/* Top accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

              {/* Header */}
              <div className="relative bg-gradient-to-b from-primary/8 to-transparent p-5 sm:p-7 pb-4 sm:pb-5 border-b border-border/40 shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-button flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-container transition-all"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-button bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <IllumineMark className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-success">
                    <CheckCircle2 size={10} className="animate-pulse" />
                    Acesso protegido
                  </div>
                </div>

                <h2 className="text-h2 font-medium tracking-tight text-foreground">
                  Entrar no painel
                </h2>
                <p className="mt-1.5 text-body-sm leading-relaxed text-muted-foreground font-medium font-sans">
                  Continue com seu e-mail e senha ou conta Google para acessar seu ambiente Illumine.
                </p>
              </div>

              {/* Body — scrollável */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">
                      E-mail
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail size={15} strokeWidth={1.5} />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.nome@empresa.com.br"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container/40 border border-border rounded-button focus:border-primary focus:bg-background/80 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-body-sm font-sans text-foreground"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">
                      Senha
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Lock size={15} strokeWidth={1.5} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        className="w-full pl-10 pr-10 py-3 bg-surface-container/40 border border-border rounded-button focus:border-primary focus:bg-background/80 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-body-sm font-sans text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSigningIn}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all rounded-button font-bold text-body-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                    Entrar
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-border" />
                  <span className="relative px-3 bg-card text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    ou continue com
                  </span>
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={onGoogleLogin}
                  disabled={isSigningIn || isSubmitting}
                  className="w-full h-12 rounded-button border border-border bg-background/60 hover:bg-surface-container disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-body-sm font-medium text-foreground shadow-sm hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.98]"
                >
                  {isSigningIn ? (
                    <Loader2 size={18} className="animate-spin text-secondary" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                  )}
                  {isSigningIn ? 'Conectando...' : 'Entrar com Google'}
                </button>

                {/* Error */}
                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-button bg-destructive/10 border border-destructive/20 px-4 py-3 text-body-sm font-medium text-destructive leading-5"
                    >
                      {loginError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Security note */}
                <div className="rounded-button bg-surface-container/40 border border-border/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck size={11} className="text-secondary shrink-0" />
                    Ambiente privado e seguro
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground/75 font-medium font-sans">
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

  const handleCTA = (message: string) => {
    window.open(
      `https://wa.me/554131514537?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Por que o acompanhamento mínimo recomendado é de 6 meses?',
      a: 'Porque crescimento sustentável exige continuidade, acompanhamento e amadurecimento gerencial. A transformação estratégica acontece de forma progressiva e integrada.'
    },
    {
      q: 'Como funciona o Diagnóstico Estratégico Inicial?',
      a: 'A Illumine realiza uma análise inicial da estrutura financeira, operacional, organizacional e gerencial da empresa para identificar riscos, gargalos, oportunidades e prioridades estratégicas.'
    },
    {
      q: 'Qual é o nível de envolvimento esperado dos sócios e executivos?',
      a: 'O envolvimento da liderança é essencial para garantir alinhamento estratégico, clareza de direção e evolução consistente da gestão.'
    },
    {
      q: 'A Illumine executa as melhorias operacionais?',
      a: 'A Illumine atua prioritariamente no advisory estratégico, estruturação gerencial, acompanhamento executivo e direcionamento organizacional. Dependendo da necessidade, algumas ações específicas podem ser acompanhadas de forma assistida.'
    },
    {
      q: 'Para quais empresas a Illumine é recomendada?',
      a: 'Empresas em crescimento, profissionalização, reorganização financeira, expansão operacional ou fortalecimento de governança.'
    },
    {
      q: 'Como funciona a segurança das informações?',
      a: 'Toda a estrutura opera em ambiente privado, com controle de acesso, confidencialidade operacional e acompanhamento seguro das informações estratégicas.'
    },
    {
      q: 'Os relatórios permanecem disponíveis após o encerramento do contrato?',
      a: 'Durante a vigência do acompanhamento, a empresa possui acesso completo ao ambiente estratégico da plataforma. Em caso de encerramento contratual, a Illumine disponibiliza um relatório executivo consolidado com os principais indicadores e análises gerenciais.'
    }
  ];

  return (
    <div className="space-y-0 text-foreground">
      {/* Hero */}
      <section id="hero" className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md text-primary text-[11px] font-semibold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={13} className="text-secondary animate-pulse" />
            <span>Illumine Business Intelligence &amp; Advisory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.08]"
            style={{ fontFamily: "'Tilt Warp', sans-serif" }}
          >
            Inteligência estratégica, governança e <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">advisory executivo</span> para empresas
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="space-y-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
          >
            <p>
              Inteligência estratégica, governança e advisory executivo para empresas que desejam crescer com clareza, estrutura e sustentabilidade.
            </p>
            <p className="text-base text-muted-foreground/80 font-normal leading-relaxed">
              A Illumine integra inteligência financeira, governança corporativa, indicadores estratégicos e acompanhamento executivo em um único ecossistema de gestão e advisory. Mais do que dashboards ou relatórios, oferecemos uma estrutura contínua de inteligência empresarial para líderes que precisam tomar decisões com maior segurança, organização e visão de longo prazo.
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
              <span>Conhecer a Estrutura Illumine</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={16} className="text-secondary" />
              <span>Agendar Diagnóstico Estratégico</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Por que Illumine (Direção Estratégica) */}
      <section id="porque" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Direção Estratégica
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Empresas não precisam apenas de dados. Precisam de direção estratégica.
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>
                A maioria das empresas já possui sistemas, relatórios e informações operacionais.
              </p>
              <p>
                O verdadeiro desafio está em interpretar cenários, identificar gargalos, integrar áreas, organizar prioridades, reduzir riscos e transformar dados em decisões consistentes.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/10 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 rounded-card bg-background border border-border shadow-md space-y-4 hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold text-xl text-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                O Espaço Illumine
              </h4>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                A Illumine foi criada para preencher exatamente esse espaço. Nossa estrutura conecta tecnologia, análise executiva, governança e acompanhamento estratégico contínuo para apoiar empresas em crescimento, profissionalização e expansão sustentável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Proprietário */}
      <section id="framework" className="py-24 px-6 bg-foreground text-background relative">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">Framework Proprietário</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              7 Pilares de Inteligência Empresarial
            </h3>
            <p className="text-lg text-background/70 leading-relaxed font-medium pt-2">
              Toda a estrutura de acompanhamento da Illumine é construída sobre um framework proprietário desenvolvido para gerar visão integrada da empresa, fortalecer a gestão e apoiar decisões estratégicas sustentáveis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {[
              { title: 'Governança Corporativa', desc: 'Estruturas de liderança, direção institucional, compliance e sustentabilidade organizacional.' },
              { title: 'Cultura Organizacional', desc: 'Valores, comportamento, alinhamento interno e fortalecimento da identidade empresarial.' },
              { title: 'Gestão Financeira', desc: 'Inteligência financeira aplicada à sustentabilidade, rentabilidade e crescimento estruturado.' },
              { title: 'Gestão de Inovação', desc: 'Capacidade de adaptação, melhoria contínua e desenvolvimento estratégico.' },
              { title: 'Gestão de Marketing', desc: 'Posicionamento, comunicação, percepção de valor e geração de autoridade.' },
              { title: 'Gestão Comercial', desc: 'Estrutura comercial orientada à performance, previsibilidade e crescimento.' },
              { title: 'Gestão Operacional', desc: 'Eficiência operacional, integração de processos e fortalecimento da execução.' }
            ].map((pilar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card bg-background/5 border border-background/10 space-y-3 hover:bg-background/10 hover:border-background/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span className="font-bold text-sm uppercase tracking-wider text-background">{pilar.title}</span>
                </div>
                <p className="text-background/60 font-medium text-xs leading-relaxed">{pilar.desc}</p>
              </div>
            ))}
          </div>

          {/* As 5 Inteligências */}
          <div className="pt-16 border-t border-background/10 space-y-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">As 5 Inteligências</h2>
              <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                Nossa Visão: Inteligência em Unidade
              </h3>
              <p className="text-lg text-background/70 leading-relaxed font-medium">
                Acreditamos que organizações saudáveis são construídas quando governança, tecnologia, inteligência de dados, identidade organizacional e desenvolvimento humano operam em unidade. Mais do que processos e indicadores, empresas fortes nascem da integração entre estratégia, cultura, propósito e capacidade de execução.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Governança', desc: 'Estruturas de liderança, responsabilidade institucional e direção estratégica.' },
                { title: 'Econômica', desc: 'Gestão financeira e inteligência econômica aplicadas à sustentabilidade do negócio.' },
                { title: 'Identidade', desc: 'Cultura, valores e princípios que sustentam a essência organizacional.' },
                { title: 'Sistêmica', desc: 'Integração entre dados, processos, tecnologia e operation.' },
                { title: 'Antropológica', desc: 'Compreensão da natureza humana como fundamento da liderança, das relações e da cultura empresarial.' }
              ].map((intel, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-card bg-background/5 border border-background/10 space-y-3 hover:bg-background/10 hover:border-background/20 transition-all duration-300"
                >
                  <span className="font-bold text-sm uppercase tracking-wider text-secondary block">{intel.title}</span>
                  <p className="text-background/60 font-medium text-xs leading-relaxed">{intel.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* O Ecossistema Illumine */}
      <section id="ecossistema" className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Network size={16} className="text-secondary" />
              <span>O Ecossistema Illumine</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Uma estrutura integrada de inteligência empresarial
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              A Illumine combina tecnologia, advisory e análise estratégica em um ambiente privado e continuamente acompanhado por especialistas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: LineChart, title: 'Indicadores Estratégicos Integrados', desc: 'Indicadores financeiros, operacionais e gerenciais organizados em uma central executiva para acompanhamento e tomada de decisão.' },
              { icon: BarChart3, title: 'Diagnósticos Executivos', desc: 'Análises aprofundadas que revelam riscos, gargalos, oportunidades e maturidade organizacional.' },
              { icon: Users, title: 'Advisory Estratégico Contínuo', desc: 'Acompanhamento executivo recorrente com análise interpretativa, direcionamento estratégico e suporte à tomada de decisão.' },
              { icon: Building2, title: 'Governança Corporativa', desc: 'Estrutura orientada à profissionalização da gestão, transparência institucional e fortalecimento organizacional.' },
              { icon: Database, title: 'Inteligência Orientada por Dados', desc: 'Integração entre métricas, dashboards, automação e monitoramento estratégico da performance empresarial.' },
              { icon: BrainCircuit, title: 'Curadoria Especializada', desc: 'A equipe Illumine acompanha, organiza e interpreta os indicadores de forma contínua, gerando maior clareza gerencial e consistência analítica.' },
              { icon: ShieldCheck, title: 'Governança e Segurança', desc: 'Ambiente privado com controle de acesso, confidencialidade operacional e estrutura segura para gestão estratégica recorrente.' }
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

      {/* Modelos de Advisory Estratégico */}
      <section id="modalidades" className="py-24 px-6 bg-surface-container">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Modelos de Advisory Estratégico</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Estruturas desenvolvidas para empresas em diferentes níveis de operação
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Todos os modelos incluem: acesso completo à plataforma Illumine; curadoria contínua dos indicadores; acompanhamento executivo recorrente; dashboards integrados; suporte estratégico especializado; inteligência orientada por dados.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch pt-4">
            {/* ESSENTIAL */}
            <div className="rounded-card bg-card border border-border/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 group">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>ESSENTIAL</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Estruturação e Clareza Operacional</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Perfil recomendado</p>
                  <ul className="text-xs text-foreground font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">• Até 10 colaboradores</li>
                    <li className="flex items-center gap-1.5">• Faturamento de até R$ 150 mil/mês</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'Encontro executivo mensal',
                    'Estruturação dos indicadores essenciais',
                    'Curadoria estratégica das informações',
                    'Acompanhamento consultivo recorrente',
                    'Central executiva Illumine',
                    'Suporte estratégico contínuo'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCTA('Gostaria de falar com um especialista sobre o modelo Essential')}
                className="w-full h-12 mt-8 rounded-button bg-surface-container hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Falar com um especialista
              </button>
            </div>

            {/* STRATEGIC */}
            <div className="rounded-card bg-card border-2 border-primary p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/5 transform lg:-translate-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-secondary to-[#E96F3D]" />
              <div className="absolute top-6 right-6 px-3 py-1 bg-secondary text-secondary-foreground text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-sm animate-pulse">
                Recomendado
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>STRATEGIC</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Expansão e Performance Empresarial</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Perfil recomendado</p>
                  <ul className="text-xs text-foreground font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">• 10 a 40 colaboradores</li>
                    <li className="flex items-center gap-1.5">• Faturamento entre R$ 150k e R$ 1M/mês</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'Dois encontros executivos mensais',
                    'Dashboards estratégicos personalizados',
                    'Curadoria avançada de indicadores',
                    'Acompanhamento financeiro e operacional',
                    'Apoio à liderança e gestão',
                    'Advisory estratégico contínuo',
                    'Central executiva Illumine'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico - Modelo Strategic')}
                className="w-full h-12 mt-8 rounded-button bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Agendar diagnóstico estratégico
              </button>
            </div>

            {/* EXECUTIVE ADVISORY */}
            <div className="rounded-card bg-card border border-border/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 group">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>EXECUTIVE ADVISORY</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Governança, Inteligência e Escala</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Perfil recomendado</p>
                  <ul className="text-xs text-foreground font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">• Acima de 40 colaboradores</li>
                    <li className="flex items-center gap-1.5">• Faturamento acima de R$ 1 milhão/mês</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'Encontros executivos semanais ou quinzenais',
                    'Advisory estratégico personalizado',
                    'Curadoria executiva contínua',
                    'Relatórios gerenciais integrados',
                    'Apoio à governança corporativa',
                    'Estruturação de indicadores avançados',
                    'Acompanhamento multidisciplinar',
                    'Central executiva Illumine'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCTA('Gostaria de solicitar uma reunião executiva - Executive Advisory')}
                className="w-full h-12 mt-8 rounded-button bg-surface-container hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Solicitar reunião executiva
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alinhamento Estratégico - FAQ */}
      <section id="faq" className="py-24 px-6 bg-surface-container/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Alinhamento Estratégico</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    "border rounded-card bg-background overflow-hidden transition-all duration-300",
                    isOpen ? "border-secondary/35 shadow-md shadow-secondary/[0.01]" : "border-border/80"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left font-bold text-foreground hover:bg-surface-container/30 transition-colors cursor-pointer"
                  >
                    <span className="text-base pr-4 transition-colors duration-300">{faq.q}</span>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0",
                      isOpen ? "bg-secondary/15 text-secondary" : "bg-surface-container text-muted-foreground"
                    )}>
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform duration-300",
                          isOpen && "transform rotate-90"
                        )}
                      />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-muted-foreground font-medium text-sm leading-relaxed border-t border-border/30 pt-4 bg-surface-container/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conclusão */}
      <section id="conclusao" className="py-24 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            Crescimento exige mais do que informação
          </h3>
          <div className="text-lg md:text-xl text-background/70 space-y-4 font-medium leading-relaxed">
            <p>
              Empresas sustentáveis não são construídas apenas com dados.
            </p>
            <p>
              São construídas com clareza estratégica, estrutura de gestão, capacidade de decisão e acompanhamento consistente.
            </p>
            <p className="text-background font-bold text-xl pt-4">
              A Illumine existe para apoiar líderes e organizações que desejam crescer com direção, governança e inteligência aplicada à realidade do negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Buttons */}
      <section className="py-20 px-6 bg-surface-container/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h4 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Illumine Business Intelligence &amp; Advisory</h4>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Inteligência estratégica, governança e performance para empresas e parceiros que desejam crescer com clareza, estrutura e sustentabilidade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('ecossistema')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-surface-container border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/85 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Conhecer a Estrutura Illumine
            </button>
            <button
              onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Agendar Diagnóstico Estratégico
            </button>
            <button
              onClick={() => handleCTA('Gostaria de falar com um Advisor')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-surface-container border border-secondary/35 text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/85 hover:border-secondary/55 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Falar com um Advisor Illumine
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PartnerContent({ onConsultant }: { onConsultant: () => void }) {
  const handleFinalCTA = (type: string) => {
    if (type === 'estrutura') {
      document.getElementById('ecossistema-parceiro')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'parceria') {
      window.open(
        'https://wa.me/554131514537?text=Gostaria%20de%20aplicar%20para%20a%20Parceria%20Estrat%C3%A9gica%20Illumine',
        '_blank'
      );
    } else {
      window.open(
        'https://wa.me/554131514537?text=Gostaria%20de%20falar%20com%20um%20Advisor%20Illumine%20sobre%20a%20estrutura%20de%20Advisory',
        '_blank'
      );
    }
  };

  return (
    <div className="space-y-0 text-foreground">
      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md text-primary text-[11px] font-semibold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={13} className="text-secondary animate-pulse" />
            <span>Illumine Business Intelligence &amp; Advisory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1]"
            style={{ fontFamily: "'Tilt Warp', sans-serif" }}
          >
            Estrutura estratégica de Business Intelligence &amp; Advisory para parceiros que desejam{' '}
            <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">ampliar valor, recorrência e capacidade consultiva.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-4xl mx-auto space-y-4 leading-relaxed"
          >
            <p>
              A Illumine oferece uma estrutura integrada de inteligência empresarial, dashboards executivos, curadoria estratégica e acompanhamento recorrente para parceiros que desejam ampliar sua capacidade de entrega, posicionamento consultivo e geração de valor.
            </p>
            <p className="text-base text-muted-foreground/80">
              Mais do que uma plataforma, entregamos um ecossistema completo de inteligência estratégica para escritórios, consultorias e operações que desejam atuar além da execução operacional.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button
              onClick={() => document.getElementById('perfil')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Conhecer a Estrutura de Parceria</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onConsultant}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Handshake size={16} className="text-secondary" />
              <span>Aplicar para Parceria Estratégica</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Para quem foi desenvolvida */}
      <section id="perfil" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Para quem a parceria foi desenvolvida:
            </h3>
            <p className="text-lg text-muted-foreground font-medium">
              A estrutura Illumine foi criada para apoiar escritórios, consultores e líderes que buscam escalar valor e impacto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Escritórios de contabilidade',
              'Consultorias empresariais',
              'Assessorias financeiras',
              'Operações de BPO financeiro',
              'Holdings',
              'Advisors independentes',
              'Profissionais de gestão',
              'Operações consultivas',
              'Empresas com foco estratégico'
            ].map((perfil, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-button bg-surface-container border border-border/80 hover:shadow-md hover:border-secondary/25 transition-all duration-300 cursor-default"
              >
                <CheckCircle2 size={16} className="text-secondary shrink-0" />
                <span className="font-semibold text-sm text-foreground">{perfil}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mercado Section */}
      <section id="mercado" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Cenário de Mercado
            </h2>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O mercado mudou. Empresas não buscam apenas execução operacional.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6">
            <div className="p-8 rounded-card bg-background border border-border/80 shadow-xs space-y-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Empresas precisam de:
              </h4>
              <ul className="space-y-4">
                {[
                  'Clareza estratégica para definir caminhos estruturados;',
                  'Inteligência financeira aplicada para maximizar resultados;',
                  'Governança corporativa profissional e de alta performance;',
                  'Acompanhamento recorrente e orientação baseada em dados;',
                  'Suporte robusto à tomada de decisão gerencial;',
                  'Visão integrada de toda a operação de negócios.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-secondary shrink-0 mt-1" />
                    <span className="text-muted-foreground font-medium text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-card bg-background border border-border/80 shadow-xs space-y-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                Desafios dos Parceiros:
              </h4>
              <ul className="space-y-4">
                {[
                  'Estruturar modelos de advisory recorrente e rentável;',
                  'Ampliar o valor percebido das entregas e consultorias;',
                  'Escalar o acompanhamento estratégico de forma organizada;',
                  'Centralizar indicadores financeiros e de governança;',
                  'Transformar dados complexos em inteligência aplicada de forma ágil.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                    <span className="text-muted-foreground font-medium text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-8">
            <p className="text-xl md:text-2xl font-medium text-foreground max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              A Illumine foi criada para preencher exatamente esse espaço.
            </p>
          </div>
        </div>
      </section>

      {/* Ampliação Consultiva */}
      <section id="objetivo" className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <div className="w-8 h-px bg-primary" />
                Ampliação Consultiva
              </h2>
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                Uma infraestrutura estratégica para ampliação consultiva
              </h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              A parceria estratégica Illumine permite que consultores, escritórios e operações empresariais utilizem uma estrutura robusta de Business Intelligence &amp; Advisory para ampliar sua capacidade de entrega e posicionamento estratégico.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Os parceiros utilizam a estrutura Illumine como central estratégica de acompanhamento, inteligência empresarial, governança e suporte executivo aos seus clientes.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/10 rounded-card blur-lg opacity-30" />
            <div className="relative p-8 rounded-card bg-white border border-border shadow-md space-y-6">
              <h4 className="text-lg font-bold text-primary">O que os parceiros desenvolvem com a Illumine:</h4>
              <div className="space-y-4">
                {[
                  { title: 'Ampliação de Valor Percebido', desc: 'Transforme informações operacionais em inteligência estratégica aplicada à realidade dos seus clientes.' },
                  { title: 'Retenção e Recorrência', desc: 'Desenvolva relacionamentos de longo prazo através de acompanhamento consultivo contínuo.' },
                  { title: 'Posicionamento Consultivo', desc: 'Fortaleça sua autoridade atuando além da execução operacional.' },
                  { title: 'Escalabilidade Estratégica', desc: 'Acompanhe múltiplos clientes com organização, centralização e visão integrada.' },
                  { title: 'Estruturação de Advisory', desc: 'Crie um modelo recorrente de acompanhamento empresarial orientado por indicadores e inteligência executiva.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <CheckCircle2 size={18} className="text-secondary shrink-0 mt-1 transition-transform group-hover:scale-110" />
                    <div>
                      <h5 className="font-bold text-foreground text-sm uppercase tracking-wider group-hover:text-primary transition-colors">{item.title}</h5>
                      <p className="text-muted-foreground text-sm font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estrutura Integrada */}
      <section id="ecossistema-parceiro" className="py-24 px-6 bg-surface-container/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Network size={16} className="text-secondary" />
              <span>Estrutura Integrada</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Estrutura Integrada de Inteligência Empresarial
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Um ecossistema desenvolvido para centralizar acompanhamento, análise e gestão estratégica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutDashboard, title: 'Dashboards Executivos', desc: 'Painéis integrados para acompanhamento financeiro, operacional e estratégico dos clientes.' },
              { icon: LineChart, title: 'Indicadores Estratégicos', desc: 'Monitoramento contínuo de performance, riscos, sustentabilidade e maturidade organizacional.' },
              { icon: Building2, title: 'Análises Gerenciais', desc: 'Ferramentas para evolução histórica e acompanhamento dos clientes.' },
              { icon: Sparkles, title: 'Curadoria Estratégica', desc: 'Os dados passam por validação e acompanhamento contínuo antes da integração estratégica.' },
              { icon: BookOpen, title: 'Centralização de Documentos', desc: 'Organização segura de relatórios, documentos corporativos e informações estratégicas.' },
              { icon: Users, title: 'Advisory e Curadoria', desc: 'A equipe Illumine atua como suporte especializado na interpretação dos indicadores, organização gerencial e estruturação estratégica.' },
              { icon: Network, title: 'Onboarding & Cadastro Unificado', desc: 'Estruturação ágil do parceiro e cadastro seguro de múltiplos clientes em um ambiente centralizado.' },
              { icon: ShieldCheck, title: 'Governança & Segurança', desc: 'Ambiente privado com controle de acesso, confidencialidade operacional e estrutura segura para gestão recorrente.' },
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

      {/* Framework Proprietário */}
      <section id="framework-parceiro" className="py-24 px-6 bg-foreground text-background relative">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">Framework Proprietário</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              7 Pilares de Inteligência Empresarial
            </h3>
            <p className="text-lg text-background/70 leading-relaxed font-medium pt-2">
              Toda a estrutura de acompanhamento é organizada através do framework proprietário Illumine, permitindo visão integrada da empresa, identificação de gargalos e geração de insights estratégicos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {[
              { title: 'Governança Corporativa', desc: 'Estruturas de liderança, responsabilidade institucional e direção estratégica.' },
              { title: 'Cultura Organizacional', desc: 'Valores, alinhamento interno e fortalecimento da identidade empresarial.' },
              { title: 'Gestão Financeira', desc: 'Inteligência financeira aplicada à sustentabilidade e crescimento estruturado.' },
              { title: 'Gestão de Inovação', desc: 'Desenvolvimento contínuo, adaptação estratégica e evolução organizacional.' },
              { title: 'Gestão de Marketing', desc: 'Posicionamento, percepção de valor e fortalecimento da autoridade da marca.' },
              { title: 'Gestão Comercial', desc: 'Estrutura comercial orientada à performance, previsibilidade e crescimento.' },
              { title: 'Gestão Operacional', desc: 'Eficiência operacional, integração de processos e fortalecimento da execução.' },
            ].map((pilar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card bg-background/5 border border-background/10 space-y-2 hover:bg-background/10 hover:border-background/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span className="font-bold text-sm uppercase tracking-wider text-background">{pilar.title}</span>
                </div>
                <p className="text-background/60 text-xs leading-relaxed">{pilar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Muito além de uma plataforma */}
      <section id="diferenciais" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            Muito além de uma plataforma
          </h3>
          <div className="text-lg md:text-xl text-muted-foreground font-medium max-w-4xl mx-auto space-y-6 leading-relaxed">
            <p>
              Você não recebe apenas acesso a um software. Recebe uma estrutura estratégica de inteligência empresarial, acompanhamento executivo e suporte consultivo contínuo para ampliar a capacidade de entrega do seu escritório ou operação.
            </p>
            <p>
              A Illumine atua como infraestrutura estratégica para parceiros que desejam evoluir de uma atuação operacional para uma atuação orientada por advisory, governança e inteligência aplicada.
            </p>
          </div>
        </div>
      </section>

      {/* Modelos de Parceria */}
      <section id="modalidades" className="py-24 px-6 bg-surface-container/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Modelos de Parceria Estratégica</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Estruturas desenvolvidas para parceiros em diferentes níveis de operação
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Todos os modelos incluem: acesso completo à plataforma Illumine; dashboards executivos integrados; curadoria estratégica; acompanhamento recorrente; suporte consultivo especializado; framework proprietário Illumine.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch pt-4">
            {/* STRATEGIC PARTNER */}
            <div className="rounded-card bg-card border border-border/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 group">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>STRATEGIC PARTNER</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Consultores e Estruturas em Consolidação</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escopo recomendado</p>
                  <p className="text-xs text-foreground font-semibold leading-relaxed">
                    Até 5 clientes ativos. Para consultores independentes e pequenos escritórios que buscam recorrência.
                  </p>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'Central estratégica Illumine',
                    'Dashboards executivos',
                    'Framework Illumine',
                    'Curadoria operacional',
                    'Estrutura inicial de advisory',
                    'Suporte especializado recorrente'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onConsultant}
                className="w-full h-12 mt-8 rounded-button bg-surface-container hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Aplicar para Parceria
              </button>
            </div>

            {/* BUSINESS PARTNER */}
            <div className="rounded-card bg-card border-2 border-primary p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/5 transform lg:-translate-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-secondary to-[#E96F3D]" />
              <div className="absolute top-6 right-6 px-3 py-1 bg-secondary text-secondary-foreground text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-sm animate-pulse">
                Recomendado
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>BUSINESS PARTNER</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Escritórios e Operações em Expansão</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escopo recomendado</p>
                  <p className="text-xs text-foreground font-semibold leading-relaxed">
                    Entre 6 e 20 clientes ativos. Para operações consultivas focadas em escalabilidade e tecnologia.
                  </p>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'Estrutura ampliada de inteligência',
                    'Dashboards personalizados',
                    'Curadoria estratégica contínua',
                    'Suporte consultivo recorrente',
                    'Acompanhamento executivo',
                    'Organização integrada dos clientes',
                    'Central estratégica Illumine'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onConsultant}
                className="w-full h-12 mt-8 rounded-button bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Solicitar Estrutura de Parceria
              </button>
            </div>

            {/* EXECUTIVE PARTNER */}
            <div className="rounded-card bg-card border border-border/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 group">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>EXECUTIVE PARTNER</h4>
                  <p className="text-muted-foreground font-semibold text-xs mt-1">Holdings e Operações de Alta Complexidade</p>
                </div>
                
                <div className="bg-surface-container/50 p-4 rounded-xl border border-border/40 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escopo recomendado</p>
                  <p className="text-xs text-foreground font-semibold leading-relaxed">
                    Acima de 20 clientes ativos. Para holdings e consultorias consolidadas de alta demanda de dados.
                  </p>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob Consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'Ambiente estratégico avançado',
                    'Estrutura premium de inteligência',
                    'Curadoria executiva contínua',
                    'Dashboards executivos avançados',
                    'Suporte estratégico dedicado',
                    'Advisory especializado',
                    'Acompanhamento multidisciplinar',
                    'Estrutura integrada de governança'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-semibold text-xs md:text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onConsultant}
                className="w-full h-12 mt-8 rounded-button bg-surface-container hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Agendar Reunião Estratégica
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Crescimento sustentável exige inteligência aplicada */}
      <section id="conclusao" className="py-24 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-soft/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-background leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            Crescimento sustentável exige inteligência aplicada
          </h3>
          <div className="text-lg md:text-xl text-background/70 space-y-4 font-medium leading-relaxed">
            <p>
              O futuro das estruturas consultivas não está apenas na execução operacional.
            </p>
            <p>
              Está na capacidade de interpretar cenários, acompanhar empresas estrategicamente, estruturar governança, transformar dados em direção e gerar valor recorrente.
            </p>
            <p className="text-background font-bold text-xl pt-4">
              A Illumine existe para apoiar parceiros que desejam construir operações mais estratégicas, organizadas e sustentáveis.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Buttons */}
      <section className="py-20 px-6 bg-surface-container/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h4 className="text-2xl font-bold text-foreground animate-pulse" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Deseja evoluir sua operação consultiva?</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleFinalCTA('estrutura')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-surface-container border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/85 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Conhecer a Estrutura Illumine
            </button>
            <button
              onClick={() => handleFinalCTA('parceria')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Aplicar para Parceria Estratégica
            </button>
            <button
              onClick={() => handleFinalCTA('advisor')}
              className="w-full sm:w-auto h-12 px-6 rounded-button bg-surface-container border border-secondary/35 text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/85 hover:border-secondary/55 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Falar com um Advisor Illumine
            </button>
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
            className="flex items-center gap-3 shrink-0 select-none"
          >
            <div className="w-9 h-9 rounded-button bg-primary shadow-md flex items-center justify-center border border-white/10">
              <IllumineMark className="w-6 h-6" />
            </div>
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
      <footer className="py-12 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-button bg-primary flex items-center justify-center">
              <IllumineMark className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-normal lowercase leading-none text-background block" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                illumine
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-background/60">
                Business Intelligence &amp; Advisory
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 min-w-0">
            <p className="text-background/80 font-medium text-center md:text-right leading-relaxed">
              Inteligência estratégica, governança e performance para empresas e parceiros que desejam crescer com clareza, estrutura e sustentabilidade.
            </p>
            <p className="text-background/40 text-sm">
              © {new Date().getFullYear()} Illumine. Todos os direitos reservados.
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
