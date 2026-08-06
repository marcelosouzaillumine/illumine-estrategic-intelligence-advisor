import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Brain, Activity, ShieldCheck, Layers, Combine, Network, Globe, Lock, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  Insight,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalHomePage() {
  const { t } = useTranslation('institutional');

  return (
    <PageFrame className="overflow-x-hidden">
      
      {/* 1. HERO — CATEGORIA */}
      <Hero className="min-h-[80vh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-white uppercase tracking-widest">{t('home.v2.hero.title')}</span>
          </div>
          
          <HeroTitle align="center" className="max-w-5xl">
            {t('home.v2.hero.subtitle')}
          </HeroTitle>
          
          <HeroLead align="center">
            {t('home.v2.hero.lead')}
          </HeroLead>
          
          <div className="mt-8 mb-12 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-2xl text-center">
            <p className="text-amber-500 font-bold mb-2">{t('home.v2.hero.badge')}</p>
            <p className="text-slate-300 font-medium text-lg leading-relaxed">
              {t('home.v2.hero.badge_desc')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/assessment"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {t('home.v2.hero.cta_primary')}
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/platform"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
            >
              {t('home.v2.hero.cta_secondary')}
            </Link>
          </div>
        </Container>
      </Hero>

      {/* 2. O PROBLEMA — INFORMAÇÃO SEM CONTEXTO */}
      <Section className="border-t border-white/5 bg-gradient-to-b from-[#0A0A0B] to-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionTitle align="center">
               {t('home.v2.problem.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('home.v2.problem.lead')}
             </SectionLead>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                <Database className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-slate-300">{t('home.v2.problem.erp')}</h4>
             </div>
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                <Activity className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-slate-300">{t('home.v2.problem.bi')}</h4>
             </div>
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                <Network className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-slate-300">{t('home.v2.problem.analytics')}</h4>
             </div>
          </div>
          
          <div className="max-w-2xl mx-auto text-center p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20">
             <Brain className="w-10 h-10 text-amber-500 mx-auto mb-4" />
             <p className="text-2xl font-bold text-white">{t('home.v2.problem.illumine')}</p>
          </div>
        </Container>
      </Section>

      {/* 3. A NOVA CAMADA DE INTELIGÊNCIA */}
      <Section className="border-t border-white/5 bg-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
             <SectionTitle align="center">
               {t('home.v2.layer.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('home.v2.layer.lead')}
             </SectionLead>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
             {/* Foundation Layer */}
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-8">
               <div className="p-4 bg-white/10 rounded-2xl shrink-0">
                 <Layers className="w-10 h-10 text-white" />
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-2">{t('home.v2.layer.foundation_title')}</h4>
                 <p className="text-slate-400 text-lg leading-relaxed">{t('home.v2.layer.foundation_desc')}</p>
               </div>
             </div>
             
             {/* Engine Layer */}
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-8">
               <div className="p-4 bg-amber-500/20 rounded-2xl shrink-0">
                 <Cpu className="w-10 h-10 text-amber-500" />
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-amber-400 mb-2">{t('home.v2.layer.engine_title')}</h4>
                 <p className="text-slate-400 text-lg leading-relaxed">{t('home.v2.layer.engine_desc')}</p>
               </div>
             </div>
             
             {/* Advisory Layer */}
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-8">
               <div className="p-4 bg-white/10 rounded-2xl shrink-0">
                 <Combine className="w-10 h-10 text-white" />
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-2">{t('home.v2.layer.advisory_title')}</h4>
                 <p className="text-slate-400 text-lg leading-relaxed">{t('home.v2.layer.advisory_desc')}</p>
               </div>
             </div>
          </div>
        </Container>
      </Section>

      {/* 4. A ORGANIZAÇÃO COMO SISTEMA VIVO */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionTitle align="center">
               {t('home.v2.network.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('home.v2.network.lead')}
             </SectionLead>
          </div>

          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center relative">
             <style>{`
               @keyframes fadeUp {
                 from { opacity: 0; transform: translateY(20px); }
                 to { opacity: 1; transform: translateY(0); }
               }
               @keyframes flowDown {
                 0% { transform: translateY(-100%); opacity: 0; }
                 50% { opacity: 1; }
                 100% { transform: translateY(200%); opacity: 0; }
               }
               @keyframes shimmer {
                 100% { transform: translateX(100%); }
               }
             `}</style>
             
             <div className="w-full p-6 sm:p-8 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]" style={{ animation: 'fadeUp 0.8s ease-out 0s both' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <p className="text-xl sm:text-2xl font-bold text-slate-300 group-hover:text-white transition-colors">{t('home.v2.network.flow_1')}</p>
             </div>
             
             <div className="h-10 sm:h-12 w-px bg-gradient-to-b from-white/0 via-amber-500/30 to-white/0 relative overflow-hidden" style={{ animation: 'fadeUp 0.8s ease-out 0.2s both' }}>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-amber-500 animate-[flowDown_1.5s_ease-in-out_infinite]" />
             </div>
             
             <div className="w-full p-6 sm:p-8 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]" style={{ animation: 'fadeUp 0.8s ease-out 0.4s both' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <p className="text-xl sm:text-2xl font-bold text-slate-300 group-hover:text-white transition-colors">{t('home.v2.network.flow_2')}</p>
             </div>

             <div className="h-10 sm:h-12 w-px bg-gradient-to-b from-white/0 via-amber-500/30 to-white/0 relative overflow-hidden" style={{ animation: 'fadeUp 0.8s ease-out 0.6s both' }}>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-amber-500 animate-[flowDown_1.5s_ease-in-out_infinite_0.5s]" />
             </div>
             
             <div className="w-full p-6 sm:p-8 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]" style={{ animation: 'fadeUp 0.8s ease-out 0.8s both' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <p className="text-xl sm:text-2xl font-bold text-slate-300 group-hover:text-white transition-colors">{t('home.v2.network.flow_3')}</p>
             </div>

             <div className="h-10 sm:h-12 w-px bg-gradient-to-b from-white/0 via-amber-500/30 to-white/0 relative overflow-hidden" style={{ animation: 'fadeUp 0.8s ease-out 1.0s both' }}>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-amber-500 animate-[flowDown_1.5s_ease-in-out_infinite_1.0s]" />
             </div>
             
             <div className="w-full p-8 sm:p-10 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_15px_50px_rgba(245,158,11,0.25)]" style={{ animation: 'fadeUp 0.8s ease-out 1.2s both' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <p className="text-2xl sm:text-3xl font-bold text-amber-500 group-hover:text-amber-400 transition-colors drop-shadow-lg">{t('home.v2.network.flow_4')}</p>
             </div>
          </div>
        </Container>
      </Section>

      {/* 5. MEMÓRIA INSTITUCIONAL E CONFIANÇA */}
      <Section className="border-t border-white/5 bg-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
             <SectionTitle align="center">
               {t('home.v2.trust.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('home.v2.trust.lead')}
             </SectionLead>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             <div className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
                <Database className="w-10 h-10 text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('home.v2.trust.learning_title')}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{t('home.v2.trust.learning_desc')}</p>
             </div>
             
             <div className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
                <Lock className="w-10 h-10 text-white mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('home.v2.trust.trust_title')}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{t('home.v2.trust.trust_desc')}</p>
                <Link to="/governance" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors mt-8">
                  Conheça Trust Architecture™ <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </Container>
      </Section>

      {/* 6. ECOSSISTEMA ILLUMINE */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionTitle align="center">
               {t('home.v2.ecosystem.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('home.v2.ecosystem.lead')}
             </SectionLead>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
             {/* Enterprise */}
             <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all group flex flex-col">
                <Globe className="w-10 h-10 text-slate-400 group-hover:text-amber-500 mb-6 transition-colors" />
                <h4 className="text-2xl font-bold text-white mb-3">{t('home.v2.ecosystem.enterprise_title')}</h4>
                <p className="text-slate-400 mb-8 flex-1">{t('home.v2.ecosystem.enterprise_desc')}</p>
                <Link to="/enterprise" className="inline-flex items-center gap-2 text-white group-hover:text-amber-500 transition-colors font-semibold">
                  Conheça Enterprise <ArrowRight size={16} />
                </Link>
             </div>
             
             {/* Nonprofit */}
             <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all group flex flex-col">
                <Globe className="w-10 h-10 text-slate-400 group-hover:text-amber-500 mb-6 transition-colors" />
                <h4 className="text-2xl font-bold text-white mb-3">{t('home.v2.ecosystem.nonprofit_title')}</h4>
                <p className="text-slate-400 mb-8 flex-1">{t('home.v2.ecosystem.nonprofit_desc')}</p>
                <Link to="/nonprofit" className="inline-flex items-center gap-2 text-white group-hover:text-amber-500 transition-colors font-semibold">
                  Conheça Nonprofit <ArrowRight size={16} />
                </Link>
             </div>
             
             {/* Advisor Network */}
             <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all group flex flex-col">
                <Combine className="w-10 h-10 text-slate-400 group-hover:text-amber-500 mb-6 transition-colors" />
                <h4 className="text-2xl font-bold text-white mb-3">{t('home.v2.ecosystem.advisor_title')}</h4>
                <p className="text-slate-400 mb-8 flex-1">{t('home.v2.ecosystem.advisor_desc')}</p>
                <Link to="/advisor-network" className="inline-flex items-center gap-2 text-white group-hover:text-amber-500 transition-colors font-semibold">
                  Conheça Advisor Network <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </Container>
      </Section>

      {/* CTA FINAL */}
      <Section className="border-t border-white/5 bg-gradient-to-t from-[#0A0A0B] to-[#0D0D11]">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
               {t('home.v2.hero.insight')}
             </h2>
             <p className="text-xl text-slate-400 mb-12 leading-relaxed">
               {t('home.v2.trust.learning_desc')}
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/assessment"
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2"
                >
                  {t('home.v2.hero.cta_primary')}
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
