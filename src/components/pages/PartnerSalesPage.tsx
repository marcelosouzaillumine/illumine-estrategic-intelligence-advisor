import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, BrainCircuit, Target, Activity, 
  Layers, Lock, AlertCircle, Briefcase, Network, CheckCircle2, TrendingUp, BarChart3, Database, MessageSquare, Compass, Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Minimal Animation Variant
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
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
    <main className="min-h-screen bg-[#030303] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Background Ambient Effects */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[140px] pointer-events-none z-0" />
      
      {/* Navbar Premium Blur */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-white/10 backdrop-blur-xl bg-[#030303]/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-0 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="w-[52px] h-[52px] flex items-center justify-center relative -translate-y-1">
              <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div className="flex flex-col items-center w-fit">
              <span 
                className="text-[42px] tracking-[-0.06em] text-white leading-[0.8]" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[6px] text-secondary uppercase mt-[2px] whitespace-nowrap" 
                style={{ fontFamily: '"Work Sans", sans-serif' }}
              >
                {"Strategic Intelligence & Advisory".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Nav Toggle para Empresas/Parceiros */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-lg">
            <button
              onClick={() => window.location.href = '/empresas'}
              className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors rounded-md"
            >
              Empresa
            </button>
            <button
              className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-black rounded-md shadow-sm pointer-events-none"
            >
              Parceiro
            </button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={onLoginClick} className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-secondary transition-colors cursor-pointer">
              Acesso Restrito
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de iniciar uma Conversa Institucional sobre Alianças Estratégicas')}
              className="h-10 px-6 rounded-md bg-secondary text-white font-bold text-[10px] uppercase tracking-widest hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conversa Institucional</span>
              <span className="sm:hidden">Aplicar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-32 px-6 relative overflow-hidden z-10 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6">
              <Network size={14} className="animate-pulse opacity-80" /> Ecossistema Enterprise
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Alianças Estratégicas para uma Nova Geração de <span className="text-secondary">Inteligência Empresarial.</span>
            </h1>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-lg md:text-xl text-white/70 font-medium max-w-3xl mx-auto space-y-6 leading-relaxed">
            <p className="text-xl text-white font-semibold">
              A Illumine conecta consultorias, advisors, especialistas e estruturas executivas a uma arquitetura institucional de inteligência empresarial, governança integrada e advisory estratégico.
            </p>
            <p>
              Mais do que uma plataforma, a Illumine fornece uma infraestrutura enterprise-grade para profissionais que desejam ampliar profundidade analítica, capacidade consultiva e posicionamento estratégico junto aos seus clientes.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => handleCTAClick('Gostaria de Solicitar uma Aliança Estratégica com a Illumine')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <span>Solicitar Aliança Estratégica</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('plataforma')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <span>Conhecer a Arquitetura Illumine</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. A NOVA REALIDADE DAS EMPRESAS */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">
              A Nova Realidade das Empresas
            </h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Empresas não enfrentam apenas desafios financeiros.
            </h3>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 mt-6 backdrop-blur-sm">
              <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Elas enfrentam:</p>
              <ul className="space-y-4">
                {[
                  'Deterioração silenciosa de margem;',
                  'Crescimento sem sustentação;',
                  'Baixa previsibilidade;',
                  'Desalinhamento operacional;',
                  'Pressão no capital de giro;',
                  'Decisões desconectadas da realidade estrutural;',
                  'Ausência de leitura integrada do negócio.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-white/30 shrink-0 mt-0.5" />
                    <span className="text-white/80 font-medium text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8 lg:pt-24">
            <div className="bg-secondary/5 border border-secondary/20 p-10 rounded-2xl">
              <p className="text-xl text-white font-medium leading-relaxed">
                Nesse cenário, profissionais estratégicos precisam de mais do que ferramentas isoladas.
              </p>
              <p className="text-2xl text-secondary font-bold mt-6">
                Precisam de: <br/>inteligência estrutural empresarial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. O QUE É A ILLUMINE */}
      <section id="plataforma" className="py-32 px-6 relative z-10 border-b border-white/5 bg-gradient-to-b from-[#030303] to-[#080808]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">A ORIGEM DA PLATAFORMA</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Nossa Ciência e Metodologia de Consultoria<br/><span className="text-secondary">Transformadas em Tecnologia.</span>
            </h3>
            <p className="text-lg text-white/80 font-medium leading-relaxed">
              A plataforma Illumine Strategic Intelligence & Advisory não é apenas um software. Ela contém toda a <strong>metodologia, ciência e arquitetura de inteligência</strong> de como a Illumine Consultoria pensa o desenvolvimento de empresas sustentáveis, agora embarcadas em uma infraestrutura digital para suporte à tomada de decisão.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-10 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-8">A Plataforma Integra</p>
              <ul className="grid grid-cols-2 gap-y-6 gap-x-4">
                {[
                  'Inteligência financeira', 'Governança narrativa', 'Causalidade empresarial', 'Análise estrutural',
                  'Advisory executivo', 'Continuidade operacional', 'Sustentabilidade de crescimento', 'Inteligência de capital de giro', 'Leitura preditiva de risco'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    <span className="text-white/90 text-sm font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-8">Para Ambientes Corporativos</p>
              <p className="text-lg text-white font-medium mb-6">Tudo em uma estrutura construída para organizações que exigem:</p>
              <ul className="space-y-4">
                {['Profundidade', 'Confiabilidade', 'Clareza executiva', 'Sofisticação analítica'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-secondary" />
                    <span className="text-white text-lg font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUEM A ILLUMINE BUSCA & O QUE NÃO É */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">QUEM A ILLUMINE BUSCA</h2>
            <p className="text-2xl text-white font-medium">A Illumine foi desenvolvida para profissionais e estruturas que operam em profundidade estratégica.</p>
            <p className="text-sm font-bold uppercase tracking-widest text-white/40">Perfis mais aderentes ao ecossistema:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Consultorias empresariais', 'CFOs externos', 'Advisors financeiros', 'Escritórios contábeis estratégicos', 
                'Estruturas de governança', 'Escritórios jurídicos empresariais', 'Conselheiros', 'Especialistas em reestruturação',
                'Family offices', 'Consultorias de M&A', 'Hubs empresariais', 'Especialistas em transformação'
              ].map((item, i) => (
                <div key={i} className="p-3 border border-white/10 rounded-lg bg-white/5 text-sm text-white/80 font-medium">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:pl-16 lg:border-l lg:border-white/10">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">A ILLUMINE NÃO É</h2>
            <ul className="space-y-3 opacity-60">
              {['Um dashboard convencional', 'Um ERP', 'Um BI tradicional', 'Uma ferramenta de indicadores isolados', 'Uma consultoria genérica'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 line-through text-lg font-medium">
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="pt-8 space-y-6">
              <p className="text-2xl text-secondary font-bold">A Illumine é uma arquitetura institucional de inteligência empresarial.</p>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40">Seu propósito é ampliar:</p>
              <ul className="grid grid-cols-2 gap-3">
                {['Capacidade de interpretação', 'Leitura estrutural', 'Maturidade decisional', 'Governança', 'Profundidade consultiva', 'Previsibilidade executiva'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle2 size={16} className="text-secondary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. O QUE O PARCEIRO ACESSA */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">O QUE O PARCEIRO ACESSA</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Intelligence Layers
            </h3>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Layers, title: 'Structural Intelligence', desc: 'Leitura estrutural do negócio com foco em sustentabilidade operacional, capital de giro, liquidez real e resiliência empresarial.' },
              { icon: BrainCircuit, title: 'Predictive Causality', desc: 'Mapeamento das relações de causa e efeito entre indicadores financeiros, operacionais e estratégicos.' },
              { icon: Database, title: 'Treasury Intelligence', desc: 'Análise avançada de tesouraria, elasticidade financeira e capacidade de absorção de choques.' },
              { icon: Shield, title: 'Governance Intelligence', desc: 'Frameworks de governança narrativa, consistência institucional e interpretação executiva.' },
              { icon: Briefcase, title: 'Executive Advisory Engine', desc: 'Geração de diagnósticos estratégicos com linguagem institucional e foco em tomada de decisão.' },
              { icon: Activity, title: 'Risk Propagation Engine', desc: 'Identificação de propagação estrutural de riscos financeiros e operacionais.' },
              { icon: TrendingUp, title: 'Growth Sustainability', desc: 'Avaliação da sustentabilidade do crescimento e da capacidade estrutural de expansão.' }
            ].map((layer, idx) => (
              <motion.div 
                variants={fadeUp} key={idx} 
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/40 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-secondary/50 transition-all">
                  <layer.icon size={20} className="text-secondary" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3 leading-snug">{layer.title}</h4>
                <p className="text-white/60 font-medium leading-relaxed text-sm">{layer.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. O QUE ISSO GERA PARA O PARCEIRO */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">VALOR GERADO</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              O Que Isso Gera Para O Parceiro
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Ampliação da Capacidade Consultiva', desc: 'Mais profundidade analítica e leitura executiva para atuação junto a clientes empresariais.' },
              { title: 'Posicionamento Premium', desc: 'Maior percepção de autoridade, sofisticação e maturidade institucional.' },
              { title: 'Estrutura Enterprise', desc: 'Acesso a frameworks de inteligência organizacional normalmente restritos a estruturas corporativas de alta complexidade.' },
              { title: 'Advisory Mais Estratégico', desc: 'Transformação de dados em direcionamento executivo claro e contextualizado.' },
              { title: 'Escalabilidade Intelectual', desc: 'Capacidade de ampliar atuação sem perder profundidade analítica.' }
            ].map((item, i) => (
              <div key={i} className="p-8 border border-white/10 bg-white/5 rounded-2xl flex items-start gap-6 hover:border-secondary/30 transition-colors">
                <Target className="text-secondary shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-white/70 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PARCERIA COMO ALIANÇA ESTRATÉGICA & PARA EMPRESAS */}
      <section className="py-32 px-6 relative z-10 border-b border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">PARCERIA COMO ALIANÇA</h2>
            <h3 className="text-3xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              A Illumine não busca volume de parceiros.
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Busca:</p>
            <ul className="space-y-4">
              {['Alinhamento estratégico', 'Maturidade profissional', 'Profundidade consultiva', 'Visão de longo prazo', 'Compromisso com inteligência empresarial'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span className="text-white font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-8 border-t border-white/10">
              <p className="text-xl text-white/70 font-medium">Nosso objetivo não é criar um canal comercial comum. É construir:</p>
              <p className="text-2xl text-secondary font-bold mt-4">Um ecossistema institucional de inteligência estratégica.</p>
            </div>
          </div>

          <div className="space-y-8 lg:border-l lg:border-white/10 lg:pl-16">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">EXIGÊNCIA DE MERCADO</h2>
            <h3 className="text-3xl font-medium tracking-tight text-white" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              Para empresas que exigem mais do que relatórios.
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">A nova geração de empresas precisa de:</p>
            <div className="grid grid-cols-2 gap-4">
              {['Leitura estrutural', 'Causalidade', 'Governança', 'Previsibilidade', 'Inteligência integrada', 'Clareza executiva'].map((item, i) => (
                <div key={i} className="p-4 border border-white/10 bg-white/5 rounded-xl text-center text-sm text-white font-semibold">
                  {item}
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-xl text-white font-medium">A Illumine existe para sustentar exatamente essa transformação.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-32 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
            Estruturas estratégicas precisam de <span className="text-secondary">infraestrutura institucional.</span>
          </h3>
          <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
            Se sua atuação exige profundidade analítica, inteligência integrada e capacidade consultiva enterprise-grade, talvez exista alinhamento estratégico entre sua estrutura e a arquitetura Illumine.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleCTAClick('Gostaria de Solicitar uma Aliança Estratégica')}
              className="w-full sm:w-auto h-16 px-10 rounded-md bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              <span>Solicitar Aliança Estratégica</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => handleCTAClick('Gostaria de iniciar uma Conversa Institucional')}
              className="w-full sm:w-auto h-16 px-10 rounded-md bg-transparent border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Briefcase size={20} />
              <span>Iniciar Conversa Institucional</span>
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
              onClick={() => handleCTAClick('Gostaria de Solicitar uma Aliança Estratégica')}
              className="flex items-center gap-3 px-6 h-14 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
            >
              <Briefcase size={18} />
              <span className="hidden sm:inline">Aliança Estratégica</span>
              <span className="sm:hidden">Aliança</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
