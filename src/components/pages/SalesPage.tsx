import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, BrainCircuit, Target, Activity, 
  Layers, AlertCircle, Briefcase, Network, CheckCircle2, 
  BarChart3, Database, Shield, MonitorSmartphone, ArrowRight,
  TrendingDown, Globe, Cpu, Server, Lock, Search, Eye, LayoutDashboard
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
    <div className="absolute inset-0 pointer-events-none opacity-[0.10] overflow-hidden flex items-center justify-center">
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
                 <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-2 border-secondary/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SalesPage({ onLoginClick }: { onLoginClick: () => void }) {
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
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[140px] pointer-events-none z-0" />
      
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
            <button className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-black rounded-md shadow-sm pointer-events-none">
              Empresa
            </button>
            <button onClick={() => window.location.href = '/parceiros'} className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors rounded-md break-words">
              Parceiro
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('problema')} className="text-[11px] font-semibold uppercase tracking-widest text-white/80 hover:text-white transition-colors break-words">O Risco</button>
            <button onClick={() => scrollToSection('plataforma')} className="text-[11px] font-semibold uppercase tracking-widest text-white/80 hover:text-white transition-colors break-words">Infraestrutura</button>
            <button onClick={() => scrollToSection('causalidade')} className="text-[11px] font-semibold uppercase tracking-widest text-white/80 hover:text-white transition-colors break-words">Causalidade</button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={onLoginClick} className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest text-white/80 hover:text-secondary transition-colors cursor-pointer break-words">
              Área Restrita
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de solicitar uma Apresentação Executiva da Infraestrutura Illumine')}
              className="h-10 px-6 rounded-md bg-secondary text-secondary-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(233,111,61,0.2)]"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apresentação Executiva</span>
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
              <Database size={14} className="opacity-80" /> Enterprise Intelligence Layer
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[76px] font-medium tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Infraestrutura Institucional de Inteligência Estratégica para <span className="text-secondary">Operações de Alta Complexidade.</span>
            </h1>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-lg md:text-xl text-white font-medium max-w-3xl mx-auto space-y-6 leading-relaxed break-words">
            <p>
              A Illumine Governance centraliza, correlaciona e estrutura o monitoramento contínuo da operação corporativa, reduzindo a assimetria informacional e estabelecendo previsibilidade decisória sobre riscos operacionais e liquidez.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => handleCTAClick('Gostaria de Solicitar uma Apresentação Executiva da Infraestrutura')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5"
            >
              <span>Solicitar Apresentação Executiva</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de Avaliar minha Estrutura Operacional')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Activity size={16} />
              <span>Avaliar Estrutura Operacional</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. O PROBLEMA DA COMPLEXIDADE */}
      <section id="problema" className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">
              O RISCO ESTRUTURAL
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Operações complexas colapsam quando a inteligência institucional não acompanha o crescimento.
            </h3>
            <p className="text-lg text-white font-medium leading-relaxed break-words">
              O crescimento desgovernado e a tomada de decisões fragmentadas ampliam a assimetria de informação. Sem uma infraestrutura centralizada de governança, o tempo de reação se torna tardio e a capacidade de antecipar pressões de liquidez é anulada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Eye, title: 'Assimetria Informacional', desc: 'Silos de dados que impedem a leitura integrada da real saúde da empresa.' },
              { icon: TrendingDown, title: 'Crescimento sem Governança', desc: 'Aumento de volume operacional que corrói margens e pressiona o capital de giro.' },
              { title: 'Reação Tardia', desc: 'Atuação baseada em métricas de passado (DREs isolados), anulando a previsibilidade.', icon: AlertCircle },
              { title: 'Desconexão Operacional', desc: 'Incapacidade de correlacionar eventos de rotina ao risco de sustentabilidade patrimonial.', icon: Network }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                <item.icon className="text-secondary mb-4" size={20} />
                <h4 className="text-base font-bold text-white mb-2 break-words">{item.title}</h4>
                <p className="text-sm text-white/90 font-medium leading-relaxed break-words">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. A INFRAESTRUTURA (Capabilities) */}
      <section id="plataforma" className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">INSTITUTIONAL INTELLIGENCE ARCHITECTURE</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Infrastructure Capabilities
            </h3>
            <p className="text-lg text-white font-medium leading-relaxed break-words">
              Illumine Governance é a engine contínua de governança corporativa, desenvolvida para processar o volume de dados e convertê-los em direcionamento estruturado de alto rigor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Governance Layer', desc: 'Acompanhamento da maturidade sistêmica e suporte contínuo para atuação de conselhos e diretoria.' },
              { icon: Target, title: 'Valuation Intelligence', desc: 'Monitoramento pragmático e ininterrupto da evolução do valor intrínseco da empresa.' },
              { icon: Activity, title: 'Predictive Operational Analysis', desc: 'Análise contínua das pressões de capital de giro exigidas pela operação corrente.' },
              { icon: LayoutDashboard, title: 'Executive Dashboards', desc: 'Telas executivas que reúnem liquidez, rentabilidade e risco para consumo rápido por C-Levels.' },
              { icon: Cpu, title: 'Strategic Scoring', desc: 'Índices proprietários que atestam a saúde, robustez e eficiência da máquina organizacional.' },
              { icon: Network, title: 'Causalidade Financeira', desc: 'Arquitetura matemática que liga a causa (fato gerador operacional) ao efeito (restrição de liquidez).' }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-[#080808] border border-white/10 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/0 via-secondary/0 to-secondary/0 group-hover:via-secondary/50 transition-all duration-700" />
                <item.icon className="text-secondary mb-6" size={24} />
                <h4 className="text-lg font-bold text-white mb-2 break-words">{item.title}</h4>
                <p className="text-sm text-white/90 font-medium leading-relaxed break-words">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. O QUE A PLATAFORMA MONITORA (Data Grid Analítico) */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">EXECUTIVE TRACKING</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              O que a infraestrutura monitora.
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Liquidez Estrutural', 'Sustentabilidade Operacional', 'Pressão Operacional', 'Fluxo de Caixa',
              'Governança Corporativa', 'Eficiência Operacional', 'Performance Estrutural', 'Maturidade Institucional',
              'Causalidade Financeira', 'Risco Sistêmico', 'Capacidade de Expansão', 'Estrutura Patrimonial'
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-xl group hover:border-secondary/30 transition-colors">
                <Search size={18} className="text-secondary mb-3 group-hover:text-secondary transition-colors" />
                <span className="text-sm font-bold text-white/90 break-words">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTELIGÊNCIA DE CAUSALIDADE */}
      <section id="causalidade" className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 lg:pr-12">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">CORE ANALYTICS ENGINE</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              A Matemática da Propagação de Risco.
            </h3>
            <p className="text-lg text-white font-medium break-words">
              A diferenciação estrutural da Illumine reside na engenharia analítica de Causalidade. A plataforma entende a correlação multidimensional entre departamentos: se uma meta de vendas é alterada hoje, mapeamos automaticamente o efeito sistêmico e a antecipação de pressão operacional sobre a liquidez de amanhã.
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl p-8 bg-[#030303] shadow-2xl relative overflow-hidden">
            {/* Visual representation of causality */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><Activity size={18} className="text-white/80 break-words" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-secondary font-bold uppercase tracking-widest">Causa Ocorrida</div>
                  <div className="text-sm text-white font-medium break-words">Expansão de Prazos de Recebimento Comercial</div>
                </div>
              </div>
              <div className="flex justify-center">
                <motion.div animate={{ opacity: [0.2, 1, 0.2], y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}><ArrowDown size={20} className="text-secondary" /></motion.div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><Network size={18} className="text-white/80 break-words" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-secondary font-bold uppercase tracking-widest">Propagação do Risco Sistêmico</div>
                  <div className="text-sm text-white font-medium break-words">Asfixia do Ciclo Financeiro & Elevação da Necessidade de Capital de Giro</div>
                </div>
              </div>
              <div className="flex justify-center">
                <motion.div animate={{ opacity: [0.2, 1, 0.2], y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}><ArrowDown size={20} className="text-secondary" /></motion.div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center"><AlertCircle size={18} className="text-secondary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-secondary font-bold uppercase tracking-widest">Impacto sobre Liquidez</div>
                  <div className="text-sm text-white font-medium break-words">Risco de Ruptura de Caixa detectado com antecedência estrutural.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RESULTADO ESTRATÉGICO */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">BUSINESS IMPACT</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Maturidade Operacional
            </h3>
            <p className="text-lg text-white font-medium break-words">
              O objetivo da infraestrutura Illumine não é relatar o passado. O objetivo é instaurar a governança necessária para reduzir o risco estrutural de decisões futuras.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Redução de Assimetria',
              'Clareza Executiva',
              'Previsibilidade',
              'Estabilidade Estrutural',
              'Governança Ativa',
              'Inteligência Decisória',
              'Capacidade de Antecipação',
              'Redução de Risco Estrutural'
            ].map((item, i) => (
              <div key={i} className="flex flex-col p-6 bg-[#0a0a0a] border border-white/10 rounded-xl">
                <CheckCircle2 size={18} className="text-secondary mb-3" />
                <span className="text-white/90 font-bold text-sm leading-snug break-words">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BLOCO FINAL */}
      <section className="py-32 px-6 relative overflow-hidden z-10 bg-[#080808]">
        {/* Subtle grid background to maintain tech aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
            Empresas maduras operam sobre <span className="text-secondary">inteligência institucional contínua.</span>
          </h3>
          <p className="text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed">
            Se a sua operação atingiu um nível de complexidade onde decisões intuitivas já não suportam o volume de risco, avalie a implementação da nossa architecture layer de governança.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleCTAClick('Gostaria de agendar uma Demonstração Institucional da Plataforma Illumine')}
              className="w-full sm:w-auto h-16 px-10 rounded-md bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] break-words"
            >
              <span>Agendar Demonstração Institucional</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de Avaliar a Maturidade Operacional da minha Empresa')}
              className="w-full sm:w-auto h-16 px-10 rounded-md bg-transparent border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 break-words"
            >
              <Shield size={20} />
              <span>Avaliar Maturidade Operacional</span>
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
              onClick={() => handleCTAClick('Gostaria de agendar uma Apresentação Executiva')}
              className="flex items-center gap-3 px-6 h-14 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl hover:bg-white/90 transition-all"
            >
              <Briefcase size={18} />
              <span className="hidden sm:inline">Apresentação Executiva</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

// Temporary icon for internal component
const ArrowDown = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);
