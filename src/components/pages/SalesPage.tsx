import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, BrainCircuit, Target, Activity, 
  Layers, AlertCircle, Briefcase, Network, CheckCircle2, 
  BarChart3, Database, Shield, MonitorSmartphone, ArrowRight,
  TrendingDown, Globe, Cpu, Server, Lock, Search, Eye, LayoutDashboard,
  Compass, ChevronRight
} from 'lucide-react';

// Quiet, Editorial Causal Topology Watermark (Static & Extremely Understated)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 150, y: 130, label: 'Decisão de Expansão' },
    { id: 2, x: 420, y: 170, label: 'Pressão Operacional' },
    { id: 3, x: 280, y: 290, label: 'Necessidade de Capital de Giro' },
    { id: 4, x: 580, y: 230, label: 'Deterioração de Margem' },
    { id: 5, x: 740, y: 140, label: 'Risco Fiduciário' },
    { id: 6, x: 480, y: 370, label: 'Estrutura de Liquidez' },
    { id: 7, x: 720, y: 340, label: 'Proteção Patrimonial' }
  ];

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 6 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
    { from: 4, to: 6 },
    { from: 2, to: 3 },
    { from: 5, to: 7 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full max-w-[1200px] max-h-[600px] text-white" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection Lines (Ultra Thin & Subdued) */}
        {links.map((link, i) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          return (
            <line 
              key={i}
              x1={fromNode.x} 
              y1={fromNode.y} 
              x2={toNode.x} 
              y2={toNode.y} 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeWidth="0.75"
            />
          );
        })}

        {/* Static Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="2"
              fill="#FFFFFF"
            />
            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.55)"
              fontSize="8"
              letterSpacing="0.08em"
              className="font-sans font-medium uppercase select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export function SalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [showSticky, setShowSticky] = useState(false);
  const navigate = useNavigate();

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
    <main className="min-h-screen bg-[#03080F] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Background Ambient Effects (Sovereign/Private Banking Sophistication) */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-secondary/2 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/1 blur-[180px] pointer-events-none z-0" />
      
      {/* Navbar Premium - Simplified, Minimal Visual Noise */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-white/5 backdrop-blur-xl bg-[#03080F]/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between gap-8">
          
          {/* Logo Signature (Continuous Official Identity) */}
          <div className="flex items-center gap-0 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="w-[48px] h-[48px] flex items-center justify-center relative -translate-y-[2px]">
              <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start w-fit">
              <span 
                className="text-[38px] tracking-[-0.06em] text-white leading-[0.8] block" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[7px] text-white uppercase mt-[2px] whitespace-nowrap font-medium" 
                style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '2px', paddingRight: '0.5px' }}
              >
                {"Governance".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Executive Navigation List */}
          <div className="hidden lg:flex items-center gap-12">
            <button 
              onClick={() => scrollToSection('problema')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O Risco
            </button>
            <button 
              onClick={() => scrollToSection('deterioracao')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Deterioração
            </button>
            <button 
              onClick={() => scrollToSection('decisoes')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Decisões
            </button>
            <button 
              onClick={() => scrollToSection('metodologia')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Inteligência
            </button>
            <button 
              onClick={() => scrollToSection('plataforma')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Arquitetura
            </button>
            <button 
              onClick={() => navigate('/parceiros')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
            >
              Parceiros
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={onLoginClick} 
              className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-secondary transition-colors cursor-pointer"
            >
              Área Restrita
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de agendar uma conversa com os especialistas da Illumine.')}
              className="h-10 px-5 rounded-md border border-white/20 hover:border-white text-white font-bold text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Conversar com Especialistas</span>
            </button>
          </div>

        </div>
      </nav>
       {/* 1. HERO SECTION (High Executive Gravity & Tension) */}
      <section id="hero" className="pt-48 pb-36 px-6 relative overflow-hidden z-10 border-b border-white/5 min-h-[92vh] flex items-center">
        <CausalTopologyVisual />
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[9px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              INTELIGÊNCIA INSTITUCIONAL & GOVERNANÇA EXECUTIVA
            </span>

            <p className="text-secondary text-xs sm:text-sm font-semibold tracking-widest uppercase max-w-2xl mx-auto leading-relaxed mt-2 select-none">
              Muitas empresas crescem em faturamento enquanto perdem capacidade de sustentação.
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-[1.15] pt-2">
              Clareza executiva para organizações que já não podem depender apenas de relatórios operacionais.
            </h1>
            
            <p className="text-lg md:text-xl text-secondary font-medium tracking-tight max-w-3xl mx-auto font-sans leading-relaxed">
              A Illumine ajuda empresas complexas a crescerem com mais clareza, coerência e segurança institucional.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed font-sans"
          >
            Oferecemos uma infraestrutura proprietária de inteligência executiva e sustentação estratégica projetada para apoiar fundadores, conselhos e sócios a direcionarem a expansão, reduzirem riscos invisíveis e fortalecerem a continuidade dos negócios.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de iniciar o Diagnóstico Executivo da minha organização.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              <span>Iniciar Diagnóstico Executivo</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de agendar uma Avaliação Institucional da minha empresa.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Solicitar Avaliação Institucional</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. O PROBLEMA (ERP vs BI vs Illumine) */}
      <section id="problema" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-6xl mx-auto space-y-24">
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">
                O RISCO DA ASSIMETRIA
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                O crescimento desacompanhado de clareza estratégica é o maior risco de uma organização.
              </h2>
            </div>
            <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <p>
                À medida que a complexidade da empresa evolui, os desafios operacionais se multiplicam de forma exponencial. O verdadeiro risco não reside na falta de relatórios ou indicadores, mas sim no surgimento de fragilidades estruturais invisíveis que se desenvolvem silenciosamente nos bastidores.
              </p>
              <p className="text-white/80 font-medium border-l border-secondary/30 pl-4 mt-4">
                A infraestrutura de clareza executiva da Illumine ajuda empresas a identificarem desvios estruturais antes que eles comprometam a continuidade, a liquidez e o caixa do negócio.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="p-8 rounded-xl bg-[#060D17] border border-white/5 space-y-4">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest">Sistemas de Registro</div>
              <h3 className="text-xl font-display font-semibold text-white">ERPs</h3>
              <p className="text-sm text-white/60 leading-relaxed font-sans">
                Registram e organizam transações operacionais passadas. São cruciais para a contabilidade e o compliance histórico da rotina corporativa.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#060D17] border border-white/5 space-y-4">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest">Sistemas de Visualização</div>
              <h3 className="text-xl font-display font-semibold text-white">BI & Dashboards</h3>
              <p className="text-sm text-white/60 leading-relaxed font-sans">
                Agrupam indicadores setoriais isolados em telas de visualização passiva. Dependem de interpretação externa para gerar valor decisório.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#060D17]/85 border border-secondary/20 space-y-4 relative shadow-[0_0_25px_rgba(255,133,82,0.02)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-2 py-0.5 rounded bg-secondary text-[8px] font-bold text-black uppercase tracking-widest">
                Resiliência e Crescimento
              </div>
              <div className="text-secondary text-xs font-bold uppercase tracking-widest">Infraestrutura Executiva</div>
              <h3 className="text-xl font-display font-semibold text-white">Illumine Governance</h3>
              <p className="text-sm text-white/80 leading-relaxed font-sans">
                A Illumine Governance ajuda empresas a identificarem fragilidades estruturais antes que elas comprometam caixa, crescimento e continuidade.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXECUTIVE RISK AWARENESS BLOCK (Tension, Urgency & Hidden Fragilities) */}
      <section id="deterioracao" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              RISCO INSTITUCIONAL & PREVISIBILIDADE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              O que normalmente destrói empresas não aparece primeiro no caixa.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center pt-8">
            <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <p>
                Sua empresa está crescendo com maturidade proporcional ou apenas aumentando complexidade operacional? Muitas organizações continuam crescendo em faturamento e volume físico enquanto sua coerência decisória e capacidade real de sustentação se deterioram de forma invisível.
              </p>
              <p className="text-white/90 font-medium border-l-2 border-secondary pl-4 py-1">
                Quando a deterioração finalmente se reflete no caixa ou no balanço, parte crucial da sua margem de manobra e capacidade de reação estratégica já foi consumida.
              </p>
              <p>
                A Illumine atua como uma camada de inteligência e sustentação, identificando desvios estruturais e riscos ocultos para que sua empresa cresça de forma saudável e estruturada.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#060D17] border border-white/5 space-y-6">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">A deterioração silenciosa começa:</div>
              <ul className="space-y-4 font-sans text-sm text-white/85">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>Na perda gradual da coerência decisória sob pressão;</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>Na dependência invisível de pessoas-chave ou prazos críticos;</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>Na desconexão entre o ritmo da expansão e a estrutura de capital;</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>No crescimento de faturamento que camufla a perda de margem real;</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>Na incapacidade de antecipar riscos de governança e societários.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DECISION INTELLIGENCE BLOCK (Strategic Support) */}
      <section id="decisoes" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
            ESTABILIDADE CONTINUADA & ESTRUTURA DE DECISÃO
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            Decisões críticas não falham por ausência de dados. Falham por ausência de leitura integrada.
          </h2>
          <div className="max-w-3xl mx-auto space-y-8 text-left bg-[#060D17] border border-white/5 rounded-2xl p-8 md:p-12 mt-12 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-secondary/50" />
            <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed font-sans">
              Muitas organizações continuam crescendo enquanto sua capacidade de sustentação se deteriora de forma invisível. A fragilidade decisória que expõe a empresa ao risco reside:
            </p>
            <ul className="space-y-4 text-base text-white/70 font-sans pl-2">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                <span>No desalinhamento decisório entre sócios, conselhos e a diretoria executiva;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                <span>Na falta de clareza sobre o limite de endividamento e a estrutura de liquidez necessária;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                <span>Na incapacidade de ler de forma integrada as variáveis financeiras, operacionais e fiduciárias;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                <span>Na tomada de decisões cruciais baseadas em intuição, feeling ou dados passados fragmentados.</span>
              </li>
            </ul>
            <p className="text-lg text-white font-medium pt-4 border-t border-white/5 font-sans">
              A Illumine fornece uma camada de inteligência que assegura a coerência decisória. Ajudamos a fortalecer a sustentabilidade estrutural do negócio, conectando a estratégia de crescimento com a realidade patrimonial.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHAT ILLUMINE IS (Structure of Intelligence) */}
      <section id="metodologia" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
                INFRAESTRUTURA EXECUTIVA
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                Uma camada necessária de governança para sustentar o crescimento organizacional.
              </h2>
            </div>
            <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <p>
                A Illumine não é uma consultoria corporativa convencional nem um software de BI. Nós estruturamos e operamos uma infraestrutura de inteligência de governança e sustentação estratégica que assegura a coerência e a sustentação das decisões mais importantes da empresa.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Infraestrutura de Governança', 
                desc: 'Suporte decisório continuado e alinhamento estratégico para conselhos de administração, fundadores, sócios e comitês executivos.' 
              },
              { 
                icon: BrainCircuit, 
                title: 'Continuidade e Mitigação de Riscos', 
                desc: 'Mapeamento sistemático de dependências e fragilidades estruturais, preservando a estabilidade e a continuidade contra desvios operacionais e societários.' 
              },
              { 
                icon: Target, 
                title: 'Clareza Executiva Continuada', 
                desc: 'Tradução contínua de relatórios fragmentados e ruído operacional em clareza executiva, mantendo a consistência do direcionamento estratégico.' 
              }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-[#060D17] border border-white/5 rounded-xl space-y-6">
                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                  <item.icon className="text-secondary" size={20} />
                </div>
                <h3 className="text-lg font-display font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE GOVERNANCE ENGINE (The Interpretation Architecture) */}
      <section id="plataforma" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              INFRAESTRUTURA DE SUSTENTAÇÃO
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              Governance: a infraestrutura de estabilidade e sustentabilidade da sua empresa.
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
              Uma camada proprietária de inteligência e segurança executiva que consolida variáveis operacionais, financeiras e societárias sob um único mecanismo de preservação da continuidade.
            </p>
          </div>

          <div className="bg-[#060D17] border border-white/5 rounded-2xl p-8 max-w-3xl mx-auto text-center space-y-3 mb-10">
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest">
              Inteligência Executiva e Resiliência de Ativos
            </p>
            <p className="text-base text-white/90 leading-relaxed font-sans max-w-2xl mx-auto">
              A Governance ajuda empresas a identificarem riscos invisíveis que normalmente só aparecem quando a liquidez já começou a deteriorar.
            </p>
          </div>

          {/* Engine Capabilities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {[
              {
                icon: Activity,
                title: 'Deteriorações Estruturais',
                desc: 'Mapeia desvios de eficiência operacional e perda de margem antes que eles comprometam o caixa e a tesouraria corporativa.'
              },
              {
                icon: Network,
                title: 'Dependências Invisíveis',
                desc: 'Identifica a sensibilidade e o risco associados a prazos de recebimento, fornecedores exclusivos ou concentração de clientes.'
              },
              {
                icon: Shield,
                title: 'Consistência Decisória',
                desc: 'Garante a coerência de decisões complexas entre conselhos, sócios e diretoria em cenários de alta pressão e expansão.'
              },
              {
                icon: Database,
                title: 'Leitura Longitudinal',
                desc: 'Mapeia tendências estruturais ao longo de múltiplos ciclos de mercado, isolando riscos permanentes de flutuações temporárias.'
              }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#060D17] border border-white/5 rounded-xl space-y-6 hover:border-white/10 transition-colors">
                <item.icon className="text-secondary" size={24} strokeWidth={1.5} />
                <h4 className="text-base font-display font-bold text-white break-words">{item.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. WHO IT IS FOR (Target Audiences) */}
      <section id="segmentos" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              ESTABILIDADE E CONTINUIDADE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              Desenvolvido para sustentar a continuidade de organizações complexas.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                segment: 'Grupos Empresariais & Holdings',
                desc: 'Fortalecimento e alinhamento decisório entre múltiplas unidades de negócios, eliminando pontos cegos informacionais entre sócios e conselhos.'
              },
              {
                segment: 'Empresas Familiares',
                desc: 'Preservação do patrimônio familiar, transição societária estruturada e mitigação de riscos relacionais na liderança executiva.'
              },
              {
                segment: 'Hospitais & Redes de Saúde',
                desc: 'Preservação do fluxo de caixa e gestão de capital de giro sob alta pressão operacional e exigências regulatórias complexas.'
              },
              {
                segment: 'Indústrias & Operações Industriais',
                desc: 'Mitigação de riscos em cadeias produtivas longas, estabilidade do fluxo de caixa operacional e resiliência diante de oscilações de insumos.'
              },
              {
                segment: 'Holdings de Participações & Boards',
                desc: 'Estrutura para alinhamento e monitoramento pragmático de riscos estratégicos no portfólio de empresas coligadas.'
              },
              {
                segment: 'Empresas sob Reestruturação',
                desc: 'Diagnóstico preciso de desvios operacionais e societários para resgatar a liquidez e a estabilidade estrutural do negócio.'
              }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-[#060D17] border border-white/5 rounded-xl hover:border-secondary/20 transition-all duration-300 space-y-4">
                <h3 className="text-lg font-display font-semibold text-white">{item.segment}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. EXECUTIVE PHILOSOPHY (Manifesto Worldview) */}
      <section className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
            MATURIDADE E RESILIÊNCIA
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            Governança executiva como ativo de estabilidade empresarial.
          </h2>
          <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            <p>
              A verdadeira maturidade de um negócio não reside na criação de relatórios densos ou processos burocráticos. Ela se traduz em disciplina executiva, consistência do fluxo de caixa e preservação antecipada da sustentabilidade institucional da empresa.
            </p>
            <p>
              Empresas são estruturas interdependentes. Quando crescem sem a devida maturidade de governança, geram pontos cegos e riscos societários ou operacionais silenciosos. A Illumine fornece a inteligência e a estabilidade necessárias para assegurar a continuidade das decisões críticas e preservar a estabilidade operacional do negócio.
            </p>
          </div>
        </div>
      </section>

      {/* 9. PREMIUM CTA (Executive Closing Section) */}
      <section className="py-36 px-6 relative overflow-hidden z-10 bg-[#03080F]">
        {/* Understated geometric design texture instead of tech meshes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.01] via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
            ESTABILIDADE E CONTINUIDADE
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.1]">
            Sua empresa está crescendo com clareza suficiente para sustentar o próximo ciclo?
          </h2>
          
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
            Se a sua organização atingiu um patamar de complexidade onde decisões intuitivas e dados fragmentados trazem riscos para a continuidade da operação ou da sociedade, traga a clareza e a sustentação da governança Illumine para a sua empresa.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => handleCTAClick('Gostaria de agendar uma Avaliação Institucional para minha organização.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>Solicitar Avaliação Institucional</span>
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de iniciar o Diagnóstico Executivo da minha empresa.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Iniciar Diagnóstico Executivo</span>
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de conversar com os especialistas de Governança da Illumine.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-transparent border border-white/20 text-white/85 font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Conversar com Especialistas</span>
            </button>
          </div>
        </div>
      </section>

      {/* STICKY FLOATING CTA (Highly Restrained, Minimal Layout) */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de solicitar uma Avaliação Institucional.')}
              className="flex items-center gap-3 px-6 h-14 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-full shadow-2xl hover:bg-white/90 transition-all cursor-pointer"
            >
              <Briefcase size={14} />
              <span>Avaliação Institucional</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Minimalist */}
      <footer className="py-12 border-t border-white/5 bg-[#02050A] text-white/40 text-[10px] tracking-wider uppercase font-semibold">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-white/80 text-sm tracking-tight" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>illumine</span>
            <span className="text-[8px] text-white/30">|</span>
            <span>© 2026 Illumine. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">Voltar ao topo</button>
            <button onClick={() => navigate('/parceiros')} className="hover:text-white transition-colors">Portal de Parceiros</button>
            <button onClick={onLoginClick} className="hover:text-white transition-colors">Acesso Restrito</button>
          </div>
        </div>
      </footer>

    </main>
  );
}

// Temporary icon
const ArrowDown = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);
