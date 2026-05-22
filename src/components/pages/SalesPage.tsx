import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, BarChart3, BrainCircuit, Building2, CheckCircle2, ChevronRight, 
  Database, LineChart, MessageSquare, ShieldCheck, Sparkles, Users, LayoutDashboard, 
  Network, HelpCircle, Handshake, Target, TrendingUp, Leaf, Activity, Scale, Layers, 
  Compass, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Helper Logo
function IllumineMark({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <line x1="30" y1="30" x2="22" y2="22" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="8" y2="50" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="70" x2="22" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="82" x2="50" y2="92" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="70" x2="78" y2="78" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 22 C 34.5 22, 22 34.5, 22 50 C 22 65.5, 34.5 78, 50 78 C 65.5 78, 78 65.5, 78 50 M50 50 L75 25 M75 25 L65 25 M75 25 L75 35" stroke="#ff8552" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function SalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      // Show sticky CTA after scrolling past Hero (approx 600px)
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = (message: string) => {
    window.open(
      `https://wa.me/554131514537?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    { q: 'Por que o acompanhamento mínimo recomendado é de 6 meses?', a: 'Porque crescimento sustentável exige continuidade, acompanhamento e amadurecimento gerencial. A transformação estratégica acontece de forma progressiva.' },
    { q: 'Como funciona o Diagnóstico Estratégico Inicial?', a: 'A Illumine realiza uma análise profunda da sua estrutura financeira, operacional e governamental para mapear riscos e destravar oportunidades.' },
    { q: 'Qual é o nível de envolvimento esperado dos sócios?', a: 'O envolvimento da liderança é essencial para garantir alinhamento, clareza de direção e evolução consistente da gestão ao longo dos encontros.' },
    { q: 'Para quais empresas a Illumine é recomendada?', a: 'Empresas em expansão ou reestruturação que precisam organizar a sustentabilidade do crescimento, consolidar a gestão financeira e aplicar governança.' },
    { q: 'Como funciona a segurança das informações?', a: 'Toda a nossa estrutura de dados opera em ambiente privado com rígido controle de acesso, criptografia e total confidencialidade executiva.' }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Navbar Premium Blur */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/20 backdrop-blur-xl bg-background/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => scrollToSection('hero')}>
            <IllumineMark className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col select-none">
              <span className="text-xl md:text-3xl font-normal lowercase leading-none text-primary group-hover:text-primary/90 transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                illumine
              </span>
              <div className="text-[5px] md:text-[6px] text-secondary uppercase mt-0.5 tracking-[0.2em] font-bold">
                Strategic Intelligence & Advisory
              </div>
            </div>
          </div>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('tese')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">A Tese</button>
            <button onClick={() => scrollToSection('intelligence-layers')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Arquitetura</button>
            <button onClick={() => scrollToSection('plataforma')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Plataforma</button>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={onLoginClick} className="hidden sm:block text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              Área do Cliente
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de agendar um diagnóstico confidencial')}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Diagnóstico Confidencial</span>
              <span className="sm:hidden">Diagnóstico</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION (Punchy & Premium) */}
      <section id="hero" className="pt-40 pb-20 px-6 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} className="text-secondary animate-pulse" /> Advisory Executivo & Estrutural
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight text-foreground leading-[1.05]"
            style={{ fontFamily: "'Tilt Warp', sans-serif" }}
          >
            Empresas não quebram por falta de faturamento.<br/>
            <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">Quebram por falta de leitura estrutural.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Uma arquitetura de inteligência desenvolvida para transformar indicadores dispersos em <strong className="text-foreground">direção executiva clara</strong>. Cresça com sustentabilidade, preserve o caixa e garanta governança em todas as suas decisões.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de agendar um Diagnóstico Confidencial')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Agendar Sessão de Diagnóstico</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* AUTHORITY BANNER */}
      <div className="border-y border-border/30 bg-surface-container/20 py-8 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-secondary opacity-80" />
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Confidencialidade</p>
              <p className="text-sm font-semibold text-foreground">Ambiente de Inteligência Privado</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border/50" />
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-secondary opacity-80" />
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Foco de Atuação</p>
              <p className="text-sm font-semibold text-foreground">Escala, Reestruturação & Governança</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border/50" />
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-secondary opacity-80" />
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Para quem existe</p>
              <p className="text-sm font-semibold text-foreground">C-Levels e Empresas em Expansão</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. A TESE ILLUMINE */}
      <section id="tese" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              A TESE ILLUMINE
            </h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1]" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O problema não é falta de dados.<br/>É falta de interpretação.
            </h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed w-full lg:pr-8">
              Empresas raramente entram em colapso da noite pro dia. A deterioração começa silenciosamente: expansão que consome caixa, margens caindo, dependência bancária invisível. O excesso de informação sem causalidade gera ruído corporativo. <span className="text-foreground font-semibold">Nossa tese é transformar a complexidade empresarial em um radar de decisão rápido, seguro e executivo.</span>
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl blur-xl opacity-50" />
            <div className="relative p-10 md:p-12 rounded-[2rem] bg-gradient-to-br from-surface-container to-background border border-primary/20 shadow-2xl backdrop-blur-xl">
              <BrainCircuit className="w-12 h-12 text-secondary mb-6" />
              <p className="text-2xl font-medium leading-snug text-foreground tracking-tight mb-6" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                A inteligência está na conexão das informações.
              </p>
              <div className="w-16 h-px bg-border mb-6" />
              <p className="text-base font-medium text-muted-foreground leading-relaxed">
                Nós modelamos as causas do seu negócio. Se uma decisão é tomada no departamento comercial, a Illumine antecipa matematicamente o impacto na sua sustentabilidade e no risco do amanhã.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. O COLAPSO SILENCIOSO */}
      <section className="py-32 px-6 bg-[#0a0a0a] text-white relative z-10 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-6 mb-16 relative">
            <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full text-red-400 mb-2">
              <AlertCircle size={24} className="animate-pulse" />
            </div>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Os maiores riscos empresariais são diagnosticáveis antes da crise.
            </h3>
            <p className="text-lg text-white/60 font-medium">
              Empresas costumam aparentar crescimento enquanto perdem sua sustentabilidade estrutural. Não espere a crise surgir.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              'Capital de giro asfixiando o caixa',
              'Crescimento sugando liquidez',
              'Deterioração progressiva da margem',
              'Aumento da dependência bancária',
              'Falta de absorção operacional',
              'Perda brutal de previsibilidade',
              'Expansão sem maturidade gerencial',
              'Inconsistência entre operação e tesouraria'
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-4 hover:bg-white/10 hover:border-secondary/30 transition-colors group">
                <TrendingUp size={20} className="text-secondary opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <span className="text-white/90 font-semibold text-sm leading-snug">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. INTELLIGENCE LAYERS */}
      <section id="intelligence-layers" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Layers size={14} className="text-secondary" />
              <span>O Ecossistema da Illumine</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Intelligence Layers
            </h3>
            <p className="text-lg text-muted-foreground font-medium">A verdadeira profundidade organizacional acontece quando a inteligência atua em múltiplas camadas.</p>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: BarChart3, title: 'Financial Engine', desc: 'Transformamos planilhas e balanços em leituras estruturais, revelando a saúde do seu caixa e sustentabilidade.' },
              { icon: ShieldCheck, title: 'Governance Intelligence', desc: 'Maturidade operacional, processos mapeados e blindagem corporativa para tomadas de decisão seguras.' },
              { icon: Network, title: 'Causal Engine', desc: 'O núcleo lógico que liga margem, caixa, eficiência e crescimento, mostrando impactos em tempo real.' },
              { icon: Users, title: 'Advisory Intelligence', desc: 'Os números entregues e acompanhados por especialistas que apoiam a direção executiva.' },
              { icon: Activity, title: 'Stress Analysis', desc: 'Simulações de risco para descobrir até onde sua operação aguenta a pressão mercadológica.' },
              { icon: Target, title: 'Executive Scoring', desc: 'Avaliação pragmática da maturidade e saúde da sua empresa pontuada de forma objetiva.' }
            ].map((layer, idx) => (
              <motion.div 
                variants={fadeUp} key={idx} 
                className="p-8 rounded-card bg-surface-container/50 border border-border/80 hover:shadow-xl hover:border-secondary/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-secondary/50 transition-all">
                  <layer.icon size={20} className="text-secondary" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">{layer.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm">{layer.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. A PLATAFORMA & TECNOLOGIA */}
      <section id="plataforma" className="py-32 px-6 bg-surface-container/40 border-y border-border/40 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Tecnologia & Operação
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1]" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              A plataforma é apenas a infraestrutura da inteligência.
            </h3>
            <div className="text-lg text-muted-foreground font-medium space-y-4">
              <p>O software sozinho não tem a capacidade de alinhar seus sócios nem resolver sua governança. A tecnologia existe para sustentar de forma irrefutável a nossa curadoria executiva.</p>
              <p className="text-foreground font-bold text-xl pt-2">É a interpretação humana, aliada à precisão dos dados, que transforma confusão em direção.</p>
            </div>
            
            <ul className="pt-4 grid sm:grid-cols-2 gap-3">
              {['Diagnósticos contínuos', 'Radar estrutural', 'Alertas de risco (Stress Test)', 'Scoring Organizacional'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span className="text-sm font-semibold text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative hidden lg:block">
            {/* Abstract Tech Representation */}
            <div className="w-full aspect-square max-w-[450px] mx-auto rounded-full border border-primary/20 flex items-center justify-center relative bg-background shadow-2xl">
              <div className="absolute inset-4 rounded-full border border-dashed border-secondary/30 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full bg-surface-container flex items-center justify-center shadow-inner">
                <IllumineMark className="w-24 h-24 text-primary" />
              </div>
              
              {/* Floating Orbits */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-card border border-border rounded-xl shadow-lg flex items-center justify-center"><Activity className="text-secondary" /></div>
              <div className="absolute -bottom-6 left-10 w-16 h-16 bg-card border border-border rounded-xl shadow-lg flex items-center justify-center"><LineChart className="text-primary" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL PREMIUM */}
      <section className="py-32 px-6 bg-primary text-primary-foreground relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-secondary rounded-full blur-[150px] opacity-20 -ml-[400px] -mt-[400px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-tight leading-[1.05]" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            O futuro da sua empresa depende da qualidade das decisões tomadas hoje.
          </h3>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium max-w-2xl mx-auto">
            Antecipe riscos estruturais, assuma o controle com inteligência causal e impulsione seu negócio.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleCTAClick('Gostaria de solicitar uma Análise Executiva Estrutural confidencial')}
              className="w-full sm:w-auto h-16 px-10 rounded-xl bg-background text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-2xl"
            >
              <span>Agendar Avaliação Confidencial</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-secondary" />
            </button>
          </div>
        </div>
      </section>

      {/* STICKY FLOATING CTA (Scroll) */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de falar com um especialista sobre a Illumine')}
              className="flex items-center gap-3 px-6 h-14 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageSquare size={18} className="text-secondary" />
              <span className="hidden sm:inline">Falar com Especialista</span>
              <span className="sm:hidden">Especialista</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
