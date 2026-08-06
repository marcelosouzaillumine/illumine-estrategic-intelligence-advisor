import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Server, 
  Key, 
  UserCheck, 
  Activity, 
  Lock, 
  Eye, 
  Layers,
  Fingerprint,
  Siren,
  Building2,
  Workflow
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

export default function SecurityPage() {
  const { t } = useLanguage();

  const architectureNodes = [
    { title: t('institutional.security.architecture.nodes.n1.title'), desc: t('institutional.security.architecture.nodes.n1.desc'), icon: UserCheck },
    { title: t('institutional.security.architecture.nodes.n2.title'), desc: t('institutional.security.architecture.nodes.n2.desc'), icon: Server },
    { title: t('institutional.security.architecture.nodes.n3.title'), desc: t('institutional.security.architecture.nodes.n3.desc'), icon: Fingerprint },
    { title: t('institutional.security.architecture.nodes.n4.title'), desc: t('institutional.security.architecture.nodes.n4.desc'), icon: Layers }
  ];

  const securityCards = [
    { title: t('institutional.security.controls.cards.c1.title'), desc: t('institutional.security.controls.cards.c1.desc'), icon: Fingerprint },
    { title: t('institutional.security.controls.cards.c2.title'), desc: t('institutional.security.controls.cards.c2.desc'), icon: Key },
    { title: t('institutional.security.controls.cards.c3.title'), desc: t('institutional.security.controls.cards.c3.desc'), icon: Lock },
    { title: t('institutional.security.controls.cards.c4.title'), desc: t('institutional.security.controls.cards.c4.desc'), icon: Activity },
    { title: t('institutional.security.controls.cards.c5.title'), desc: t('institutional.security.controls.cards.c5.desc'), icon: Eye },
    { title: t('institutional.security.controls.cards.c6.title'), desc: t('institutional.security.controls.cards.c6.desc'), icon: Siren }
  ];

  const commitmentItems = [
    t('institutional.security.commitment.items.i1'),
    t('institutional.security.commitment.items.i2'),
    t('institutional.security.commitment.items.i3'),
    t('institutional.security.commitment.items.i4'),
    t('institutional.security.commitment.items.i5'),
    t('institutional.security.commitment.items.i6'),
    t('institutional.security.commitment.items.i7'),
    t('institutional.security.commitment.items.i8')
  ];

  return (
    <PageFrame>
      {/* Hero */}
      <Hero className="min-h-[80vh] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('institutional.security.hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl">
            {t('institutional.security.hero.title')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-4xl mb-6">
            {t('institutional.security.hero.lead')}
          </HeroLead>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/governance" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 inline-flex items-center gap-2 font-sans shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {t('institutional.security.hero.cta_primary')}
              <ArrowRight size={20} />
            </Link>
            <a href={`https://wa.me/554131514537?text=${encodeURIComponent('Olá, gostaria de solicitar uma Demonstração Executiva da plataforma Illumine.')}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans">
              {t('institutional.security.hero.cta_secondary')}
            </a>
          </div>
        </Container>
      </Hero>

      {/* Section 2: O Novo Desafio */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container className="text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-sans">
              {t('institutional.security.challenge.title')}<br/>
              <span className="text-slate-400">{t('institutional.security.challenge.lead')}</span>
            </h2>
            <Narrative className="text-xl text-slate-400 leading-relaxed mb-8 max-w-3xl font-sans text-center">
              {t('institutional.security.challenge.desc')}
            </Narrative>
            <p className="text-2xl text-amber-500 font-bold font-sans">
              {t('institutional.security.challenge.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 3: Security by Architecture */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('institutional.security.architecture.label')}</SectionLabel>
            <SectionTitle align="center">{t('institutional.security.architecture.title')}</SectionTitle>
            <SectionLead align="center">{t('institutional.security.architecture.lead')}</SectionLead>
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

      {/* Section 4: Executive Security Architecture */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <Layers className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6 font-sans">{t('institutional.security.executive.title')}</h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 font-sans font-medium">
              {t('institutional.security.executive.lead')}
            </p>
            
            <div className="w-full flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12 font-sans">
              <div className="space-y-4 w-full max-w-2xl text-left relative">
                
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/10 via-amber-500/50 to-white/10" />

                {[
                  t('institutional.security.executive.flow1'),
                  t('institutional.security.executive.flow2'),
                  t('institutional.security.executive.flow3'),
                  t('institutional.security.executive.flow4'),
                  t('institutional.security.executive.flow5')
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-6 relative z-10">
                    <div className="w-16 flex justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#0A0A0B] border-2 border-amber-500" />
                    </div>
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 shadow-lg text-lg font-semibold text-slate-200 flex items-center justify-between">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-2xl text-white font-bold font-sans max-w-3xl">
              {t('institutional.security.executive.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 5: Proteção da Inteligência Institucional */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <Lock className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6 font-sans">{t('institutional.security.knowledge.title')}</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6 font-sans font-bold">
              {t('institutional.security.knowledge.lead')}
            </p>
            <Narrative className="text-xl text-slate-400 leading-relaxed mx-auto font-sans text-center">
              {t('institutional.security.knowledge.desc')}
            </Narrative>
          </div>
        </Container>
      </Section>

      {/* Section 6: Controles Corporativos */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('institutional.security.controls.title')}</SectionTitle>
            <SectionLead align="center">{t('institutional.security.controls.lead')}</SectionLead>
          </div>
          
          <CardGrid className="max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
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

      {/* Section 7: Resiliência Operacional & AI Governance */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start font-sans">
            
            {/* Resiliência Operacional */}
            <div>
              <Activity className="w-12 h-12 text-amber-500 mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">{t('institutional.security.resilience.title')}</h2>
              <p className="text-lg text-slate-300 font-bold mb-4">
                {t('institutional.security.resilience.lead')}
              </p>
              <Narrative className="text-slate-400 leading-relaxed font-medium mb-6">
                {t('institutional.security.resilience.desc')}
              </Narrative>
              <p className="text-lg text-amber-500 font-bold">
                {t('institutional.security.resilience.conclusion')}
              </p>
            </div>
            
            {/* Segurança para Inteligência Artificial */}
            <div>
              <Workflow className="w-12 h-12 text-amber-500 mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">{t('institutional.security.aiGovernance.title')}</h2>
              <p className="text-lg text-slate-300 font-bold mb-4">
                {t('institutional.security.aiGovernance.lead')}
              </p>
              <Narrative className="text-slate-400 leading-relaxed font-medium mb-6">
                {t('institutional.security.aiGovernance.desc')}
              </Narrative>
              <ul className="space-y-3 mb-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <li key={num} className="flex items-center gap-3 text-slate-300 font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    <span>{t(`institutional.security.aiGovernance.q${num}.q`)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg text-amber-500 font-bold">
                {t('institutional.security.aiGovernance.conclusion')}
              </p>
            </div>

          </div>
        </Container>
      </Section>

      {/* Section 8: Compromisso Institucional & Advantage */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 font-sans">
            
            <div className="flex flex-col">
              <Building2 className="w-12 h-12 text-amber-500 mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                {t('institutional.security.commitment.title')}
              </h2>
              <p className="text-xl text-slate-300 font-bold mb-8">
                {t('institutional.security.commitment.lead')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {commitmentItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-400 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card variant="secondary" hoverable={false} className="p-10 border-t-4 border-t-amber-500 bg-black/40 flex flex-col justify-center items-start mt-8 lg:mt-0">
              <CardTitle className="text-2xl mb-4 text-white">{t('institutional.security.advantage.title')}</CardTitle>
              <p className="text-lg text-slate-300 font-bold mb-4">
                {t('institutional.security.advantage.lead')}
              </p>
              <Narrative className="text-slate-400 mb-8 leading-relaxed font-medium">
                {t('institutional.security.advantage.desc')}
              </Narrative>
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
              {t('institutional.security.cta.title')}
            </h2>
            <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto font-sans font-medium leading-relaxed">
              {t('institutional.security.cta.lead')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href={`https://wa.me/554131514537?text=${encodeURIComponent('Olá, gostaria de solicitar uma Demonstração Executiva da plataforma Illumine.')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg inline-flex justify-center items-center gap-2 font-sans"
              >
                {t('institutional.security.cta.primary')}
                <ArrowRight size={20} />
              </a>
              <Link 
                to="/governance"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg text-center font-sans"
              >
                {t('institutional.security.cta.secondary')}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageFrame>
  );
}
