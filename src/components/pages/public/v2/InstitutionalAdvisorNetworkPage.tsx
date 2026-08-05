import React from 'react';
import { 
  Database, LineChart, Cpu, MessageSquare, Brain, ArrowRight, 
  Layers, ShieldCheck, Activity, Eye, Zap, Network, History, 
  FileCheck, Lock, Users, Compass, Briefcase, Award, TrendingUp, CheckCircle2, Target, Building,
  Plus, Equal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
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
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalAdvisorNetworkPage() {
  const { t } = useTranslation('advisor-network');
  const { t: brand } = useTranslation('brand');

  return (
    <PageFrame>
      {/* 1. Hero */}
      <Hero className="min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {t('hero.lead')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-3xl mb-8">
            {t('hero.narrative')}
          </HeroLead>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="#paths"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans"
            >
              {t('hero.cta_certification')}
            </Link>
            <Link 
              to="#paths"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300 inline-flex items-center gap-2 font-sans"
            >
              {t('hero.cta_partner')}
            </Link>
          </div>
        </Container>
      </Hero>

      {/* 2. Oportunidade */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02]">
          <div className="w-[800px] h-[800px] rounded-full border border-white" />
        </div>
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
            <div className="block w-full min-w-0 lg:pr-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">{t('opportunity.label')}</span>
              </div>
              <SectionTitle align="left" className="!mb-0">
                {t('opportunity.title_1')}<br/>
                <span className="text-amber-500 italic font-serif">
                  {t('opportunity.title_2')}
                </span>
              </SectionTitle>
              <p className="font-light text-slate-300 mt-8 text-xl leading-relaxed">
                {t('opportunity.lead')}
              </p>
            </div>
            <div className="w-full min-w-0 lg:pt-4 flex flex-col justify-center">
              <Narrative className="text-left font-light">
                <p className="mb-8 text-white font-medium text-2xl lg:text-3xl leading-snug tracking-tight">{t('opportunity.p1')}</p>
                <div className="h-px w-24 bg-white/10 mb-8"></div>
                <p className="text-slate-400 text-xl leading-relaxed">{t('opportunity.p2')}</p>
              </Narrative>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. A evolução da prática de advisory */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('transformation.label')}</SectionLabel>
            <SectionTitle align="center">{t('transformation.title_1')}<br/>{t('transformation.title_2')}</SectionTitle>
            <SectionLead align="center" className="max-w-2xl text-amber-500/90">{t('transformation.lead')}</SectionLead>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {Object.values(t('transformation.comparisons', { returnObjects: true }) as Record<string, any>).map((shift, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 rounded-2xl bg-black/60 border border-white/10 gap-4 sm:gap-8 hover:border-amber-500/30 transition-colors">
                <div className="text-slate-400 text-lg sm:text-xl font-medium line-through decoration-slate-600 flex-1 text-center sm:text-right">{shift.before}</div>
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <ArrowRight className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-white text-lg sm:text-xl font-bold flex-1 text-center sm:text-left">{shift.after}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Client Value */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('client_value.label')}</SectionLabel>
            <SectionTitle align="center">{t('client_value.title_1')}<br/>{t('client_value.title_2')}</SectionTitle>
            <SectionLead align="center" className="max-w-2xl">{t('client_value.lead')}</SectionLead>
          </div>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {Object.values(t('client_value.items', { returnObjects: true }) as Record<string, string>).map((item, idx) => {
              const icons = [Target, Activity, Eye, Database, ShieldCheck];
              const Icon = icons[idx % icons.length];
              return (
                <Card key={idx} variant="secondary" className="p-8 hover:border-amber-500/30 transition-all group flex flex-col items-center text-center h-full w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]">
                  <Icon className="w-8 h-8 text-amber-500/70 mb-6 group-hover:scale-110 group-hover:text-amber-500 transition-all shrink-0" />
                  <p className="text-lg text-white font-medium">{item}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. Practice Impact */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('practice_impact.label')}</SectionLabel>
            <SectionTitle align="center">{t('practice_impact.title_1')}<br/>{t('practice_impact.title_2')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('practice_impact.lead')}</SectionLead>
          </div>
          <CardGrid className="md:grid-cols-3 max-w-6xl mx-auto">
            {/* Revenue */}
            <Card variant="secondary" className="p-8 md:p-10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)] bg-[#050506] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('practice_impact.revenue.title')}</h3>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{t('practice_impact.revenue.subtitle')}</p>
              <ul className="space-y-4">
                {Object.values(t('practice_impact.revenue.items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-200 font-medium">
                    <Plus className="w-4 h-4 text-amber-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
            {/* Productivity */}
            <Card variant="secondary" className="p-8 md:p-10 border border-white/10 bg-[#050506] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('practice_impact.productivity.title')}</h3>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{t('practice_impact.productivity.subtitle')}</p>
              <ul className="space-y-4">
                {Object.values(t('practice_impact.productivity.items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-1" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
            {/* Authority */}
            <Card variant="secondary" className="p-8 md:p-10 border border-white/10 bg-[#050506] flex flex-col">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('practice_impact.authority.title')}</h3>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{t('practice_impact.authority.subtitle')}</p>
              <ul className="space-y-4">
                {Object.values(t('practice_impact.authority.items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-1" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </CardGrid>
        </Container>
      </Section>

      {/* 6. Predictability */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('predictability.label')}</SectionLabel>
            <SectionTitle align="center">{t('predictability.title_1')}<br/>{t('predictability.title_2')}</SectionTitle>
            <SectionLead align="center" className="max-w-2xl">{t('predictability.lead')}</SectionLead>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden border border-white/10">
              <div className="bg-[#0A0A0B] p-8 md:p-12">
                <h4 className="text-slate-500 font-medium mb-8 text-lg flex items-center gap-3"><History className="w-5 h-5"/> {t('predictability.before')}</h4>
                <ul className="space-y-6">
                  {Object.values(t('predictability.comparisons', { returnObjects: true }) as Record<string, any>).map((c, idx) => (
                    <li key={idx} className="text-slate-400 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /> {c.before}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-500/5 p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h4 className="text-amber-500 font-semibold mb-8 text-lg flex items-center gap-3"><Zap className="w-5 h-5"/> {t('predictability.after')}</h4>
                <ul className="space-y-6 relative z-10">
                  {Object.values(t('predictability.comparisons', { returnObjects: true }) as Record<string, any>).map((c, idx) => (
                    <li key={idx} className="text-white font-medium flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> {c.after}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Caminhos (Paths) */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32" id="paths">
        <Container>
          <div className="flex flex-col items-center text-center mb-24">
            <SectionLabel align="center">{t('paths.label')}</SectionLabel>
            <SectionTitle align="center" className="max-w-4xl">
              {t('paths.title')}
            </SectionTitle>
            <SectionLead align="center" className="max-w-3xl">
              {t('paths.lead')}
            </SectionLead>
          </div>
          
          <CardGrid className="lg:grid-cols-2 gap-8 mb-24">
            {/* Model 1 */}
            <Card variant="secondary" className="p-8 md:p-12 relative overflow-hidden h-full flex flex-col group hover:border-amber-500/30 transition-all duration-500" id="certified-advisor">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <Users className="w-48 h-48 text-amber-500" />
              </div>
              <div className="relative z-10 flex-grow flex flex-col">
                <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block font-semibold">{t('paths.model1.type')}</span>
                <CardTitle className="text-3xl mb-4 shrink-0 min-h-0">{t('paths.model1.title')}</CardTitle>
                <p className="text-xl text-white font-medium mb-6 shrink-0">{t('paths.model1.subtitle')}</p>
                <Narrative className="text-slate-400 mb-8 flex-grow">
                  {t('paths.model1.desc')}
                </Narrative>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-auto">
                  <div>
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-400" /> {t('paths.model1.receives_title')}
                    </h4>
                    <ul className="space-y-3">
                      {Object.values(t('paths.model1.receives_items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                        <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-slate-400" /> {t('paths.model1.ideal_title')}
                    </h4>
                    <ul className="space-y-3">
                      {Object.values(t('paths.model1.ideal_items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                        <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                          <span className="text-amber-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Model 2 */}
            <Card variant="secondary" className="p-8 md:p-12 relative overflow-hidden h-full flex flex-col group hover:border-amber-500/30 transition-all duration-500" id="platform-partner">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <Building className="w-48 h-48 text-amber-500" />
              </div>
              <div className="relative z-10 flex-grow flex flex-col">
                <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block font-semibold">{t('paths.model2.type')}</span>
                <CardTitle className="text-3xl mb-4 shrink-0 min-h-0">{t('paths.model2.title')}</CardTitle>
                <p className="text-xl text-white font-medium mb-6 shrink-0">{t('paths.model2.subtitle')}</p>
                <Narrative className="text-slate-400 mb-8 flex-grow">
                  {t('paths.model2.desc')}
                </Narrative>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-auto">
                  <div>
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" /> {t('paths.model2.receives_title')}
                    </h4>
                    <ul className="space-y-3">
                      {Object.values(t('paths.model2.receives_items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                        <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" /> {t('paths.model2.ideal_title')}
                    </h4>
                    <ul className="space-y-3">
                      {Object.values(t('paths.model2.ideal_items', { returnObjects: true }) as Record<string, string>).map((item, idx) => (
                        <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                          <span className="text-amber-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </CardGrid>

          {/* 8. Comparison Cards */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-white mb-10">{t('paths.comparison.title')}</h3>
            <CardGrid className="md:grid-cols-2 gap-8">
              
              {/* Card 1: Certified Advisor */}
              <Card variant="secondary" className="p-8 md:p-10 border border-white/10 hover:border-amber-500/30 transition-colors duration-500 group bg-[#050506]">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">{t('paths.comparison.headers.h2')}</h4>
                    <p className="text-sm text-slate-400">{t('paths.model1.type')}</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {Object.values(t('paths.comparison.rows', { returnObjects: true }) as Record<string, {label: string, v1: string, v2: string}>).map((row, idx) => (
                    <div key={idx} className="relative">
                      <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-2">{row.label}</span>
                      <p className="text-base text-white font-medium">{row.v1}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 2: Platform Partner */}
              <Card variant="secondary" className="p-8 md:p-10 border border-white/10 hover:border-amber-500/30 transition-colors duration-500 group bg-[#050506] bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-amber-500/70" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-500/70 transition-colors">{t('paths.comparison.headers.h3')}</h4>
                    <p className="text-sm text-slate-400">{t('paths.model2.type')}</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {Object.values(t('paths.comparison.rows', { returnObjects: true }) as Record<string, {label: string, v1: string, v2: string}>).map((row, idx) => (
                    <div key={idx} className="relative">
                      <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-2">{row.label}</span>
                      <p className="text-base text-slate-300">{row.v2}</p>
                    </div>
                  ))}
                </div>
              </Card>

            </CardGrid>
          </div>
        </Container>
      </Section>

      {/* 9. Journey (Certificação) */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-24">
            <SectionLabel align="center">{t('certification.label')}</SectionLabel>
            <SectionTitle align="center">{t('certification.title_1')}<br/>{t('certification.title_2')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('certification.lead')}</SectionLead>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <CardGrid className="md:grid-cols-2">
              {Object.entries(t('certification', { returnObjects: true }) as Record<string, any>)
                .filter(([key]) => key.startsWith('step'))
                .map(([key, step], index) => (
                  <Card key={key} variant="secondary" className="p-8 md:p-10 flex gap-6 items-start h-full flex-col sm:flex-row hover:border-amber-500/20 transition-all duration-500 bg-[#0A0A0B]">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-500 font-bold font-sans text-2xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                      {index + 1}
                    </div>
                    <div className="flex-grow flex flex-col h-full mt-2 sm:mt-0">
                      <CardTitle className="text-xl mb-3 min-h-0 shrink-0">{step.title}</CardTitle>
                      <Narrative className="text-slate-400 flex-grow">
                        {step.desc}
                      </Narrative>
                    </div>
                  </Card>
                ))}
            </CardGrid>
          </div>
        </Container>
      </Section>

      {/* 10. CTA */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32">
        <Container className="text-center">
          <SectionLabel align="center">{t('cta.label')}</SectionLabel>
          <SectionTitle align="center" className="max-w-4xl mx-auto mb-8">
            {t('cta.title_1')}<br/>{t('cta.title_2')}
          </SectionTitle>
          <SectionLead align="center" className="max-w-2xl mx-auto mb-16">
            {t('cta.lead')}
          </SectionLead>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href={`https://wa.me/554131514537?text=${encodeURIComponent('Olá, gostaria de saber mais sobre a certificação Certified Advisor da Illumine.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-slate-200 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3 font-sans text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              {t('cta.btn_certified')}
              <ArrowRight size={20} />
            </a>
            <a 
              href={`https://wa.me/554131514537?text=${encodeURIComponent('Olá, gostaria de saber mais sobre o modelo Platform Partner da Illumine.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 inline-flex items-center justify-center gap-3 font-sans text-lg w-full sm:w-auto"
            >
              {t('cta.btn_platform')}
              <ArrowRight size={20} />
            </a>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
