import React from 'react';
import { Link } from 'react-router-dom';
import { ExecutiveCommandShowcase } from './showcases/ExecutiveCommandShowcase';
import { ArrowRight, Database, Brain, Activity, Clock, ShieldCheck, FileKey, Layers, Combine, Cpu, Lock, Network, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GovernanceShowcase } from './showcases/GovernanceShowcase';
import { SystemicIntelligenceShowcase } from './showcases/SystemicIntelligenceShowcase';
import { ExecutiveInsightCard } from './components/ExecutiveInsightCard';
import { LeadershipLayer } from './components/LeadershipLayer';
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
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalHomePage() {
  const { t } = useTranslation('institutional');
  const { t: brand } = useTranslation('brand');

  return (
    <PageFrame className="overflow-x-hidden">
      
      {/* SEÇÃO 1 — HERO */}
      <Hero className="min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen opacity-40" />
        </div>

        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-white uppercase tracking-widest">{brand('executiveIntelligencePlatform')}</span>
          </div>
          
          <HeroTitle align="center" className="max-w-5xl">
            {t('hero.title')}
          </HeroTitle>
          
          <HeroLead align="center">
            {t('hero.lead')}
          </HeroLead>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/assessment"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {t('hero.cta_primary')}
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/plataforma"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
            >
              {t('hero.cta_secondary')}
            </Link>
          </div>
        </Container>
      </Hero>

      {/* SEÇÃO 2 — O PROBLEMA */}
      <Section className="border-t border-white/5 bg-gradient-to-b from-[#0A0A0B] to-[#0D0D11]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
             <SectionLabel align="center">{t('problem.label')}</SectionLabel>
             <SectionTitle align="center">
               {t('problem.title')}
             </SectionTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                <Database className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-white mb-2 font-sans">{t('problem.erp_title')}</h4>
                <p className="text-slate-400 flex-1 font-sans text-base leading-relaxed">{t('problem.erp_desc')} <strong>{t('problem.erp_strong')}</strong></p>
             </div>
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                <Activity className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-white mb-2 font-sans">{t('problem.bi_title')}</h4>
                <p className="text-slate-400 flex-1 font-sans text-base leading-relaxed">{t('problem.bi_desc')} <strong>{t('problem.bi_strong')}</strong></p>
             </div>
             <div className="p-8 rounded-2xl bg-white/10 border border-white/20 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={80} className="text-white" /></div>
                <Brain className="w-8 h-8 text-white mb-6 relative z-10" />
                <h4 className="text-xl font-bold text-white mb-2 relative z-10 font-sans">{t('problem.illumine_title')}</h4>
                <p className="text-slate-200 relative z-10 font-sans text-base leading-relaxed">
                  {t('problem.illumine_desc')} <strong>{t('problem.illumine_strong')}</strong>
                </p>
             </div>
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 3 — A SOLUÇÃO */}
      <Section className="bg-[#050506] border-y border-white/5">
        <Container className="flex flex-col items-center text-center">
          <SectionTitle align="center" className="max-w-4xl mb-20">
            {t('solution.title_prefix')} <span className="text-slate-400 font-medium">{t('solution.title_highlight')}</span>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
             {/* Camada 1 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-black">
                   <Layers className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 font-sans">{t('solution.layer1_title')}</h4>
                <p className="text-slate-400 leading-relaxed mb-6 font-sans text-base">
                   {t('solution.layer1_desc')}
                </p>
                <div className="mt-auto px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300 font-sans">
                   {t('solution.layer1_quote')}
                </div>
             </div>

             {/* Camada 2 */}
             <div className="flex flex-col items-center text-center relative">
                <div className="hidden md:block absolute top-10 -left-6 w-12 border-t border-dashed border-white/20"></div>
                <div className="hidden md:block absolute top-10 -right-6 w-12 border-t border-dashed border-white/20"></div>
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                   <Cpu className="w-10 h-10 text-amber-500" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 font-sans">{t('solution.layer2_title')}</h4>
                <p className="text-slate-400 leading-relaxed mb-6 font-sans text-base">
                   {t('solution.layer2_desc')}
                </p>
                <div className="mt-auto px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300 font-sans">
                   {t('solution.layer2_quote')}
                </div>
             </div>

             {/* Camada 3 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-black">
                   <Network className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 font-sans">{t('solution.layer3_title')}</h4>
                <p className="text-slate-400 leading-relaxed mb-6 font-sans text-base">
                   {t('solution.layer3_desc')}
                </p>
                <div className="mt-auto px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300 font-sans">
                   {t('solution.layer3_quote')}
                </div>
             </div>
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 4 — DIFERENCIAL (Learning Loop) */}
      <Section className="overflow-hidden bg-[#0A0A0B]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0A0A0B] to-[#0A0A0B] z-0" />
        
        <Container className="relative z-10 flex flex-col items-center">
           <div className="text-center mb-16 flex flex-col items-center">
              <SectionLabel align="center">{t('learning_loop.label')}</SectionLabel>
              <SectionTitle align="center" className="max-w-4xl">
                {t('learning_loop.title')}
              </SectionTitle>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto w-full">
              <div className="order-2 lg:order-1">
                 <Narrative className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed space-y-6">
                    <p>
                      {t('learning_loop.p1')}
                    </p>
                    <p>
                      {t('learning_loop.p2')}
                    </p>
                 </Narrative>
                 <Insight className="mt-8">
                    {t('learning_loop.insight')}
                 </Insight>
              </div>

              {/* Animated Loop Representation */}
              <div className="order-1 lg:order-2 relative h-[500px] flex items-center justify-center">
                 {/* Central Core */}
                 <div className="absolute z-30 w-40 h-40 bg-black rounded-full border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center flex-col gap-2">
                    <Combine className="w-8 h-8 text-white" />
                    <span className="text-[10px] font-medium text-white uppercase tracking-widest text-center font-sans">Learning<br/>Loop</span>
                 </div>

                 {/* Orbits */}
                 <div className="absolute w-[300px] h-[300px] border border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
                 <div className="absolute w-[450px] h-[450px] border border-dashed border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

                 {/* Orbiting Nodes */}
                 <div className="absolute w-[300px] h-[300px] animate-[spin_30s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -ml-5 -mt-5 w-10 h-10 bg-zinc-900 border border-white/20 rounded-full flex items-center justify-center shadow-lg shadow-white/5">
                       <span className="text-[8px] uppercase font-bold text-slate-300 font-sans">{t('learning_loop.observe')}</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -ml-5 -mb-5 w-10 h-10 bg-zinc-900 border border-white/20 rounded-full flex items-center justify-center shadow-lg shadow-white/5">
                       <span className="text-[8px] uppercase font-bold text-slate-300 font-sans">{t('learning_loop.decide')}</span>
                    </div>
                 </div>

                 <div className="absolute w-[450px] h-[450px] animate-[spin_40s_linear_infinite_reverse]">
                    <div className="absolute left-0 top-1/2 -mt-6 -ml-6 w-12 h-12 bg-[#0A0A0B] border border-white/20 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] -rotate-45">
                       <div className="rotate-45 flex flex-col items-center">
                          <span className="text-[8px] uppercase tracking-widest text-slate-300 font-bold font-sans">{t('learning_loop.learn')}</span>
                       </div>
                    </div>
                    <div className="absolute right-0 top-1/2 -mt-6 -mr-6 w-12 h-12 bg-[#0A0A0B] border border-amber-500/30 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,150,0,0.1)] rotate-45">
                       <div className="-rotate-45 flex flex-col items-center">
                          <span className="text-[8px] uppercase tracking-widest text-amber-500 font-bold font-sans">{t('learning_loop.evolve')}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </Container>
      </Section>

      {/* SEÇÃO 5 — DOMÍNIOS (e Showcases) */}
      <Section className="bg-[#050506] border-t border-white/5 relative z-20">
         <Container>
            <div className="text-center mb-16 max-w-4xl mx-auto flex flex-col items-center">
               <SectionLabel align="center">{t('domains.label')}</SectionLabel>
               <SectionTitle align="center">{t('domains.title')}</SectionTitle>
               <SectionLead align="center">
                 {t('domains.lead')}
               </SectionLead>
               
               {/* Grid de 9 Domínios */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-24 justify-center max-w-5xl mx-auto w-full">
                  {[
                    "Governance", "Financial", "Operational", "Commercial", "People", "Risk", "Institutional", "Mission", "Innovation"
                  ].map((domain, i) => (
                    <div key={i} className={cn(
                      "px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-300 flex items-center justify-center text-center font-sans",
                      domain === "Innovation" && "lg:col-start-3" // Centraliza o último na grid de 5 colunas
                    )}>
                       {domain} Intelligence™
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-40">
               {/* Showcase 1: Executive Command */}
               <div className="space-y-8">
                  <div className="max-w-3xl">
                     <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 uppercase tracking-widest font-sans">
                        {t('domains.showcases.command.tag')}
                     </div>
                     <SectionTitle>{t('domains.showcases.command.title')}</SectionTitle>
                     <SectionLead>
                        {t('domains.showcases.command.lead')}
                     </SectionLead>
                  </div>
                  <div className="relative isolate overflow-hidden">
                     <ExecutiveCommandShowcase />
                     <div className="absolute right-4 bottom-4 w-[320px] xl:w-[384px] hidden lg:block z-30 shadow-2xl font-sans">
                        <ExecutiveInsightCard 
                           author={t('domains.showcases.command.insight_author')}
                           text={t('domains.showcases.command.insight_text')}
                           date={t('domains.showcases.command.insight_date')}
                           variant="float"
                        />
                     </div>
                  </div>
               </div>

               {/* Showcase 3: Systemic Intelligence */}
               <div className="space-y-8">
                  <div className="max-w-3xl ml-auto text-right flex flex-col items-end">
                     <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 uppercase tracking-widest font-sans">
                        {t('domains.showcases.systemic.tag')}
                     </div>
                     <SectionTitle align="right">{t('domains.showcases.systemic.title')}</SectionTitle>
                     <SectionLead align="right" className="ml-auto mr-0">
                        {t('domains.showcases.systemic.lead')}
                     </SectionLead>
                  </div>
                  <div className="relative isolate overflow-hidden">
                     <SystemicIntelligenceShowcase />
                     <div className="absolute left-4 bottom-4 w-[320px] xl:w-[384px] hidden lg:block z-30 shadow-2xl font-sans">
                        <ExecutiveInsightCard 
                           author={t('domains.showcases.systemic.insight_author')}
                           text={t('domains.showcases.systemic.insight_text')}
                           date={t('domains.showcases.systemic.insight_date')}
                           variant="float"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </Container>
      </Section>

      {/* SEÇÃO 6 - A DECISÃO PERMANECE HUMANA (Leadership Layer) */}
      <Section className="bg-[#0A0A0B] border-t border-white/5 relative z-20">
         <Container>
            <div className="text-center mb-16 max-w-4xl mx-auto flex flex-col items-center">
               <SectionLabel align="center">{t('human_oversight.label')}</SectionLabel>
               <SectionTitle align="center">{t('human_oversight.title')}</SectionTitle>
               <SectionLead align="center">
                 {t('human_oversight.lead')}
               </SectionLead>
            </div>
            <LeadershipLayer />
         </Container>
      </Section>

      {/* SEÇÃO 7 — TRUST ARCHITECTURE™ */}
      <Section className="bg-[#0A0A0B] border-y border-white/5">
        <Container className="text-center flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-8" />
          <SectionLabel align="center">{t('trust.label')}</SectionLabel>
          <SectionTitle align="center">{t('trust.title')}</SectionTitle>
          <SectionLead align="center" className="mb-16">
            {t('trust.lead')}
          </SectionLead>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Globe, title: t('trust.principles.p1.title'), desc: t('trust.principles.p1.desc') },
              { icon: FileKey, title: t('trust.principles.p2.title'), desc: t('trust.principles.p2.desc') },
              { icon: Clock, title: t('trust.principles.p3.title'), desc: t('trust.principles.p3.desc') },
              { icon: Database, title: t('trust.principles.p4.title'), desc: t('trust.principles.p4.desc') },
              { icon: Lock, title: t('trust.principles.p5.title'), desc: t('trust.principles.p5.desc') },
            ].map((principle, i) => (
              <div key={i} className="text-left bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col items-start font-sans">
                <principle.icon className="w-8 h-8 text-slate-300 mb-4" />
                <h4 className="text-white font-semibold mb-2 leading-tight">{principle.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-auto">{principle.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SEÇÃO 7 — ECOSSISTEMA & CTA */}
      <Section className="bg-[#050506]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
             {/* Enterprise */}
             <div className="p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col items-start font-sans">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={120} /></div>
                <h4 className="text-3xl font-bold text-white mb-4 relative z-10">{t('ecosystem.enterprise.title')}</h4>
                <p className="text-slate-400 mb-8 relative z-10 text-lg leading-relaxed flex-1">
                  {t('ecosystem.enterprise.desc')}
                </p>
             </div>
             
             {/* Advisor Network */}
             <div className="p-12 rounded-3xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden flex flex-col items-start font-sans">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Network size={120} /></div>
                <h4 className="text-3xl font-bold text-white mb-4 relative z-10">{t('ecosystem.advisor.title')}</h4>
                <p className="text-slate-300 mb-8 relative z-10 text-lg leading-relaxed flex-1">
                  {t('ecosystem.advisor.desc')}
                </p>
                <div className="inline-block mt-auto px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 font-medium">
                   {t('ecosystem.advisor.quote')}
                </div>
             </div>
          </div>

          <div className="text-center max-w-4xl mx-auto pt-12 border-t border-white/5 flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight font-sans tracking-tight">
              {brand('principle').split('.')[0]}.<br />
              <span className="text-amber-500">{brand('principle').split('.')[1]}.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 font-sans font-medium">
              {t('cta_bottom.lead')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link 
                 to="/assessment"
                 className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-sans"
               >
                 {t('hero.cta_primary')}
                 <ArrowRight size={18} />
               </Link>
            </div>
          </div>
        </Container>
      </Section>

    </PageFrame>
  );
}
