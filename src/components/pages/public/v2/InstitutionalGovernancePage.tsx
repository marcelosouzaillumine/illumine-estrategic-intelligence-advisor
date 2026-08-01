import React from 'react';
import { ArrowRight, ShieldCheck, Database, GitBranch, Eye, Users, FileSearch, ArrowDown, Activity, Lightbulb } from 'lucide-react';
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

export function InstitutionalGovernancePage() {
  const { t } = useTranslation('governance');

  const principles = [
    {
      title: t('principles_section.list.p1.title'),
      description: t('principles_section.list.p1.description'),
      icon: FileSearch
    },
    {
      title: t('principles_section.list.p2.title'),
      description: t('principles_section.list.p2.description'),
      icon: Eye
    },
    {
      title: t('principles_section.list.p3.title'),
      description: t('principles_section.list.p3.description'),
      icon: GitBranch
    },
    {
      title: t('principles_section.list.p4.title'),
      description: t('principles_section.list.p4.description'),
      icon: Database
    },
    {
      title: t('principles_section.list.p5.title'),
      description: t('principles_section.list.p5.description'),
      icon: Users
    }
  ];

  const explainableQuestions = [
    {
      q: t('explainable_section.questions.q1.q'),
      a: t('explainable_section.questions.q1.a')
    },
    {
      q: t('explainable_section.questions.q2.q'),
      a: t('explainable_section.questions.q2.a')
    },
    {
      q: t('explainable_section.questions.q3.q'),
      a: t('explainable_section.questions.q3.a')
    }
  ];

  const memoryItems = t('memory_section.items', { returnObjects: true }) as string[];

  const evidenceItems = t('evidence_section.items', { returnObjects: true }) as string[];

  return (
    <PageFrame>
      
      {/* Hero */}
      <Hero className="min-h-[80vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('page_hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {t('page_hero.title')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-4xl mb-8">
            {t('page_hero.lead')}
          </HeroLead>
          <div className="mt-12">
            <a href="#principios" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans">
              {t('page_hero.cta')}
              <ArrowRight size={20} />
            </a>
          </div>
        </Container>
      </Hero>

      {/* Section 1: O Desafio */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container className="text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-sans">
              {t('challenge.title')}<br/>
              <span className="text-slate-400">{t('challenge.subtitle')}</span>
            </h2>
            <Narrative className="text-xl text-slate-400 leading-relaxed mb-8 max-w-3xl font-sans text-center">
              {t('challenge.narrative1')}
            </Narrative>
            <p className="text-2xl text-white font-bold font-sans">
              {t('challenge.narrative2')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 2: Princípios */}
      <Section className="border-t border-white/5 bg-[#050506]" id="principios">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('principles_section.label')}</SectionLabel>
            <SectionTitle align="center">{t('principles_section.title')}</SectionTitle>
            <SectionLead align="center">{t('principles_section.lead')}</SectionLead>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
            {principles.map((principle, idx) => (
              <Card key={idx} variant="secondary" hoverable className="p-8 border-t-4 border-t-amber-500/50 hover:border-t-amber-500 transition-colors">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                  <principle.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{principle.title}</h4>
                <p className="text-slate-400 leading-relaxed font-medium">{principle.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: Trust Architecture™ */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('architecture_section.label')}</SectionLabel>
            <SectionTitle align="center">{t('architecture_section.title')}</SectionTitle>
            <SectionLead align="center">{t('architecture_section.lead')}</SectionLead>
          </div>

          <div className="max-w-6xl mx-auto py-20 font-sans">
            <style>{`
              @keyframes flowRight {
                0% { left: 0%; transform: translateY(-50%); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { left: 100%; transform: translateY(-50%); opacity: 0; }
              }
              @keyframes nodePulseGlow {
                0%, 100% { border-color: rgba(255,255,255,0.1); box-shadow: none; }
                50% { border-color: rgba(245, 157, 63, 0.5); box-shadow: 0 0 25px rgba(245, 157, 63, 0.2); }
              }
              .custom-scrollbar::-webkit-scrollbar { height: 4px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 999px; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245,157,63,0.3); border-radius: 999px; }
            `}</style>
            
            <div className="w-full overflow-x-auto pb-12 pt-8 custom-scrollbar">
              <div className="min-w-[800px] flex items-center justify-between relative px-8">
                
                {/* Horizontal Track Background */}
                <div className="absolute top-12 left-16 right-16 h-[2px] bg-white/10 -translate-y-1/2 z-0" />
                
                {/* Horizontal Moving Energy Pulse */}
                <div className="absolute top-12 left-16 right-16 h-[2px] -translate-y-1/2 z-0 overflow-hidden">
                  <div 
                    className="absolute top-1/2 w-32 h-[6px] bg-amber-500 blur-[3px] rounded-full"
                    style={{ animation: 'flowRight 4s infinite cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </div>

                {/* Flow Nodes */}
                {[
                  { label: t('architecture_section.nodes.n1'), icon: Database },
                  { label: t('architecture_section.nodes.n2'), icon: GitBranch },
                  { label: t('architecture_section.nodes.n3'), icon: Activity },
                  { label: t('architecture_section.nodes.n4'), icon: Lightbulb },
                  { label: t('architecture_section.nodes.n5'), icon: Users }
                ].map((step, idx, arr) => {
                  const Icon = step.icon;
                  const isLast = idx === arr.length - 1;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center relative z-10 w-36 group">
                      {/* Node Circle */}
                      <div 
                        className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-700
                          ${isLast ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_40px_rgba(245,157,63,0.4)]' : 'bg-[#0A0A0B] border-white/10 text-slate-400 group-hover:border-amber-500/50 group-hover:text-amber-500'}`}
                        style={!isLast ? { animation: `nodePulseGlow 4s infinite cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.8}s` } : {}}
                      >
                        <Icon className={`w-8 h-8 ${isLast ? 'text-black' : 'transition-colors duration-300'}`} />
                      </div>
                      
                      {/* Label below node */}
                      <div className="mt-6 text-center">
                        <span className={`text-lg tracking-wide font-bold ${isLast ? 'text-amber-500' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: Explainable Intelligence™ */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center font-sans">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-4">{t('explainable_section.label')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('explainable_section.title')}</h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-8 font-medium">
                {t('explainable_section.lead')}
              </p>
            </div>
            
            <div className="space-y-6">
              {explainableQuestions.map((item, idx) => (
                <Card key={idx} variant="secondary" hoverable={false} className="p-6 md:p-8 bg-white/5 border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-amber-500">?</span> {item.q}
                  </h4>
                  <p className="text-slate-400 pl-6 border-l-2 border-white/10 ml-2 mt-4 py-1 font-medium">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 5 & 6: Memória e Evidência */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 font-sans">
            
            <Card variant="secondary" hoverable={false} className="p-10 border-white/5 bg-black/40">
              <Database className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('memory_section.title')}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                {t('memory_section.lead')}
              </p>
              <ul className="space-y-3">
                {memoryItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-slate-500 font-medium italic">
                {t('memory_section.footer')}
              </p>
            </Card>

            <Card variant="secondary" hoverable={false} className="p-10 border-white/5 bg-black/40">
              <FileSearch className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('evidence_section.title')}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                {t('evidence_section.lead')}
              </p>
              <ul className="space-y-3">
                {evidenceItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-slate-500 font-medium italic">
                {t('evidence_section.footer')}
              </p>
            </Card>

          </div>
        </Container>
      </Section>

      {/* Section 7: Segurança e Privacidade */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6 font-sans">{t('security_section.title')}</h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-6 font-sans font-medium">
              {t('security_section.lead')}
            </p>
            <Narrative className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-6 font-sans text-center">
              {t('security_section.narrative1')}
            </Narrative>
            <Narrative className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-sans text-center">
              {t('security_section.narrative2')}
            </Narrative>
          </div>
        </Container>
      </Section>

      {/* Section 8: A decisão humana */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight font-sans">
              {t('human_section.title')} <br/>
              <span className="text-amber-500">{t('human_section.title_highlight')}</span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-bold mb-6 font-sans">
              {t('human_section.subtitle')}
            </p>
            <Narrative className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-6 font-sans text-center">
              {t('human_section.narrative1')}
            </Narrative>
            <Narrative className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-sans text-center">
              {t('human_section.narrative2')}
            </Narrative>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] pt-40 pb-40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight font-sans tracking-tight">
              {t('conclusion.title')}<br/>
              <span className="text-3xl md:text-4xl text-slate-300 mt-4 block font-normal">{t('conclusion.subtitle')}</span>
            </h2>
            <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto font-sans font-medium leading-relaxed">
              {t('conclusion.lead')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/assessment"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg inline-flex justify-center items-center gap-2 font-sans"
              >
                {t('conclusion.cta1')}
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/plataforma"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg text-center font-sans"
              >
                {t('conclusion.cta2')}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
