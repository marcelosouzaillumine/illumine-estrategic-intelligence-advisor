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
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('manifesto.chapter1.label')}</SectionLabel>
            <SectionTitle align="center" className="max-w-4xl">
              {t('manifesto.chapter1.title_1')}<br/>{t('manifesto.chapter1.title_2')}
            </SectionTitle>
          </div>
          <Narrative className="max-w-4xl text-center md:text-2xl text-xl leading-relaxed text-slate-400 font-medium">
            <p className="mb-4">{t('manifesto.chapter1.p1')}</p>
            <p className="mb-16">{t('manifesto.chapter1.p2')}</p>
          </Narrative>

          <div className="max-w-5xl mx-auto pt-16 border-t border-white/5 text-center">
             <h3 className="text-3xl md:text-5xl font-bold font-sans text-white tracking-tight leading-tight">
               {t('manifesto.chapter1.highlight_1')}<br/>
               <span className="text-amber-500 mt-4 block">{t('manifesto.chapter1.highlight_2')}</span>
             </h3>
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
              <div className="text-2xl md:text-3xl text-white leading-relaxed font-sans italic relative z-10 space-y-8 font-medium">
                <p>{t('manifesto.chapter3.quote_1')}</p>
                <p>{t('manifesto.chapter3.quote_2')}</p>
              </div>
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
              <h3 className="text-4xl font-bold text-white mb-6 font-sans">{t('manifesto.chapter4.c1_title')}</h3>
              <p className="text-slate-400 text-xl leading-relaxed font-sans">{t('manifesto.chapter4.c1_desc')}</p>
            </Card>
            <Card variant="secondary">
              <h3 className="text-4xl font-bold text-white mb-6 font-sans">{t('manifesto.chapter4.c2_title')}</h3>
              <p className="text-slate-400 text-xl leading-relaxed font-sans">{t('manifesto.chapter4.c2_desc')}</p>
            </Card>
            <Card variant="secondary">
              <h3 className="text-4xl font-bold text-white mb-6 font-sans">{t('manifesto.chapter4.c3_title')}</h3>
              <p className="text-slate-400 text-xl leading-relaxed font-sans">{t('manifesto.chapter4.c3_desc')}</p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CAPÍTULO 5: A Illumine */}
      <Section className="border-t border-white/5 bg-[#050506] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <SectionLabel align="center">{t('manifesto.chapter5.label')}</SectionLabel>
            <h2 className="text-6xl md:text-8xl text-white mb-8" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>
              illumine
            </h2>
            <SectionLead align="center" className="max-w-3xl">
              {t('manifesto.chapter5.lead')}
            </SectionLead>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-24">
            <Card variant="accent">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 font-sans">{t('manifesto.chapter5.c1_title')}</h3>
              <p className="text-slate-300 leading-relaxed text-xl font-sans">
                {t('manifesto.chapter5.c1_desc')}
              </p>
            </Card>
            <Card variant="accent">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 font-sans">{t('manifesto.chapter5.c2_title')}</h3>
              <p className="text-slate-300 leading-relaxed text-xl font-sans">
                {t('manifesto.chapter5.c2_desc')}
              </p>
            </Card>
          </div>

          <div className="text-center mb-16 flex flex-col items-center">
             <p className="text-white font-bold text-4xl md:text-6xl leading-tight tracking-tight font-sans">
               {brand('principle').split('.')[0]}.<br />
               <span className="text-amber-500">{brand('principle').split('.')[1]}.</span>
             </p>
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
