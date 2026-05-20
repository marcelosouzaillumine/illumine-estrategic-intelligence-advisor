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
            Estrutura executiva de inteligência empresarial para parceiros que desejam ampliar <span className="bg-gradient-to-r from-secondary to-[#E96F3D] bg-clip-text text-transparent">valor, recorrência e capacidade consultiva</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-4xl mx-auto space-y-4 leading-relaxed"
          >
            <p>
              A Illumine oferece uma estrutura integrada de Strategic Intelligence & Advisory para escritórios, consultorias, assessorias financeiras, operações de BPO, advisors independentes e parceiros que desejam evoluir além da execução operacional.
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
              onClick={handleConsultantClick}
              className="w-full sm:w-auto h-14 px-8 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-container/80 hover:border-muted-foreground/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase size={16} />
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
      <section id="modalidades" className="py-24 px-6 bg-surface-container/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Estruturas de Strategic Intelligence & Advisory</h2>
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
                  onClick={handleConsultantClick}
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
                  onClick={handleConsultantClick}
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
                  onClick={handleConsultantClick}
                  className="w-full h-12 rounded-button bg-surface-container border border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors mt-8"
                >
                  Agendar Reunião Estratégica
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crescimento sustentável exige inteligência aplicada */}
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
                  <h4 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>Illumine Strategic Intelligence &amp; Advisory</h4>
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
                    onClick={handleConsultantClick}
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
