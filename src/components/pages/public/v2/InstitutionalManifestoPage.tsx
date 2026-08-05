import React from 'react';
import { Database, LineChart, Cpu, MessageSquare, Brain, ArrowRight, Combine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Insight,
  Card,
  CardTitle,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';
import { EvolutionTimeline } from './EvolutionTimeline';

export function InstitutionalManifestoPage() {
  const { t } = useTranslation('institutional');
  const { t: brand } = useTranslation('brand');

  return (
    <PageFrame>
      
      {/* HERO */}
      <Hero className="min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('manifesto.hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {t('manifesto.hero.title_1')}<br/>{t('manifesto.hero.title_2')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-3xl">
            {t('manifesto.hero.lead_1')}<br/>{t('manifesto.hero.lead_2')}
          </HeroLead>
          <Narrative className="max-w-3xl text-slate-400 mt-4 text-center">
            {t('manifesto.hero.narrative')}
          </Narrative>
        </Container>
      </Hero>

      {/* CAPÍTULO 1: O Problema */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
            
            {/* Left Column: Refined Editorial Title */}
            <div className="block w-full lg:pr-8">
              {/* Premium Label */}
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">{t('manifesto.chapter1.label')}</span>
              </div>

              <SectionTitle align="left" className="!mb-0">
                {t('manifesto.chapter1.title_1')}<br/>
                <span className="text-amber-500 italic font-serif">
                  {t('manifesto.chapter1.title_2')}
                </span>
              </SectionTitle>

              {/* Premium Bottom Highlight with Frame (Moldura) moved under the title */}
              <div className="w-full mt-12 lg:mt-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 lg:p-10 relative overflow-hidden group backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.04]">
                 {/* Subtle glowing orb in the corner */}
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-colors duration-1000 pointer-events-none" />
                 {/* Top edge highlight */}
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                 
                 <SectionLead align="left" className="font-light text-slate-300 tracking-wide relative z-10 !mb-0 max-w-none text-xl lg:text-2xl leading-relaxed">
                   {t('manifesto.chapter1.highlight_1')}
                   <span className="text-amber-500 mt-6 block font-serif italic text-2xl lg:text-[28px] font-medium tracking-wide">{t('manifesto.chapter1.highlight_2')}</span>
                 </SectionLead>
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="w-full min-w-0 lg:pt-4 flex flex-col justify-center">
              <Narrative className="text-left font-light">
                <p className="mb-8 text-white font-medium text-2xl lg:text-4xl leading-snug tracking-tight">{t('manifesto.chapter1.p1')}</p>
                <p className="text-slate-400 text-xl lg:text-2xl leading-relaxed">{t('manifesto.chapter1.p2')}</p>
              </Narrative>
            </div>
          </div>
        </Container>
      </Section>

      {/* CAPÍTULO 2: A Evolução das Eras */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-20">
            <SectionLabel align="center">{t('manifesto.chapter2.label')}</SectionLabel>
            <SectionTitle align="center">{t('manifesto.chapter2.title')}</SectionTitle>
          </div>
          
          <EvolutionTimeline />
        </Container>
      </Section>

      {/* CAPÍTULO 3: Amnésia Institucional */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('manifesto.chapter3.label')}</SectionLabel>
            <SectionTitle align="center">{t('manifesto.chapter3.title')}</SectionTitle>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden" variant="secondary" hoverable={false}>
              <div className="absolute top-0 right-0 opacity-5 p-12"><Combine size={150} /></div>
              <Narrative className="text-xl md:text-2xl text-slate-300 italic relative z-10 space-y-6 font-light">
                <p>{t('manifesto.chapter3.quote_1')}</p>
                <p>{t('manifesto.chapter3.quote_2')}</p>
              </Narrative>
              <Insight className="mt-16 relative z-10 border-l-0 border-t bg-transparent p-0 pt-8 mt-12 md:p-0 md:pt-12 text-slate-400">
                {t('manifesto.chapter3.insight')}
              </Insight>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CAPÍTULO 4: A Nova Tese */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-20">
            <SectionLabel align="center">{t('manifesto.chapter4.label')}</SectionLabel>
            <SectionTitle align="center" className="max-w-4xl">{t('manifesto.chapter4.title')}</SectionTitle>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <Card variant="secondary">
              <CardTitle>{t('manifesto.chapter4.c1_title')}</CardTitle>
              <Narrative className="text-lg text-slate-400 font-light">{t('manifesto.chapter4.c1_desc')}</Narrative>
            </Card>
            <Card variant="secondary">
              <CardTitle>{t('manifesto.chapter4.c2_title')}</CardTitle>
              <Narrative className="text-lg text-slate-400 font-light">{t('manifesto.chapter4.c2_desc')}</Narrative>
            </Card>
            <Card variant="secondary">
              <CardTitle>{t('manifesto.chapter4.c3_title')}</CardTitle>
              <Narrative className="text-lg text-slate-400 font-light">{t('manifesto.chapter4.c3_desc')}</Narrative>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CAPÍTULO 5: A Illumine */}
      <Section className="border-t border-white/5 bg-[#050506] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
            <SectionLabel align="center">{t('manifesto.chapter5.label')}</SectionLabel>
            <HeroTitle className="mb-8 lowercase tracking-tight md:text-8xl" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              illumine
            </HeroTitle>
            <SectionLead align="center" className="max-w-3xl">
              {t('manifesto.chapter5.lead')}
            </SectionLead>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-24">
            <Card variant="accent">
              <CardTitle className="lg:min-h-[4rem] flex items-start">{t('manifesto.chapter5.c1_title')}</CardTitle>
              <Narrative className="text-xl text-slate-300">{t('manifesto.chapter5.c1_desc')}</Narrative>
            </Card>
            <Card variant="accent">
              <CardTitle className="lg:min-h-[4rem] flex items-start">{t('manifesto.chapter5.c2_title')}</CardTitle>
              <Narrative className="text-xl text-slate-300">{t('manifesto.chapter5.c2_desc')}</Narrative>
            </Card>
          </div>

          <div className="text-center mb-16 flex flex-col items-center">
             <HeroTitle align="center" className="!mb-0">
               {brand('principle').split('.')[0]}.<br />
               <span className="text-amber-500">{brand('principle').split('.')[1]}.</span>
             </HeroTitle>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/plataforma"
              className="px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg font-sans"
            >
              {t('hero.cta_secondary')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
