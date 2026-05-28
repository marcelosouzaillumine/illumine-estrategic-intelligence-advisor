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
      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-24 px-6 relative overflow-hidden z-10 border-b border-white/5 min-h-[85vh] flex items-center">
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
              INFRAESTRUTURA DE GOVERNANÇA EXECUTIVA
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-[1.15] pt-2">
              Clareza executiva para organizações que já não podem depender apenas de relatórios operacionais.
            </h1>
            
            <p className="text-lg md:text-xl text-secondary font-medium tracking-tight max-w-3xl mx-auto font-sans leading-relaxed">
              Muitas empresas crescem em faturamento enquanto perdem capacidade de sustentação.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de iniciar o Diagnóstico Executivo da minha organização.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              <span>Diagnóstico Executivo</span>
              <ArrowRight size={14} />
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. THE TENSION */}
      <section id="problema" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            O que normalmente destrói empresas não aparece primeiro no caixa.
          </h2>
          <div className="w-px h-16 bg-secondary/50 mx-auto" />
          <p className="text-lg md:text-xl text-white/70 leading-relaxed font-sans max-w-3xl mx-auto">
            O verdadeiro risco surge quando a complexidade da empresa ultrapassa sua capacidade de leitura executiva. A deterioração começa silenciosamente na perda de coerência decisória e na desconexão entre operação e estratégia.
          </p>
        </div>
      </section>

      {/* 3. DECISION INTELLIGENCE */}
      <section id="decisoes" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                Decisões críticas não falham por ausência de dados. Falham por ausência de leitura integrada.
              </h2>
            </div>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed font-sans">
              <p>
                Sistemas tradicionais registram transações históricas ou exibem indicadores isolados. Eles não evitam o desalinhamento entre sócios, conselho e diretoria.
              </p>
              <p className="text-white/90 font-medium border-l border-secondary/30 pl-4 mt-4">
                A Illumine atua como uma infraestrutura de inteligência para sustentar decisões críticas, antecipar fragilidades estruturais e proteger o próximo ciclo do negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ILLUMINE GOVERNANCE - COMPRESSED */}
      <section id="plataforma" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              ILLUMINE GOVERNANCE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              A infraestrutura de estabilidade da sua empresa.
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
              Uma camada executiva que revela riscos invisíveis antes que eles comprometam:
            </p>
          </div>

          <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-secondary/90 font-medium uppercase tracking-widest max-w-3xl mx-auto">
            <li>Caixa</li>
            <li className="text-white/20 text-xs">•</li>
            <li>Liquidez</li>
            <li className="text-white/20 text-xs">•</li>
            <li>Margem</li>
            <li className="text-white/20 text-xs">•</li>
            <li>Expansão</li>
            <li className="text-white/20 text-xs">•</li>
            <li>Continuidade</li>
          </ul>

        </div>
      </section>

      {/* 5. SEGMENTS - COMPRESSED */}
      <section id="segmentos" className="py-20 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-2xl md:text-4xl font-display font-medium tracking-tight text-white">
            Desenvolvido para organizações complexas:
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              'Grupos Empresariais & Holdings',
              'Empresas Familiares',
              'Hospitais & Redes de Saúde',
              'Indústrias & Operações Complexas',
              'Empresas sob Reestruturação'
            ].map((segment, i) => (
              <div key={i} className="p-6 bg-[#060D17] border border-white/5 rounded-xl flex items-center justify-between group">
                <span className="text-sm font-medium text-white/80">{segment}</span>
                <ChevronRight size={14} className="text-white/20 group-hover:text-secondary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA / EXECUTIVE CLOSING */}
      <section className="py-28 px-6 relative overflow-hidden z-10 bg-[#02050A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.1]">
            Sua empresa está crescendo com clareza suficiente para sustentar o próximo ciclo?
          </h2>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => handleCTAClick('Gostaria de agendar uma Avaliação Institucional para minha organização.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>Avaliação Institucional</span>
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de conversar com os especialistas de Governança da Illumine.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-transparent border border-white/20 text-white/85 font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Falar com Especialistas</span>
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
