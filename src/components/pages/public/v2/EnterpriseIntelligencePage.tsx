import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Database, Brain, Activity, ShieldCheck, Layers, Cpu, Network, Combine, Lock, Users, TrendingUp, Settings, Scale, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
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
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function EnterpriseIntelligencePage() {
  const { t } = useTranslation('enterprise');

  return (
    <PageFrame className="overflow-x-hidden">
      
      {/* SEÇÃO 1 — HERO */}
      <Hero className="min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-white uppercase tracking-widest">{t('enterprise.hero.badge')}</span>
          </div>
          
          <HeroTitle align="center" className="max-w-5xl">
            {t('enterprise.hero.title')}
          </HeroTitle>
          
          <HeroLead align="center">
            {t('enterprise.hero.subtitle')}
          </HeroLead>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/assessment"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {t('enterprise.hero.cta_primary')}
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/platform"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
            >
              {t('enterprise.hero.cta_secondary')}
            </Link>
          </div>
        </Container>
      </Hero>

      {/* SEÇÃO 2 — O NOVO DESAFIO EXECUTIVO */}
      <Section className="border-t border-white/5 bg-gradient-to-b from-[#0A0A0B] to-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
             <SectionLabel align="center">{t('enterprise.challenge.label')}</SectionLabel>
             <SectionTitle align="center">
               {t('enterprise.challenge.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('enterprise.challenge.intro')}
             </SectionLead>
          </div>

          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-white font-medium mb-6">{t('enterprise.challenge.desc1')} {t('enterprise.challenge.desc2')}</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                <span className="text-slate-300 text-lg">{t('enterprise.challenge.bullet1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                <span className="text-slate-300 text-lg">{t('enterprise.challenge.bullet2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                <span className="text-slate-300 text-lg">{t('enterprise.challenge.bullet3')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                <span className="text-slate-300 text-lg">{t('enterprise.challenge.bullet4')}</span>
              </li>
            </ul>
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-500 font-semibold text-lg">{t('enterprise.challenge.conclusion')}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 3 — EXECUTIVE DECISION ENVIRONMENT (NOVA) */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('enterprise.environment.label')}</SectionLabel>
             <SectionTitle align="center">
               {t('enterprise.environment.title')}
             </SectionTitle>
          </div>

          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
            {/* Fontes */}
            <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-center mb-4">
              <Database className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 font-medium">{t('enterprise.environment.sources')}</p>
            </div>
            
            <div className="text-amber-500 mb-4 animate-bounce">
              {t('enterprise.environment.arrow')}
            </div>

            {/* Environment */}
            <div className="w-full p-8 rounded-2xl bg-amber-500/5 border border-amber-500/30 text-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-50" />
              <Brain className="w-10 h-10 text-amber-500 mx-auto mb-4 relative z-10" />
              <h4 className="text-2xl font-bold text-white mb-2 relative z-10">{t('enterprise.environment.label')}</h4>
              <p className="text-amber-200/80 font-medium relative z-10">{t('enterprise.environment.environment').split(':')[1] || t('enterprise.environment.environment')}</p>
            </div>

            <div className="text-amber-500 mb-4 animate-bounce">
              {t('enterprise.environment.arrow')}
            </div>

            {/* Decisão */}
            <div className="w-full p-6 rounded-2xl bg-white/10 border border-white/20 text-center">
              <ShieldCheck className="w-8 h-8 text-white mx-auto mb-4" />
              <p className="text-white font-bold text-xl">{t('enterprise.environment.decision')}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 4 — COMPARAÇÃO VISUAL */}
      <Section className="border-t border-white/5 bg-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('enterprise.comparison.label', 'Arquitetura de Valor')}</SectionLabel>
             <SectionTitle align="center">
               {t('enterprise.comparison.main_title', 'O novo paradigma de decisão.')}
             </SectionTitle>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Tradicional */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 min-h-[4rem] sm:min-h-[5rem]">
                {t('enterprise.comparison.traditional.title')}
              </h3>
              <div className="space-y-6 flex-1">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-1">ERP</span>
                  <span className="text-slate-300 text-lg">{t('enterprise.comparison.traditional.erp')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-1">BI</span>
                  <span className="text-slate-300 text-lg">{t('enterprise.comparison.traditional.bi')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-1">Analytics</span>
                  <span className="text-slate-300 text-lg">{t('enterprise.comparison.traditional.analytics')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-1">IA Generativa</span>
                  <span className="text-slate-300 text-lg">{t('enterprise.comparison.traditional.ai')}</span>
                </div>
              </div>
            </div>

            {/* Illumine */}
            <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <h3 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 min-h-[4rem] sm:min-h-[5rem] relative z-10">
                {t('enterprise.comparison.illumine.title')}
              </h3>
              <div className="flex-1 flex flex-col relative z-10">
                <p className="text-xl text-amber-100/90 leading-relaxed font-medium mb-8">
                  {t('enterprise.comparison.illumine.connects')}
                </p>
                <div className="mt-auto p-6 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-amber-400 font-bold text-xl">{t('enterprise.comparison.illumine.result')}</p>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* SEÇÃO 5 — EXECUTIVE OFFICES */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
             <SectionLabel align="center">Executive Offices™</SectionLabel>
             <SectionTitle align="center">
               {t('enterprise.offices.title')}
             </SectionTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'board', icon: Layers },
              { key: 'ceo', icon: Activity },
              { key: 'cfo', icon: Combine },
              { key: 'coo', icon: Settings },
              { key: 'commercial', icon: TrendingUp },
              { key: 'people', icon: Users },
              { key: 'governance', icon: Scale },
              { key: 'risk', icon: ShieldCheck },
              { key: 'innovation', icon: Lightbulb }
            ].map((office, idx) => {
              const Icon = office.icon;
              const text = t(`enterprise.offices.${office.key}.desc`);
              const match = text.match(/(.*)(Foco:|Focus:|Enfoque:)(.*)/i);
              
              const descText = match ? match[1].trim() : text;
              const focoLabel = match ? match[2].replace(':', '') : 'FOCO';
              const focoText = match ? match[3].trim() : '';

              return (
                <div key={idx} className="grid grid-rows-subgrid row-span-4 p-8 rounded-2xl bg-[#0F0F12] border border-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-transparent to-amber-500/0 group-hover:to-amber-500/[0.02] transition-colors duration-500 pointer-events-none"></div>
                  
                  {/* Row 1: Icon */}
                  <div className="relative z-10 flex items-start self-start">
                    <Icon className="w-8 h-8 text-slate-500 group-hover:text-amber-500 transition-colors duration-500 shrink-0" />
                  </div>
                  
                  {/* Row 2: Title */}
                  <div className="relative z-10 flex items-start self-start">
                    <h4 className="text-xl font-bold text-white group-hover:text-amber-50 transition-colors duration-300">
                      {t(`enterprise.offices.${office.key}.title`)}
                    </h4>
                  </div>
                  
                  {/* Row 3: Description */}
                  <div className="relative z-10 flex items-start self-start">
                    <span className="block text-slate-300 leading-relaxed text-sm xl:text-base">
                      {descText}
                    </span>
                  </div>
                  
                  {/* Row 4: Foco */}
                  <div className="relative z-10 flex flex-col pt-3 border-t border-white/5 self-stretch">
                    <div className="absolute top-[-1px] left-0 w-12 h-[1px] bg-gradient-to-r from-amber-500/80 to-transparent"></div>
                    <span className="block text-[10px] font-bold text-amber-500/90 uppercase tracking-widest mb-2">
                      {focoLabel}
                    </span>
                    <span className="block text-slate-400 text-[13px] leading-relaxed">
                      {focoText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 6 — DIGITAL TWIN SIMULATION */}
      <Section className="border-t border-white/5 bg-[#0D0D11]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel align="left">Institutional Intelligence Simulation™</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('enterprise.simulation.title')}
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {t('enterprise.simulation.subtitle')}
              </p>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl mb-8">
                <p className="text-amber-500 font-mono text-sm sm:text-base leading-loose flex flex-wrap gap-2 items-center">
                  {t('enterprise.simulation.flow')}
                </p>
              </div>
              
              <p className="text-lg text-white font-medium italic border-l-4 border-amber-500 pl-4 py-2">
                {t('enterprise.simulation.message')}
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full" />
              <div className="relative bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <Network className="w-full h-auto text-slate-700 opacity-50" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-16 h-16 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 7 — TRUST ARCHITECTURE SUMMARY */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="max-w-4xl mx-auto p-12 bg-white/5 border border-white/10 rounded-3xl text-center relative overflow-hidden">
            <Lock className="absolute -top-10 -right-10 w-48 h-48 text-white/5" />
            <h3 className="text-2xl font-bold text-white mb-6 relative z-10">{t('enterprise.trust.title')}</h3>
            <div className="flex flex-wrap justify-center gap-4 mb-10 relative z-10">
              {t('enterprise.trust.features').split(', ').map((feature, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 border border-white/5 rounded-full text-sm font-medium text-slate-300">
                  {feature}
                </span>
              ))}
            </div>
            <Link to="/governance" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors relative z-10">
              {t('enterprise.trust.link')} <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 8 — PARA QUEM É (TARGET) */}
      <Section className="border-t border-white/5 bg-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionTitle align="center">
               {t('enterprise.target.title')}
             </SectionTitle>
          </div>
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
             {t('enterprise.target.list').split(', ').map((item, idx) => (
                <div key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-300 font-medium">
                   {item}
                </div>
             ))}
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 9 — CONVERSÃO FINAL */}
      <Section className="border-t border-white/5 bg-gradient-to-t from-[#0A0A0B] to-[#0D0D11]">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
               {t('enterprise.final.title')}
             </h2>
             <p className="text-xl text-slate-400 mb-12 leading-relaxed">
               {t('enterprise.final.desc')}
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/assessment"
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2"
                >
                  {t('enterprise.hero.cta_primary')}
                  <ArrowRight size={18} />
                </Link>
                <a 
                  href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20Executive%20Advisor%20da%20Illumine."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  Conversar com um Executive Advisor™
                </a>
             </div>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
