const fs = require('fs');

const newComponent = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, Building2, BrainCircuit, Activity, 
  BarChart3, Scale, Layers, Target, FileText, Check, Lock, ChevronRight, Briefcase
} from 'lucide-react';

// Helper Logo
function IllumineMark({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <line x1="30" y1="30" x2="22" y2="22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="70" x2="22" y2="78" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="82" x2="50" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="70" x2="78" y2="78" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 22 C 34.5 22, 22 34.5, 22 50 C 22 65.5, 34.5 78, 50 78 C 65.5 78, 78 65.5, 78 50 M50 50 L75 25 M75 25 L65 25 M75 25 L75 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Minimal Animation Variant
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
    window.open(\`https://wa.me/554131514537?text=\${encodeURIComponent(message)}\`, '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-foreground font-sans selection:bg-foreground selection:text-background">
      
      {/* Navbar Minimalist */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/30 bg-background/90 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <IllumineMark className="w-8 h-8 text-foreground group-hover:opacity-80 transition-opacity" />
            <div className="flex flex-col select-none">
              <span className="text-xl font-medium tracking-tight text-foreground leading-none">
                illumine
              </span>
              <div className="text-[6px] text-muted-foreground uppercase mt-1 tracking-[0.2em] font-semibold">
                Intelligence Architecture
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-muted/30 border border-border/50 p-1 rounded">
            <button className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background rounded shadow-sm">
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
            <button onClick={onLoginClick} className="hidden md:block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Acesso Executivo
            </button>
            <button 
              onClick={() => handleCTAClick('Gostaria de agendar uma Análise Executiva Inicial')}
              className="h-10 px-6 rounded bg-foreground text-background font-bold text-[10px] uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Solicitar Análise</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-32 px-6 relative border-b border-border/30">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Institutional Intelligence Layer
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight leading-[1.1] text-foreground">
              Uma arquitetura de <span className="italic text-muted-foreground font-serif">inteligência estrutural</span> empresarial.
            </h1>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed">
              A plataforma Illumine é a infraestrutura operacional que conecta clareza estrutural, causalidade empresarial e inteligência decisional para organizações maduras.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => handleCTAClick('Gostaria de agendar um Diagnóstico Estrutural Confidencial')}
              className="h-14 px-8 rounded bg-foreground text-background font-semibold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center gap-3"
            >
              <span>Solicitar Diagnóstico Estrutural</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. TESE ILLUMINE */}
      <section id="tese" className="py-32 px-6 border-b border-border/30 bg-muted/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Eixo Narrativo Central</h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-foreground">
            Empresas não quebram por falta de dados.<br/>
            <span className="text-muted-foreground">Quebram por ausência de leitura estrutural.</span>
          </h3>
        </div>
      </section>

      {/* 3. COLAPSO SILENCIOSO */}
      <section className="py-32 px-6 border-b border-border/30">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-l border-foreground pl-3">
              O Colapso Silencioso
            </h2>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-snug text-foreground">
              A deterioração organizacional começa antes dos números finais aparecerem.
            </h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed w-full">
              O excesso de informação sem causalidade gera ruído executivo. Abstração e indicadores isolados mascaram a real sustentabilidade do negócio.
            </p>
          </div>

          <div className="border border-border/50 bg-background rounded-sm">
            {[
              'Crescimento consumindo caixa operacional',
              'Deterioração silenciosa da margem de contribuição',
              'Pressão estrutural no capital de giro',
              'Dependência bancária crescente',
              'Expansão sem sustentação governamental',
              'Perda estrutural de sustentabilidade e previsibilidade'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                <AlertCircle size={18} className="text-muted-foreground shrink-0" />
                <span className="text-foreground font-medium text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 & 5. O QUE É / COMO PENSA (Framework Visual) */}
      <section className="py-32 px-6 border-b border-border/30 bg-[#050505] text-white">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50 border-l border-white/50 pl-3">A Arquitetura</h2>
              <h3 className="text-3xl font-medium tracking-tight">O que é a Illumine</h3>
              <p className="text-lg text-white/70 font-medium leading-relaxed">
                Não somos um dashboard analítico ou um ERP. A Illumine é um sistema executivo projetado para transformar dados dispersos em direção estratégica. Conectamos as variáveis de caixa, margem e risco para entregar clareza decisional absoluta.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50 border-l border-white/50 pl-3">Lógica Operacional</h2>
              <h3 className="text-3xl font-medium tracking-tight">Como a Illumine Pensa</h3>
              <p className="text-lg text-white/70 font-medium leading-relaxed">
                Nossa inteligência opera através da causalidade empresarial. Se uma decisão comercial é tomada hoje, o sistema mapeia o impacto no capital de giro e na estrutura de governança do próximo semestre.
              </p>
            </div>
          </div>

          {/* Causal Decision Flow Diagram */}
          <div className="border border-white/10 rounded-sm p-8 bg-black/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-8 text-center">Causal Decision Flow</p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 border border-white/20 p-6 text-center">
                <Activity className="w-6 h-6 mx-auto mb-3 opacity-70" />
                <p className="text-sm font-semibold">Ação Operacional</p>
                <p className="text-xs text-white/50 mt-2">Vendas, Custos, Expansão</p>
              </div>
              <ArrowRight className="text-white/30 hidden md:block" />
              <div className="flex-1 border border-white/20 p-6 text-center bg-white/5">
                <BrainCircuit className="w-6 h-6 mx-auto mb-3 opacity-70" />
                <p className="text-sm font-semibold">Leitura Causal (Illumine)</p>
                <p className="text-xs text-white/50 mt-2">Interpretação Estrutural</p>
              </div>
              <ArrowRight className="text-white/30 hidden md:block" />
              <div className="flex-1 border border-white/20 p-6 text-center">
                <Target className="w-6 h-6 mx-auto mb-3 opacity-70" />
                <p className="text-sm font-semibold">Sustentabilidade</p>
                <p className="text-xs text-white/50 mt-2">Caixa, Margem, Risco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTELLIGENCE LAYERS */}
      <section id="arquitetura" className="py-32 px-6 border-b border-border/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Illumine Intelligence Stack</h2>
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight">Intelligence Layers</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border/50">
            {[
              { title: 'Financial Engine', desc: 'Sistematização de planilhas e balanços em leituras estruturais de caixa e margem.', icon: BarChart3 },
              { title: 'Governance Intelligence', desc: 'Mapeamento de maturidade operacional e blindagem corporativa estrutural.', icon: ShieldCheck },
              { title: 'Causal Engine', desc: 'Identificação matemática do impacto de ações isoladas sobre o todo.', icon: BrainCircuit },
              { title: 'Executive Scoring', desc: 'Avaliação pragmática da saúde empresarial orientada a conselhos e sócios.', icon: Target },
              { title: 'Stress Analysis', desc: 'Simulação de resiliência: até onde sua operação aguenta a pressão de mercado.', icon: Activity },
              { title: 'Advisory Intelligence', desc: 'Direção executiva humana guiada pelos frameworks de inteligência da plataforma.', icon: Briefcase }
            ].map((layer, i) => (
              <div key={i} className="p-10 border-b border-r border-border/50 bg-background hover:bg-muted/20 transition-colors">
                <layer.icon size={20} className="text-foreground mb-6" />
                <h4 className="text-lg font-semibold mb-3">{layer.title}</h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. O QUE A ILLUMINE AJUDA A IDENTIFICAR (Tangibilidade) */}
      <section className="py-32 px-6 border-b border-border/30 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-l border-foreground pl-3 mb-12">
            Identificação de Riscos Visíveis e Invisíveis
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {[
              { label: 'Erosão de Margem', text: 'Identificamos quando o volume de vendas cresce, mas a margem de contribuição real é consumida pela ineficiência estrutural.' },
              { label: 'Asfixia de Capital de Giro', text: 'Diagnosticamos o ponto exato onde a expansão operacional requer mais dinheiro do que a empresa é capaz de gerar.' },
              { label: 'Desalinhamento Diretivo', text: 'Mapeamos quando indicadores operacionais (vendas, RH) deixam de conversar com a tesouraria e o risco patrimonial.' },
              { label: 'Falta de Maturidade Governamental', text: 'Avaliamos a capacidade da organização de sustentar o crescimento sem depender exclusivamente dos sócios fundadores.' }
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                  <Activity size={16} className="text-foreground" />
                  <span className="font-semibold text-lg">{item.label}</span>
                </div>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. A PLATAFORMA & 9. GOVERNANÇA */}
      <section id="plataforma" className="py-32 px-6 border-b border-border/30">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-l border-foreground pl-3">A Plataforma</h2>
            <h3 className="text-3xl font-medium tracking-tight">Infraestrutura Operacional</h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              A plataforma Illumine não é o fim, é o meio. Trata-se da infraestrutura de engenharia e tecnologia criada para sustentar a leitura estrutural, gerar previsibilidade e permitir que a inteligência decisional escale com segurança, sem depender de "achismos" ou planilhas desconectadas.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4">
              {['Diagnósticos contínuos', 'Radar executivo', 'Stress Test de Risco', 'Monitoramento Causal'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold">
                  <Check size={14} /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 border-l border-border/50 pl-0 lg:pl-20">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-l border-foreground pl-3">Governança e Maturidade</h2>
            <h3 className="text-3xl font-medium tracking-tight">Sustentação Estrutural</h3>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              O software isolado não produz governança. A união entre a leitura da nossa plataforma e a maturidade dos nossos *frameworks* cria um ambiente de decisão segura. Organizamos a empresa para que sócios e investidores consigam observar a estrutura com total neutralidade.
            </p>
          </div>
        </div>
      </section>

      {/* 10. PARA QUEM A ILLUMINE EXISTE (Qualificação Seletiva) */}
      <section className="py-32 px-6 bg-[#050505] text-white border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Maturidade e Seletividade</h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-tight">A Illumine foi desenvolvida para organizações que:</h3>
          
          <div className="text-left bg-white/5 border border-white/10 p-10 mt-10">
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
                  <Lock size={16} className="text-white/40 shrink-0 mt-1" />
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
            <span className="italic font-serif text-muted-foreground">É uma arquitetura institucional de inteligência empresarial.”</span>
          </h3>
          
          <div className="pt-16 pb-8 border-b border-border/50" />

          <div className="space-y-8 pt-8">
            <h4 className="text-2xl font-medium tracking-tight text-foreground">
              Clareza estrutural será o ativo mais valioso das empresas na próxima década.
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleCTAClick('Gostaria de solicitar uma Análise Executiva e conhecer a arquitetura Illumine')}
                className="h-14 px-10 rounded bg-foreground text-background font-semibold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center gap-3"
              >
                <span>Solicitar Análise Executiva</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('arquitetura')}
                className="h-14 px-10 rounded bg-background border border-border text-foreground font-semibold text-xs uppercase tracking-widest hover:bg-muted/50 transition-all flex items-center justify-center gap-3"
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
              className="flex items-center gap-3 px-6 h-14 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded shadow-xl hover:bg-foreground/90 transition-all"
            >
              <Briefcase size={16} />
              <span className="hidden sm:inline">Iniciar Leitura Estratégica</span>
              <span className="sm:hidden">Análise</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
`;

fs.writeFileSync('src/components/pages/SalesPage.tsx', newComponent, 'utf8');
console.log("SalesPage completely restructured into Enterprise-Grade Architecture.");
