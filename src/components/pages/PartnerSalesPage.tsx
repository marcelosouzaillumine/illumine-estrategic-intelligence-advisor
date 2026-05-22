import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, BarChart3, BrainCircuit, Building2, CheckCircle2, ChevronRight, 
  Database, LineChart, MessageSquare, ShieldCheck, Sparkles, Users, LayoutDashboard, 
  Network, HelpCircle, Handshake, Target, TrendingUp, Leaf, Activity, Scale, Layers, 
  Compass, AlertCircle, Briefcase, Medal
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

export function PartnerSalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
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

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Effects */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Navbar Premium Blur */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/20 backdrop-blur-xl bg-background/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-4">
          
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

          {/* Nav Toggle para Empresas/Parceiros */}
          <div className="hidden lg:flex items-center gap-1 bg-surface-container border border-border p-1 rounded-lg">
            <button
              onClick={() => window.location.href = '/empresas'}
              className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              Empresa
            </button>
            <button
              className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-md shadow-sm pointer-events-none"
            >
              Parceiro
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('tese')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">A Tese</button>
            <button onClick={() => scrollToSection('ecossistema')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Ecossistema</button>
            <button onClick={() => scrollToSection('infraestrutura')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Infraestrutura</button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button onClick={onLoginClick} className="hidden sm:block text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              Área do Parceiro
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de solicitar meu credenciamento estratégico na Illumine')}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Credenciamento</span>
              <span className="sm:hidden">Aplicar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-40 pb-20 px-6 relative overflow-hidden z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest">
              <Network size={14} className="animate-pulse" /> Ecossistema Estratégico de Parceiros
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight text-foreground leading-[1.05]"
            style={{ fontFamily: "'Tilt Warp', sans-serif" }}
          >
            O futuro das empresas dependerá da<br/>
            <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">capacidade de interpretar complexidade.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto space-y-4 leading-relaxed"
          >
            <p className="text-xl text-foreground font-semibold">
              O Ecossistema Illumine conecta organizações, consultorias e especialistas a uma arquitetura integrada de inteligência estrutural empresarial, governança e direção estratégica.
            </p>
            <p className="text-base text-muted-foreground/80 pt-2">Empresas sustentáveis exigem mais do que serviços. Exigem clareza estrutural.</p>
            <p className="text-base text-muted-foreground/80">A Illumine está formando uma rede estratégica de parceiros comprometidos com maturidade organizacional, previsibilidade empresarial e inteligência decisional.</p>
            <p className="text-foreground font-medium">Mais do que indicações comerciais, buscamos organizações e profissionais capazes de ampliar a capacidade de interpretação estrutural das empresas.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de solicitar o meu Credenciamento Estratégico como parceiro')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Solicitar Credenciamento Estratégico</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('tese')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target size={16} />
              <span>Conhecer o Ecossistema Illumine</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. A TESE DO ECOSSISTEMA */}
      <section id="tese" className="py-32 px-6 bg-[#0a0a0a] text-white relative z-10 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              A TESE DO ECOSSISTEMA
            </h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              A nova geração de empresas exigirá mais do que informação.<br/>
              <span className="text-secondary">Exigirá inteligência estrutural.</span>
            </h3>
            <p className="text-lg text-white/70 font-medium leading-relaxed w-full lg:pr-8">
              O excesso de dados não resolveu a complexidade empresarial. Na maioria das organizações, o crescimento continua sendo pressionado por desafios silenciosos.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-6">O crescimento é pressionado por:</p>
              <ul className="grid sm:grid-cols-2 gap-4">
                {['baixa previsibilidade', 'decisões reativas', 'governança insuficiente', 'indicadores desconectados', 'expansão sem sustentação estrutural', 'pressão silenciosa sobre o capital de giro', 'ausência de interpretação integrada'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <TrendingUp size={18} className="text-white/40 shrink-0 mt-0.5" />
                    <span className="text-white/80 font-medium text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-6">Empresas maduras precisarão de:</p>
              <ul className="grid sm:grid-cols-2 gap-4">
                {['leitura estrutural', 'causalidade empresarial', 'inteligência decisional', 'governança integrada', 'clareza executiva'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck size={18} className="text-secondary shrink-0 mt-0.5" />
                    <span className="text-white font-medium text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xl text-white font-semibold leading-relaxed border-l-4 border-secondary pl-6">
              O Ecossistema Illumine foi concebido para ampliar essa capacidade dentro das organizações.
            </p>
          </div>
        </div>
      </section>

      {/* 3. O QUE É O ECOSSISTEMA ILLUMINE */}
      <section id="ecossistema" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Network size={14} className="text-secondary" />
              <span>O QUE É O ECOSSISTEMA ILLUMINE</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Mais do que um programa de parceiros.<br/>Uma arquitetura institucional de inteligência empresarial.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-foreground font-semibold">O Ecossistema Illumine integra:</p>
              <div className="flex flex-wrap gap-3">
                {['consultorias', 'escritórios contábeis', 'advisors', 'especialistas financeiros', 'profissionais de governança', 'organizações estratégicas', 'lideranças empresariais', 'parceiros institucionais'].map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-surface-container rounded-lg text-sm font-bold text-foreground border border-border shadow-sm">{item}</span>
                ))}
              </div>
            </div>

            <div className="p-10 bg-surface-container/50 border border-border/80 rounded-3xl shadow-xl">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Apoiamos empresas em:</p>
              <ul className="grid grid-cols-2 gap-y-4 gap-x-2">
                {['crescimento sustentável', 'profissionalização', 'governança', 'previsibilidade', 'maturidade operacional', 'inteligência estrutural'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-secondary shrink-0" />
                    <span className="text-sm font-semibold text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-lg text-foreground font-semibold leading-relaxed">
                  O parceiro Illumine não atua apenas comercialmente.<br/>Ele passa a integrar uma <span className="text-primary">infraestrutura estratégica de interpretação empresarial.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O NOVO CONCEITO DE PARCERIA */}
      <section className="py-32 px-6 bg-surface-container/30 border-y border-border/40 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl blur-xl opacity-50" />
            <div className="relative p-10 rounded-[2rem] bg-gradient-to-br from-background to-surface-container border border-primary/20 shadow-2xl backdrop-blur-xl">
              <ul className="space-y-4">
                {['interpretar riscos estruturais', 'apoiar decisões críticas', 'ampliar maturidade organizacional', 'fortalecer governança', 'estruturar previsibilidade', 'conectar empresas à inteligência integrada'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-background/40 p-4 rounded-xl border border-border/40 hover:border-secondary/40 transition-colors">
                    <Activity size={20} className="text-secondary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              O NOVO CONCEITO DE PARCERIA
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1]" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Parceiros não ampliam apenas vendas.<br/>Ampliam capacidade estratégica.
            </h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed w-full">
              O parceiro Illumine não é um revendedor de software. Ele participa ativamente de uma arquitetura projetada para a sustentabilidade.
            </p>
            <p className="text-xl text-foreground font-semibold leading-relaxed border-l-4 border-secondary pl-6">
              Isso transforma a parceria em uma extensão estratégica da própria arquitetura Illumine.
            </p>
          </div>
        </div>
      </section>

      {/* 5. O QUE O PARCEIRO ILLUMINE ACESSA */}
      <section id="infraestrutura" className="py-32 px-6 relative z-10 bg-[#050505] text-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center justify-center gap-2">
              <Layers size={14} className="text-secondary" />
              <span>O QUE O PARCEIRO ILLUMINE ACESSA</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Infraestrutura estratégica para leitura estrutural empresarial.
            </h3>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: BrainCircuit, title: 'Structural Intelligence Architecture', desc: 'Acesso à lógica interpretativa e à arquitetura conceitual da Illumine.' },
              { icon: BarChart3, title: 'Financial Intelligence Engine', desc: 'Modelos integrados de leitura financeira, sustentabilidade operacional e causalidade estrutural.' },
              { icon: ShieldCheck, title: 'Governance Intelligence', desc: 'Frameworks voltados para maturidade decisional, previsibilidade e governança empresarial.' },
              { icon: Users, title: 'Advisory Intelligence', desc: 'Estruturas executivas para interpretação estratégica e apoio a decisões críticas.' },
              { icon: Target, title: 'Executive Scoring', desc: 'Modelos de avaliação estrutural, maturidade organizacional e sustentabilidade empresarial.' },
              { icon: Activity, title: 'Stress & Risk Analysis', desc: 'Análises de pressão estrutural, sensibilidade operacional e capacidade de sustentação organizacional.' },
              { icon: LayoutDashboard, title: 'Plataforma de Inteligência Empresarial', desc: 'Infraestrutura tecnológica para diagnósticos, relatórios executivos, monitoramento estrutural e leitura integrada dos pilares empresariais.' }
            ].map((layer, idx) => (
              <motion.div 
                variants={fadeUp} key={idx} 
                className="p-8 rounded-card bg-white/5 border border-white/10 hover:shadow-2xl hover:shadow-secondary/10 hover:border-secondary/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-black/50 shadow-sm border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-secondary/50 transition-all">
                  <layer.icon size={20} className="text-secondary" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3 leading-snug">{layer.title}</h4>
                <p className="text-white/60 font-medium leading-relaxed text-sm">{layer.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6 & 7. COMO A ILLUMINE ENXERGA PARCERIAS / DIFERENCIAL */}
      <section className="py-32 px-6 relative z-10 border-b border-border/40">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="p-10 rounded-3xl bg-surface-container border border-border/60">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2 mb-6">
              <Handshake size={16} /> COMO ENXERGAMOS PARCERIAS
            </h2>
            <h3 className="text-3xl font-medium tracking-tight text-foreground mb-6" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Parcerias sustentáveis são construídas sobre alinhamento intelectual.
            </h3>
            <p className="text-base text-muted-foreground font-medium mb-6">Acreditamos que empresas saudáveis dependem de clareza, governança, inteligência integrada, visão de longo prazo e responsabilidade decisional.</p>
            <p className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">Parceiros comprometidos com:</p>
            <ul className="space-y-3">
              {['profundidade analítica', 'sustentabilidade organizacional', 'clareza estrutural', 'desenvolvimento consistente', 'inteligência empresarial aplicada'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-lg text-primary font-bold">Mais do que expansão comercial, buscamos expansão de capacidade estratégica.</p>
            </div>
          </div>

          <div className="p-10 rounded-3xl bg-surface-container border border-border/60">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2 mb-6">
              <Sparkles size={16} /> O DIFERENCIAL
            </h2>
            <h3 className="text-3xl font-medium tracking-tight text-foreground mb-6" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O diferencial não está apenas na tecnologia. Está na capacidade de interpretação estrutural.
            </h3>
            <p className="text-base text-muted-foreground font-medium mb-6">A Illumine não foi desenvolvida apenas para exibir indicadores. Foi arquitetada para:</p>
            <ul className="space-y-3">
              {['interpretar relações invisíveis', 'identificar causalidades empresariais', 'antecipar riscos estruturais', 'produzir clareza executiva', 'apoiar decisões críticas', 'fortalecer sustentabilidade organizacional'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-lg text-foreground font-bold">Os parceiros Illumine passam a integrar essa arquitetura de inteligência empresarial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PARA QUEM O ECOSSISTEMA EXISTE */}
      <section className="py-32 px-6 bg-surface-container/20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">PARA QUEM EXISTE</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Para profissionais e organizações que compreendem a complexidade empresarial moderna.
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {['consultorias empresariais', 'escritórios contábeis', 'advisors', 'especialistas financeiros', 'profissionais de governança', 'organizações estratégicas', 'parceiros institucionais', 'lideranças empresariais', 'ecossistemas corporativos'].map((item, i) => (
              <div key={i} className="p-4 bg-background border border-border rounded-xl shadow-sm font-semibold text-sm text-foreground/80 hover:border-secondary/30 transition-colors">
                {item}
              </div>
            ))}
          </div>

          <p className="text-lg text-foreground font-semibold">Buscamos parceiros alinhados com clareza estrutural, inteligência integrada, governança, maturidade operacional e sustentabilidade empresarial.</p>
        </div>
      </section>

      {/* 9. POSICIONAMENTO FILOSÓFICO & 10. CERTIFICAÇÃO */}
      <section className="py-32 px-6 bg-transparent relative z-10 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">POSICIONAMENTO FILOSÓFICO</h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            Tecnologia sem interpretação gera dependência.<br/>
            <span className="text-primary">Inteligência gera direção.</span>
          </h3>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed w-full">
            Acreditamos que sustentabilidade empresarial não é construída apenas com crescimento. É construída com clareza, causalidade, governança, previsibilidade, responsabilidade decisional, maturidade organizacional e inteligência estrutural.
          </p>
          <p className="text-xl text-foreground font-bold leading-relaxed w-full">
            A tecnologia da Illumine foi concebida como infraestrutura para sustentar essa leitura empresarial. Porque empresas saudáveis não dependem apenas de informação. Dependem da capacidade de interpretar a própria estrutura antes que os riscos se tornem visíveis demais.
          </p>

          <div className="mt-16 pt-16 border-t border-border/40 text-left grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2"><Medal size={16} /> CERTIFICAÇÃO E EVOLUÇÃO</h2>
              <h3 className="text-3xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Uma rede construída sobre maturidade estratégica.</h3>
              <p className="text-lg text-primary font-bold">Nosso objetivo não é apenas construir uma rede de parceiros. É consolidar um ecossistema orientado por inteligência empresarial e clareza estrutural.</p>
            </div>
            <div>
              <ul className="grid grid-cols-2 gap-3">
                {['frameworks proprietários', 'inteligência estrutural', 'metodologias executivas', 'arquitetura de governança', 'leitura integrada', 'desenvolvimento institucional', 'certificações estratégicas', 'expansão organizacional'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CTA FINAL */}
      <section className="py-32 px-6 bg-primary text-primary-foreground relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary rounded-full blur-[120px] opacity-20 -mr-[200px] -mt-[200px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-tight leading-[1.05]" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
            Clareza estrutural será um dos ativos mais valiosos das empresas nos próximos anos.
          </h3>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium max-w-2xl mx-auto">
            O Ecossistema Illumine existe para conectar organizações e profissionais comprometidos com inteligência estrutural, governança e direção estratégica.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleCTAClick('Gostaria de me tornar um Parceiro Estratégico Illumine')}
              className="w-full sm:w-auto h-16 px-10 rounded-xl bg-background text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-2xl"
            >
              <Briefcase size={20} className="text-secondary" />
              <span>Tornar-se Parceiro Estratégico Illumine</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-secondary" />
            </button>
          </div>
        </div>
      </section>

      {/* STICKY FLOATING CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de me certificar como Parceiro Estratégico Illumine')}
              className="flex items-center gap-3 px-6 h-14 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all"
            >
              <Briefcase size={18} className="text-secondary" />
              <span className="hidden sm:inline">Solicitar Credenciamento</span>
              <span className="sm:hidden">Aplicar</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
