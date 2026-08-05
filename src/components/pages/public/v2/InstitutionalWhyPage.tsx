import React from 'react';
import { ArrowRight, Combine, Brain, Eye, Activity, Database, Users, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
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

export function InstitutionalWhyPage() {
  const { t } = useTranslation('institutional');

  const comparisons = t('why.paradigm.comparisons', { returnObjects: true }) as { old: string; new: string }[];

  const capabilities = [
    {
      title: t('why.capabilities.items.0.title'),
      description: t('why.capabilities.items.0.description'),
      icon: Brain
    },
    {
      title: t('why.capabilities.items.1.title'),
      description: t('why.capabilities.items.1.description'),
      icon: Database
    },
    {
      title: t('why.capabilities.items.2.title'),
      description: t('why.capabilities.items.2.description'),
      icon: Combine
    },
    {
      title: t('why.capabilities.items.3.title'),
      description: t('why.capabilities.items.3.description'),
      icon: Eye
    },
    {
      title: t('why.capabilities.items.4.title'),
      description: t('why.capabilities.items.4.description'),
      icon: Activity
    }
  ];

  const profiles = t('why.profiles_results.profiles_items', { returnObjects: true }) as string[];

  const results = t('why.profiles_results.results_items', { returnObjects: true }) as string[];

  const systems = t('why.fragmentation.systems', { returnObjects: true }) as string[];

  const tags = t('why.architecture.tags', { returnObjects: true }) as string[];

  return (
    <PageFrame>
      
      {/* Hero */}
      <Hero className="min-h-[80vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('why.hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {t('why.hero.title')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-4xl mb-8">
            {t('why.hero.lead')}
          </HeroLead>
          <div className="mt-12">
            <a href="#diferencial" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans">
              {t('why.hero.cta')}
              <ArrowRight size={20} />
            </a>
          </div>
        </Container>
      </Hero>

      {/* Section 1: Fragmentação */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]" id="diferencial">
        <Container className="text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-sans">
              {t('why.fragmentation.title')}<br/><span className="text-amber-500">{t('why.fragmentation.title_highlight')}</span>
            </h2>
            <Narrative className="max-w-3xl text-xl text-slate-400 mb-16 leading-relaxed text-center font-sans">
              {t('why.fragmentation.narrative')}
            </Narrative>
            <div className="flex flex-wrap justify-center gap-4">
              {systems.map((sys, idx) => (
                <div key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 font-mono text-sm">
                  {sys}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 2: O que torna a Illumine diferente */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('why.paradigm.label')}</SectionLabel>
            <SectionTitle align="center">{t('why.paradigm.title')}</SectionTitle>
            <SectionLead align="center">{t('why.paradigm.lead')}</SectionLead>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0A0A0B] border border-white/10 rounded-3xl overflow-hidden shadow-2xl font-sans">
              {/* Header */}
              <div className="grid grid-cols-2 border-b border-white/10 bg-black/40">
                <div className="p-6 md:p-8 text-center border-r border-white/10">
                  <span className="text-slate-500 font-bold tracking-widest uppercase text-xs md:text-sm">{t('why.paradigm.table.col1')}</span>
                </div>
                <div className="p-6 md:p-8 text-center bg-amber-500/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                  <span className="text-amber-500 font-bold tracking-widest uppercase text-xs md:text-sm">{t('why.paradigm.table.col2')}</span>
                </div>
              </div>
              
              {/* Rows */}
              <div className="divide-y divide-white/5">
                {comparisons.map((comp, idx) => (
                  <div key={idx} className="grid grid-cols-2 hover:bg-white/5 transition-colors">
                    <div className="p-6 md:p-8 flex items-center justify-center text-center border-r border-white/10">
                      <span className="text-slate-400 line-through decoration-slate-600 decoration-1 text-sm md:text-base">{comp.old}</span>
                    </div>
                    <div className="p-6 md:p-8 flex items-center justify-center text-center bg-amber-500/[0.02]">
                      <span className="text-white font-medium flex items-center gap-2 text-sm md:text-base">
                        <ChevronRight className="w-4 h-4 text-amber-500 hidden md:block" />
                        {comp.new}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: Arquitetura de Decisão */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-sans">
                {t('why.architecture.title')}<br/><span className="text-slate-400">{t('why.architecture.title_highlight')}</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-8 font-sans font-medium">
                {t('why.architecture.narrative')}
              </p>
              <div className="flex flex-wrap gap-3 font-sans">
                {tags.map((item, idx) => (
                  <span key={idx} className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-sm font-bold tracking-wide">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
               <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] shrink-0 relative flex items-center justify-center">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.1),_transparent_60%)]" />

                  {/* SVG Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                     <line x1="50%" y1="50%" x2="15%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                     <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                     <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                     <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />
                     <line x1="50%" y1="50%" x2="10%" y2="55%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                     <line x1="50%" y1="50%" x2="90%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                  </svg>

                  {/* Central Hub */}
                  <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#0A0A0B] border border-amber-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                     <div className="absolute inset-0 rounded-3xl border border-amber-500/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                     <Combine className="w-10 h-10 md:w-14 md:h-14 text-amber-500" />
                  </div>

                  {/* Outer Nodes */}
                  <div className="absolute top-[25%] left-[15%] w-10 h-10 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#050506] border border-white/10 flex items-center justify-center z-10 shadow-lg" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                     <Database className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                  </div>

                  <div className="absolute top-[20%] left-[85%] w-8 h-8 md:w-10 md:h-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#050506] border border-white/10 flex items-center justify-center z-10 shadow-lg" style={{ animation: 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s' }}>
                     <Activity className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                  </div>

                  <div className="absolute top-[75%] left-[20%] w-12 h-12 md:w-14 md:h-14 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#050506] border border-white/10 flex items-center justify-center z-10 shadow-lg" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s' }}>
                     <Users className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                  </div>

                  <div className="absolute top-[80%] left-[75%] w-10 h-10 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-amber-500/5 border border-amber-500/30 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(245,158,11,0.15)]" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s' }}>
                     <Brain className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  </div>

                  <div className="absolute top-[55%] left-[10%] w-8 h-8 md:w-10 md:h-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#050506] border border-white/10 flex items-center justify-center z-10 shadow-lg" style={{ animation: 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.5s' }}>
                     <Eye className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                  </div>

                  <div className="absolute top-[60%] left-[90%] w-10 h-10 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#050506] border border-white/10 flex items-center justify-center z-10 shadow-lg" style={{ animation: 'pulse 4.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.2s' }}>
                     <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: 5 Capacidades */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('why.capabilities.label')}</SectionLabel>
            <SectionTitle align="center">{t('why.capabilities.title')}</SectionTitle>
            <SectionLead align="center">{t('why.capabilities.lead')}</SectionLead>
          </div>
          
          <CardGrid className="max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-3 font-sans">
            {capabilities.map((cap, idx) => (
              <Card key={idx} variant="secondary" hoverable className="p-8 border-t-4 border-t-white/10 hover:border-t-amber-500 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <cap.icon className="w-6 h-6 text-amber-500" />
                </div>
                <CardTitle className="text-xl mb-3">{cap.title}</CardTitle>
                <Narrative className="text-slate-400 font-medium">{cap.description}</Narrative>
              </Card>
            ))}
          </CardGrid>
        </Container>
      </Section>

      {/* Section 5: Liderança */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight font-sans">
              {t('why.leadership.title')} <br/>
              <span className="text-amber-500">{t('why.leadership.title_highlight')}</span>
            </h2>
            <Narrative className="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed text-center font-sans font-medium">
              {t('why.leadership.narrative')}
            </Narrative>
          </div>
        </Container>
      </Section>

      {/* Section 6 & 7: Para Quem & Resultados */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 font-sans">
            
            {/* Para Quem */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">{t('why.profiles_results.profiles_label')}</span>
              <h3 className="text-3xl font-bold text-white mb-4">{t('why.profiles_results.profiles_title')}</h3>
              <p className="text-slate-400 mb-8 font-medium">{t('why.profiles_results.profiles_lead')}</p>
              
              <ul className="space-y-4">
                {profiles.map((profile, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 mt-0.5 rounded bg-white/5 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    </div>
                    <span className="text-slate-300 text-lg font-medium">{profile}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resultados */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">{t('why.profiles_results.results_label')}</span>
              <h3 className="text-3xl font-bold text-white mb-4">{t('why.profiles_results.results_title')}</h3>
              <p className="text-slate-400 mb-8 font-medium">{t('why.profiles_results.results_lead')}</p>
              
              <div className="grid gap-4">
                {results.map((result, idx) => (
                  <Card key={idx} variant="secondary" hoverable={false} className="p-5 flex items-center gap-4 bg-black/40">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-white font-medium">{result}</span>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* CTA Final */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] pt-40 pb-40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-sans tracking-tight">
              {t('why.conclusion.title')}
            </h2>
            <p className="text-2xl text-slate-300 mb-16 font-sans font-medium">
              {t('why.conclusion.lead')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/assessment"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg inline-flex justify-center items-center gap-2 font-sans"
              >
                {t('why.conclusion.cta1')}
                <ArrowRight size={20} />
              </Link>
              <a 
                href="mailto:contact@illumine.com"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg text-center font-sans"
              >
                {t('why.conclusion.cta2')}
              </a>
            </div>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
