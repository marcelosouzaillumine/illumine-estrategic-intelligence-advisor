import React from 'react';
import { 
  Database, LineChart, Cpu, MessageSquare, Brain, ArrowRight, 
  Layers, ShieldCheck, Activity, Eye, Zap, Network, History, 
  FileCheck, Lock, Users, Compass, Briefcase, Award, TrendingUp, CheckCircle2, Target, Building,
  Plus, ChevronDown, Check, BookOpen, Handshake, MonitorPlay
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
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
  Card,
  CardGrid,
} from '@/components/ui/public/institutional/InstitutionalContentSystem';

// FAQ Accordion Item Component
const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border border-white/10 rounded-2xl bg-[#050506] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white text-lg">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function InstitutionalAdvisorPartnerPage() {
  const { t } = useTranslation('advisor-partner');

  return (
    <PageFrame>
      {/* 1. Hero */}
      <Hero className="min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0B] to-[#0A0A0B]">
        <Container className="relative z-10 flex flex-col items-center text-center pt-20">
          <SectionLabel align="center">{t('hero.label')}</SectionLabel>
          <HeroTitle align="center" className="max-w-5xl mb-6">
            {t('hero.lead')}
          </HeroTitle>
          <HeroLead align="center" className="max-w-3xl mb-8">
            {t('hero.narrative')}
          </HeroLead>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {t('hero.tag1')}
            </div>
            <span className="text-slate-600 hidden sm:block">+</span>
            <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-sm flex items-center gap-2">
              <Compass className="w-4 h-4" />
              {t('hero.tag2')}
            </div>
            <span className="text-slate-600 hidden sm:block">+</span>
            <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-sm flex items-center gap-2">
              <Award className="w-4 h-4" />
              {t('hero.tag3')}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="#plans"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-sans"
            >
              {t('hero.cta_primary')}
            </Link>
            <Link 
              to="#contact"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300 inline-flex items-center gap-2 font-sans"
            >
              {t('hero.cta_secondary')}
            </Link>
          </div>
        </Container>
      </Hero>

      {/* 2. Você não está adquirindo apenas uma plataforma */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32 relative overflow-hidden">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center" className="!mb-4">{t('not_just.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl mb-4 font-semibold text-amber-500/90">{t('not_just.lead')}</SectionLead>
            <p className="text-slate-400 text-lg max-w-4xl leading-relaxed">{t('not_just.narrative')}</p>
          </div>
          <CardGrid className="md:grid-cols-3 max-w-6xl mx-auto">
            <Card variant="secondary" className="p-8 border-white/10">
              <Database className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{t('not_just.c1')}</h3>
            </Card>
            <Card variant="secondary" className="p-8 border-white/10">
              <Compass className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{t('not_just.c2')}</h3>
            </Card>
            <Card variant="secondary" className="p-8 border-white/10">
              <BookOpen className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{t('not_just.c3')}</h3>
            </Card>
            <Card variant="secondary" className="p-8 border-white/10">
              <Award className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{t('not_just.c4')}</h3>
            </Card>
            <Card variant="secondary" className="p-8 border-white/10">
              <Handshake className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{t('not_just.c5')}</h3>
            </Card>
            <Card variant="secondary" className="p-8 border-white/10">
              <Activity className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{t('not_just.c6')}</h3>
            </Card>
          </CardGrid>
        </Container>
      </Section>

      {/* 3. Executive Intelligence Platform™ */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('not_just.c1')}</SectionLabel>
            <SectionTitle align="center">{t('platform.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('platform.lead')}</SectionLead>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'].map((key) => (
              <div key={key} className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm font-medium text-slate-300">{t(`platform.${key}`)}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Como funciona a parceria */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('partnership.title')}</SectionTitle>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-white/10 hidden md:block" />
            <div className="space-y-8 relative">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div key={step} className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500 font-bold relative z-10">
                    {step}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-white">{t(`partnership.flow${step}`)}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Executive Partner Enablement™ */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-[#0A0A0B] to-[#0A0A0B] pointer-events-none" />
        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionLabel align="center">{t('enablement.label')}</SectionLabel>
            <SectionTitle align="center">{t('enablement.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('enablement.desc')}</SectionLead>
          </div>

          <div className="max-w-4xl mx-auto bg-black/40 border border-amber-500/30 rounded-3xl p-10 md:p-12 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
            <div className="text-center mb-12 pb-8 border-b border-white/10">
              <span className="block text-slate-400 font-medium uppercase tracking-wider mb-2">{t('enablement.price_label')}</span>
              <div className="text-5xl font-bold text-white">{t('enablement.price')}</div>
            </div>
            
            <h4 className="text-lg font-bold text-amber-500 mb-6">{t('enablement.includes')}</h4>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-slate-300">
                    {t(`enablement.i${i}`)}
                    {i === 10 && (
                      <span className="block text-xs text-amber-500/80 font-medium mt-1">{t('enablement.i10_note')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Advisor Membership™ */}
      <Section id="plans" className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('plans.title')}</SectionTitle>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {/* Foundation */}
            <div className="border border-white/10 bg-[#0A0A0B] rounded-2xl p-8 flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{t('plans.foundation.title')}</h3>
              <div className="text-2xl font-bold text-amber-500 mb-4">{t('plans.foundation.price')}</div>
              <p className="text-slate-400 text-sm mb-8 h-10">{t('plans.foundation.desc')}</p>
              <ul className="space-y-4 flex-1 mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{t(`plans.foundation.i${i}`)}</span>
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20me%20tornar%20um%20Advisor%20Partner." target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors text-center inline-block">
                Selecionar
              </a>
            </div>

            {/* Professional */}
            <div className="border border-amber-500/30 bg-[#0A0A0B] rounded-2xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(245,158,11,0.05)] hover:border-amber-500/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{t('plans.professional.title')}</h3>
              <div className="text-2xl font-bold text-amber-500 mb-4">{t('plans.professional.price')}</div>
              <p className="text-slate-400 text-sm mb-8 h-10">{t('plans.professional.desc')}</p>
              <ul className="space-y-4 flex-1 mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{t(`plans.professional.i${i}`)}</span>
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20me%20tornar%20um%20Advisor%20Partner." target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-center inline-block">
                Selecionar
              </a>
            </div>

            {/* Executive */}
            <div className="border border-white/10 bg-[#0A0A0B] rounded-2xl p-8 flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{t('plans.executive.title')}</h3>
              <div className="text-2xl font-bold text-amber-500 mb-4">{t('plans.executive.price')}</div>
              <p className="text-slate-400 text-sm mb-8 h-10">{t('plans.executive.desc')}</p>
              <ul className="space-y-4 flex-1 mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{t(`plans.executive.i${i}`)}</span>
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20me%20tornar%20um%20Advisor%20Partner." target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors text-center inline-block">
                Selecionar
              </a>
            </div>

            {/* Strategic */}
            <div className="border border-white/10 bg-black/60 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{t('plans.strategic.title')}</h3>
              <div className="text-2xl font-bold text-slate-300 mb-4">{t('plans.strategic.price')}</div>
              <p className="text-slate-400 text-sm mb-8">{t('plans.strategic.desc')}</p>
              <ul className="space-y-4 flex-1 mb-8">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{t('plans.strategic.i1')}</span>
                </li>
              </ul>
              <a href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20me%20tornar%20um%20Advisor%20Partner." target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 rounded-lg bg-transparent border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors text-center inline-block">
                Falar com Vendas
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Como funciona o modelo comercial */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('commercial.title')}</SectionTitle>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Illumine */}
            <Card variant="secondary" className="p-10 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cpu className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('commercial.illumine.title')}</h3>
              <p className="text-slate-400 mb-8">{t('commercial.illumine.desc')}</p>
              
              <ul className="space-y-4 relative z-10">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-slate-200 font-medium">{t(`commercial.illumine.i${i}`)}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Advisor */}
            <Card variant="secondary" className="p-10 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Briefcase className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('commercial.advisor.title')}</h3>
              <p className="text-slate-400 mb-8">{t('commercial.advisor.desc')}</p>
              
              <ul className="space-y-4 mb-8 relative z-10">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-slate-200 font-medium">{t(`commercial.advisor.i${i}`)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500/90 text-sm font-medium relative z-10">
                {t('commercial.advisor.note')}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 8 & 9. Office Integration & Client Integration */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Office Integration */}
            <div>
              <SectionTitle align="left" className="!mb-4">{t('office_integration.title')}</SectionTitle>
              <p className="text-slate-400 leading-relaxed mb-8">{t('office_integration.desc')}</p>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-sm font-medium">
                    {t(`office_integration.i${i}`)}
                  </div>
                ))}
              </div>
            </div>

            {/* Client Integration */}
            <div>
              <SectionTitle align="left" className="!mb-4">{t('client_integration.title')}</SectionTitle>
              <p className="text-slate-400 leading-relaxed mb-8">{t('client_integration.desc')}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-sm font-medium">
                    {t(`client_integration.i${i}`)}
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm text-slate-500 border-l-2 border-amber-500/30 pl-4">
                <p>{t('client_integration.note1')}</p>
                <p>{t('client_integration.note2')}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 10. Executive Development Services™ */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('dev_services.title')}</SectionTitle>
            <SectionLead align="center" className="max-w-3xl">{t('dev_services.desc')}</SectionLead>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="px-6 py-4 bg-[#050506] border border-white/10 rounded-xl text-slate-200 font-medium hover:border-amber-500/30 transition-colors">
                {t(`dev_services.i${i}`)}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 11. Executive Co-Advisory™ */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none opacity-50" />
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Users className="w-12 h-12 text-amber-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">{t('coadvisory.title')}</h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-4">{t('coadvisory.desc1')}</p>
              <p className="text-lg text-slate-400 leading-relaxed">{t('coadvisory.desc2')}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 12. Jornada de Crescimento */}
      <Section className="border-t border-white/5 bg-[#0A0A0B] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('journey.title')}</SectionTitle>
          </div>

          <div className="max-w-6xl mx-auto relative hidden md:block">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent -translate-y-1/2" />
            <div className="grid grid-cols-4 gap-4 relative z-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div key={step} className="flex flex-col items-center text-center p-4">
                  <div className="w-4 h-4 rounded-full bg-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                  <span className="text-sm font-semibold text-slate-300">{t(`journey.s${step}`)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4 md:hidden relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-amber-500/20" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div key={step} className="flex items-center gap-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-black border border-amber-500/30 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <span className="text-base font-semibold text-slate-300">{t(`journey.s${step}`)}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 13. FAQ */}
      <Section className="border-t border-white/5 bg-[#050506] py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionTitle align="center">{t('faq.title')}</SectionTitle>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <FAQItem key={i} q={t(`faq.q${i}.q`)} a={t(`faq.q${i}.a`)} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 14. CTA Final */}
      <Section className="border-t border-white/5 bg-[#050506] py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-[#050506] to-[#050506] pointer-events-none" />
        <Container className="relative z-10 flex flex-col items-center text-center">
          <ShieldCheck className="w-16 h-16 text-amber-500 mb-8" />
          <SectionTitle align="center" className="max-w-4xl">{t('cta.title')}</SectionTitle>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <a 
              href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20me%20tornar%20um%20Advisor%20Partner."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-all duration-300 text-lg"
            >
              {t('cta.primary')}
            </a>
            <a 
              href="https://wa.me/554131514537?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20apresenta%C3%A7%C3%A3o%20sobre%20o%20Advisor%20Partner."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg"
            >
              {t('cta.secondary')}
            </a>
          </div>
        </Container>
      </Section>
    </PageFrame>
  );
}
