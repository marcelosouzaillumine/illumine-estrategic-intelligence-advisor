import React from 'react';
import { BookOpen, Network, FileText, Search, Combine, ArrowRight, ShieldCheck, FileSignature, Brain, Activity, Target, Library, Newspaper } from 'lucide-react';
import {
  PageFrame,
  Container,
  Hero,
  Section,
  HeroTitle,
  SectionLabel,
  SectionTitle,
  SectionLead,
  Narrative,
  Card,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';
import { useTranslation } from 'react-i18next';

export function InstitutionalIntelligenceCenterPage() {
  const { t } = useTranslation('intelligence-center');
  const areasDeConhecimento = [
    {
      title: t('knowledge_areas.items.0.title'),
      description: t('knowledge_areas.items.0.description'),
      icon: Newspaper
    },
    {
      title: t('knowledge_areas.items.1.title'),
      description: t('knowledge_areas.items.1.description'),
      icon: FileText
    },
    {
      title: t('knowledge_areas.items.2.title'),
      description: t('knowledge_areas.items.2.description'),
      icon: Activity
    },
    {
      title: t('knowledge_areas.items.3.title'),
      description: t('knowledge_areas.items.3.description'),
      icon: Target
    },
    {
      title: t('knowledge_areas.items.4.title'),
      description: t('knowledge_areas.items.4.description'),
      icon: Library
    }
  ];

  const linhasDePesquisa = [
    {
      title: t('research_lines.items.0.title'),
      description: t('research_lines.items.0.description')
    },
    {
      title: t('research_lines.items.1.title'),
      description: t('research_lines.items.1.description')
    },
    {
      title: t('research_lines.items.2.title'),
      description: t('research_lines.items.2.description')
    },
    {
      title: t('research_lines.items.3.title'),
      description: t('research_lines.items.3.description')
    },
    {
      title: t('research_lines.items.4.title'),
      description: t('research_lines.items.4.description')
    },
    {
      title: t('research_lines.items.5.title'),
      description: t('research_lines.items.5.description')
    }
  ];

  const publicacoesDestaque = [
    {
      tag: t('publications.items.0.tag'),
      title: t('publications.items.0.title'),
      meta: t('publications.items.0.meta')
    },
    {
      tag: t('publications.items.1.tag'),
      title: t('publications.items.1.title'),
      meta: t('publications.items.1.meta')
    },
    {
      tag: t('publications.items.2.tag'),
      title: t('publications.items.2.title'),
      meta: t('publications.items.2.meta')
    },
    {
      tag: t('publications.items.3.tag'),
      title: t('publications.items.3.title'),
      meta: t('publications.items.3.meta')
    },
    {
      tag: t('publications.items.4.tag'),
      title: t('publications.items.4.title'),
      meta: t('publications.items.4.meta')
    }
  ];

  const frameworks = [
    {
      name: t('frameworks.items.0.name'),
      desc: t('frameworks.items.0.desc')
    },
    {
      name: t('frameworks.items.1.name'),
      desc: t('frameworks.items.1.desc')
    },
    {
      name: t('frameworks.items.2.name'),
      desc: t('frameworks.items.2.desc')
    },
    {
      name: t('frameworks.items.3.name'),
      desc: t('frameworks.items.3.desc')
    },
    {
      name: t('frameworks.items.4.name'),
      desc: t('frameworks.items.4.desc')
    }
  ];

  const publicos = t('audience.items', { returnObjects: true }) as string[];

  return (
    <PageFrame>
      
      {/* Hero */}
      <Hero className="min-h-[85vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl leading-tight">
            {t('hero.title')}
          </HeroTitle>
          <Narrative className="text-xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed text-center font-sans">
            <p className="mb-6 font-medium">{t('hero.narrative_1')}</p>
            <p>{t('hero.narrative_2')}</p>
          </Narrative>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
            <a href="#destaques" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 font-sans">
              {t('hero.cta')} <ArrowRight className="w-5 h-5" />
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
              {t('knowledge_production.title')}
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6 font-sans font-bold">
              {t('knowledge_production.subtitle')}
            </p>
            <Narrative className="text-lg text-slate-400 leading-relaxed font-sans text-center max-w-3xl" dangerouslySetInnerHTML={{ __html: t('knowledge_production.narrative') }} />
          </div>
        </Container>
      </Section>

      {/* Sec 8 (Recomendação): Frameworks Proprietários */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <Combine className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <SectionTitle align="center">{t('frameworks.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">
              {t('frameworks.lead')}
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
            <SectionTitle align="center">{t('knowledge_areas.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('knowledge_areas.lead')}</SectionLead>
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
            <SectionTitle align="center">{t('research_lines.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('research_lines.lead')}</SectionLead>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">{t('publications.title')}</h2>
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
              {t('research_center.title')}
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 font-sans font-medium">
              {t('research_center.lead')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12 max-w-4xl mx-auto font-sans">
              {(t('research_center.items', { returnObjects: true }) as string[]).map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span className="text-lg text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xl font-bold text-amber-500 font-sans">
              {t('research_center.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Sec 6: Para quem é este conteúdo */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight font-sans">{t('audience.title')}</h2>
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
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight font-sans" dangerouslySetInnerHTML={{
              __html: t('cta.title').replace('<highlight>', '<span class="text-amber-500">').replace('</highlight>', '</span>')
            }} />
            <Narrative className="text-xl text-slate-400 leading-relaxed mb-16 font-sans font-medium text-center max-w-3xl mx-auto">
              {t('cta.narrative')}
            </Narrative>

            <Card variant="accent" hoverable={false} className="p-12 w-full max-w-4xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent backdrop-blur-sm relative overflow-hidden font-sans">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
              <h3 className="text-3xl font-bold text-white mb-4">{t('cta.card_title')}</h3>
              <p className="text-xl text-slate-400 mb-10 font-medium">{t('cta.card_lead')}</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all">
                  {t('cta.btn_publications')}
                </button>
                <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all">
                  {t('cta.btn_frameworks')}
                </button>
                <button className="px-8 py-4 bg-transparent border border-amber-500/30 text-amber-500 font-semibold rounded-full hover:bg-amber-500/10 transition-all">
                  {t('cta.btn_assessment')}
                </button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </PageFrame>
  );
}
