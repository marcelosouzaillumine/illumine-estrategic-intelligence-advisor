import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  BarChart3, 
  BrainCircuit, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Database, 
  LineChart, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Users,
  LayoutDashboard,
  Network,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

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

export function PartnerSalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      a: 'A Illumine realiza uma análise aprofundada da estrutura financeira, operacional, organizacional e gerencial da empresa para identificar riscos, gargalos, oportunidades e prioridades estratégicas.'
    },
    {
      q: 'Qual é o nível de envolvimento esperado dos sócios e executivos?',
      a: 'O envolvimento da liderança é essencial para garantir alinhamento estratégico, clareza de direção e evolução consistente da gestão.'
    },
    {
      q: 'A Illumine executa as melhorias operacionais?',
      a: 'Além do acompanhamento recorrente, a Illumine também atua em projetos estratégicos complementares conforme a necessidade e complexidade de cada operação.'
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
      a: 'Durante a vigência do acompanhamento, a empresa possui acesso completo à estrutura estratégica Illumine. Em caso de encerramento contratual, a Illumine disponibiliza um relatório executivo consolidado com os principais indicadores e análises gerenciais.'
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/40 backdrop-blur-md bg-background/85 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <IllumineMark className="w-12 h-12" />
            </div>
            <div className="flex flex-col items-center select-none hidden sm:flex">
              <span className="text-4xl font-normal lowercase leading-none text-primary group-hover:text-primary/90 transition-colors" style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: '-0.04em' }}>
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[8px] text-secondary uppercase mt-0.5 whitespace-nowrap font-bold" 
                style={{ fontFamily: '"Work Sans", sans-serif' }}
              >
                {'Strategic Intelligence & Advisory'.split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('porque')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Direção</button>
            <button onClick={() => scrollToSection('ecossistema')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Ecossistema</button>
            <button onClick={() => scrollToSection('framework')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Framework</button>
            <button onClick={() => scrollToSection('modalidades')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Estruturas</button>
            <button onClick={() => scrollToSection('faq')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">FAQ</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-body-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hidden sm:block cursor-pointer"
            >
              Entrar
            </button>
            <button 
              onClick={() => handleCTA('Gostaria de agendar um diagnóstico estratégico')}
              className="h-10 px-5 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Diagnóstico Estratégico</span>
            </button>
          </div>
        </div>
      </nav>

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
            <span>Illumine Strategic Intelligence &amp; Advisory</span>
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
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-4xl mx-auto space-y-4 leading-relaxed"
          >
            <p>
              Inteligência estratégica, governança e advisory executivo para empresas que desejam crescer com clareza, estrutura e sustentabilidade.
            </p>
            <p className="text-base text-muted-foreground/80">
              A Illumine integra inteligência financeira, governança corporativa, indicadores estratégicos e acompanhamento executivo em um ecossistema contínuo de Strategic Intelligence &amp; Advisory.
            </p>
            <p className="text-base text-muted-foreground/80">
              Mais do que dashboards ou relatórios, oferecemos uma estrutura integrada de direção estratégica para líderes que precisam tomar decisões com maior segurança, organização e visão de longo prazo.
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
              <MessageSquare size={16} />
              <span>Agendar Diagnóstico Estratégico</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Direção Estratégica */}
      <section id="porque" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
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
              <p>O verdadeiro desafio está em:</p>
              <ul className="list-disc pl-6 space-y-1 text-base text-muted-foreground/80 font-normal">
                <li>interpretar cenários;</li>
                <li>identificar gargalos;</li>
                <li>integrar áreas;</li>
                <li>organizar prioridades;</li>
                <li>reduzir riscos;</li>
                <li>transformar informações em decisões consistentes.</li>
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
                  A tecnologia organiza informações.
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

      {/* O Ecossistema Illumine */}
      <section id="ecossistema" className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <Network size={16} className="text-secondary" />
              <span>O Ecossistema Illumine</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Uma estrutura integrada de governança, acompanhamento executivo e direção empresarial
            </h3>
            <div className="text-lg text-muted-foreground leading-relaxed font-medium space-y-3">
              <p>A Illumine foi criada para apoiar empresas em crescimento, profissionalização e expansão sustentável através de uma estrutura contínua de acompanhamento estratégico e fortalecimento da gestão.</p>
              <p>Nosso ecossistema combina:</p>
              <ul className="flex flex-wrap justify-center gap-2 pt-1 pb-1">
                {['governança corporativa', 'advisory estratégico', 'inteligência financeira', 'acompanhamento executivo', 'indicadores gerenciais', 'curadoria especializada', 'visão integrada da operação', 'suporte estratégico recorrente'].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-foreground border border-border">{item}</span>
                ))}
              </ul>
              <p>Tudo isso em um ambiente privado, seguro e continuamente acompanhado por especialistas.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LineChart, title: 'Indicadores Estratégicos Integrados', desc: 'Indicadores financeiros, operacionais e gerenciais organizados em uma central executiva para acompanhamento e tomada de decisão.' },
              { icon: BarChart3, title: 'Diagnósticos Executivos', desc: 'Análises aprofundadas que revelam riscos, gargalos, oportunidades e maturidade organizacional.' },
              { icon: Users, title: 'Advisory Estratégico Contínuo', desc: 'Acompanhamento recorrente com análise interpretativa, direcionamento estratégico e apoio à tomada de decisão.' },
              { icon: Building2, title: 'Governança Corporativa', desc: 'Estrutura orientada à profissionalização da gestão, transparência institucional e fortalecimento organizacional.' },
              { icon: Database, title: 'Gestão Orientada por Dados', desc: 'Integração entre métricas, monitoramento executivo e visão gerencial aplicada à realidade operacional.' },
              { icon: BrainCircuit, title: 'Curadoria Especializada', desc: 'A equipe Illumine acompanha, organiza e interpreta os indicadores de forma contínua, promovendo maior clareza gerencial e consistência analítica.' },
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

      {/* Como a Illumine Atua */}
      <section className="py-24 px-6 bg-surface-container/50 border-t border-border/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Como a Illumine Atua</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Uma estrutura contínua de acompanhamento estratégico e apoio executivo
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              A Illumine foi estruturada para apoiar empresas em diferentes níveis de maturidade, complexidade e necessidade estratégica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-card bg-card border border-border hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-primary mb-3">Diagnóstico Estratégico</h4>
              <p className="text-muted-foreground text-sm font-medium">Leitura aprofundada da realidade organizacional, financeira e operacional da empresa.</p>
            </div>
            <div className="p-8 rounded-card bg-card border border-border hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-primary mb-3">Acompanhamento Executivo</h4>
              <p className="text-muted-foreground text-sm font-medium">Estrutura recorrente de governança aplicada, direção estratégica e suporte à tomada de decisão.</p>
            </div>
            <div className="p-8 rounded-card bg-card border border-border hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-primary mb-3">Governance &amp; Advisory</h4>
              <p className="text-muted-foreground text-sm font-medium">Apoio executivo para empresas que demandam maior maturidade de gestão, organização estratégica e suporte recorrente à liderança.</p>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-[32px] grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h4 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Projetos Estratégicos Complementares</h4>
              <div className="space-y-4 text-primary-foreground/80 font-medium">
                <p>Além do acompanhamento recorrente, a Illumine também desenvolve projetos especializados de consultoria estratégica, governança e reorganização empresarial.</p>
                <p>As iniciativas são estruturadas conforme a necessidade, momento e complexidade de cada operação.</p>
              </div>
              <div className="pt-4 space-y-2">
                <h5 className="font-bold uppercase tracking-widest text-secondary text-xs">Estrutura dos Projetos</h5>
                <ul className="space-y-2 text-sm text-primary-foreground/90">
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary shrink-0" /> escopo individualizado</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary shrink-0" /> cronograma estruturado</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary shrink-0" /> acompanhamento executivo</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary shrink-0" /> entregáveis definidos</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-secondary shrink-0" /> alinhamento estratégico com a realidade da empresa</li>
                </ul>
              </div>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-widest text-secondary text-xs mb-4">Principais Frentes de Atuação</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs md:text-sm text-primary-foreground/90 font-medium">
                {['reestruturação financeira', 'planejamento estratégico', 'governança corporativa', 'estruturação gerencial', 'reorganização operacional', 'inteligência financeira', 'modelagem de indicadores', 'cultura organizacional', 'valuation', 'planejamento orçamentário', 'profissionalização da gestão'].map((frente, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    <span>{frente}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estruturas de Strategic Intelligence & Advisory */}
      <section id="modalidades" className="py-24 px-6 bg-surface-container">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Estruturas de Strategic Intelligence &amp; Advisory</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Estruturas desenvolvidas para empresas em diferentes níveis de operação, maturidade e complexidade estratégica.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Todos os modelos incluem: acesso completo à estrutura estratégica Illumine; acompanhamento executivo recorrente; curadoria contínua dos indicadores; visão gerencial integrada; advisory estratégico especializado; monitoramento orientado por dados.
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
                    <li className="flex items-center gap-1.5">• até 10 colaboradores;</li>
                    <li className="flex items-center gap-1.5">• faturamento de até R$ 150 mil/mês.</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'encontro executivo mensal;',
                    'estruturação dos indicadores essenciais;',
                    'curadoria estratégica das informações;',
                    'acompanhamento consultivo recorrente;',
                    'central executiva Illumine;',
                    'acompanhamento estratégico contínuo.'
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
                    <li className="flex items-center gap-1.5">• 10 a 40 colaboradores;</li>
                    <li className="flex items-center gap-1.5">• faturamento entre R$ 150 mil e R$ 1 milhão/mês.</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'dois encontros executivos mensais;',
                    'visão gerencial personalizada;',
                    'curadoria avançada de indicadores;',
                    'acompanhamento financeiro e operacional;',
                    'apoio à liderança e gestão;',
                    'advisory estratégico contínuo;',
                    'central executiva Illumine.'
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
                Agendar Diagnóstico Estratégico
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
                    <li className="flex items-center gap-1.5">• acima de 40 colaboradores;</li>
                    <li className="flex items-center gap-1.5">• faturamento acima de R$ 1 milhão/mês.</li>
                  </ul>
                </div>

                <div className="bg-surface-container/30 p-3.5 rounded-xl border border-border/30 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                  <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Sob consulta</span>
                </div>

                <div className="h-px bg-border/60" />
                
                <ul className="space-y-3.5">
                  {[
                    'encontros executivos semanais ou quinzenais;',
                    'advisory estratégico personalizado;',
                    'curadoria executiva contínua;',
                    'relatórios gerenciais integrados;',
                    'apoio à governança corporativa;',
                    'estruturação avançada de indicadores;',
                    'acompanhamento multidisciplinar;',
                    'central estratégica Illumine.'
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
                Solicitar Reunião Executiva
              </button>
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
              { title: 'Cultura Organizacional', desc: 'Valores, alinhamento interno e fortalecimento da identidade empresarial.' },
              { title: 'Gestão Financeira', desc: 'Gestão financeira aplicada à sustentabilidade, rentabilidade e crescimento estruturado.' },
              { title: 'Gestão de Inovação', desc: 'Capacidade de adaptação, melhoria contínua e desenvolvimento estratégico.' },
              { title: 'Gestão de Marketing', desc: 'Posicionamento, comunicação, percepção de valor e fortalecimento da autoridade.' },
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
              <div className="text-lg text-background/70 leading-relaxed font-medium space-y-3">
                <p>Acreditamos que organizações saudáveis são construídas quando governança, tecnologia, análise de dados, identidade organizacional e desenvolvimento humano operam em unidade.</p>
                <p>Empresas fortes nascem da integração entre:</p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {['estratégia', 'cultura', 'propósito', 'execução', 'clareza de direção'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-background/80 text-sm font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Governança', desc: 'Estruturas de liderança, responsabilidade institucional e direção estratégica.' },
                { title: 'Econômica', desc: 'Gestão financeira e análise econômica aplicadas à sustentabilidade do negócio.' },
                { title: 'Identidade', desc: 'Cultura, valores e princípios que sustentam a essência organizacional.' },
                { title: 'Sistêmica', desc: 'Integração entre dados, processos, tecnologia e operação.' },
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

      {/* Para quem a Illumine foi desenvolvida */}
      <section className="py-24 px-6 bg-surface-container/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Para quem a Illumine foi desenvolvida
            </h2>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              A Illumine foi estruturada para apoiar:
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'empresas em crescimento;',
              'operações em profissionalização;',
              'empresas familiares;',
              'organizações em reorganização financeira;',
              'negócios que cresceram sem gestão integrada;',
              'empresas que precisam transformar informações em direção estratégica;',
              'líderes que desejam maior clareza, organização e governança.'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-button bg-surface-container border border-border/80 hover:shadow-md hover:border-secondary/25 transition-all duration-300">
                <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                <span className="font-semibold text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-surface-container/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
              <HelpCircle size={16} className="text-secondary" />
              <span>Alinhamento Estratégico</span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-border/80 rounded-card bg-white overflow-hidden transition-all duration-300 shadow-xs hover:border-secondary/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-5 px-6 flex justify-between items-center text-left font-bold text-foreground hover:bg-surface-container/30 transition-colors cursor-pointer"
                >
                  <span className="text-base pr-4">{faq.q}</span>
                  <ChevronRight
                    size={18}
                    className={cn(
                      "text-muted-foreground shrink-0 transition-transform duration-300",
                      openFaq === idx && "transform rotate-90 text-secondary"
                    )}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 text-muted-foreground font-medium text-sm leading-relaxed border-t border-border/30 pt-4 bg-surface-container/5"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
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
            <p>Empresas sustentáveis não são construídas apenas com dados.</p>
            <p>São construídas com:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left max-w-lg mx-auto">
              {['clareza estratégica;', 'estrutura de gestão;', 'capacidade de decisão;', 'acompanhamento consistente;', 'direção executiva.'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-background/90 text-sm font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-background font-bold text-xl pt-4">
              A Illumine existe para apoiar líderes e organizações que desejam crescer com governança, organização e visão estratégica aplicada à realidade do negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Buttons */}
      <section className="py-20 px-6 bg-surface-container/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h4 className="text-2xl font-bold text-foreground animate-pulse" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Illumine Strategic Intelligence &amp; Advisory</h4>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-2xl mx-auto">
            Inteligência estratégica, governança e performance para empresas que desejam crescer com clareza, estrutura e sustentabilidade.
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

      {/* Footer */}
      <footer className="py-12 px-6 bg-foreground text-background border-t border-background/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center">
              <IllumineMark className="w-14 h-14" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[56px] font-normal lowercase leading-[0.85] text-primary block" style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: '-0.04em' }}>
                illumine
              </span>
              <div className="flex justify-between w-full text-[8.5px] text-background/60 uppercase mt-1 font-bold whitespace-nowrap" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                {'Strategic Intelligence & Advisory'.split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-background/80 font-medium max-w-sm ml-auto text-sm leading-relaxed">
              Inteligência estratégica, governança e performance para empresas que desejam crescer com clareza, estrutura e sustentabilidade.
            </p>
            <p className="text-background/40 text-xs mt-4">
              © {new Date().getFullYear()} Illumine. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
