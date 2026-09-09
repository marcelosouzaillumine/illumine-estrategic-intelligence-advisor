import React, { useState } from 'react';
import { ArrowRight, Activity, ShieldCheck, PieChart, Users, TrendingUp, Lightbulb, Target, Combine, Database, Scale, ChevronDown } from 'lucide-react';
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
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalDomainsPage() {
  const { t } = useTranslation('domains');
  const { t: brand } = useTranslation('brand');

  const [openDomainId, setOpenDomainId] = useState<number | null>(1);

  const domains = [
    {
      id: 1, tid: 1,
      name: brand('governanceGovernance'),
      icon: ShieldCheck,
      hasQuestions: true,
      hasApplications: true,
      hasHighlight: false
    },
    {
      id: 2, tid: 2,
      name: brand('financialGovernance'),
      icon: PieChart,
      hasQuestions: false,
      hasApplications: true,
      hasHighlight: true
    },
    {
      id: 3, tid: 5,
      name: brand('operationalGovernance'),
      icon: Activity,
      hasQuestions: true,
      hasApplications: false,
      hasHighlight: false
    },
    {
      id: 4, tid: 6,
      name: brand('commercialGovernance'),
      icon: TrendingUp,
      hasQuestions: false,
      hasApplications: false,
      hasHighlight: true
    },
    {
      id: 5, tid: 7,
      name: brand('peopleGovernance'),
      icon: Users,
      hasQuestions: false,
      hasApplications: true,
      hasHighlight: false
    },
    {
      id: 6, tid: 4,
      name: brand('riskGovernance'),
      icon: ShieldCheck,
      hasQuestions: false,
      hasApplications: true,
      hasHighlight: false
    },
    {
      id: 7, tid: 3,
      name: brand('institutionalGovernance'),
      icon: Combine,
      hasQuestions: false,
      hasApplications: true,
      hasHighlight: false
    },
    {
      id: 8, tid: 8,
      name: brand('missionGovernance'),
      icon: Target,
      hasQuestions: false,
      hasApplications: true,
      hasHighlight: false
    },
    {
      id: 9, tid: 9,
      name: brand('innovationGovernance'),
      icon: Lightbulb,
      hasQuestions: false,
      hasApplications: true,
      hasHighlight: false
    }
  ];

  return (
    <PageFrame>
      
      {/* 1. Hero */}
      <Hero className="min-h-[85vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl leading-tight">
            {t('hero.title')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-4xl mb-6">
            {t('hero.lead')}
          </HeroLead>
          <Narrative className="text-xl md:text-2xl text-slate-400 font-medium font-sans">
            {t('hero.narrative')}
          </Narrative>
          <div className="mt-12">
            <Link 
              to="/plataforma"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans"
            >
              {t('hero.cta')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </Container>
      </Hero>

      {/* 2. Arquitetura dos Domínios & Map */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('architecture.label')}</SectionLabel>
            <SectionTitle align="center">{t('architecture.title')}</SectionTitle>
            <SectionLead align="center">{t('architecture.lead')}</SectionLead>
          </div>
          
          <div className="max-w-6xl mx-auto relative py-12">
            


            {/* Top Core Map */}
            <div className="flex justify-center mb-32 relative z-10 font-sans">
              <Card variant="accent" hoverable={false} className="p-10 border-amber-500/30 bg-amber-500/5 shadow-[0_0_80px_rgba(255,150,0,0.1)] text-center w-full max-w-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent z-0 animate-pulse" />
                <Combine className="w-20 h-20 text-amber-500 mx-auto mb-6 relative z-10" />
                <CardTitle align="center" className="text-3xl mb-3 relative z-10">{t('architecture.core.title')}</CardTitle>
                <p className="text-amber-500/80 text-sm font-bold tracking-widest uppercase mb-10 relative z-10">
                  {t('architecture.core.lead')}
                </p>
                
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 relative z-10 text-xs font-bold tracking-widest uppercase">
                  <span className="text-slate-400">{t('architecture.core.path.p1')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500/50" />
                  <span className="text-slate-300">{t('architecture.core.path.p2')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500/50" />
                  <span className="text-amber-500 font-bold">{t('architecture.core.path.p3')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500/50" />
                  <span className="text-slate-300">{t('architecture.core.path.p4')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500/50" />
                  <span className="text-white font-bold">{t('architecture.core.path.p5')}</span>
                </div>
              </Card>
            </div>

            {/* Premium Domains Grid */}
            <CardGrid className="md:grid-cols-2 lg:grid-cols-3 font-sans">
              {domains.map((domain) => (
                <Card 
                  key={domain.id} 
                  variant="secondary"
                  className="relative flex flex-col h-full p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-amber-500/30 transition-all duration-500 group overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.15),_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500 group-hover:scale-110 shadow-lg">
                      <domain.icon className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors duration-500" />
                    </div>
                    <span className="text-5xl font-bold text-white/5 group-hover:text-amber-500/10 transition-colors duration-500 select-none">
                      0{domain.id}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex-grow flex flex-col">
                    <div className="flex flex-col justify-start">
                      <CardTitle className="text-2xl mb-3 tracking-tight leading-tight whitespace-pre-line h-[80px]">
                        {domain.name.replace(' Governance', '\
Governance')}
                      </CardTitle>
                      <div className="h-[64px] flex flex-col justify-start">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">{t(`architecture.list.d${domain.tid}.tagline`)}</p>
                      </div>
                    </div>
                    
                    <Narrative className="text-base leading-relaxed mt-2 mb-8 flex-grow">
                      {t(`architecture.list.d${domain.tid}.description`)}
                    </Narrative>

                    {/* Compact Details Area */}
                    <div className="mt-auto pt-6 border-t border-white/5 h-[90px] flex flex-col justify-center">
                      {(domain.hasHighlight && t(`architecture.list.d${domain.tid}.highlight`) !== `architecture.list.d${domain.tid}.highlight`) && (
                        <div>
                          <p className="text-xs text-slate-300 font-medium italic border-l-2 border-amber-500/50 pl-3">
                            "{t(`architecture.list.d${domain.tid}.highlight`)}"
                          </p>
                        </div>
                      )}

                      {(!domain.hasHighlight && domain.hasApplications) && (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const apps = Array.isArray(t(`architecture.list.d${domain.tid}.applications`, { returnObjects: true })) 
                                ? t(`architecture.list.d${domain.tid}.applications`, { returnObjects: true }) as string[] 
                                : [];
                              return (
                                <>
                                  {apps.slice(0, 2).map((app: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-slate-400 font-bold uppercase tracking-widest">
                                      {app}
                                    </span>
                                  ))}
                                  {apps.length > 2 && (
                                    <span className="px-2 py-1.5 text-xs text-amber-500 font-bold uppercase tracking-widest flex items-center">
                                      +{apps.length - 2}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {(!domain.hasHighlight && !domain.hasApplications && domain.hasQuestions) && (
                        <div>
                          <ul className="space-y-3">
                            {(() => {
                              const questions = Array.isArray(t(`architecture.list.d${domain.tid}.questions`, { returnObjects: true })) 
                                ? t(`architecture.list.d${domain.tid}.questions`, { returnObjects: true }) as string[] 
                                : [];
                              return questions.slice(0, 2).map((q: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 shrink-0 mt-2" /> 
                                  <span className="leading-snug">{q}</span>
                                </li>
                              ));
                            })()}
                          </ul>

                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </CardGrid>
          </div>
        </Container>
      </Section>

      {/* 3. Bloco Diferencial */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('system_value.label')}</SectionLabel>
            <SectionTitle align="center" className="max-w-4xl">{t('system_value.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-4xl">{t('system_value.lead')}</SectionLead>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card variant="secondary" hoverable={false} className="p-10 md:p-16 border-white/10 bg-white/5 font-sans">
              <div className="flex flex-col gap-6 relative">
                
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-xl text-slate-300 font-medium">{t('system_value.steps.s1.pre')} <span className="text-white font-bold">{t('system_value.steps.s1.bold')}</span>{t('system_value.steps.s1.post')}</p>
                </div>
                
                <div className="w-px h-8 bg-white/20 absolute left-6 top-10 ml-[-0.5px]" />
                
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500 mt-4">
                    <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-xl text-slate-300 font-medium mt-4">{t('system_value.steps.s2.pre')} <span className="text-white font-bold">{t('system_value.steps.s2.bold')}</span>{t('system_value.steps.s2.post')}</p>
                </div>

                <div className="w-px h-8 bg-white/20 absolute left-6 top-[6.5rem] ml-[-0.5px]" />
                
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500 mt-4">
                    <Scale className="w-5 h-5" />
                  </div>
                  <p className="text-xl text-slate-300 font-medium mt-4">{t('system_value.steps.s3.pre')} <span className="text-white font-bold">{t('system_value.steps.s3.bold')}</span>{t('system_value.steps.s3.post')}</p>
                </div>

                <div className="w-px h-8 bg-white/20 absolute left-6 top-[11.5rem] ml-[-0.5px]" />

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500 mt-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <p className="text-xl text-slate-300 font-medium mt-4">{t('system_value.steps.s4.pre')} <span className="text-white font-bold">{t('system_value.steps.s4.bold')}</span>{t('system_value.steps.s4.post')}</p>
                </div>

                <div className="w-px h-8 bg-white/20 absolute left-6 top-[16.5rem] ml-[-0.5px]" />

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 z-10 text-amber-500 mt-4">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-xl text-white font-medium mt-4">{t('system_value.steps.s5.pre')} <span className="text-amber-500 font-bold">{t('system_value.steps.s5.bold')}</span>{t('system_value.steps.s5.post')}</p>
                </div>

              </div>

              <div className="mt-16 pt-8 border-t border-white/10 text-center">
                <p className="text-2xl font-bold text-white leading-relaxed">
                  {t('system_value.conclusion')}
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. CTA Final */}
      <Section className="border-t border-white/5 bg-[#050506] pt-40 pb-40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 leading-tight font-sans tracking-tight">
              {t('conclusion.title')}
            </h2>
            <Link 
              to="/assessment"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg font-sans"
            >
              {t('conclusion.cta')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
