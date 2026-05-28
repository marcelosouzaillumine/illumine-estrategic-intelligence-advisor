import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Activity, CheckCircle2, ArrowRight,
  Users, Scale, Landmark
} from 'lucide-react';

// Quiet, Editorial Causal Topology Watermark (Static & Subdued)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 150, y: 130, label: 'Posicionamento Estratégico' },
    { id: 2, x: 420, y: 170, label: 'Atendimento Consultivo' },
    { id: 3, x: 280, y: 290, label: 'Inteligência Executiva' },
    { id: 4, x: 580, y: 230, label: 'Decisões Melhores' },
    { id: 5, x: 740, y: 140, label: 'Leitura Executiva' },
    { id: 6, x: 480, y: 370, label: 'Clareza Executiva' },
    { id: 7, x: 720, y: 340, label: 'Diferenciação Consultiva' }
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
        {/* Connection Lines */}
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

export function PartnerSalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCTAClick = (message: string) => {
    window.open(`https://wa.me/554131514537?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#03080F] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Background Ambient Effects */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-secondary/2 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/1 blur-[180px] pointer-events-none z-0" />
      
      {/* Navbar Premium */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-white/5 backdrop-blur-xl bg-[#03080F]/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between gap-8">
          
          {/* Logo Signature */}
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
              O Desafio
            </button>
            <button 
              onClick={() => scrollToSection('o-que-enxergar')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O que ver
            </button>
            <button 
              onClick={() => scrollToSection('poder-consultivo')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Poder Consultivo
            </button>
            <button 
              onClick={() => scrollToSection('competencias')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Estruturas
            </button>
            <button 
              onClick={() => navigate('/empresas')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
            >
              Empresas
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
              onClick={() => handleCTAClick('Olá. Gostaria de conversar com a Illumine sobre como a estrutura de inteligência estratégica e governança da Governance pode apoiar nossa atuação.')}
              className="h-10 px-5 rounded-md border border-white/20 hover:border-white text-white font-bold text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Conversar com a Illumine</span>
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
              INFRAESTRUTURA DE INTELIGÊNCIA EXECUTIVA
            </span>
            
            <p className="text-secondary text-xs sm:text-sm font-semibold tracking-widest uppercase max-w-2xl mx-auto leading-relaxed mt-2 select-none">
              A complexidade das empresas evoluiu. A estrutura da maioria dos advisors não.
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-[1.15]">
              Sua estrutura atual é suficiente para sustentar decisões estratégicas em organizações cada vez mais complexas?
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            Uma infraestrutura proprietária que eleva operações contábeis e consultivas ao nível de advisory de conselho.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => scrollToSection('porque-governance')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              <span>Conhecer a Governance</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleCTAClick('Olá. Gostaria de conversar com a Illumine sobre como a estrutura de inteligência estratégica e governança da Governance pode apoiar nossa atuação.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Conversar com a Illumine</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. EXECUTIVE TENSION */}
      <section id="problema" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            O problema raramente aparece primeiro nos números.
          </h2>
          <div className="w-px h-16 bg-secondary/50 mx-auto" />
          <p className="text-lg md:text-xl text-white/70 leading-relaxed font-sans max-w-2xl mx-auto">
            Ter acesso aos dados não garante autoridade nas decisões. O mercado exige estruturas capazes de ler os riscos invisíveis antes que eles reflitam no caixa.
          </p>
        </div>
      </section>

      {/* 3. BEYOND THE REPORTS BLOCK */}
      <section id="alem-dos-relatorios" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#03080F]/80">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                Relatórios mostram dados. Governance ajuda a interpretar a realidade por trás deles.
              </h2>
            </div>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed font-sans">
              <p>
                Indicadores isolados criam pontos cegos e suprimem desvios organizacionais silenciosos.
              </p>
              <p className="text-white/90 font-medium border-l border-secondary/30 pl-4 mt-4">
                A Governance unifica esses sinais, permitindo que o advisor antecipe rupturas e proteja o próximo ciclo de crescimento da organização.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY GOVERNANCE EXISTS (Mecanismo de Atuação) */}
      <section id="porque-governance" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              MECANISMO DE ATUAÇÃO
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              A estrutura que dá poder ao Advisor.
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
              A estrutura que conecta variáveis financeiras, operacionais e societárias sob uma visão unificada para decisões de alta complexidade.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CONSULTATIVE POWER (Visually Elevated for Supreme Authority) */}
      <section id="poder-consultivo" className="py-24 px-6 sm:px-8 relative z-10 border-b border-white/5 bg-[#03080F] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.015] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12 text-center flex flex-col items-center justify-center">
          
          <div className="w-full space-y-6 flex flex-col items-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3 inline-block">
              AMPLIAÇÃO DE POSICIONAMENTO
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-tight w-full">
              Saia do operacional e entre em conversas estratégicas.
            </h2>
          </div>

          <div className="w-full max-w-3xl bg-[#060D17]/70 border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl relative mx-auto">
            <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
            <p className="text-white/80 text-lg md:text-xl leading-relaxed font-sans text-center">
              A base analítica para conduzir conversas de conselho, sucessão e continuidade.
            </p>
          </div>

        </div>
      </section>

      {/* 6. STRATEGIC CAPABILITIES (Extensions of Governance) */}
      <section id="competencias" className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              CAMADAS DE INTELIGÊNCIA APLICADA
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              Infraestrutura de Inteligência Aplicada
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Governança & Advisory',
                desc: 'Estruturação executiva, alinhamento societário e suporte à continuidade organizacional.'
              },
              {
                icon: Scale,
                title: 'Jurídico & Compliance',
                desc: 'Mitigação de riscos, conformidade regulatória e proteção institucional.'
              },
              {
                icon: Activity,
                title: 'Inteligência Financeira',
                desc: 'Leitura de liquidez, viabilidade de expansão e sustentabilidade operacional.'
              },
              {
                icon: Users,
                title: 'Cultura & Capital Humano',
                desc: 'Fortalecimento da liderança e preparação para sucessão.'
              },
              {
                icon: Landmark,
                title: 'ESG & Sustentabilidade',
                desc: 'Responsabilidade institucional e geração sustentável de valor longo prazo.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-[#060D17] border border-white/5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 mt-1">
                  <item.icon className="text-secondary" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-white tracking-tight">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed font-sans mt-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PREMIUM CTA */}
      <section className="py-28 px-6 relative overflow-hidden z-10 bg-[#03080F]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.01] via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
            ESTRUTURA DE ADVISORY
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.15]">
            O próximo nível do advisory exige uma estrutura de interpretação mais sofisticada.
          </h2>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => handleCTAClick('Olá. Gostaria de compreender melhor o funcionamento da Governance — a estrutura proprietária de inteligência executiva da Illumine.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>Conhecer a Governance</span>
            </button>
            <button
              onClick={() => handleCTAClick('Olá. Gostaria de conversar com a Illumine sobre como a estrutura de inteligência estratégica e governança da Governance pode apoiar nossa atuação.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Agendar Conversa Estratégica</span>
            </button>
          </div>
        </div>
      </section>

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
            <button onClick={() => navigate('/empresas')} className="hover:text-white transition-colors">Visualização de Empresas</button>
            <button onClick={onLoginClick} className="hover:text-white transition-colors">Acesso Restrito</button>
          </div>
        </div>
      </footer>

    </main>
  );
}
