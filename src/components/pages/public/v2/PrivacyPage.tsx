import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Server, 
  Key, 
  UserCheck, 
  Activity, 
  History, 
  BrainCircuit, 
  Lock, 
  Eye, 
  FileSearch,
  LineChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
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
  CardGrid,
  CardTitle,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export default function PrivacyPage() {
  const { t } = useLanguage();

  const architectureNodes = [
    { title: t('institutional.privacy.architecture.nodes.n1.title'), desc: t('institutional.privacy.architecture.nodes.n1.desc'), icon: Server },
    { title: t('institutional.privacy.architecture.nodes.n2.title'), desc: t('institutional.privacy.architecture.nodes.n2.desc'), icon: Database },
    { title: t('institutional.privacy.architecture.nodes.n3.title'), desc: t('institutional.privacy.architecture.nodes.n3.desc'), icon: Key },
    { title: t('institutional.privacy.architecture.nodes.n4.title'), desc: t('institutional.privacy.architecture.nodes.n4.desc'), icon: Eye }
  ];

  const securityCards = [
    { title: t('institutional.privacy.security.cards.c1.title'), desc: t('institutional.privacy.security.cards.c1.desc'), icon: UserCheck },
    { title: t('institutional.privacy.security.cards.c2.title'), desc: t('institutional.privacy.security.cards.c2.desc'), icon: Activity },
    { title: t('institutional.privacy.security.cards.c3.title'), desc: t('institutional.privacy.security.cards.c3.desc'), icon: Lock },
    { title: t('institutional.privacy.security.cards.c4.title'), desc: t('institutional.privacy.security.cards.c4.desc'), icon: LineChart }
  ];

  const transparencyQuestions = [
    { q: t('institutional.privacy.transparency.q1.q'), a: t('institutional.privacy.transparency.q1.a') },
    { q: t('institutional.privacy.transparency.q2.q'), a: t('institutional.privacy.transparency.q2.a') },
    { q: t('institutional.privacy.transparency.q3.q'), a: t('institutional.privacy.transparency.q3.a') }
  ];

  return (
    <PageFrame>
      {/* Hero */}
      <Hero className="min-h-[80vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('institutional.privacy.hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {t('institutional.privacy.hero.title')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-4xl mb-6">
            {t('institutional.privacy.hero.lead')}
          </HeroLead>
          <p className="text-xl md:text-2xl text-white font-bold font-sans mt-4 max-w-3xl">
            {t('institutional.privacy.hero.conclusion')}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/governance" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 inline-flex items-center gap-2 font-sans shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {t('institutional.privacy.hero.cta_primary')}
              <ArrowRight size={20} />
            </Link>
            <Link to="/assessment" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans">
              {t('institutional.privacy.hero.cta_secondary')}
            </Link>
          </div>
        </Container>
      </Hero>

      {/* Section 2: O Novo Desafio */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container className="text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-sans">
              {t('institutional.privacy.challenge.title')}<br/>
              <span className="text-slate-400">{t('institutional.privacy.challenge.lead')}</span>
            </h2>
            <Narrative className="text-xl text-slate-400 leading-relaxed mb-8 max-w-3xl font-sans text-center">
              {t('institutional.privacy.challenge.desc')}
            </Narrative>
            <p className="text-2xl text-amber-500 font-bold font-sans">
              {t('institutional.privacy.challenge.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 3: Privacy by Architecture */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('institutional.privacy.architecture.label')}</SectionLabel>
            <SectionTitle align="center">{t('institutional.privacy.architecture.title')}</SectionTitle>
            <SectionLead align="center">{t('institutional.privacy.architecture.lead')}</SectionLead>
          </div>
          
          <CardGrid className="max-w-7xl mx-auto md:grid-cols-2 gap-8 font-sans">
            {architectureNodes.map((node, idx) => (
              <Card key={idx} variant="secondary" hoverable className="p-8 border-t-4 border-t-slate-700 hover:border-t-amber-500 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <node.icon className="w-6 h-6 text-slate-300" />
                </div>
                <CardTitle className="text-xl mb-3">{node.title}</CardTitle>
                <Narrative className="text-slate-400 leading-relaxed font-medium">{node.desc}</Narrative>
              </Card>
            ))}
          </CardGrid>
        </Container>
      </Section>

      {/* Section 4: AI Governance */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <BrainCircuit className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6 font-sans">{t('institutional.privacy.aiGovernance.title')}</h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 font-sans font-medium">
              {t('institutional.privacy.aiGovernance.desc')}
            </p>
            
            <div className="w-full flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12 font-sans">
              <div className="space-y-4 w-full max-w-2xl text-left relative">
                
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/10 via-amber-500/50 to-white/10" />

                {[
                  t('institutional.privacy.aiGovernance.flow1'),
                  t('institutional.privacy.aiGovernance.flow2'),
                  t('institutional.privacy.aiGovernance.flow3'),
                  t('institutional.privacy.aiGovernance.flow4'),
                  t('institutional.privacy.aiGovernance.flow5')
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-6 relative z-10">
                    <div className="w-16 flex justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#0A0A0B] border-2 border-amber-500" />
                    </div>
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 shadow-lg text-lg font-semibold text-slate-200">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-2xl text-white font-bold font-sans max-w-3xl">
              {t('institutional.privacy.aiGovernance.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 5: Enterprise Knowledge Protection */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6 font-sans">{t('institutional.privacy.knowledgeProtection.title')}</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6 font-sans font-bold">
              {t('institutional.privacy.knowledgeProtection.lead')}
            </p>
            <Narrative className="text-xl text-slate-400 leading-relaxed mx-auto font-sans text-center">
              {t('institutional.privacy.knowledgeProtection.desc')}
            </Narrative>
          </div>
        </Container>
      </Section>

      {/* Section 6: Memória Institucional */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <History className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6 font-sans">{t('institutional.privacy.memory.title')}</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6 font-sans font-bold">
              {t('institutional.privacy.memory.lead')}
            </p>
            <Narrative className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-8 font-sans text-center">
              {t('institutional.privacy.memory.desc')}
            </Narrative>
            <p className="text-xl text-amber-500 font-bold font-sans">
              {t('institutional.privacy.memory.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 7: Controles de Segurança */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('institutional.privacy.security.title')}</SectionTitle>
            <SectionLead align="center">{t('institutional.privacy.security.lead')}</SectionLead>
          </div>
          
          <CardGrid className="max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            {securityCards.map((card, idx) => (
              <Card key={idx} variant="secondary" hoverable={false} className="p-6 border-white/5 bg-black/20">
                <card.icon className="w-8 h-8 text-amber-500 mb-4" />
                <CardTitle className="text-lg mb-2">{card.title}</CardTitle>
                <Narrative className="text-slate-400 text-sm font-medium">{card.desc}</Narrative>
              </Card>
            ))}
          </CardGrid>
        </Container>
      </Section>

      {/* Section 8: Transparência da Inteligência Artificial */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center font-sans">
            <div>
              <FileSearch className="w-12 h-12 text-amber-500 mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('institutional.privacy.transparency.title')}</h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                {t('institutional.privacy.transparency.lead')}
              </p>
            </div>
            
            <div className="space-y-6">
              {transparencyQuestions.map((item, idx) => (
                <Card key={idx} variant="secondary" hoverable={false} className="p-6 bg-white/5 border-white/10">
                  <CardTitle className="text-lg mb-2 flex items-center gap-3">
                    <span className="text-amber-500">?</span> {item.q}
                  </CardTitle>
                  <Narrative className="text-slate-400 pl-6 border-l-2 border-white/10 ml-2 mt-4 py-1 font-medium">{item.a}</Narrative>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 9: Compromisso Institucional & Trust Architecture */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 font-sans">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                {t('institutional.privacy.commitment.title')}
              </h2>
              <p className="text-xl text-slate-300 font-bold mb-6">
                {t('institutional.privacy.commitment.lead')}
              </p>
              <Narrative className="text-slate-400 leading-relaxed font-medium">
                {t('institutional.privacy.commitment.desc')}
              </Narrative>
            </div>

            <Card variant="secondary" hoverable={false} className="p-10 border-t-4 border-t-amber-500 bg-black/40 flex flex-col justify-center items-start">
              <CardTitle className="text-2xl mb-4 text-white">{t('institutional.privacy.commitment.trust_title')}</CardTitle>
              <Narrative className="text-slate-400 mb-8 leading-relaxed font-medium">
                {t('institutional.privacy.commitment.trust_desc')}
              </Narrative>
              <Link to="/governance" className="px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-black font-semibold rounded-full transition-colors flex items-center gap-2">
                {t('institutional.privacy.commitment.cta')}
                <ArrowRight size={16} />
              </Link>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] pt-32 pb-40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <Container className="text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight font-sans tracking-tight">
              {t('institutional.privacy.cta.title')}
            </h2>
            <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto font-sans font-medium leading-relaxed">
              {t('institutional.privacy.cta.lead')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/assessment"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg inline-flex justify-center items-center gap-2 font-sans"
              >
                {t('institutional.privacy.cta.primary')}
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/plataforma"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg text-center font-sans"
              >
                {t('institutional.privacy.cta.secondary')}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageFrame>
  );
}
