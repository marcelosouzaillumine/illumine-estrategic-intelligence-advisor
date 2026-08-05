// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, BrainCircuit, Target, Activity, Layers, AlertCircle, Briefcase, Network, CheckCircle2, BarChart3, ArrowRight, ChevronRight, Scale, Building, Users, HeartHandshake, ArrowUpRight, Sparkles } from 'lucide-react';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEmpresasPageViewModel } from '../../../viewmodels/useEmpresasPageViewModel';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CanonicalBrandSignature } from '../../brand/BrandLogo';

// Editorial Causal Mesh backdrop (Static & Extremely Understated)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 120, y: 150, label: 'Capital de Giro' },
    { id: 2, x: 380, y: 110, label: 'Pressão de Caixa' },
    { id: 3, x: 260, y: 280, label: 'Estrutura Fiduciária' },
    { id: 4, x: 550, y: 220, label: 'Alinhamento Missional' },
    { id: 5, x: 720, y: 120, label: 'Continuidade Institucional' },
    { id: 6, x: 440, y: 350, label: 'Elasticidade Operacional' },
    { id: 7, x: 740, y: 300, label: 'Sucessão & Legado' }
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
    <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full max-w-[1200px] max-h-[600px] text-white" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="0.75"
            />
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="3" fill="currentColor" />
            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="9"
              letterSpacing="0.08em"
              className="font-sans font-semibold uppercase select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export function EmpresasPage() {
  // Adapter: useEmpresasPageAdapter
  // ViewModel: useEmpresasPageViewModel
  const { state, computed, actions } = useEmpresasPageViewModel();
  useDocumentTitle('Illumine | Governança Institucional Inteligente');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showSticky, setShowSticky] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [manifestoChecked, setManifestoChecked] = useState<boolean[]>([false, false, false, false, false, false, false]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 600) setShowSticky(true);
      else setShowSticky(false);
    };
    window.addEventListener('scroll', handleScroll);

    // Add or update meta description tag dynamically for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Illumine Governance™ é a plataforma e infraestrutura de inteligência institucional para decisões executivas de empresas complexas.');

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCTAClick = (message: string) => {
    window.open(`https://wa.me/554131514537?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleCheck = (index: number) => {
    setManifestoChecked(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const eixos = [
    { name: 'Financeiro', desc: 'Análise de liquidez, estrutura de capital e custos ocultos.', impact: 'Fiduciário' },
    { name: 'Operacional', desc: 'Mapeamento de gargalos, capacidade produtiva e dependências.', impact: 'Eficiência' },
    { name: 'Pessoas', desc: 'Avaliação de liderança, planos de sucessão e dependência de pessoal.', impact: 'Continuidade' },
    { name: 'Mercado', desc: 'Estudo de posicionamento competitivo e resiliência a choques.', impact: 'Sistêmico' },
    { name: 'Governança', desc: 'Auditoria de alçadas, governança de dados e acordos corporativos.', impact: 'Decisório' },
    { name: 'Estratégia', desc: 'Alinhamento do modelo operacional às metas de longo prazo.', impact: 'Direcionamento' },
    { name: 'Institucional', desc: 'Preservação de reputação, legado e conformidade legal.', impact: 'Reputacional' }
  ];

  const intelligences = [
    {
      id: 0,
      title: 'Inteligência Econômica',
      question: 'A organização gera valor?',
      icon: <BarChart3 size={20} className="text-secondary" />,
      desc: 'Identifica se o crescimento realmente produz valor sustentável.',
      insights: ['Retorno sobre Capital Empregado (ROIC)', 'Geração de Caixa vs. Lucro Contábil', 'Custos Operacionais Invisíveis']
    },
    {
      id: 1,
      title: 'Inteligência Fiduciária',
      question: 'A organização protege valor?',
      icon: <ShieldCheck size={20} className="text-secondary" />,
      desc: 'Avalia a capacidade de preservar recursos, liquidez e estabilidade financeira.',
      insights: ['Exposição a Garantias e Fianças', 'Análise de Solvência de Longo Prazo', 'Mitigação de Contingências Fiscais']
    },
    {
      id: 2,
      title: 'Inteligência Institucional',
      question: 'A organização fortalece sua continuidade?',
      icon: <Building size={20} className="text-secondary" />,
      desc: 'Analisa a capacidade da organização sobreviver além das pessoas que a construíram.',
      insights: ['Sólidos Mecanismos de Sucessão', 'Proteção do Valor de Marca', 'Resiliência contra Crises de Imagem']
    },
    {
      id: 3,
      title: 'Inteligência Causal',
      question: 'Quais fatores realmente produzem os resultados?',
      icon: <BrainCircuit size={20} className="text-secondary" />,
      desc: 'Revela as causas invisíveis por trás dos indicadores observados.',
      insights: ['Elasticidade Operacional dos Custos', 'Gargalos Físicos com Efeito Financeiro', 'Causas da Drenagem de Capital de Giro']
    },
    {
      id: 4,
      title: 'Inteligência Constitucional',
      question: 'As decisões permanecem alinhadas aos princípios?',
      icon: <Scale size={20} className="text-secondary" />,
      desc: 'Verifica a coerência entre comportamento organizacional e fundamentos institucionais.',
      insights: ['Aderência a Acordos de Sócios', 'Auditoria Ativa de Alçadas Decisórias', 'Conformidade com Princípios Jurídicos']
    },
    {
      id: 5,
      title: 'Inteligência Missional',
      question: 'A organização está cumprindo sua missão?',
      icon: <Target size={20} className="text-secondary" />,
      desc: 'Avalia a conexão entre propósito declarado e realidade operacional.',
      insights: ['Mapeamento de Desvios de Missão', 'Coerência Decisória com o Propósito', 'Índice de Alinhamento da Liderança']
    },
    {
      id: 6,
      title: 'Inteligência Prospectiva',
      question: 'A organização está preparada para prosperar no futuro?',
      icon: <Activity size={20} className="text-secondary" />,
      desc: 'Analisa se as decisões atuais fortalecem ou enfraquecem os próximos ciclos organizacionais.',
      insights: ['Stress Tests de Impacto Macroeconômico', 'Preparação para Riscos de Mercado', 'Radar de Tendências de Disrupção']
    }
  ];

  return (
    <main className="min-h-screen bg-[#04070C] text-white relative overflow-x-hidden font-sans selection:bg-[#FF8A57]/20 selection:text-[#FF8A57] antialiased">
      
      {/* Background Ambient Lights */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#FF8A57]/2 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/1 blur-[180px] pointer-events-none z-0" />

      {/* Navbar Minimalist & Premium */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-[#202733] backdrop-blur-xl bg-[#050911]/90 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between gap-8">
          
          {/* Logo Signature */}
          <div id="nav-logo-link">
            <CanonicalBrandSignature categoryBadge="Governance™" onClick={() => scrollToSection('hero')} />
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            <button 
              id="nav-link-risco"
              onClick={() => scrollToSection('problema')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O Risco
            </button>
            <button 
              id="nav-link-detectamos"
              onClick={() => scrollToSection('diagnosticos')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O que Detectamos
            </button>
            <button 
              id="nav-link-manifesto"
              onClick={() => scrollToSection('manifesto')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Manifesto
            </button>
            <button 
              id="nav-link-categoria"
              onClick={() => scrollToSection('categoria')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Categoria
            </button>
            <button 
              id="nav-link-esgim"
              onClick={() => scrollToSection('esgim')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              ESGIM™
            </button>
            <button 
              id="nav-link-inteligencias"
              onClick={() => scrollToSection('inteligencias')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Inteligências
            </button>
            <button 
              id="nav-link-lideranca"
              onClick={() => scrollToSection('lideranca')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Liderança
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              id="nav-btn-entrar"
              onClick={() => {
                const langPrefix = language === 'en-US' ? 'en' : language === 'es-ES' ? 'es' : 'pt';
                navigate(`/${langPrefix}/login`);
              }}
              className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-[#B9BEC7] hover:text-[#FF8A57] transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button 
              id="nav-btn-avaliar-continuidade"
              onClick={() => handleCTAClick("Olá! Acessei a página de Empresas e gostaria de realizar a avaliação de robustez institucional pelo Illumine Governance™.")}
              className="h-11 px-6 rounded-full bg-[#050911] border border-[#202733] hover:border-[#FF8A57]/50 hover:bg-[#0B101A] text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Avaliar Robustez</span>
            </button>
          </div>

        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-44 pb-24 px-6 relative overflow-hidden z-10 border-b border-[#202733] min-h-[90vh] flex items-center">
        <CausalTopologyVisual />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B101A] border border-[#202733] text-[#FF8A57] text-[9px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] animate-pulse" />
              Governança Institucional Inteligente
            </span>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-white max-w-5xl mx-auto font-medium tracking-tight leading-[1.15]">
              Sua organização está preparada para continuar saudável quando as condições deixarem de ser favoráveis?
            </h1>
            
            <div className="max-w-3xl mx-auto pt-4">
              <p className="text-lg md:text-xl text-[#B9BEC7] font-sans leading-relaxed">
                Muitas organizações crescem em receita enquanto acumulam fragilidades invisíveis. 
                O <span className="text-white font-semibold">Illumine Governance™</span> ajuda lideranças a identificar riscos ocultos, proteger valor e fortalecer a resiliência organizacional antes que problemas silenciosos se transformem em crises.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              id="hero-btn-avaliar-continuidade"
              onClick={() => handleCTAClick("Olá, gostaria de agendar uma avaliação inicial de robustez institucional com o Illumine Governance™.")}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-[#F9F9F9] text-[#111111] font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,138,87,0.25)] cursor-pointer"
            >
              <span>Avaliar Robustez Institucional</span>
              <ArrowRight size={14} className="text-[#FF8A57]" />
            </button>
            <button
              id="hero-btn-receber-diagnostico"
              onClick={() => scrollToSection('inteligencias')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-[#0A0F18] border border-[#2E3642] text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-[#FF8A57]/50 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Conhecer a Metodologia</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. O LIMIAR DA CRISE (Problema) */}
      <section id="problema" className="py-28 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
            O Limiar da Crise
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-white font-medium tracking-tight">
            O que normalmente destrói organizações não é a falta de vendas.
          </h2>
          <div className="w-12 h-[1px] bg-[#FF8A57]/60 mx-auto" />
          <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-sans max-w-3xl mx-auto">
            Não é falta de clientes. Não é falta de tecnologia. 
            É a <span className="text-[#FF8A57] font-medium">incapacidade de interpretar a realidade</span> antes que ela se transforme em crise.
          </p>
          <div className="pt-2 max-w-2xl mx-auto">
            <p className="text-sm text-white/50 leading-relaxed">
              Holdings, hospitais, indústrias, empresas familiares e terceiro setor operam sob dados desconectados que ocultam fricções. O crescimento acelera essas falhas silenciosas antes que a liderança perceba os danos.
            </p>
          </div>
        </div>
      </section>

      {/* 3. O QUE O GOVERNANCE CONSEGUE ENXERGAR (Dores Reais) */}
      <section id="diagnosticos" className="py-28 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
              Diagnósticos Reais
            </span>
            <h2 className="text-2xl md:text-4xl font-display text-white font-medium tracking-tight">
              O que o Illumine Governance™ consegue enxergar
            </h2>
            <p className="text-sm text-white/60">
              Desvios invisíveis na estrutura corporativa que passam despercebidos por indicadores financeiros tradicionais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                intel: "Inteligência Econômica",
                title: "Crescimento que destrói caixa",
                desc: "A ilusão do faturamento em escala ocultando asfixia severa de capital de giro e estresse na tesouraria."
              },
              {
                intel: "Inteligência Fiduciária",
                title: "Expansão sem sustentação institucional",
                desc: "Projetos de crescimento executados sem a correspondente proteção de valor, estrutura fiduciária e mitigação de riscos críticos."
              },
              {
                intel: "Inteligência Institucional",
                title: "Dependência excessiva de fundadores",
                desc: "Tomadas de decisão excessivamente concentradas em pessoas-chave, comprometendo sucessão, continuidade e autonomia institucional."
              },
              {
                intel: "Inteligência Causal",
                title: "Conflitos latentes entre sócios",
                desc: "Divergências estruturais que permanecem invisíveis até se transformarem em bloqueios decisórios, perda de alinhamento e deterioração da governança."
              },
              {
                intel: "Inteligência Constitucional",
                title: "Governança incompatível com o porte",
                desc: "Práticas, políticas e limites institucionais que deixaram de acompanhar a complexidade da organização."
              },
              {
                intel: "Inteligência Missional",
                title: "Missão desconectada da execução",
                desc: "O desvio gradual entre propósito, estratégia e operação que enfraquece a identidade institucional."
              },
              {
                intel: "Inteligência Prospectiva",
                title: "Estruturas que geram lucro mas fragilizam o futuro",
                desc: "Resultados aparentemente positivos obtidos à custa do esgotamento humano, da deterioração dos processos ou da destruição de capacidades futuras."
              }
            ].map((item, idx) => {
              const isLast = idx === 6;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4 }}
                  className={`p-6 bg-[#0B101A] border border-[#202733] rounded-xl hover:border-[#2B3443] transition-all ${
                    isLast ? "lg:col-span-3 md:col-span-2" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="inline-block px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-semibold text-[#FF8A57]">
                      {item.intel}
                    </div>
                    <h5 className={`font-display font-medium text-white ${isLast ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>
                      {item.title}
                    </h5>
                    <p className={`text-[13px] sm:text-sm text-white/60 leading-relaxed ${isLast ? "max-w-3xl" : ""}`}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. A GRANDE PERGUNTA DE NEGÓCIO (Manifesto Principal) */}
      <section id="manifesto" className="py-44 px-6 relative z-10 border-b border-[#202733] bg-[#070B12] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[70%] rounded-full bg-[#FF8A57]/5 blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-16 relative z-10">
          
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57] flex items-center justify-center gap-2">
            <Sparkles size={12} />
            Manifesto Institucional
          </span>
          
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-mono text-[#8E95A3] uppercase tracking-wider font-semibold">
              A Pergunta que Toda Liderança Deveria Responder
            </h2>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white leading-[1.1] max-w-6xl mx-auto italic tracking-tight">
              “Esta organização continuará saudável quando as condições deixarem de ser favoráveis?”
            </p>
          </div>

          <div className="w-24 h-[1px] bg-[#FF8A57]/50 mx-auto" />

          <div className="max-w-5xl mx-auto space-y-6 text-white/80 text-base md:text-lg leading-relaxed">
            <p className="font-sans">
              Mercados mudam. Pessoas saem. Tecnologias envelhecem. Estratégias precisam evoluir.
            </p>
            <p className="font-sans font-medium text-white">
              A verdadeira questão não é se a organização cresce. A verdadeira questão é se ela continuará saudável quando o ambiente deixar de ser favorável.
            </p>
            <p className="text-sm text-white/50 pt-2">
              O <span className="text-white font-semibold">Illumine Governance™</span> foi desenvolvido para ajudar organizações complexas a responder essa pergunta com evidências, clareza e responsabilidade.
            </p>
          </div>

          <div className="pt-6">
            <button
              id="manifesto-btn-responder"
              onClick={() => handleCTAClick("Olá! Desejo responder à grande pergunta do manifesto: 'Esta organização continuará saudável quando as condições deixarem de ser favoráveis?'")}
              className="px-10 h-16 rounded-full bg-[#FF8A57] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#FF9D72] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,138,87,0.30)]"
            >
              Responder esta Pergunta
            </button>
          </div>

        </div>
      </section>

      {/* 5. GOVERNANÇA INSTITUCIONAL INTELIGENTE (Definição de Valor & Categoria) */}
      <section id="categoria" className="py-28 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
                Governança Institucional Inteligente
              </span>
              <h2 className="text-2xl md:text-4xl font-display text-white font-medium tracking-tight">
                Uma nova categoria de infraestrutura de inteligência
              </h2>
              <p className="text-base text-white/80 font-sans leading-relaxed">
                A capacidade de enxergar o que normalmente permanece invisível até que se transforme em crise.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-5 text-white/60 text-sm leading-relaxed font-sans lg:border-l lg:border-white/5 pl-0 lg:pl-8 border-l-0">
              <p>
                Organizações complexas não fracassam apenas por problemas financeiros. Elas perdem sua continuidade porque deixam de interpretar corretamente os sinais que surgem na intersecção entre estratégia, governança, operação e propósito.
              </p>
              <p>
                O <span className="text-white font-semibold">Illumine Governance™</span> integra dados fragmentados para gerar clareza executiva, permitindo que lideranças entendam o impacto em tempo real das decisões de hoje sobre o futuro da organização.
              </p>
            </div>
          </div>

          <div className="bg-[#0B101A] border border-[#202733] rounded-2xl p-8 sm:p-12 space-y-10">
            <div className="text-center max-w-[576px] mx-auto space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#FF8A57] block">
                Escopo de Cobertura
              </span>
              <h5 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight mt-1">
                Integração Sistêmica de Valor
              </h5>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                O Illumine Governance™ analisa e integra continuamente sete dimensões de valor crítico para subsidiar decisões estratégicas da liderança:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {[
                { title: "geração de valor", desc: "Eficiência, ROIC e retorno real sobre o capital." },
                { title: "proteção de valor", desc: "Mitigação ativa de riscos, contingências e salvaguardas." },
                { title: "continuidade institucional", desc: "Estruturação fiduciária, governança de marcas e legado." },
                { title: "causas dos resultados", desc: "Mapeamento causal de indicadores operacionais e financeiros." },
                { title: "aderência aos princípios", desc: "Conformidade com acordos societários, regras e limites de alçada." },
                { title: "cumprimento da missão", desc: "Alinhamento das atividades operacionais aos objetivos fundadores." },
                { title: "preparação para o futuro", desc: "Stress tests e preparação para volatilidades e novos ciclos." }
              ].map((item, idx) => {
                const isLast = idx === 6;
                return (
                  <div 
                    key={idx} 
                    className={`group relative p-5 bg-[#070B12] border border-[#202733] hover:border-[#2B3443] rounded-xl transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                      isLast 
                        ? "sm:col-span-2 lg:col-span-2" 
                        : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/30 tracking-wider">
                          0{idx + 1}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] group-hover:scale-125 transition-transform" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 7. ESGIM™ */}
      <section id="esgim" className="py-28 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
              Framework Proprietário
            </span>
            <h2 className="text-2xl md:text-4xl font-display text-white font-medium tracking-tight">
              ESGIM™: O framework de mensuração do Illumine Governance™
            </h2>
            <div className="w-12 h-[1px] bg-[#FF8A57]/50 mx-auto" />
            <p className="text-sm text-white/70 max-w-2xl mx-auto leading-relaxed font-sans">
              O ESGIM™ organiza a realidade institucional em cinco dimensões fundamentais que sustentam continuidade, integridade e crescimento sustentável.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
            {[
              { letter: 'E', name: 'Environmental', desc: 'Resiliência a riscos socioambientais e sustentabilidade das operações.' },
              { letter: 'S', name: 'Social', desc: 'Desenvolvimento do capital humano, impacto comunitário e tecido relacional.' },
              { letter: 'G', name: 'Governance', desc: 'Sucessão, clareza decisória, auditoria ativa e conformidade societária.' },
              { letter: 'I', name: 'Institutional', desc: 'Salvaguarda de marca, resiliência organizacional e preservação do legado.' },
              { letter: 'M', name: 'Mission', desc: 'Alinhamento dos processos e decisões estratégicas com a missão fundadora.' }
            ].map((dim, i) => (
              <div key={i} className={`group relative p-6 bg-[#0B101A] border border-[#202733] rounded-xl flex flex-col items-center justify-center text-center hover:border-[#2B3443] transition-all duration-300 min-h-[155px] overflow-hidden cursor-help ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
        <span className="text-4xl font-display font-bold text-[#FF8A57] transition-all duration-300 group-hover:scale-95 group-hover:">{dim.letter}</span>
        <h5 className="text-xs font-bold uppercase tracking-wider text-white mt-2 transition-all duration-300 group-hover:">{dim.name}</h5>
                
                {/* Hover overlay description */}
                <div className="absolute inset-0 bg-[#050911]/98 p-4 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <p className="text-xs text-white/90 font-sans">{dim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTORIDADE INSTITUCIONAL: Assinatura Metodológica (Reposicionamento Premium) */}
      <section className="py-20 px-6 relative z-10 bg-[#04070C] border-b border-[#202733]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="relative p-8 md:p-12 bg-[#0B101A] border border-[#202733] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm group">
            {/* Glowing accents */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#FF8A57]/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF8A57]/[0.04] transition-colors duration-500" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Left Side: Brand Signature / Seal */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative shadow-xl hover:border-white/20 transition-all duration-300">
                  <img src="/logo.png" alt="Illumine Signature Logo" className="w-10 h-10 object-contain" />
                  <div className="absolute -inset-0.5 rounded-2xl border border-[#FF8A57]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#FF8A57] uppercase block">
                    Assinatura Metodológica
                  </span>
                  <h5 className="text-xl font-display font-medium text-white tracking-tight">
                    Desenvolvido pela Illumine
                  </h5>
                </div>
              </div>

              {/* Center Divider line */}
              <div className="hidden md:block md:col-span-1 justify-self-center">
                <div className="w-px h-16 bg-white/10" />
              </div>

              {/* Right Side: Editorial Statement */}
              <div className="md:col-span-7 text-center md:text-left">
                <p className="text-sm text-white/70 leading-relaxed font-sans font-light">
                  Solução fiduciária concebida pela <span className="text-white font-medium">Illumine Consultoria e Mentoria Empresarial</span>. 
                  Nossa atuação une governança de precisão e diagnóstico causal para blindar a saúde financeira, acelerar a clareza decisória de conselhos e consolidar a longevidade institucional de organizações de alta complexidade.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="inteligencias" className="py-28 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          {/* Eixos Section Header */}
          <div className="space-y-6 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
              Escopo de Análise & Interpretação
            </span>
            <h2 className="text-2xl md:text-4xl font-display text-white font-medium tracking-tight">
              Onde observamos e como interpretamos
            </h2>
            <p className="text-sm text-[#B9BEC7] max-w-2xl mx-auto leading-relaxed">
              Toda organização deixa sinais. Buscamos evidências em 7 Eixos críticos e aplicamos 7 Inteligências para interpretar o que esses dados significam para o futuro do negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pt-4">
            
            {/* ONDE OBSERVAMOS: 7 Eixos (Esquerda) */}
            <div className="lg:col-span-5 flex flex-col h-full space-y-4">
              {/* Header aligned on desktop */}
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-[#FF8A57] tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] animate-pulse" />
                Onde Observamos
              </div>

              <div className="bg-[#0B101A] border border-[#202733] rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col justify-between">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#FF8A57]/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Mobile Title */}
                <div className="lg:hidden flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-[#FF8A57] tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] animate-pulse" />
                  Onde Observamos
                </div>
                
                {/* Mobile / Tablet Eixos (Horizontal scrollable pill grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-2">
                  {eixos.map((eixo, idx) => {
                    const isSelected = activeTab === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-3 py-2 text-left border rounded-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#FF8A57]/10 border-[#FF8A57]/40 text-white shadow-md shadow-[#FF8A57]/5'
                            : 'bg-[#070B12] border-[#202733] text-[#B9BEC7] hover:border-[#2B3443] hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#FF8A57] animate-pulse' : 'bg-white/20'}`} />
                            <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">{eixo.name}</span>
                          </div>
                          <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest pl-2.5">
                            {eixo.impact}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop Eixos (Vertical dashboard timeline layout) - flex-1 and justify-between for dynamic height equalizing */}
                <div className="hidden lg:flex flex-col flex-1 justify-between relative py-2 gap-4">
                  <div className="absolute left-[17px] top-4 bottom-4 w-[1px] bg-white/5 pointer-events-none" />
                  
                  {eixos.map((eixo, idx) => {
                    const isSelected = activeTab === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`relative pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF8A57]/10 border-[#FF8A57]/30 text-white shadow-lg'
                            : 'bg-transparent border-transparent text-[#8E95A3] hover:text-[#B9BEC7]'
                        }`}
                      >
                        {/* Dot indicator over timeline */}
                        <div className="absolute left-[17px] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                          <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-[#FF8A57] border-[#FF8A57] scale-110 shadow-lg shadow-[#FF8A57]/50' 
                              : 'bg-white/5 border-white/20 hover:border-white/45'
                          }`} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h5 className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-[#B9BEC7]'}`}>
                              {eixo.name}
                            </h5>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider ${
                              isSelected ? 'bg-[#FF8A57]/15 border border-[#FF8A57]/30 text-[#FF8A57] font-semibold' : 'bg-[#070B12] border border-[#202733] text-[#8E95A3]'
                            }`}>
                              Impacto: {eixo.impact}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-normal transition-opacity duration-300 font-sans ${isSelected ? 'text-[#B9BEC7]' : 'text-[#8E95A3]'}`}>
                            {eixo.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COMO INTERPRETAMOS: 7 Inteligências Accordion (Direita) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Header aligned on desktop */}
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-white/50 tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Como Interpretamos
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {/* Mobile Title */}
                <div className="lg:hidden flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-white/50 tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  Como Interpretamos
                </div>
                
                <div className="space-y-3">
                  {intelligences.map((intel, idx) => {
                    const isOpen = activeTab === idx;
                    return (
                      <div 
                        key={idx}
                        className={`border transition-all duration-300 rounded-[28px] overflow-hidden ${
                          isOpen 
                            ? 'bg-[#0B101A] border-[#2B3443] shadow-2xl backdrop-blur-md' 
                            : 'bg-[#0B101A] border-[#202733] hover:border-[#2B3443]'
                        }`}
                      >
                        {/* Header/Trigger */}
                        <button
                          id={`intel-tab-btn-${idx}`}
                          onClick={() => setActiveTab(isOpen ? -1 : idx)}
                          className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 ${
                              isOpen 
                                ? 'bg-[#FF8A57]/15 border-[#FF8A57]/40 text-[#FF8A57] shadow-lg shadow-[#FF8A57]/10' 
                                : 'bg-[#FF8A57]/10 border-[#FF8A57]/20 text-[#FF8A57]'
                            }`}>
                              {intel.icon}
                            </div>
                            <div>
                              <h5 className={`text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                                isOpen ? 'text-white' : 'text-white'
                              }`}>
                                {intel.title}
                              </h5>
                              <p className={`text-[11px] font-sans mt-0.5 transition-colors duration-300 ${
                                isOpen ? 'text-[#FF8A57]' : 'text-[#8E95A3]'
                              }`}>
                                {intel.question}
                              </p>
                            </div>
                          </div>
                          <ChevronRight 
                            size={16} 
                            className={`text-[#8E95A3] transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#FF8A57]' : ''}`} 
                          />
                        </button>

                        {/* Body (Expanded Details) */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6">
                                <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl font-sans">
                                  {intel.desc}
                                </p>

                                <div className="space-y-3">
                                  <span className="text-[9px] font-mono uppercase text-[#FF8A57] tracking-wider block font-semibold">
                                    Mapeamento de Sinais:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {intel.insights.map((insight, i) => (
                                      <div 
                                        key={i} 
                                        className="px-3 py-2 bg-[#070B12] border border-[#202733] text-[10px] text-[#B9BEC7] transition-all duration-200 rounded-lg flex items-center gap-2 cursor-default hover:bg-[#0B101A] hover:border-[#2B3443]"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A57] flex-shrink-0 animate-pulse" />
                                        <span className="font-sans leading-tight">{insight}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                  <p className="text-[9px] text-white/30 font-mono text-right">
                                    Avaliação de resiliência corporativa sob o framework Illumine™.
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Compact Architecture Flow */}
          <div className="pt-8 border-t border-white/5 mt-12 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] font-mono tracking-widest text-white/30 uppercase">
            <span className="text-white/70 hover:text-white transition-colors">Dados</span>
            <ArrowRight size={10} className="text-[#FF8A57]" />
            <span className="text-white/70 hover:text-white transition-colors">ESGIM™</span>
            <ArrowRight size={10} className="text-[#FF8A57]" />
            <span className="text-white/70 hover:text-white transition-colors">7 Eixos</span>
            <ArrowRight size={10} className="text-[#FF8A57]" />
            <span className="text-white/70 hover:text-white transition-colors">7 Inteligências</span>
            <ArrowRight size={10} className="text-[#FF8A57]" />
            <span className="text-[#FF8A57] font-semibold">Decisão Executiva</span>
          </div>

        </div>
      </section>

      {/* 8. O QUE SUA LIDERANÇA PASSA A ENXERGAR */}
      <section id="lideranca" className="py-28 px-6 relative z-10 border-b border-[#202733] bg-[#04070C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
              Clareza Decisória
            </span>
            <h2 className="text-2xl md:text-4xl font-display text-white font-medium tracking-tight">
              O que sua liderança passa a enxergar
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto">
              Quando a realidade passa a ser interpretada de forma integrada, a liderança começa a enxergar:
            </p>
          </div>

          <div className="bg-[#0B101A] border border-[#202733] rounded-2xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {[
                "riscos de continuidade institucional",
                "fragilidades de governança",
                "dependências críticas de pessoas-chave",
                "pressões futuras de liquidez",
                "desalinhamentos entre propósito e execução",
                "riscos ESG relevantes",
                "gargalos invisíveis ao crescimento",
                "prioridades estratégicas mais claras",
                "recomendações fundamentadas em evidências",
                "alertas sobre o próximo ciclo organizacional"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="text-[#FF8A57] flex-shrink-0 mt-[3px]">
                    <CheckCircle2 size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>      {/* 9. PÚBLICOS ATENDIDOS (Público-Alvo) */}
      <section id="publico" className="py-24 px-6 relative z-10 border-b border-[#202733] bg-[#070B12]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
              Públicos Atendidos
            </span>
            <h2 className="text-2xl md:text-4xl font-display text-white font-medium tracking-tight">
              Desenvolvido para organizações complexas
            </h2>
            <p className="text-sm text-white/50 max-w-[576px] mx-auto">
              Soluções direcionadas para estruturas que exigem clareza fiduciária e governança robusta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {[
              { title: "Empresas Familiares", desc: "Transição geracional e proteção do patrimônio fiduciário." },
              { title: "Holdings e Grupos", desc: "Consolidação de riscos e correlações cruzadas de portfólio." },
              { title: "Hospitais e Saúde", desc: "Complexidade regulatória e proteção de fluxos de caixa operacionais." },
              { title: "Indústrias", desc: "Mitigação de volatilidade operacional e resiliência de capital de giro." },
              { title: "Terceiro Setor", desc: "Proteção contra desvios de missão e preservação da sustentabilidade." },
              { title: "Organizações orientadas por propósito", desc: "Alinhamento de princípios fundadores à realidade de mercado." }
            ].map((target, idx) => (
              <div key={idx} className="p-5 bg-[#0B101A] border border-[#202733] rounded-xl flex flex-col justify-center">
                <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                  {target.title}
                </h5>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  {target.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. CTA FINAL */}
      <section className="py-24 px-6 relative overflow-hidden z-10 bg-[#04070C] border-t border-[#202733]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF8A57]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A57]">
            Perpetuidade e Legado
          </span>
          <div className="space-y-4">
            <h5 className="text-sm font-mono uppercase tracking-widest text-white/40">
              Robustez Institucional
            </h5>
            <p className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-white leading-tight max-w-3xl mx-auto">
              As decisões que preservam o futuro começam com clareza.
            </p>
            <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
              O <span className="text-white font-semibold">Illumine Governance™</span> ajuda lideranças a transformar sinais dispersos em decisões mais conscientes, protegendo valor, fortalecendo instituições e preparando o próximo ciclo da organização.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              id="final-cta-btn-avaliar"
              onClick={() => handleCTAClick("Olá! Desejo realizar a avaliação de robustez institucional da minha organização no Illumine Governance™.")}
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#F9F9F9] text-[#111111] font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,138,87,0.25)]"
            >
              <span>Avaliar Robustez Institucional</span>
            </button>
            <button
              id="final-cta-btn-advisor"
              onClick={() => handleCTAClick("Olá! Desejo agendar uma reunião estratégica com a Illumine Consultoria.")}
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#0A0F18] border border-[#2E3642] text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-[#FF8A57]/50 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Falar com um Advisor</span>
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
            <a
              id="sticky-cta-btn"
              href={`https://wa.me/554131514537?text=${encodeURIComponent("Olá! Gostaria de agendar a avaliação de robustez institucional pelo Illumine Governance™.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 h-14 bg-[#F9F9F9] text-[#111111] font-bold text-[10px] uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(255,138,87,0.30)] hover:bg-white transition-all cursor-pointer border border-white/20 no-underline"
            >
              <div className="w-7 h-7 rounded-full bg-[#FF8A57]/15 border border-[#FF8A57]/30 flex items-center justify-center text-[#FF8A57]">
                <Briefcase size={13} />
              </div>
              <span>Avaliar Robustez</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Minimalist */}
      <footer className="py-16 border-t border-[#202733] bg-[#050911] text-[#8E95A3] text-[10px] tracking-wider uppercase font-semibold">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-white/80 text-sm tracking-tight" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>illumine</span>
              <span className="text-[8px] text-[#8E95A3]">|</span>
              <span>© 2026 Illumine Governance™. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6">
              <button id="footer-btn-topo" onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">Voltar ao Topo</button>
              <button id="footer-btn-parceiros" onClick={() => navigate('/executive-advisor-network')} className="hover:text-white transition-colors">Executive Advisor Network™</button>
              <button id="footer-btn-login" onClick={() => {
                const langPrefix = language === 'en-US' ? 'en' : language === 'es-ES' ? 'es' : 'pt';
                navigate(`/${langPrefix}/login`);
              }} className="hover:text-white transition-colors">Acesso Restrito</button>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
