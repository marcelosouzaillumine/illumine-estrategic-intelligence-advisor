import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, Building2, BrainCircuit, Activity, 
  BarChart3, Scale, Layers, Target, FileText, Check, Lock, ChevronRight, Briefcase, AlertCircle
} from 'lucide-react';


// Minimal Animation Variant
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export function SalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 800) setShowSticky(true);
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
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/20 selection:text-secondary relative overflow-x-hidden">
      
      {/* Ambient Warmth (Subtle glow instead of cold empty space) */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[140px] pointer-events-none z-0" />

      {/* Navbar Minimalist but Warm */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/20 bg-background/80 backdrop-blur-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-0 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="w-[52px] h-[52px] flex items-center justify-center relative -translate-y-1">
              <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div className="flex flex-col items-center w-fit">
              <span 
                className="text-[42px] tracking-[-0.06em] text-foreground leading-[0.8]" 
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

          <div className="hidden lg:flex items-center gap-1 bg-surface-container border border-border p-1 rounded-md">
            <button className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded shadow-sm">
              Empresa
            </button>
            <button onClick={() => window.location.href = '/parceiros'} className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Parceiro
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Tese', 'Arquitetura', 'Plataforma'].map(item => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onLoginClick} className="hidden md:block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Acesso Executivo
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de agendar uma Análise Executiva Inicial')}
              className="h-10 px-6 rounded-md bg-foreground text-background font-bold text-[10px] uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center gap-2 shadow-lg shadow-foreground/5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Solicitar Análise</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-32 px-6 relative border-b border-border/20">
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={14} className="opacity-80" /> Institutional Intelligence Layer
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight leading-[1.05] text-foreground">
              Uma arquitetura de inteligência estrutural nascida da <span className="italic text-muted-foreground font-serif">consultoria executiva</span>.
            </h1>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed">
              A plataforma Illumine Strategic Intelligence & Advisory é a materialização tecnológica de toda a nossa metodologia, ciência e mentoria para o desenvolvimento de empresas sustentáveis.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => handleCTAClick('Gostaria de agendar um Diagnóstico Estrutural Confidencial')}
              className="h-14 px-8 rounded-md bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              <span>Solicitar Diagnóstico Estrutural</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. TESE ILLUMINE */}
      <section id="tese" className="py-32 px-6 border-b border-border/20 bg-surface-container/30">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-secondary/50" /> Eixo Narrativo Central <div className="w-8 h-px bg-secondary/50" />
          </h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-foreground">
            Empresas não quebram por falta de dados.<br/>
            <span className="text-muted-foreground">Quebram por ausência de leitura estrutural.</span>
          </h3>
        </div>
      </section>

      {/* 3. COLAPSO SILENCIOSO */}
      <section className="py-32 px-6 border-b border-border/20 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start relative z-10">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">
              O Colapso Silencioso
            </h2>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-snug text-foreground">
              A deterioração organizacional começa antes dos números finais aparecerem.
            </h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed w-full">
              O excesso de informação sem causalidade gera ruído executivo. Abstração e indicadores isolados mascaram a real sustentabilidade do negócio.
            </p>
          </div>

          <div className="bg-surface-container/50 border border-border/50 rounded-xl overflow-hidden shadow-2xl">
            {[
              'Crescimento consumindo caixa operacional',
              'Deterioração silenciosa da margem de contribuição',
              'Pressão estrutural no capital de giro',
              'Dependência bancária crescente',
              'Expansão sem sustentação governamental',
              'Perda estrutural de sustentabilidade e previsibilidade'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 border-b border-border/30 last:border-0 hover:bg-background transition-colors group">
                <AlertCircle size={18} className="text-secondary/50 group-hover:text-secondary shrink-0 transition-colors" />
                <span className="text-foreground font-medium text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 & 5. O QUE É / COMO PENSA (Framework Visual) */}
      <section className="py-32 px-6 border-b border-border/20 bg-[#0a0a0a] text-white relative">
        {/* Warm glow on dark background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">A Arquitetura</h2>
              <h3 className="text-3xl font-medium tracking-tight text-white">A Consultoria Embarcada</h3>
              <p className="text-lg text-white/70 font-medium leading-relaxed">
                Somos, em nossa essência, uma empresa de Mentoria e Consultoria Empresarial focada em Governança, Sucessão e Cultura. A nossa plataforma atua como o motor que escala essa expertise, embarcando ciência para transformar dados dispersos em direção estratégica.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">Lógica Operacional</h2>
              <h3 className="text-3xl font-medium tracking-tight text-white">Como a Illumine Pensa</h3>
              <p className="text-lg text-white/70 font-medium leading-relaxed">
                Nossa inteligência opera através da causalidade empresarial. Se uma decisão comercial é tomada hoje, o sistema mapeia o impacto no capital de giro e na estrutura de governança do próximo semestre.
              </p>
            </div>
          </div>

          {/* Causal Decision Flow Diagram */}
          <div className="border border-white/10 rounded-2xl p-8 bg-black/40 backdrop-blur-md shadow-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-8 text-center flex items-center justify-center gap-2">
              <Activity size={14} className="text-secondary" /> Causal Decision Flow
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors">
                <Activity className="w-6 h-6 mx-auto mb-3 text-white/50" />
                <p className="text-sm font-semibold text-white">Ação Operacional</p>
                <p className="text-xs text-white/40 mt-2">Vendas, Custos, Expansão</p>
              </div>
              <ArrowRight className="text-secondary/50 hidden md:block" />
              <div className="flex-1 border border-secondary/20 bg-secondary/5 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(233,111,61,0.1)]">
                <BrainCircuit className="w-6 h-6 mx-auto mb-3 text-secondary" />
                <p className="text-sm font-semibold text-white">Leitura Causal</p>
                <p className="text-xs text-white/60 mt-2">Interpretação Estrutural</p>
              </div>
              <ArrowRight className="text-secondary/50 hidden md:block" />
              <div className="flex-1 border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors">
                <Target className="w-6 h-6 mx-auto mb-3 text-white/50" />
                <p className="text-sm font-semibold text-white">Sustentabilidade</p>
                <p className="text-xs text-white/40 mt-2">Caixa, Margem, Risco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTELLIGENCE LAYERS */}
      <section id="arquitetura" className="py-32 px-6 border-b border-border/20 bg-surface-container/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Illumine Intelligence Stack</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground">Intelligence Layers</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Financial Engine', desc: 'Sistematização de planilhas e balanços em leituras estruturais. A base do nosso Planejamento Estratégico.', icon: BarChart3 },
              { title: 'Governance Intelligence', desc: 'Mapeamento de maturidade e blindagem estrutural derivado dos nossos serviços de Conselho.', icon: ShieldCheck },
              { title: 'Causal Engine', desc: 'Identificação matemática do impacto de ações isoladas sobre o todo. Ciência pura aplicada aos negócios.', icon: BrainCircuit },
              { title: 'Executive Scoring', desc: 'Avaliação pragmática da saúde empresarial, desenvolvida na prática com sócios e fundadores.', icon: Target },
              { title: 'Cultural Intelligence', desc: 'Análise de clima e alinhamento de RH. O software que sustenta nosso framework de Cultura Organizacional.', icon: Activity },
              { title: 'Advisory Intelligence', desc: 'Direção executiva humana: a nossa Mentoria de CEOs fundida aos frameworks da plataforma.', icon: Briefcase }
            ].map((layer, i) => (
              <div key={i} className="p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-xl hover:border-secondary/30 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-border/50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <layer.icon size={20} className="text-secondary" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">{layer.title}</h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. O QUE A ILLUMINE AJUDA A IDENTIFICAR */}
      <section className="py-32 px-6 border-b border-border/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3 mb-12">
            Identificação de Riscos Visíveis e Invisíveis
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {[
              { label: 'Erosão de Margem', text: 'Identificamos quando o volume de vendas cresce, mas a margem de contribuição real é consumida pela ineficiência estrutural.' },
              { label: 'Asfixia de Capital de Giro', text: 'Diagnosticamos o ponto exato onde a expansão operacional requer mais dinheiro do que a empresa é capaz de gerar.' },
              { label: 'Desalinhamento Diretivo', text: 'Mapeamos quando indicadores operacionais (vendas, RH) deixam de conversar com a tesouraria e o risco patrimonial.' },
              { label: 'Falta de Maturidade Governamental', text: 'Avaliamos a capacidade da organização de sustentar o crescimento sem depender exclusivamente dos sócios fundadores.' }
            ].map((item, i) => (
              <div key={i} className="space-y-3 group">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                  <Activity size={16} className="text-secondary/70 group-hover:text-secondary transition-colors" />
                  <span className="font-semibold text-lg text-foreground">{item.label}</span>
                </div>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. A PLATAFORMA & 9. GOVERNANÇA */}
      <section id="plataforma" className="py-32 px-6 border-b border-border/20 bg-surface-container/20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">A Plataforma</h2>
            <h3 className="text-3xl font-medium tracking-tight text-foreground">Infraestrutura Operacional</h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              A tecnologia não é o fim, é o meio. A plataforma proprietária da Illumine é a infraestrutura de engenharia criada para sustentar nossa leitura estrutural, gerar previsibilidade e permitir que a inteligência decisional escale sem depender de achismos ou planilhas desconectadas.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4">
              {['Diagnósticos contínuos', 'Radar executivo', 'Stress Test de Risco', 'Monitoramento Causal'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                  <Check size={14} className="text-secondary" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 border-l border-border/50 pl-0 lg:pl-16">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">Governança e Sucessão</h2>
            <h3 className="text-3xl font-medium tracking-tight text-foreground">Sustentação Estrutural</h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              O software isolado não produz governança. A união entre a nossa ferramenta de inteligência e os nossos serviços de <strong>Aconselhamento e Sucessão Familiar</strong> cria um ambiente de decisão segura. Organizamos a empresa para que conselhos e investidores consigam escalar com tranquilidade.
            </p>
          </div>
        </div>
      </section>

      {/* 10. PARA QUEM A ILLUMINE EXISTE */}
      <section className="py-32 px-6 bg-[#0a0a0a] text-white border-b border-white/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Maturidade e Seletividade</h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight">A Illumine foi desenvolvida para organizações que:</h3>
          
          <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-10 mt-10 backdrop-blur-sm">
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                'Já ultrapassaram a gestão puramente intuitiva',
                'Operam em rota de crescimento ou reestruturação',
                'Necessitam de alta previsibilidade financeira',
                'Possuem múltiplas variáveis operacionais',
                'Precisam transformar dados isolados em direção executiva',
                'Sentem pressão estrutural crescente (caixa x expansão)',
                'Desejam instituir ou refinar governança',
                'Buscando maturidade decisional absoluta'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Lock size={16} className="text-secondary shrink-0 mt-1" />
                  <span className="text-white/90 font-medium text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 11. POSICIONAMENTO FILOSÓFICO & 12. CTA FINAL */}
      <section className="py-32 px-6 bg-background relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Posicionamento Institucional</h2>
          <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight">
            “Essa não é apenas uma plataforma.<br/>
            <span className="italic font-serif text-muted-foreground">É a nossa ciência de consultoria materializada em tecnologia.”</span>
          </h3>
          
          <div className="pt-16 pb-8 border-b border-border/30" />

          <div className="space-y-8 pt-8">
            <h4 className="text-2xl font-medium tracking-tight text-foreground">
              Clareza estrutural será o ativo mais valioso das empresas na próxima década.
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleCTAClick('Gostaria de solicitar uma Análise Executiva e conhecer a arquitetura Illumine')}
                className="h-14 px-10 rounded-md bg-foreground text-background font-semibold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <span>Solicitar Análise Executiva</span>
                <ArrowRight size={16} className="text-background/70" />
              </button>
              <button
                onClick={() => scrollToSection('arquitetura')}
                className="h-14 px-10 rounded-md bg-background border border-border text-foreground font-semibold text-xs uppercase tracking-widest hover:bg-surface-container transition-all flex items-center justify-center gap-3"
              >
                <span>Conhecer a Arquitetura</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY FLOATING CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center"
          >
            <button
              onClick={() => handleCTAClick('Gostaria de iniciar uma Leitura Estratégica')}
              className="flex items-center gap-3 px-6 h-14 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl hover:bg-foreground/90 transition-all hover:scale-105"
            >
              <Briefcase size={16} className="text-secondary" />
              <span className="hidden sm:inline">Iniciar Leitura Estratégica</span>
              <span className="sm:hidden">Análise</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
