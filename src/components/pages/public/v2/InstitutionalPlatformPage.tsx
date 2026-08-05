import React from 'react';
import { Database, LineChart, Cpu, MessageSquare, Brain, ArrowRight, Layers, ShieldCheck, Activity, Eye, Zap, Network, History, FileCheck, Lock } from 'lucide-react';
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
  CardGrid,
  CardTitle,
  ReadingContent,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalPlatformPage() {
  const { t } = useTranslation('platform');
  const { t: brand } = useTranslation('brand');

  return (
    <PageFrame>
      
      {/* 1. Hero Conceitual */}
      <Hero className="min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {brand('executiveIntelligencePlatform')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-3xl mb-8">
            {t('hero.lead')}
          </HeroLead>
          
          <Narrative className="max-w-3xl text-center text-slate-400">
            <p className="text-white font-medium text-2xl mt-8 font-sans tracking-tight">
              {brand('principle').split('.')[0]}.<br />
              <span className="text-amber-500">{brand('principle').split('.')[1]}.</span>
            </p>
          </Narrative>

          <div className="mt-12">
            <Link 
              to="/dominios"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans"
            >
              {t('hero.cta_domains')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </Container>
      </Hero>

      {/* 2. Problema/contexto */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-20">
            <SectionLabel align="center">{t('sections.problem.label')}</SectionLabel>
            <SectionTitle align="center" className="max-w-4xl">
              {t('sections.problem.title_1')}<br/>{t('sections.problem.title_2')}
            </SectionTitle>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-slate-400 leading-relaxed font-sans">
            <div>
              <p className="mb-6 font-medium">
                {t('sections.problem.p1')}
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('sections.problem.list_1')}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('sections.problem.list_2')}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('sections.problem.list_3')}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('sections.problem.list_4')}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('sections.problem.list_5')}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('sections.problem.list_6')}</li>
              </ul>
              <p className="text-white font-medium text-xl">{t('sections.problem.p2')}</p>
            </div>
            <Card variant="secondary" className="p-8 md:p-12 rounded-3xl" hoverable={false}>
              <CardTitle className="text-xl mb-6 min-h-0">{t('sections.problem.card_title')}</CardTitle>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1 text-xl">?</span>
                  <span className="text-slate-300">{t('sections.problem.card_list_1')}</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1 text-xl">?</span>
                  <span className="text-slate-300">{t('sections.problem.card_list_2')}</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1 text-xl">?</span>
                  <span className="text-slate-300">{t('sections.problem.card_list_3')}</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1 text-xl">?</span>
                  <span className="text-slate-300">{t('sections.problem.card_list_4')}</span>
                </li>
              </ul>
            </Card>
          </div>
          <div className="mt-16 text-center max-w-4xl mx-auto">
            <Insight className="inline-block mx-auto border-none p-8 md:p-10 rounded-2xl bg-white/5 border border-white/10 text-center">
              {t('sections.problem.insight')}
            </Insight>
          </div>
        </Container>
      </Section>

      {/* 3. Cinco camadas da plataforma */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-24">
            <SectionLabel align="center">{t('sections.architecture.label')}</SectionLabel>
            <SectionTitle align="center">{t('sections.architecture.title_1')}<br/>{t('sections.architecture.title_2')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">
              {t('sections.architecture.lead')}
            </SectionLead>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            
            <Card variant="secondary" className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <Database className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <span className="text-amber-500 font-sans text-sm tracking-widest uppercase mb-2 block font-medium">{t('sections.architecture.layer1.tag')}</span>
                <CardTitle className="text-3xl mb-4 min-h-0">{brand('intelligenceFoundation')}</CardTitle>
                <p className="text-xl text-slate-300 font-medium mb-4 font-sans">{t('sections.architecture.layer1.desc_title')}</p>
                <Narrative className="text-lg leading-relaxed mb-6">
                  {t('sections.architecture.layer1.desc')}
                </Narrative>
                <div className="flex flex-wrap gap-3 font-sans">
                  {Object.values(t('sections.architecture.layer1.tags', { returnObjects: true }) as Record<string, string>).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400">{tag}</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card variant="secondary" className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <Cpu className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <span className="text-amber-500 font-sans text-sm tracking-widest uppercase mb-2 block font-medium">{t('sections.architecture.layer2.tag')}</span>
                <CardTitle className="text-3xl mb-4 min-h-0">{brand('intelligenceEngine')}</CardTitle>
                <p className="text-xl text-slate-300 font-medium mb-4 font-sans">{t('sections.architecture.layer2.desc_title')}</p>
                <Narrative className="text-lg leading-relaxed mb-6">
                  {t('sections.architecture.layer2.desc')}
                </Narrative>
                <div className="space-y-2 border-l-2 border-amber-500/50 pl-6 my-6 text-lg text-white font-medium font-sans">
                  <p>{t('sections.architecture.layer2.quotes.q1')}</p>
                  <p>{t('sections.architecture.layer2.quotes.q2')}</p>
                  <p>{t('sections.architecture.layer2.quotes.q3')}</p>
                </div>
              </div>
            </Card>

            <Card variant="secondary" className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <Brain className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <span className="text-amber-500 font-sans text-sm tracking-widest uppercase mb-2 block font-medium">{t('sections.architecture.layer3.tag')}</span>
                <CardTitle className="text-3xl mb-4 min-h-0">{brand('institutionalLearningArchitecture')}</CardTitle>
                <p className="text-xl text-slate-300 font-medium mb-4 font-sans">{t('sections.architecture.layer3.desc_title')}</p>
                <Narrative className="text-lg leading-relaxed mb-6">
                  {t('sections.architecture.layer3.desc')}
                </Narrative>
                <p className="text-amber-500 font-medium text-lg font-sans bg-amber-500/10 px-4 py-2 inline-block rounded-lg">
                  {t('sections.architecture.layer3.insight')}
                </p>
              </div>
            </Card>

            <Card variant="secondary" className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <Network className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <span className="text-amber-500 font-sans text-sm tracking-widest uppercase mb-2 block font-medium">{t('sections.architecture.layer4.tag')}</span>
                <CardTitle className="text-3xl mb-4 min-h-0">{brand('executiveAdvisory')}</CardTitle>
                <p className="text-xl text-slate-300 font-medium mb-4 font-sans">{t('sections.architecture.layer4.desc_title')}</p>
                <Narrative className="text-lg leading-relaxed mb-6">
                  {t('sections.architecture.layer4.desc')}
                </Narrative>
                <p className="text-amber-500 font-medium text-lg font-sans bg-amber-500/10 px-4 py-2 inline-block rounded-lg">
                  {t('sections.architecture.layer4.insight')}
                </p>
              </div>
            </Card>

            <Card variant="secondary" className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
              </div>
              <div className="w-full">
                <span className="text-amber-500 font-sans text-sm tracking-widest uppercase mb-2 block font-medium">{t('sections.architecture.layer5.tag')}</span>
                <CardTitle className="text-3xl mb-4 min-h-0">{brand('trustArchitecture')}</CardTitle>
                <p className="text-xl text-slate-300 font-medium mb-8 font-sans">{t('sections.architecture.layer5.desc_title')}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-sans">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Eye size={16} className="text-amber-500"/> {t('sections.architecture.layer5.items.i1_title')}</h5>
                    <p className="text-sm text-slate-400">{t('sections.architecture.layer5.items.i1_desc')}</p>
                  </div>
                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-sans">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2"><History size={16} className="text-amber-500"/> {t('sections.architecture.layer5.items.i2_title')}</h5>
                    <p className="text-sm text-slate-400">{t('sections.architecture.layer5.items.i2_desc')}</p>
                  </div>
                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-sans">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2"><FileCheck size={16} className="text-amber-500"/> {t('sections.architecture.layer5.items.i3_title')}</h5>
                    <p className="text-sm text-slate-400">{t('sections.architecture.layer5.items.i3_desc')}</p>
                  </div>
                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-sans">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Lock size={16} className="text-amber-500"/> {t('sections.architecture.layer5.items.i4_title')}</h5>
                    <p className="text-sm text-slate-400">{t('sections.architecture.layer5.items.i4_desc')}</p>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </Container>
      </Section>

      {/* 4. Institutional Digital Twin™ */}
      <Section className="border-t border-white/5 bg-[#050506] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('sections.digital_twin.label')}</SectionLabel>
            <SectionTitle align="center">{t('sections.digital_twin.title')}</SectionTitle>
          </div>
          <div className="max-w-6xl mx-auto">
            <Card variant="accent" className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 border-amber-500/20 bg-amber-500/5">
              <div className="flex-1 font-sans">
                <CardTitle className="text-3xl mb-6 min-h-0">{t('sections.digital_twin.desc_title')}</CardTitle>
                <Narrative className="text-lg text-slate-400 mb-8 leading-relaxed">
                  {t('sections.digital_twin.desc')}
                </Narrative>
                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                  <p className="text-amber-500 font-mono tracking-widest text-xs font-bold mb-4">{t('sections.digital_twin.box_label')}</p>
                  <p className="text-white mb-4 font-medium text-lg">{t('sections.digital_twin.box_text')}</p>
                  <ul className="text-slate-300 space-y-2 flex flex-wrap gap-4 font-medium">
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> {t('sections.digital_twin.box_items.i1')}</li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> {t('sections.digital_twin.box_items.i2')}</li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> {t('sections.digital_twin.box_items.i3')}</li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> {t('sections.digital_twin.box_items.i4')}</li>
                  </ul>
                </div>
                <p className="text-xl font-medium text-white mt-8">{t('sections.digital_twin.conclusion')}</p>
              </div>
              <div className="w-full md:w-1/3 aspect-square relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-[80px]" />
                 <Activity className="w-32 h-32 text-amber-500 relative z-10 opacity-80" />
                 <div className="absolute w-full h-full border border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
                 <div className="absolute w-[120%] h-[120%] border border-amber-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 5. Exemplo de decisão transformada */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-24">
            <SectionLabel align="center">{t('sections.practice.label')}</SectionLabel>
            <SectionTitle align="center">{t('sections.practice.title')}</SectionTitle>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                {/* Before */}
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 md:text-right flex flex-col justify-center min-h-[250px]">
                  <span className="inline-block px-3 py-1 bg-white/10 text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest mb-6 font-sans self-start md:self-end">{t('sections.practice.before_tag')}</span>
                  <p className="text-2xl font-serif italic text-slate-400">
                    {t('sections.practice.before_quote')}
                  </p>
                </div>

                {/* After */}
                <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 relative mt-8 md:mt-24 shadow-[0_0_50px_rgba(245,158,11,0.05)] flex flex-col justify-center min-h-[350px]">
                  <div className="absolute -top-4 -left-4 md:-left-8 bg-[#050506] p-2 rounded-full border border-white/10 hidden md:block">
                    <ArrowRight className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs font-bold uppercase tracking-widest mb-6 font-sans self-start">{t('sections.practice.after_tag')}</span>
                  <p className="text-xl md:text-2xl font-serif text-white leading-relaxed font-medium">
                    {t('sections.practice.after_quote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Evolução contínua */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('sections.evolution.label')}</SectionLabel>
            <SectionTitle align="center">{t('sections.evolution.title')}</SectionTitle>
            <SectionLead align="center">{t('sections.evolution.lead')}</SectionLead>
          </div>
          <CardGrid className="max-w-5xl mx-auto md:grid-cols-3 gap-6 font-sans">
            <Card className="p-8 border-t-4 border-t-amber-500 relative overflow-hidden" variant="secondary" hoverable={false}>
              <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('sections.evolution.cards.c1_tag')}</div>
              <CardTitle className="text-xl mt-6 mb-4">{t('sections.evolution.cards.c1_title')}</CardTitle>
              <Narrative className="text-slate-400 text-sm leading-relaxed">{t('sections.evolution.cards.c1_desc')}</Narrative>
            </Card>
            
            <Card className="p-8 border-t-4 border-t-white/60 relative overflow-hidden opacity-90" variant="secondary" hoverable={false}>
              <div className="absolute top-4 right-4 bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('sections.evolution.cards.c2_tag')}</div>
              <CardTitle className="text-xl mt-6 mb-4">{t('sections.evolution.cards.c2_title')}</CardTitle>
              <Narrative className="text-slate-400 text-sm leading-relaxed">{t('sections.evolution.cards.c2_desc')}</Narrative>
            </Card>

            <Card className="p-8 border-t-4 border-t-slate-500 relative overflow-hidden opacity-60" variant="secondary" hoverable={false}>
              <div className="absolute top-4 right-4 bg-white/10 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('sections.evolution.cards.c3_tag')}</div>
              <CardTitle className="text-xl mt-6 mb-4">{t('sections.evolution.cards.c3_title')}</CardTitle>
              <Narrative className="text-slate-400 text-sm leading-relaxed">{t('sections.evolution.cards.c3_desc')}</Narrative>
            </Card>
          </CardGrid>
        </Container>
      </Section>

      {/* 7. Encerramento / CTA final */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] pt-40 pb-40">
        <Container className="text-center">
          <Zap className="w-12 h-12 text-amber-500 mx-auto mb-8 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight font-sans tracking-tight max-w-4xl mx-auto">
            {t('sections.conclusion.title')}
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-16 leading-relaxed max-w-4xl mx-auto font-sans">
            {t('sections.conclusion.desc')}
          </p>
          
          <div className="mb-16">
            <p className="text-amber-500 font-sans tracking-widest uppercase mb-4 text-sm font-bold">{t('sections.conclusion.pre_title')}</p>
            <h3 className="text-3xl text-white font-bold mb-2 font-sans">{brand('executiveIntelligencePlatform')}</h3>
            <p className="text-slate-500 text-xl font-sans">{brand('principle')}</p>
          </div>

          <Link 
            to="/assessment"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg font-sans"
          >
            {t('sections.conclusion.cta')}
            <ArrowRight size={20} />
          </Link>
        </Container>
      </Section>

    </PageFrame>
  );
}
