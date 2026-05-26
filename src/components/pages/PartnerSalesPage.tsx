import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, BrainCircuit, Target, Activity, 
  Layers, Lock, AlertCircle, Briefcase, Network, CheckCircle2, 
  TrendingUp, BarChart3, Database, MessageSquare, Compass, Shield,
  MonitorSmartphone, Coins, Zap, BarChart, FileText, ArrowUpRight, UploadCloud, PieChart, Users,
  LayoutDashboard, Building2, Globe, Cpu, Server
} from 'lucide-react';

// Minimal Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Abstracted UI Mockup Component (Simulates a live Enterprise Dashboard - Bloomberg style)
const LiveDashboardMockup = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.12] overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full max-w-[1400px] flex gap-4 p-8">
        {/* Left Panel - Navigation / Modules */}
        <div className="w-64 h-full border-r border-secondary/20 flex flex-col gap-4 pt-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm border border-secondary/30 flex items-center justify-center">
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2 + i, repeat: Infinity }} className="w-2 h-2 bg-secondary/50 rounded-sm" />
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: i * 0.1 }}
                className="w-full h-6 bg-secondary/10 rounded-sm"
              />
            </div>
          ))}
        </div>
        {/* Center Canvas - Analytics & Grids */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Top Bar - KPIs */}
          <div className="flex gap-4 h-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 border border-secondary/20 rounded-md p-3 flex flex-col justify-between min-w-0">
                <div className="w-1/2 h-2 bg-secondary/20 rounded-sm" />
                <div className="w-3/4 h-4 bg-secondary/10 rounded-sm flex items-center overflow-hidden">
                   <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, delay: i*0.5, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full bg-secondary/20" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Chart Area */}
          <div className="h-48 w-full border border-secondary/20 rounded-lg flex items-end p-4 gap-1 relative overflow-hidden">
            <div className="absolute top-4 left-4 flex gap-2">
               <div className="w-16 h-3 bg-secondary/30 rounded-sm" />
               <div className="w-24 h-3 bg-secondary/10 rounded-sm" />
            </div>
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ['10%', '70%', '30%', '90%', '40%'][i % 5] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="flex-1 bg-secondary/20 rounded-t-sm min-w-0"
              />
            ))}
          </div>
          
          {/* Bottom Grid Data */}
          <div className="flex gap-4 flex-1 min-w-0">
            <div className="flex-[2] border border-secondary/20 rounded-lg p-4 flex flex-col gap-3">
               <div className="w-32 h-3 bg-secondary/20 rounded-sm mb-2" />
               {[1, 2, 3, 4].map(row => (
                 <div key={row} className="flex gap-2">
                   <div className="flex-1 h-4 bg-secondary/5 rounded-sm min-w-0" />
                   <div className="flex-1 h-4 bg-secondary/10 rounded-sm min-w-0" />
                   <div className="flex-[2] h-4 bg-secondary/5 rounded-sm" />
                   <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: row * 0.2, repeat: Infinity }} className="w-12 h-4 bg-secondary/20 rounded-sm" />
                 </div>
               ))}
            </div>
            <div className="flex-1 border border-secondary/20 rounded-lg relative overflow-hidden flex items-center justify-center min-w-0">
              {/* Radar or circular abstract */}
              <div className="w-32 h-32 rounded-full border border-secondary/20 flex items-center justify-center relative">
                 <div className="w-16 h-16 rounded-full border border-secondary/30 flex items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="w-4 h-4 rounded-full bg-secondary" />
                 </div>
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-2 border-secondary/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function PartnerSalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 600) setShowSticky(true);
      else setShowSticky(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = (message: string) => {
    window.open(`https://wa.me/554131514537?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Background Ambient Effects */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[140px] pointer-events-none z-0" />
      
      {/* Navbar Premium Blur */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-white/5 backdrop-blur-xl bg-[#030303]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-0 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="w-[52px] h-[52px] flex items-center justify-center relative -translate-y-1">
              <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-center w-fit">
              <span 
                className="text-[42px] tracking-[-0.06em] text-white leading-[0.8]" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[6px] text-secondary uppercase mt-[2px] whitespace-nowrap font-medium" 
                style={{ fontFamily: '"Work Sans", sans-serif' }}
              >
                {"Governance".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-lg">
            <button onClick={() => window.location.href = '/empresas'} className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors rounded-md break-words">
              Empresa
            </button>
            <button className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-black rounded-md shadow-sm pointer-events-none">
              Parceiro
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('icp')} className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors break-words">Ecossistema</button>
            <button onClick={() => scrollToSection('plataforma')} className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors break-words">Infraestrutura</button>
            <button onClick={() => scrollToSection('operacao')} className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors break-words">Operação</button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={onLoginClick} className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-secondary transition-colors cursor-pointer break-words">
              Área Restrita
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de agendar uma Demonstração da Plataforma Illumine')}
              className="h-10 px-6 rounded-md bg-secondary text-white font-bold text-[10px] uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(233,111,61,0.2)]"
            >
              <MonitorSmartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Solicitar Demo</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-32 px-6 relative overflow-hidden z-10 border-b border-white/5 min-h-[90vh] flex items-center">
        <LiveDashboardMockup />
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              <ShieldCheck size={14} className="opacity-80" /> Enterprise Intelligence Layer
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[76px] font-medium tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Infraestrutura Institucional de Inteligência para <span className="text-secondary">Parceiros Estratégicos.</span>
            </h1>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-lg md:text-xl text-white/70 font-medium max-w-3xl mx-auto space-y-6 leading-relaxed break-words">
            <p>
              Uma plataforma estratégica desenvolvida para operações consultivas que exigem profundidade analítica, governança e expansão operacional estruturada em cenários de alta complexidade.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => handleCTAClick('Gostaria de Solicitar uma Demonstração da Infraestrutura')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5"
            >
              <span>Agendar Demonstração</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollToSection('plataforma')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Activity size={16} />
              <span>Explorar Infraestrutura</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. ICP SECTION (Para Quem É) */}
      <section id="icp" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">ECOSSISTEMA DE ALTA PERFORMANCE</h2>
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Desenvolvido para operações consultivas de alta maturidade.
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              'Consultorias Empresariais', 'Escritórios de Contabilidade', 'Advisors Financeiros', 
              'Empresas de BPO Financeiro', 'Conselheiros', 'Family Offices', 'Holdings', 
              'Estruturas de Governança', 'Operações de Monitoramento Executivo'
            ].map((item, i) => (
              <span key={i} className="px-5 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-md text-sm text-white/80 font-medium hover:border-secondary/30 hover:text-white transition-colors cursor-default shadow-sm break-words">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. O PROBLEMA DO MERCADO (Sóbrio & Executivo) */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">
              BARREIRA OPERACIONAL
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Inteligência humana não escala sobre dados desconectados.
            </h3>
            <p className="text-lg text-white/70 font-medium leading-relaxed break-words">
              O volume operacional consome a capacidade analítica. Sem uma infraestrutura centralizada, o tempo executivo é despendido na estruturação de relatórios em vez da interpretação estratégica institucional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:pt-8">
            {[
              { title: 'Decisões Desconectadas', desc: 'Ausência de visão integrada entre os pilares operacionais e financeiros da organização.' },
              { title: 'Baixa Escalabilidade', desc: 'Dificuldade estrutural de ampliar a base de clientes mantendo a inteligência decisória contínua.' },
              { title: 'Excesso Operacional', desc: 'Consumo de recursos analíticos e executivos em tarefas mecânicas e extrações de dados.' },
              { title: 'Visão Reativa', desc: 'Atuação focada na leitura histórica em vez de causalidade preditiva e estrutural.' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                <h4 className="text-base font-bold text-white mb-2 break-words">{item.title}</h4>
                <p className="text-sm text-white/60 font-medium break-words">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. A PLATAFORMA E FEATURES (Strategic Operating System) */}
      <section id="plataforma" className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">STRATEGIC OPERATING SYSTEM</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Enterprise Intelligence Infrastructure
            </h3>
            <p className="text-lg text-white/70 font-medium leading-relaxed break-words">
              Uma camada tecnológica projetada para processar, correlacionar e traduzir o volume de informações em inteligência decisória contínua.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: 'Monitoramento Estratégico', desc: 'Acompanhamento executivo de KPIs vitais e estabilidade da performance organizacional.' },
              { icon: Network, title: 'Causalidade Financeira', desc: 'Integração analítica de causa e efeito entre eventos operacionais e resultados patrimoniais.' },
              { icon: Shield, title: 'Governance Engine', desc: 'Infraestrutura de acompanhamento da maturidade e estruturação de processos decisórios.' },
              { icon: Target, title: 'Valuation & Scoring', desc: 'Avaliação pragmática do valor e risco intrínseco associado à operação empresarial.' },
              { icon: Users, title: 'Organizational Dynamics', desc: 'Análise aprofundada de estrutura, eficiência da liderança e dinâmica relacional.' },
              { icon: LayoutDashboard, title: 'Executive Dashboards', desc: 'Visualizações de alto nível desenvolvidas para consumo imediato de inteligência.' }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-[#080808] border border-white/10 rounded-2xl relative overflow-hidden group">
                {/* Subtle pulse effect on hover to simulate "alive" state */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <item.icon className="text-secondary mb-6 relative z-10" size={24} />
                <h4 className="text-lg font-bold text-white mb-2 relative z-10 break-words">{item.title}</h4>
                <p className="text-sm text-white/60 font-medium leading-relaxed relative z-10 break-words">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA (A Arquitetura Operacional) */}
      <section id="operacao" className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">A ENGENHARIA DA PLATAFORMA</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Arquitetura Operacional
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Integração Contínua', desc: 'Importação segura e estruturada de bases financeiras e estruturais.' },
              { step: '02', title: 'Data Engine', desc: 'Processamento, validação lógica e arquitetura limpa dos dados.' },
              { step: '03', title: 'Intelligence Layer', desc: 'Correlação de métricas, valuation e identificação de causalidade analítica.' },
              { step: '04', title: 'Executive Advisory', desc: 'Entrega de valor suportada por dashboards institucionais precisos.' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col p-8 bg-[#0a0a0a] border border-white/10 rounded-xl relative">
                <div className="text-4xl font-black text-white/5 mb-4 break-words" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>{item.step}</div>
                <h4 className="text-base font-bold text-white mb-2 relative z-10 break-words">{item.title}</h4>
                <p className="text-sm text-white/50 relative z-10 break-words">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EXPANSÃO OPERACIONAL (Benefícios Sóbrios) */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">RESULTADOS ESTRATÉGICOS</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Expansão Operacional Estruturada
            </h3>
            <p className="text-lg text-white/70 font-medium break-words">
              A adoção de uma infraestrutura institucional permite que operações consultivas migrem de um modelo artesanal para uma atuação sustentada por inteligência de escala.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Aumento de Ticket Médio',
              'Estabilidade de Retenção',
              'Maturidade Consultiva Elevada',
              'Ampliação da Capacidade Estratégica',
              'Diferenciação Tecnológica',
              'Expansão de Capacidade Analítica',
              'Entrega Consultiva Institucional',
              'Governança Analítica Contínua'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-md">
                <CheckCircle2 size={16} className="text-secondary shrink-0" />
                <span className="text-white/90 font-medium text-sm break-words">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PROVA DE ROBUSTEZ (Maturidade Analítica) */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">CAPACIDADE ANALÍTICA</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Maturidade Institucional
            </h3>
            <p className="text-lg text-white/70 font-medium break-words">
              Uma engine arquitetada para produzir profundidade interpretativa e inteligência estrutural.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-8 border border-white/10 rounded-2xl bg-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Cpu size={80} /></div>
              <h4 className="text-xl font-bold text-white mb-2">Inteligência Preditiva de Tesouraria</h4>
              <p className="text-sm text-white/60 break-words">Acompanhamento ininterrupto das dinâmicas financeiras e antecipação sistêmica de pressões de liquidez.</p>
            </div>
            <div className="p-8 border border-white/10 rounded-2xl bg-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Network size={80} /></div>
              <h4 className="text-xl font-bold text-white mb-2">Causalidade Financeira Integrada</h4>
              <p className="text-sm text-white/60 break-words">Mapeamento matemático estruturado da propagação de riscos e do impacto operacional no resultado patrimonial.</p>
            </div>
            <div className="p-8 border border-white/10 rounded-2xl bg-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Server size={80} /></div>
              <h4 className="text-xl font-bold text-white mb-2">Estrutura Analítica Integrada</h4>
              <p className="text-sm text-white/60 break-words">Frameworks institucionais validados de governança que sustentam decisões executivas de alta severidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL (Silenciosamente Sofisticado) */}
      <section className="py-32 px-6 relative overflow-hidden z-10 bg-[#030303]">
        {/* Subtle grid background to maintain tech aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
            A sua estrutura operando sustentada por <span className="text-secondary">inteligência aplicada.</span>
          </h3>
          <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed break-words">
            Uma infraestrutura enterprise para operações que não entregam apenas relatórios, mas direção estratégica e clareza executiva estruturada.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleCTAClick('Gostaria de agendar uma Demonstração Estratégica da Plataforma Illumine')}
              className="w-full sm:w-auto h-16 px-10 rounded-md bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] break-words"
            >
              <span>Agendar Demonstração</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de falar com o time Institucional')}
              className="w-full sm:w-auto h-16 px-10 rounded-md bg-transparent border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 break-words"
            >
              <Briefcase size={20} />
              <span>Contato Institucional</span>
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
              onClick={() => handleCTAClick('Gostaria de agendar uma Demonstração')}
              className="flex items-center gap-3 px-6 h-14 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl hover:bg-white/90 transition-all"
            >
              <MonitorSmartphone size={18} />
              <span className="hidden sm:inline">Solicitar Demo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
