import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Brain, ShieldCheck, Layers, Target, Users, TrendingUp, AlertTriangle, FileText, CheckCircle2, Combine, Network, Activity, ArrowDown, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

export function InstitutionalNonprofitPage() {
  const { t } = useTranslation('nonprofit');
  const { t: brand } = useTranslation('brand');

  return (
    <PageFrame className="overflow-x-hidden">
      
      {/* SECTION 1 — HERO */}
      <Hero className="min-h-[80vh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-white uppercase tracking-widest">{brand('executiveIntelligencePlatform')}</span>
          </div>
          
          <HeroTitle align="center" className="max-w-5xl">
            {t('hero.title')}
          </HeroTitle>
          
          <HeroLead align="center" className="max-w-4xl text-2xl">
            {t('hero.lead')}
          </HeroLead>
          
          <div className="mt-8 mb-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-3xl">
            <p className="text-xl font-medium text-amber-500 font-sans">
              {t('hero.sublead')}
            </p>
          </div>
          
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

      {/* SECTION 2 — UMA NOVA CATEGORIA */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
             <SectionLabel align="center">{t('category.label')}</SectionLabel>
             <SectionTitle align="center">
               {t('category.title')}
             </SectionTitle>
             <SectionLead align="center" className="mb-0">
               {t('category.desc')}
             </SectionLead>
          </div>
        </Container>
      </Section>

      {/* SECTION 3 — ARQUITETURA DE INTEGRAÇÃO (NEW) */}
      <Section className="bg-gradient-to-b from-[#0A0A0B] to-[#050506]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('architecture.label')}</SectionLabel>
             <SectionTitle align="center">
               {t('architecture.title')}
             </SectionTitle>
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center w-full px-4">
            {/* Inputs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {(t('architecture.inputs', { returnObjects: true }) as string[]).map((input, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-sans text-sm font-medium"
                >
                  {input}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <ArrowDown className="w-6 h-6 text-slate-600 mb-8 animate-bounce" />
            </motion.div>

            {/* Engines */}
            <div className="flex flex-col gap-4 mb-8 w-full max-w-md mx-auto min-w-[300px] sm:min-w-[400px]">
              {(t('architecture.engines', { returnObjects: true }) as string[]).map((engine, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + (i * 0.2) }}
                  key={i} 
                  className="w-full text-center p-5 rounded-2xl bg-[#0D1117] border border-white/10 text-white font-sans font-semibold text-lg relative overflow-hidden group shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {engine}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              <ArrowDown className="w-6 h-6 text-amber-500 mb-8 animate-bounce" />
            </motion.div>

            {/* Outcome */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, type: "spring" }}
              className="px-10 py-5 rounded-2xl bg-amber-500 text-black font-sans font-bold text-xl uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.3)] text-center whitespace-nowrap min-w-[280px]"
            >
              {t('architecture.outcome')}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* SECTION 4 — ANTES/DEPOIS (NEW) */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('board.label')}</SectionLabel>
             <SectionTitle align="center">{t('board.title')}</SectionTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Antes */}
            <div className="p-8 rounded-3xl bg-red-950/10 border border-red-900/20 flex flex-col">
              <h4 className="text-red-400 font-sans font-bold text-xl mb-8 uppercase tracking-widest">{t('board.before_title')}</h4>
              <ul className="space-y-6">
                {(t('board.before_items', { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-300 font-sans text-lg">
                    <XCircle className="w-6 h-6 text-red-500/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Depois */}
            <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
              <h4 className="text-amber-500 font-sans font-bold text-xl mb-8 uppercase tracking-widest relative z-10">{t('board.after_title')}</h4>
              <ul className="space-y-6 relative z-10">
                {(t('board.after_items', { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-sans text-lg font-medium">
                    <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 5 — O PROBLEMA (Sua organização já executa) */}
      <Section className="bg-[#050506] border-t border-white/5">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('problem.label')}</SectionLabel>
             <SectionTitle align="center">
               {t('problem.title')}
             </SectionTitle>
             <SectionLead align="center">
               {t('problem.desc_p1')}
             </SectionLead>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
             {[
               t('problem.q1'),
               t('problem.q2'),
               t('problem.q3'),
               t('problem.q4'),
               t('problem.q5'),
               t('problem.q6'),
             ].map((question, i) => (
               <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                     <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-slate-300 font-sans text-sm font-medium leading-relaxed">{question}</p>
               </div>
             ))}
          </div>
          
          <div className="text-center">
            <p className="inline-block px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium font-sans">
              {t('problem.conclusion')}
            </p>
          </div>
        </Container>
      </Section>

      {/* SECTION 6 — EXECUTIVE OFFICES */}
      <Section className="bg-[#0A0A0B] border-t border-white/5">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
             <SectionLabel align="center">{t('offices.label')}</SectionLabel>
             <SectionTitle align="center">{t('offices.title')}</SectionTitle>
             <SectionLead align="center">
               {t('offices.lead')}
             </SectionLead>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: Users, title: t('offices.board.title'), desc: t('offices.board.desc') },
               { icon: ShieldCheck, title: t('offices.governance.title'), desc: t('offices.governance.desc') },
               { icon: TrendingUp, title: t('offices.financial.title'), desc: t('offices.financial.desc') },
               { icon: Target, title: t('offices.mission.title'), desc: t('offices.mission.desc') },
               { icon: AlertTriangle, title: t('offices.risk.title'), desc: t('offices.risk.desc') },
               { icon: FileText, title: t('offices.compliance.title'), desc: t('offices.compliance.desc') },
             ].map((office, i) => {
               const Icon = office.icon;
               return (
                 <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col hover:bg-white/10 transition-colors h-full">
                    <Icon className="w-8 h-8 text-slate-400 mb-6 shrink-0" />
                    <h4 className="text-xl font-bold text-white mb-3 font-sans">{office.title}</h4>
                    <p className="text-slate-400 font-sans text-base leading-relaxed">{office.desc}</p>
                 </div>
               );
             })}
             {/* AI Advisory Card (Highlight) */}
             <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col relative overflow-hidden lg:col-span-3">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Brain size={120} className="text-amber-500" /></div>
                <Brain className="w-10 h-10 text-amber-500 mb-6 relative z-10" />
                <h4 className="text-2xl font-bold text-white mb-3 relative z-10 font-sans">{t('offices.ai.title')}</h4>
                <p className="text-slate-200 relative z-10 font-sans text-lg max-w-2xl leading-relaxed">
                  {t('offices.ai.desc')}
                </p>
             </div>
          </div>
        </Container>
      </Section>
      
      {/* SECTION 7 — EXECUTIVE SCORES (UI ENHANCED) */}
      <Section className="bg-[#050506]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('scores.label')}</SectionLabel>
             <SectionTitle align="center">{t('scores.title')}</SectionTitle>
             <SectionLead align="center">
               {t('scores.lead')}
             </SectionLead>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { label: "Governance Health™", value: 87, status: t('scores.status.excellent'), color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Mission Alignment™", value: 94, status: t('scores.status.excellent'), color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Financial Sustainability™", value: 42, status: t('scores.status.low'), color: "text-red-500", bg: "bg-red-500/10" },
              { label: "Board Effectiveness™", value: 74, status: t('scores.status.attention'), color: "text-amber-500", bg: "bg-amber-500/10" }
            ].map((score, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col relative overflow-hidden">
                <h4 className="text-slate-300 font-sans text-sm font-semibold mb-6">{score.label}</h4>
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className={cn("text-4xl font-bold font-sans tracking-tighter leading-none mb-1", score.color)}>
                      {score.value}
                    </span>
                    <span className="text-xs uppercase tracking-widest font-sans font-bold text-slate-500">
                      Score
                    </span>
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase font-sans tracking-wider", score.bg, score.color)}>
                    {score.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 8 — TIMELINE DE VALOR */}
      <Section className="border-y border-white/5 bg-[#0A0A0B] overflow-hidden">
        <Container className="relative z-10 flex flex-col items-center">
           <div className="text-center mb-20 flex flex-col items-center">
              <SectionLabel align="center">{t('intelligence_timeline.label')}</SectionLabel>
              <SectionTitle align="center" className="max-w-4xl">
                {t('intelligence_timeline.title')}
              </SectionTitle>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
              
              {[
                { label: t('intelligence_timeline.steps.data'), highlight: false },
                { label: t('intelligence_timeline.steps.indicators'), highlight: false },
                { label: t('intelligence_timeline.steps.correlations'), highlight: false },
                { label: t('intelligence_timeline.steps.executive_intel'), highlight: true },
                { label: t('intelligence_timeline.steps.ai_advisor'), highlight: true },
                { label: t('intelligence_timeline.steps.decisions'), highlight: true, last: true },
                { label: t('intelligence_timeline.steps.impact'), highlight: true, special: true }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center mb-8 md:mb-0">
                  <div className={cn(
                    "w-4 h-4 rounded-full mb-4 ring-4",
                    step.special ? "bg-amber-500 ring-amber-500/20" :
                    step.highlight ? "bg-white ring-white/10" : "bg-slate-600 ring-transparent"
                  )} />
                  <span className={cn(
                    "text-xs uppercase tracking-widest font-sans font-bold text-center max-w-[100px]",
                    step.special ? "text-amber-500" :
                    step.highlight ? "text-white" : "text-slate-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
           </div>
        </Container>
      </Section>

      {/* SECTION 9 — COMPARISON */}
      <Section className="bg-[#050506]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('comparison.label')}</SectionLabel>
             <SectionTitle align="center">{t('comparison.title')}</SectionTitle>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm font-sans">{t('comparison.traditional')}</div>
              <div className="text-center text-amber-500 font-bold uppercase tracking-widest text-sm font-sans">{t('comparison.illumine')}</div>
            </div>
            
            {[
              { t: t('comparison.point1.t'), i: t('comparison.point1.i') },
              { t: t('comparison.point2.t'), i: t('comparison.point2.i') },
              { t: t('comparison.point3.t'), i: t('comparison.point3.i') },
              { t: t('comparison.point4.t'), i: t('comparison.point4.i') },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center flex items-center justify-center">
                  <span className="text-slate-400 font-sans">{row.t}</span>
                </div>
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <span className="text-white font-semibold font-sans">{row.i}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      
      {/* SECTION 10 — AUDIENCE */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('audience.label')}</SectionLabel>
             <SectionTitle align="center">{t('audience.title')}</SectionTitle>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
              <h4 className="text-xl font-bold text-white mb-6 font-sans">Organizações</h4>
              <ul className="space-y-4">
                {(t('audience.org_types', { returnObjects: true }) as string[]).map((org, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-sans">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    {org}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
              <h4 className="text-xl font-bold text-white mb-6 font-sans">Liderança</h4>
              <ul className="space-y-4">
                {(t('audience.profiles', { returnObjects: true }) as string[]).map((profile, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-sans">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    {profile}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
      
      {/* SECTION 11 — AI ADVISOR EXAMPLES */}
      <Section className="bg-gradient-to-b from-[#0A0A0B] to-[#050506]">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
             <SectionLabel align="center">{t('ai_advisor.label')}</SectionLabel>
             <SectionTitle align="center">{t('ai_advisor.title')}</SectionTitle>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              t('ai_advisor.ex1'),
              t('ai_advisor.ex2'),
              t('ai_advisor.ex3'),
              t('ai_advisor.ex4')
            ].map((ex, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 shadow-lg">
                <Brain className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
                <p className="text-slate-200 font-sans leading-relaxed font-medium">"{ex}"</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 12 — INTEGRATIONS */}
      <Section className="border-t border-white/5 bg-[#0A0A0B]">
        <Container>
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
             <Database className="w-12 h-12 text-slate-400 mb-8" />
             <SectionLabel align="center">{t('integrations.label')}</SectionLabel>
             <SectionTitle align="center">{t('integrations.title')}</SectionTitle>
             <SectionLead align="center" className="mb-8">
               {t('integrations.desc')}
             </SectionLead>
             <div className="px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-2xl">
               <p className="text-amber-500 font-sans font-medium text-lg">
                 {t('integrations.highlight')}
               </p>
             </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 13 — IMPACTO SOCIAL (NEW) */}
      <Section className="border-t border-white/5 bg-[#050506]">
        <Container>
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
             <SectionLabel align="center">{t('impact.label')}</SectionLabel>
             <SectionTitle align="center">{t('impact.title')}</SectionTitle>
             
             <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 max-w-2xl w-full text-left">
               <p className="text-xl font-sans text-white font-medium mb-8">{t('impact.lead')}</p>
               <ul className="space-y-6">
                 {(t('impact.items', { returnObjects: true }) as string[]).map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-slate-300 font-sans text-lg">
                     <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 14 — VISION & CTA */}
      <Section className="bg-[#0A0A0B] border-t border-white/5">
        <Container>
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
             <SectionLabel align="center">{t('vision.label')}</SectionLabel>
             <SectionTitle align="center">{t('vision.title')}</SectionTitle>
             <SectionLead align="center" className="mb-12">
               {t('vision.desc')}
             </SectionLead>
             <Link 
               to="/assessment"
               className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-sans"
             >
               {t('vision.cta')}
               <ArrowRight size={18} />
             </Link>
          </div>
        </Container>
      </Section>
      
    </PageFrame>
  );
}
