import React from 'react';
import { BookOpen, Network, FileText, Search, Combine, ArrowRight, ShieldCheck, FileSignature, Brain, Activity, Target, Library, Newspaper } from 'lucide-react';
import {
  PageFrame,
  Container,
  Hero,
  Section,
  HeroTitle,
  HeroLead,
  SectionLabel,
  SectionTitle,
  SectionLead,
  Narrative,
  Card,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalIntelligenceCenterPage() {
  const areasDeConhecimento = [
    {
      title: "Executive Briefs",
      description: "Análises objetivas sobre temas críticos para executivos e conselhos.",
      icon: Newspaper
    },
    {
      title: "White Papers",
      description: "Estudos aprofundados sobre governança, inteligência institucional e transformação organizacional.",
      icon: FileText
    },
    {
      title: "Pesquisas & Benchmarks",
      description: "Indicadores de mercado, maturidade organizacional e tendências executivas.",
      icon: Activity
    },
    {
      title: "Casos de Aplicação",
      description: "Como organizações utilizam inteligência institucional para melhorar desempenho, governança e qualidade das decisões.",
      icon: Target
    },
    {
      title: "Biblioteca Técnica",
      description: "Conteúdo voltado para especialistas, advisors e parceiros.",
      icon: Library
    }
  ];

  const linhasDePesquisa = [
    {
      title: "Governança Corporativa",
      description: "Como organizações aumentam consistência decisória."
    },
    {
      title: "Inteligência Institucional",
      description: "Como preservar conhecimento crítico."
    },
    {
      title: "Performance Financeira",
      description: "Como decisões operacionais afetam valor econômico."
    },
    {
      title: "Liderança",
      description: "Como ampliar capacidade analítica sem substituir julgamento."
    },
    {
      title: "IA Aplicada à Gestão",
      description: "Limites, oportunidades e responsabilidade executiva."
    },
    {
      title: "Estratégia",
      description: "Como organizações aprendem continuamente."
    }
  ];

  const publicacoesDestaque = [
    {
      tag: "Executive Brief",
      title: "Por que empresas inteligentes continuam tomando decisões ruins?",
      meta: "7 minutos"
    },
    {
      tag: "White Paper",
      title: "Executive Intelligence: a próxima evolução da infraestrutura corporativa",
      meta: "35 páginas"
    },
    {
      tag: "Pesquisa",
      title: "Maturidade em Governança nas Empresas Brasileiras",
      meta: "Relatório 2026"
    },
    {
      tag: "Framework",
      title: "Institutional Learning Architecture™",
      meta: "Metodologia"
    },
    {
      tag: "Estudo",
      title: "O custo da Amnésia Institucional",
      meta: "Casos de Estudo"
    }
  ];

  const frameworks = [
    {
      name: "Executive Intelligence Framework™",
      desc: "Modelo central para orquestração de inteligência decisória."
    },
    {
      name: "Institutional Learning Architecture™",
      desc: "Estrutura para captura e preservação de aprendizado organizacional."
    },
    {
      name: "Executive Decision Memory™",
      desc: "Repositório estruturado de decisões históricas e seus resultados."
    },
    {
      name: "Systemic Friction Model™",
      desc: "Diagnóstico de atritos operacionais e ineficiências latentes."
    },
    {
      name: "Trust Architecture™",
      desc: "Princípios de rastreabilidade, explicabilidade e governança de IA."
    }
  ];

  const publicos = [
    "Executivos",
    "Conselheiros",
    "Investidores",
    "Advisors",
    "Consultores",
    "Pesquisadores"
  ];

  return (
    <PageFrame>
      
      {/* Hero */}
      <Hero className="min-h-[85vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">Executive Intelligence Center™</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl leading-tight">
            Onde a inteligência executiva evolui continuamente.
          </HeroTitle>
          <Narrative className="text-xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed text-center font-sans">
            <p className="mb-6 font-medium">O Executive Intelligence Center reúne pesquisas, análises, benchmarks e frameworks produzidos para apoiar líderes, conselhos e organizações na tomada de decisões mais consistentes.</p>
            <p>Mais do que acompanhar tendências, transformamos conhecimento em instrumentos práticos de gestão, governança e criação de valor.</p>
          </Narrative>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
            <a href="#destaques" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 font-sans">
              Explorar o Centro de Inteligência <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </Container>
      </Hero>

      {/* Sec 1 */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight font-sans">
              Inteligência produzida, não apenas compartilhada.
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6 font-sans font-bold">
              Conhecimento como infraestrutura de decisão.
            </p>
            <Narrative className="text-lg text-slate-400 leading-relaxed font-sans text-center max-w-3xl">
              A Illumine entende que plataformas inteligentes precisam evoluir continuamente. Por isso, investimos na produção sistemática de conhecimento aplicado, conectando experiência executiva, pesquisa, dados e prática empresarial.
              <br/><br/>
              O Executive Intelligence Center é o ambiente onde essa inteligência é organizada, publicada e continuamente expandida.
            </Narrative>
          </div>
        </Container>
      </Section>

      {/* Sec 8 (Recomendação): Frameworks Proprietários */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <Combine className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <SectionTitle align="center">Frameworks Proprietários</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">
              Modelos intelectuais desenvolvidos pela Illumine para diagnóstico, tomada de decisão e evolução organizacional. Formamos uma biblioteca metodológica que embasa nossa arquitetura tecnológica.
            </SectionLead>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {frameworks.map((fw, idx) => (
              <Card key={idx} variant="secondary" hoverable className="p-8 border-t-4 border-t-white/10 hover:border-t-amber-500 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Network className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-500 transition-colors">{fw.name}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{fw.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sec 2: Áreas de Conhecimento */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">Áreas de Conhecimento</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">Um centro organizado por temas estratégicos.</SectionLead>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {areasDeConhecimento.map((area, idx) => {
              const Icon = area.icon;
              return (
                <Card key={idx} variant="secondary" hoverable={false} className="p-8 bg-white/5">
                  <Icon className="w-8 h-8 text-amber-500 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">{area.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Sec 3: Linhas de Pesquisa */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <Search className="w-12 h-12 text-slate-500 mx-auto mb-6" />
            <SectionTitle align="center">Linhas de Pesquisa</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">Investigamos os desafios que definirão a próxima geração da gestão.</SectionLead>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {linhasDePesquisa.map((linha, idx) => (
              <Card key={idx} variant="secondary" hoverable={false} className="p-8 bg-black/40 border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">{linha.title}</h3>
                <p className="text-slate-400 font-medium">{linha.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sec 4: Publicações em Destaque */}
      <Section className="border-t border-white/5 bg-[#050506]" id="destaques">
        <Container>
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">Publicações em Destaque</h2>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {publicacoesDestaque.map((pub, idx) => (
              <a key={idx} href="#" className="flex flex-col p-8 rounded-2xl border border-white/10 bg-[#0A0A0B] hover:border-amber-500/50 group transition-all duration-300 min-h-[240px]">
                <span className="text-xs font-bold tracking-wider text-amber-500 uppercase mb-4">{pub.tag}</span>
                <h3 className="text-2xl font-bold text-white mb-auto group-hover:text-amber-500 transition-colors">{pub.title}</h3>
                <div className="mt-8 flex items-center justify-between text-slate-500 text-sm font-medium">
                  <span>{pub.meta}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500" />
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sec 5: Centro de Pesquisa */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <Brain className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight font-sans">
              A plataforma aprende. O conhecimento evolui.
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 font-sans font-medium">
              A inteligência produzida pela Illumine nasce da combinação entre:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12 max-w-4xl mx-auto font-sans">
              {[
                "Experiência prática em organizações complexas;",
                "Estudos sobre governança e gestão;",
                "Observação contínua de padrões organizacionais;",
                "Desenvolvimento de metodologias proprietárias;",
                "Evolução permanente da plataforma."
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span className="text-lg text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xl font-bold text-amber-500 font-sans">
              Cada novo aprendizado fortalece tanto nosso conhecimento quanto a capacidade analítica da plataforma.
            </p>
          </div>
        </Container>
      </Section>

      {/* Sec 6: Para quem é este conteúdo */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight font-sans">Para quem é este conteúdo</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 font-sans">
            {publicos.map((pub, idx) => (
              <div key={idx} className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                {pub}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sec 7 & CTA */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] pt-40 pb-40">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight font-sans">
              A próxima vantagem competitiva das organizações será sua <span className="text-amber-500">capacidade de aprender institucionalmente.</span>
            </h2>
            <Narrative className="text-xl text-slate-400 leading-relaxed mb-16 font-sans font-medium text-center max-w-3xl mx-auto">
              O Executive Intelligence Center existe para acelerar essa evolução, compartilhando pesquisas, metodologias e conhecimento que contribuam para uma nova geração de organizações mais inteligentes, resilientes e preparadas para decidir.
            </Narrative>

            <Card variant="accent" hoverable={false} className="p-12 w-full max-w-4xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent backdrop-blur-sm relative overflow-hidden font-sans">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
              <h3 className="text-3xl font-bold text-white mb-4">Comece explorando nosso conhecimento.</h3>
              <p className="text-xl text-slate-400 mb-10 font-medium">Antes de conhecer a plataforma, conheça as ideias que inspiraram sua construção.</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all">
                  Ler Publicações
                </button>
                <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all">
                  Explorar Frameworks
                </button>
                <button className="px-8 py-4 bg-transparent border border-amber-500/30 text-amber-500 font-semibold rounded-full hover:bg-amber-500/10 transition-all">
                  Realizar Assessment Executivo
                </button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </PageFrame>
  );
}
