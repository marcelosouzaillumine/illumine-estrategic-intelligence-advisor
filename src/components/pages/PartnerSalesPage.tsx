import React, { useEffect } from 'react';
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
  Lock, 
  MessageSquare, 
  PieChart, 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  BookOpen,
  LayoutDashboard,
  Compass,
  Network,
  Briefcase
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConsultantClick = () => {
    window.open('https://wa.me/554131514537?text=Gostaria%20de%20falar%20com%20um%20consultor%20Illumine%20sobre%20parceria', '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
            <button onClick={() => scrollToSection('perfil')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Objetivo</button>
            <button onClick={() => scrollToSection('mercado')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Mercado</button>
            <button onClick={() => scrollToSection('framework-parceiro')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Framework</button>
            <button onClick={() => scrollToSection('ecossistema-parceiro')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Ecossistema</button>
            <button onClick={() => scrollToSection('modalidades')} className="text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Modalidades</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-body-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hidden sm:block cursor-pointer"
            >
              Entrar
            </button>
            <button 
              onClick={handleConsultantClick}
              className="h-10 px-5 rounded-button bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Seja Parceiro</span>
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
            Estrutura estratégica de <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">inteligência empresarial</span> para parceiros que desejam ampliar valor, recorrência e capacidade consultiva.
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
              onClick={() => scrollToSection('perfil')}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Conhecer a Parceria</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleConsultantClick}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/85 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Falar com um Advisor</span>
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

      {/* Cenário de Mercado */}
      <section id="mercado" className="py-24 px-6 bg-surface-container/30 border-y border-border/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <div className="w-8 h-px bg-secondary" />
              Cenário de Mercado
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
              O mercado mudou. Empresas não buscam apenas execução operacional.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Clientes demandam inteligência aplicada, direção clara, governança, acompanhamento contínuo e indicadores organizados que facilitem a tomada de decisão.
            </p>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-card blur-lg opacity-35" />
            <div className="relative grid gap-6">
              <div className="p-8 rounded-card bg-white border border-border/80 shadow-md space-y-4 hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-lg text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  O Gargalo da Escala Consultiva
                </h4>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Grande parte dos consultores e profissionais de advisory enfrenta dificuldade para escalar sua operação devido ao tempo gasto na consolidação manual de informações, planilhas descentralizadas e falta de um ambiente unificado de inteligência.
                </p>
              </div>
              <div className="p-8 rounded-card bg-white border border-border/80 shadow-md space-y-4 hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-lg text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  A Solução Illumine
                </h4>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Centralize a governança, a gestão de dados, a análise financeira e o acompanhamento estratégico de seus clientes em um único ambiente integrado. A Illumine fornece a infraestrutura que você precisa para elevar o nível da sua entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ampliação Consultiva (Infraestrutura Estratégica) */}
      <section id="objetivo" className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">Infraestrutura Estratégica</h2>
              <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
                Uma infraestrutura desenvolvida para ampliação consultiva
              </h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              A parceria estratégica foi estruturada para que você possa atuar diretamente como um Advisor Estratégico do seu cliente, apoiado por uma plataforma de inteligência de dados, diagnóstico contínuo e governança empresarial.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Ao invés de despender dezenas de horas estruturando relatórios manuais, foque seu tempo no que realmente gera valor: o aconselhamento estratégico e a condução de negócios de alto crescimento.
            </p>
          </div>
          <div className="space-y-6">
            <div className="grid gap-6">
              {[
                { title: 'Ampliação de Valor Percebido', desc: 'Apresente sua consultoria com painéis de alta tecnologia, segurança de dados e relatórios corporativos consolidados.' },
                { title: 'Retenção e Recorrência', desc: 'Transforme projetos pontuais de consultoria em contratos recorrentes de governança, advisory e acompanhamento estratégico contínuo.' },
                { title: 'Escalabilidade Estratégica', desc: 'Acompanhe múltiplos clientes com organização, centralização e visão integrada.' },
                { title: 'Estruturação de Advisory', desc: 'Crie um modelo recorrente de acompanhamento empresarial orientado por indicadores e inteligência executiva.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-card bg-white border border-border/80 shadow-xs hover:border-secondary/20 transition-all duration-300">
                  <CheckCircle2 size={18} className="text-secondary shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-foreground text-sm uppercase tracking-wider">{item.title}</h5>
                    <p className="text-muted-foreground text-sm font-medium mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Estrutura Integrada (Ecossistema) */}
      <section id="ecossistema-parceiro" className="py-24 px-6 bg-background relative overflow-hidden">
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


      {/* Modelos de Parceria */}
      <section id="modalidades" className="py-24 px-6 bg-surface-container">
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
                onClick={handleConsultantClick}
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
                onClick={handleConsultantClick}
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
                onClick={handleConsultantClick}
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
              Inteligência estratégica, governança e performance para empresas e parceiros que desejam crescer com clareza, estrutura e sustentabilidade.
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
