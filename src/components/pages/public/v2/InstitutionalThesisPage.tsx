import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleDot } from 'lucide-react';
import { ExecutiveInsightCard } from './components/ExecutiveInsightCard';
import {
  PageFrame,
  Container,
  Hero,
  Section,
  HeroTitle,
  HeroLead,
  SectionLabel,
  SectionTitle,
  Narrative,
  Insight,
  ReadingContent,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalThesisPage() {
  return (
    <PageFrame>
      
      {/* Hero */}
      <Hero className="min-h-[85vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">Nossa Tese</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl leading-tight">
            A decisão executiva <br className="hidden md:block" />nunca foi tão solitária.
          </HeroTitle>
          <Narrative className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12 text-center font-sans font-medium">
            Conselhos e diretorias têm acesso a mais dados do que nunca, mas operam com menos contexto do que precisariam. Nossa tese é que a próxima grande vantagem competitiva não será ter mais dados, mas ter melhor memória e capacidade de interpretação institucional.
          </Narrative>
          <div className="flex justify-center w-full max-w-2xl">
            <Insight className="border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">Board Memo | 2026 Institutional Audit</span>
              <p className="text-slate-300 font-medium italic text-lg">
                "A erosão do contexto estratégico nas grandes corporações drena até 25% do valuation em atritos e perdas não mapeadas."
              </p>
            </Insight>
          </div>
        </Container>
      </Hero>

      {/* Tese Body */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <ReadingContent className="max-w-3xl mx-auto space-y-16">
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6 font-sans">O Fim da Era da Informação Passiva</h3>
              <p>
                Por duas décadas, as empresas focaram em capturar informações. Implementaram ERPs para garantir transações seguras. 
                Implementaram sistemas de BI para visualizar essas transações.
              </p>
              <p>
                Mas a visualização de um dado não carrega o contexto estratégico da organização. 
                Saber que o faturamento caiu não explica <strong className="text-white font-bold">por que</strong> a decisão que causou essa queda foi tomada seis meses antes.
              </p>
            </div>

            <div className="p-10 bg-[#0A0A0B] border border-white/10 rounded-3xl relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[40%] hidden xl:block w-80">
                <Insight className="border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">Learning Loop Engine</span>
                  <p className="text-slate-300 font-medium italic">
                    Amnésia Institucional mitigada. Histórico preservado na memória central fiduciária.
                  </p>
                  <span className="text-xs text-slate-500 block mt-3 uppercase tracking-wider font-bold">Continuous Intelligence</span>
                </Insight>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-sans">
                <CircleDot className="text-amber-500 w-6 h-6" />
                O Institutional Learning Loop™
              </h3>
              <p className="text-slate-400 font-sans text-lg leading-relaxed font-medium">
                Na Illumine, acreditamos que organizações não devem apenas operar; elas devem aprender. 
                Propomos uma arquitetura que captura as consequências das decisões operacionais e as realimenta nas 
                deliberações estratégicas do Conselho. O erro de ontem vira a premissa calibrada de amanhã.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6 font-sans">Inteligência que Amplia</h3>
              <p>
                A inteligência corporativa não deve ser projetada para substituir a intuição e a coragem do líder executivo. 
                O papel da tecnologia é reduzir a sobrecarga cognitiva e assegurar que a governança está sendo respeitada, liberando a mente do executivo para o que importa: <strong className="text-white font-bold">visão, estratégia e relacionamento</strong>.
              </p>
              <p>
                Nós não construímos apenas uma tecnologia. Nós desenvolvemos a primeira Executive Intelligence Platform™ do mundo, desenhada especificamente para suportar a complexidade do alto escalão.
              </p>
            </div>
            
          </ReadingContent>
        </Container>
      </Section>

      {/* Assinatura Final */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] pt-32 pb-32">
        <Container className="text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight font-sans tracking-tight">
              A inteligência amplia.<br />
              <span className="text-slate-500 font-medium">A decisão permanece humana.</span>
            </h2>
            <Link 
              to="/plataforma"
              className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300 text-lg font-sans"
            >
              Entenda a Arquitetura da Plataforma
              <ArrowRight size={20} />
            </Link>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
